'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpDown,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions?: Transaction[];
  currency?: string;
  rate: number;
}

export default function RecentTransactions({
  transactions = [],
  rate,
  currency,
}: RecentTransactionsProps) {
  const router = useRouter();
  const { t } = useTranslation();
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
              {t('admin_dashboard.transactions.title')}
            </h2>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
            {t('admin_dashboard.transactions.subtitle')}
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
            {(['all', 'expense', 'income'] as const).map((tab) => {
              const label = tab === 'all'
                ? t('admin_dashboard.transactions.filter_all')
                : tab === 'expense'
                ? t('admin_dashboard.transactions.filter_expense')
                : t('admin_dashboard.transactions.filter_income');
              return (
                <button
                  key={tab.toLocaleUpperCase()}
                  type="button"
                  onClick={() => setFilterType(tab.toLocaleUpperCase())}
                  style={{
                    background: filterType === tab.toLocaleUpperCase() ? 'var(--accent-primary)' : 'transparent',
                    color: filterType === tab.toLocaleUpperCase() ? '#000000' : 'var(--text-secondary)',
                    fontWeight: filterType === tab.toLocaleUpperCase() ? '700' : '500',
                    fontSize: '0.725rem',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.75rem',
              fontSize: '0.75rem',
              gap: '0.3rem',
            }}
          >
            <Link href="/transactions" style={{ textDecoration: 'none', color: 'inherit', padding: 0 }}>
              {t('admin_dashboard.transactions.view_all')}
            </Link>
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
              {t('admin_dashboard.transactions.empty')}
            </p>
          </div>
        ) : (
          displayedTransactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';

            return (
              <div
                key={tx.id}
                onClick={() => router.push(`/transactions/${tx.id}`)}
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
                title={t('admin_dashboard.transactions.view_details_tooltip')}
              >
                {/* Left: Icon & Meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#ffffff' }}>
                        {tx.title || tx.description || t('admin_dashboard.transactions.default_title')}
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
                        {isIncome ? t('admin_dashboard.transactions.type_income') : t('admin_dashboard.transactions.type_expense')}
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
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status & Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ textAlign: 'end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: '800',
                      color: isIncome ? '#10b981' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}>
                      {isIncome ? '+' : '-'} {(tx.amount * rate).toFixed(2)} {currency}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '0.675rem',
                      color: tx.status === 'Pending' ? '#eab308' : '#10b981',
                    }}>
                      {tx.status === 'Pending' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                      <span>{tx.status === 'Pending' ? t('admin_dashboard.transactions.status_pending') : t('admin_dashboard.transactions.status_completed')}</span>
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
