'use client'
import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onScrollToDemo?: () => void;
}

export default function HeroSection({ onScrollToDemo }: HeroSectionProps) {
  return (
    <section style={{
      padding: '5rem 1.5rem 3.5rem 1.5rem',
      textAlign: 'center',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-full)',
        padding: '0.35rem 0.9rem',
        marginBottom: '1.75rem',
        fontSize: '0.8rem',
        color: '#10b981',
        fontWeight: '600',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
        <span>Laravel + React + Inertia.js Stack</span>
      </div>

      {/* Main Headline */}
      <h1 style={{
        fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
        fontWeight: '800',
        lineHeight: 1.15,
        letterSpacing: '-0.03em',
        color: '#ffffff',
        marginBottom: '1.25rem',
      }}>
        Simple, Smart & Clean <br />
        <span style={{ color: '#10b981' }}>
          Personal Expense Tracker
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.05rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        maxWidth: '620px',
        margin: '0 auto 2.5rem auto',
      }}>
        Log income and expenses, set monthly category limits, and track your financial growth with a focused, minimal dashboard.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.85rem',
        flexWrap: 'wrap',
        marginBottom: '3rem',
      }}>
        <Link
          href="/register"
          className="btn btn-primary"
          style={{ fontSize: '0.95rem', padding: '0.75rem 1.6rem', textDecoration: 'none' }}
        >
          <span>Get Started Free</span>
          <ArrowRight size={17} />
        </Link>

        {onScrollToDemo && (
          <button
            onClick={onScrollToDemo}
            className="btn btn-secondary"
            style={{ fontSize: '0.95rem', padding: '0.75rem 1.4rem' }}
          >
            <span>View Preview</span>
          </button>
        )}
      </div>

      {/* Highlights */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        color: 'var(--text-muted)',
        fontSize: '0.825rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={15} color="#10b981" />
          <span>PostgreSQL Relational DB</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={15} color="#10b981" />
          <span>Redis Fast Caching</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={15} color="#10b981" />
          <span>No Credit Card Required</span>
        </div>
      </div>
    </section>
  );
}
