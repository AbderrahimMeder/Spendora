import React, { useState } from 'react';
import {
  PieChart,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  CircleEllipsis,
  Tag,
  LucideIcon
} from 'lucide-react';
import { computeCategorySpending, formatCurrency } from '@/utils/dashboardUtils';
import { Transaction } from '@/types';

const ICON_COMPONENTS: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  CircleEllipsis,
};

interface CategoryBreakdownProps {
  transactions?: Transaction[];
  currency?: string;
}

export default function CategoryBreakdown({ transactions = [], currency = 'USD' }: CategoryBreakdownProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const categories = computeCategorySpending(transactions);
  const totalExpense = categories.reduce((acc, cat) => acc + cat.amount, 0);

  // SVG Donut Chart Calculation
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  return (
    <div className="glass-card" style={{
      padding: '1.5rem',
      background: '#121212',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      height: '100%',
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <PieChart size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Spending by Category
            </h2>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
            Distribution of expenses across core categories
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          color: 'var(--accent-primary)',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}>
          {categories.length} Categories
        </span>
      </div>

      {/* Donut Chart & Center Summary */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0.5rem 0',
      }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#1c1c1c"
            strokeWidth={strokeWidth}
          />

          {categories.map((cat) => {
            const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += cat.percentage;
            const isHovered = hoveredCategory === cat.id;

            return (
              <circle
                key={cat.id}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${center} ${center})`}
                style={{
                  cursor: 'pointer',
                  transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredCategory && !isHovered ? 0.45 : 1,
                }}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center Display */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {hoveredCategory ? categories.find(c => c.id === hoveredCategory)?.name : 'Total Spend'}
          </span>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            {hoveredCategory
              ? formatCurrency(categories.find(c => c.id === hoveredCategory)?.amount || 0, currency)
              : formatCurrency(totalExpense, currency)}
          </span>
          <span style={{ fontSize: '0.675rem', color: 'var(--accent-primary)', fontWeight: '700' }}>
            {hoveredCategory
              ? `${categories.find(c => c.id === hoveredCategory)?.percentage}%`
              : '100%'}
          </span>
        </div>
      </div>

      {/* Category List with Progress Bars */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        maxHeight: '260px',
        overflowY: 'auto',
        paddingRight: '0.25rem',
      }}>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No expense categories recorded yet.
          </div>
        ) : (
          categories.map((cat) => {
            const IconComponent = ICON_COMPONENTS[cat.icon] || Tag;
            const isHovered = hoveredCategory === cat.id;

            return (
              <div
                key={cat.id}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isHovered ? '#1c1c1c' : '#141414',
                  border: `1px solid ${isHovered ? cat.color : 'var(--border-subtle)'}`,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: cat.bg,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <IconComponent size={14} />
                    </div>
                    <span style={{ fontSize: '0.825rem', fontWeight: '600', color: '#ffffff' }}>
                      {cat.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                      {formatCurrency(cat.amount, currency)}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      ({cat.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '4px',
                  width: '100%',
                  background: '#222222',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${cat.percentage}%`,
                    background: cat.color,
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
