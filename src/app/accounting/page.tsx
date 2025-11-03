'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type KpiData = {
  id: string;
  title: string;
  value: number;
  color: string;
  filtered: boolean;
};

const initialKpiData: Omit<KpiData, 'id'>[] = [
    { title: 'Total Income', value: 1250000, color: 'text-green-600', filtered: true },
    { title: 'Total Expense', value: 750000, color: 'text-red-600', filtered: true },
    { title: 'Net Profit', value: 500000, color: 'text-blue-600', filtered: false },
    { title: 'Customer Payments', value: 1100000, color: 'text-sky-600', filtered: true },
    { title: 'Vendor Payments', value: 650000, color: 'text-orange-600', filtered: true },
    { title: 'Upcoming Payments', value: 150000, color: 'text-amber-600', filtered: false },
    { title: 'Cash On Hand', value: 200000, color: 'text-teal-600', filtered: false },
    { title: 'Cash', value: 120000, color: 'text-gray-600', filtered: false },
    { title: 'bKash', value: 80000, color: 'text-pink-600', filtered: false },
    { title: 'Bank Balance', value: 540000, color: 'text-indigo-600', filtered: false },
];

const incomeData = [
  { name: 'Customer Monthly Bill', value: 850000 },
  { name: 'Project Income', value: 300000 },
  { name: 'Service Fees', value: 100000 },
  { name: 'Discounts Given', value: -50000 },
];

const expenseData = [
    { name: 'Salaries', value: 250000 },
    { name: 'Office Rent', value: 120000 },
    { name: 'Marketing', value: 80000 },
    { name: 'Utilities', value: 55000 },
    { name: 'Software & Tools', value: 45000 },
    { name: 'Other', value: 200000 },
];

const EXPENSE_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

export default function AccountingDashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const summariesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/accountSummaries`) : null, [user, firestore]);
  const { data: kpiData, isLoading: kpiLoading } = useCollection<KpiData>(summariesRef);

  React.useEffect(() => {
    if (user && firestore && !kpiLoading && (!kpiData || kpiData.length === 0)) {
        const summariesRefForWrite = collection(firestore, `users/${user.uid}/accountSummaries`);
        const batch = writeBatch(firestore);
        initialKpiData.forEach(kpi => {
            const docRef = doc(summariesRefForWrite);
            batch.set(docRef, kpi);
        });
        batch.commit().catch(e => console.error("Failed to seed KPI data", e));
    }
  }, [user, firestore, kpiData, kpiLoading]);


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounting Dashboard</h1>
            <p className="text-muted-foreground">An overview of your financial performance.</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button>Filter</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {kpiLoading && Array.from({ length: 10 }).map((_, index) => (
                 <Card key={index} className="flex flex-col animate-pulse">
                    <CardHeader className="pb-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-7 bg-muted rounded w-1/2"></div>
                    </CardContent>
                </Card>
            ))}
            {kpiData?.map((kpi) => (
                <Card key={kpi.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                        <CardDescription className={cn("font-semibold", kpi.color)}>{kpi.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{formatCurrency(kpi.value)}</p>
                        {kpi.filtered && <p className="text-xs text-muted-foreground mt-1">Filtered Transactions</p>}
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                <CardTitle>Income by Category</CardTitle>
                <CardDescription>A breakdown of income sources for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={incomeData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickFormatter={formatCurrency} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={150} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--accent))' }}
                                contentStyle={{
                                    background: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: 'var(--radius)',
                                }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
                <CardDescription>A summary of expenses for the selected period.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                       <PieChart>
                         <Pie
                            data={expenseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                         >
                            {expenseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            formatter={(value: number) => formatCurrency(value)}
                         />
                         <Legend iconSize={12} wrapperStyle={{fontSize: '0.8rem'}}/>
                       </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
