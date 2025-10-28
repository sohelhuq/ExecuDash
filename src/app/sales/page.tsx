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
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2, PlusCircle, Upload, CalendarIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type Invoice = {
  id: string;
  unit: string;
  customer: string;
  invoiceId: string;
  dueDate: string; // ISO string
  amount: number;
  status: 'Pending' | 'Overdue' | 'Paid';
};

const invoiceFormSchema = z.object({
  unit: z.string().min(1, 'Business unit is required.'),
  customer: z.string().min(1, 'Customer name is required.'),
  invoiceId: z.string().min(1, 'Invoice ID is required.'),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  amount: z.coerce.number().min(0, 'Amount must be a positive number.'),
  status: z.enum(['Pending', 'Overdue', 'Paid']),
});

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
    const [newInvoiceOpen, setNewInvoiceOpen] = React.useState(false);
    const [bulkUploadOpen, setBulkUploadOpen] = React.useState(false);
    const { toast } = useToast();
    
    const firestore = useFirestore();
    const invoicesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'invoices') : null, [firestore]);
    const { data: invoiceData, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesCollection);

    const invoiceForm = useForm<z.infer<typeof invoiceFormSchema>>({
        resolver: zodResolver(invoiceFormSchema),
        defaultValues: {
            unit: '',
            customer: '',
            invoiceId: '',
            amount: 0,
            status: 'Pending',
        },
    });

    function onAddInvoiceSubmit(values: z.infer<typeof invoiceFormSchema>) {
        if (!invoicesCollection) return;

        const newInvoiceData = {
          ...values,
          dueDate: values.dueDate.toISOString(),
        };

        addDocumentNonBlocking(invoicesCollection, newInvoiceData);

        toast({
            title: 'Invoice Added',
            description: `Invoice ${values.invoiceId} for ${values.customer} has been added.`,
        });
        invoiceForm.reset();
        setNewInvoiceOpen(false);
    }

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
    
    const handleBulkUpload = () => {
        toast({
            title: 'Upload Started',
            description: 'Your file is being processed. This is a mock action for now.',
        });
        setBulkUploadOpen(false);
    };


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Previous Dues Collection</h1>
                <p className="text-muted-foreground">Review and manage outstanding invoices.</p>
            </div>
            <div className="flex items-center gap-2">
                <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Bulk Upload</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bulk Upload Invoices</DialogTitle>
                            <DialogDescription>Upload a CSV file with your invoice data.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input type="file" accept=".csv" />
                             <p className="text-xs text-muted-foreground mt-2">Note: This is a placeholder. File processing is not implemented.</p>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button onClick={handleBulkUpload}>Upload File</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={newInvoiceOpen} onOpenChange={setNewInvoiceOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> New Invoice</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>Create New Invoice</DialogTitle>
                            <DialogDescription>Fill out the form below to add a single invoice.</DialogDescription>
                        </DialogHeader>
                        <Form {...invoiceForm}>
                            <form onSubmit={invoiceForm.handleSubmit(onAddInvoiceSubmit)} className="grid gap-4 py-4">
                                <FormField control={invoiceForm.control} name="unit" render={({ field }) => (
                                    <FormItem><FormLabel>Business Unit</FormLabel><FormControl><Input placeholder="e.g., Bricks, Pharmacy, Feed" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={invoiceForm.control} name="customer" render={({ field }) => (
                                    <FormItem><FormLabel>Customer</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={invoiceForm.control} name="invoiceId" render={({ field }) => (
                                    <FormItem><FormLabel>Invoice ID</FormLabel><FormControl><Input placeholder="e.g., INV-12345" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={invoiceForm.control} name="dueDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel>
                                        <Popover><PopoverTrigger asChild>
                                            <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent></Popover>
                                    <FormMessage /></FormItem>
                                )}/>
                                <FormField control={invoiceForm.control} name="amount" render={({ field }) => (
                                    <FormItem><FormLabel>Amount Due</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={invoiceForm.control} name="status" render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Overdue">Overdue</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /></FormItem>
                                )}/>
                                <DialogFooter className="pt-4">
                                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                    <Button type="submit">Create Invoice</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
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
