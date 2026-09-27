import type { LucideIcon } from 'lucide-react';
import { Tag,ArrowDownRight,ArrowUpRight,ShoppingBag,Utensils,Home,Car,Film,HeartPulse,Zap,Briefcase,TrendingUp,DollarSign,Gift,Plane,Coffee,BookOpen,Dumbbell,Wallet,Smartphone,Globe,Coins } from 'lucide-react';
export  const ICON_OPTIONS: { name: string; icon: LucideIcon; label: string }[] = [
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Shopping' },
  { name: 'Utensils', icon: Utensils, label: 'Food & Dining' },
  { name: 'Home', icon: Home, label: 'Housing' },
  { name: 'Car', icon: Car, label: 'Transportation' },
  { name: 'Film', icon: Film, label: 'Entertainment' },
  { name: 'HeartPulse', icon: HeartPulse, label: 'Health' },
  { name: 'Zap', icon: Zap, label: 'Utilities' },
  { name: 'Briefcase', icon: Briefcase, label: 'Work & Salary' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Investments' },
  { name: 'DollarSign', icon: DollarSign, label: 'Income & Cash' },
  { name: 'Gift', icon: Gift, label: 'Gifts' },
  { name: 'Plane', icon: Plane, label: 'Travel' },
  { name: 'Coffee', icon: Coffee, label: 'Cafe & Drinks' },
  { name: 'BookOpen', icon: BookOpen, label: 'Education' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Fitness' },
  { name: 'Wallet', icon: Wallet, label: 'Personal Wallet' },
  { name: 'Smartphone', icon: Smartphone, label: 'Digital / Telecom' },
  { name: 'Globe', icon: Globe, label: 'Online / SaaS' },
  { name: 'Coins', icon: Coins, label: 'Crypto & Assets' },
  { name: 'Tag', icon: Tag, label: 'General Tag' },
];

// Preset color themes with matching backgrounds and borders
export const COLOR_OPTIONS = [
  { name: 'Emerald', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)' },
  { name: 'Blue', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)' },
  { name: 'Purple', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)' },
  { name: 'Rose', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)' },
  { name: 'Amber', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
  { name: 'Cyan', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)' },
  { name: 'Pink', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)' },
  { name: 'Orange', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)' },
  { name: 'Teal', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)', border: 'rgba(20, 184, 166, 0.3)' },
  { name: 'Indigo', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.3)' },
];

export function getCategoryIconComponent(iconName?: string): LucideIcon {
  if (!iconName) return Tag;
  const match = ICON_OPTIONS.find(
    (opt) => opt.name.toLowerCase() === iconName.toLowerCase() || opt.label.toLowerCase() === iconName.toLowerCase()
  );
  if (match) return match.icon;

  // Fallbacks by common keywords
  const lower = iconName.toLowerCase();
  if (lower.includes('food') || lower.includes('grocer') || lower.includes('eat') || lower.includes('dining')) return Utensils;
  if (lower.includes('shop') || lower.includes('store') || lower.includes('retail')) return ShoppingBag;
  if (lower.includes('house') || lower.includes('home') || lower.includes('rent')) return Home;
  if (lower.includes('car') || lower.includes('transport') || lower.includes('fuel') || lower.includes('auto')) return Car;
  if (lower.includes('film') || lower.includes('movie') || lower.includes('entertain')) return Film;
  if (lower.includes('health') || lower.includes('med') || lower.includes('doc')) return HeartPulse;
  if (lower.includes('util') || lower.includes('electric') || lower.includes('water') || lower.includes('power')) return Zap;
  if (lower.includes('salary') || lower.includes('job') || lower.includes('work')) return Briefcase;
  if (lower.includes('invest') || lower.includes('gain') || lower.includes('stock')) return TrendingUp;
  if (lower.includes('cash') || lower.includes('money') || lower.includes('income')) return DollarSign;
  if (lower.includes('travel') || lower.includes('flight') || lower.includes('trip')) return Plane;
  if (lower.includes('coffee') || lower.includes('cafe')) return Coffee;
  if (lower.includes('gym') || lower.includes('fit') || lower.includes('sport')) return Dumbbell;
  if (lower.includes('book') || lower.includes('edu') || lower.includes('school')) return BookOpen;

  return Tag;
}