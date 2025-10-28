'use client';
import { AppShell } from '@/components/layout/app-shell';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, DollarSign, Banknote, Landmark, TrendingUp, Archive, Package, UserPlus, Fuel, ShoppingCart, ArrowRightLeft, Factory, Receipt } from 'lucide-react';
import type { BusinessUnit } from '@/lib/business-units-types';
import * as React from 'react';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const ICONS: { [key: string]: React.ElementType } = {
  DollarSign,
  Banknote,
  Landmark,
  TrendingUp,
  Archive,
  Package,
  UserPlus,
  Fuel,
  ShoppingCart,
  ArrowRightLeft,
  Factory,
  Receipt,
};


export default function BusinessUnitPage({ params }: { params: { businessUnit: string } }) {
  const firestore = useFirestore();
  const unitDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'business_units', params.businessUnit) : null, [firestore, params.businessUnit]);
  const { data: unit, isLoading } = useDoc<BusinessUnit>(unitDocRef);
  
  if (isLoading) {
    return (
        <AppShell>
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
        </AppShell>
    );
  }

  if (!unit) {
    notFound();
  }

  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{unit.name}</h1>
          <p className="text-muted-foreground">{unit.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {unit.kpis.map((kpi) => {
            const Icon = ICONS[kpi.icon] || DollarSign;
            return (
                <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                </CardContent>
                </Card>
            );
          })}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(7500000)}</div>
                    <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Production</CardTitle>
                    <Factory className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,200 Units</div>
                    <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Purchases</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(2250000)}</div>
                    <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cost of Goods Sold</CardTitle>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(4800000)}</div>
                    <p className="text-xs text-muted-foreground">Represents 64% of sales</p>
                </CardContent>
            </Card>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Revenue and profit over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={unit.timeSeriesData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                    >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickFormatter={(value) => formatCurrency(Number(value) / 1000) + 'k'}
                     />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(Number(value))}/>} />
                    <Legend />
                    <Area
                        dataKey="revenue"
                        type="natural"
                        fill="var(--color-revenue)"
                        fillOpacity={0.4}
                        stroke="var(--color-revenue)"
                        stackId="a"
                    />
                    <Area
                        dataKey="profit"
                        type="natural"
                        fill="var(--color-profit)"
                        fillOpacity={0.4}
                        stroke="var(--color-profit)"
                        stackId="a"
                    />
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Debt &amp; Expenses</CardTitle>
                <CardDescription>A log of the most recent financial activities, including direct expenses and debts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unit.transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell>{format(new Date(txn.date), 'dd MMM, yyyy')}</TableCell>
                                <TableCell className="font-medium">{txn.description}</TableCell>
                                <TableCell>
                                    <Badge variant={txn.type === 'income' ? 'default' : 'destructive'} className={txn.type === 'income' ? 'bg-green-500/20 text-green-700' : ''}>
                                        {txn.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-mono ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(txn.amount)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
