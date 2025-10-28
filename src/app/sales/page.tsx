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
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type Invoice = {
  id: string;
  unit: string;
  customer: string;
  invoiceId: string;
  dueDate: string; // ISO string
  amount: number;
  status: 'Pending' | 'Overdue' | 'Paid';
};

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

const statusVariant = (status: string) => {
    switch (status) {
      case 'Overdue': return 'destructive';
      case 'Paid': return 'default';
      default: return 'secondary';
    }
};

const InvoiceTable = ({ invoices, isLoading }: { invoices: Invoice[] | null, isLoading: boolean }) => (
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
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                </TableRow>
            ) : invoices?.map((invoice) => (
            <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.unit}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.invoiceId}</TableCell>
                <TableCell>{format(parseISO(invoice.dueDate), 'dd MMM, yyyy')}</TableCell>
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
    const { toast } = useToast();
    
    const firestore = useFirestore();
    const invoicesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'invoices') : null, [firestore]);
    const { data: invoiceData, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesCollection);

    const filteredInvoices = React.useMemo(() => {
        if (!invoiceData) return null;
        if (activeTab === 'All Units') return invoiceData;
        return invoiceData.filter(i => i.unit === activeTab);
    }, [activeTab, invoiceData]);

    const calculateOverdue = (unit: string | 'All Units') => {
        if (!invoiceData) return 0;
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
    
    const handleGenerateReport = () => {
        toast({
            title: "Report Generation Started",
            description: "Your report is being generated and will be available for download shortly.",
        });
    };


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Previous Dues Collection</h1>
                <p className="text-muted-foreground">Review and manage outstanding invoices.</p>
            </div>
            <Button onClick={handleGenerateReport}>Generate Report</Button>
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
                    <InvoiceTable invoices={filteredInvoices} isLoading={isLoadingInvoices} />
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

    