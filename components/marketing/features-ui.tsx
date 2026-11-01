'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Sparkles,
  Building2,
  Tag,
  Store,
  BarChart2,
  Target,
  Repeat,
  CheckCircle2,
} from 'lucide-react';

export function FeaturesUI() {
  const { t } = useTranslation();

  const categoryTags = [
    t('features.categories.tags.food'),
    t('features.categories.tags.transport'),
    t('features.categories.tags.shopping'),
    t('features.categories.tags.bills'),
    t('features.categories.tags.entertainment'),
    t('features.categories.tags.travel'),
    t('features.categories.tags.health'),
    t('features.categories.tags.education'),
    t('features.categories.tags.custom'),
  ];

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
            <span>{t('features.hero.badge')}</span>
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
            {t('features.hero.title_part1')} <br />
            <span style={{ color: 'var(--accent-primary)' }}>{t('features.hero.title_part2')}</span>
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
            {t('features.hero.description')}
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
              <span>{t('features.hero.start_free')}</span>
              <ArrowRight size={17} />
            </Link>
            <a
              href="#accounts-feature"
              className="btn btn-secondary"
              style={{ fontSize: '1rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
            >
              <span>{t('features.hero.explore')}</span>
            </a>
          </div>

          {/* Premium Spendora Dashboard Visual */}
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
              textAlign: 'start',
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
                <span style={{ marginLeft: '0.75rem', marginRight: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {t('features.hero.preview.url')}
                </span>
              </div>
              <span className="badge badge-green">{t('features.hero.preview.badge')}</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  {t('features.hero.preview.total_balance')}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>{t('features.hero.preview.currency')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  {t('features.hero.preview.balance_sources')}
                </div>
              </div>

              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  {t('features.hero.preview.monthly_spending')}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{t('features.hero.preview.spending_limit')}</span>
                </div>
                <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                </div>
              </div>

              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  {t('features.hero.preview.active_subscriptions')}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff' }}>
                  350 <span style={{ fontSize: '1rem', color: '#ec4899' }}>{t('features.hero.preview.subscription_rate')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  {t('features.hero.preview.services_tracked')}
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
              <span>{t('features.accounts.badge')}</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              {t('features.accounts.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('features.accounts.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              {t('features.accounts.description')}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: '#ffffff' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-primary)" /> {t('features.accounts.check1')}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-primary)" /> {t('features.accounts.check2')}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-primary)" /> {t('features.accounts.check3')}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--accent-primary)" /> {t('features.accounts.check4')}
              </li>
            </ul>
          </div>

          {/* Visual card */}
          <div className="glass-card" style={{ padding: '2rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{t('features.accounts.cih_bank')}</span>
                <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>8,500 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{t('features.accounts.attijari_bank')}</span>
                <span style={{ fontWeight: '800', color: '#3b82f6' }}>3,200 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: '700', color: '#ffffff' }}>{t('features.accounts.cash')}</span>
                <span style={{ fontWeight: '800', color: '#f59e0b' }}>700 MAD</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('features.accounts.total_combined')}</span>
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
                  { title: t('features.expenses.items.restaurant'), category: t('features.expenses.items.food'), amount: '-120 MAD' },
                  { title: t('features.expenses.items.uber'), category: t('features.expenses.items.transport'), amount: '-45 MAD' },
                  { title: t('features.expenses.items.amazon'), category: t('features.expenses.items.shopping'), amount: '-300 MAD' },
                  { title: t('features.expenses.items.netflix'), category: t('features.expenses.items.subscription'), amount: '-80 MAD' },
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
                <span>{t('features.expenses.badge')}</span>
              </div>

              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
                {t('features.expenses.title_part1')} <br />
                <span style={{ color: 'var(--accent-primary)' }}>{t('features.expenses.title_part2')}</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                {t('features.expenses.description')}
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
            <span>{t('features.categories.badge')}</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            {t('features.categories.title')}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            {t('features.categories.description')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Food */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {t('features.categories.food_title')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('features.categories.restaurant_a')}</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>420 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('features.categories.restaurant_b')}</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>280 MAD</span>
              </div>
            </div>
          </div>

          {/* Shopping */}
          <div className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              {t('features.categories.shopping_title')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('features.categories.amazon')}</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>600 MAD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('features.categories.local_store')}</span>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>250 MAD</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
          {categoryTags.map((cat, idx) => (
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
            <span>{t('features.reports.badge')}</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            {t('features.reports.title')}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            {t('features.reports.description')}
          </p>

          {/* Reports Preview Card */}
          <div className="glass-card" style={{ padding: '2.5rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)', textAlign: 'start' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('features.reports.top_category_label')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginTop: '0.2rem' }}>
                  {t('features.reports.top_category_value')}
                </div>
              </div>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('features.reports.top_merchant_label')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                  {t('features.reports.top_merchant_value')}
                </div>
              </div>
              <div style={{ background: '#141414', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('features.reports.primary_source_label')}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3b82f6', marginTop: '0.2rem' }}>
                  {t('features.reports.primary_source_value')}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              {t('features.reports.charts_footer')}
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
              <span>{t('features.budgets.badge')}</span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: '800', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
              {t('features.budgets.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('features.budgets.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              {t('features.budgets.description')}
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: '#0d0d0d', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-hover)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>{t('features.budgets.food_budget')}</span>
              <span className="badge badge-green">{t('features.budgets.used_badge')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('features.budgets.budget_label')}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff' }}>1,500 MAD</div>
              </div>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('features.budgets.spent_label')}</div>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f59e0b' }}>1,120 MAD</div>
              </div>
              <div style={{ background: '#141414', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('features.budgets.remaining_label')}</div>
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
              <span>{t('features.subscriptions.badge')}</span>
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
              {t('features.subscriptions.title')}
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
              {t('features.subscriptions.description')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {[
              { name: t('features.subscriptions.netflix'), price: `50 ${t('features.subscriptions.per_month')}` },
              { name: t('features.subscriptions.spotify'), price: `60 ${t('features.subscriptions.per_month')}` },
              { name: t('features.subscriptions.gym'), price: `200 ${t('features.subscriptions.per_month')}` },
              { name: t('features.subscriptions.cloud'), price: `40 ${t('features.subscriptions.per_month')}` },
            ].map((sub, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.5rem', background: '#0e0e0e', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>{sub.name}</h4>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)', marginTop: '0.3rem' }}>{sub.price}</div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem 2rem', background: '#111111', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1.5rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('features.subscriptions.monthly_label')}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ec4899' }}>{t('features.subscriptions.monthly_value')}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('features.subscriptions.yearly_label')}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>{t('features.subscriptions.yearly_value')}</div>
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
              {t('features.cta.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('features.cta.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              {t('features.cta.description')}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}>
                <span>{t('features.cta.button')}</span>
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
