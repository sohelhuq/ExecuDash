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

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

const serviceSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  slaDays: z.coerce.number().int().positive('SLA must be a positive number of days'),
  assignedTo: z.string().min(1, 'This field is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;
type Service = ServiceFormData & { id: string };

const seedServices: Omit<Service, 'id'>[] = [
    { description: "Home 20 Mbps", price: 900, slaDays: 1, assignedTo: "Popy Akhter" },
    { description: "Business 50 Mbps", price: 2000, slaDays: 1, assignedTo: "Kamrul Islam" },
    { description: "Warranty repair", price: 300, slaDays: 3, assignedTo: "Popy Akhter" },
    { description: "Delivery setup", price: 600, slaDays: 1, assignedTo: "Kamrul Islam" },
];

export default function ServicePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const servicesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/services`) : null, [firestore, user]);
  const { data: services, isLoading } = useCollection<Service>(servicesRef);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { description: '', price: 0, slaDays: 1, assignedTo: '' },
  });

  const handleSeedData = async () => {
    if (!servicesRef) return;
    try {
      const batch = writeBatch(firestore);
      seedServices.forEach(svc => {
        const docRef = doc(servicesRef);
        batch.set(docRef, svc);
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo services have been added.' });
    } catch (error) {
        console.error("Error seeding services:", error);
        const contextualError = new FirestorePermissionError({ path: servicesRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo services.' });
    }
  };

  const onSubmit = (values: ServiceFormData) => {
    if (!servicesRef) return;

    addDoc(servicesRef, values).then(() => {
        toast({ title: 'Success', description: 'Service/Package added successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding service:", error);
        const contextualError = new FirestorePermissionError({ path: servicesRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add service.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service & Package Management</h1>
            <p className="text-muted-foreground">Define and manage ISP packages and other services.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Service/Package</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Service or Package</DialogTitle>
                  <DialogDescription>Fill in the details for the new service offering.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description / Package Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Home 20 Mbps" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (BDT)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="slaDays" render={({ field }) => (<FormItem><FormLabel>SLA (Days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="assignedTo" render={({ field }) => (<FormItem><FormLabel>Assigned To</FormLabel><FormControl><Input {...field} placeholder="e.g., Popy Akhter" /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter><Button type="submit">Save Service</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service & Package List</CardTitle>
            <CardDescription>A list of all available services and packages.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>SLA (Days)</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading services...</TableCell></TableRow>}
                {services?.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.description}</TableCell>
                    <TableCell>{service.assignedTo}</TableCell>
                    <TableCell>{service.slaDays}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(service.price)}</TableCell>
                  </TableRow>
                ))}
                 {!isLoading && services?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No services found. Add one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
