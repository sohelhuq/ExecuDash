'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Archive, FileText, RefreshCw, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const kpiData = [
  { title: "Total Sales (Today)", value: "$15,200", icon: DollarSign },
  { title: "Stock Value (Current)", value: "$850,000", icon: Archive },
  { title: "Outstanding Invoices", value: "45", icon: FileText },
  { title: "Inventory Turnover Rate", value: "4.2", icon: RefreshCw },
];

const revenueData = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3000 },
  { month: 'Jul', revenue: 3200 },
];

const salesDistributionData = [
  { name: 'Fuel', value: 45 },
  { name: 'Pharmacy', value: 25 },
  { name: 'ISP', value: 10 },
  { name: 'Feed', value: 5 },
  { name: 'Others', value: 15 },
];

const COLORS = ['#FFC107', '#00C49F', '#0088FE', '#FF8042', '#8884d8'];

const lowStockAlerts = [
    { item: 'Diesel Fuel', status: 'Low' },
    { item: 'Red Bricks', status: 'Critical' },
];

// Dynamically import chart components with SSR disabled
const DynamicLineChart = dynamic(() =>
  import('recharts').then(mod => mod.LineChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);
const DynamicPieChart = dynamic(() =>
  import('recharts').then(mod => mod.PieChart),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell, Legend } from 'recharts';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shetue Group Unified ERP System</h1>
          <p className="text-muted-foreground">Centralized Performance Hub</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow">
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <DynamicLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value: number) => `$${value/1000}k`} />
                  <Tooltip 
                     contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                     }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </DynamicLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Sales Distribution by Unit</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <DynamicPieChart>
                  <Pie
                    data={salesDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {salesDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                     }}
                  />
                  <Legend iconSize={10} />
                </DynamicPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
         <Card className="shadow">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="text-destructive"/>
                    Low Stock Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {lowStockAlerts.map((alert, index) => (
                        <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <span className="font-medium">{alert.item}</span>
                             <span className={`font-semibold ${alert.status === 'Critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {alert.status}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
