'use client';

import React, { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Key,
  ShieldCheck,
  Laptop,
  Smartphone,
  X,
  Copy,
  LogOut,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@/types';
import { LogoutAlertModal } from './LogoutAlertModal';



interface SettingSecuretyProps {
  user?: User | null;
  token?: string | null | undefined;
}

export function SettingSecurety({ user, token }: SettingSecuretyProps = {}) {
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  // Validate fields and open modal (does not send request yet, prevents double requests)
  const handlePasswordFormSubmit = (e: React.FormEvent) => {
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
    setOpenLogoutModal(true);
  };

  // Password update handler (called once on modal confirmation)
  const handlePasswordUpdate = async (logOutOfAllDevices: boolean = false) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/Profile/UpdatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
          log_out_all_devices: logOutOfAllDevices,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error('Failed to update password');
        return;
      }
      if (result.status === 201) {
        toast.success('Password updated successfully');
        setOpenLogoutModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        return;
      }
      toast.error('Failed to update password');
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout of all devices from the standalone card


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

  return (
    <>
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

          <form onSubmit={handlePasswordFormSubmit} style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
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
                cursor: `${loading ? 'not-allowed' : 'pointer'}`,
                opacity: `${loading ? '0.5' : '1'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Key size={14} />
              )}
              Update Password
            </button>
          </form>
        </div>
        {/* LOGOUT CONFIRMATION ALERT POPUP */}
        <LogoutAlertModal
          isOpen={openLogoutModal}
          onClose={() => setOpenLogoutModal(false)}
          onConfirm={() => handlePasswordUpdate(true)}
          loading={loading}
        />
      </div>
    </>
  );
}

export default SettingSecurety;