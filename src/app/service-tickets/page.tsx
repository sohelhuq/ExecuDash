'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, writeBatch, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const ticketSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  serviceId: z.string().min(1, 'Service is required'),
  status: z.enum(['Open', 'In Progress', 'Closed', 'Cancelled']),
});

type TicketFormData = z.infer<typeof ticketSchema>;
type ServiceTicket = {
    id: string;
    customerId: string;
    customerName?: string; 
    serviceId: string;
    serviceDescription?: string;
    status: 'Open' | 'In Progress' | 'Closed' | 'Cancelled';
    createdAt: Timestamp;
    closedAt?: Timestamp;
};

const seedTickets: Omit<ServiceTicket, 'id' | 'createdAt'>[] = [
    { customerId: "cust_1", customerName: "মিঠু এন্টারপ্রাইজ", serviceId: "svc_1", serviceDescription: "Home 20 Mbps", status: "In Progress" },
    { customerId: "cust_2", customerName: "Tipu Traders", serviceId: "svc_2", serviceDescription: "Business 50 Mbps", status: "Open" },
    { customerId: "cust_3", customerName: "Global Net", serviceId: "svc_1", serviceDescription: "Home 20 Mbps", status: "Closed", closedAt: Timestamp.now() },
];

export default function ServiceTicketsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const ticketsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/serviceTickets`) : null, [firestore, user]);
  const { data: tickets, isLoading } = useCollection<ServiceTicket>(ticketsRef);

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { customerId: '', serviceId: '', status: 'Open' },
  });

  const handleSeedData = async () => {
    if (!ticketsRef) return;
    try {
      const batch = writeBatch(firestore);
      seedTickets.forEach(ticket => {
        const docRef = doc(ticketsRef);
        batch.set(docRef, {...ticket, createdAt: serverTimestamp() });
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo service tickets have been added.' });
    } catch (error) {
        console.error("Error seeding tickets:", error);
        const contextualError = new FirestorePermissionError({ path: ticketsRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo tickets.' });
    }
  };

  const onSubmit = (values: TicketFormData) => {
    if (!ticketsRef) return;

    addDoc(ticketsRef, { ...values, createdAt: serverTimestamp() }).then(() => {
        toast({ title: 'Success', description: 'Service ticket created successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding ticket:", error);
        const contextualError = new FirestorePermissionError({ path: ticketsRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not create ticket.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Tickets</h1>
            <p className="text-muted-foreground">Track and manage customer service requests.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Ticket</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Service Ticket</DialogTitle>
                  <DialogDescription>Fill in the details for the new service request.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="customerId" render={({ field }) => (<FormItem><FormLabel>Customer</FormLabel><FormControl><Input {...field} placeholder="Enter Customer Name or ID" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="serviceId" render={({ field }) => (<FormItem><FormLabel>Service/Package</FormLabel><FormControl><Input {...field} placeholder="Enter Service or Package" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Open">Open</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Closed">Closed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                    <DialogFooter><Button type="submit">Save Ticket</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ticket Queue</CardTitle>
            <CardDescription>A list of all customer service tickets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading tickets...</TableCell></TableRow>}
                {tickets?.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.customerName || ticket.customerId}</TableCell>
                    <TableCell>{ticket.serviceDescription || ticket.serviceId}</TableCell>
                    <TableCell>{ticket.createdAt ? format(ticket.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell>
                      <Badge className={cn({
                          'bg-blue-100 text-blue-800': ticket.status === 'Open',
                          'bg-yellow-100 text-yellow-800': ticket.status === 'In Progress',
                          'bg-green-100 text-green-800': ticket.status === 'Closed',
                          'bg-gray-100 text-gray-800': ticket.status === 'Cancelled',
                      })}>{ticket.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && tickets?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No tickets found. Create one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
