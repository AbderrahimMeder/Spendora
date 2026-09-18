import {
  LayoutDashboard,
  WalletCards,
  TrendingUp,
  User,
  Settings,
  LucideIcon,
} from "lucide-react";

export interface DashboardItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const DashboardItems: DashboardItem[] = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Expense",
    icon: WalletCards,
    href: "/dashboard/expense",
  },
  {
    label: "Income",
    icon: TrendingUp,
    href: "/dashboard/income",
  },
  {
    label: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];
