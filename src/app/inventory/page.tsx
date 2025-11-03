'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database, Warehouse, AlertTriangle } from 'lucide-react';
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

const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().int().nonnegative('Quantity must be a non-negative integer'),
  warningLevel: z.coerce.number().int().nonnegative('Warning level must be a non-negative integer'),
});

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
type InventoryItem = InventoryItemFormData & { id: string };

const seedInventory: Omit<InventoryItem, 'id'>[] = [
    { name: "Router (MikroTik)", quantity: 50, warningLevel: 10 },
    { name: "ONT Device", quantity: 120, warningLevel: 25 },
    { name: "Fiber Optic Cable (Meter)", quantity: 5000, warningLevel: 1000 },
    { name: "Network Switch (8-port)", quantity: 30, warningLevel: 5 },
];

export default function InventoryPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const inventoryRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/inventory`) : null, [firestore, user]);
  const { data: inventoryItems, isLoading } = useCollection<InventoryItem>(inventoryRef);

  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: { name: '', quantity: 0, warningLevel: 0 },
  });

  const handleSeedData = async () => {
    if (!inventoryRef) return;
    try {
      const batch = writeBatch(firestore);
      seedInventory.forEach(item => {
        const docRef = doc(inventoryRef);
        batch.set(docRef, item);
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo inventory items have been added.' });
    } catch (error) {
        console.error("Error seeding inventory:", error);
        const contextualError = new FirestorePermissionError({ path: inventoryRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo inventory.' });
    }
  };

  const onSubmit = (values: InventoryItemFormData) => {
    if (!inventoryRef) return;

    addDoc(inventoryRef, values).then(() => {
        toast({ title: 'Success', description: 'Inventory item added successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding inventory item:", error);
        const contextualError = new FirestorePermissionError({ path: inventoryRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add inventory item.' });
    });
  };
  
  const inventoryStats = React.useMemo(() => {
    if (!inventoryItems) {
        return { totalItems: 0, itemsBelowWarning: 0 };
    }
    const totalItems = inventoryItems.length;
    const itemsBelowWarning = inventoryItems.filter(item => item.quantity < item.warningLevel).length;
    return { totalItems, itemsBelowWarning };
  }, [inventoryItems]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock & Inventory Management</h1>
            <p className="text-muted-foreground">Monitor and manage your physical assets like routers, ONTs, and cables.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Inventory Item</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>Fill in the details for the new stock item.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Item Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Router (MikroTik)" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Current Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="warningLevel" render={({ field }) => (<FormItem><FormLabel>Low Stock Warning Level</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter><Button type="submit">Save Item</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Unique Items</CardTitle>
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
                    <p className="text-xs text-muted-foreground">Different types of items in stock</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Items Below Warning Level</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{inventoryStats.itemsBelowWarning}</div>
                    <p className="text-xs text-muted-foreground">Items that need to be re-ordered</p>
                </CardContent>
            </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory List</CardTitle>
            <CardDescription>A list of all items in your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Warning Level</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading inventory...</TableCell></TableRow>}
                {inventoryItems?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity.toLocaleString()}</TableCell>
                    <TableCell>{item.warningLevel.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity < item.warningLevel ? (
                        <span className="flex items-center justify-end text-destructive font-medium">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && inventoryItems?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No inventory items found. Add one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
