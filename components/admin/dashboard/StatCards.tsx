'use client';
import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  Sparkles,
  LucideIcon
} from 'lucide-react';
import { DashboardStats } from '@/types';
interface StatCardsProps {
  stats?: Partial<DashboardStats>;
  currency?: string;
}

interface StatCardConfig {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  formattedAmount: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  badge: {
    text: string;
    type: 'positive' | 'neutral' | 'highlight';
  };
  gradient: string;
}

export default function StatCards({ stats, currency }: StatCardsProps) {
  const {
    totalBalance = 0,
    totalIncome = 0,
    totalExpenses = 0,
    savings = 0,
    savingsRate = '0.0',
    Incomerate = 0.0,
    totalbalancerate =0.0
  } =stats?? {};
  const cards: StatCardConfig[] = [
    {
      id: 'balance',
      title: 'in your wallet',
      subtitle: 'Available Net Worth',
      amount: totalBalance,
      formattedAmount: `${Number(totalBalance).toFixed(2)} ${currency} `,
      icon: Wallet,
      iconColor: '#10b981',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      badge: {
        text: `${totalbalancerate.toFixed(2)}% up from last month`,
        type: 'positive',
      },
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
    },
    {
      id: 'income',
      title: 'This month Income',
      subtitle: 'Revenue & Inflows',
      amount: totalIncome,
      formattedAmount: `${Number(totalIncome).toFixed(2)} ${currency} `,
      icon: TrendingUp,
      iconColor: '#3b82f6',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      badge: {
        text: `${Incomerate.toFixed(2)}% inflow`,
        type: 'positive',
      },
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
    },
    {
      id: 'expenses',
      title: 'This Month Expense',
      subtitle: 'Outflows & Bills',
      amount: totalExpenses,
      formattedAmount: ` ${Number(totalExpenses).toFixed(2)} ${currency} `,
      icon: TrendingDown,
      iconColor: '#ef4444',
      iconBg: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      badge: {
        text: '-3.1% spent vs target',
        type: 'neutral',
      },
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
    },
    {
      id: 'savings',
      title: 'Savings & Buffer',
      subtitle: 'Net Stash Rate',
      amount: savings,
      formattedAmount: `${Number(savings).toFixed(2)} ${currency} `,
      icon: PiggyBank,
      iconColor: '#8b5cf6',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      badge: {
        text: `${savingsRate}% savings rate`,
        type: 'highlight',
      },
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(20, 20, 20, 0.6) 100%)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem',
    }}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="glass-card"
            style={{
              padding: '1.4rem 1.35rem',
              background: card.gradient,
              border: `1px solid ${card.borderColor}`,
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 12px 28px rgba(0, 0, 0, 0.5)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Top row: Label & Icon */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span style={{
                  fontSize: '0.785rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '2px',
                }}>
                  {card.title}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {card.subtitle}
                </span>
              </div>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.iconColor,
                flexShrink: 0,
                border: `1px solid ${card.borderColor}`,
              }}>
                <Icon size={21} strokeWidth={2.2} />
              </div>
            </div>

            {/* Middle: Big Amount Display */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                fontSize: '1.85rem',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}>
                {card.formattedAmount}
              </div>
            </div>

            {/* Bottom Row: Contextual Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                background: card.badge.type === 'positive'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : card.badge.type === 'highlight'
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'rgba(255, 255, 255, 0.06)',
                color: card.badge.type === 'positive'
                  ? '#34d399'
                  : card.badge.type === 'highlight'
                  ? '#a78bfa'
                  : 'var(--text-secondary)',
                border: card.badge.type === 'positive'
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : card.badge.type === 'highlight'
                  ? '1px solid rgba(139, 92, 246, 0.3)'
                  : '1px solid var(--border-subtle)',
              }}>
                {card.badge.type === 'positive' && <ArrowUpRight size={13} />}
                {card.badge.type === 'highlight' && <Sparkles size={13} />}
                <span>{card.badge.text}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
