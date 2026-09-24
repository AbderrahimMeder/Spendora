'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  DollarSign,
  Smartphone,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type { payment_methodsCreate } from '@/types';
const PAYMENT_TYPE_OPTIONS = [
  { value: 'BANK_TRANSFER', label: 'Bank Transfer / Wire', icon: Building2 },
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
  { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
  { value: 'CASH', label: 'Cash', icon: DollarSign },
  { value: 'DIGITAL_WALLET', label: 'Digital Wallet (PayPal, Stripe, etc.)', icon: Wallet },
  { value: 'CRYPTO', label: 'Cryptocurrency', icon: Coins },
  { value: 'MOBILE_PAYMENT', label: 'Mobile Payment (Apple Pay, Google Pay)', icon: Smartphone },
  { value: 'OTHER', label: 'Other', icon: CreditCard },
];

type NewPaymentMethodProps = {
  token?: string | null;
};

export function NewPaymentMethod({ token }: NewPaymentMethodProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [PaymentData,setPaymentData] = useState<payment_methodsCreate>({
    name:"",
    type:"CASH",
    is_active:true
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!PaymentData.name.trim()) {
      toast.error('Please enter a payment method name');
      return;
    }

    if (!PaymentData.type.trim()) {
      toast.error('Please select or specify a payment method type');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.LARAVEL_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(PaymentData),
      });

      const data = await response.json();

      if (response.ok || data?.status === 200 || data?.status === 201) {
        toast.success('Payment method created successfully!');
        router.push('/payment-method');
        router.refresh();
      } else {
        toast.error(data?.message || 'Failed to create payment method');
      }
    } catch (error: any) {

      toast.error(error?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/payment-method"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: '600',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: '#121212',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1rem',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'var(--border-hover)';
            e.currentTarget.style.background = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = '#121212';
          }}
        >
          <ArrowLeft size={14} />
          <span>Back to Payment Methods</span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
          New Payment Method
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
          Add a new payment method to record and organize your transactions.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#121212',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            style={{
              display: 'block',
              fontSize: '0.775rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem',
            }}
          >
            Payment Method Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Chase Checking, Main PayPal, Cash Wallet"
            value={PaymentData.name}
            onChange={(e) => setPaymentData({...PaymentData, name: e.target.value})}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#090909',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            required
            autoFocus
          />
        </div>

        {/* Type Field */}
        <div>
          <label
            htmlFor="type"
            style={{
              display: 'block',
              fontSize: '0.775rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '0.4rem',
            }}
          >
            Type <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="type"
            value={PaymentData.type}
            onChange={(e) => setPaymentData({ ...PaymentData, type: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#090909',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          >
            {PAYMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Toggle / Checkbox */}
        <div
          style={{
            padding: '1rem',
            background: '#090909',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '0.2rem',
              }}
            >
              Active Status
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Enable this method to appear in transaction selectors
            </div>
          </div>

          <label
            style={{
              position: 'relative',
              display: 'inline-block',
              width: '44px',
              height: '24px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <input
              type="checkbox"
              checked={PaymentData.is_active}
              onChange={(e) => setPaymentData({ ...PaymentData, is_active: e.target.checked })}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: PaymentData.is_active ? 'var(--accent-primary)' : '#222222',
                borderRadius: '24px',
                transition: '0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: '18px',
                  width: '18px',
                  left: PaymentData.is_active ? '23px' : '3px',
                  bottom: '3px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  transition: '0.2s',
                }}
              />
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '0.5rem',
          }}
        >
          <Link
            href="/payment-method"
            className="btn btn-secondary"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.5rem',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Create Payment Method</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}