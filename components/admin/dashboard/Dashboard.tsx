"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import OverviewHeader from '@/components/admin/dashboard/OverviewHeader';
import StatCards from '@/components/admin/dashboard/StatCards';
import RecentTransactions from '@/components/admin/dashboard/RecentTransactions';
import BudgetProgress from '@/components/admin/dashboard/BudgetProgress';
import BudgetModal from '@/components/admin/dashboard/BudgetModal';;
import { Transaction, Budget, User } from '@/types';
import { getExchangeRate } from '@/utils/exchange';
import { LoadingTransaction } from '@/components/ui/loading';


export  function Dashboard({user, token}:{user:User,token:string}) {
    const APP_URL = 'http://localhost:8000'
    const route = useRouter();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchdata = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${APP_URL}/api/transactions`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if(!response.ok){
                    route.push('/login')
                    toast.error('Failed to fetch transactions')
                }
                const data = await response.json();
                
                if (data.status == 401) {
                    toast.error('Session expired. Please log in again.');
                    route.push('/login');
                }
                if (data.status == 200) {
                    setTransactions(data.transactions);
                }
                setLoading(false);
            } catch (error) {
                route.push('/error?code=500')
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetchdata();

    }, [user])

    // Local storage state with initial fallbacks
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const [budget, setBudget] = useState<Budget>();
    const [rate, setrate] = useState(1);
    useEffect(() => {
        const fetchrate = async () => {
            const rate = await getExchangeRate(user?.currency || "USD");
            setrate(rate)
        }
        fetchrate();
    }, [user])
    const stats = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthStr =
            `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`;


        const totalIncome = transactions
            .filter((t: Transaction) => t.type === "INCOME")
            .reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        const totalExpenses = transactions
            .filter((t: Transaction) => t.type === "EXPENSE")
            .reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        //this month 
        const totalIncomeThisMouth = transactions
            .filter((t: Transaction) => t.type === "INCOME" && t.date.startsWith(`${year}-${month}`))
            .reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        const totalExpensesThisMouth = transactions.filter(
            (t: Transaction) => (t.type === "EXPENSE") && t.date.startsWith(`${year}-${month}`)
        ).reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        //last month 
        const totalIncomelastMonth = transactions.filter(
            (t: Transaction) => (t.type === "INCOME") && t.date.startsWith(`${previousMonthStr}`)
        ).reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        const totalExpenseslastMonth = transactions.filter(
            (t: Transaction) => (t.type === "EXPENSE") && t.date.startsWith(`${previousMonthStr}`)
        ).reduce((acc: number, t: Transaction) => acc + Number(t.amount), 0);
        const savings = totalIncomeThisMouth - totalExpensesThisMouth
        const savingsLastMounth = totalIncomelastMonth - totalExpenseslastMonth
        const savingsRate = Number(savingsLastMounth) > 0
            ? `${(((Number(savings) - Number(savingsLastMounth)) / Number(savingsLastMounth)) * 100).toFixed(1)}`
            : "0";
        const Incomerate = Number(totalIncomeThisMouth) / Number(totalIncome) * 100
        const totalbalancerate = Number(totalIncomeThisMouth - totalExpensesThisMouth) / Number(totalIncome - totalExpenses) * 100
        localStorage.setItem("transactionsCount", transactions.length.toString());
        return {
            totalBalance: totalIncome * rate - totalExpenses * rate,
            totalIncome: totalIncomeThisMouth * rate,
            totalExpenses: totalExpensesThisMouth * rate,
            savings: savings * rate,
            savingsRate,
            transactionCount: transactions.length,
            Incomerate,
            totalbalancerate
        };
    }, [transactions]);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    // Refresh handler
    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Dashboard metrics refreshed successfully!');
        }, 600);
    };

    // Computed financial stats
    const categorySpending:any[] = [];

    const userName = user?.name || '';

    return (
        <>
        {/* 1. Overview Header with live controls */}
            {loading ?
                <LoadingTransaction hight={200} />
                :
                (
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
