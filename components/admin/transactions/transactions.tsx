'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Transaction } from '@/types';
import { toast } from 'sonner';
import { LoadingTransaction } from '@/components/ui/loading';
import { getExchangeRate } from '@/utils/exchange';
import Transactionstable from './TransactionsTable';
import { useTranslation } from 'react-i18next';

interface TransactionsProps {
  currency: string;
  fetchagain?: boolean;
  token: string | null;
}

export function Transactions({
  currency,
  token,
}: TransactionsProps) {
  const APP_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL!;
  const router = useRouter();
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rate, setRate] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchTransactions = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }
    try {
      const res = await fetch(`${APP_URL}/api/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === 200) {
        setTransactions(data.transactions ?? []);
      }
      if (data.status === 500) {
        router.push('/error?code=500&message=' + data.message);
      }
    } catch {
      toast.error(t('transactions_page.fetch_error'));
      setTransactions([]);
    } finally {
      setLoadingFetch(false);
      if (isManualRefresh) {
        setIsRefreshing(false);
      }
    }
  }, [APP_URL, token, router, t]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [r] = await Promise.all([
          getExchangeRate(currency),
          fetchTransactions(false),
        ]);
        if (isMounted && r) {
          setRate(r);
        }
      } catch (err) {
        console.error('Transactions load error:', err);
      }
    };
    init();

    return () => {
      isMounted = false;
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [currency, fetchTransactions]);

  const startTimer = () => {
    if (timerIntervalRef.current || timerSeconds > 0) return;

    setTimerSeconds(1);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev >= 30) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingTransaction hight={140} />
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1
                style={{
                  fontSize: '1.85rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {t('transactions_page.title')}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontWeight: '700',
                }}
              >
                {t('transactions_page.records_count', { count: transactions.length })}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {t('transactions_page.subtitle')}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => { fetchTransactions(true); startTimer(); }}
              disabled={timerSeconds > 0}
              className="btn btn-secondary"
              style={{ 
                padding: '0.65rem 0.85rem',
                gap: '0.4rem', 
                cursor: timerSeconds > 0 ? 'not-allowed' : 'pointer', 
                opacity: timerSeconds > 0 ? 0.5 : 1 , 
              }}
              title={t('transactions_page.refresh_tooltip')}
            >
              <span>
                {timerSeconds === 0 ? t('transactions_page.refresh') : `${timerSeconds}s`}
              </span>
            </button>

            <Link
              href="/transactions/new"
              className="btn btn-primary"
              style={{
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                boxShadow: 'var(--accent-glow)',
              }}
            >
              <Plus size={16} />
              <span>{t('transactions_page.create_transaction')}</span>
            </Link>
          </div>
        </div>
      </div>
      <Transactionstable
        transactions={transactions}
        token={token}
        currency={currency}
        fetchAgain={isRefreshing}
        rate={rate}
      />
    </>
  );
}
