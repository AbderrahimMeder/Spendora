'use client';

import React, { useState, useMemo,useEffect } from 'react';
import {
  Search,
  Plus,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  DollarSign,
  Smartphone,
  Globe,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronLeft,
  Download,
  X,
  SlidersHorizontal,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Copy,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { payment_methods } from '@/types';
import { toast } from 'sonner';
import { LoadingTransaction } from '@/components/ui/loading';

type TablePaymentMethodProps = {
  token?: string | null;
  fetchAgain?: boolean;
  onDelete?: (id: string) => Promise<void> | void;
  onEdit?: (id: string) => void;
};

export function TablePaymentMethod({
  token,
  fetchAgain = false,
  onDelete,
  onEdit,
}: TablePaymentMethodProps) {
  const router = useRouter();
  // transactions 
  const [paymentMethods,setpayment_methods] = useState<payment_methods[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState<boolean>(false);
  // Filter & Search States
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Action & Modal States
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper for Payment Icons
  const getPaymentIcon = (name?: string, type?: string) => {
    const combined = `${name || ''} ${type || ''}`.toLowerCase();
    if (combined.includes('bank') || combined.includes('wire') || combined.includes('ach') || combined.includes('transfer') || combined.includes('iban')) {
      return Building2;
    }
    if (combined.includes('paypal') || combined.includes('wallet') || combined.includes('stripe') || combined.includes('cashapp')) {
      return Wallet;
    }
    if (combined.includes('crypto') || combined.includes('btc') || combined.includes('eth') || combined.includes('usdt') || combined.includes('coin') || combined.includes('binance')) {
      return Coins;
    }
    if (combined.includes('cash') || combined.includes('dollar') || combined.includes('money')) {
      return DollarSign;
    }
    if (combined.includes('mobile') || combined.includes('apple') || combined.includes('google') || combined.includes('phone') || combined.includes('pay')) {
      return Smartphone;
    }
    if (combined.includes('online') || combined.includes('web') || combined.includes('gateway')) {
      return Globe;
    }
    return CreditCard;
  };
    useEffect(() => {
    const fetchPaymentMethods = async () => {
        try {
            setLoadingPaymentMethods(true);
            const response = await fetch(`http://localhost:8000/api/payment-methods`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (data?.status === 200 || response.ok) {
                setpayment_methods(data.payment_methods);
            } else {
                toast.error(data?.message || 'Failed to fetch payment methods');
            }
        } catch (error:any) {
            toast.error(error.message || 'Failed to fetch payment methods');
        } finally {
            setLoadingPaymentMethods(false);
        }
    };
    fetchPaymentMethods();
    }, [token]);
  // Types list for filter dropdown
  const uniqueTypes = useMemo(() => {
    return [
      'ALL',
      ...new Set(
        (paymentMethods ?? [])
          .map((item) => item.type ?? '')
          .filter(Boolean)
      ),
    ];
  }, [paymentMethods]);

  // Handle Delete
  const handleDelete = async (id: string) => {
    try {
      setLoadingDelete(true);
      if (onDelete) {
        await onDelete(id);
      } else {
        const apiUrl = process.env.LARAVEL_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/payment-methods/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();

        if (data?.status === 200 || res.ok) {
          toast.success('Payment method deleted successfully!');
        } else {
          toast.error(data?.message || 'Failed to delete payment method');
        }
      }
      setDeleteTargetId(null);
      setActionId(null);
    } catch (error:any) {
      toast.error(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  // Handle Edit Navigation
  const handleEdit = (id: string) => {
    if (onEdit) {
      onEdit(id);
    } else {
      router.push(`/payment-method/${id}/edit`);
    }
  };

  // Copy ID to clipboard
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Payment method ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter and Sort Payment Methods
  const processedPaymentMethods = useMemo(() => {
    return (paymentMethods ?? [])
      .filter((item) => {
        // Status filter (Active / Inactive)
        const matchesStatus =
          filterStatus === 'ALL' ||
          (filterStatus === 'ACTIVE' && item.is_active) ||
          (filterStatus === 'INACTIVE' && !item.is_active);

        // Type filter
        const matchesType =
          selectedType === 'ALL' ||
          (item.type || '').toLowerCase() === selectedType.toLowerCase();

        // Search query filter
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          (item.name || '').toLowerCase().includes(query) ||
          (item.type || '').toLowerCase().includes(query) ||
          (item.id || '').toLowerCase().includes(query) ||
          (item.is_active ? 'active' : 'inactive').includes(query);

        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'name-desc') {
          return (b.name || '').localeCompare(a.name || '');
        }
        if (sortBy === 'type-asc') {
          return (a.type || '').localeCompare(b.type || '');
        }
        if (sortBy === 'type-desc') {
          return (b.type || '').localeCompare(a.type || '');
        }
        if (sortBy === 'status-active') {
          return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0);
        }
        if (sortBy === 'status-inactive') {
          return (a.is_active ? 1 : 0) - (b.is_active ? 1 : 0);
        }
        return 0;
      });
  }, [paymentMethods, filterStatus, selectedType, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedPaymentMethods.length / itemsPerPage));
  const paginatedPaymentMethods = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedPaymentMethods.slice(start, start + itemsPerPage);
  }, [processedPaymentMethods, currentPage, itemsPerPage]);

  const hasActiveFilters =
    filterStatus !== 'ALL' ||
    selectedType !== 'ALL' ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setFilterStatus('ALL');
    setSelectedType('ALL');
    setSearchQuery('');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (processedPaymentMethods.length === 0) {
      toast.error('No payment methods available to export');
      return;
    }
    const headers = ['ID', 'Name', 'Type', 'Status'];
    const rows = processedPaymentMethods.map((pm) => [
      pm.id,
      `"${(pm.name || '').replace(/"/g, '""')}"`,
      `"${(pm.type || '').replace(/"/g, '""')}"`,
      pm.is_active ? 'Active' : 'Inactive',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Finora_Payment_Methods_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Payment methods CSV exported successfully!');
  };
if(loadingPaymentMethods){
    return <LoadingTransaction hight={150} />
  }
  return (
    <>      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Payment Methods
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: '700',
                }}
              >
                {paymentMethods?.length} Records
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
             Manage all your enabled payment methods and their configurations.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/transactions/new"
              className="btn btn-primary"
              style={{
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                boxShadow: 'var(--accent-glow)',
              }}
            >
              <Plus size={16} />
              <span>Create Payment Method</span>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search & Filter Toolbar */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem 1.5rem',
            background: '#121212',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Row 1: Status Tabs & Export */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            {/* Status Toggle Tabs */}
            <div
              style={{
                display: 'flex',
                background: '#090909',
                padding: '0.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { id: 'ALL', label: 'All Records', count: paymentMethods?.length },
                {
                  id: 'ACTIVE',
                  label: 'Active',
                  count: paymentMethods?.filter((p) => p.is_active).length,
                },
                {
                  id: 'INACTIVE',
                  label: 'Inactive',
                  count: paymentMethods?.filter((p) => !p.is_active).length,
                },
              ].map((tab) => {
                const active = filterStatus === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFilterStatus(tab.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      background: active ? 'var(--accent-primary)' : 'transparent',
                      color: active ? '#000000' : 'var(--text-secondary)',
                      fontWeight: active ? '700' : '500',
                      fontSize: '0.8rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '0.675rem',
                        padding: '1px 5px',
                        borderRadius: '10px',
                        background: active ? 'rgba(0,0,0,0.2)' : '#181818',
                        color: active ? '#000000' : 'var(--text-muted)',
                        fontWeight: '700',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Export Action */}
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem 0.85rem',
                gap: '0.4rem',
              }}
              title="Download CSV Statement"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Row 2: Secondary Dropdown Filters & Search Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
              }}
            >
              <SlidersHorizontal size={13} />
              <span>Filters:</span>
            </div>

            {/* Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: '#0e0e0e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                color: selectedType !== 'ALL' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.775rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Types</option>
              {uniqueTypes
                .filter((t) => t !== 'ALL')
                .map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
            </select>

            {/* Search Bar */}
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
              <Search
                size={15}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder="Search by name, type, ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  background: '#090909',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 2rem 0.55rem 2.4rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: '#0e0e0e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.775rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="type-asc">Type (A-Z)</option>
                <option value="type-desc">Type (Z-A)</option>
                <option value="status-active">Active First</option>
                <option value="status-inactive">Inactive First</option>
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Payment Methods List / Table */}
        {fetchAgain ? (
          <LoadingTransaction hight={50} />
        ) : (
          <div
            className="glass-card"
            style={{
              background: '#121212',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 2.2fr) 1.5fr 1.2fr 1.5fr 100px',
                padding: '0.85rem 1.25rem',
                background: '#0a0a0a',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
                alignItems: 'center',
              }}
              className="pm-table-header"
            >
              <div>Payment Method</div>
              <div>Type</div>
              <div>Status</div>
              <div>Identifier / ID</div>
              <div style={{ textAlign: 'center' }}>Actions</div>
            </div>

            {/* Table Body */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {paginatedPaymentMethods.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 1.5rem',
                    background: '#0d0d0d',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#161616',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <CreditCard size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.4rem' }}>
                    No Payment Methods Found
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      maxWidth: '380px',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    {hasActiveFilters
                      ? 'No payment method matches your active filters or search query.'
                      : 'Add your payment methods to start managing accounts and tracking transactions.'}
                  </p>

                  {hasActiveFilters ? (
                    <button
                      onClick={handleResetFilters}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.825rem', padding: '0.5rem 1.25rem' }}
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <Link
                      href="/payment-method/new"
                      className="btn btn-primary"
                      style={{ fontSize: '0.825rem', padding: '0.5rem 1.25rem', gap: '0.4rem' }}
                    >
                      <Plus size={15} />
                      <span>Create Payment Method</span>
                    </Link>
                  )}
                </div>
              ) : (
                paginatedPaymentMethods.map((pm, idx) => {
                  const MethodIcon = getPaymentIcon(pm.name, pm.type);
                  const isRowActionOpen = actionId === pm.id;

                  return (
                    <div
                      key={pm.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(220px, 2.2fr) 1.5fr 1.2fr 1.5fr 100px',
                        padding: '0.95rem 1.25rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: '#0e0e0e',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      className="pm-table-row"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#151515';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0e0e0e';
                      }}
                    >
                      {/* Column 1: Icon, Method Name & Label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: pm.is_active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${pm.is_active ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                            color: pm.is_active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <MethodIcon size={18} />
                        </div>

                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <span>{pm.name?.replace(/_/g, ' ') || 'Unnamed Method'}</span>
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '2px',
                            }}
                          >
                            {pm.type || 'Standard Gateway'}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Type Badge */}
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: '#161616',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.775rem',
                            fontWeight: '600',
                          }}
                        >
                          <MethodIcon size={12} color="var(--text-muted)" />
                          <span>{pm.type || 'Generic'}</span>
                        </span>
                      </div>

                      {/* Column 3: Status Badge */}
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            background: pm.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            border: `1px solid ${pm.is_active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            color: pm.is_active ? '#10b981' : '#f87171',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: pm.is_active ? '#10b981' : '#f87171',
                              boxShadow: pm.is_active ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none',
                            }}
                          />
                          <span>{pm.is_active ? 'Active' : 'Inactive'}</span>
                        </span>
                      </div>

                      {/* Column 4: ID Pill */}
                      <div>
                        <button
                          onClick={(e) => handleCopyId(pm.id, e)}
                          title="Click to copy ID"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: '#111111',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            padding: '0.2rem 0.55rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--text-secondary)';
                            e.currentTarget.style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-subtle)';
                            e.currentTarget.style.color = 'var(--text-muted)';
                          }}
                        >
                          <span>{pm.id ? `${pm.id.slice(0, 10)}${pm.id.length > 10 ? '...' : ''}` : 'N/A'}</span>
                          {copiedId === pm.id ? (
                            <Check size={11} color="#10b981" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>

                      {/* Column 5: Action Menu */}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setActionId(isRowActionOpen ? null : pm.id);
                          }}
                          className="btn-icon"
                          style={{
                            padding: '0.4rem',
                            borderRadius: '6px',
                            background: '#141414',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                          title="Actions"
                        >
                          <ChevronRight size={14} />
                        </button>

                        {isRowActionOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              right: 0,
                              minWidth: '120px',
                              background: '#141414',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '0.35rem',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                              zIndex: 100,
                            }}
                          >
                            <button
                              onClick={() => {
                                handleEdit(pm.id);
                                setActionId(null);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.55rem 0.75rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#202020')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                setDeleteTargetId(pm.id);
                                setActionId(null);
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.55rem 0.75rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#f87171',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.8rem',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <Trash2 size={13} color="#f87171" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Pagination */}
            {processedPaymentMethods.length > 0 && (
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  background: '#0a0a0a',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div>
                  Showing{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {Math.min(currentPage * itemsPerPage, processedPaymentMethods.length)}
                  </span>{' '}
                  of{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {processedPaymentMethods.length}
                  </span>{' '}
                  entries
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Items Per Page */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per page:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{
                        background: '#121212',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '0.2rem 0.4rem',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Prev / Next Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: '4px',
                        background: '#141414',
                        border: '1px solid var(--border-subtle)',
                        color: currentPage <= 1 ? 'var(--text-muted)' : '#ffffff',
                        cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <span style={{ fontSize: '0.75rem', padding: '0 0.4rem' }}>
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: '4px',
                        background: '#141414',
                        border: '1px solid var(--border-subtle)',
                        color: currentPage >= totalPages ? 'var(--text-muted)' : '#ffffff',
                        cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setDeleteTargetId(null)}
          >
            <div
              style={{
                background: '#141414',
                border: '1px solid var(--border-subtle)',
                padding: '1.75rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
                maxWidth: '420px',
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                    Delete Payment Method
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem', lineHeight: '1.4' }}>
                Are you sure you want to delete this payment method from your system?
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setDeleteTargetId(null)}
                  disabled={loadingDelete}
                  className="btn btn-secondary"
                  style={{
                    fontSize: '0.825rem',
                    padding: '0.5rem 1rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTargetId && handleDelete(deleteTargetId)}
                  disabled={loadingDelete}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: '#ffffff',
                    fontSize: '0.825rem',
                    fontWeight: '600',
                    cursor: loadingDelete ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {loadingDelete && <RefreshCw size={13} className="animate-spin" />}
                  <span>{loadingDelete ? 'Deleting...' : 'Confirm Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Responsive Table Styles */}
        <style>{`
          @media (max-width: 860px) {
            .pm-table-header {
              display: none !important;
            }
            .pm-table-row {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
              padding: 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
