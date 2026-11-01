"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import OverviewHeader from '@/components/admin/dashboard/OverviewHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import RecentTransactions from '@/components/admin/dashboard/RecentTransactions';
import BudgetProgress from '@/components/admin/dashboard/BudgetProgress';
import BudgetModal from '@/components/admin/dashboard/BudgetModal';
import { Transaction, Budget, User, CategorySpending } from '@/types';
import { getExchangeRate } from '@/utils/exchange';
import { LoadingTransaction } from '@/components/ui/loading';

export function Dashboard({ user, token }: { user: User; token: string }) {
    const { t } = useTranslation();
    const APP_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL!;
    const route = useRouter();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budget] = useState<Budget>();
    const [rate, setrate] = useState<number>(1);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        let isCancelled = false;

        const loadTransactions = async () => {
            try {
                const response = await fetch(`${APP_URL}/api/transactions`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    route.push('/login');
                    toast.error(t('admin_dashboard.header.fetch_error'));
                    return;
                }
                const data = await response.json();

                if (!isCancelled) {
                    if (data.status === 401) {
                        toast.error(t('admin_dashboard.header.session_expired'));
                        route.push('/login');
                        return;
                    }
                    if (data.status === 200) {
                        setTransactions(data.transactions ?? []);
                    }
                    setLoading(false);
                }
            } catch {
                route.push(`/error?message=none&code=500`);
            }
        };

        loadTransactions();

        return () => {
            isCancelled = true;
        };
    }, [APP_URL, route, t, token, user]);

    useEffect(() => {
        let cancelled = false;

        const fetchRate = async () => {
            try {
                const currency = user?.currency || "USD";
                const currentRate = await getExchangeRate(currency);

                if (!cancelled) {
                    setrate(currentRate);
                }
            } catch (error) {
                console.error("Failed to fetch exchange rate:", error);

                if (!cancelled) {
                    setrate(1);
                }
            }
        };

        fetchRate();

        return () => {
            cancelled = true;
        };
    }, [user?.currency]);

    const stats = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthStr =
            `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;

        const totalIncome = transactions
            .filter((tx: Transaction) => tx.type === "INCOME")
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        const totalExpenses = transactions
            .filter((tx: Transaction) => tx.type === "EXPENSE")
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        // this month 
        const totalIncomeThisMouth = transactions
            .filter((tx: Transaction) => tx.type === "INCOME" && tx.date.startsWith(`${year}-${month}`))
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        const totalExpensesThisMouth = transactions
            .filter((tx: Transaction) => tx.type === "EXPENSE" && tx.date.startsWith(`${year}-${month}`))
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        // last month 
        const totalIncomelastMonth = transactions
            .filter((tx: Transaction) => tx.type === "INCOME" && tx.date.startsWith(`${previousMonthStr}`))
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        const totalExpenseslastMonth = transactions
            .filter((tx: Transaction) => tx.type === "EXPENSE" && tx.date.startsWith(`${previousMonthStr}`))
            .reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0);
        const savings = totalIncomeThisMouth - totalExpensesThisMouth;
        const savingsLastMounth = totalIncomelastMonth - totalExpenseslastMonth;
        const savingsRate = Number(savingsLastMounth) > 0
            ? `${(((Number(savings) - Number(savingsLastMounth)) / Number(savingsLastMounth)) * 100).toFixed(1)}`
            : "0";
        const Incomerate = totalIncome > 0 ? (Number(totalIncomeThisMouth) / Number(totalIncome)) * 100 : 0;
        const netDifference = totalIncome - totalExpenses;
        const totalbalancerate = netDifference !== 0
            ? (Number(totalIncomeThisMouth - totalExpensesThisMouth) / Number(netDifference)) * 100
            : 0;

        return {
            totalBalance: (totalIncome - totalExpenses) * rate,
            totalIncome: totalIncomeThisMouth * rate,
            totalExpenses: totalExpensesThisMouth * rate,
            savings: savings * rate,
            savingsRate,
            transactionCount: transactions.length,
            Incomerate,
            totalbalancerate,
        };
    }, [transactions, rate]);

    // Refresh handler with live API fetch
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch(`${APP_URL}/api/transactions`, {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.status === 200) {
                    setTransactions(data.transactions ?? []);
                }
            }
            toast.success(t('admin_dashboard.header.refresh_success'));
        } catch {
            toast.error(t('admin_dashboard.header.fetch_error'));
        } finally {
            setIsRefreshing(false);
        }
    };

    // Computed financial stats
    const categorySpending: CategorySpending[] = [];
    const userName = user?.name || '';

    return (
        <>
            {/* 1. Overview Header with live controls */}
            {loading ? (
                <LoadingTransaction hight={200} />
            ) : (
                <>
                    <OverviewHeader
                        userName={userName}
                        onRefresh={handleRefresh}
                        isRefreshing={isRefreshing}
                    />

                    {/* 2. Top Metric Cards: Balance, Income, Expense, Savings */}
                    <StatCards stats={stats} currency={user?.currency} />

                    {/* 3. Main Dashboard Grid Layout */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                    }}>
                        {/* Left Column (Primary Visuals & Recent Activity) - 7 of 12 columns */}
                        <div
                            style={{
                                gridColumn: 'span 7',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                            }}
                            className="dashboard-col-left"
                        >
                            {/* 4. Real-time Recent Transactions with Search and Filter */}
                            <RecentTransactions
                                transactions={transactions}
                                currency={user?.currency}
                                rate={rate}
                            />
                        </div>

                        {/* Right Column (Budgets, Breakdown, & Quick Actions) - 5 of 12 columns */}
                        <div
                            style={{
                                gridColumn: 'span 5',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                            }}
                            className="dashboard-col-right"
                        >
                            {/* 5. Monthly Budget Progress and Category Caps */}
                            <BudgetProgress
                                budget={budget}
                                totalExpenses={stats.totalExpenses}
                                categorySpending={categorySpending}
                                currency={user?.currency}
                                rate={rate}
                                onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                            />
                        </div>
                    </div>

                    {/* 9. Monthly Budget Configuration Modal */}
                    <BudgetModal
                        isOpen={isBudgetModalOpen}
                        onClose={() => setIsBudgetModalOpen(false)}
                        currentBudget={budget}
                        currency={user?.currency}
                        onSave={() => { }}
                    />

                    {/* Page Responsive Styles */}
                    <style>{`
                        @media (max-width: 1024px) {
                          .dashboard-col-left,
                          .dashboard-col-right {
                            grid-column: span 12 !important;
                          }
                        }
                    `}</style>
                </>
            )}
        </>
    );
}
