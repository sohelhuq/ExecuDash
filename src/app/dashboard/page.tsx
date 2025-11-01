'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Banknote, ArrowUpRight, ArrowDownLeft, Target, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const kpiData = [
  { title: "Total Balance", value: "৳1,250,500", change: "+৳80,200 this month", icon: Banknote, color: "text-green-500" },
  { title: "Total Income", value: "৳350,000", change: "+15% from last month", icon: ArrowUpRight, color: "text-green-500" },
  { title: "Total Expenses", value: "৳125,800", change: "+5% from last month", icon: ArrowDownLeft, color: "text-red-500" },
  { title: "Savings Goals", value: "65% Reached", change: "2 active goals", icon: Target, color: "text-blue-500" },
];

const chartData = [
  { month: 'Jan', income: 320000, expenses: 180000 },
  { month: 'Feb', income: 300000, expenses: 210000 },
  { month: 'Mar', income: 450000, expenses: 150000 },
  { month: 'Apr', income: 420000, expenses: 250000 },
  { month: 'May', income: 580000, expenses: 190000 },
  { month: 'Jun', income: 510000, expenses: 220000 },
];

const recentTransactions = [
  { id: 'trx1', description: "Invoice #INV-2024-015 payment from 'Creative Solutions'", amount: "+ ৳75,000", time: "10 minutes ago", type: "income" },
  { id: 'trx2', description: "Office rent for July", amount: "- ৳50,000", time: "1 hour ago", type: "expense" },
  { id: 'trx3', description: "Cloud server subscription (AWS)", amount: "- ৳15,000", time: "3 hours ago", type: "expense" },
  { id: 'trx4', description: "Payment received from 'Global Imports'", amount: "+ ৳120,000", time: "Yesterday", type: "income" },
  { id: 'trx5', description: "Software license renewal", amount: "- ৳5,500", time: "Yesterday", type: "expense" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your financial command center.</p>
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
                    <CardTitle>Income vs. Expenses</CardTitle>
                    <CardDescription>Performance over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" stroke="hsl(var(--primary))" tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                            <Tooltip formatter={(value: number, name: string) => formatCurrency(value)} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="income" fill="hsl(var(--chart-1))" name="Income" />
                            <Bar yAxisId="left" dataKey="expenses" fill="hsl(var(--chart-2))" name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial movements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                         <TableBody>
                            {recentTransactions.map(activity => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        <div className="font-medium">{activity.description}</div>
                                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                                    </TableCell>
                                    <TableCell className={`text-right font-medium ${activity.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {activity.amount}
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
