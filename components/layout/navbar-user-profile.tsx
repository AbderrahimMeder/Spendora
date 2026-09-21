
import React, { useState } from 'react';
import Link from 'next/link';
import { Wallet, Menu, X, ArrowRight } from 'lucide-react';
import { DashboardItems } from '@/config/dashboard-link';
import { useAuth } from '@/hooks/auth';
import { User } from '@/types';

export function NavbarUserProfile({ user }: User) {
  const [profileToggle, setProfileToggle] = useState(false);
  const dashboardLinks = DashboardItems;
  return (
    <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!!!user ? (
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
    </div>
  );
}