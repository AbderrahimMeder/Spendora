'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { Category, payment_methods, Transaction, TransactionCreate, User } from '@/types';
import { LoadingTransaction } from '@/components/ui/loading';
import { getExchangeRate } from '@/utils/exchange';
import { useTranslation } from 'react-i18next';

const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

interface TransactionProps {
  categories?: Category[];
  paymentMethods?: payment_methods[];
  mode?: 'create' | 'edit';
  transaction?: Transaction;
  user?: User;
  token?: string;
}

export default function TransactionAction({
  mode = 'create',
  transaction,
  user,
  token,
}: TransactionProps) {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const APP_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL!;
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<payment_methods[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(true);
  const [transactionData, setTransactionData] = useState<TransactionCreate>({
    amount: transaction?.amount ?? 0,
    title: transaction?.title ?? '',
    type: transaction?.type ?? 'EXPENSE',
    currency: transaction?.currency ?? user?.currency ?? 'USD',
    category_id: transaction?.categories?.id ?? '',
    date: transaction?.date ?? new Date().toISOString().split('T')[0],
    payment_method_id: transaction?.payment_methods?.id ?? '',
    description: transaction?.description ?? '',
    status: transaction?.status ?? 'PENDING',
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        if (!token) {
          toast.error(t('transaction_form.validation.session_expired'));
          router.push('/login');
          return;
        }

        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        const promises: Promise<Response>[] = [
          fetch(`${APP_URL}/api/categories`, { method: 'GET', headers }),
          fetch(`${APP_URL}/api/payment-methods`, { method: 'GET', headers }),
        ];

        if (mode === 'edit' && id) {
          promises.push(fetch(`${APP_URL}/api/transactions/${id}`, { method: 'GET', headers }));
        }

        const responses = await Promise.all(promises);

        if (responses[0]?.ok) {
          const catData = await responses[0].json();
          if (isMounted) setCategories(catData.categories || []);
        }

        if (responses[1]?.ok) {
          const pmData = await responses[1].json();
          if (isMounted) setPaymentMethods(pmData.payment_methods || []);
        }

        if (mode === 'edit' && responses[2]?.ok) {
          const txData = await responses[2].json();
          if (isMounted && txData.transaction) {
            setTransactionData(txData.transaction);
          }
        }
      } catch (err) {
        console.error('Error fetching transaction form data:', err);
      } finally {
        if (isMounted) setIsLoadingFetch(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [id, mode, token, APP_URL, router, t]);

  const handleAddQuickAmount = (val: number) => {
    const current = parseFloat(transactionData.amount.toString()) || 0;
    setTransactionData({ ...transactionData, amount: current + val });
  };

  const setQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setTransactionData({ ...transactionData, date: d.toISOString().split('T')[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !transactionData.amount ||
      isNaN(parseFloat(transactionData.amount.toString())) ||
      parseFloat(transactionData.amount.toString()) <= 0
    ) {
      toast.error(t('transaction_form.validation.valid_amount'));
      return;
    }

    if (!transactionData?.title?.trim()) {
      toast.error(t('transaction_form.validation.enter_title'));
      return;
    }

    if (!token) {
      toast.error(t('transaction_form.validation.session_expired'));
      router.push('/login');
      return;
    }

    setLoading(true);

    if (mode === 'create') {
      const rate = await getExchangeRate(user?.currency || 'USD');
      const sendData = {
        ...transactionData,
        amount: (transactionData.amount / (rate ?? 1)).toFixed(2),
      };
      try {
        const response = await fetch(`${APP_URL}/api/transactions`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sendData),
        });

        const data = await response.json();
        if (response.ok || data.status === 200 || data.status === 201) {
          toast.success(
            t('transaction_form.validation.create_success', {
              type: transactionData.type === 'INCOME' ? t('transaction_form.income') : t('transaction_form.expense'),
            })
          );
          router.push('/transactions');
        } else {
          toast.error(data.message || t('transaction_form.validation.create_error'));
        }
      } catch (error) {
        console.error('Transaction creation error:', error);
        toast.error(t('transaction_form.validation.network_error'));
      } finally {
        setLoading(false);
      }
    } else if (mode === 'edit') {
      try {
        const response = await fetch(`${APP_URL}/api/transactions/${id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionData),
        });
        const data = await response.json();
        if (response.ok || data.status === 200 || data.status === 201) {
          toast.success(t('transaction_form.validation.update_success'));
          router.push(`/transactions/${id}`);
        } else {
          toast.error(t('transaction_form.validation.update_error'));
        }
      } catch {
        toast.error(t('transaction_form.validation.network_error'));
      } finally {
        setLoading(false);
      }
    }
  };

  const currencySymbol = user?.currency || '$';

  if (isLoadingFetch) return <LoadingTransaction hight={130} />;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/transactions"
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
          <span>{t('transaction_form.back')}</span>
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
          {mode === 'edit' ? t('transaction_form.edit_title') : t('transaction_form.new_title')}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
          {mode === 'edit' ? t('transaction_form.edit_subtitle') : t('transaction_form.new_subtitle')}
        </p>
      </div>

      {/* Form Container */}
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
        {/* 1. Styled Type Toggle Buttons */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.775rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              marginBottom: '0.5rem',
            }}
          >
            {t('transaction_form.type_label')}
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            {/* Expense Button */}
            <button
              type="button"
              onClick={() => setTransactionData({ ...transactionData, type: 'EXPENSE' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border:
                  transactionData.type === 'EXPENSE'
                    ? '1.5px solid #ef4444'
                    : '1px solid var(--border-subtle)',
                background:
                  transactionData.type === 'EXPENSE'
                    ? 'rgba(239, 68, 68, 0.12)'
                    : '#0a0a0a',
                color: transactionData.type === 'EXPENSE' ? '#ef4444' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ArrowDownLeft size={18} />
              <span>{t('transaction_form.expense')}</span>
            </button>

            {/* Income Button */}
            <button
              type="button"
              onClick={() => setTransactionData({ ...transactionData, type: 'INCOME' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border:
                  transactionData.type === 'INCOME'
                    ? '1.5px solid #10b981'
                    : '1px solid var(--border-subtle)',
                background:
                  transactionData.type === 'INCOME'
                    ? 'rgba(16, 185, 129, 0.12)'
                    : '#0a0a0a',
                color: transactionData.type === 'INCOME' ? '#10b981' : 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <ArrowUpRight size={18} />
              <span>{t('transaction_form.income')}</span>
            </button>
          </div>
        </div>

        {/* 2. Title / Merchant */}
        <div>
          <label
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
            {t('transaction_form.title_label')}
          </label>
          <input
            type="text"
            placeholder={
              transactionData.type === 'EXPENSE'
                ? t('transaction_form.placeholder_expense')
                : t('transaction_form.placeholder_income')
            }
            value={transactionData.title}
            onChange={(e) => setTransactionData({ ...transactionData, title: e.target.value })}
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
          />
        </div>

        {/* 3. Amount & Currency with Quick-Add Buttons */}
        <div>
          <label
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
            {t('transaction_form.amount_label')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '0.75rem' }}>
            {/* Amount Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#090909',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0 0.85rem',
                transition: 'border-color 0.15s ease',
              }}
              id="amount-box"
            >
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  marginInlineEnd: '0.5rem',
                }}
              >
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={transactionData.amount || ''}
                onChange={(e) => setTransactionData({ ...transactionData, amount: parseFloat(e.target.value) || 0 })}
                onFocus={() => {
                  const el = document.getElementById('amount-box');
                  if (el) el.style.borderColor = 'var(--accent-primary)';
                }}
                onBlur={() => {
                  const el = document.getElementById('amount-box');
                  if (el) el.style.borderColor = 'var(--border-subtle)';
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 0',
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                required
              />
            </div>

            {/* Currency Select */}
            <input
              value={transactionData.currency}
              onChange={(e) => setTransactionData({ ...transactionData, currency: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 0.85rem',
                background: '#090909',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              disabled
              placeholder={user?.currency}
            />
          </div>

          {/* Quick Amount Pill Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{t('transaction_form.add_label')}</span>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAddQuickAmount(val)}
                style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#181818',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                  e.currentTarget.style.background = '#222222';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = '#181818';
                }}
              >
                +{val}
              </button>
            ))}
            {Boolean(transactionData.amount) && (
              <button
                type="button"
                onClick={() => setTransactionData({ ...transactionData, amount: 0 })}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginInlineStart: 'auto',
                }}
              >
                {t('transaction_form.clear')}
              </button>
            )}
          </div>
        </div>

        {/* 4. Category & Payment Method */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label
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
              {t('transaction_form.category_label')}
            </label>
            <select
              value={transactionData.category_id}
              onChange={(e) => setTransactionData({ ...transactionData, category_id: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 0.85rem',
                background: '#090909',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            >
              <option value="">{t('transaction_form.select_category')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: '#111', color: '#fff' }}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
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
              {t('transaction_form.payment_method_label')}
            </label>
            <select
              value={transactionData.payment_method_id}
              onChange={(e) => setTransactionData({ ...transactionData, payment_method_id: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 0.85rem',
                background: '#090909',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.15s ease',
                cursor: 'pointer',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            >
              <option value="">{t('transaction_form.select_payment_method')}</option>
              {paymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id} style={{ background: '#111', color: '#fff' }}>
                  {pm.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Date */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label
              style={{
                fontSize: '0.775rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-secondary)',
              }}
            >
              {t('transaction_form.date_label')}
            </label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {t('transaction_form.today')}
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>•</span>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {t('transaction_form.yesterday')}
              </button>
            </div>
          </div>
          <input
            type="date"
            value={transactionData.date?.split('T')[0] ?? ''}
            onChange={(e) => setTransactionData({ ...transactionData, date: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 0.85rem',
              background: '#090909',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              colorScheme: 'dark',
            }}
            required
          />
        </div>

        {/* 6. Notes (Optional) */}
        <div>
          <label
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
            {t('transaction_form.notes_label')}
          </label>
          <textarea
            rows={3}
            placeholder={t('transaction_form.notes_placeholder')}
            value={transactionData.description}
            onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem 0.85rem',
              background: '#090909',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>

        {/* 7. Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.8rem 1.5rem',
              background: transactionData.type === 'EXPENSE' ? '#ef4444' : 'var(--accent-primary)',
              color: transactionData.type === 'EXPENSE' ? '#ffffff' : '#000000',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
              boxShadow:
                transactionData.type === 'EXPENSE'
                  ? '0 0 16px rgba(239, 68, 68, 0.25)'
                  : 'var(--accent-glow)',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{t('transaction_form.saving')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>
                  {mode === 'edit'
                    ? t('transaction_form.save_changes')
                    : transactionData.type === 'INCOME'
                    ? t('transaction_form.save_income')
                    : t('transaction_form.save_expense')}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push('/transactions')}
            style={{
              padding: '0.8rem 1.5rem',
              background: '#181818',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--border-hover)';
              e.currentTarget.style.background = '#222222';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = '#181818';
            }}
          >
            {t('transaction_form.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
