'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingDown } from 'lucide-react';
import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';

type SundryDebtor = {
  id: string;
  customer: string;
  invoiceId: string;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Overdue';
};

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function SundryDebtorsPage() {
  const firestore = useFirestore();
  const debtorsQuery = useMemoFirebase(() => {
    return firestore 
      ? query(collection(firestore, 'invoices'), where('status', 'in', ['Pending', 'Overdue'])) 
      : null;
  }, [firestore]);
  const { data: debtors, isLoading } = useCollection<SundryDebtor>(debtorsQuery);

  const totalDue = React.useMemo(() => {
    if (!debtors) return 0;
    return debtors.reduce((acc, debtor) => acc + debtor.amount, 0);
  }, [debtors]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sundry Debtors</h1>
          <p className="text-muted-foreground">List of customers with outstanding invoice payments.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                    <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDue)}</div>
                    <p className="text-xs text-muted-foreground">Across all outstanding invoices.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Debtors List</CardTitle>
            <CardDescription>
              The following customers have invoices that are either pending or overdue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : debtors && debtors.length > 0 ? (
                  debtors.map((debtor) => (
                    <TableRow key={debtor.id}>
                      <TableCell className="font-medium">{debtor.customer}</TableCell>
                      <TableCell>{debtor.invoiceId}</TableCell>
                      <TableCell>{format(parseISO(debtor.dueDate), 'dd MMM, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={debtor.status === 'Overdue' ? 'destructive' : 'secondary'}>
                          {debtor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(debtor.amount)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No outstanding debtors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
