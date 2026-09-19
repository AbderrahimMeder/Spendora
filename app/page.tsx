'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/marketing/home/Navbar';
import Footer from '@/components/marketing/home/Footer';
import {
  Wallet,
  ArrowRight,
  CheckCircle2,
  Building2,
  CreditCard,
  Banknote,
  Tag,
  Store,
  BarChart2,
  Target,
  Repeat,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Smartphone,
  Globe,
  Monitor,
  Coffee,
  ShoppingBag,
  Zap,
} from 'lucide-react';

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  city: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export default function Home() {
  // Testimonial Carousel State
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Testimonials Data
  const testimonials: TestimonialItem[] = [
    {
      quote: "Finora finally helped me understand where my money goes every month. No clutter, just instant clarity.",
      name: "Yassine E.",
      role: "Young Employee",
      city: "Casablanca",
    },
    {
      quote: "Managing my monthly allowance and cash expenses used to be a mess. Now I know my exact remaining budget.",
      name: "Salma K.",
      role: "University Student",
      city: "Rabat",
    },
    {
      quote: "Tracking multiple bank payouts and project expenses in MAD without bloated spreadsheets is a lifesaver.",
      name: "Amine B.",
      role: "Freelance Designer",
      city: "Marrakech",
    },
    {
      quote: "The subscription tracker alone saved me hundreds of dirhams on unused memberships I had completely forgotten.",
      name: "Noura T.",
      role: "Product Marketer",
      city: "Tangier",
    },
  ];

  // Auto-advance testimonials carousel gently
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // FAQ Data
  const faqs: FaqItem[] = [
    {
      q: 'What is Finora?',
      a: 'Finora is a platform that helps you understand and manage your personal financial activity in one unified place.',
    },
    {
      q: 'Is Finora free?',
      a: 'Yes. Finora is currently completely free to use.',
    },
    {
      q: 'Can I manage multiple accounts?',
      a: 'Yes. You can manage multiple bank accounts and track physical cash in one combined view.',
    },
    {
      q: 'Can I track my expenses?',
      a: 'Yes. You can organize and understand your spending by different categories, merchants, and dates.',
    },
    {
      q: 'Can I track subscriptions?',
      a: 'Yes. Finora helps you keep track of recurring payments, renewal dates, and total subscription costs.',
    },
    {
      q: 'Can I create budgets?',
      a: 'Yes. You can set category spending limits and track your remaining amounts in real time.',
    },
    {
      q: 'Can I use Finora on mobile?',
      a: 'The first version is available on the Web with a responsive mobile-friendly interface. Native Android, iOS, and Windows apps are planned for the future.',
    },
    {
      q: 'Is my financial information private?',
      a: 'Finora is designed with privacy and security in mind, keeping you in full control of your personal information.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* 01. Navbar */}
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            02. HERO SECTION
        ========================================================================== */}
        <section
          style={{
            padding: '5rem 1.5rem 3.5rem 1.5rem',
            textAlign: 'center',
            maxWidth: '1150px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Ambient radial glow */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Pill Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: 'var(--accent-light)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 1rem',
                marginBottom: '1.75rem',
                fontSize: '0.825rem',
                color: 'var(--accent-primary)',
                fontWeight: '700',
              }}
            >
              <Sparkles size={14} />
              <span>Personal Finance Clarity</span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
                fontWeight: '800',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              Where is your <br />
              <span style={{ color: 'var(--accent-primary)' }}>money going?</span>
            </h1>

            {/* Supporting text */}
            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 auto 2.5rem auto',
              }}
            >
              Understand your spending, track your expenses, and see your financial life clearly — all in one place.
            </p>

            {/* CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '3.5rem',
              }}
            >
              <Link
                href="/register"
                className="btn btn-primary"
                style={{ fontSize: '1rem', padding: '0.8rem 2rem', textDecoration: 'none' }}
              >
                <span>Start for Free</span>
                <ArrowRight size={17} />
              </Link>
              <a
                href="#how-it-works"
                className="btn btn-secondary"
                style={{ fontSize: '1rem', padding: '0.8rem 1.6rem', textDecoration: 'none' }}
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Visual: Polished Finora Dashboard */}
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
              {/* Window Bar */}
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
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    finora.app/dashboard
                  </span>
                </div>
                <span className="badge badge-green">Live Financial View</span>
              </div>

              {/* 3 Dashboard Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {/* Total Balance */}
                <div
                  style={{
                    background: '#141414',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <span>Total Balance</span>
                    <Wallet size={16} color="var(--accent-primary)" />
                  </div>
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    12,400 <span style={{ fontSize: '1rem', color: 'var(--accent-primary)', fontWeight: '700' }}>MAD</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    CIH Bank + Attijariwafa + Cash
                  </div>
                </div>

                {/* Monthly Spending Overview */}
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
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    3,120 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 4,500 MAD</span>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ height: '6px', background: '#222222', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '69.3%', height: '100%', background: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                </div>

                {/* Subscriptions */}
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
                  <div style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
                    350 <span style={{ fontSize: '1rem', color: '#ec4899', fontWeight: '600' }}>MAD / mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                    4 services monitored
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            03. MULTIPLE ACCOUNTS
        ========================================================================== */}
        <section id="accounts" style={{ padding: '5.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Narrative */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--accent-primary)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.75rem',
                }}
              >
                <Building2 size={16} />
                <span>Multiple Accounts</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                  fontWeight: '800',
                  color: '#ffffff',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '1.25rem',
                }}
              >
                All your money, <br />
                <span style={{ color: 'var(--accent-primary)' }}>in one place.</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                People often have money spread across different bank accounts and cash. Finora brings these sources together so you can understand your overall financial situation without logging into multiple bank portals.
              </p>
            </div>

            {/* Right Visual: Accounts Breakdown Card */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                background: '#0d0d0d',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-hover)',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                Linked Financial Accounts
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* CIH Bank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>CIH Bank</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Checking</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>8,500 MAD</span>
                </div>

                {/* Attijariwafa Bank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>Attijariwafa Bank</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Savings Account</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>3,200 MAD</span>
                </div>

                {/* Cash */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#141414', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Banknote size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>Cash</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Physical Wallet</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ffffff' }}>700 MAD</span>
                </div>
              </div>

              {/* Total Balance Banner */}
              <div
                style={{
                  background: 'var(--accent-light)',
                  border: '1px solid var(--accent-border)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Total Balance</span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>12,400 MAD</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            04. TESTIMONIALS (Carousel)
        ========================================================================== */}
        <section style={{ padding: '5.5rem 1.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            User Experiences
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '2.5rem' }}>
            What people experience using Finora
          </h2>

          <div
            className="glass-card"
            style={{
              padding: '3rem 2.5rem',
              background: '#0d0d0d',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-hover)',
              position: 'relative',
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <p style={{ fontSize: '1.25rem', color: '#ffffff', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              "{testimonials[currentTestimonial].quote}"
            </p>

            <div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                {testimonials[currentTestimonial].name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {testimonials[currentTestimonial].role} · {testimonials[currentTestimonial].city}
              </div>
            </div>

            {/* Carousel Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={prevTestimonial}
                className="btn-icon"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTestimonial(i)}
                    style={{
                      width: currentTestimonial === i ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentTestimonial === i ? 'var(--accent-primary)' : '#333333',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="btn-icon"
                style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            05. FAQ
        ========================================================================== */}
        <section id="faq" style={{ padding: '5.5rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Got Questions?
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: openFaq === idx ? '1px solid var(--border-hover)' : '1px solid var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => toggleFaq(idx)}
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
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: openFaq === idx ? 'var(--accent-primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                </button>

                {openFaq === idx && (
                  <div
                    style={{
                      padding: '0 1.5rem 1.25rem 1.5rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      borderTop: '1px solid #1a1a1a',
                      paddingTop: '1rem',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            06. FINAL CTA
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
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                  lineHeight: 1.15,
                }}
              >
                Know your money. <br />
                <span style={{ color: 'var(--accent-primary)' }}>Own your decisions.</span>
              </h2>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  maxWidth: '520px',
                  margin: '0 auto 2.5rem auto',
                  lineHeight: '1.6',
                }}
              >
                Start understanding where your money goes and take control of your financial life.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link
                  href="/register"
                  className="btn btn-primary"
                  style={{ fontSize: '1rem', padding: '0.85rem 2.2rem', textDecoration: 'none' }}
                >
                  <span>Start Using Finora — Free</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 07. Footer */}
      <Footer />
    </div>
  );
}
