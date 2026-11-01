import {
  LayoutDashboard,
  Settings,
  LucideIcon,
  Bell,
  ArrowUpDown,
  Layers,
  Tag,
  CreditCard,
  Target,
  BarChart3,
} from "lucide-react";

export interface DashboardItem {
  label: string;
  icon: LucideIcon;
  href: string|null;
  badge?:string|null;
  children?:DashboardItem[];
}
export const NavLinks:DashboardItem[] = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Transactions', href: '/transactions', icon: ArrowUpDown, badge: null },
    {
      label: 'Management',
      href: null,
      icon: Layers,
      badge: null,
      children: [
        { label: 'Categories', href: '/categories', icon: Tag, badge: null },
        { label: 'Payment Methods', href: '/payment-method', icon: CreditCard, badge: null },
      ],
    },
    { label: 'Budgets', href: '/budgets', icon: Target, badge: null },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: null },
    { label: 'Reports', href: '/reports', icon: BarChart3, badge: '21' },
    { label: 'Settings', href: '/setting', icon: Settings, badge: null },
  ];

