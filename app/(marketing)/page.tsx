'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  ArrowRight,
  Building2,
  CreditCard,
  Banknote,
  BarChart2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  city: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export default function Home() {
  const { t } = useTranslation();

  // Testimonial Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Testimonials Data
  const testimonials: TestimonialItem[] = [
    {
      quote: t('home.testimonials.item1.quote'),
      name: t('home.testimonials.item1.name'),
      role: t('home.testimonials.item1.role'),
      city: t('home.testimonials.item1.city'),
    },
    {
      quote: t('home.testimonials.item2.quote'),
      name: t('home.testimonials.item2.name'),
      role: t('home.testimonials.item2.role'),
      city: t('home.testimonials.item2.city'),
    },
    {
      quote: t('home.testimonials.item3.quote'),
      name: t('home.testimonials.item3.name'),
      role: t('home.testimonials.item3.role'),
      city: t('home.testimonials.item3.city'),
    },
    {
      quote: t('home.testimonials.item4.quote'),
      name: t('home.testimonials.item4.name'),
      role: t('home.testimonials.item4.role'),
      city: t('home.testimonials.item4.city'),
    },
  ];

  // Auto-advance testimonials carousel gently
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // FAQ Data
  const faqs: FaqItem[] = [
    {
      q: t('home.faq.q1'),
      a: t('home.faq.a1'),
    },
    {
      q: t('home.faq.q2'),
      a: t('home.faq.a2'),
    },
    {
      q: t('home.faq.q3'),
      a: t('home.faq.a3'),
    },
    {
      q: t('home.faq.q4'),
      a: t('home.faq.a4'),
    },
    {
      q: t('home.faq.q5'),
      a: t('home.faq.a5'),
    },
    {
      q: t('home.faq.q6'),
      a: t('home.faq.a6'),
    },
    {
      q: t('home.faq.q7'),
      a: t('home.faq.a7'),
    },
    {
      q: t('home.faq.q8'),
      a: t('home.faq.a8'),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <main style={{ flex: 1 }}>
        {/* =========================================================================
            02. HERO SECTION
        ========================================================================== */}
        <section
          style={{
            padding: '5rem 1.5rem 3.5rem 1.5rem',
            textAlign: 'center',
            maxWidth: '1150px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Ambient radial glow */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Pill Badge */}
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
              <span>{t('home.hero.badge')}</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                fontWeight: '800',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              {t('home.hero.title_part1')} <br />
              <span style={{ color: 'var(--accent-primary)' }}>{t('home.hero.title_part2')}</span>
            </h1>

            {/* Supporting text */}
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 auto 2.5rem auto',
              }}
            >
              {t('home.hero.description')}
            </p>

            {/* CTA */}
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
                <span>{t('home.hero.start_free')}</span>
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-secondary"
                style={{ fontSize: '1rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
              >
                <span>{t('home.hero.see_how_it_works')}</span>
              </a>
            </div>

            {/* Visual: Polished spendora Dashboard */}
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
              {/* Window Bar */}
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
                    {t('home.hero.preview.url')}
                  </span>
                </div>
                <span className="badge badge-green">{t('home.hero.preview.badge')}</span>
              </div>

              {/* 3 Dashboard Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Total Balance */}
                <div
                  style={{
                    background: '#141414',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span>{t('home.hero.preview.total_balance')}</span>
                    <Wallet size={16} color="var(--accent-primary)" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '700' }}>{t('home.hero.preview.currency')}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    {t('home.hero.preview.balance_sources')}
                  </div>
                </div>

                {/* Monthly Spending Overview */}
                <div
                  style={{
                    background: '#141414',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span>{t('home.hero.preview.monthly_spending')}</span>
                    <BarChart2 size={16} color="#3b82f6" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>{t('home.hero.preview.spending_limit')}</span>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                </div>

                {/* Subscriptions */}
                <div
                  style={{
                    background: '#141414',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span>{t('home.hero.preview.active_subscriptions')}</span>
                    <Repeat size={16} color="#ec4899" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    350 <span style={{ fontSize: '1rem', color: '#ec4899', fontWeight: '600' }}>{t('home.hero.preview.subscription_rate')}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    {t('home.hero.preview.services_monitored')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            03. MULTIPLE ACCOUNTS
        ========================================================================== */}
        <section id="accounts" style={{ padding: '5.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Narrative */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem',
                }}
              >
                <Building2 size={16} />
                <span>{t('home.accounts.badge')}</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: '800',
                  color: '#ffffff',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                {t('home.accounts.title_part1')} <br />
                <span style={{ color: 'var(--accent-primary)' }}>{t('home.accounts.title_part2')}</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                {t('home.accounts.description')}
              </p>
            </div>

            {/* Right Visual: Accounts Breakdown Card */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                background: '#0d0d0d',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-hover)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                {t('home.accounts.linked_accounts')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* CIH Bank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>{t('home.accounts.cih_bank')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('home.accounts.cih_type')}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>8,500 MAD</span>
                </div>

                {/* Attijariwafa Bank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>{t('home.accounts.attijari_bank')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('home.accounts.attijari_type')}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>3,200 MAD</span>
                </div>

                {/* Cash */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Banknote size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>{t('home.accounts.cash')}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('home.accounts.cash_type')}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>700 MAD</span>
                </div>
              </div>

              {/* Total Balance Banner */}
              <div
                style={{
                  background: 'var(--accent-light)',
                  border: '1px solid var(--accent-border)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>{t('home.accounts.total_balance')}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>12,400 MAD</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            04. TESTIMONIALS (Carousel)
        ========================================================================== */}
        <section style={{ padding: '5.5rem 1.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            {t('home.testimonials.badge')}
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>
            {t('home.testimonials.title')}
          </h2>

          <div
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              background: '#0d0d0d',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-hover)',
              position: 'relative',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p style={{ fontSize: '1.25rem', color: '#ffffff', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              &ldquo;{testimonials[currentTestimonial]?.quote}&rdquo;
            </p>

            <div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {testimonials[currentTestimonial]?.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {testimonials[currentTestimonial]?.role} · {testimonials[currentTestimonial]?.city}
              </div>
            </div>

            {/* Carousel Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={prevTestimonial}
                className="btn-icon"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                aria-label={t('home.testimonials.prev_aria')}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    style={{
                      width: currentTestimonial === i ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentTestimonial === i ? 'var(--accent-primary)' : '#333333',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="btn-icon"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                aria-label={t('home.testimonials.next_aria')}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            05. FAQ
        ========================================================================== */}
        <section id="faq" style={{ padding: '5.5rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              {t('home.faq.badge')}
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              {t('home.faq.title')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: openFaq === idx ? '1px solid var(--border-hover)' : '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1rem',
                    fontWeight: '700',
                    textAlign: 'start',
                    cursor: 'pointer',
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: openFaq === idx ? 'var(--accent-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openFaq === idx && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      borderTop: '1px solid #1a1a1a',
                      paddingTop: '1rem',
                      textAlign: 'start',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            06. FINAL CTA
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
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  lineHeight: 1.15,
                }}
              >
                {t('home.cta.title_part1')} <br />
                <span style={{ color: 'var(--accent-primary)' }}>{t('home.cta.title_part2')}</span>
              </h2>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  maxWidth: '520px',
                  margin: '0 auto 2.5rem auto',
                  lineHeight: '1.6',
                }}
              >
                {t('home.cta.description')}
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}
                >
                  <span>{t('home.cta.button')}</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
