"use client"
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Wallet,
  LayoutDashboard,
  ArrowUpDown,
  Target,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
  Tag,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

interface DashboardLayoutProps {
  children?: ReactNode;
  user: User;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    Management: true,
  });

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
      });
      const data = await res.json();
      if (data.status === 200) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.error('Logout failed');
    }
    router.push('/login');
  };

  const navLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Transactions', path: '/transactions', icon: ArrowUpDown, badge: null },
    {
      label: 'Management',
      path: null,
      icon: Layers,
      badge: null,
      children: [
        { label: 'Categories', path: '/categories', icon: Tag, badge: null },
        { label: 'Payment Methods', path: '/payment-method', icon: CreditCard, badge: null },
      ],
    },
    { label: 'Budgets', path: '/budgets', icon: Target, badge: null },
    { label: 'Analytics & Reports', path: '/reports', icon: BarChart3, badge: '21' },
    { label: 'Settings', path: '/settings', icon: Settings, badge: null },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
  const userName = user?.name || '';
  const userEmail = user?.email || '';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-main)',
    }}>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        style={{
          width: collapsed ? '80px' : '260px',
          background: '#0d0d0d',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem 1rem',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 95,
          transition: 'width 0.25s ease',
          flexShrink: 0,
        }}
        className={`dashboard-sidebar ${mobileSidebarOpen ? 'open' : ''}`}
      >
        {/* Top brand header */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            marginBottom: '2rem',
            padding: '0 0.5rem',
          }}>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000000',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                flexShrink: 0,
              }}>
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              {!collapsed && (
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Fin<span style={{ color: 'var(--accent-primary)' }}>ora</span>
                    <span style={{
                      fontSize: '0.65rem',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--accent-primary)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>PRO</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Smart Wealth Tracker</p>
                </div>
              )}
            </Link>
          </div>

          {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const hasChildren = Boolean(link.children && link.children.length > 0);
              const isChildActive = Boolean(
                link.children?.some(
                  (child) => pathname === child.path || (child.path && pathname.startsWith(child.path + '/'))
                )
              );
              const isActive = link.path ? (pathname === link.path || (link.path === '/dashboard' && pathname === '/dashboard/')) : isChildActive;
              const isOpen = openDropdowns[link.label] ?? isChildActive;

              if (hasChildren && link.children) {
                return (
                  <div key={link.label} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(link.label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: isChildActive ? '700' : '500',
                        color: isChildActive ? '#ffffff' : 'var(--text-secondary)',
                        background: isChildActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        border: isChildActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (!isChildActive) {
                          e.currentTarget.style.background = '#161616';
                          e.currentTarget.style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isChildActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                      title={collapsed ? link.label : undefined}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <Icon size={19} color={isChildActive ? 'var(--accent-primary)' : 'currentColor'} />
                        {!collapsed && <span>{link.label}</span>}
                      </div>
                      {!collapsed && (
                        isOpen ? (
                          <ChevronDown size={16} color={isChildActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                        ) : (
                          <ChevronRight size={16} color="var(--text-secondary)" />
                        )
                      )}
                    </button>

                    {/* Children Sub-links */}
                    {isOpen && !collapsed && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          marginLeft: '1.25rem',
                          paddingLeft: '0.75rem',
                          marginTop: '0.35rem',
                          marginBottom: '0.35rem',
                          borderLeft: '2px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isCurrentChildActive =
                            pathname === child.path || (child.path && pathname.startsWith(child.path + '/'));

                          return (
                            <Link
                              key={child.label}
                              href={child.path}
                              onClick={() => setMobileSidebarOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.55rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                fontSize: '0.825rem',
                                fontWeight: isCurrentChildActive ? '600' : '400',
                                color: isCurrentChildActive ? '#ffffff' : 'var(--text-secondary)',
                                background: isCurrentChildActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                                border: isCurrentChildActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!isCurrentChildActive) {
                                  e.currentTarget.style.background = '#161616';
                                  e.currentTarget.style.color = '#ffffff';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isCurrentChildActive) {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                                <ChildIcon size={16} color={isCurrentChildActive ? 'var(--accent-primary)' : 'currentColor'} />
                                <span>{child.label}</span>
                              </div>
                              {child.badge && child.badge !== '0' && (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    background: '#1c1c1c',
                                    color: 'var(--text-muted)',
                                    padding: '1px 6px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)',
                                  }}
                                >
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.path || '#'}
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: '0.75rem 0.9rem',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#161616';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                  title={collapsed ? link.label : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <Icon size={19} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                    {!collapsed && <span>{link.label}</span>}
                  </div>
                  {!collapsed && link.badge && link.badge !== '0' && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        background: '#1c1c1c',
                        color: 'var(--text-muted)',
                        padding: '2px 7px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Pro Upgrade Banner / Tip */}
          {!collapsed && (
            <div style={{
              marginTop: '2rem',
              padding: '1.1rem',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Sparkles size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ffffff' }}>AI Insights Active</span>
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                You saved 18% more this month compared to July. Keep it up!
              </p>
            </div>
          )}
        </div>

        {/* User Card & Logout */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: collapsed ? '0' : '0.4rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              fontWeight: '800',
              fontSize: '0.9rem',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
            }}>
              {userInitial}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {userName}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {userEmail}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: '0.75rem',
              width: '100%',
              padding: '0.65rem 0.85rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
            title="Sign Out"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: '100vh',
      }}>
        {/* Topbar */}
        <header style={{
          height: '68px',
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 80,
        }}>
          {/* Left Topbar Action / Mobile Hamburger Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="mobile-menu-btn"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: '#161616',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Right Topbar Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notifications toggle */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="btn-icon"
                style={{ position: 'relative' }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  width: '300px',
                  background: '#141414',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                  padding: '1rem',
                  zIndex: 100,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Notifications</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: '#1c1c1c', fontSize: '0.775rem' }}>
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>Monthly Salary credited</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>+$4,850.00 deposited into your bank account.</div>
                    </div>
                    <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: '#1c1c1c', fontSize: '0.775rem' }}>
                      <div style={{ fontWeight: '600', color: '#eab308' }}>Budget Alert</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Food category has reached 65% of monthly limit.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{
          flex: 1,
          padding: '0.75rem',
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
        }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        @media (max-width: 860px) {
          .dashboard-sidebar {
            position: fixed !important;
            left: -300px;
            top: 0;
            bottom: 0;
            z-index: 100 !important;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .dashboard-sidebar.open {
            left: 0 !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
          .sync-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
