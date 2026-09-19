
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section style={{
      padding: '3.5rem 1.5rem 4.5rem 1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <div style={{
        background: '#111111',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.35rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
            Ready to Streamline Your Spending?
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            Take command of your financial journey today with a fast, modern and clean tracker.
          </p>

          <Link
            href="/register"
            className="btn btn-primary"
            style={{ fontSize: '0.95rem', padding: '0.75rem 1.75rem', textDecoration: 'none' }}
          >
            <span>Create Free Account</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
