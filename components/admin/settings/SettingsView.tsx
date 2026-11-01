'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  Shield,
  Bell,
  DollarSign,
  Palette,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertTriangle,
  Download,
  Camera,
  RefreshCw,
  ChevronRight,
  Save,
  FileSpreadsheet,
  FileJson,
  ShieldCheck,
  X,
  Copy,
  Layers,
} from 'lucide-react';
import type { User } from '@/types';
import SettingProfiles from './SettingProfiles';
import { SettingFaince } from './SettingFainance';
import { SettingSecurety } from './SettingSecurety';
import { ToggleSwitch } from '@/components/ui/toggle';

interface SettingsViewProps {
  user: User;
  token?: string | null;
}

type TabType = 'profile' | 'financial' | 'security' | 'notifications' | 'appearance' | 'data';

const THEME_OPTIONS = [
  {
    id: 'midnight',
    key: 'midnight',
    bg: '#080808',
    card: '#141414',
    accent: '#10b981',
  },
  {
    id: 'cyber-emerald',
    key: 'cyber_emerald',
    bg: '#05130d',
    card: '#0a1f16',
    accent: '#00f59b',
  },
  {
    id: 'deep-obsidian',
    key: 'deep_obsidian',
    bg: '#0c0f17',
    card: '#131826',
    accent: '#3b82f6',
  },
  {
    id: 'purple-aura',
    key: 'purple_aura',
    bg: '#0f0a1a',
    card: '#19112a',
    accent: '#a855f7',
  },
];

export function SettingsView({ user, token }: SettingsViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Profile image
  const [imageprofile, setimageprofile] = useState(user?.avatar || '');

  // Notifications Settings States
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState(80);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [largeTxAlert, setLargeTxAlert] = useState(true);
  const [largeTxAmount, setLargeTxAmount] = useState('500');
  const [billReminders, setBillReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Appearance & Privacy States
  const [selectedTheme, setSelectedTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('finora_theme') || 'midnight';
      } catch {
        return 'midnight';
      }
    }
    return 'midnight';
  });
  const [compactMode, setCompactMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('finora_compact') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [privacyBlurMode, setPrivacyBlurMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('finora_privacy_mode') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  // Modal States
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // 2FA modal states
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const markUnsaved = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const changeProfileImage = (image: string) => {
    setimageprofile(image);
  };

  // Save Settings Handler
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('finora_theme', selectedTheme);
      localStorage.setItem('finora_privacy_mode', String(privacyBlurMode));
      localStorage.setItem('finora_compact', String(compactMode));

      await new Promise((resolve) => setTimeout(resolve, 600));

      setHasUnsavedChanges(false);
      toast.success(t('settings_page.header.success_save'));
    } catch {
      toast.error(t('settings_page.header.error_save'));
    } finally {
      setIsSaving(false);
    }
  };

  // Export Data Handler
  const handleExportData = (format: 'json' | 'csv') => {
    const sampleData = {
      user: {
        id: user?.id || 1,
        name: user.name,
        email: user.email,
        currency: user.currency,
        exportedAt: new Date().toISOString(),
      },
      transactions: [
        { id: 'tx-101', title: 'Stripe Payout - SaaS', amount: 4850.0, type: 'INCOME', category: 'Salary', date: '2026-10-15' },
        { id: 'tx-102', title: 'AWS Cloud Hosting', amount: 142.5, type: 'EXPENSE', category: 'Utilities', date: '2026-10-14' },
        { id: 'tx-103', title: 'Whole Foods Market', amount: 89.2, type: 'EXPENSE', category: 'Food & Groceries', date: '2026-10-12' },
        { id: 'tx-104', title: 'Freelance Design Retainer', amount: 1200.0, type: 'INCOME', category: 'Work & Salary', date: '2026-10-10' },
      ],
      settings: {
        currency: user?.currency || 'USD',
        budgetAlertThreshold: `${budgetThreshold}%`,
        privacyMode: privacyBlurMode,
      },
    };

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const jsonStr = JSON.stringify(sampleData, null, 2);
      blob = new Blob([jsonStr], { type: 'application/json' });
      filename = `finora-export-${new Date().toISOString().slice(0, 10)}.json`;
    } else {
      const headers = 'ID,Title,Amount,Type,Category,Date\n';
      const rows = sampleData.transactions
        .map((tx) => `${tx.id},"${tx.title}",${tx.amount},${tx.type},${tx.category},${tx.date}`)
        .join('\n');
      blob = new Blob([headers + rows], { type: 'text/csv' });
      filename = `finora-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(t('settings_page.data.export_toast', { filename }));
  };

  return (
    <div style={{ paddingBottom: '3.5rem' }}>
      {/* Top Header & Save Actions Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              {t('settings_page.breadcrumbs.admin')}
            </span>
            <ChevronRight size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>
              {t('settings_page.breadcrumbs.settings')}
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {t('settings_page.header.title')}
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            {t('settings_page.header.subtitle')}
          </p>
        </div>

        {/* Save Bar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {hasUnsavedChanges ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#f59e0b',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              {t('settings_page.header.unsaved_changes')}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              <CheckCircle2 size={13} />
              {t('settings_page.header.up_to_date')}
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000000',
              fontSize: '0.85rem',
              fontWeight: '700',
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.2s ease',
              opacity: isSaving ? 0.7 : 1,
            }}
            className="hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
                <span>{t('settings_page.header.saving')}</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>{t('settings_page.header.save_all')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Overview Card (Hero Banner) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #111111 0%, #151515 50%, #0d1a14 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginBottom: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            insetInlineEnd: '-50px',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Avatar with edit button */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  fontWeight: '800',
                  fontSize: '1.75rem',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                  overflow: 'hidden',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {imageprofile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageprofile} alt={user?.name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                title={t('settings_page.hero.change_avatar')}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  insetInlineEnd: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  border: '2px solid #141414',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }}
                className="hover:scale-110 transition-transform"
              >
                <Camera size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* Profile info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {user?.name || 'Account User'}
                </h2>
                <span
                  style={{
                    background: `${user?.email_verified_at === null ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                    color: user?.email_verified_at === null ? '#60a5fa' : 'var(--accent-primary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.675rem',
                    fontWeight: '700',
                    border: `1px solid ${user?.email_verified_at === null ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={11} color={user?.email_verified_at === null ? 'var(--text-muted)' : 'var(--accent-primary)'} />
                  {user?.email_verified_at === null ? t('settings_page.hero.unverified') : t('settings_page.hero.verified')}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.5rem 0' }}>
                {user?.email || 'user@spendora.app'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>🌍 {user?.country}</span>
                <span>•</span>
                <span>
                  💰 {t('settings_page.hero.default_currency')}{' '}
                  <strong style={{ color: '#ffffff' }}>{user?.currency || 'USD'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: '#1c1c1c',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.775rem',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
              className="hover:border-zinc-500 transition-colors"
            >
              <Palette size={13} />
              {t('settings_page.hero.customize_ui')}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Header */}
      <div
        style={{
          display: 'flex',
          gap: '0.4rem',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'profile', label: t('settings_page.tabs.profile'), icon: UserIcon },
          { id: 'financial', label: t('settings_page.tabs.financial'), icon: DollarSign },
          { id: 'security', label: t('settings_page.tabs.security'), icon: Shield },
          { id: 'notifications', label: t('settings_page.tabs.notifications'), icon: Bell },
          { id: 'appearance', label: t('settings_page.tabs.appearance'), icon: Palette },
          { id: 'data', label: t('settings_page.tabs.data'), icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.75rem 1.1rem',
                fontSize: '0.85rem',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              className="hover:text-white"
            >
              <Icon size={16} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <SettingProfiles user={user} token={token} />
      )}

      {/* TAB CONTENT: FINANCIAL & CURRENCY */}
      {activeTab === 'financial' && (
        <SettingFaince user={user} token={token} />
      )}

      {/* TAB CONTENT: SECURITY & ACCESS */}
      {activeTab === 'security' && (
        <SettingSecurety user={user} token={token} />
      )}

      {/* TAB CONTENT: NOTIFICATIONS & ALERTS */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Bell size={17} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  {t('settings_page.notifications_tab.title')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {t('settings_page.notifications_tab.subtitle')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <ToggleSwitch
                label={t('settings_page.notifications_tab.budget_alert')}
                description={t('settings_page.notifications_tab.budget_alert_desc', { threshold: budgetThreshold })}
                checked={budgetAlerts}
                onChange={(val) => {
                  setBudgetAlerts(val);
                  markUnsaved();
                }}
              />

              {budgetAlerts && (
                <div style={{ padding: '1rem', background: '#161616', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{t('settings_page.notifications_tab.trigger_threshold')}</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>{budgetThreshold}%</strong>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={budgetThreshold}
                    onChange={(e) => {
                      setBudgetThreshold(Number(e.target.value));
                      markUnsaved();
                    }}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    <span>{t('settings_page.notifications_tab.threshold_labels.cautious')}</span>
                    <span>{t('settings_page.notifications_tab.threshold_labels.recommended')}</span>
                    <span>{t('settings_page.notifications_tab.threshold_labels.strict')}</span>
                  </div>
                </div>
              )}

              <ToggleSwitch
                label={t('settings_page.notifications_tab.large_tx_alert')}
                description={t('settings_page.notifications_tab.large_tx_desc')}
                checked={largeTxAlert}
                onChange={(val) => {
                  setLargeTxAlert(val);
                  markUnsaved();
                }}
              />

              {largeTxAlert && (
                <div style={{ padding: '0.85rem 1rem', background: '#161616', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {t('settings_page.notifications_tab.alert_over')}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{user?.currency || 'USD'}</span>
                    <input
                      type="number"
                      value={largeTxAmount}
                      onChange={(e) => {
                        setLargeTxAmount(e.target.value);
                        markUnsaved();
                      }}
                      style={{
                        width: '100px',
                        padding: '0.4rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: '#111111',
                        border: '1px solid var(--border-subtle)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>
              )}

              <ToggleSwitch
                label={t('settings_page.notifications_tab.weekly_digest')}
                description={t('settings_page.notifications_tab.weekly_digest_desc')}
                checked={weeklyDigest}
                onChange={(val) => {
                  setWeeklyDigest(val);
                  markUnsaved();
                }}
              />

              <ToggleSwitch
                label={t('settings_page.notifications_tab.bill_reminders')}
                description={t('settings_page.notifications_tab.bill_reminders_desc')}
                checked={billReminders}
                onChange={(val) => {
                  setBillReminders(val);
                  markUnsaved();
                }}
              />

              <ToggleSwitch
                label={t('settings_page.notifications_tab.push_notifications')}
                description={t('settings_page.notifications_tab.push_notifications_desc')}
                checked={pushNotifications}
                onChange={(val) => {
                  setPushNotifications(val);
                  markUnsaved();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: APPEARANCE & INTERFACE */}
      {activeTab === 'appearance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Theme Palette Chooser */}
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                {t('settings_page.appearance.themes_title')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {t('settings_page.appearance.themes_subtitle')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                const themeName = t(`settings_page.appearance.themes.${theme.key}`);
                const themeDesc = t(`settings_page.appearance.themes.${theme.key}_desc`);
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      markUnsaved();
                      toast.success(t('settings_page.appearance.theme_set_toast', { name: themeName }));
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: theme.bg,
                      border: isSelected ? `2px solid ${theme.accent}` : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      textAlign: 'start',
                      position: 'relative',
                      boxShadow: isSelected ? `0 0 18px ${theme.accent}33` : 'none',
                    }}
                    className="hover:scale-[1.01] transition-transform"
                  >
                    {/* Visual miniature dashboard preview */}
                    <div
                      style={{
                        height: '75px',
                        borderRadius: 'var(--radius-sm)',
                        background: theme.card,
                        padding: '0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '30px', height: '6px', borderRadius: '3px', background: theme.accent }} />
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: theme.accent }} />
                      </div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '30px' }}>
                        <div style={{ height: '40%', width: '12%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                        <div style={{ height: '70%', width: '12%', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
                        <div style={{ height: '50%', width: '12%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
                        <div style={{ height: '90%', width: '12%', background: theme.accent, borderRadius: '2px' }} />
                        <div style={{ height: '65%', width: '12%', background: theme.accent, opacity: 0.7, borderRadius: '2px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                        {themeName}
                      </span>
                      {isSelected && <Check size={14} color={theme.accent} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {themeDesc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy & Layout density toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div
              style={{
                background: '#111111',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
                {t('settings_page.appearance.privacy_title')}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <ToggleSwitch
                  id="privacy-blur"
                  label={t('settings_page.appearance.privacy_blur')}
                  description={t('settings_page.appearance.privacy_blur_desc')}
                  checked={privacyBlurMode}
                  onChange={(val) => {
                    setPrivacyBlurMode(val);
                    markUnsaved();
                  }}
                />

                <ToggleSwitch
                  id="compact-density"
                  label={t('settings_page.appearance.compact_mode')}
                  description={t('settings_page.appearance.compact_mode_desc')}
                  checked={compactMode}
                  onChange={(val) => {
                    setCompactMode(val);
                    markUnsaved();
                  }}
                />
              </div>
            </div>

            {/* Privacy Mode Simulation Box */}
            <div
              style={{
                background: '#111111',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem' }}>
                {t('settings_page.appearance.live_preview_title')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {privacyBlurMode ? t('settings_page.appearance.preview_active') : t('settings_page.appearance.preview_inactive')}
              </p>

              <div
                style={{
                  background: '#161616',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {t('settings_page.appearance.checking_balance')}
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#ffffff',
                      marginTop: '0.25rem',
                      filter: privacyBlurMode ? 'blur(6px)' : 'none',
                      transition: 'filter 0.3s ease',
                      userSelect: privacyBlurMode ? 'none' : 'auto',
                    }}
                  >
                    $28,940.75
                  </div>
                </div>
                <div
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: privacyBlurMode ? 'rgba(16, 185, 129, 0.15)' : '#252525',
                    color: privacyBlurMode ? 'var(--accent-primary)' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {privacyBlurMode ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{privacyBlurMode ? t('settings_page.appearance.concealed') : t('settings_page.appearance.visible')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DATA & PRIVACY / DANGER ZONE */}
      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Export Data Card */}
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <Download size={17} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  {t('settings_page.data.export_title')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {t('settings_page.data.export_subtitle')}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FileSpreadsheet size={18} color="#10b981" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                      {t('settings_page.data.csv_title')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {t('settings_page.data.csv_desc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportData('csv')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#222222',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                  className="hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  <Download size={13} />
                  {t('settings_page.data.download_csv')}
                </button>
              </div>

              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FileJson size={18} color="#3b82f6" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                      {t('settings_page.data.json_title')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {t('settings_page.data.json_desc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleExportData('json')}
                  style={{
                    marginTop: '1rem',
                    padding: '0.55rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#222222',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.775rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                  className="hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Download size={13} />
                  {t('settings_page.data.download_json')}
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            style={{
              background: '#111111',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#f87171', margin: 0 }}>
                  {t('settings_page.data.danger_title')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  {t('settings_page.data.danger_subtitle')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                    {t('settings_page.data.clear_cache_title')}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {t('settings_page.data.clear_cache_desc')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('finora_cached_stats');
                    toast.success(t('settings_page.data.clear_cache_toast'));
                  }}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#222222',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {t('settings_page.data.clear_cache_btn')}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.05)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>
                    {t('settings_page.data.delete_acc_title')}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {t('settings_page.data.delete_acc_desc')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-red-600 transition-colors"
                >
                  {t('settings_page.data.delete_acc_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2FA SETUP MODAL */}
      {show2FAModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#141414',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                {t('settings_page.two_factor.title')}
              </h3>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              {t('settings_page.two_factor.desc')}
            </p>

            {/* QR Code Demo Box */}
            <div
              style={{
                background: '#ffffff',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                width: '170px',
                height: '170px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #000 0, #000 12px, #fff 0, #fff 24px)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ background: '#fff', padding: '6px', borderRadius: '4px', fontWeight: '800', color: '#000', fontSize: '0.7rem' }}>
                  FINORA-2FA
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                {t('settings_page.two_factor.secret_key')}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.85rem',
                  background: '#1c1c1c',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: 'var(--accent-primary)',
                }}
              >
                <span>FINO-8X92-MKL4-QP91</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('FINO-8X92-MKL4-QP91');
                    setCopiedKey(true);
                    toast.success(t('settings_page.two_factor.key_copied'));
                    setTimeout(() => setCopiedKey(false), 2000);
                  }}
                  style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  {copiedKey ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {t('settings_page.two_factor.enter_code')}
              </label>
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#1c1c1c',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  textAlign: 'center',
                  letterSpacing: '0.3em',
                  fontWeight: '700',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#222222',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {t('settings_page.two_factor.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (twoFactorCode.length < 6) {
                    toast.error(t('settings_page.two_factor.invalid_code'));
                    return;
                  }
                  setShow2FAModal(false);
                  setTwoFactorCode('');
                  toast.success(t('settings_page.two_factor.enabled_toast'));
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-primary)',
                  color: '#000000',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {t('settings_page.two_factor.verify_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#141414',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                {t('settings_page.data.delete_modal.title')}
              </h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              {t('settings_page.data.delete_modal.desc')}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {t('settings_page.data.delete_modal.type_confirm')}{' '}
                <strong style={{ color: '#ef4444' }}>DELETE</strong>
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#1c1c1c',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#222222',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {t('settings_page.data.delete_modal.cancel')}
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText !== 'DELETE' || isDeletingAccount}
                onClick={async () => {
                  setIsDeletingAccount(true);
                  await new Promise((r) => setTimeout(r, 1000));
                  toast.error(t('settings_page.data.delete_modal.deleted_toast'));
                  router.push('/');
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  background: deleteConfirmationText === 'DELETE' ? '#ef4444' : '#333333',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: deleteConfirmationText === 'DELETE' ? 'pointer' : 'not-allowed',
                }}
              >
                {isDeletingAccount ? t('settings_page.data.delete_modal.deleting') : t('settings_page.data.delete_modal.confirm_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#141414',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                {t('settings_page.avatar_modal.title')}
              </h3>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              {t('settings_page.avatar_modal.desc')}
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {t('settings_page.avatar_modal.custom_url')}
              </label>
              <input
                type="url"
                value={imageprofile}
                onChange={(e) => {
                  changeProfileImage(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#1c1c1c',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => { setShowAvatarModal(false); }}
              style={{
                width: '100%',
                padding: '0.65rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-primary)',
                color: '#000000',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {t('settings_page.avatar_modal.done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsView;
