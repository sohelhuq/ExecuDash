'use client';
import *s React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const commissions = [
  { id: 'com1', customer: "ABC Corporation", transactionAmount: 50000, commissionAmount: 2500, date: "2024-07-20" },
  { id: 'com2', customer: "DEF Industries", transactionAmount: 100000, commissionAmount: 5500, date: "2024-07-18" },
  { id: 'com3', customer: "GHI Solutions", transactionAmount: 25000, commissionAmount: 1250, date: "2024-07-15" },
  { id: 'com4', customer: "JKL Enterprises", transactionAmount: 75000, commissionAmount: 3750, date: "2024-07-12" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function CommissionsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Commission History</h1>
            <p className="text-muted-foreground">A detailed record of your earned commissions.</p>
          </div>
          <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Commissions</CardTitle>
            <CardDescription>Browse through all commissions you have earned to date.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Transaction Amount</TableHead>
                  <TableHead className="text-right">Commission Earned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.date}</TableCell>
                    <TableCell className="font-medium">{commission.customer}</TableCell>
                    <TableCell>{formatCurrency(commission.transactionAmount)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">{formatCurrency(commission.commissionAmount)}</TableCell>
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
