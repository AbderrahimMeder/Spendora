'use client';

import React, { useState, useEffect } from 'react';
import {
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User, CurrencyOption } from '@/types';

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham (MAD)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
];

interface SettingFainceProps {
  user?: User | null;
  token?: string | null | undefined;
}

export function SettingFaince({ user, token }: SettingFainceProps) {
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [fiscalStartDay, setFiscalStartDay] = useState('1');
  const [defaultTransactionType, setDefaultTransactionType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [autoConvertExchange, setAutoConvertExchange] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Track initial values to disable button when values match default/initial values
  const [initialState, setInitialState] = useState({
    currency: user?.currency || 'USD',
    fiscalStartDay: '1',
    defaultTransactionType: 'EXPENSE' as 'EXPENSE' | 'INCOME',
    autoConvertExchange: true,
  });

  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem('finora_currency') || user?.currency || 'USD';
      const storedFiscal = localStorage.getItem('finora_fiscal_start_day') || '1';
      const storedTxType = (localStorage.getItem('finora_default_tx_type') as 'EXPENSE' | 'INCOME') || 'EXPENSE';
      const storedAutoFx = localStorage.getItem('finora_auto_fx') !== null
        ? localStorage.getItem('finora_auto_fx') === 'true'
        : true;

      const loaded = {
        currency: storedCurrency,
        fiscalStartDay: storedFiscal,
        defaultTransactionType: storedTxType,
        autoConvertExchange: storedAutoFx,
      };

      setCurrency(loaded.currency);
      setFiscalStartDay(loaded.fiscalStartDay);
      setDefaultTransactionType(loaded.defaultTransactionType);
      setAutoConvertExchange(loaded.autoConvertExchange);
      setInitialState(loaded);
    } catch {
      // Ignore local storage error
    }
  }, [user]);

  // Check if anything differs from default/initial values
  const hasChanges =
    currency !== initialState.currency ||
    fiscalStartDay !== initialState.fiscalStartDay ||
    defaultTransactionType !== initialState.defaultTransactionType ||
    autoConvertExchange !== initialState.autoConvertExchange;

  const canSave = hasChanges && !isSaving;
  const StyleForSaveButton = hasChanges ? 'var(--accent-primary)' : 'rgba(16, 185, 129, 0.15)';

  const activeCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  const activeSymbol = activeCurrencyObj.symbol;

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      localStorage.setItem('finora_currency', currency);
      localStorage.setItem('finora_fiscal_start_day', fiscalStartDay);
      localStorage.setItem('finora_default_tx_type', defaultTransactionType);
      localStorage.setItem('finora_auto_fx', String(autoConvertExchange));

      if (token && user?.id) {
        await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/update-profile/${user?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            currency,
          }),
        }).catch(() => {});
      }

      setInitialState({
        currency,
        fiscalStartDay,
        defaultTransactionType,
        autoConvertExchange,
      });

      toast.success('Financial preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save financial preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description,
    id,
  }: {
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
    id?: string;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: '#161616',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s ease',
      }}
      className="toggle-card hover:border-[#333333]"
    >
      <div style={{ paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ffffff' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '9999px',
          background: checked ? 'var(--accent-primary)' : '#262626',
          border: '1px solid',
          borderColor: checked ? 'rgba(16, 185, 129, 0.4)' : '#333333',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          boxShadow: checked ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '3px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </button>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {/* Column 1: Financial & Currency Parameters Card */}
      <div
        style={{
          background: '#111111',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Coins size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                Financial & Currency
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Manage base currency and accounting rules
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Base Currency as a Sleek Select Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Default Base Currency
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={currency}
                  onChange={(e) => {
                    const selectedCode = e.target.value;
                    const selectedOption = CURRENCIES.find((c) => c.code === selectedCode);
                    setCurrency(selectedCode);
                    if (selectedOption) {
                      toast.success(`Currency changed to ${selectedOption.code} (${selectedOption.symbol})`);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    paddingLeft: '2.5rem',
                    borderRadius: 'var(--radius-md)',
                    background: '#161616',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  className="focus:border-emerald-500 transition-colors"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} — {curr.name}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    left: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--accent-primary)',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                  }}
                >
                  {activeSymbol}
                </div>
              </div>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: 0 }}>
                All overview metrics, reports, and budgets calculate in this currency.
              </p>
            </div>

            {/* Fiscal Month Start Day */}
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Fiscal Month Start Day
              </label>
              <select
                value={fiscalStartDay}
                onChange={(e) => setFiscalStartDay(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
                className="focus:border-emerald-500 transition-colors"
              >
                <option value="1">1st of the month (Standard)</option>
                <option value="15">15th of the month</option>
                <option value="25">25th of the month (Payday)</option>
                <option value="last">Last working day of month</option>
              </select>
            </div>
            {/* Auto FX Sync Toggle */}
            <ToggleSwitch
              id="auto-fx"
              label="Auto FX Rate Sync"
              description="Automatically fetch exchange rates via Frankfurter API on transaction entry."
              checked={autoConvertExchange}
              onChange={setAutoConvertExchange}
            />
          </div>
        </div>

        {/* Save Changes Button (Disabled until changes are made, disabled when reverted to default) */}
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '0.65rem',
            borderRadius: 'var(--radius-md)',
            background: StyleForSaveButton,
            border: 'none',
            color: hasChanges ? '#000000' : 'rgba(255, 255, 255, 0.35)',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: canSave ? 'pointer' : 'not-allowed',
            opacity: hasChanges ? 1 : 0.6,
            transition: 'all 0.2s ease',
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {isSaving ? (
            <>
              <RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
              <span>Saving Preferences...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>

      {/* Column 2: Live Currency & Financial Status Preview Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Active Currency Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, #111111 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Base Currency
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                {activeCurrencyObj.name}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                All dashboard metrics, budget allocations, and net worth charts automatically format in {currency}.
              </p>
            </div>
            <div
              style={{
                background: 'var(--accent-primary)',
                color: '#000000',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
                fontWeight: '800',
                fontSize: '1.1rem',
                flexShrink: 0,
              }}
            >
              {activeSymbol}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Accounting Cycle</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginTop: '0.15rem' }}>
                Day {fiscalStartDay} of Month
              </div>
            </div>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto FX Sync</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: autoConvertExchange ? '#10b981' : '#f59e0b', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={13} />
                {autoConvertExchange ? 'Enabled' : 'Disabled'}
              </div>
            </div>
          </div>
        </div>

        {/* Live Formatting Samples Card */}
        <div
          style={{
            background: '#111111',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <Sparkles size={15} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Live Currency Formatting Preview
            </h3>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0' }}>
            Real-time preview of formatted numbers across your analytics and ledgers.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Positive Sample */}
            <div style={{ background: '#161616', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Positive Balance Sample</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#10b981', fontWeight: '600' }}>
                  <ArrowUpRight size={13} />
                  Credit
                </div>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#10b981', marginTop: '0.25rem' }}>
                +{activeSymbol} 14,850.50
              </div>
            </div>

            {/* Expense Sample */}
            <div style={{ background: '#161616', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expense Transaction Sample</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#f87171', fontWeight: '600' }}>
                  <ArrowDownRight size={13} />
                  Debit
                </div>
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: '800', color: '#f87171', marginTop: '0.25rem' }}>
                -{activeSymbol} 320.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingFaince;