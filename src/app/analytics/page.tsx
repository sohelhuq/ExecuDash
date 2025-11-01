'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const expenseData = [
  { name: 'Salaries', value: 250000 },
  { name: 'Rent', value: 100000 },
  { name: 'Marketing', value: 75000 },
  { name: 'Utilities', value: 45000 },
  { name: 'Software', value: 30000 },
  { name: 'Other', value: 55000 },
];

const incomeData = [
  { name: 'Client Payments', value: 450000 },
  { name: 'Consulting', value: 120000 },
  { name: 'SaaS Subscriptions', value: 85000 },
];

const COLORS_EXPENSE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d'];
const COLORS_INCOME = ['#0088FE', '#00C49F', '#FFBB28'];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
          <p className="text-muted-foreground">Deep dive into your financial data.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>A look at where your money is going.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_EXPENSE[index % COLORS_EXPENSE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value:number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <CardDescription>An overview of your revenue streams.</CardDescription>
            </CardHeader>
            <CardContent>
               <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                     nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_INCOME[index % COLORS_INCOME.length]} />
                    ))}
                  </Pie>
                   <Tooltip formatter={(value:number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
