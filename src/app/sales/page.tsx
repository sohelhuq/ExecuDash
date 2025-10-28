'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import * as React from 'react';
import { format } from 'date-fns';

const invoiceData = [
  {
    id: 1,
    unit: 'Fuel',
    customer: 'Customer A',
    invoiceId: 'INV-0012',
    dueDate: new Date('2024-05-15'),
    amount: 12000,
    status: 'Overdue',
  },
  {
    id: 2,
    customer: 'Customer B',
    unit: 'Bricks',
    invoiceId: 'INV-0013',
    dueDate: new Date('2024-06-20'),
    amount: 3500,
    status: 'Pending',
  },
  {
    id: 3,
    customer: 'Customer C',
    unit: 'Pharmacy',
    invoiceId: 'INV-0014',
    dueDate: new Date('2024-06-01'),
    amount: 8600,
    status: 'Overdue',
  },
    {
    id: 4,
    customer: 'Customer D',
    unit: 'Feed',
    invoiceId: 'INV-0015',
    dueDate: new Date('2024-07-10'),
    amount: 5300,
    status: 'Pending',
  },
  {
    id: 5,
    customer: 'Customer E',
    unit: 'Fuel',
    invoiceId: 'INV-0016',
    dueDate: new Date('2024-04-20'),
    amount: 13000,
    status: 'Overdue',
  },
  {
    id: 6,
    customer: 'Customer F',
    unit: 'Bricks',
    invoiceId: 'INV-0017',
    dueDate: new Date('2024-06-25'),
    amount: 2100,
    status: 'Pending',
  },
];

type Invoice = typeof invoiceData[0];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

const statusVariant = (status: string) => {
    switch (status) {
      case 'Overdue': return 'destructive';
      case 'Paid': return 'default';
      default: return 'secondary';
    }
};

const InvoiceTable = ({ invoices }: { invoices: Invoice[] }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Amount Due</TableHead>
                <TableHead className="text-center">Status</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.unit}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell>{format(invoice.dueDate, 'dd MMM, yyyy')}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(invoice.amount)}</TableCell>
                <TableCell className="text-center">
                    <Badge variant={statusVariant(invoice.status)} className={
                        invoice.status === 'Pending' ? 'bg-accent/80 text-accent-foreground' :
                        invoice.status === 'Paid' ? 'bg-green-500/20 text-green-700' : ''
                    }>
                        {invoice.status}
                    </Badge>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
);


export default function SalesPage() {
    const [activeTab, setActiveTab] = React.useState('All Units');
    const filteredInvoices = React.useMemo(() => {
        if (activeTab === 'All Units') return invoiceData;
        return invoiceData.filter(i => i.unit === activeTab);
    }, [activeTab]);

    const calculateOverdue = (unit: string | 'All Units') => {
        const invoicesToSum = unit === 'All Units' ? invoiceData : invoiceData.filter(i => i.unit === unit);
        return invoicesToSum
            .filter(i => i.status === 'Overdue')
            .reduce((total, i) => total + i.amount, 0);
    }

    const summaryCards = [
        { title: 'Fuel Unit Total Overdue', value: calculateOverdue('Fuel') },
        { title: 'Feed Unit Total Overdue', value: calculateOverdue('Feed') },
        { title: 'Bricks Unit Total Overdue', value: calculateOverdue('Bricks') },
    ];


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Previous Dues Collection</h1>
                <p className="text-muted-foreground">Review and manage outstanding invoices.</p>
            </div>
            <Button>Generate Report</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="All Units">All Units</TabsTrigger>
            <TabsTrigger value="Bricks">Bricks</TabsTrigger>
            <TabsTrigger value="Pharmacy">Pharmacy</TabsTrigger>
            <TabsTrigger value="Feed">Feed</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Card className="mt-4 border-border/60">
                <CardContent className="p-0">
                    <InvoiceTable invoices={filteredInvoices} />
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => (
            <Card key={card.title} className="border-primary/40 bg-primary/5 text-center">
              <CardHeader className="pb-2">
                <CardDescription className="text-primary/80">{card.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatCurrency(card.value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
