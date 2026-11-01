'use client';

import React from 'react';
import { X, LogOut, AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';

export interface LogoutAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function LogoutAlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Logout of all devices?',
  description = 'Are you sure you want to log out of all active sessions across your computers, phones, and browsers?',
}: LogoutAlertProps) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes popupScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes popupBackdropFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'popupBackdropFade 0.2s ease-out forwards',
        }}
      >
        {/* Alert Popup Dialog */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          style={{
            width: '100%',
            maxWidth: '430px',
            background: 'linear-gradient(180deg, #161616 0%, #0f0f0f 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '18px',
            padding: '1.65rem',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(239, 68, 68, 0.1)',
            position: 'relative',
            animation: 'popupScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '1.15rem',
              right: '1.15rem',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#1d1d1d',
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
              color: 'var(--text-muted, #888888)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted, #888888)';
              e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255,255,255,0.08))';
            }}
          >
            <X size={16} />
          </button>

          {/* Icon Badge & Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '13px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)',
              }}
            >
              <LogOut size={22} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                fontSize: '0.7rem',
                fontWeight: '700',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <ShieldAlert size={12} />
              Security Action
            </div>
          </div>

          {/* Title & Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#ffffff',
                margin: '0 0 0.4rem 0',
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: '0.825rem',
                color: 'var(--text-secondary, #9ca3af)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>

          {/* Warning Notice Card */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.18)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
            }}
          >
            <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.785rem', color: '#e5e7eb', lineHeight: 1.45 }}>
              <span style={{ fontWeight: '700', color: '#f87171' }}>Note: </span>
              Your current session will also be terminated. You will need to log back in with your password to continue.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.7rem 1rem',
                borderRadius: '10px',
                background: '#1d1d1d',
                border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
                color: '#e5e7eb',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#252525';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#1d1d1d';
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1.25,
                padding: '0.7rem 1.15rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.filter = 'brightness(1.1)';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.filter = 'none';
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut size={15} />
                  <span>Log out everywhere</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default LogoutAlertModal;
