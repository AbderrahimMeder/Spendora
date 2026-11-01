'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  ArrowRight,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface MonthlyDataPoint {
  label: string;
  spend: number;
  income: number;
  savings: number;
}

export function ReportsUI() {
  const { t } = useTranslation();
  // Interactive Controls State
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('monthly');

  // Time-series mock data
  const monthlyData: MonthlyDataPoint[] = [
    { label: 'Jan', spend: 3200, income: 14000, savings: 10800 },
    { label: 'Feb', spend: 3850, income: 14000, savings: 10150 },
    { label: 'Mar', spend: 2900, income: 14500, savings: 11600 },
    { label: 'Apr', spend: 4100, income: 14500, savings: 10400 },
    { label: 'May', spend: 3450, income: 14500, savings: 11050 },
    { label: 'Jun', spend: 3700, income: 15000, savings: 11300 },
    { label: 'Jul', spend: 3850, income: 15000, savings: 11150 },
    { label: 'Aug', spend: 3120, income: 15000, savings: 11880 },
  ];

  const maxSpend = Math.max(...monthlyData.map((d) => d.spend));

  const timeframes = [
    { id: 'daily', label: t('reports.hero.timeframes.daily') },
    { id: 'weekly', label: t('reports.hero.timeframes.weekly') },
    { id: 'monthly', label: t('reports.hero.timeframes.monthly') },
    { id: 'quarterly', label: t('reports.hero.timeframes.quarterly') },
    { id: 'yearly', label: t('reports.hero.timeframes.yearly') },
  ];

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden', background: '#070707' }}>
      {/* =========================================================================
          01. HERO SECTION: See the bigger picture
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem 1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Luminous cyan/emerald backdrop glow */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(0,0,0,0) 80%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Header pill badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1.1rem',
              marginBottom: '1.75rem',
              fontSize: '0.825rem',
              color: '#38bdf8',
              fontWeight: '700',
              letterSpacing: '0.02em',
            }}
          >
            <BarChart3 size={15} />
            <span>{t('reports.hero.badge')}</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              fontWeight: '800',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.35rem',
            }}
          >
            {t('reports.hero.title_part1')}{' '}
            <span style={{ background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t('reports.hero.title_part2')}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto 2.75rem auto',
            }}
          >
            {t('reports.hero.description')}
          </p>

          {/* Live Interactive Analytics Preview Workbench */}
          <div
            className="glass-card"
            style={{
              maxWidth: '1050px',
              margin: '0 auto',
              padding: '2rem',
              background: 'linear-gradient(180deg, #0e0e0e 0%, #090909 100%)',
              border: '1px solid #1f1f1f',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(16, 185, 129, 0.06)',
              textAlign: 'start',
            }}
          >
            {/* Top Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('reports.hero.studio_label')}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>
                  {t('reports.hero.studio_title')}
                </div>
              </div>

              {/* Timeframe selector */}
              <div
                style={{
                  display: 'inline-flex',
                  background: '#141414',
                  padding: '0.3rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #222222',
                  gap: '0.25rem',
                }}
              >
                {timeframes.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setSelectedTimeframe(tf.id)}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedTimeframe === tf.id ? 'var(--accent-primary)' : 'transparent',
                      color: selectedTimeframe === tf.id ? '#000000' : 'var(--text-secondary)',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Core Summary Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ background: '#121212', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reports.hero.kpis.cash_inflow')}</div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                  +15,000 <span style={{ fontSize: '0.85rem' }}>MAD</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ArrowUpRight size={13} /> {t('reports.hero.kpis.cash_inflow_change')}
                </div>
              </div>

              <div style={{ background: '#121212', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reports.hero.kpis.monthly_spend')}</div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
                  3,120 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>MAD</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ArrowDownRight size={13} /> {t('reports.hero.kpis.monthly_spend_change')}
                </div>
              </div>

              <div style={{ background: '#121212', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reports.hero.kpis.savings_rate')}</div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#38bdf8', marginTop: '0.2rem' }}>
                  79.2% <span style={{ fontSize: '0.85rem' }}>{t('reports.hero.kpis.savings_rate_sub')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {t('reports.hero.kpis.savings_goal')}
                </div>
              </div>

              <div style={{ background: '#121212', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reports.hero.kpis.daily_burn')}</div>
                <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>
                  104 <span style={{ fontSize: '0.85rem' }}>{t('reports.hero.kpis.daily_burn_unit')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {t('reports.hero.kpis.budget_zone')}
                </div>
              </div>
            </div>

            {/* Interactive Multi-Bar Chart Visualizer */}
            <div style={{ background: '#111111', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #1a1a1a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                  {t('reports.hero.chart.title')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {t('reports.hero.chart.legend')}
                </span>
              </div>

              {/* Bars container */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '0.75rem', alignItems: 'flex-end', height: '180px', paddingBottom: '1.5rem', borderBottom: '1px solid #222222' }}>
                {monthlyData.map((d, idx) => {
                  const spendHeight = (d.spend / maxSpend) * 100;
                  const isCurrent = idx === monthlyData.length - 1;
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.7rem', color: isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '700' }}>
                        {d.spend}
                      </span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '32px',
                          height: `${spendHeight}%`,
                          background: isCurrent ? 'linear-gradient(180deg, #10b981 0%, #059669 100%)' : '#262626',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease',
                          boxShadow: isCurrent ? '0 0 15px rgba(16, 185, 129, 0.4)' : 'none',
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: isCurrent ? '#ffffff' : 'var(--text-muted)', fontWeight: isCurrent ? '800' : '600' }}>
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02. FROM TRANSACTIONS TO UNDERSTANDING
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
              <Zap size={16} />
              <span>{t('reports.pipeline.badge')}</span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
              {t('reports.pipeline.title')}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
              {t('reports.pipeline.description')}
            </p>
          </div>

          {/* Side by side pipeline visualization */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Raw transactions */}
            <div className="glass-card" style={{ padding: '2rem', background: '#0e0e0e', borderRadius: 'var(--radius-lg)', border: '1px solid #222222', textAlign: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>
                  {t('reports.pipeline.before_title')}
                </span>
                <span className="badge badge-dark">{t('reports.pipeline.before_badge')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontFamily: 'monospace', fontSize: '0.825rem' }}>
                <div style={{ background: '#141414', padding: '0.65rem 0.85rem', borderRadius: '4px', color: '#888888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>POS TXN 49182 REST CLT</span>
                  <span style={{ color: '#ef4444' }}>-120 MAD</span>
                </div>
                <div style={{ background: '#141414', padding: '0.65rem 0.85rem', borderRadius: '4px', color: '#888888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>ONLINE PAY 9012 ECOM MRKT</span>
                  <span style={{ color: '#ef4444' }}>-950 MAD</span>
                </div>
                <div style={{ background: '#141414', padding: '0.65rem 0.85rem', borderRadius: '4px', color: '#888888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>AUTODEBIT REC SUB SC01</span>
                  <span style={{ color: '#ef4444' }}>-350 MAD</span>
                </div>
                <div style={{ background: '#141414', padding: '0.65rem 0.85rem', borderRadius: '4px', color: '#888888', display: 'flex', justifyContent: 'space-between' }}>
                  <span>GAB CASH WDL BR 04</span>
                  <span style={{ color: '#ef4444' }}>-700 MAD</span>
                </div>
              </div>
            </div>

            {/* Clear insight */}
            <div className="glass-card" style={{ padding: '2rem', background: '#0e0e0e', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-border)', textAlign: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                  {t('reports.pipeline.after_title')}
                </span>
                <span className="badge badge-green">{t('reports.pipeline.after_badge')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ background: '#141414', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>Restaurant La Table</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)' }}>{t('reports.pipeline.food_category')}</div>
                  </div>
                  <span style={{ fontWeight: '800', color: '#ffffff' }}>120 MAD</span>
                </div>
                <div style={{ background: '#141414', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>Marjane Groceries</div>
                    <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>{t('reports.pipeline.household_category')}</div>
                  </div>
                  <span style={{ fontWeight: '800', color: '#ffffff' }}>950 MAD</span>
                </div>
                <div style={{ background: '#141414', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#ffffff', fontSize: '0.9rem' }}>{t('reports.pipeline.subscriptions_title')}</div>
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b' }}>{t('reports.pipeline.subscriptions_category')}</div>
                  </div>
                  <span style={{ fontWeight: '800', color: '#ffffff' }}>350 MAD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          03. FINAL CTA
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem 3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
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
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 50%, rgba(0,0,0,0) 70%)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
              {t('reports.cta.title_part1')}{' '}
              <span style={{ color: 'var(--accent-primary)' }}>{t('reports.cta.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              {t('reports.cta.description')}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}>
                <span>{t('reports.cta.button')}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {t('reports.cta.guarantee')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportsUI;
