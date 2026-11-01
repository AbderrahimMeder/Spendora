'use client';

import React, { useState } from 'react';
import {
  Coins,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import type { User, CurrencyOption } from '@/types';
import { useRouter } from 'next/navigation';
import { ToggleSwitch } from '@/components/ui/toggle';
import { useTranslation } from 'react-i18next';

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

export function SettingFaince({ user }: SettingFainceProps) {
  const { t } = useTranslation();
  const route = useRouter();
  const [currency, setCurrency] = useState(user?.currency || 'USD');
  const [fiscalStartDay, setFiscalStartDay] = useState('1');
  const [autoConvertExchange, setAutoConvertExchange] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Track initial values to disable button when values match default/initial values
  const [initialState] = useState({
    currency: user?.currency || 'USD',
    fiscalStartDay: '1',
    defaultTransactionType: 'EXPENSE' as 'EXPENSE' | 'INCOME',
    autoConvertExchange: true,
  });

  // Check if anything differs from default/initial values
  const hasChanges =
    currency !== initialState.currency ||
    autoConvertExchange !== initialState.autoConvertExchange;

  const canSave = hasChanges && !isSaving;
  const StyleForSaveButton = hasChanges ? 'var(--accent-primary)' : 'rgba(16, 185, 129, 0.15)';

  const activeCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];
  const activeSymbol = activeCurrencyObj.symbol;

  const SendData = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/Profile/Fainance', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ currency: currency })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(t('settings_page.financial.toasts.error'));
      }
      if (data.status === 201) {
        toast.success(data.message);
        route.refresh();
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : t('settings_page.financial.toasts.failed_save');
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

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
                {t('settings_page.financial.title')}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {t('settings_page.financial.subtitle')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Base Currency as a Sleek Select Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {t('settings_page.financial.base_currency')}
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    paddingInlineStart: '2.5rem',
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
                    insetInlineStart: '0.85rem',
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
                {t('settings_page.financial.base_currency_hint')}
              </p>
            </div>

            {/* Fiscal Month Start Day */}
            <div>
              <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                {t('settings_page.financial.fiscal_day')}
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
                <option value="1">{t('settings_page.financial.fiscal_options.day_1')}</option>
                <option value="15">{t('settings_page.financial.fiscal_options.day_15')}</option>
                <option value="25">{t('settings_page.financial.fiscal_options.day_25')}</option>
                <option value="last">{t('settings_page.financial.fiscal_options.day_last')}</option>
              </select>
            </div>
            {/* Auto FX Sync Toggle */}
            <ToggleSwitch
              id="auto-fx"
              label={t('settings_page.financial.auto_fx')}
              description={t('settings_page.financial.auto_fx_desc')}
              checked={autoConvertExchange}
              onChange={setAutoConvertExchange}
            />
          </div>
        </div>

        {/* Save Changes Button (Disabled until changes are made, disabled when reverted to default) */}
        <button
          type="button"
          disabled={!canSave}
          onClick={SendData}
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
            opacity: hasChanges && !isSaving ? 1 : 0.6,
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
              <span>{t('settings_page.financial.saving')}</span>
            </>
          ) : (
            <span>{t('settings_page.financial.save_changes')}</span>
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
                {t('settings_page.financial.hero.active_base')}
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                {activeCurrencyObj.name}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                {t('settings_page.financial.hero.active_desc', { currency })}
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
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('settings_page.financial.hero.accounting_cycle')}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginTop: '0.15rem' }}>
                {t('settings_page.financial.hero.day_of_month', { day: fiscalStartDay })}
              </div>
            </div>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('settings_page.financial.hero.auto_fx_status')}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: autoConvertExchange ? '#10b981' : '#f59e0b', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Globe size={13} />
                {autoConvertExchange ? t('settings_page.financial.hero.enabled') : t('settings_page.financial.hero.disabled')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingFaince;
