'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {Plus} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Transaction, User } from '@/types';
import { toast } from 'sonner';
import Loading, { LoadingTransaction } from '@/components/ui/loading';
import { getExchangeRate } from '@/utils/exchange';
import Transactionstable from './TransactionsTable';

interface TransactionsProps {
  currency: string;
  fetchagain?: boolean;
  token: string | null;
}

export function Transactions({
  currency,
  token,
}: TransactionsProps) {
  const APP_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rate, setRate] = useState<number>(1);
  // Pagination State
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const buttonElement = useRef<HTMLButtonElement>(null);
  const timeElement = useRef<HTMLSpanElement>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const time = useRef(0);
  // list of payment methods
  const fetchTransactions = async (isManualRefresh = false) => {
    if (!isManualRefresh) {
      setLoadingFetch(true);
    }else{
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
      if (data.status == 200) {
        setTransactions(data.transactions ?? []);
      }
      if(data.status == 500){
        router.push('/error?code=500&message='+data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch transactions');
      setTransactions([])
    }
    setLoadingFetch(false);
    if (isManualRefresh) {
      setIsRefreshing(false);
    }
  };
  //fetch trasactions from api 
  useEffect(() => {
    fetchTransactions()

  const getRate = async () => {
      const rate = await getExchangeRate(currency)
      if (rate) {
        setRate(rate);
      }
    }
    getRate();
    fetchTransactions();
  }, []);
  //handle delete 
    const startTimer = () => {
      if (interval.current) return;
  
      time.current = 1;
  
      if (timeElement.current) {
        timeElement.current.textContent = `${time.current}s`;
      }
  
      if (buttonElement.current) {
        buttonElement.current.disabled = true;
        buttonElement.current.style.cursor = 'not-allowed';
        buttonElement.current.style.opacity = '0.5';
      }
  
      interval.current = setInterval(() => {
        time.current += 1;
  
        if (timeElement.current) {
          timeElement.current.textContent = `${time.current}s`;
        }
  
        if (time.current >= 30) {
          clearInterval(interval.current!);
          interval.current = null;
          time.current = 0;
  
          if (timeElement.current) {
            timeElement.current.textContent = 'Refresh';
          }
  
          if (buttonElement.current) {
            buttonElement.current.disabled = false;
            buttonElement.current.style.cursor = 'pointer';
            buttonElement.current.style.opacity = '1';
          }
        }
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
                Transactions
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
                {transactions.length} Records
              </span>
            </div>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              Real-time audit log of inflows, expense vouchers, category classification, and statements.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => { fetchTransactions(true); startTimer(); }}
              ref={buttonElement}
              disabled={time.current > 0}
              className="btn btn-secondary"
              style={{ 
                padding: '0.65rem 0.85rem',
                gap: '0.4rem', 
                cursor: time.current > 0 ? 'not-allowed' : 'pointer', 
                opacity: time.current > 0 ? 0.5 : 1 , 
              }}
              title="Refresh ledger"
            >

              <span ref={timeElement}>{time.current === 0 ? 'Refresh' : time.current + 's'}</span>
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
              <span>Create Transaction</span>
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
