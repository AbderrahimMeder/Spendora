
import Link from 'next/link';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  PieChart,
  Repeat,
  BarChart2,
  Shield,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  Zap,
  Building2,
  Coffee,
  ShoppingBag,
  Car,
  Home as HomeIcon,
  Tv,
  Activity,
  LucideIcon,
} from 'lucide-react';

interface SubscriptionSample {
  name: string;
  price: number;
  cycle: string;
  status: string;
  nextPay: string;
  icon: string;
}

interface CategorySample {
  name: string;
  icon: LucideIcon;
  color: string;
  sample: string;
}

interface PrincipleItem {
  title: string;
  quote: string;
  desc: string;
  icon: LucideIcon;
}

interface RoadmapStepItem {
  phase: string;
  title: string;
  status: string;
  items: string[];
  active: boolean;
}

export function AboutUs() {
  // Subscriptions dataset in MAD
  const sampleSubscriptions: SubscriptionSample[] = [
    { name: 'Netflix 4K', price: 50, cycle: 'Monthly', status: 'Active', nextPay: 'Sep 02', icon: '🎬' },
    { name: 'Spotify Premium', price: 60, cycle: 'Monthly', status: 'Active', nextPay: 'Sep 10', icon: '🎵' },
    { name: 'Gym & Fitness Pro', price: 200, cycle: 'Monthly', status: 'Active', nextPay: 'Sep 01', icon: '💪' },
    { name: 'Cloud Storage 2TB', price: 40, cycle: 'Monthly', status: 'Active', nextPay: 'Sep 18', icon: '☁️' },
  ];

  const totalMonthlySubs = sampleSubscriptions.reduce((acc, curr) => acc + curr.price, 0);
  const totalYearlySubs = totalMonthlySubs * 12;

  // Principles
  const principles: PrincipleItem[] = [
    {
      title: 'Simplicity',
      quote: 'Money management shouldn’t feel complicated.',
      desc: 'We strip away clutter, endless menus, and bloated spreadsheets so you can log an expense in under 5 seconds.',
      icon: Sparkles,
    },
    {
      title: 'Transparency',
      quote: 'Know exactly where your money goes.',
      desc: 'Crystal-clear breakdown of every dirham spent across merchants, accounts, and categories with zero guesswork.',
      icon: Eye,
    },
    {
      title: 'Privacy',
      quote: 'Your financial information belongs to you.',
      desc: 'We never sell your data, run third-party advertising trackers, or compromise on your confidential records.',
      icon: Shield,
    },
    {
      title: 'Security',
      quote: 'Your money deserves strong protection.',
      desc: 'Engineered with encrypted session tokens, strict API route policies, and hardened backend standards.',
      icon: Lock,
    },
    {
      title: 'Control',
      quote: 'Your money. Your decisions.',
      desc: 'Set custom category limits, organize cash wallets alongside bank balances, and control your own budget pace.',
      icon: Sliders,
    },
    {
      title: 'Clarity',
      quote: 'Turn financial activity into something you can understand.',
      desc: 'Transform raw, cryptic bank transactions into beautiful visual reports that show real spending behavior.',
      icon: PieChart,
    },
  ];

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden' }}>

      {/* =========================================================================
          SECTION 01: HERO SECTION
      ========================================================================== */}
      <section
        style={{
          padding: '5rem 1.5rem 4rem 1.5rem',
          maxWidth: '1150px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow ambient decoration */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-light)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 1.1rem',
              marginBottom: '1.75rem',
              fontSize: '0.825rem',
              color: 'var(--accent-primary)',
              fontWeight: '700',
              letterSpacing: '0.02em',
            }}
          >
            <Sparkles size={15} />
            <span>Welcome to Finora · Financial Clarity</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.4rem',
            }}
          >
            Welcome to Finora. <br />
            <span style={{ color: 'var(--accent-primary)' }}>
              A clearer way to understand your money.
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Finora helps you understand where your money goes, track your spending, manage your accounts and subscriptions,
            and get a clear view of your financial activity.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '4rem',
            }}
          >
            <Link
              href="/register"
              className="btn btn-primary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 1.8rem', textDecoration: 'none' }}
            >
              <span>Get Started</span>
              <ArrowRight size={17} />
            </Link>

            <a
              href="#the-problem"
              className="btn btn-secondary"
              style={{ fontSize: '0.95rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
            >
              <span>Explore Finora</span>
            </a>
          </div>

          {/* Dashboard Preview Visual */}
          <div
            className="glass-card"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              padding: '1.75rem',
              background: '#0d0d0d',
              border: '1px solid var(--border-hover)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.08)',
              textAlign: 'left',
            }}
          >
            {/* Window bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  finora.app/overview
                </span>
              </div>
              <span className="badge badge-green">Live Financial Workspace</span>
            </div>

            {/* Dashboard Mockup Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {/* Card 1: Total Balance */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>Total Net Balance</span>
                  <Wallet size={16} color="var(--accent-primary)" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '600' }}>MAD</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <TrendingUp size={13} />
                  <span>Bank (11,700 MAD) + Cash (700 MAD)</span>
                </div>
              </div>

              {/* Card 2: Monthly Spending */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>Monthly Spending</span>
                  <BarChart2 size={16} color="#3b82f6" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>/ 4,500 MAD</span>
                </div>
                <div style={{ marginTop: '0.6rem' }}>
                  <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                  </div>
                </div>
              </div>

              {/* Card 3: Active Subscriptions */}
              <div
                style={{
                  background: '#141414',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                  <span>Active Subscriptions</span>
                  <Repeat size={16} color="#ec4899" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                  350 <span style={{ fontSize: '1rem', color: '#ec4899', fontWeight: '600' }}>MAD / mo</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                  4 services (Netflix, Spotify, Gym, Cloud)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02: THE PROBLEM
      ========================================================================== */}
      <section
        id="the-problem"
        style={{
          padding: '5rem 1.5rem',
          background: '#090909',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f59e0b',
                fontSize: '0.8rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.65rem',
              }}
            >
              <AlertCircle size={15} />
              <span>The Problem We Solve</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)',
                fontWeight: '800',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                maxWidth: '750px',
                margin: '0 auto 1rem auto',
              }}
            >
              You know how much you have. <br />
              <span style={{ color: 'var(--accent-primary)' }}>But do you know where it goes?</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Most people check their banking app daily, but bank balances only show the remaining total—never the story behind your lifestyle spending.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: PRINCIPLES
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Our Guiding Principles
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            The foundational beliefs that shape every pixel and algorithm in Finora.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  background: '#0e0e0e',
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600', fontStyle: 'italic' }}>"{item.quote}"</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: FINAL CTA
      ========================================================================== */}
      <section style={{ padding: '5rem 1.5rem 3rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          className="glass-card"
          style={{
            padding: '4rem 2rem',
            background: 'linear-gradient(180deg, #121212 0%, #080808 100%)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1.15 }}>
              Know your money. <br />
              <span style={{ color: 'var(--accent-primary)' }}>Own your decisions.</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              Start understanding where your money goes, organize your spending, and take control of your financial life.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}>
                <span>Start Using Finora — Free</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
