import React from 'react';
import { Calendar, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { CURRENCIES } from '../../data/initialData';

interface OverviewHeaderProps {
  userName?: string;
  selectedPeriod?: string;
  setSelectedPeriod?: (period: string) => void;
  currency?: string;
  setCurrency?: (currency: string) => void;
  onAddExpense?: () => void;
  onAddIncome?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function OverviewHeader({
  userName,
  onRefresh,
  isRefreshing
}: OverviewHeaderProps) {

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.25rem',
      marginBottom: '2rem',
      paddingBottom: '1.25rem',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Left: Greeting */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <h1 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            margin: 0,
          }}>
            Welcome back <span style={{ color: 'var(--accent-primary)', marginLeft: '5px' }}>{userName || ''}</span>
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn-icon"
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              background: '#141414',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Refresh statistics"
          >
            <RefreshCw
              size={15}
              style={{
                animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none',
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
