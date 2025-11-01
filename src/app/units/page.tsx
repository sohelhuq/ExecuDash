'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const unitFormSchema = z.object({
  name: z.string().min(1, 'Unit name is required'),
  location: z.string().min(1, 'Location is required'),
});

type BusinessUnit = z.infer<typeof unitFormSchema> & { id: string };

const seedUnits: Omit<BusinessUnit, 'id'>[] = [
    { name: 'Jamuna Fuel Station', location: 'Dhaka' },
    { name: 'Meghna LPG Plant', location: 'Chittagong' },
];

export default function UnitsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const form = useForm<z.infer<typeof unitFormSchema>>({
        resolver: zodResolver(unitFormSchema),
        defaultValues: { name: '', location: '' },
    });

    const unitsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/businessUnits`) : null, [firestore, user]);
    const { data: units, isLoading } = useCollection<Omit<BusinessUnit, 'id'>>(unitsRef);

    const handleSeedData = async () => {
        if (!unitsRef || !firestore || !user) return;
        try {
            const batch = writeBatch(firestore);
            seedUnits.forEach(unit => {
                const newDocRef = doc(unitsRef);
                batch.set(newDocRef, { ...unit, managerId: user.uid });
            });
            await batch.commit();
            toast({ title: "Success", description: "Demo business units have been added." });
        } catch (error) {
            console.error("Failed to seed units:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not add demo units." });
        }
    };
    
    const onSubmit = async (values: z.infer<typeof unitFormSchema>) => {
        if (!unitsRef || !user) return;
        try {
            await addDoc(unitsRef, { ...values, managerId: user.uid });
            toast({ title: "Success", description: "Business Unit created."});
            form.reset();
            setDialogOpen(false);
        } catch(error) {
            console.error("Failed to create unit:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not create unit." });
        }
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Business Units</h1>
                        <p className="text-muted-foreground">Select a business unit to view its master dashboard.</p>
                    </div>
                     <div className="flex gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4" /> Create Unit</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Create New Business Unit</DialogTitle></DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Unit Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Dhaka Fuel Station" /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g., Dhaka" /></FormControl><FormMessage /></FormItem>)} />
                                        <DialogFooter><Button type="submit">Create Unit</Button></DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                         <Button variant="outline" onClick={handleSeedData}>Seed Demo Units</Button>
                    </div>
                </div>

                {isLoading && <p>Loading units...</p>}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {units?.map(unit => (
                        <Link href={`/units/${unit.id}`} key={unit.id}>
                            <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                                <CardHeader className="flex-row items-center gap-4">
                                    <Building className="h-10 w-10 text-primary" />
                                    <div>
                                        <CardTitle>{unit.name}</CardTitle>
                                        <CardDescription>{unit.location}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="link" className="p-0">View Dashboard &rarr;</Button>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AppShell>
    );
}
