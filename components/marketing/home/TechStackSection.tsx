import React from 'react';
import { Server, Cpu, Layers, Database, Zap, LucideIcon } from 'lucide-react';

interface StackItem {
  name: string;
  role: string;
  desc: string;
  icon: LucideIcon;
}

export default function TechStackSection() {
  const stack: StackItem[] = [
    {
      name: 'Laravel Backend',
      role: 'Core API & Auth',
      desc: 'Eloquent ORM, validation policies, database transactions, and rate limiting.',
      icon: Server,
    },
    {
      name: 'React 19 Frontend',
      role: 'Reactive Interface',
      desc: 'Component modularity, instantaneous state changes, and smooth interaction.',
      icon: Cpu,
    },
    {
      name: 'Inertia.js Bridge',
      role: 'Modern Monolith',
      desc: 'Connects Laravel controllers and React components without boilerplate APIs.',
      icon: Layers,
    },
    {
      name: 'PostgreSQL DB',
      role: 'Relational Storage',
      desc: 'ACID transactional data integrity for user records, categories, and balances.',
      icon: Database,
    },
    {
      name: 'Redis Cache',
      role: 'In-Memory Engine',
      desc: 'High-speed session storage, query caching, and asynchronous queue management.',
      icon: Zap,
    },
  ];

  return (
    <section id="tech-stack" style={{
      padding: '4rem 1.5rem',
      background: '#0a0a0a',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Technology Stack
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Engineered with a reliable, battle-tested modern architecture.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {stack.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  background: '#0e0e0e',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} />
                </div>

                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.15rem' }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#10b981', marginBottom: '0.4rem' }}>
                    {item.role}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
