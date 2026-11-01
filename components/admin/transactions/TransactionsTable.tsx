'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
  Download,
  Calendar,
  CreditCard,
  Building2,
  Wallet,
  DollarSign,
  Coins,
  CheckCircle2,
  Clock,
  Trash2,
  Receipt,
  X,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Transaction } from '@/types';
import { toast } from 'sonner';
import { LoadingTransaction } from '@/components/ui/loading';
import { useTranslation } from 'react-i18next';

type TransactionstableProps = {
  transactions: Transaction[];
  token: string | null;
  currency: string;
  fetchAgain: boolean;
  rate: number;
};

export default function Transactionstable({
  transactions,
  token,
  currency,
  fetchAgain,
  rate
}: TransactionstableProps) {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [showHidden, setShowHidden] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [actionId, setActionId] = useState<string | null>(null);
  const [checkdelete, setcheckdelete] = useState<boolean>(false);
  const [loadingTrash, setLoadingTrash] = useState<boolean>(false);
  const router = useRouter();

  const handleDeleteTrasaction = async (id: string) => {
    try {
      setLoadingTrash(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/transactions/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.status == 200) {
        toast.success(t('transactions_page.delete_modal.success'));
        setcheckdelete(false);
      }
    } catch {
      toast.error(t('transactions_page.delete_modal.error'));
    } finally {
      setLoadingTrash(false);
    }
  };

  const handleEditTrasaction = (id: string) => {
    router.push(`/transactions/${id}/edit`);
  };

  const paymentMethods = [
    'ALL',
    ...new Set(
      (transactions ?? [])
        .map((t) => t.payment_methods?.name ?? ''.replace(/_/g, ' ') ?? '')
        .filter(Boolean)
    ),
  ];

  const categories = [
    'ALL',
    ...new Set(
      (transactions ?? [])
        .map((t) => t.categories?.name ?? ''.replace(/_/g, ' ') ?? '')
        .filter(Boolean)
    ),
  ];

  const getPaymentIcon = (method?: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('bank') || m.includes('wire') || m.includes('ach')) return Building2;
    if (m.includes('paypal')) return Wallet;
    if (m.includes('crypto') || m.includes('btc') || m.includes('usdt')) return Coins;
    if (m.includes('cash')) return DollarSign;
    return CreditCard;
  };

  const processedTransactions = useMemo(() => {
    return (transactions ?? [])
      .filter((tx) => {
        const matchesType =
          filterType === 'ALL' || (tx.type || '').toUpperCase() === filterType.toUpperCase();
        const matchesCategory =
          selectedCategory === 'ALL' ||
          (tx.categories?.name || '').toLowerCase() === selectedCategory.toLowerCase();
        const matchesHidden =
          showHidden === 'ALL' || !tx.is_hidden === (showHidden === 'FALSE');
        const matchesPayment =
          selectedPaymentMethod === 'ALL' ||
          (tx.payment_methods?.name || '').toLowerCase().replace(/_/g, ' ') === selectedPaymentMethod.toLowerCase();
        let matchesDate = true;
        if (dateRange !== 'ALL' && tx.date) {
          const txDate = new Date(tx.date);
          const now = new Date();

          if (dateRange === '24h') {
            matchesDate =
              txDate.getFullYear() === now.getFullYear() &&
              txDate.getMonth() === now.getMonth() &&
              txDate.getDate() === now.getDate();
          } else if (dateRange === '30d') {
            matchesDate =
              txDate.getFullYear() === now.getFullYear() &&
              txDate.getMonth() === now.getMonth();
          } else if (dateRange === '1y') {
            matchesDate =
              txDate.getFullYear() === now.getFullYear();
          }
        }
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          (tx.title || '').toLowerCase().includes(query) ||
          (tx.description || '').toLowerCase().includes(query) ||
          (tx.categories?.name || '').toLowerCase().includes(query) ||
          (tx.payment_methods?.name || '').toLowerCase().includes(query) ||
          (tx.date || '').toLowerCase().includes(query) ||
          String(tx.amount || '').includes(query);

        return matchesType && matchesCategory && matchesPayment && Boolean(matchesDate) && matchesSearch && matchesHidden;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime();
        }
        if (sortBy === 'amount-desc') {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }
        if (sortBy === 'amount-asc') {
          return Number(a.amount || 0) - Number(b.amount || 0);
        }
        if (sortBy === 'title-asc') {
          return (a.title || a.description || '').localeCompare(b.title || b.description || '');
        }
        return 0;
      });
  }, [
    transactions,
    filterType,
    selectedCategory,
    selectedPaymentMethod,
    dateRange,
    sortBy,
    searchQuery,
    showHidden,
  ]);

  const totalPages = Math.max(1, Math.ceil(processedTransactions.length / itemsPerPage));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(start, start + itemsPerPage);
  }, [processedTransactions, currentPage, itemsPerPage]);

  const hasActiveFilters =
    filterType !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedPaymentMethod !== 'ALL' ||
    dateRange !== 'ALL' ||
    searchQuery.trim().length > 0 ||
    showHidden !== 'ALL';

  const handleResetFilters = () => {
    setFilterType('ALL');
    setSelectedCategory('ALL');
    setSelectedPaymentMethod('ALL');
    setDateRange('ALL');
    setSortBy('date-desc');
    setSearchQuery('');
    setCurrentPage(1);
    setShowHidden('ALL');
  };

  const handleExportCSV = () => {
    if (processedTransactions.length === 0) {
      toast.error('No transactions available to export');
      return;
    }
    const headers = ['ID', 'Type', 'Title', 'Category', 'Amount', 'Currency', 'Date', 'Time', 'Payment Method', 'Status', 'Notes'];
    const rows = processedTransactions.map((tx) => [
      tx.id,
      tx.type,
      `"${(tx.title || '').replace(/"/g, '""')}"`,
      `"${(tx.categories?.name || '').replace(/"/g, '""')}"`,
      tx.amount,
      currency || 'USD',
      tx.date || '',
      tx.time || '',
      `"${(tx.payment_methods?.name || '').replace(/"/g, '""')}"`,
      tx.status || 'Completed',
      `"${(tx.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Spendora_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(t('transactions_page.export_success'));
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Search & Filter Toolbar */}
        <div
          className="glass-card"
          style={{
            padding: '1.25rem 1.5rem',
            background: '#121212',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Row 1: Search Bar & Type Tabs & Export */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            {/* Type Toggle Tabs */}
            <div
              style={{
                display: 'flex',
                background: '#090909',
                padding: '0.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { id: 'ALL', label: t('transactions_page.tabs.all'), count: transactions.length },
                {
                  id: 'EXPENSE',
                  label: t('transactions_page.tabs.expenses'),
                  count: transactions.filter((t) => (t.type || '').toUpperCase() === 'EXPENSE').length,
                },
                {
                  id: 'INCOME',
                  label: t('transactions_page.tabs.income'),
                  count: transactions.filter((t) => (t.type || '').toUpperCase() === 'INCOME').length,
                },
              ].map((tab) => {
                const active = filterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFilterType(tab.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      background: active ? 'var(--accent-primary)' : 'transparent',
                      color: active ? '#000000' : 'var(--text-secondary)',
                      fontWeight: active ? '700' : '500',
                      fontSize: '0.8rem',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '0.675rem',
                        padding: '1px 5px',
                        borderRadius: '10px',
                        background: active ? 'rgba(0,0,0,0.2)' : '#181818',
                        color: active ? '#000000' : 'var(--text-muted)',
                        fontWeight: '700',
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Export Action */}
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{
                fontSize: '0.8rem',
                padding: '0.5rem 0.85rem',
                gap: '0.4rem',
              }}
              title={t('transactions_page.export_csv_title')}
            >
              <Download size={14} />
              <span>{t('transactions_page.export_csv')}</span>
            </button>
          </div>

          {/* Row 2: Secondary Dropdown Filters */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <SlidersHorizontal size={13} />
              <span>{t('transactions_page.filters')}</span>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: '#0e0e0e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                color: selectedCategory !== 'ALL' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.775rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{t('transactions_page.all_categories')}</option>
              {categories?.filter(c => c !== 'ALL').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Payment Method Dropdown */}
            <select
              value={selectedPaymentMethod}
              onChange={(e) => {
                setSelectedPaymentMethod(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: '#0e0e0e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                color: selectedPaymentMethod !== 'ALL' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.775rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{t('transactions_page.all_methods')}</option>
              {paymentMethods.filter(p => p !== 'ALL').map((tMethod) => (
                <option key={tMethod} value={tMethod}>
                  {tMethod}
                </option>
              ))}
            </select>

            {/* Date Range Dropdown */}
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                background: '#0e0e0e',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                color: dateRange !== 'ALL' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontSize: '0.775rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">{t('transactions_page.date_range.all')}</option>
              <option value="24h">{t('transactions_page.date_range.24h')}</option>
              <option value="7d">{t('transactions_page.date_range.7d')}</option>
              <option value="30d">{t('transactions_page.date_range.30d')}</option>
              <option value="1y">{t('transactions_page.date_range.1y')}</option>
            </select>

            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
              <Search
                size={15}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  insetInlineStart: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder={t('transactions_page.search_placeholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  background: '#090909',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 2rem 0.55rem 2.4rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    insetInlineEnd: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-end justify-between gap-2">
              <select
                value={showHidden}
                onChange={(e) => setShowHidden(e.target.value)}
                style={{
                  background: '#0e0e0e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.775rem',
                  outline: 'none',
                  cursor: 'pointer',
                  marginInlineStart: 'auto',
                }}
              >
                <option value="ALL">{t('transactions_page.visibility.all')}</option>
                <option value="FALSE">{t('transactions_page.visibility.hide')}</option>
                <option value="TRUE">{t('transactions_page.visibility.show')}</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: '#0e0e0e',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.775rem',
                  outline: 'none',
                  cursor: 'pointer',
                  marginInlineStart: 'auto',
                }}
              >
                <option value="date-desc">{t('transactions_page.sort.newest')}</option>
                <option value="date-asc">{t('transactions_page.sort.oldest')}</option>
                <option value="amount-desc">{t('transactions_page.sort.highest')}</option>
                <option value="amount-asc">{t('transactions_page.sort.lowest')}</option>
                <option value="title-asc">{t('transactions_page.sort.alphabetical')}</option>
              </select>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <X size={12} />
                <span>{t('transactions_page.reset')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Transactions List / Table */}
        {fetchAgain ? (
          <LoadingTransaction hight={50} />
        ) : (
          <div
            className="glass-card"
            style={{
              background: '#121212',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(200px, 2fr) 1.2fr 1fr 1fr 1.2fr 100px',
                padding: '0.85rem 1.25rem',
                background: '#0a0a0a',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
                alignItems: 'center',
              }}
              className="tx-table-header"
            >
              <div>{t('transactions_page.headers.payee')}</div>
              <div>{t('transactions_page.headers.category')}</div>
              <div>{t('transactions_page.headers.datetime')}</div>
              <div style={{ textAlign: 'end' }}>{t('transactions_page.headers.payment_method')}</div>
              <div style={{ textAlign: 'end' }}>{t('transactions_page.headers.amount', { currency })}</div>
              <div style={{ textAlign: 'center' }}>{t('transactions_page.headers.actions')}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {paginatedTransactions.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 1.5rem',
                    background: '#0d0d0d',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#161616',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <Receipt size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', margin: '0 0 0.4rem' }}>
                    {t('transactions_page.empty.title')}
                  </h3>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      maxWidth: '380px',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    {hasActiveFilters
                      ? t('transactions_page.empty.desc_filtered')
                      : t('transactions_page.empty.desc_empty')}
                  </p>

                  {hasActiveFilters ? (
                    <button
                      onClick={handleResetFilters}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.825rem', padding: '0.5rem 1.25rem' }}
                    >
                      {t('transactions_page.empty.clear_filters')}
                    </button>
                  ) : (
                    <Link
                      href="/transactions/new"
                      className="btn btn-primary"
                      style={{ fontSize: '0.825rem', padding: '0.5rem 1.25rem', gap: '0.4rem' }}
                    >
                      <Plus size={15} />
                      <span>{t('transactions_page.empty.create_first')}</span>
                    </Link>
                  )}
                </div>
              ) : (
                paginatedTransactions.map((tx, idx) => {
                  const isIncome = (tx.type || '').toUpperCase() === 'INCOME';
                  const MethodIcon = getPaymentIcon(tx.payment_methods?.name);
                  const converted = (Number(tx.amount || 0) * rate).toFixed(0);

                  return (
                    <div
                      key={tx.id || idx}
                      onClick={() => router.push(`/transactions/${tx.id}`)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(200px, 2fr) 1.2fr 1fr 1fr 1.2fr 100px',
                        padding: '0.95rem 1.25rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: '#0e0e0e',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      className="tx-table-row"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#151515';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#0e0e0e';
                      }}
                    >
                      {/* Column 1: Icon, Title & Description */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'gray',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        />

                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: '700',
                              color: '#ffffff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <span>{tx.title || tx.description || 'Transaction'}</span>
                          </div>
                          {tx.description && tx.description !== tx.title && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginTop: '2px',
                              }}
                            >
                              {tx.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 2: Category Pill */}
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px',
                            background: tx.type === 'EXPENSE' ? 'rgba(223, 14, 14, 0.3)' : 'rgba(38, 203, 93, 0.3)',
                            color: 'rgba(255, 255, 255, 1)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: tx.type === 'EXPENSE' ? 'red' : 'green',
                            }}
                          />
                          <span>{tx?.categories?.name}</span>
                        </span>
                      </div>

                      {/* Column 3: Date & Time */}
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={12} color="var(--text-muted)" />
                          <span>
                            {new Date(tx.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            }) || 'N/A'}
                          </span>
                        </div>
                        {tx.time && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              color: 'var(--text-muted)',
                              fontSize: '0.7rem',
                              marginTop: '2px',
                            }}
                          >
                            <Clock size={11} />
                            <span>
                              {new Date(tx.time).toLocaleTimeString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Column 4: Payment Method */}
                      <div style={{ textAlign: 'end' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.775rem',
                            color: 'var(--text-secondary)',
                            background: '#161616',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '5px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <MethodIcon size={12} color="var(--text-muted)" />
                          <span>{tx.payment_methods?.name?.toLowerCase().replace(/_/g, ' ') || '******'}</span>
                        </span>
                      </div>

                      {/* Column 5: Amount */}
                      <div style={{ textAlign: 'end' }}>
                        <div
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: '800',
                            color: isIncome ? '#10b981' : '#f87171',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {isIncome ? '+' : '-'} {converted} {currency}
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.675rem',
                            color: tx.status === 'Pending' ? '#eab308' : '#10b981',
                            marginTop: '2px',
                          }}
                        >
                          {tx.status === 'Pending' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                          <span>{tx.status === 'Pending' ? t('transactions_page.status.pending') : t('transactions_page.status.completed')}</span>
                        </div>
                      </div>

                      {/* Column 6: Actions */}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setActionId(actionId === tx.id ? null : tx.id);
                          }}
                          className="btn-icon"
                          style={{
                            padding: '0.4rem',
                            borderRadius: '6px',
                            background: '#141414',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                          }}
                          title={t('transactions_page.actions.menu_tooltip')}
                        >
                          <ChevronRight size={14} />
                        </button>

                        {actionId === tx.id && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 6px)',
                              insetInlineEnd: 0,
                              minWidth: '100px',
                              background: '#141414',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '0.35rem',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                              zIndex: 1000,
                            }}
                          >
                            <button
                              onClick={() => {
                                setcheckdelete(true);
                              }}
                              disabled={loadingTrash}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                padding: '0.65rem 0.75rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#f87171',
                                cursor: loadingTrash ? 'not-allowed' : 'pointer',
                                textAlign: 'start',
                              }}
                            >
                              {loadingTrash ? <RefreshCw size={12} color="#f87171" className="animate-spin" /> : <Trash2 size={12} color="#f87171" />}
                              <span>{t('transactions_page.actions.delete')}</span>
                            </button>

                            <button
                              onClick={() => {
                                handleEditTrasaction(tx.id);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.75rem',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                textAlign: 'start',
                              }}
                            >
                              <span>{t('transactions_page.actions.edit')}</span>
                            </button>
                          </div>
                        )}

                        {checkdelete && (
                          <div
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: 'rgba(0, 0, 0, 0.5)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              zIndex: 1000,
                            }}
                          >
                            <div
                              style={{
                                background: 'var(--bg-primary)',
                                padding: '1.5rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                maxWidth: '380px',
                              }}
                            >
                              <p style={{ margin: '0 0 1rem 0', color: '#ffffff', fontSize: '0.9rem' }}>
                                {t('transactions_page.delete_modal.confirm_msg')}
                              </p>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleDeleteTrasaction(tx.id)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    background: '#f87171',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {t('transactions_page.delete_modal.yes')}
                                </button>
                                <button
                                  onClick={() => setcheckdelete(false)}
                                  style={{
                                    padding: '0.5rem 1rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '6px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {t('transactions_page.delete_modal.no')}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer with Pagination */}
            {processedTransactions.length > 0 && (
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  background: '#0a0a0a',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div>
                  {t('transactions_page.pagination.showing')}{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  {t('transactions_page.pagination.to')}{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {Math.min(currentPage * itemsPerPage, processedTransactions.length)}
                  </span>{' '}
                  {t('transactions_page.pagination.of')}{' '}
                  <span style={{ fontWeight: '700', color: '#ffffff' }}>
                    {processedTransactions.length}
                  </span>{' '}
                  {t('transactions_page.pagination.entries')}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Items Per Page */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t('transactions_page.pagination.per_page')}
                    </span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      style={{
                        background: '#121212',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '0.2rem 0.4rem',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Prev / Next Pagination */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: '4px',
                        background: '#141414',
                        border: '1px solid var(--border-subtle)',
                        color: currentPage <= 1 ? 'var(--text-muted)' : '#ffffff',
                        cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <span style={{ fontSize: '0.75rem', padding: '0 0.4rem' }}>
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      style={{
                        padding: '0.3rem 0.5rem',
                        borderRadius: '4px',
                        background: '#141414',
                        border: '1px solid var(--border-subtle)',
                        color: currentPage >= totalPages ? 'var(--text-muted)' : '#ffffff',
                        cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Responsive table styles */}
        <style>{`
          @media (max-width: 860px) {
            .tx-table-header {
              display: none !important;
            }
            .tx-table-row {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
              padding: 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}
