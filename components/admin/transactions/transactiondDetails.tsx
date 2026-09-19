'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams,useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Transaction,User } from '@/types';
import { getExchangeRate } from '@/utils/exchange';
import {toast} from 'sonner';
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  DollarSign,
  Copy,
  Check,
  Printer,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ShieldCheck,
  Tag,
  FileText,
  Hash,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  CircleEllipsis,
  RefreshCw
} from 'lucide-react';
import { LoadingTransaction } from '@/components/ui/loading';

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  Utensils,
  Home,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  Zap,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  CircleEllipsis,
};

export default function TransactionDetails({user,token}: {user:User,token:string}) {
  const router = useRouter();
  const id = useParams().id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rate, setRate] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Fetch exchange rate for user currency
  useEffect(() => {
    let isMounted = true;
    const fetchRate = async () => {
      try {
        const r = await getExchangeRate(user?.currency || 'USD');
        if (isMounted) setRate(r || 1);
      } catch (err) {
        console.error('Failed to get exchange rate:', err);
      }
    };
    fetchRate();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch transaction details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const APP_URL = 'http://localhost:8000';

    const fetchTransaction = async () => {
      try {
        const res = await fetch(`${APP_URL}/api/transactions/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (!res.ok) {
                toast.error("Unauthorized");
                router.push('/login');
        }

        const data = await res.json();
        if (isMounted) {
          if (data.status === 200 && data.transaction) {
            setTransaction(data.transaction);
          } else if (data.transaction) {
            setTransaction(data.transaction);
          } else if (data.data) {
            setTransaction(data.data);
          } else if (data.id) {
            setTransaction(data);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('API transaction fetch failed:', error);
        if (isMounted) {
          setTransaction(null);
          setLoading(false);
        }
      }
    };

    fetchTransaction();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Category resolution
  const categoryMeta = useMemo(() => {
    if (!transaction) {
      return {
        name: 'General',
        icon: Tag,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
      };
    }
    return {
      name: transaction?.categories?.name || 'General Expense',
      icon: Tag,
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
    };
  }, [transaction]);

  // Payment Method icon & label
  const paymentMethodInfo = useMemo(() => {
    const rawMethod = (transaction?.payment_methods?.type || 'Credit Card').toLowerCase();
    if (rawMethod.includes('BANK') || rawMethod.includes('transfer') || rawMethod.includes('wire')) {
      return { icon: Building2, label: transaction?.payment_methods?.type || 'Bank Transfer', badge: 'ACH / Direct Wire' };
    }
    if (rawMethod.includes('ONLINE')) {
      return { icon: Wallet, label: 'PayPal Account', badge: 'Digital Wallet' };
    }
    if (rawMethod.includes('crypto') || rawMethod.includes('usdt') || rawMethod.includes('btc')) {
      return { icon: Coins, label: transaction?.payment_methods?.type || 'Crypto Wallet', badge: 'Decentralized' };
    }
    if (rawMethod.includes('CASH')) {
      return { icon: DollarSign, label: 'Physical Cash', badge: 'Direct Settlement' };
    }
    return { icon: CreditCard, label: transaction?.payment_methods?.type || 'Credit Card', badge: 'Encrypted Token' };
  }, [transaction]);

  const isIncome = (transaction?.type || '').toUpperCase() === 'INCOME';
  const currencyCode = user?.currency || 'USD';
  const originalAmount = Number(transaction?.amount || 0);
  const convertedAmount = (originalAmount * rate).toFixed(2);

  const handleCopyId = () => {
    if (!transaction) return;
    navigator.clipboard.writeText(String(transaction.id));
    setCopiedId(true);
    toast.success('Transaction reference copied!');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopySummary = () => {
    if (!transaction) return;
    const summary = `Finora Transaction Receipt\nID: #${transaction.id}\nTitle: ${transaction.title || transaction.description}\nType: ${isIncome ? 'Income' : 'Expense'}\nAmount: ${isIncome ? '+' : '-'}${convertedAmount} ${currencyCode}\nDate: ${transaction.date} ${transaction.time || ''}\nCategory: ${categoryMeta.name}\nStatus: ${transaction.status || 'Completed'}`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    toast.success('Summary copied to clipboard!');
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Printable Receipt Container Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-receipt-card, .printable-receipt-card * {
            visibility: visible;
          }
          .printable-receipt-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #cccccc !important;
            box-shadow: none !important;
            padding: 2rem !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: '1120px', margin: '0 auto', paddingBottom: '3rem' }}>
        {/* Top Breadcrumbs & Back Navigation */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => router.push('/transactions')}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.9rem',
                fontSize: '0.825rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Return to Transactions List"
            >
              <ArrowLeft size={16} />
              <span>Back to Transactions</span>
            </button>
          </div>

          {/* Quick Actions Header */}
          {transaction && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={handleCopyId}
                className="btn btn-secondary"
                style={{ fontSize: '0.775rem', padding: '0.5rem 0.85rem' }}
                title="Copy Transaction ID"
              >
                {copiedId ? <Check size={14} color="var(--accent-primary)" /> : <Copy size={14} />}
                <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="btn btn-secondary"
                style={{ fontSize: '0.775rem', padding: '0.5rem 0.85rem' }}
                title="Copy Shareable Text Summary"
              >
                {copiedSummary ? <Check size={14} color="var(--accent-primary)" /> : <Share2 size={14} />}
                <span>{copiedSummary ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="btn btn-primary"
                style={{ fontSize: '0.775rem', padding: '0.5rem 1rem' }}
                title="Print or Save PDF Receipt"
              >
                <Printer size={15} />
                <span>Print Receipt</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <LoadingTransaction hight={130}/>
        )}

        {/* Error / Not Found State */}
        {!loading && !transaction && (
          <div
            className="glass-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
              background: '#111111',
              border: '1px solid var(--border-subtle)',
              maxWidth: '560px',
              margin: '3rem auto',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <AlertCircle size={28} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              Transaction Not Found
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              We couldn't locate a transaction with ID <strong style={{ color: '#ffffff' }}>#{id}</strong>. It might have been deleted or the identifier is invalid.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button onClick={() => router.push('/transactions')} className="btn btn-primary">
                Go back 
              </button>
              <button onClick={() => router.push(`/transactions/${id}/edit`)} className="btn btn-secondary">
                Edit
              </button>
            </div>
          </div>
        )}

        {/* Main Content: 2-Column Responsive Layout */}
        {!loading && transaction && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '1.75rem',
              alignItems: 'start',
            }}
            className="tx-details-grid"
          >
            {/* LEFT COLUMN: The Digital Receipt Card */}
            <div
              className="glass-card printable-receipt-card"
              style={{
                background: 'linear-gradient(180deg, #131313 0%, #0d0d0d 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Subtle top glowing accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: isIncome
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : 'linear-gradient(90deg, #ef4444, #f59e0b)',
                }}
              />

              {/* Receipt Header & Verified Watermark */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>
                      Fin<span style={{ color: 'var(--accent-primary)' }}>ora</span>
                    </span>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        background: '#1c1c1c',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Official Receipt
                    </span>
                  </div>
                  <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    Transaction Reference #{transaction.id}
                  </p>
                </div>

                {/* Status Pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background:
                      transaction.status === 'Pending'
                        ? 'rgba(234, 179, 8, 0.12)'
                        : 'rgba(16, 185, 129, 0.12)',
                    border: `1px solid ${transaction.status === 'Pending'
                      ? 'rgba(234, 179, 8, 0.3)'
                      : 'rgba(16, 185, 129, 0.3)'
                      }`,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: transaction.status === 'Pending' ? '#eab308' : '#10b981',
                      boxShadow:
                        transaction.status === 'Pending'
                          ? '0 0 8px #eab308'
                          : '0 0 8px #10b981',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: transaction.status === 'Pending' ? '#eab308' : '#10b981',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {transaction.status || 'Completed'}
                  </span>
                </div>
              </div>

              {/* Central Amount Hero Display */}
              <div
                style={{
                  padding: '2rem 0',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    background: isIncome ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${isIncome ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                    marginBottom: '1rem',
                  }}
                >
                  {isIncome ? (
                    <ArrowDownLeft size={14} color="#10b981" />
                  ) : (
                    <ArrowUpRight size={14} color="#f87171" />
                  )}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: isIncome ? '#10b981' : '#f87171',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {isIncome ? 'Income Received' : 'Expense Payment'}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '2.75rem',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    color: isIncome ? '#10b981' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    lineHeight: 1.1,
                  }}
                >
                  <span>{isIncome ? '+' : '-'}</span>
                  <span>{convertedAmount}</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                    {currencyCode}
                  </span>
                </div>

              </div>

              {/* Perforated Divider */}
              <div
                style={{
                  position: 'relative',
                  margin: '0.5rem -2rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    marginLeft: '-9px',
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    borderTop: '2px dashed rgba(255, 255, 255, 0.12)',
                    height: 0,
                  }}
                />
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--bg-primary)',
                    marginRight: '-9px',
                  }}
                />
              </div>

              {/* Detailed Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Transaction Specification
                </div>

                {/* Merchant / Description */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Merchant / Title</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', textAlign: 'right' }}>
                    {transaction.title || transaction.description || 'Standard Transaction'}
                  </span>
                </div>

                {/* Category Item */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</span>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: categoryMeta.bg,
                      color: categoryMeta.color,
                      fontWeight: '700',
                      fontSize: '0.775rem',
                    }}
                  >
                    <categoryMeta.icon size={14} />
                    <span>{categoryMeta.name}</span>
                  </div>
                </div>

                {/* Date & Time */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Transaction Timestamp</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </div>
                    {transaction.time && (
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {new Date(transaction.time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })} (UTC)
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Payment Method</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textAlign: 'right' }}>
                    <paymentMethodInfo.icon size={15} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>
                      {paymentMethodInfo.label}
                    </span>
                  </div>
                </div>

                {/* Reference ID with quick copy */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Reference Number</span>
                  <div
                    onClick={handleCopyId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#181818',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      fontSize: '0.775rem',
                      fontFamily: 'monospace',
                      color: '#ffffff',
                    }}
                    title="Click to copy reference ID"
                  >
                    <span>#{transaction.id}</span>
                    {copiedId ? <Check size={12} color="var(--accent-primary)" /> : <Copy size={12} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Settlement Fee & Tax Summary */}
                <div
                  style={{
                    marginTop: '0.75rem',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#0a0a0a',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Gross Amount</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      {convertedAmount} {currencyCode}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Processing Fee</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>$0.00 (Waived)</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Applicable Tax</span>
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>$0.00</span>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '0.65rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                      Net Settled Total
                    </span>
                    <span
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: '800',
                        color: isIncome ? '#10b981' : '#ffffff',
                      }}
                    >
                      {isIncome ? '+' : '-'} {convertedAmount} {currencyCode}
                    </span>
                  </div>
                </div>

                {/* Digital Barcode / Security Stamp */}
                <div
                  style={{
                    marginTop: '0.5rem',
                    paddingTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Finora Cryptographic Ledger Verified
                    </span>
                  </div>
                  {/* Decorative Barcode Lines */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '3px',
                      height: '24px',
                      alignItems: 'center',
                      opacity: 0.4,
                    }}
                  >
                    {[3, 1, 4, 2, 1, 5, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 5, 1, 2, 4, 2].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${w * 2}px`,
                          height: '100%',
                          background: '#ffffff',
                          borderRadius: '1px',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Audit Trail, Payment Security, Notes & Actions */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              {/* 2. Virtual Payment Instrument Card */}
              <div
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #181818 0%, #0d0d0d 100%)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <paymentMethodInfo.icon size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Payment Instrument
                    </h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: '700',
                      color: 'var(--accent-primary)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    {paymentMethodInfo.badge}
                  </span>
                </div>

                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 20, 20, 0.8) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>
                      {paymentMethodInfo.label}
                    </div>
                    {/* Chip Graphic */}
                    <div
                      style={{
                        width: '28px',
                        height: '20px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    />
                  </div>

                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)' }}>
                    •••• •••• •••• {transaction.id.slice(-4) || '8842'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    <span>CARDHOLDER: {user?.name?.toUpperCase() || 'FINORA USER'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--accent-primary)' }}>
                      <ShieldCheck size={12} />
                      <span>256-Bit SSL</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Notes & Additional Memo Section */}
              <div
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  background: '#121212',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <FileText size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                    Notes & Ledger Memo
                  </h3>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    background: '#0a0a0a',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.825rem',
                    color: transaction.description || transaction.title ? '#ffffff' : 'var(--text-muted)',
                    lineHeight: 1.5,
                  }}
                >
                  {transaction.description || transaction.title ? (
                    <span>"{transaction.description || transaction.title}"</span>
                  ) : (
                    <span>No additional memo or receipts attached to this record.</span>
                  )}
                </div>
              </div>

              {/* 4. Navigation & Ledger Shortcuts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}
              >
                <button
                  onClick={() => router.push('/transactions')}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>View All Records</span>
                </button>

                <button
                  onClick={() => router.push(`/transactions/${id}/edit`)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.75rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>Edit </span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Breakpoint Adjustments */}
      <style>{`
        @media (max-width: 860px) {
          .tx-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}