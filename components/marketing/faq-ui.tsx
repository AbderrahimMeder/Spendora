'use client'
import React, { useState } from 'react';
import Link from 'next/link';
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const faqData: FaqItem[] = [
    {
      q: 'What is Finora?',
      a: 'Finora is a simple, smart platform that helps you organize your finances, manage expenses and accounts, and stay focused on what matters most to your financial growth.',
      category: 'general',
    },
    {
      q: 'Is Finora free to use?',
      a: 'Yes, you can start using Finora for free. Additional premium intelligence and automation features may be available depending on your plan.',
      category: 'general',
    },
    {
      q: 'Can I access my data from different devices?',
      a: 'Yes. Your data is stored securely online with encrypted cloud synchronization, allowing you to access your dashboard from desktop, tablet, and mobile browsers.',
      category: 'platform',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. We use modern security practices, encrypted bearer sessions, and strict data isolation policies to protect your account and personal financial records.',
      category: 'security',
    },
    {
      q: 'Can I create an account without paying?',
      a: 'Yes. You can create an account and start using the platform immediately without entering a credit card or payment information.',
      category: 'general',
    },
    {
      q: 'Can I delete my account?',
      a: 'Yes. You stay in complete control of your data. You can request the permanent deletion of your account and all associated financial records at any time.',
      category: 'security',
    },
    {
      q: 'What happens if I forget my password?',
      a: 'You can use the password recovery option on the login page to securely receive a password reset link and regain instant access to your account.',
      category: 'account',
    },
    {
      q: 'How can I contact support?',
      a: 'You can contact our support team anytime through our Contact page or directly by email at support@finora.app. We typically respond within 24 hours.',
      category: 'support',
    },
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
            <span>Help Center & FAQ</span>
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
            Frequently Asked <span style={{ color: 'var(--accent-primary)' }}>Questions</span>
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
            Find quick answers to common questions about using Finora, account privacy, multi-device support, and billing.
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
              placeholder="Search questions (e.g. 'free', 'devices', 'security')..."
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
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'general', label: 'General' },
              { id: 'platform', label: 'Platform & Devices' },
              { id: 'security', label: 'Privacy & Security' },
              { id: 'account', label: 'Account & Access' },
            ].map((cat) => (
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
                      textAlign: 'left',
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
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>No matching questions found</div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Try searching for a different keyword or contact our support team.
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
          }}
        >
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
              Still have questions?
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Can't find the answer you're looking for? Reach out to our friendly support team.
            </p>
          </div>

          <Link
            href="/contact"
            className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.4rem', textDecoration: 'none' }}
          >
            <span>Get in Touch</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default FaqUI;
