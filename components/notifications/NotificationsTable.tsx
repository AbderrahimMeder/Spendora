'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Bell,
  BellRing,
  Check,
  Trash2,
  Archive,
  ArchiveRestore,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
} from 'lucide-react';
import type { User, Notification } from '@/types';
import { useTranslation } from 'react-i18next';

interface NotificationsTableProps {
  user?: User;
  token?: string;
  initialNotifications?: Notification[];
}

type TabType = 'ALL' | 'UNREAD' | 'READ' | 'ARCHIVED' | 'ACTIONABLE';
type SortType = 'date-desc' | 'date-asc' | 'unread-first' | 'title-asc';

const ARCHIVED_STORAGE_KEY = 'spendora_archived_notification_ids';

function getNotificationUrl(notification: Notification): string | null {
  if (notification.action_url) return notification.action_url;

  const text = notification.message || '';
  const match = text.match(
    /https?:\/\/[^\s]+|\/(?:transactions|budgets|categories|payment-method|setting|dashboard)[^\s]*/i
  );
  if (match) return match[0];

  return null;
}

function formatTimeAgo(dateString: string | undefined, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (!dateString) return t('notifications_page.time.just_now');
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return t('notifications_page.time.just_now');
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return t('notifications_page.time.minutes_ago', { count: diffInMinutes });
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return t('notifications_page.time.hours_ago', { count: diffInHours });
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return t('notifications_page.time.days_ago', { count: diffInDays });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFullDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function GetHasReadNotifications(notifications: Notification[], ids: Set<string>) {
  return notifications
    .filter((notification) => ids.has(notification.id))
    .some((notification) => notification.read_at !== null);
}

function getNotificationBadge(title: string = '', message: string = '', t: (key: string) => string) {
  const text = `${title} ${message}`.toLowerCase();
  if (text.includes('budget') || text.includes('limit') || text.includes('warning') || text.includes('exceed')) {
    return {
      Icon: AlertTriangle,
      color: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.25)',
      label: t('notifications_page.badges.budget'),
    };
  }
  if (text.includes('transaction') || text.includes('spent') || text.includes('received') || text.includes('payment') || text.includes('$')) {
    return {
      Icon: CreditCard,
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.25)',
      label: t('notifications_page.badges.finance'),
    };
  }
  if (text.includes('success') || text.includes('approved') || text.includes('completed') || text.includes('verified')) {
    return {
      Icon: CheckCircle2,
      color: '#60a5fa',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.25)',
      label: t('notifications_page.badges.system'),
    };
  }
  return {
    Icon: Bell,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
    border: 'rgba(167, 139, 250, 0.25)',
    label: t('notifications_page.badges.notification'),
  };
}

export default function NotificationsTable({
  token,
  initialNotifications,
}: NotificationsTableProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications ?? []
  );
  const [loading, setLoading] = useState<boolean>(!initialNotifications);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [archivedIds, setArchivedIds] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(ARCHIVED_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return new Set(parsed);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    return new Set();
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('date-desc');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  const [detailModal, setDetailModal] = useState<Notification | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notification | 'BULK' | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const saveArchivedIds = useCallback((newIds: Set<string>) => {
    setArchivedIds(newIds);
    try {
      localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(Array.from(newIds)));
    } catch {
      // Ignore
    }
  }, []);

  const fetchNotifications = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';
        const response = await fetch(`${apiUrl}/api/notifications`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        const items: Notification[] = result.data ?? [];
        setNotifications(items);

        const backendArchived = items
          .filter((n) => Boolean(n.archived_at))
          .map((n) => n.id);
        if (backendArchived.length > 0) {
          setArchivedIds((prev) => {
            const next = new Set(prev);
            backendArchived.forEach((id) => next.add(id));
            return next;
          });
        }
      } catch {
        toast.error(t('notifications_page.toasts.server_error'));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, t]
  );

  useEffect(() => {
    if (!initialNotifications || initialNotifications.length === 0) {
      let active = true;
      const loadInitial = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';
          const response = await fetch(`${apiUrl}/api/notifications`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const result = await response.json();
          if (active) {
            const items: Notification[] = result.data ?? [];
            setNotifications(items);
            const backendArchived = items
              .filter((n) => Boolean(n.archived_at))
              .map((n) => n.id);
            if (backendArchived.length > 0) {
              setArchivedIds((prev) => {
                const next = new Set(prev);
                backendArchived.forEach((id) => next.add(id));
                return next;
              });
            }
          }
        } catch {
          if (active) toast.error(t('notifications_page.toasts.server_error'));
        } finally {
          if (active) setLoading(false);
        }
      };
      loadInitial();
      return () => {
        active = false;
      };
    }
  }, [initialNotifications, token, t]);

  const isArchived = useCallback(
    (notification: Notification) => {
      return Boolean(notification.archived_at) || archivedIds.has(notification.id);
    },
    [archivedIds]
  );

  const counts = useMemo(() => {
    let unreadCount = 0;
    let readCount = 0;
    let archivedCount = 0;
    let actionableCount = 0;

    notifications.forEach((item) => {
      const archived = isArchived(item);
      if (archived) {
        archivedCount++;
      } else {
        if (!item.read_at) unreadCount++;
        else readCount++;

        if (getNotificationUrl(item)) actionableCount++;
      }
    });

    const activeCount = notifications.length - archivedCount;

    return {
      all: activeCount,
      total: notifications.length,
      unread: unreadCount,
      read: readCount,
      archived: archivedCount,
      actionable: actionableCount,
    };
  }, [notifications, isArchived]);

  const processedNotifications = useMemo(() => {
    return notifications
      .filter((item) => {
        const archived = isArchived(item);

        if (activeTab === 'ARCHIVED') {
          if (!archived) return false;
        } else {
          if (archived) return false;

          if (activeTab === 'UNREAD' && item.read_at) return false;
          if (activeTab === 'READ' && !item.read_at) return false;
          if (activeTab === 'ACTIONABLE' && !getNotificationUrl(item)) return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase();
          const title = (item.title || '').toLowerCase();
          const message = (item.message || '').toLowerCase();
          const url = (getNotificationUrl(item) || '').toLowerCase();
          const dateStr = formatFullDate(item.created_at).toLowerCase();

          return (
            title.includes(query) ||
            message.includes(query) ||
            url.includes(query) ||
            dateStr.includes(query)
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        }
        if (sortBy === 'unread-first') {
          if (!a.read_at && b.read_at) return -1;
          if (a.read_at && !b.read_at) return 1;
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        }
        if (sortBy === 'title-asc') {
          const titleA = a?.title || '';
          const titleB = b?.title || '';
          return titleA.localeCompare(titleB);
        }
        return 0;
      });
  }, [notifications, activeTab, isArchived, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(processedNotifications.length / itemsPerPage));
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedNotifications.slice(startIndex, startIndex + itemsPerPage);
  }, [processedNotifications, currentPage, itemsPerPage]);

  const [prevFilterKey, setPrevFilterKey] = useState({ searchQuery, activeTab, sortBy, itemsPerPage });
  if (
    prevFilterKey.searchQuery !== searchQuery ||
    prevFilterKey.activeTab !== activeTab ||
    prevFilterKey.sortBy !== sortBy ||
    prevFilterKey.itemsPerPage !== itemsPerPage
  ) {
    setPrevFilterKey({ searchQuery, activeTab, sortBy, itemsPerPage });
    setCurrentPage(1);
  }

  const allCurrentPageSelected =
    paginatedNotifications.length > 0 &&
    paginatedNotifications.every((n) => selectedIds.has(n.id));

  const toggleSelectAllPage = () => {
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedNotifications.forEach((n) => next.delete(n.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedNotifications.forEach((n) => next.add(n.id));
        return next;
      });
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleRead = async (notification: Notification) => {
    const isUnread = !notification.read_at;
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';

    const updatedTimestamp = isUnread ? new Date().toISOString() : null;
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, read_at: updatedTimestamp } : item
      )
    );

    try {
      if (isUnread) {
        await fetch(`${apiUrl}/api/notifications/${notification.id}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        toast.success(t('notifications_page.toasts.marked_read'));
      } else {
        toast.info(t('notifications_page.toasts.marked_unread'));
      }
    } catch (error) {
      console.error('Failed to update read status:', error);
      toast.error(t('notifications_page.toasts.server_error'));
    }
  };

  const handleToggleArchive = async (notification: Notification) => {
    const currentlyArchived = isArchived(notification);
    const newArchived = new Set(archivedIds);

    if (currentlyArchived) {
      newArchived.delete(notification.id);
      saveArchivedIds(newArchived);
      toast.success(t('notifications_page.toasts.restored'));
    } else {
      newArchived.add(notification.id);
      saveArchivedIds(newArchived);
      toast.success(t('notifications_page.toasts.archived'));
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';
      await fetch(`${apiUrl}/api/notifications/${notification.id}/archive`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Local persistence fallback
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';

    try {
      if (deleteTarget === 'BULK') {
        const idsToDelete = Array.from(selectedIds);
        setNotifications((prev) => prev.filter((item) => !selectedIds.has(item.id)));
        const newArchived = new Set(archivedIds);
        idsToDelete.forEach((id) => newArchived.delete(id));
        saveArchivedIds(newArchived);
        setSelectedIds(new Set());

        await Promise.allSettled(
          idsToDelete.map((id) =>
            fetch(`${apiUrl}/api/notifications/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        toast.success(t('notifications_page.toasts.deleted_bulk', { count: idsToDelete.length }));
      } else {
        const targetId = deleteTarget.id;
        setNotifications((prev) => prev.filter((item) => item.id !== targetId));
        const newArchived = new Set(archivedIds);
        newArchived.delete(targetId);
        saveArchivedIds(newArchived);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });

        const res = await fetch(`${apiUrl}/api/notifications/${targetId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        toast.success(t('notifications_page.toasts.deleted_single'));
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(t('notifications_page.toasts.server_error'));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleBulkMarkRead = async () => {
    if (selectedIds.size === 0) return;
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((item) => (selectedIds.has(item.id) ? { ...item, read_at: now } : item))
    );

    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || '';
    toast.success(t('notifications_page.toasts.bulk_read', { count: selectedIds.size }));

    await Promise.allSettled(
      Array.from(selectedIds).map((id) =>
        fetch(`${apiUrl}/api/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    if (selectedIds.size === 0) return;
    const newArchived = new Set(archivedIds);
    selectedIds.forEach((id) => newArchived.add(id));
    saveArchivedIds(newArchived);
    toast.success(t('notifications_page.toasts.bulk_archived', { count: selectedIds.size }));
    setSelectedIds(new Set());
  };

  const handleBulkRestore = () => {
    if (selectedIds.size === 0) return;
    const newArchived = new Set(archivedIds);
    selectedIds.forEach((id) => newArchived.delete(id));
    saveArchivedIds(newArchived);
    toast.success(t('notifications_page.toasts.bulk_restored', { count: selectedIds.size }));
    setSelectedIds(new Set());
  };

  const handleOpenUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!url) return;

    if (url.startsWith('/')) {
      router.push(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '1.5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <BellRing size={20} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {t('notifications_page.title')}
              </h1>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  margin: '0.15rem 0 0 0',
                }}
              >
                {t('notifications_page.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing || loading}
            className="btn-icon"
            style={{ width: '38px', height: '38px', padding: 0 }}
            title={t('notifications_page.refresh_tooltip')}
          >
            <RefreshCw
              size={16}
              className={refreshing || loading ? 'animate-spin' : ''}
              color="var(--text-secondary)"
            />
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div
        className="glass-card"
        style={{
          background: '#121212',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Toolbar Header: Tabs, Search Bar & Sort in One Clean Row */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: '#0d0d0d',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          {/* Left: Filter Tabs */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#161616',
              padding: '0.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              gap: '0.2rem',
              flexShrink: 0,
            }}
          >
            {(
              [
                { id: 'ALL', label: t('notifications_page.tabs.all'), count: counts.all },
                { id: 'UNREAD', label: t('notifications_page.tabs.unread'), count: counts.unread },
                { id: 'READ', label: t('notifications_page.tabs.read'), count: counts.read },
                { id: 'ARCHIVED', label: t('notifications_page.tabs.archived'), count: counts.archived },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? '#242424' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.05rem 0.4rem',
                      borderRadius: '999px',
                      background: isActive
                        ? 'var(--accent-primary)'
                        : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Search Bar, Sort Dropdown & Reset Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flex: '1 1 auto',
              justifyContent: 'flex-end',
              minWidth: '280px',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: '1 1 260px',
                maxWidth: '380px',
                minWidth: '180px',
              }}
            >
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  insetInlineStart: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder={t('notifications_page.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  background: '#141414',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  paddingInlineStart: '2.25rem',
                  paddingInlineEnd: '2rem',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.background = '#181818';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.2)';
                  e.currentTarget.style.background = '#141414';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    insetInlineEnd: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.15s ease',
                  }}
                  title={t('notifications_page.clear_search')}
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                flexShrink: 0,
              }}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                style={{
                  height: '36px',
                  background: '#141414',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.75rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
              >
                <option value="date-desc">{t('notifications_page.sort.newest')}</option>
                <option value="date-asc">{t('notifications_page.sort.oldest')}</option>
                <option value="unread-first">{t('notifications_page.sort.unread_first')}</option>
                <option value="title-asc">{t('notifications_page.sort.title_asc')}</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {(searchQuery || activeTab !== 'ALL' || sortBy !== 'date-desc') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('ALL');
                  setSortBy('date-desc');
                }}
                style={{
                  height: '36px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  padding: '0 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                title={t('notifications_page.reset_tooltip')}
              >
                <X size={12} />
                <span>{t('notifications_page.reset')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedIds.size > 0 && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(40, 140, 10, 0.02)',
              borderBottom: '1px solid rgba(16, 180, 129, 0.25)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                {selectedIds.size === 1
                  ? t('notifications_page.bulk.selected_single', { count: selectedIds.size })
                  : t('notifications_page.bulk.selected_plural', { count: selectedIds.size })}
              </span>
            </div>

            {/* Bulk Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {!GetHasReadNotifications(notifications, selectedIds) && (
                <button
                  onClick={handleBulkMarkRead}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Check size={13} color="var(--accent-primary)" />
                  <span>{t('notifications_page.bulk.mark_read')}</span>
                </button>
              )}

              {activeTab === 'ARCHIVED' ? (
                <button
                  onClick={handleBulkRestore}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <ArchiveRestore size={13} color="#f59e0b" />
                  <span>{t('notifications_page.bulk.restore')}</span>
                </button>
              ) : (
                <button
                  onClick={handleBulkArchive}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Archive size={13} color="#f59e0b" />
                  <span>{t('notifications_page.bulk.archive')}</span>
                </button>
              )}

              <button
                onClick={() => setDeleteTarget('BULK')}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <Trash2 size={13} />
                <span>{t('notifications_page.bulk.delete')}</span>
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  padding: '0.35rem 0.65rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  gap: '0.3rem',
                }}
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'start',
              fontSize: '0.8rem',
            }}
          >
            {/* Table Header */}
            <thead>
              <tr
                style={{
                  background: '#0a0a0a',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <th style={{ width: '40px', padding: '0.85rem 1rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAllPage}
                    style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                    title={t('notifications_page.headers.select_all')}
                  />
                </th>
                <th style={{ width: '150px', padding: '0.85rem 1rem' }}>{t('notifications_page.headers.type')}</th>
                <th style={{ padding: '0.85rem 1rem' }}>{t('notifications_page.headers.notification')}</th>
                <th style={{ width: '150px', padding: '0.85rem 1rem' }}>{t('notifications_page.headers.time')}</th>
                <th style={{ width: '130px', padding: '0.85rem 1rem' }}>{t('notifications_page.headers.action_link')}</th>
                <th style={{ width: '150px', padding: '0.85rem 1rem', textAlign: 'center' }}>
                  {t('notifications_page.headers.actions')}
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: idx % 2 === 0 ? '#121212' : '#0e0e0e',
                    }}
                  >
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          background: '#222',
                          margin: '0 auto',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div
                        style={{
                          width: '70px',
                          height: '18px',
                          borderRadius: '12px',
                          background: '#222',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div
                        style={{
                          width: '45%',
                          height: '14px',
                          borderRadius: '4px',
                          background: '#262626',
                          marginBottom: '6px',
                        }}
                      />
                      <div
                        style={{
                          width: '80%',
                          height: '11px',
                          borderRadius: '4px',
                          background: '#1c1c1c',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div
                        style={{
                          width: '80px',
                          height: '12px',
                          borderRadius: '4px',
                          background: '#222',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div
                        style={{
                          width: '65px',
                          height: '20px',
                          borderRadius: '4px',
                          background: '#222',
                        }}
                      />
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div
                        style={{
                          width: '80px',
                          height: '24px',
                          borderRadius: '6px',
                          background: '#222',
                          margin: '0 auto',
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : paginatedNotifications.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        margin: '0 auto 1.25rem',
                      }}
                    >
                      <Bell size={26} />
                    </div>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: '0 0 0.35rem',
                      }}
                    >
                      {t('notifications_page.empty.title')}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '420px',
                        margin: '0 auto 1.5rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {searchQuery
                        ? t('notifications_page.empty.search', { query: searchQuery })
                        : activeTab === 'ARCHIVED'
                        ? t('notifications_page.empty.archived')
                        : activeTab === 'UNREAD'
                        ? t('notifications_page.empty.unread')
                        : activeTab === 'ACTIONABLE'
                        ? t('notifications_page.empty.actionable')
                        : t('notifications_page.empty.default')}
                    </p>
                    {(searchQuery || activeTab !== 'ALL') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setActiveTab('ALL');
                        }}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                      >
                        {t('notifications_page.empty.view_all')}
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedNotifications.map((notification) => {
                  const isSelected = selectedIds.has(notification.id);
                  const isRead = Boolean(notification.read_at);
                  const archived = isArchived(notification);
                  const title = notification.title || t('notifications_page.badges.notification');
                  const message = notification.message ?? '';
                  const url = getNotificationUrl(notification);
                  const badge = getNotificationBadge(title, message, t);
                  const BadgeIcon = badge.Icon;

                  return (
                    <tr
                      key={notification.id}
                      onClick={() => setDetailModal(notification)}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected
                          ? 'rgba(16, 185, 129, 0.05)'
                          : isRead
                          ? '#101010'
                          : '#141a15',
                        borderInlineStart: isRead
                          ? '3px solid transparent'
                          : '3px solid var(--accent-primary)',
                        transition: 'background 0.15s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isSelected
                          ? 'rgba(16, 185, 129, 0.09)'
                          : isRead
                          ? '#181818'
                          : '#19241b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isSelected
                          ? 'rgba(16, 185, 129, 0.05)'
                          : isRead
                          ? '#101010'
                          : '#141a15';
                      }}
                    >
                      {/* Checkbox Column */}
                      <td
                        style={{ padding: '1rem', textAlign: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(notification.id)}
                          style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                        />
                      </td>

                      {/* Type Badge Column */}
                      <td style={{ padding: '1rem' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.55rem',
                            borderRadius: '999px',
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            color: badge.color,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                          }}
                        >
                          <BadgeIcon size={11} />
                          <span>{badge.label}</span>
                        </div>
                      </td>

                      {/* Notification Content Column */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: isRead ? 500 : 700,
                                color: isRead ? '#e5e7eb' : '#ffffff',
                                fontSize: '0.825rem',
                              }}
                            >
                              {title}
                            </span>

                            {!isRead && !archived && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: 'var(--accent-primary)',
                                  boxShadow: '0 0 8px var(--accent-primary)',
                                }}
                                title={t('notifications_page.badges.unread')}
                              />
                            )}

                            {archived && (
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '4px',
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  color: '#fbbf24',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                }}
                              >
                                {t('notifications_page.badges.archived')}
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.75rem',
                              margin: 0,
                              lineHeight: 1.45,
                              maxWidth: '650px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message}
                          </p>
                        </div>
                      </td>

                      {/* Time Column */}
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            style={{
                              color: '#ffffff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Clock size={11} color="var(--text-muted)" />
                            {formatTimeAgo(notification.created_at, t)}
                          </span>
                          <span
                            style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.68rem',
                              marginTop: '0.1rem',
                            }}
                          >
                            {formatFullDate(notification.created_at)}
                          </span>
                        </div>
                      </td>

                      {/* Action Link Column */}
                      <td
                        style={{ padding: '1rem' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {url ? (
                          <button
                            type="button"
                            onClick={(e) => handleOpenUrl(url, e)}
                            title={`Navigate to: ${url}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.3rem 0.65rem',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(167, 139, 250, 0.12)',
                              border: '1px solid rgba(167, 139, 250, 0.3)',
                              color: '#c4b5fd',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <span>{t('notifications_page.actions.open_link')}</span>
                            <ArrowUpRight size={12} />
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                            —
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td
                        style={{ padding: '1rem', textAlign: 'center' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {notification.read_at === null && (
                            <button
                              type="button"
                              onClick={() => handleToggleRead(notification)}
                              className="btn-icon"
                              style={{
                                width: '30px',
                                height: '30px',
                                padding: 0,
                                color: isRead ? 'var(--text-muted)' : 'var(--accent-primary)',
                                background: isRead ? 'transparent' : 'rgba(16, 185, 129, 0.12)',
                                border: isRead
                                  ? '1px solid var(--border-subtle)'
                                  : '1px solid rgba(16, 185, 129, 0.3)',
                              }}
                              title={isRead ? t('notifications_page.actions.mark_as_unread') : t('notifications_page.actions.mark_as_read')}
                            >
                              <Check size={14} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleArchive(notification)}
                            className="btn-icon"
                            style={{
                              width: '30px',
                              height: '30px',
                              padding: 0,
                              color: archived ? '#fbbf24' : 'var(--text-secondary)',
                            }}
                            title={archived ? t('notifications_page.actions.restore') : t('notifications_page.actions.archive')}
                          >
                            {archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(notification)}
                            className="btn-icon"
                            style={{
                              width: '30px',
                              height: '30px',
                              padding: 0,
                              color: '#fb7185',
                            }}
                            title={t('notifications_page.actions.delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        {processedNotifications.length > 0 && (
          <div
            style={{
              padding: '0.9rem 1.25rem',
              background: '#0d0d0d',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div>
              {t('notifications_page.pagination.showing')}{' '}
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              {t('notifications_page.pagination.to')}{' '}
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {Math.min(currentPage * itemsPerPage, processedNotifications.length)}
              </span>{' '}
              {t('notifications_page.pagination.of')}{' '}
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {processedNotifications.length}
              </span>{' '}
              {t('notifications_page.pagination.notifications')}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {t('notifications_page.pagination.per_page')}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  style={{
                    background: '#171717',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '0.25rem 0.5rem',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Prev / Page numbers / Next */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{
                    padding: '0.3rem 0.55rem',
                    borderRadius: '4px',
                    background: '#171717',
                    border: '1px solid var(--border-subtle)',
                    color: currentPage <= 1 ? 'var(--text-muted)' : '#ffffff',
                    cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={t('notifications_page.pagination.prev')}
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - currentPage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prevP = arr[idx - 1];
                    const showEllipsis = prevP && p - prevP > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span style={{ color: 'var(--text-muted)', padding: '0 0.2rem' }}>
                            ...
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(p)}
                          style={{
                            minWidth: '26px',
                            height: '26px',
                            padding: '0 0.35rem',
                            borderRadius: '4px',
                            background:
                              currentPage === p ? 'var(--accent-primary)' : '#171717',
                            border:
                              currentPage === p
                                ? '1px solid var(--accent-primary)'
                                : '1px solid var(--border-subtle)',
                            color: currentPage === p ? '#000000' : 'var(--text-secondary)',
                            fontWeight: currentPage === p ? 700 : 500,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    padding: '0.3rem 0.55rem',
                    borderRadius: '4px',
                    background: '#171717',
                    border: '1px solid var(--border-subtle)',
                    color: currentPage >= totalPages ? 'var(--text-muted)' : '#ffffff',
                    cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title={t('notifications_page.pagination.next')}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div
          onClick={() => setDetailModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#141414',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {t('notifications_page.detail_modal.details_label')}
                </span>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: '0.2rem 0 0 0',
                  }}
                >
                  {detailModal.title || t('notifications_page.badges.notification')}
                </h3>
              </div>

              <button
                onClick={() => setDetailModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Box */}
            <div
              style={{
                background: '#1a1a1a',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '1rem',
                fontSize: '0.85rem',
                color: '#e5e7eb',
                lineHeight: 1.55,
                maxHeight: '250px',
                overflowY: 'auto',
              }}
            >
              {detailModal?.message ?? t('notifications_page.detail_modal.no_message')}
            </div>

            {/* Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                  {t('notifications_page.detail_modal.date_received')}
                </span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>
                  {formatFullDate(detailModal.created_at)}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                  {t('notifications_page.detail_modal.read_status')}
                </span>
                <span
                  style={{
                    color: detailModal.read_at ? '#34d399' : '#fbbf24',
                    fontWeight: 600,
                  }}
                >
                  {detailModal.read_at
                    ? t('notifications_page.detail_modal.read')
                    : t('notifications_page.detail_modal.unread')}
                </span>
              </div>
            </div>

            {/* URL Direct Access Action if present */}
            {getNotificationUrl(detailModal) && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: '#c4b5fd',
                      display: 'block',
                      fontWeight: 700,
                    }}
                  >
                    {t('notifications_page.detail_modal.attached_action')}
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: '#ffffff',
                      textDecoration: 'underline',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                  >
                    {getNotificationUrl(detailModal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenUrl(getNotificationUrl(detailModal)!)}
                  className="btn btn-primary"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    flexShrink: 0,
                  }}
                >
                  <span>{t('notifications_page.detail_modal.visit_link')}</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            )}

            {/* Modal Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  handleToggleArchive(detailModal);
                  setDetailModal(null);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
              >
                {isArchived(detailModal)
                  ? t('notifications_page.detail_modal.restore_archive')
                  : t('notifications_page.detail_modal.archive')}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleToggleRead(detailModal);
                  setDetailModal(null);
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
              >
                {detailModal.read_at
                  ? t('notifications_page.detail_modal.mark_unread')
                  : t('notifications_page.detail_modal.mark_read')}
              </button>

              <button
                type="button"
                onClick={() => {
                  const target = detailModal;
                  setDetailModal(null);
                  setDeleteTarget(target);
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('notifications_page.detail_modal.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          onClick={() => !isDeleting && setDeleteTarget(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#141414',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171',
                  flexShrink: 0,
                }}
              >
                <Trash2 size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1rem', fontWeight: 700 }}>
                  {t('notifications_page.delete_modal.title')}
                </h4>
                <p style={{ margin: '0.15rem 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {deleteTarget === 'BULK'
                    ? t('notifications_page.delete_modal.msg_bulk', { count: selectedIds.size })
                    : t('notifications_page.delete_modal.msg_single')}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              {t('notifications_page.delete_modal.warning')}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                marginTop: '0.5rem',
              }}
            >
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem' }}
              >
                {t('notifications_page.delete_modal.cancel')}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={executeDelete}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#ef4444',
                  border: '1px solid #dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {isDeleting && <RefreshCw size={12} className="animate-spin" />}
                <span>
                  {isDeleting
                    ? t('notifications_page.delete_modal.deleting')
                    : t('notifications_page.delete_modal.delete_btn')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
