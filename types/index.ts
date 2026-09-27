export interface User {
  id?: string | number;
  name?: string;
  email?: string;
  avatar?: string;
  profile?: string;
  currency?: string;
  [key: string]: any;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export interface payment_methods {
    id:string;
    name:string;
    type:string;
    is_active:boolean
}
export interface Transaction {
  id: string;
  account_id?: string;
  user_id?: string;
  type: TransactionType;
  amount: number;
  currency?: string;
  title?: string;
  description?: string;
  date: string;
  time?: string;
  is_hidden: boolean;
  status?: string;
  categories?:Category;
  payment_methods?:payment_methods;
}

export interface TransactionCreate {
  type: TransactionType;
  amount: number;
  currency?: string;
  title?: string;
  description?: string;
  status?:string;
  date?:string;
  category_id?:string;
  payment_method_id?:string;
}


export interface Category {
  id: string;
  name: string;
  slug:string;
  type: TransactionType;
  icon: string;
  color: string;
  bg: string;
}

export interface CategorySpending {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
  bg: string;
}

export interface Budget {
  totalBudget: number;
  categoryBudgets: Record<string, number>;
}

export type CurrencyCode = 'USD' | 'EUR' | 'MAD' | 'GBP' | 'CAD' | string;

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export type Currency = string;

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: string;
  transactionCount: number;
  Incomerate: number;
  totalbalancerate: number;
}

export interface ExpenseEvolutionPoint {
  label: string;
  date: string;
  amount: number;
  income?: number;
}
