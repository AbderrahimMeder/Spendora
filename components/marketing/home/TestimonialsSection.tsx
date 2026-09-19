import React from 'react';
import { Star } from 'lucide-react';

interface ReviewItem {
  name: string;
  role: string;
  avatar: string;
  comment: string;
}

export default function TestimonialsSection() {
  const reviews: ReviewItem[] = [
    {
      name: 'Sarah Jenkins',
      role: 'Full Stack Engineer',
      avatar: 'SJ',
      comment: 'Replaced my messy spreadsheets completely. Clean, intuitive, and the real-time balance calculations are super fast.',
    },
    {
      name: 'Youssef El Mansouri',
      role: 'Freelance Consultant',
      avatar: 'YM',
      comment: 'Tracking income and multi-currency expenses with Moroccan Dirhams (MAD) and USD in one clean dashboard is exactly what I needed.',
    },
    {
      name: 'Alex Rivera',
      role: 'Product Designer',
      avatar: 'AR',
      comment: 'The minimalist dark design with green accents is stunning. Clean, focused, and zero distraction.',
    },
  ];

  return (
    <section id="testimonials" style={{
      padding: '4.5rem 1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          User Reviews
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          What people say about ExpenseFlow.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            {/* 5 Green Stars */}
            <div style={{ display: 'flex', gap: '0.2rem', color: '#10b981' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="#10b981" />
              ))}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              "{rev.comment}"
            </p>

            {/* Author */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#1c1c1c',
                border: '1px solid #10b981',
                color: '#10b981',
                fontWeight: '700',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {rev.avatar}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                  {rev.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {rev.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
