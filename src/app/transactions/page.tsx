'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, FileDown, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { categorizeTransaction } from '@/ai/categorize-flow';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

type Transaction = {
  id: string;
  date: Timestamp;
  description: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  source: string;
};

const transactionSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  source: z.string().min(1, "Source is required"),
});

const seedTransactions: Omit<Transaction, 'id' | 'date'>[] = [
    { description: "Invoice #INV-2024-015 payment", type: "income", category: "Client Payment", amount: 75000, source: "Bank Transfer" },
    { description: "Office rent for July", type: "expense", category: "Rent", amount: 50000, source: "Bank Cheque" },
    { description: "Cloud server subscription (AWS)", type: "expense", category: "Utilities", amount: 15000, source: "Credit Card" },
    { description: "Payment received from 'Global Imports'", type: "income", category: "Client Payment", amount: 120000, source: "Bank Transfer" },
    { description: "Software license renewal", type: "expense", category: "Software", amount: 5500, source: "Credit Card" },
    { description: "Employee Salaries - July", type: "expense", category: "Salaries", amount: 250000, source: "Bank Transfer" },
    { description: "Consulting fee", type: "income", category: "Consulting", amount: 45000, source: "Stripe" },
];

export default function TransactionsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [isCategorizing, setIsCategorizing] = React.useState(false);

  const transactionsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/transactions`) : null, [firestore, user]);
  const { data: transactions, isLoading } = useCollection<Transaction>(transactionsRef);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "expense", amount: 0 },
  });
  
  const descriptionValue = form.watch('description');

  const handleSuggestCategory = async () => {
    if (!descriptionValue) {
        toast({ variant: 'destructive', title: 'Description needed', description: 'Please enter a description to get a category suggestion.' });
        return;
    }
    setIsCategorizing(true);
    try {
        const result = await categorizeTransaction({ description: descriptionValue });
        if (result.category) {
            form.setValue('category', result.category);
            toast({ title: 'Category Suggested!', description: `We've set the category to "${result.category}".` });
        }
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not suggest a category.' });
    } finally {
        setIsCategorizing(false);
    }
  }


  const handleSeedData = async () => {
    if (!transactionsRef) return;
    try {
      const batch = writeBatch(firestore);
      seedTransactions.forEach(trx => {
        const docRef = doc(transactionsRef);
        batch.set(docRef, { ...trx, date: Timestamp.now() });
      });
      await batch.commit();
      toast({ title: "Success", description: "Demo transactions have been added." });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: "Could not seed data." });
    }
  };

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    if (!transactionsRef) return;
    try {
      await addDoc(transactionsRef, {
        ...values,
        date: Timestamp.fromDate(values.date),
      });
      toast({ title: "Success", description: "Transaction added successfully." });
      form.reset();
      setDialogOpen(false);
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: "Could not add transaction." });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View, add, and manage your financial transactions.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new transaction here.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Office supplies" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount (৳)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                    
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder="e.g., Utilities" {...field} />
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategory} disabled={isCategorizing || !descriptionValue}>
                                    <Sparkles className={cn("h-4 w-4", isCategorizing && "animate-spin")}/>
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="source" render={({ field }) => (<FormItem><FormLabel>Source</FormLabel><FormControl><Input placeholder="e.g., Bank, Cash" {...field} /></FormControl><FormMessage /></FormItem>)} />

                    <DialogFooter>
                      <Button type="submit">Save Transaction</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A complete record of all your financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading transactions...</TableCell></TableRow>}
                {transactions?.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>{format(trx.date.toDate(), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{trx.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{trx.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trx.type === 'income' ? 'default' : 'secondary'}
                        className={trx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {trx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(trx.amount)}</TableCell>
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
