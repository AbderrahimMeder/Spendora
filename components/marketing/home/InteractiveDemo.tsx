import React from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Building,
  Briefcase,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react';
import { formatCurrency } from '@/utils/dashboardUtils';

interface DemoTransaction {
  id: number;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  cat: string;
  date: string;
  icon: LucideIcon;
}

interface DemoCategory {
  name: string;
  percent: string;
  amount: string;
}

export default function InteractiveDemo() {
  const staticData: {
    balance: number;
    income: number;
    expenses: number;
    transactions: DemoTransaction[];
    categories: DemoCategory[];
  } = {
    balance: 4250.00,
    income: 5200.00,
    expenses: 950.00,
    transactions: [
      { id: 1, desc: 'Tech Lead Monthly Salary', amount: 3800.00, type: 'income', cat: 'Salary', date: 'Aug 24', icon: Briefcase },
      { id: 2, desc: 'Apartment Rent & Utilities', amount: 750.00, type: 'expense', cat: 'Housing', date: 'Aug 22', icon: Building },
      { id: 3, desc: 'Freelance Design Project', amount: 1400.00, type: 'income', cat: 'Freelance', date: 'Aug 20', icon: CreditCard },
      { id: 4, desc: 'Supermarket Groceries', amount: 200.00, type: 'expense', cat: 'Groceries', date: 'Aug 18', icon: ShoppingBag },
    ],
    categories: [
      { name: 'Housing & Rent', percent: '55%', amount: '$750.00' },
      { name: 'Groceries & Food', percent: '25%', amount: '$200.00' },
      { name: 'Utilities & Bills', percent: '20%', amount: '$120.00' },
    ],
  };

  return (
    <section id="demo" style={{
      padding: '3.5rem 1.5rem 4.5rem 1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
          Dashboard Preview
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          A glance at your personal financial overview once you log in.
        </p>
      </div>

      {/* Static Mockup Card */}
      <div className="glass-card" style={{
        padding: '1.75rem',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Top 3 Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}>
          {/* Balance */}
          <div style={{
            background: '#0d0d0d',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Balance</span>
              <Wallet size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff' }}>
              {formatCurrency(staticData.balance)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem', fontWeight: '600' }}>
              +14.2% this month
            </div>
          </div>

          {/* Income */}
          <div style={{
            background: '#0d0d0d',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Inflow</span>
              <ArrowDownRight size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#10b981' }}>
              +{formatCurrency(staticData.income)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Salary & Freelance
            </div>
          </div>

          {/* Outflow */}
          <div style={{
            background: '#0d0d0d',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Outflow</span>
              <ArrowUpRight size={16} color="var(--text-secondary)" />
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff' }}>
              -{formatCurrency(staticData.expenses)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Under monthly budget
            </div>
          </div>
        </div>

        {/* 2-Column Overview: Recent Activity & Category Limits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {/* Recent Activity List */}
          <div style={{
            background: '#0d0d0d',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
              Recent Transactions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {staticData.transactions.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#141414',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: item.type === 'income' ? 'rgba(16, 185, 129, 0.12)' : '#1c1c1c',
                        color: item.type === 'income' ? '#10b981' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Icon size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>
                          {item.desc}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {item.cat} • {item.date}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: item.type === 'income' ? '#10b981' : '#ffffff',
                    }}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Allocation */}
          <div style={{
            background: '#0d0d0d',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
                Monthly Spending by Category
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {staticData.categories.map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                      <span>{cat.name}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{cat.amount} ({cat.percent})</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: '#1c1c1c',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: cat.percent,
                        background: '#10b981',
                        borderRadius: '4px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              background: '#141414',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}>
              ✅ You are on track to save <strong style={{ color: '#10b981' }}>$3,300.00</strong> this month.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
