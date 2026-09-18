import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { Transaction, ExpenseEvolutionPoint } from '../../types';

interface ExpenseChartProps {
  transactions?: Transaction[];
  currency?: string;
}

interface PointWithCoords extends ExpenseEvolutionPoint {
  x: number;
  y: number;
}

export default function ExpenseChart({ transactions = [], currency = 'USD' }: ExpenseChartProps) {
  const [timeframe, setTimeframe] = useState('30d');
  const [hoveredPoint, setHoveredPoint] = useState<PointWithCoords | null>(null);

  const data =[];

  const maxExpense = Math.max(...data.map(d => d.amount), 1);
  const avgExpense = Math.round(data.reduce((acc, d) => acc + d.amount, 0) / (data.length || 1));
  const peakPoint = data.reduce((prev, current) => (prev.amount > current.amount) ? prev : current, data[0]);

  // SVG dimensions
  const chartHeight = 220;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 25;

  const points: PointWithCoords[] = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.amount / maxExpense) * (chartHeight - paddingY * 2);
    return { ...d, x, y };
  });

  // SVG path generation
  const linePath = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    // Cubic bezier smoothing
    const prev = points[index - 1];
    const cpX1 = prev.x + (point.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (point.x - prev.x) / 2;
    const cpY2 = point.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point.x} ${point.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const timeframes = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '1y', label: '1 Year' },
  ];

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
      {/* Chart Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <BarChart2 size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Expenses Overview
            </h2>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
            Evolution of spending across selected time horizons
          </p>
        </div>

        {/* Timeframe pill tabs */}
        <div style={{
          display: 'flex',
          background: '#0a0a0a',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          gap: '0.25rem',
        }}>
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setTimeframe(tf.key)}
              style={{
                background: timeframe === tf.key ? 'var(--accent-primary)' : 'transparent',
                color: timeframe === tf.key ? '#000000' : 'var(--text-secondary)',
                fontWeight: timeframe === tf.key ? '700' : '500',
                fontSize: '0.75rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row: Peak, Average, Trend */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: '#0d0d0d',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Average Spending</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
            {0}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Peak Expense</div>
          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ef4444' }}>
            {0}
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '4px' }}>({peakPoint?.label})</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Area */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const lineY = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={lineY}
                  x2={chartWidth - paddingX}
                  y2={lineY}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={lineY + 3}
                  textAnchor="end"
                  fill="#555555"
                  fontSize="9"
                  fontFamily="var(--font-main)"
                >
                  {0}
                </text>
              </g>
            );
          })}

          {/* Base Axis line */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="rgba(255, 255, 255, 0.1)"
          />

          {/* Area Fill */}
          {areaPath && <path d={areaPath} fill="url(#expenseGradient)" />}

          {/* Smooth Line Stroke */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points & X Labels */}
          {points.map((p, index) => {
            const isHovered = hoveredPoint?.label === p.label;
            const isPeak = peakPoint?.label === p.label;

            return (
              <g key={index}>
                {isHovered && (
                  <line
                    x1={p.x}
                    y1={paddingY}
                    x2={p.x}
                    y2={chartHeight - paddingY}
                    stroke="rgba(16, 185, 129, 0.4)"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : isPeak ? 4.5 : 3.5}
                  fill={isPeak ? '#ef4444' : '#10b981'}
                  stroke="#0d0d0d"
                  strokeWidth="2"
                  style={{
                    cursor: 'pointer',
                    transition: 'r 0.15s ease',
                  }}
                  onMouseEnter={() => setHoveredPoint(p)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                <text
                  x={p.x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#777777'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '400'}
                  fontFamily="var(--font-main)"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#181818',
              border: '1px solid var(--accent-primary)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              borderRadius: 'var(--radius-md)',
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {hoveredPoint.date || hoveredPoint.label}:
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
              {0}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
