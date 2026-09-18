'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet, Menu, X, ArrowRight } from 'lucide-react';
import { DashboardItems } from '@/config/dashboard-link';
import { useAuth } from '@/hooks/auth';
import { User } from '@/types';

export default function Navbar() {
  const user = useAuth()?.user as User | null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(true);
  const [profileToggle, setProfileToggle] = useState(false);
  const dashboardLinks = DashboardItems;
  const { logout } = useAuth();

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Reports', href: '/reports' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLogged(false);
        return;
      }
    };
    fetchUser();
  }, []);

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
        padding: '1.1rem 1.5rem',
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
              Fin<span style={{ color: 'var(--accent-primary)' }}>ora</span>
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-links">
          {navLinks.map((link) => {
            const isInternalPage = link.href.startsWith('/');
            return isInternalPage && !link.href.startsWith('/#') ? (
              <Link
                key={link.label}
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
              </Link>
            ) : (
              <a
                key={link.label}
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

        {/* Action Buttons */}
        {!logged ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/login"
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1rem', textDecoration: 'none' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.15rem', textDecoration: 'none' }}
            >
              <span>Start for Free</span>
              <ArrowRight size={15} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon mobile-menu-btn"
              style={{ display: 'none' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!user || loading ? (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "gray",
                  animation: "profileSkeleton 1.2s ease-in-out infinite",
                }}
              />
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"}
                  alt={user?.name || "User"}
                  onClick={() => setProfileToggle((prev) => !prev)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "2px solid var(--border-subtle)",
                    display: "block",
                  }}
                />

                {profileToggle && user && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: "220px",
                      padding: "0.6rem",
                      backgroundColor: "black",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                      zIndex: 1000,
                    }}
                  >
                    {/* User Info */}
                    <div
                      style={{
                        padding: "0.6rem 0.7rem 0.8rem",
                        borderBottom: "1px solid var(--border-subtle)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {user?.name || 'My Account'}
                      </div>

                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginTop: "3px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user?.email || 'Logged in'}
                      </div>
                    </div>

                    {/* Links */}
                    {dashboardLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          href={item.href}
                          key={item.label}
                          onClick={() => setProfileToggle(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "0.65rem 0.7rem",
                            borderRadius: "8px",
                            color: "var(--text-muted)",
                            fontSize: "0.85rem",
                            fontWeight: 500,
                            textDecoration: "none",
                            marginBottom: "2px",
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
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "0.65rem 0.7rem",
                        marginTop: "0.4rem",
                        border: "none",
                        borderTop: "1px solid var(--border-subtle)",
                        paddingTop: "0.8rem",
                        background: "transparent",
                        color: "var(--danger, #ef4444)",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
        }}>
          {navLinks.map((link) => {
            const isInternalPage = link.href.startsWith('/') && !link.href.startsWith('/#');
            return isInternalPage ? (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#ffffff', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '600' }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
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
