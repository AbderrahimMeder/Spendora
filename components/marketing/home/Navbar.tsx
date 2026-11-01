'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Wallet, Menu, X, ArrowRight } from 'lucide-react';
import { NavLinks } from '@/config/dashboard-link';
import { useAuth } from '@/hooks/auth';
import { User } from '@/types';
import LanguageSwitcher from '@/components/i18n/btn-switch';

interface NavbarProps {
  user?: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileToggle, setProfileToggle] = useState(false);
  const { logout } = useAuth();

  const navLinks = [
    { label: t('navbar.about'), href: '/about' },
    { label: t('navbar.features'), href: '/features' },
    { label: t('navbar.reports'), href: '/reports' },
    { label: t('navbar.faq'), href: '/faq' },
    { label: t('navbar.contact'), href: '/contact' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 8, 8, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand Logo */}
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)',
          }}>
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Spend<span style={{ color: 'var(--accent-primary)' }}>ora</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', position: 'relative', alignItems: 'center', gap: '1.75rem' }} className="desktop-links">
          {navLinks.map((link) => {
            const isInternalPage = link.href.startsWith('/');
            return isInternalPage && !link.href.startsWith('/#') ? (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(16, 185, 129, 0.50)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSwitcher />

          {/* Action Buttons */}
          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                href="/login"
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', textDecoration: 'none' }}
              >
                {t('navbar.sign_in')}
              </Link>
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', textDecoration: 'none' }}
              >
                <span>{t('navbar.start_free')}</span>
                <ArrowRight size={15} />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="btn-icon mobile-menu-btn"
                style={{ display: 'none' }}
                aria-label={t('navbar.menu_toggle')}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={user?.name || 'User'}
                  onClick={() => setProfileToggle(!profileToggle)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: '2px solid var(--border-subtle)',
                    display: 'block',
                  }}
                />

                {profileToggle && user && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      width: '220px',
                      padding: '0.6rem',
                      backgroundColor: 'black',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                      zIndex: 1000,
                      textAlign: 'start',
                    }}
                  >
                    {/* User Info */}
                    <div
                      style={{
                        padding: '0.6rem 0.7rem 0.8rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {user?.name || t('navbar.my_account')}
                      </div>

                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user?.email || t('navbar.logged_in')}
                      </div>
                    </div>

                    {/* Links */}
                    {NavLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          href={item.href ?? '/'}
                          key={item.label}
                          onClick={() => setProfileToggle(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '0.65rem 0.7rem',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            marginBottom: '2px',
                          }}
                        >
                          <Icon size={17} strokeWidth={1.8} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setProfileToggle(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '0.65rem 0.7rem',
                        marginTop: '0.4rem',
                        border: 'none',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.8rem',
                        background: 'transparent',
                        color: 'var(--danger, #ef4444)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'start',
                      }}
                    >
                      {t('navbar.logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0d0d0d',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'start',
        }}>
          {navLinks.map((link) => {
            const isInternalPage = link.href.startsWith('/') && !link.href.startsWith('/#');
            return isInternalPage ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
