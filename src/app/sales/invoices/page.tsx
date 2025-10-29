
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const invoiceData = [
  {
    invoiceId: 'INV-2024-001',
    customer: 'ABC Construction',
    date: '2024-07-28',
    status: 'Paid',
    amount: 150000,
  },
  {
    invoiceId: 'INV-2024-002',
    customer: 'XYZ Builders',
    date: '2024-07-25',
    status: 'Due',
    dueDate: '2024-08-25',
    amount: 75000,
  },
  {
    invoiceId: 'INV-2024-003',
    customer: 'New Hoque Transport',
    date: '2024-06-15',
    status: 'Overdue',
    dueDate: '2024-07-15',
    amount: 2605694,
  },
    {
    invoiceId: 'INV-2024-004',
    customer: 'Sohag Vai',
    date: '2024-06-10',
    status: 'Overdue',
    dueDate: '2024-07-10',
    amount: 1486234,
  },
  {
    invoiceId: 'INV-2024-005',
    customer: 'Prestige Homes Ltd.',
    date: '2024-07-29',
    status: 'Paid',
    amount: 250000,
  },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

const statusVariant = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Due':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function InvoiceManagementPage() {
  const totalInvoiceAmount = invoiceData.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
                <p className="text-muted-foreground">Track and manage all your sales invoices.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Invoice</Button>
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>A list of all invoices issued to customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((invoice) => (
                  <TableRow key={invoice.invoiceId}>
                    <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(invoice.status)} className={invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}>
                        {invoice.status}
                      </Badge>
                      {invoice.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">Due: {invoice.dueDate}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold text-lg">
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalInvoiceAmount)}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

