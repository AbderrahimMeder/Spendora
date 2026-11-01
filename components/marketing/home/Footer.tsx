'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Wallet } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 1.5rem 2.5rem 1.5rem',
      color: 'var(--text-secondary)',
      textAlign: 'start',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem',
      }}>
        {/* Brand & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
            }}>
              <Wallet size={18} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              Spend<span style={{ color: 'var(--accent-primary)' }}>ora</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {t('footer.description')}
          </p>
        </div>

        {/* Spendora Navigation */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
            {t('footer.section_spendora')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', padding: 0 }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.home')}</Link></li>
            <li><Link href="/features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.features')}</Link></li>
            <li><Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.about')}</Link></li>
            <li><Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.faq')}</Link></li>
          </ul>
        </div>

        {/* Product Areas */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
            {t('footer.section_product')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', padding: 0 }}>
            <li><Link href="/#accounts" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.accounts')}</Link></li>
            <li><Link href="/#expenses" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.expenses')}</Link></li>
            <li><Link href="/#budgets" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.budgets')}</Link></li>
            <li><Link href="/#subscriptions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.subscriptions')}</Link></li>
            <li><Link href="/reports" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.reports')}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
            {t('footer.section_support')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', padding: 0 }}>
            <li><Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.help_center')}</Link></li>
            <li><Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.contact_us')}</Link></li>
            <li><Link href="/faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.faq')}</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>
            {t('footer.section_legal')}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', padding: 0 }}>
            <li><a href="#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.privacy_policy')}</a></li>
            <li><a href="#terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('footer.terms_of_service')}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <div>
          {t('footer.copyright')}
        </div>
        <div style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
          {t('footer.tagline')}
        </div>
      </div>
    </footer>
  );
}
