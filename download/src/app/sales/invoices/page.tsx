'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, FileDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

const invoices = [
  { id: 'INV-2024-071', customer: 'New Haq Enterprise', date: '2024-07-28', dueDate: '2024-08-27', amount: 75000, status: 'Due' },
  { id: 'INV-2024-070', customer: 'Sohag Vai', date: '2024-07-25', dueDate: '2024-07-30', amount: 120000, status: 'Overdue' },
  { id: 'INV-2024-069', customer: 'Ramgonj Transport', date: '2024-07-15', dueDate: '2024-08-14', amount: 55000, status: 'Paid' },
  { id: 'INV-2024-068', customer: 'Sonali Enterprise', date: '2024-07-10', dueDate: '2024-08-09', amount: 25000, status: 'Due' },
  { id: 'INV-2024-067', customer: 'Friends Trading', date: '2024-06-20', dueDate: '2024-07-20', amount: 89000, status: 'Overdue' },
];

export default function InvoiceManagementPage() {
  const { toast } = useToast();
  
  const handleAction = (action: string, invoiceId: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Action triggered for invoice ${invoiceId}. Functionality to be implemented.`,
    });
  };

  const totalAmount = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
            <p className="text-muted-foreground">Track, manage, and process all customer invoices.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleAction('New Invoice', '')}><PlusCircle className="mr-2 h-4 w-4" /> New Invoice</Button>
            <Button variant="outline" onClick={() => handleAction('Export', '')}><FileDown className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Invoice List</CardTitle>
            <CardDescription>A list of all recent invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'} className={cn(
                        invoice.status === 'Paid' && 'bg-green-100 text-green-800',
                        invoice.status === 'Due' && 'bg-yellow-100 text-yellow-800',
                        invoice.status === 'Overdue' && 'bg-red-100 text-red-800 font-bold',
                      )}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('View Details', invoice.id)}>View Details</DropdownMenuItem>
                          {invoice.status !== 'Paid' && <DropdownMenuItem onClick={() => handleAction('Mark as Paid', invoice.id)}>Mark as Paid</DropdownMenuItem>}
                          {invoice.status === 'Overdue' && <DropdownMenuItem className="text-orange-600" onClick={() => handleAction('Send Reminder', invoice.id)}>Send Reminder</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={5} className="text-right font-bold text-lg">Total Amount</TableCell>
                    <TableCell className="text-right font-bold text-lg">{formatCurrency(totalAmount)}</TableCell>
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
