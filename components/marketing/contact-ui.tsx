'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Clock,
  Calendar,
  Send,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export function ContactUI() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error(t('contact.form.required_error'));
      return;
    }

    setIsSubmitting(true);

    // Simulate response delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(t('contact.form.toast_success'));
      setFormData({ fullName: '', email: '', subject: '', message: '' });
    }, 900);
  };

  return (
    <div style={{ color: 'var(--text-primary)', overflowX: 'hidden', paddingBottom: '5rem' }}>
      {/* 1. Header Hero */}
      <section
        style={{
          padding: '5rem 1.5rem 3rem 1.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'var(--accent-light)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.825rem',
              color: 'var(--accent-primary)',
              fontWeight: '700',
            }}
          >
            <MessageSquare size={14} />
            <span>{t('contact.hero.badge')}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: '800',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            {t('contact.hero.title_part1')}{' '}
            <span style={{ color: 'var(--accent-primary)' }}>{t('contact.hero.title_part2')}</span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '580px',
              margin: '0 auto',
            }}
          >
            {t('contact.hero.description')}
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid: Info on left, Form on right */}
      <section style={{ maxWidth: '1050px', margin: '0 auto 4.5rem auto', padding: '0 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'start' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
                {t('contact.info.title')}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {t('contact.info.description')}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Email Card */}
              <div
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderLeft: '4px solid var(--accent-primary)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {t('contact.info.email_title')}
                  </div>
                  <a
                    href="mailto:support@spendora.com"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#ffffff')}
                  >
                    support@spendora.com
                  </a>
                </div>
              </div>

              {/* Response Time Card */}
              <div
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderLeft: '4px solid #3b82f6',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    color: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {t('contact.info.response_time_title')}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                    {t('contact.info.response_time_value')}
                  </div>
                </div>
              </div>

              {/* Support Availability Card */}
              <div
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  background: '#0d0d0d',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderLeft: '4px solid #f59e0b',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    color: '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    {t('contact.info.availability_title')}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                    {t('contact.info.availability_value')}
                  </div>
                </div>
              </div>
            </div>

            {/* Reassurance Badge */}
            <div
              style={{
                background: '#111111',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <ShieldCheck size={22} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {t('contact.info.privacy_notice')}
              </span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div
            className="glass-card"
            style={{
              padding: '2.5rem',
              background: '#0e0e0e',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-hover)',
              textAlign: 'start',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.4rem' }}>
              {t('contact.form.title')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
              {t('contact.form.subtitle')}
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '2rem 1.5rem',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid var(--accent-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--accent-light)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto',
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.4rem' }}>
                  {t('contact.form.success_title')}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {t('contact.form.success_message')}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  {t('contact.form.send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('contact.form.full_name_label')}</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={t('contact.form.full_name_placeholder')}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('contact.form.email_label')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t('contact.form.email_placeholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('contact.form.subject_label')}</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder={t('contact.form.subject_placeholder')}
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('contact.form.message_label')}</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder={t('contact.form.message_placeholder')}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-input"
                    style={{ resize: 'vertical', minHeight: '110px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    marginTop: '0.5rem',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <span>{t('contact.form.sending_button')}</span>
                  ) : (
                    <>
                      <span>{t('contact.form.send_button')}</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <section style={{ maxWidth: '1050px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div
          className="glass-card"
          style={{
            padding: '3rem 2rem',
            background: 'linear-gradient(180deg, #111111 0%, #080808 100%)',
            border: '1px solid var(--border-hover)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(70px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
              {t('contact.cta.title')}
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.75rem auto', lineHeight: '1.6' }}>
              {t('contact.cta.description')}
            </p>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              {t('contact.cta.footer')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUI;
