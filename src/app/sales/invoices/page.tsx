
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, MoreHorizontal, Database, Loader2 } from 'lucide-react';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { initialInvoiceData } from '@/lib/sales-data';

type Invoice = {
    id: string;
    invoiceId: string;
    customer: string;
    date: string;
    status: 'Paid' | 'Due' | 'Overdue';
    dueDate?: string;
    amount: number;
};

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
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = React.useState(false);

    const invoicesCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'invoices') : null;
    }, [firestore]);
    const { data: invoiceData, isLoading } = useCollection<Invoice>(invoicesCollection);

    const seedData = async () => {
        if (!invoicesCollection || !firestore) return;
        setIsSeeding(true);
        try {
            const snapshot = await getDocs(invoicesCollection);
            if (!snapshot.empty) {
                toast({ title: 'Data Already Exists', description: 'Invoice data has already been seeded.' });
                return;
            }

            const batch = writeBatch(firestore);
            initialInvoiceData.forEach((invoice) => {
                const docRef = doc(invoicesCollection);
                batch.set(docRef, invoice);
            });
            await batch.commit();

            toast({ title: 'Seeding Complete', description: `${initialInvoiceData.length} invoice records have been added.` });
        } catch (error) {
            console.error('Error seeding data:', error);
            toast({ variant: 'destructive', title: 'Seeding Failed', description: 'Could not seed invoice data.' });
        } finally {
            setIsSeeding(false);
        }
    };


  const totalInvoiceAmount = invoiceData?.reduce((sum, inv) => sum + inv.amount, 0) || 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
                <p className="text-muted-foreground">Track and manage all your sales invoices.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={seedData} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                    Seed Data
                </Button>
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
                {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : (
                    invoiceData?.map((invoice) => (
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
                    ))
                )}
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
