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

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  contact: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
});

type SupplierFormData = z.infer<typeof supplierSchema>;
type Supplier = SupplierFormData & { id: string };

const seedSuppliers: Omit<Supplier, 'id'>[] = [
    { name: "Anwar IT", contact: "01717001234", address: "Noakhali, BD" },
    { name: "Star Electronics", contact: "01923215987", address: "Chittagong, BD" },
];

export default function SuppliersPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const suppliersRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/suppliers`) : null, [firestore, user]);
  const { data: suppliers, isLoading } = useCollection<Supplier>(suppliersRef);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: { name: '', contact: '', address: '' },
  });

  const handleSeedData = async () => {
    if (!suppliersRef) return;
    try {
      const batch = writeBatch(firestore);
      seedSuppliers.forEach(sup => {
        const docRef = doc(suppliersRef);
        batch.set(docRef, sup);
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo suppliers have been added.' });
    } catch (error) {
        console.error("Error seeding suppliers:", error);
        const contextualError = new FirestorePermissionError({ path: suppliersRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo suppliers.' });
    }
  };

  const onSubmit = (values: SupplierFormData) => {
    if (!suppliersRef) return;

    addDoc(suppliersRef, values).then(() => {
        toast({ title: 'Success', description: 'Supplier added successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding supplier:", error);
        const contextualError = new FirestorePermissionError({ path: suppliersRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add supplier.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
            <p className="text-muted-foreground">Add, view, and manage your product suppliers.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Supplier</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>Fill in the details for the new supplier.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Supplier Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Anwar IT" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="contact" render={({ field }) => (<FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 01..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="e.g., Noakhali, BD" /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter><Button type="submit">Save Supplier</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Supplier List</CardTitle>
            <CardDescription>A list of all registered suppliers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading suppliers...</TableCell></TableRow>}
                {suppliers?.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                  </TableRow>
                ))}
                 {!isLoading && suppliers?.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center py-10 text-muted-foreground">No suppliers found. Add one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
