import React from 'react';
import {
  TrendingUp,
  PieChart,
  Shield,
  Target,
  Globe,
  Zap,
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Inflow & Outflow',
      description: 'Quickly record incomes and expenses. Categorize with tags, payment methods, and dates effortlessly.',
    },
    {
      icon: PieChart,
      title: 'Smart Category Visualizer',
      description: 'Understand exactly where your money goes with clear breakdown metrics and spending distributions.',
    },
    {
      icon: Zap,
      title: 'Budget Caps & Limits',
      description: 'Set monthly limits on dining, housing, or shopping to keep your monthly cashflow positive.',
    },
    {
      icon: Target,
      title: 'Savings Milestones',
      description: 'Define target funds for emergency cushions, equipment, or travel with visual progress.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Work seamlessly in USD ($), EUR (€), Moroccan Dirham (MAD / DH), GBP (£), and CAD.',
    },
    {
      icon: Shield,
      title: 'PostgreSQL Data Security',
      description: 'Encrypted passwords, isolated user sessions, and reliable relational integrity.',
    },
  ];

  return (
    <section id="features" style={{
      padding: '4rem 1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}>
          Core Capabilities
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Everything necessary to monitor spending and achieve financial clarity.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={20} />
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>
                {item.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
