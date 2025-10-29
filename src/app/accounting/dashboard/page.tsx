'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const kpiData = [
  { title: "Total Income", value: 712850, date: "Oct-2025", filtered: true, color: "bg-teal-500/10 text-teal-500" },
  { title: "Total Expense", value: 0, date: "Oct-2025", filtered: true, color: "bg-red-500/10 text-red-500" },
  { title: "Total Profit", value: 712850, date: "Oct-2025", filtered: true, color: "bg-purple-500/10 text-purple-500" },
  { title: "Expected Payments from Customers", value: 2602800, date: "Oct-2025", filtered: true, color: "bg-blue-500/10 text-blue-500" },
  { title: "Expected payments to vendors", value: 121695, date: "Oct-2025", filtered: true, color: "bg-orange-500/10 text-orange-500" },
  { title: "Total Upcoming", value: 2481105, date: "Oct-2025", filtered: true, color: "bg-purple-500/10 text-purple-500" },
  { title: "Cash on Hand", value: -4901301.78, date: "Oct-2025", filtered: true, color: "bg-rose-500/10 text-rose-500" },
  { title: "Other", value: 1000, date: "Oct-2025", filtered: true, color: "bg-gray-500/10 text-gray-400" },
  { title: "Cash", value: 15797892, date: "Oct-2025", filtered: true, color: "bg-green-500/10 text-green-500" },
  { title: "bKash", value: 537950, date: "Oct-2025", filtered: true, color: "bg-pink-500/10 text-pink-500" },
  { title: "Brac Bank", value: -29100, date: "Oct-2025", filtered: true, color: "bg-indigo-500/10 text-indigo-500" },
];

const incomeData = [
  { name: 'Customer Monthly Bill', value: 648500 },
  { name: 'Customer Monthly Bill Discount', value: -12350 },
];

const expenseData = [
    // Add expense data when available
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);


export default function AccountingDashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accounting Dashboard</h1>
            <p className="text-sm text-muted-foreground">Accounts > Accounting Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker />
            <Button>Filter by date</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold">{formatCurrency(kpi.value)}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                  <span>{kpi.date}</span>
                  {kpi.filtered && <span>Filtered Transactions</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeData} layout="vertical" margin={{ left: 100 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `${value / 1000}k`} />
                  <YAxis type="category" dataKey="name" width={200} interval={0} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Expense data will be shown here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
