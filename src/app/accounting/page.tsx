'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

const kpiData = [
    { title: 'Total Income', value: 1250000, color: 'text-green-600', filtered: true },
    { title: 'Total Expense', value: 750000, color: 'text-red-600', filtered: true },
    { title: 'Net Profit', value: 500000, color: 'text-blue-600', filtered: false },
    { title: 'Customer Payments', value: 1100000, color: 'text-sky-600', filtered: true },
    { title: 'Vendor Payments', value: 650000, color: 'text-orange-600', filtered: true },
    { title: 'Upcoming Payments', value: 150000, color: 'text-amber-600', filtered: false },
    { title: 'Cash On Hand', value: 200000, color: 'text-teal-600', filtered: false },
    { title: 'Cash', value: 50000, color: 'text-gray-600', filtered: false },
    { title: 'bKash', value: 80000, color: 'text-pink-600', filtered: false },
    { title: 'Bank Balance', value: 70000, color: 'text-indigo-600', filtered: false },
];

const incomeData = [
  { name: 'Customer Monthly Bill', value: 850000 },
  { name: 'Project Income', value: 300000 },
  { name: 'Service Fees', value: 100000 },
  { name: 'Discounts Given', value: -50000 },
];


export default function AccountingDashboardPage() {
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
            {kpiData.map((kpi, index) => (
                <Card key={index} className="flex flex-col">
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
                <CardDescription>Future update will show expense visualization here.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">Expense chart coming soon...</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}