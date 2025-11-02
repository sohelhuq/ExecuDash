'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, writeBatch, doc } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const taxSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Type is required'),
  rate: z.coerce.number().positive('Rate must be a positive number'),
});

type TaxFormData = z.infer<typeof taxSchema>;
type Tax = TaxFormData & { id: string };

const seedTaxes: Omit<Tax, 'id'>[] = [
    { title: "Value Added Tax", type: "VAT", rate: 15 },
    { title: "Income Tax", type: "Income", rate: 10 },
];

export default function TaxesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const taxesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/taxes`) : null, [firestore, user]);
  const { data: taxes, isLoading } = useCollection<Tax>(taxesRef);

  const form = useForm<TaxFormData>({
    resolver: zodResolver(taxSchema),
    defaultValues: { title: '', type: '', rate: 0 },
  });

  const handleSeedData = async () => {
    if (!taxesRef) return;
    try {
      const batch = writeBatch(firestore);
      seedTaxes.forEach(tax => {
        const docRef = doc(taxesRef);
        batch.set(docRef, tax);
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo tax rates have been added.' });
    } catch (error) {
        console.error("Error seeding taxes:", error);
        const contextualError = new FirestorePermissionError({ path: taxesRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo tax rates.' });
    }
  };

  const onSubmit = (values: TaxFormData) => {
    if (!taxesRef) return;

    addDoc(taxesRef, values).then(() => {
        toast({ title: 'Success', description: 'Tax rate added successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding tax rate:", error);
        const contextualError = new FirestorePermissionError({ path: taxesRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add tax rate.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tax Management</h1>
            <p className="text-muted-foreground">Define and manage tax rates for your business.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Tax Rate</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tax Rate</DialogTitle>
                  <DialogDescription>Fill in the details for the new tax configuration.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} placeholder="e.g., Value Added Tax" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} placeholder="e.g., VAT" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="rate" render={({ field }) => (<FormItem><FormLabel>Rate (%)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter><Button type="submit">Save Tax</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Tax Rates</CardTitle>
            <CardDescription>A list of all configured tax rates.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Rate (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading tax rates...</TableCell></TableRow>}
                {taxes?.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell className="font-medium">{tax.title}</TableCell>
                    <TableCell>{tax.type}</TableCell>
                    <TableCell className="text-right font-semibold">{tax.rate}%</TableCell>
                  </TableRow>
                ))}
                 {!isLoading && taxes?.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No tax rates found. Add one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
