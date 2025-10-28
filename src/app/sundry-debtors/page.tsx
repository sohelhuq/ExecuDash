'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown, Users, PieChart } from 'lucide-react';
import * as React from 'react';

const sundryDebtorsData = {
  totalDebtors: 101,
  totalOutstandingDebt: 9940090.00,
  topDebtors: [
    { name: 'New Hoque Transport-01819276289', amount: 2605694.00 },
    { name: 'Sohag Vai', amount: 1486234.00 },
    { name: 'Ramgonj Transport-01819872455', amount: 1370944.00 },
    { name: 'Parsonal', amount: 1326097.00 },
    { name: 'Rajon Golpo Cargo-01780591333', amount: 426464.00 },
    { name: 'Digonto Star-01814767985', amount: 295196.00 },
    { name: 'Sofi Motors', amount: 232234.00 },
    { name: 'Anu Enterprise', amount: 216362.00 },
    { name: 'Usuf Mia', amount: 174747.00 },
    { name: 'Bilash All', amount: 147923.00 },
  ],
  debtConcentration: 83.32,
};

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function SundryDebtorsPage() {

  const { totalDebtors, totalOutstandingDebt, topDebtors, debtConcentration } = sundryDebtorsData;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sundry Debtors Analysis</h1>
          <p className="text-muted-foreground">An overview of outstanding debts and top debtors.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding Debt</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{formatCurrency(totalOutstandingDebt)}</div>
                    <p className="text-xs text-muted-foreground">Across all debtors.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Number of Debtors</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDebtors}</div>
                    <p className="text-xs text-muted-foreground">Unique customers with outstanding balances.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Debt Concentration</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{debtConcentration}%</div>
                    <p className="text-xs text-muted-foreground">Portion of total debt held by top 10 debtors.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Debtors by Outstanding Amount</CardTitle>
            <CardDescription>
              The following customers represent the largest outstanding balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Debtor Name</TableHead>
                  <TableHead className="text-right">Outstanding Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topDebtors.map((debtor, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{debtor.name}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(debtor.amount)}</TableCell>
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
