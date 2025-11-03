'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, Users, UserCheck, UserX } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const kpiData = [
    { title: 'Total Commission', value: '৳45,200', icon: Users, description: 'No remark needed', className: 'bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800' },
    { title: 'Approved Customers', value: '185', icon: UserCheck, description: 'Minimum Increased', className: 'bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800' },
    { title: 'Rejected Customers', value: '12', icon: UserX, description: '10 nos over due', className: 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800' },
];

const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  package: z.string().min(1, 'Package is required'),
  status: z.enum(['Active', 'Suspended', 'Inactive']),
});

type CustomerFormData = z.infer<typeof customerSchema>;
type Customer = CustomerFormData & { id: string; joinDate: string; balance: number };

const seedCustomers: Omit<Customer, 'id' | 'joinDate' | 'balance'>[] = [
    { name: "মিঠু এন্টারপ্রাইজ", phone: "01811553399", address: "Feni, BD", package: "Home 20 Mbps", status: "Active" },
    { name: "Tipu Traders", phone: "01716652212", address: "Noakhali, BD", package: "Business 50 Mbps", status: "Active" },
    { name: "Global Net", phone: "01998877665", address: "Dhaka, BD", package: "Home 20 Mbps", status: "Suspended" },
];

export default function CustomersPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const customersRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/customers`) : null, [firestore, user]);
  const { data: customers, isLoading } = useCollection<Customer>(customersRef);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', address: '', package: 'Home 20 Mbps', status: 'Active' },
  });

  const handleSeedData = async () => {
    if (!customersRef) return;
    try {
      const batch = writeBatch(firestore);
      seedCustomers.forEach(cust => {
        const docRef = doc(customersRef);
        batch.set(docRef, { ...cust, joinDate: new Date().toISOString(), balance: 0 });
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo customers have been added.' });
    } catch (error) {
        console.error("Error seeding customers:", error);
        const contextualError = new FirestorePermissionError({ path: customersRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo customers.' });
    }
  };

  const onSubmit = (values: CustomerFormData) => {
    if (!customersRef) return;

    addDoc(customersRef, { ...values, joinDate: new Date().toISOString(), balance: 0 }).then(() => {
        toast({ title: 'Success', description: 'Customer registered successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding customer:", error);
        const contextualError = new FirestorePermissionError({ path: customersRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not register customer.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ISP Customer Management</h1>
            <p className="text-muted-foreground">Register new customers, assign packages, and view their information.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Register New Customer</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New ISP Customer</DialogTitle>
                  <DialogDescription>Fill in the details for the new customer.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} placeholder="e.g., ABC Corporation" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} placeholder="e.g., 01..." /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="e.g., Dhaka, BD" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="package" render={({ field }) => (<FormItem><FormLabel>Package</FormLabel><FormControl><Input {...field} placeholder="e.g., Home 20 Mbps" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Suspended">Suspended</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                    <DialogFooter><Button type="submit">Save Customer</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpiData.map(kpi => {
                const Icon = kpi.icon
                return (
                    <Card key={kpi.title} className={kpi.className}>
                        <CardHeader>
                           <div className="flex items-center justify-between">
                             <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                             <Icon className="h-5 w-5 text-muted-foreground"/>
                           </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{kpi.value}</p>
                            <p className="text-xs text-muted-foreground">{kpi.description}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>A list of all registered ISP customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading customers...</TableCell></TableRow>}
                {customers?.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.package}</TableCell>
                    <TableCell>{customer.status}</TableCell>
                  </TableRow>
                ))}
                 {!isLoading && customers?.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No customers found. Add one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
