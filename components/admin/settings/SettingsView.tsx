'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Shield,
  Lock,
  Key,
  Bell,
  DollarSign,
  Palette,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Globe,
  Check,
  CheckCircle2,
  AlertTriangle,
  Download,
  Trash2,
  Camera,
  Sparkles,
  RefreshCw,
  Moon,
  Sun,
  Sliders,
  CreditCard,
  TrendingUp,
  Coins,
  HelpCircle,
  ChevronRight,
  Info,
  Save,
  FileSpreadsheet,
  FileJson,
  ShieldCheck,
  Calendar,
  AlertCircle,
  X,
  Copy,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import type { User, CurrencyOption } from '@/types';
import SettingProfiles from './SettingProfiles';

interface SettingsViewProps {
  user: User;
  token?: string | null;
}

type TabType = 'profile' | 'financial' | 'security' | 'notifications' | 'appearance' | 'data';

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham (MAD)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
];

const THEME_OPTIONS = [
  {
    id: 'midnight',
    name: 'Midnight Black',
    description: 'Deep #080808 background with emerald neon accents',
    bg: '#080808',
    card: '#141414',
    accent: '#10b981',
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    description: 'Vibrant green highlights with carbon dark layers',
    bg: '#05130d',
    card: '#0a1f16',
    accent: '#00f59b',
  },
  {
    id: 'deep-obsidian',
    name: 'Deep Obsidian',
    description: 'Ultra dark monochrome slate with electric blue touches',
    bg: '#0c0f17',
    card: '#131826',
    accent: '#3b82f6',
  },
  {
    id: 'purple-aura',
    name: 'Amethyst Aura',
    description: 'Futuristic purple luxury finance aesthetic',
    bg: '#0f0a1a',
    card: '#19112a',
    accent: '#a855f7',
  },
];

export function SettingsView({ user, token }: SettingsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Financial Settings States
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [fiscalStartDay, setFiscalStartDay] = useState('1');
  const [defaultTransactionType, setDefaultTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [numberFormat, setNumberFormat] = useState('en-US');
  const [autoConvertExchange, setAutoConvertExchange] = useState(true);

  // Security States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Active Sessions Mock Data with interactability
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Windows PC · Chrome 129.0',
      location: 'New York, US',
      ip: '192.168.1.45',
      current: true,
      lastActive: 'Active now',
      type: 'laptop',
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro · Spendora App',
      location: 'New York, US',
      ip: '172.56.21.90',
      current: false,
      lastActive: '2 hours ago',
      type: 'mobile',
    },
    {
      id: 'sess-3',
      device: 'MacBook Air · Safari 17.4',
      location: 'Casablanca, MA',
      ip: '197.230.14.88',
      current: false,
      lastActive: '3 days ago',
      type: 'laptop',
    },
  ]);
  //image 
  const [imageprofile,setimageprofile] = useState(user?.avatar || '');

  // Notifications Settings States
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [budgetThreshold, setBudgetThreshold] = useState(80);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [largeTxAlert, setLargeTxAlert] = useState(true);
  const [largeTxAmount, setLargeTxAmount] = useState('500');
  const [billReminders, setBillReminders] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Appearance & Privacy States
  const [selectedTheme, setSelectedTheme] = useState('midnight');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [compactMode, setCompactMode] = useState(false);
  const [privacyBlurMode, setPrivacyBlurMode] = useState(false);

  // Modal States
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Load persisted client preferences on mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('finora_theme');
      if (storedTheme) setSelectedTheme(storedTheme);
      const storedPrivacy = localStorage.getItem('finora_privacy_mode');
      if (storedPrivacy) setPrivacyBlurMode(storedPrivacy === 'true');
      const storedCompact = localStorage.getItem('finora_compact');
      if (storedCompact) setCompactMode(storedCompact === 'true');
      const storedCurrency = localStorage.getItem('finora_currency');
      if (storedCurrency) setCurrency(storedCurrency);
    } catch {
      // Ignore local storage error
    }
  }, []);

  const markUnsaved = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };
  //change profile imgage
  const channgeProfileImage= async (image:string)=>{
    console.log(image)
    setimageprofile(image)

  //  const response = await fetch(`${process.env.LARAVEL_API_URL}/api/user/profile`, {
  //    method: 'PUT',
  //    headers: {
  //      'Content-Type': 'application/json',
  //      Authorization: `Bearer ${token}`,
  //    },
  //    body: JSON.stringify({
  //      avatar: image,
  //    }),
  //  });
  //   const data = await response.json();
  //   if (data.success) {
  //     toast.success('Profile image changed successfully!');
  //   } else {
  //     toast.error('Failed to change profile image!');
  //   }

  }
  // Save Settings Handler
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // Save local preferences
      localStorage.setItem('finora_theme', selectedTheme);
      localStorage.setItem('finora_privacy_mode', String(privacyBlurMode));
      localStorage.setItem('finora_compact', String(compactMode));
      localStorage.setItem('finora_currency', currency);

      // Attempt to persist cookie / api if available
      await new Promise((resolve) => setTimeout(resolve, 600));

      setHasUnsavedChanges(false);
      toast.success('Settings and preferences saved successfully!');
    } catch {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Password update handler
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    toast.success('Password changed successfully! You will use it on your next login.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(score, 100);
  };

  const passwordScore = calculatePasswordStrength(newPassword);
  const getStrengthLabel = () => {
    if (passwordScore <= 0) return { label: 'Empty', color: '#666666' };
    if (passwordScore < 40) return { label: 'Weak', color: '#ef4444' };
    if (passwordScore < 75) return { label: 'Good', color: '#f59e0b' };
    return { label: 'Very Strong', color: '#10b981' };
  };

  // Revoke session handler
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success('Session revoked successfully.');
  };

  // Export Data Handler (Produces real downloadable files!)
  const handleExportData = (format: 'json' | 'csv') => {
    const sampleData = {
      user: {
        id: user?.id || 1,
        name:user.name,
        email:user.email,
        currency:user.currency,
        exportedAt: new Date().toISOString(),
      },
      transactions: [
        { id: 'tx-101', title: 'Stripe Payout - SaaS', amount: 4850.0, type: 'INCOME', category: 'Salary', date: '2026-10-15' },
        { id: 'tx-102', title: 'AWS Cloud Hosting', amount: 142.5, type: 'EXPENSE', category: 'Utilities', date: '2026-10-14' },
        { id: 'tx-103', title: 'Whole Foods Market', amount: 89.2, type: 'EXPENSE', category: 'Food & Groceries', date: '2026-10-12' },
        { id: 'tx-104', title: 'Freelance Design Retainer', amount: 1200.0, type: 'INCOME', category: 'Work & Salary', date: '2026-10-10' },
      ],
      settings: {
        currency,
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
        .map((t) => `${t.id},"${t.title}",${t.amount},${t.type},${t.category},${t.date}`)
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

    toast.success(`Export downloaded as ${filename}`);
  };

  // Toggle Switch Component
  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
    id,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
    id?: string;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: '#141414',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease',
      }}
      className="toggle-card hover:border-[#333333]"
    >
      <div style={{ paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => {
          onChange(!checked);
          markUnsaved();
        }}
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '9999px',
          background: checked ? 'var(--accent-primary)' : '#262626',
          border: '1px solid',
          borderColor: checked ? 'rgba(16, 185, 129, 0.4)' : '#333333',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          boxShadow: checked ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>
    </div>
  );

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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Admin</span>
            <ChevronRight size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>Settings</span>
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
            Settings & Preferences
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Manage your account security, currency parameters, appearance themes, and notifications.
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
              Unsaved changes
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
              Up to date
            </div>
          )}

          <button
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save All Settings</span>
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
            right: '-50px',
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
                
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                title="Change Avatar"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
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
                  {user?.email_verified_at === null ? "UNVERIFIED" : "VERIFIED"}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0.5rem 0' }}>
                {user?.email || 'user@spendora.app'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>🌍 {user?.country}</span>
                <span>•</span>
                <span>💰 Default Currency: <strong style={{ color: '#ffffff' }}>{currency}</strong></span>
                <span>•</span>
                <span>🔒 2FA: <strong style={{ color: twoFactorEnabled ? '#10b981' : '#f59e0b' }}>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setActiveTab('security')}
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
              <Lock size={13} />
              Password & 2FA
            </button>
            <button
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
              Customize UI
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
          { id: 'profile', label: 'Profile & Account', icon: UserIcon },
          { id: 'financial', label: 'Financial & Currency', icon: DollarSign },
          { id: 'security', label: 'Security & Access', icon: Shield },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'appearance', label: 'Theme & Interface', icon: Palette },
          { id: 'data', label: 'Data & Privacy', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
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
        <SettingProfiles user={user} token={token}/>
      )}

      {/* TAB CONTENT: FINANCIAL & CURRENCY */}
      {activeTab === 'financial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Primary Currency Selection */}
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
                  <DollarSign size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    Default Base Currency
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    All overview metrics, reports, and budget targets will calculate based on this currency.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {CURRENCIES.map((curr) => {
                const isSelected = currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    type="button"
                    onClick={() => {
                      setCurrency(curr.code);
                      markUnsaved();
                      toast.success(`Currency changed to ${curr.code} (${curr.symbol})`);
                    }}
                    style={{
                      padding: '1.1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(16, 185, 129, 0.1)' : '#161616',
                      border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      position: 'relative',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
                    }}
                    className="hover:border-zinc-500"
                  >
                    {isSelected && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--accent-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000000',
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <span style={{ fontSize: '1.4rem', fontWeight: '800', color: isSelected ? 'var(--accent-primary)' : '#ffffff' }}>
                      {curr.symbol}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginTop: '0.35rem' }}>
                      {curr.code}
                    </span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {curr.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency formatting & Fiscal parameters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div
              style={{
                background: '#111111',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.1rem' }}>
                Accounting Rules & Cycles
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Fiscal Month Start Day
                  </label>
                  <select
                    value={fiscalStartDay}
                    onChange={(e) => {
                      setFiscalStartDay(e.target.value);
                      markUnsaved();
                    }}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#161616',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  >
                    <option value="1">1st of the month (Standard)</option>
                    <option value="15">15th of the month</option>
                    <option value="25">25th of the month (Payday)</option>
                    <option value="last">Last working day of month</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Default New Transaction Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setDefaultTransactionType('EXPENSE');
                        markUnsaved();
                      }}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: defaultTransactionType === 'EXPENSE' ? 'rgba(239, 68, 68, 0.15)' : '#161616',
                        border: defaultTransactionType === 'EXPENSE' ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                        color: defaultTransactionType === 'EXPENSE' ? '#f87171' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Expense (-)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDefaultTransactionType('INCOME');
                        markUnsaved();
                      }}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        background: defaultTransactionType === 'INCOME' ? 'rgba(16, 185, 129, 0.15)' : '#161616',
                        border: defaultTransactionType === 'INCOME' ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        color: defaultTransactionType === 'INCOME' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      Income (+)
                    </button>
                  </div>
                </div>

                <ToggleSwitch
                  id="auto-fx"
                  label="Auto FX Rate Sync"
                  description="Automatically update exchange rates via Frankfurter API on transaction entry."
                  checked={autoConvertExchange}
                  onChange={setAutoConvertExchange}
                />
              </div>
            </div>

            {/* Live Number Formatting Preview */}
            <div
              style={{
                background: '#111111',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.35rem' }}>
                Live Currency Formatting Preview
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                How values will look across tables, badges, and dashboard graphs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: '#161616', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Positive Balance Sample</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem' }}>
                    +{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'MAD' ? 'DH ' : '$'}
                    14,850.50
                  </div>
                </div>

                <div style={{ background: '#161616', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expense Transaction Sample</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f87171', marginTop: '0.25rem' }}>
                    -{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'MAD' ? 'DH ' : '$'}
                    320.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SECURITY & ACCESS */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Change Password Form */}
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
                <Lock size={17} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Password & Credentials
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Ensure your account uses a strong, unique passphrase
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordUpdate} style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Current Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#161616',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                    className="focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#161616',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  className="focus:border-emerald-500 transition-colors"
                />

                {/* Password Strength Meter */}
                {newPassword && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Strength:</span>
                      <span style={{ color: getStrengthLabel().color, fontWeight: '700' }}>{getStrengthLabel().label}</span>
                    </div>
                    <div style={{ height: '4px', background: '#222222', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${passwordScore}%`,
                          background: getStrengthLabel().color,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#161616',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  className="focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  marginTop: '0.5rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#1f1f1f',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
                className="hover:border-emerald-500 hover:text-emerald-400 transition-colors"
              >
                <Key size={14} />
                Update Password
              </button>
            </form>
          </div>

          {/* 2FA Card */}
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: twoFactorEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: twoFactorEnabled ? '#10b981' : '#f87171',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Two-Factor Authentication (2FA)
                    </h3>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: twoFactorEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: twoFactorEnabled ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {twoFactorEnabled ? 'ACTIVE' : 'RECOMMENDED'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                    Protect your financial assets by requiring an authenticator code (Google Auth, Authy) on login.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (twoFactorEnabled) {
                    setTwoFactorEnabled(false);
                    toast.info('Two-Factor Authentication disabled');
                  } else {
                    setShow2FAModal(true);
                  }
                }}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  background: twoFactorEnabled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: twoFactorEnabled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  color: twoFactorEnabled ? '#f87171' : 'var(--accent-primary)',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Configure 2FA'}
              </button>
            </div>
          </div>

          {/* Active Logged-in Sessions */}
          <div
            style={{
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  Active Devices & Sessions
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Current logged-in browsers and mobile applications with access to your wallet
                </p>
              </div>

              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSessions((prev) => prev.filter((s) => s.current));
                    toast.success('Logged out of all other sessions');
                  }}
                  style={{
                    fontSize: '0.75rem',
                    color: '#f87171',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Log out of all other devices
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#161616',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: sess.current ? 'rgba(16, 185, 129, 0.15)' : '#202020',
                        color: sess.current ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {sess.type === 'laptop' ? <Laptop size={18} /> : <Smartphone size={18} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                          {sess.device}
                        </span>
                        {sess.current && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: '700',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: 'var(--accent-primary)',
                            }}
                          >
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {sess.location} · IP: {sess.ip} · {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.current && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#f87171',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      className="hover:bg-red-950 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
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
                  Financial Warning System & Alerts
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Automate push notices and email triggers for overspending
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <ToggleSwitch
                label="Budget Limit Alert"
                description={`Send warning when any category spending exceeds ${budgetThreshold}% of its allocated monthly budget.`}
                checked={budgetAlerts}
                onChange={setBudgetAlerts}
              />

              {budgetAlerts && (
                <div style={{ padding: '1rem', background: '#161616', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Trigger threshold:</span>
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
                    <span>50% (Cautious)</span>
                    <span>80% (Recommended)</span>
                    <span>100% (Strict)</span>
                  </div>
                </div>
              )}

              <ToggleSwitch
                label="Large Outflow Alert"
                description="Trigger an instant high-priority alert for any single transaction above a defined amount."
                checked={largeTxAlert}
                onChange={setLargeTxAlert}
              />

              {largeTxAlert && (
                <div style={{ padding: '0.85rem 1rem', background: '#161616', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Alert me for amounts over:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{currency}</span>
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
                label="Weekly Financial Summary Digest"
                description="Receive a Monday morning breakdown of income, category spending, and savings velocity."
                checked={weeklyDigest}
                onChange={setWeeklyDigest}
              />

              <ToggleSwitch
                label="Upcoming Subscription & Bill Reminders"
                description="Get notified 48 hours before recurring subscriptions or bills are due."
                checked={billReminders}
                onChange={setBillReminders}
              />

              <ToggleSwitch
                label="Browser Push Notifications"
                description="Show desktop browser alerts for real-time wallet synchronization."
                checked={pushNotifications}
                onChange={setPushNotifications}
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
                Finora Dark Canvas Themes
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Select an engineered dark mode palette tailored for prolonged financial analysis
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {THEME_OPTIONS.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(theme.id);
                      markUnsaved();
                      toast.success(`Theme set to ${theme.name}`);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: theme.bg,
                      border: isSelected ? `2px solid ${theme.accent}` : '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      textAlign: 'left',
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
                        {theme.name}
                      </span>
                      {isSelected && <Check size={14} color={theme.accent} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {theme.description}
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
                Privacy & Display Features
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <ToggleSwitch
                  id="privacy-blur"
                  label="Privacy Blur Mode"
                  description="Obscures all balance figures and bank account balances with a subtle blur effect when in public."
                  checked={privacyBlurMode}
                  onChange={setPrivacyBlurMode}
                />

                <ToggleSwitch
                  id="compact-density"
                  label="Compact Row Density"
                  description="Reduces padding in tables and cards to view more transaction records simultaneously."
                  checked={compactMode}
                  onChange={setCompactMode}
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
                Privacy Mode Live Preview
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {privacyBlurMode ? '🔒 Active: Balance numbers are securely concealed.' : '👁️ Inactive: Balances are fully visible.'}
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Checking Account Balance</div>
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
                  <span>{privacyBlurMode ? 'Concealed' : 'Visible'}</span>
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
                  Export Your Financial Data
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Download your entire transaction history, categories, and account ledgers anytime
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
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>CSV Spreadsheet</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Standard CSV spreadsheet compatible with Microsoft Excel, Google Sheets, and accounting software.
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
                  Download CSV Statement
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
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Full JSON Backup</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Complete database dump containing metadata, categories, accounts, and user preferences.
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
                  Download JSON Backup
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
                  Danger Zone
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Irreversible actions regarding your account and financial archives
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
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Clear Cached Analytics</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Recalculates monthly budget variances, savings velocity, and cached charts.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('finora_cached_stats');
                    toast.success('Analytics cache cleared and refreshed');
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
                  Clear Cache
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
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f87171' }}>Delete Account</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Permanently delete your profile, categories, transactions, and payment methods.
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
                  Delete Account
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
                Set Up Two-Factor Authentication
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
              Scan this QR code using Google Authenticator, Authy, or 1Password to bind your device.
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
              {/* QR Pattern visual */}
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
                Secret Setup Key (manual entry):
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
                    toast.success('Secret key copied!');
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
                Enter 6-Digit Code from App
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
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (twoFactorCode.length < 6) {
                    toast.error('Please enter a valid 6-digit verification code');
                    return;
                  }
                  setTwoFactorEnabled(true);
                  setShow2FAModal(false);
                  setTwoFactorCode('');
                  toast.success('Two-Factor Authentication is now enabled!');
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
                Verify & Enable
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
                Delete Finora Account
              </h3>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              This will permanently delete your account, cancel all active subscriptions, and eradicate all transactions and budgets. This action cannot be reversed.
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Type <strong style={{ color: '#ef4444' }}>DELETE</strong> to confirm:
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
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText !== 'DELETE' || isDeletingAccount}
                onClick={async () => {
                  setIsDeletingAccount(true);
                  await new Promise((r) => setTimeout(r, 1000));
                  toast.error('Account deleted. Redirecting to home...');
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
                {isDeletingAccount ? 'Deleting...' : 'Confirm Delete'}
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
                Choose Profile Photo
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
              Pick from our collection of avatars or enter a direct image URL.
            </p>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Or Custom Image URL:
              </label>
              <input
                type="url"
                value={user?.avatar}
                onChange={(e) => {
                  channgeProfileImage(e.target.value);
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
              onClick={() => {setShowAvatarModal(false)}}
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
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
