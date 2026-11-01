'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  ChevronDown,
  Search,
  ArrowRight,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export function FaqUI() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqData: FaqItem[] = [
    {
      q: t('faq_page.items.q1'),
      a: t('faq_page.items.a1'),
      category: 'general',
    },
    {
      q: t('faq_page.items.q2'),
      a: t('faq_page.items.a2'),
      category: 'general',
    },
    {
      q: t('faq_page.items.q3'),
      a: t('faq_page.items.a3'),
      category: 'platform',
    },
    {
      q: t('faq_page.items.q4'),
      a: t('faq_page.items.a4'),
      category: 'security',
    },
    {
      q: t('faq_page.items.q5'),
      a: t('faq_page.items.a5'),
      category: 'general',
    },
    {
      q: t('faq_page.items.q6'),
      a: t('faq_page.items.a6'),
      category: 'security',
    },
    {
      q: t('faq_page.items.q7'),
      a: t('faq_page.items.a7'),
      category: 'account',
    },
    {
      q: t('faq_page.items.q8'),
      a: t('faq_page.items.a8'),
      category: 'support',
    },
  ];

  const categories = [
    { id: 'all', label: t('faq_page.categories.all') },
    { id: 'general', label: t('faq_page.categories.general') },
    { id: 'platform', label: t('faq_page.categories.platform') },
    { id: 'security', label: t('faq_page.categories.security') },
    { id: 'account', label: t('faq_page.categories.account') },
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden', paddingBottom: '5rem' }}>
      {/* 1. Hero Header */}
      <section
        style={{
          padding: '5rem 1.5rem 3rem 1.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
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
              marginBottom: '1.5rem',
              fontSize: '0.825rem',
              color: 'var(--accent-primary)',
              fontWeight: '700',
            }}
          >
            <HelpCircle size={14} />
            <span>{t('faq_page.hero.badge')}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            {t('faq_page.hero.title_part1')}{' '}
            <span style={{ color: 'var(--accent-primary)' }}>{t('faq_page.hero.title_part2')}</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '620px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            {t('faq_page.hero.description')}
          </p>

          {/* Interactive Search Bar */}
          <div style={{ maxWidth: '580px', margin: '0 auto 1.5rem auto', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '1.1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder={t('faq_page.hero.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.8rem',
                height: '48px',
                background: '#0e0e0e',
                border: '1px solid var(--border-hover)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.4rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid',
                  cursor: 'pointer',
                  background: activeCategory === cat.id ? 'var(--accent-primary)' : '#121212',
                  borderColor: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  color: activeCategory === cat.id ? '#000000' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Accordion List */}
      <section style={{ maxWidth: '820px', margin: '0 auto 4.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="glass-card"
                  style={{
                    background: '#0d0d0d',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: isOpen ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
                    transition: 'border-color 0.2s ease',
                    textAlign: 'start',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
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
                      gap: '1rem',
                    }}
                  >
                    <span style={{ color: isOpen ? 'var(--accent-primary)' : '#ffffff' }}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        color: isOpen ? 'var(--accent-primary)' : 'var(--text-muted)',
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem 1.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.925rem',
                        lineHeight: '1.65',
                        borderTop: '1px solid #181818',
                        paddingTop: '1rem',
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              className="glass-card"
              style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}
            >
              <HelpCircle size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                {t('faq_page.not_found.title')}
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {t('faq_page.not_found.description')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Still Have Questions? Banner */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="glass-card"
          style={{
            padding: '2.5rem 2rem',
            background: 'linear-gradient(180deg, #111111 0%, #0c0c0c 100%)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            textAlign: 'start',
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
              {t('faq_page.banner.title')}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {t('faq_page.banner.description')}
            </p>
          </div>

          <Link
            href="/contact"
            className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.4rem', textDecoration: 'none' }}
          >
            <span>{t('faq_page.banner.button')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FaqUI;
