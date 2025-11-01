'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const expenseData = [
  { name: 'Utilities', value: 42000 },
  { name: 'Groceries', value: 85000 },
  { name: 'Transport', value: 35000 },
  { name: 'Entertainment', value: 25000 },
  { name: 'Investments', value: 500000 },
  { name: 'Other', value: 15000 },
];

const incomeData = [
    { name: 'Salary', value: 2500000 },
    { name: 'Freelance', value: 750000 },
    { name: 'Investment Returns', value: 120000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1943'];
const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

const DataPieChart = ({data, title, description}: {data: {name: string, value: number}[], title: string, description: string}) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return (
                                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                </text>
                            );
                        }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
);


export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Analytics</h1>
          <p className="text-muted-foreground">A visual breakdown of your financial data.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <DataPieChart data={expenseData} title="Expense Breakdown" description="A look at where your money is going." />
            <DataPieChart data={incomeData} title="Income Sources" description="Where your money is coming from." />
        </div>
      </div>
    </AppShell>
  );
}
