import { type Transaction, CurrencyOption } from '@/types';


export function formatCurrency(amount: number, currency?: string) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  })

  return formatter.format(amount)
}

export function getCategoryDetails(id: string|null) {
  const categories: Record<string, { name: string; icon: string; color: string }> = {
    'cat-food': {
      name: 'Food & Groceries',
      icon: '🛒',
      color: '#10b981', // Emerald
    },
    'cat-housing': {
      name: 'Housing & Rent',
      icon: '🏠',
      color: '#3b82f6', // Blue
    },
    'cat-transport': {
      name: 'Transport & Fuel',
      icon: '🚗',
      color: '#ef4444', // Red
    },
    'cat-shopping': {
      name: 'Shopping & Retail',
      icon: '🛍️',
      color: '#f59e0b', // Amber
    },
    'cat-entertainment': {
      name: 'Entertainment',
      icon: '🎬',
      color: '#8b5cf6', // Violet
    },
    'cat-health': {
      name: 'Health & Wellness',
      icon: '🏥',
      color: '#22c55e', // Green
    },
    'cat-utilities': {
      name: 'Utilities',
      icon: '🔌',
      color: '#06b6d4', // Cyan
    },
  }

  return categories[id||''] || {
    name: 'Other',
    icon: '🔹',
    color: '#6b7280', // Gray
  }
}
export function computeCategorySpending(transactions:Transaction[]|null){
  if(!transactions) return [];
  return [1,2,3.4] 
}
export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham (MAD)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
];

