
'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, writeBatch, doc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Database, Package, DollarSign, MoreHorizontal } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type PharmacyProduct = { id: string; name: string; category: string; stock: number; price: number; };

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  price: z.coerce.number().positive('Price must be a positive number'),
});

type ProductFormData = z.infer<typeof productSchema>;

const seedProducts: Omit<PharmacyProduct, 'id'>[] = [
  { name: "Napa Extend", category: "Painkiller", stock: 500, price: 2.5 },
  { name: "Fexo 120", category: "Antihistamine", stock: 300, price: 8 },
  { name: "Omeprazole 20mg", category: "Antacid", stock: 1000, price: 5 },
  { name: "Seclo 20", category: "Antacid", stock: 800, price: 6 },
  { name: "Tufnil 200mg", category: "Painkiller", stock: 250, price: 7.5 },
];

export default function PharmacyProductsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const productsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/pharmacy/products`) : null, [firestore, user]);
    const { data: products, isLoading } = useCollection<PharmacyProduct>(productsRef);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: { name: '', category: '', stock: 0, price: 0 },
    });

    const handleSeedData = async () => {
        if (!productsRef) return;
        try {
            const batch = writeBatch(firestore);
            seedProducts.forEach(prod => {
                const docRef = doc(productsRef);
                batch.set(docRef, prod);
            });
            await batch.commit();
            toast({ title: 'Success', description: 'Demo products have been added.' });
        } catch (error) {
            console.error("Error seeding products:", error);
            const contextualError = new FirestorePermissionError({
              path: productsRef.path,
              operation: 'create',
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo products.' });
        }
    };

    const onSubmit = async (values: ProductFormData) => {
        if (!productsRef) return;
        
        addDoc(productsRef, values).then(() => {
          toast({ title: 'Success', description: 'Product added successfully.' });
          form.reset();
          setIsDialogOpen(false);
        }).catch(error => {
            console.error("Error adding product:", error);
            const contextualError = new FirestorePermissionError({
              path: productsRef.path,
              operation: 'create',
              requestResourceData: values,
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add product.' });
        });
    };

    const productStats = React.useMemo(() => {
        if (!products) {
            return { totalProducts: 0, totalStockValue: 0 };
        }
        const totalProducts = products.length;
        const totalStockValue = products.reduce((sum, prod) => sum + (prod.stock * prod.price), 0);
        return { totalProducts, totalStockValue };
    }, [products]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
                <p className="text-muted-foreground">Manage your pharmacy's product inventory.</p>
            </div>
            <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add Product</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>Fill in the details for the new product.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Napa 500mg" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} placeholder="e.g., Painkiller" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="stock" render={({ field }) => (<FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (per unit)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                    <Button type="submit">Save Product</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Demo Data</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Products</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{productStats.totalProducts}</div><p className="text-xs text-muted-foreground">unique products in inventory</p></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Stock Value</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{formatCurrency(productStats.totalStockValue)}</div><p className="text-xs text-muted-foreground">estimated value of all stock</p></CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
            <CardDescription>The central directory of all products in your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading products...</TableCell></TableRow>}
                    {products?.map(prod => (
                        <TableRow key={prod.id}>
                            <TableCell className="font-medium">{prod.name}</TableCell>
                            <TableCell>{prod.category}</TableCell>
                            <TableCell className="text-right">{prod.stock.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(prod.price)}</TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && products?.length === 0 && (
                        <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No products found. Add one to get started.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
    
