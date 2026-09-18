import React from 'react';
import { Target, AlertTriangle, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { formatCurrency, getCategoryDetails } from '@/utils/dashboardUtils';
import { Budget, CategorySpending } from '@/types';

interface BudgetProgressProps {
  budget?: Budget;
  totalExpenses?: number;
  categorySpending?: CategorySpending[];
  currency?: string;
  rate:number;
  onOpenBudgetModal?: () => void;
}

export default function BudgetProgress({
  budget = { totalBudget: 4500, categoryBudgets: {} },
  totalExpenses = 0,
  categorySpending = [],
  currency = 'USD',
  rate=1,
  onOpenBudgetModal
}: BudgetProgressProps) {
  const totalBudget = (budget.totalBudget || 4500)*rate;
  const spent = totalExpenses;
  const remaining = Math.max(0, totalBudget - spent);
  const percentage = Math.min(100, Math.round((spent / (totalBudget || 1)) * 100));

  // Determine health status and color
  let statusColor = '#10b981';
  let statusLabel = 'On Track';
  let statusBg = 'rgba(16, 185, 129, 0.15)';
  let statusBorder = 'rgba(16, 185, 129, 0.3)';

  if (percentage >= 90) {
    statusColor = '#ef4444';
    statusLabel = percentage >= 100 ? 'Over Budget' : 'Critical Limit';
    statusBg = 'rgba(239, 68, 68, 0.15)';
    statusBorder = 'rgba(239, 68, 68, 0.3)';
  } else if (percentage >= 70) {
    statusColor = '#eab308';
    statusLabel = 'Approaching Limit';
    statusBg = 'rgba(234, 179, 8, 0.15)';
    statusBorder = 'rgba(234, 179, 8, 0.3)';
  }

  // Key budget categories
  const keyCategoryKeys = ['cat-food', 'cat-housing', 'cat-transport', 'cat-shopping'];
  const categoryItems = keyCategoryKeys.map((catKey) => {
    const details = getCategoryDetails(catKey);
    const catSpend = categorySpending.find(c => c.id === catKey)?.amount || 0;
    const catCap = budget.categoryBudgets?.[catKey] || 500;
    const catPercent = Math.min(100, Math.round((catSpend / (catCap || 1)) * 100));
    return {
      id: catKey,
      name: details.name,
      spent: catSpend,
      cap: catCap,
      percent: catPercent,
      color: details.color,
    };
  });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Target size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Monthly Budget Progress
            </h2>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
            Track monthly expense limits and remaining headroom
          </p>
        </div>

      </div>

      {/* Main Budget Bar Card */}
      <div style={{
        padding: '1.25rem',
        background: '#0d0d0d',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spent so far</span>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {(spent).toFixed(2)}{currency}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', marginLeft: '6px' }}>
              / {(totalBudget*rate).toFixed(2)}{currency}
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: statusBg,
              border: `1px solid ${statusBorder}`,
              color: statusColor,
              fontSize: '0.75rem',
              fontWeight: '700',
            }}>
              {percentage >= 90 ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
              <span>{statusLabel} ({percentage}%)</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {formatCurrency(remaining, currency)} remaining
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{
          height: '10px',
          width: '100%',
          background: '#1c1c1c',
          borderRadius: '5px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: `${percentage}%`,
            background: `linear-gradient(90deg, #10b981 0%, ${statusColor} 100%)`,
            borderRadius: '5px',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 12px ${statusColor}66`,
          }} />
        </div>
      </div>

      {/* Sub-Category Budgets Breakdown */}
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Top Category Budgets
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}>
          {categoryItems.map((cat) => (
            <div
              key={cat.id}
              style={{
                padding: '0.75rem',
                background: '#0e0e0e',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.785rem', fontWeight: '600', color: '#ffffff' }}>{cat.name}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: cat.percent > 90 ? '#ef4444' : '#ffffff' }}>
                  {cat.percent}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>{formatCurrency(cat.spent, currency)}</span>
                <span>Cap: {formatCurrency(cat.cap, currency)}</span>
              </div>
              <div style={{ height: '4px', background: '#222222', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${cat.percent}%`,
                  background: cat.color,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
