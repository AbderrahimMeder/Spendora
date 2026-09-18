'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  Building2,
  CreditCard,
  Banknote,
  Tag,
  Store,
  Calendar,
  BarChart2,
  PieChart,
  Target,
  Repeat,
  ShieldCheck,
  Lock,
  Eye,
  Sliders,
  Globe,
  Search,
  Filter,
  Clock,
  Laptop,
  Cpu,
  Zap,
  TrendingUp,
  TrendingDown,
  Layers,
  Smartphone,
  CheckCircle2,
  Coffee,
  Car,
  ShoppingBag,
  Tv,
  Activity,
  ChevronRight,
  Coins,
  Flame,
  FolderPlus,
  BellRing,
  Monitor,
  Check,
} from 'lucide-react';

interface CurrencyRate {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

interface TransactionItem {
  merchant: string;
  desc: string;
  category: string;
  amount: number;
  date: string;
}

export function FeaturesUI() {
  // Interactive state
  const [selectedCurrency, setSelectedCurrency] = useState<string>('MAD');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Currency multiplier & symbol simulation
  const currencies: CurrencyRate[] = [
    { code: 'MAD', symbol: 'MAD', rate: 1, label: 'Moroccan Dirham' },
    { code: 'EUR', symbol: '€', rate: 0.092, label: 'Euro' },
    { code: 'USD', symbol: '$', rate: 0.10, label: 'US Dollar' },
    { code: 'GBP', symbol: '£', rate: 0.078, label: 'British Pound' },
    { code: 'JPY', symbol: '¥', rate: 15.2, label: 'Japanese Yen' },
  ];

  const currentRate = currencies.find((c) => c.code === selectedCurrency)?.rate || 1;
  const currentSymbol = currencies.find((c) => c.code === selectedCurrency)?.symbol || 'MAD';

  const formatAmount = (madAmount: number) => {
    const converted = Math.round(madAmount * currentRate);
    return `${converted.toLocaleString()} ${currentSymbol}`;
  };

  // Search & Filter dataset
  const searchTransactions: TransactionItem[] = [
    { merchant: 'Amazon', desc: 'Tech gadgets & accessories', category: 'Shopping', amount: -300, date: 'Aug 24' },
    { merchant: 'Amazon Prime', desc: 'Annual video membership', category: 'Subscription', amount: -150, date: 'Aug 10' },
    { merchant: 'Amazon Kindle', desc: 'E-book purchase', category: 'Education', amount: -420, date: 'Jul 28' },
    { merchant: 'Restaurant La Table', desc: 'Team business dinner', category: 'Food', amount: -120, date: 'Aug 26' },
    { merchant: 'Uber Trip', desc: 'Airport ride', category: 'Transport', amount: -45, date: 'Aug 25' },
    { merchant: 'Netflix', desc: '4K monthly stream', category: 'Subscription', amount: -80, date: 'Aug 22' },
  ];

  const filteredTransactions = searchTransactions.filter((tx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.merchant.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q) ||
      tx.desc.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* =========================================================================
          01. HERO SECTION
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem 3.5rem 1.5rem',
          maxWidth: '1150px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--accent-light)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 1rem',
              marginBottom: '1.75rem',
              fontSize: '0.825rem',
              color: 'var(--accent-primary)',
              fontWeight: '700',
            }}
          >
            <Sparkles size={14} />
            <span>Finora Features Suite</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.35rem',
            }}
          >
            Everything you need to <br />
            <span style={{ color: 'var(--accent-primary)' }}>understand your money.</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            From everyday expenses to accounts, subscriptions, budgets, and reports — Finora brings your financial activity together in one clear place.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ fontSize: '1rem', padding: '0.8rem 2rem', textDecoration: 'none' }}
            >
              <span>Start for Free</span>
              <ArrowRight size={17} />
            </Link>
            <a
              href="#accounts-feature"
              className="btn btn-secondary"
              style={{ fontSize: '1rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Premium Finora Dashboard Visual */}
          <div
            className="glass-card"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: '1.75rem',
              background: '#0d0d0d',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.08)',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  finora.app/overview
                </span>
              </div>
              <span className="badge badge-green">One Unified Workspace</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Total Net Balance</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>MAD</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  CIH Bank + Attijariwafa + Cash
                </div>
              </div>

              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Monthly Spending</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 4,500 MAD</span>
                </div>
                <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                </div>
              </div>

              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Active Subscriptions</div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  350 <span style={{ fontSize: '1rem', color: '#ec4899' }}>MAD / mo</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  4 recurring services tracked
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02. ACCOUNTS
      ========================================================================== */}
      <section id="accounts-feature" style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              <Building2 size={16} />
              <span>Multi-Account Aggregation</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              All your money, <br />
              <span style={{ color: 'var(--accent-primary)' }}>in one place.</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Stop checking different places to understand your money. Bring your bank accounts, savings, and physical cash together with Finora.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#ffffff' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Multiple accounts & banks</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Physical cash tracking</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Individual & aggregated balances</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={16} color="var(--accent-primary)" /> Account-filtered activity stream</li>
            </ul>
          </div>

          {/* Visual card */}
          <div className="glass-card" style={{ padding: '2rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>CIH Bank</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>8,500 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>Attijariwafa Bank</span>
                <span style={{ fontWeight: '800', color: '#3b82f6' }}>3,200 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>Cash</span>
                <span style={{ fontWeight: '800', color: '#f59e0b' }}>700 MAD</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Combined Balance</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>12,400 MAD</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03. EXPENSES
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: '#090909',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Visual Stream */}
            <div className="glass-card" style={{ padding: '2rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { title: 'Restaurant', category: 'Food', amount: '-120 MAD' },
                  { title: 'Uber', category: 'Transport', amount: '-45 MAD' },
                  { title: 'Amazon', category: 'Shopping', amount: '-300 MAD' },
                  { title: 'Netflix', category: 'Subscription', amount: '-80 MAD' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#141414', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{item.category}</div>
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: '#ef4444' }}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Narrative */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                <Tag size={16} />
                <span>Expense Intelligence</span>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
                See every expense. <br />
                <span style={{ color: 'var(--accent-primary)' }}>Understand every habit.</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                Every purchase tells a story. Finora helps you understand yours with full context including amount, category, merchant, date, account, and notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04. CATEGORIES & MERCHANTS
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
            <Store size={16} />
            <span>Habits & Locations</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            Know what you're spending on — and where.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            Understand the habits behind your spending. Group expenses into structured categories and see which merchants receive your money.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Food */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Food
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Restaurant A</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>420 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Restaurant B</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>280 MAD</span>
              </div>
            </div>
          </div>

          {/* Shopping */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              Shopping
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Amazon</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>600 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Local Store</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>250 MAD</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
          {['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Travel', 'Health', 'Education', '+ Custom Categories'].map((cat, idx) => (
            <span key={idx} className="badge badge-dark" style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================================
          05. REPORTS
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: '#090909',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
            <BarChart2 size={16} />
            <span>Visual Analytics</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            See the bigger picture.
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            Turn hundreds of transactions into insights you can actually understand across daily, weekly, monthly, and yearly timeframes.
          </p>

          {/* Reports Preview Card */}
          <div className="glass-card" style={{ padding: '2.5rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)', textAlign: 'left' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Category</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>Food & Dining (38%)</div>
              </div>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Top Merchant</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>Marjane (850 MAD)</div>
              </div>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Spending Source</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3b82f6', marginTop: '0.2rem' }}>CIH Bank (68%)</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Charts: Bar Charts · Line Charts · Donut Charts · Summary Cards
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          06. BUDGETS
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              <Target size={16} />
              <span>Limits & Controls</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              Stay on track with <br />
              <span style={{ color: 'var(--accent-primary)' }}>your spending.</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Set your limits. Track your progress. Stay in control. Plan your spending ahead and compare planned vs actual budgets every month.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>Food Budget</span>
              <span className="badge badge-green">74.6% used</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Budget</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>1,500 MAD</div>
              </div>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Spent</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f59e0b' }}>1,120 MAD</div>
              </div>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remaining</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-primary)' }}>380 MAD</div>
              </div>
            </div>

            <div style={{ height: '8px', background: '#1f1f1f', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '74.6%', height: '100%', background: 'linear-gradient(90deg, #10b981, #f59e0b)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07. SUBSCRIPTIONS
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem',
          background: '#090909',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#ec4899', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
              <Repeat size={16} />
              <span>Recurring Tracker</span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
              Never lose track of what you're paying for.
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
              Small payments can add up. Finora helps you see the full cost of all recurring subscriptions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { name: 'Netflix', price: '50 MAD / month' },
              { name: 'Spotify', price: '60 MAD / month' },
              { name: 'Gym', price: '200 MAD / month' },
              { name: 'Cloud Storage', price: '40 MAD / month' },
            ].map((sub, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>{sub.name}</h4>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.3rem' }}>{sub.price}</div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem 2rem', background: '#111111', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly Subscriptions</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ec4899' }}>350 MAD / month</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yearly Cost</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>4,200 MAD / year</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          08. FINAL CTA
      ========================================================================== */}
      <section style={{ padding: '6rem 1.5rem 3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            background: 'linear-gradient(180deg, #121212 0%, #080808 100%)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
              Know your money. <br />
              <span style={{ color: 'var(--accent-primary)' }}>Own your decisions.</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              Start understanding where your money goes, organize your spending, and take control of your financial life.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}>
                <span>Start Using Finora — Free</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesUI;
