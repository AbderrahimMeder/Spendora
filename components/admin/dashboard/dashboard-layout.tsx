"use client";

import { useState, ReactNode, useEffect,CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Wallet,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
 PanelLeft
} from 'lucide-react';
import { NavLinks } from '@/config/dashboard-link';
import { toast } from 'sonner';
import { User, Notification as NotificationType } from '@/types';
import { Notification } from '@/components/notifications/notification';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/i18n/btn-switch'
interface DashboardLayoutProps {
  children?: ReactNode;
  user: User;
  token: string;
  loadingNotifications?: boolean;
}

export default function DashboardLayout({ children, user, token }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {t}=useTranslation()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed,setCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    Management: true,
  });
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [lang,setlang]=useState('en')
  useEffect(() => {
    const lang = localStorage.getItem('spendora-language');
    setlang(lang??'en')
    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!cancelled) {
          setNotifications(data.data ?? []);
          setLoadingNotifications(false);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        if (!cancelled) {
          setLoadingNotifications(false);
        }
      }
    };

    loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [token]);

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
    } catch {
      toast.error('Logout failed');
    }
    router.push('/login');
  };

  const navLinks = NavLinks;

 const getNavLabel = (label: string) => {
    
    switch (label) {
      case 'Overview':
        return t('admin_dashboard.sidebar.overview');
      case 'Transactions':
        return t('admin_dashboard.sidebar.transactions');
      case 'Management':
        return t('admin_dashboard.sidebar.management');
      case 'Categories':
        return t('admin_dashboard.sidebar.categories');
      case 'Payment Methods':
        return t('admin_dashboard.sidebar.payment_methods');
      case 'Budgets':
        return t('admin_dashboard.sidebar.budgets');
      case 'Notifications':
        return t('admin_dashboard.sidebar.notifications');
      case 'Reports':
        return t('admin_dashboard.sidebar.reports');
      case 'Settings':
        return t('admin_dashboard.sidebar.settings');
      default:
        return label;
    }
  }; 
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';
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
        {!collapsed?(
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
                position:'relative',
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
                    Spend<span style={{ color: 'var(--accent-primary)' }}>ora</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                    {t('admin_dashboard.sidebar.brand_subtitle')}
                  </p>
                </div>
              )}
            </Link> 
        {!collapsed && (
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="              
              flex items-center justify-center
              w-8 h-8
              rounded-lg
              cursor-pointer
              text-gray-400
              hover:text-emerald-400
              border border-transparent
              transition-all duration-200
              active:scale-95">    
             <PanelLeft size={20} strokeWidth={1.8} />
          </div>
        )}

        </div>
        ):(
              <div 
              onClick={()=>setCollapsed(!collapsed)}
              style={{
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
                cursor:'pointer'
              }}>
                <Wallet size={20} strokeWidth={2.5} />
              </div>
        )}
        {/* Nav Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap:'0.1rem',marginTop:'2px', position:'absolute',top:'100px'}}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const hasChildren = Boolean(link.children && link.children.length > 0);
              const isChildActive = Boolean(
                link.children?.some(
                  (child) => pathname === child.href || (child.href && pathname.startsWith(child.href + '/'))
                )
              );
              const isActive = link.href
                ? (pathname === link.href || (link.href === '/dashboard' && pathname === '/dashboard/'))
                : isChildActive;

              if (hasChildren && link.children) {
                return (
                  <div key={link.label} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      type="button"
                      onClick={() => {toggleDropdown(link.label),setCollapsed(false)}}
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
                        textAlign: 'start',
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
                      title={collapsed ? getNavLabel(link.label) : undefined}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <Icon size={19} color={isChildActive ? 'var(--accent-primary)' : 'currentColor'} />
                        {!collapsed && <span>{getNavLabel(link.label)}</span>}
                      </div>
                      {!collapsed && (
                        openDropdowns[link.label] ? (
                          <ChevronDown size={16} color={isChildActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                        ) : (
                          <ChevronRight size={16} color="var(--text-secondary)" />
                        )
                      )}
                    </button>

                    {/* Children Sub-links */}
                    {openDropdowns[link.label] && !collapsed && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          marginInlineStart: '1.25rem',
                          paddingInlineStart: '0.75rem',
                          marginTop: '0.35rem',
                          marginBottom: '0.35rem',
                          borderInlineStart: '2px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {link.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isCurrentChildActive =
                            pathname === child.href || (child.href && pathname.startsWith(child.href + '/'));

                          return (
                            <Link
                              key={child.label}
                              href={child.href || '#'}
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
                                <span>{getNavLabel(child.label)}</span>
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
                  href={link.href || '#'}
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
                  title={collapsed ? getNavLabel(link.label) : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <Icon size={19} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                    {!collapsed && <span>{getNavLabel(link.label)}</span>}
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
            flexDirection:collapsed?'column':'row',
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
            <div
            onClick={handleLogout}
            style={{
              gap: '0.75rem',
              width:collapsed? '76%':'15%',
              padding: '0.65rem 0.65rem',
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
            <LogOut size={14} />
            
            </div>
          </div>

          
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
            <LanguageSwitcher />
            {/* Notifications toggle */}
            <Notification
              token={token}
              notifications={notifications}
              setNotifications={setNotifications}
              loadingNotifications={loadingNotifications}
            />
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
            inset-inline-start: -300px;
            top: 0;
            bottom: 0;
            z-index: 100 !important;
            transition: inset-inline-start 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .dashboard-sidebar.open {
            inset-inline-start: 0 !important;
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
