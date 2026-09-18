import React, { useState } from 'react';
import {
  ArrowUpDown,
  Search,
  ExternalLink,
  Plus,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  CircleEllipsis,
  CheckCircle2,
  Clock,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategoryDetails, formatCurrency } from '@/utils/dashboardUtils';
import { Transaction } from '@/types';
import { useAuth } from '@/hooks/auth';
const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  CircleEllipsis,
};

interface RecentTransactionsProps {
  transactions?: Transaction[];
  currency?: string;
  rate?: number;
  onAddTransaction?: (type: 'expense' | 'income') => void;
  onViewAll?: () => void;
}

export default function RecentTransactions({
  transactions = [],
  onAddTransaction,
  rate,
}: RecentTransactionsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    return matchesType;
  });

  const displayedTransactions = filtered.slice(0, 4);

  return (
    <div className="glass-card" style={{
      padding: '1.5rem',
      background: '#121212',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ArrowUpDown size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Recent Transactions
            </h2>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
            Real-time financial activity and cash flows
          </p>
        </div>

        {/* Filter Pills and View All */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            display: 'flex',
            background: '#0a0a0a',
            padding: '0.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            {(['all', 'expense', 'income'] as const).map((t) => (
              <button
                key={t.toLocaleUpperCase()}
                onClick={() => setFilterType(t.toLocaleUpperCase())}
                style={{
                  background: filterType === t.toLocaleUpperCase() ? 'var(--accent-primary)' : 'transparent',
                  color: filterType === t.toLocaleUpperCase() ? '#000000' : 'var(--text-secondary)',
                  fontWeight: filterType === t.toLocaleUpperCase() ? '700' : '500',
                  fontSize: '0.725rem',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              gap: '0.3rem',
            }}
          >
            <Link to="/transactions" style={{ textDecoration: 'none', color: 'inherit', padding: 0 }} >View All</Link>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>


      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {displayedTransactions.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            background: '#0d0d0d',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-subtle)',
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              No transactions match your search or filter.
            </p>
            {onAddTransaction && (
              <button
                onClick={() => onAddTransaction('expense')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
              >
                <Plus size={14} />
                <span>Add First Transaction</span>
              </button>
            )}
          </div>
        ) : (
          displayedTransactions.map((tx) => {
            const cat = getCategoryDetails(tx.categories.name);
            const isIncome = tx.type === 'INCOME';

            return (
              <div
                key={tx.id}
                onClick={() => navigate(`/transactions/${tx.id}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#0e0e0e',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, background 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#151515';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#0e0e0e';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                title="Click to view full transaction details & receipt"
              >
                {/* Left: Icon & Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                        {tx.title || tx.description || 'Transaction'}
                      </span>
                      <span style={{
                        fontSize: '0.675rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: isIncome ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isIncome ? '#10b981' : '#f87171',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}>
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '2px', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      <span>{tx.date}</span>
                      {tx.time && (
                        <>
                          <span>•</span>
                          <span>{tx.time}</span>
                        </>
                      )}
                      <span>•</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{cat.name}</span>

                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status & Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      color: isIncome ? '#10b981' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}>
                      {isIncome ? '+' : '-'} {(tx.amount * rate).toFixed(2)} {user.currency}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.675rem',
                      color: tx.status === 'Pending' ? '#eab308' : '#10b981',
                    }}>
                      {tx.status === 'Pending' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      <span>{tx.status || 'Completed'}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
