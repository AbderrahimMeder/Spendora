import React from 'react';
import Link  from 'next/link';
import { Wallet } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#050505',
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 1.5rem 2.5rem 1.5rem',
      color: 'var(--text-secondary)',
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
              Fin<span style={{ color: 'var(--accent-primary)' }}>ora</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            A clearer way to understand your money. Track spending, manage accounts, and take control of your financial life.
          </p>
        </div>

        {/* Finora Navigation */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>Finora</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li><a href="/#accounts" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a></li>
            <li><Link href="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</Link></li>
            <li><a href="/#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQ</a></li>
          </ul>
        </div>

        {/* Product Areas */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>Product</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
            <li><a href="/#accounts" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Accounts</a></li>
            <li><a href="/#expenses" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Expenses</a></li>
            <li><a href="/#budgets" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Budgets</a></li>
            <li><a href="/#subscriptions" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Subscriptions</a></li>
            <li><a href="/#reports" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Reports</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
            <li><a href="/#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Help Center</a></li>
            <li><a href="mailto:support@finora.app" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</a></li>
            <li><a href="/#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQ</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem' }}>Legal</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem' }}>
            <li><a href="#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a></li>
            <li><a href="#terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a></li>
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
          © 2026 Finora. All rights reserved.
        </div>
        <div style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
          Know your money. Own your decisions.
        </div>
      </div>
    </footer>
  );
}
