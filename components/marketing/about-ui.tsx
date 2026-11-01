'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  PieChart,
  Repeat,
  BarChart2,
  Shield,
  Lock,
  Eye,
  Sliders,
  LucideIcon,
} from 'lucide-react';

interface PrincipleItem {
  title: string;
  quote: string;
  desc: string;
  icon: LucideIcon;
}

export function AboutUs() {
  const { t } = useTranslation();

  // Principles
  const principles: PrincipleItem[] = [
    {
      title: t('about.principles.simplicity.title'),
      quote: t('about.principles.simplicity.quote'),
      desc: t('about.principles.simplicity.desc'),
      icon: Sparkles,
    },
    {
      title: t('about.principles.transparency.title'),
      quote: t('about.principles.transparency.quote'),
      desc: t('about.principles.transparency.desc'),
      icon: Eye,
    },
    {
      title: t('about.principles.privacy.title'),
      quote: t('about.principles.privacy.quote'),
      desc: t('about.principles.privacy.desc'),
      icon: Shield,
    },
    {
      title: t('about.principles.security.title'),
      quote: t('about.principles.security.quote'),
      desc: t('about.principles.security.desc'),
      icon: Lock,
    },
    {
      title: t('about.principles.control.title'),
      quote: t('about.principles.control.quote'),
      desc: t('about.principles.control.desc'),
      icon: Sliders,
    },
    {
      title: t('about.principles.clarity.title'),
      quote: t('about.principles.clarity.quote'),
      desc: t('about.principles.clarity.desc'),
      icon: PieChart,
    },
  ];

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden' }}>
      {/* =========================================================================
          SECTION 01: HERO SECTION
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem 1.5rem',
          maxWidth: '1150px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient decoration */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-light)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1.1rem',
              marginBottom: '1.75rem',
              fontSize: '0.825rem',
              color: 'var(--accent-primary)',
              fontWeight: '700',
              letterSpacing: '0.02em',
            }}
          >
            <Sparkles size={15} />
            <span>{t('about.hero.badge')}</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.4rem',
            }}
          >
            {t('about.hero.title_part1')} <br />
            <span style={{ color: 'var(--accent-primary)' }}>
              {t('about.hero.title_part2')}
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            {t('about.hero.description')}
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 1.8rem', textDecoration: 'none' }}
            >
              <span>{t('about.hero.get_started')}</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#the-problem"
              className="btn btn-secondary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
            >
              <span>{t('about.hero.explore')}</span>
            </a>
          </div>

          {/* Dashboard Preview Visual */}
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
            {/* Window bar */}
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
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.75rem', marginRight: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {t('about.hero.preview.url')}
                </span>
              </div>
              <span className="badge badge-green">{t('about.hero.preview.badge')}</span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Card 1: Total Balance */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>{t('about.hero.preview.total_balance')}</span>
                  <Wallet size={16} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '600' }}>{t('about.hero.preview.currency')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <TrendingUp size={13} />
                  <span>{t('about.hero.preview.balance_breakdown')}</span>
                </div>
              </div>

              {/* Card 2: Monthly Spending */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>{t('about.hero.preview.monthly_spending')}</span>
                  <BarChart2 size={16} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('about.hero.preview.spending_limit')}</span>
                </div>
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Card 3: Active Subscriptions */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>{t('about.hero.preview.active_subscriptions')}</span>
                  <Repeat size={16} color="#ec4899" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  350 <span style={{ fontSize: '1rem', color: '#ec4899', fontWeight: '600' }}>{t('about.hero.preview.subscription_rate')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  {t('about.hero.preview.services_monitored')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: THE PROBLEM
      ========================================================================== */}
      <section
        id="the-problem"
        style={{
          padding: '5rem 1.5rem',
          background: '#090909',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f59e0b',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.65rem',
              }}
            >
              <AlertCircle size={15} />
              <span>{t('about.problem.badge')}</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                maxWidth: '750px',
                margin: '0 auto 1rem auto',
              }}
            >
              {t('about.problem.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('about.problem.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              {t('about.problem.description')}
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: PRINCIPLES
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {t('about.principles.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            {t('about.principles.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  background: '#0e0e0e',
                  textAlign: 'start',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600', fontStyle: 'italic' }}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: FINAL CTA
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
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
              {t('about.cta.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('about.cta.title_part2')}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              {t('about.cta.description')}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}>
                <span>{t('about.cta.button')}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
