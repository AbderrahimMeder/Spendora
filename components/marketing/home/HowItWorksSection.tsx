import React from 'react';
import { UserPlus, PlusCircle, LineChart, LucideIcon } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenAuth?: () => void;
}

interface StepItem {
  number: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export default function HowItWorksSection({ onOpenAuth }: HowItWorksSectionProps) {
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Create Account',
      desc: 'Sign up in seconds and choose your preferred currency (USD, EUR, MAD, etc.).',
      icon: UserPlus,
    },
    {
      number: '02',
      title: 'Log Cashflow',
      desc: 'Enter your incomes and daily expenses under clear categories and payment methods.',
      icon: PlusCircle,
    },
    {
      number: '03',
      title: 'Gain Insights',
      desc: 'Watch your net balance grow, stay under budget caps, and hit your savings goals.',
      icon: LineChart,
    },
  ];

  return (
    <section id="how-it-works" style={{
      padding: '4.5rem 1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          How It Works
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Three direct steps to gain full control of your finances.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
      }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                fontSize: '1.5rem',
                fontWeight: '800',
                color: 'rgba(255, 255, 255, 0.08)',
              }}>
                {step.number}
              </div>

              <div style={{
                width: '40px',
                height: '40px',
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
                {step.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
