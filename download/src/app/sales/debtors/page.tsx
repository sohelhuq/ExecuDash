'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, PieChart, TrendingUp } from 'lucide-react';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

const topDebtors = [
  { rank: 1, name: 'New Haq Enterprise', amount: 1550000 },
  { rank: 2, name: 'Sohag Vai', amount: 1230000 },
  { rank: 3, name: 'Ramgonj Transport', amount: 980000 },
  { rank: 4, name: 'Sonali Enterprise', amount: 760000 },
  { rank: 5, name: 'Friends Trading', amount: 650000 },
  { rank: 6, name: 'Mayer Doa Store', amount: 540000 },
  { rank: 7, name: 'Bismillah Traders', amount: 480000 },
  { rank: 8, name: 'Jamuna Distribution', amount: 410000 },
  { rank: 9, name: 'Global Impex', amount: 350000 },
  { rank: 10, name: 'City Retailers', amount: 290000 },
];

const totalOutstanding = 9940090;
const top10Concentration = topDebtors.reduce((acc, curr) => acc + curr.amount, 0) / totalOutstanding * 100;

export default function SundryDebtorsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sundry Debtors Dashboard</h1>
          <p className="text-muted-foreground">An overview of your accounts receivable and debtor concentration.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Debtors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">101</div>
              <p className="text-xs text-muted-foreground">Active debtor accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding Debt</CardTitle>
               <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</div>
               <p className="text-xs text-muted-foreground">Across all debtors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Debt Concentration</CardTitle>
               <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{top10Concentration.toFixed(2)}%</div>
               <p className="text-xs text-muted-foreground">From top 10 debtors</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Top 10 Debtors by Outstanding Amount</CardTitle>
                <CardDescription>The customers who owe the most significant amounts.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Rank</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead className="text-right">Outstanding Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topDebtors.map(debtor => (
                            <TableRow key={debtor.rank}>
                                <TableCell className="font-medium">{debtor.rank}</TableCell>
                                <TableCell>{debtor.name}</TableCell>
                                <TableCell className="text-right font-semibold">{formatCurrency(debtor.amount)}</TableCell>
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
