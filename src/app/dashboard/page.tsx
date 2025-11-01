'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const kpiData = [
  { title: "Total Income", value: "৳550,000", change: "+12% from last month", icon: TrendingUp, color: "text-green-500" },
  { title: "Total Expenses", value: "৳210,500", change: "+8% from last month", icon: TrendingDown, color: "text-red-500" },
  { title: "Net Profit", value: "৳339,500", change: "+15% from last month", icon: DollarSign },
  { title: "Savings Goal", value: "65% Reached", change: "৳65,000 / ৳100,000", icon: Wallet },
];

const chartData = [
  { month: 'Jan', income: 400000, expense: 240000 },
  { month: 'Feb', income: 300000, expense: 139800 },
  { month: 'Mar', income: 200000, expense: 980000 },
  { month: 'Apr', income: 278000, expense: 390800 },
  { month: 'May', income: 189000, expense: 480000 },
  { month: 'Jun', income: 239000, expense: 380000 },
];

const recentTransactions = [
  { id: 'txn1', description: "Salary Deposit", date: "2024-07-28", amount: 250000, type: "income" },
  { id: 'txn2', description: "Grocery Shopping", date: "2024-07-27", amount: -8500, type: "expense" },
  { id: 'txn3', description: "Freelance Project Payment", date: "2024-07-26", amount: 75000, type: "income" },
  { id: 'txn4', description: "Utility Bill - Electricity", date: "2024-07-25", amount: -4200, type: "expense" },
  { id: 'txn5', description: "Investment Deposit", date: "2024-07-24", amount: -50000, type: "expense" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial overview and insights.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.color || 'text-muted-foreground'}`}>{kpi.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Income vs. Expense</CardTitle>
                    <CardDescription>Last 6 months performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="income" fill="hsl(var(--primary))" name="Income" />
                            <Bar dataKey="expense" fill="hsl(var(--destructive))" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your last 5 financial activities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.map(txn => (
                                <TableRow key={txn.id}>
                                    <TableCell>
                                        <div className="font-medium">{txn.description}</div>
                                        <div className="text-sm text-muted-foreground">{txn.date}</div>
                                    </TableCell>
                                    <TableCell className={`text-right font-mono ${txn.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatCurrency(txn.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
