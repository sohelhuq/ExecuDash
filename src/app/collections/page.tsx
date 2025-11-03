'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc, Timestamp, query, where } from 'firebase/firestore';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

const accountSchema = z.object({
  unit: z.string().min(1, 'Business unit is required'),
  customer: z.string().min(1, 'Customer name is required'),
  invoice: z.string().min(1, 'Invoice number is required'),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  amountDue: z.coerce.number().min(0, 'Amount must be a positive number'),
  status: z.enum(['Pending', 'Overdue', 'Paid']),
});

type AssignedAccount = z.infer<typeof accountSchema> & { id: string };

const seedData: Omit<AssignedAccount, 'id' | 'dueDate'>[] = [
  { unit: 'Fuel', customer: 'New Haq Enterprise', invoice: 'INV-001', amountDue: 25000, status: 'Overdue' },
  { unit: 'Fuel', customer: 'Sohag Vai', invoice: 'INV-002', amountDue: 12000, status: 'Pending' },
  { unit: 'Bricks', customer: 'ABC Builders', invoice: 'INV-003', amountDue: 3500, status: 'Overdue' },
  { unit: 'Pharmacy', customer: 'PharmaCore', invoice: 'INV-004', amountDue: 8600, status: 'Overdue' },
  { unit: 'Bricks', customer: 'Dhaka Construction', invoice: 'INV-005', amountDue: 5100, status: 'Pending' },
  { unit: 'Fuel', customer: 'Jamuna Transport', invoice: 'INV-006', amountDue: 18000, status: 'Paid' },
];


export default function CollectionsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const [activeTab, setActiveTab] = React.useState('All Units');
    
    const accountsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/assignedAccounts`) : null, [firestore, user]);

    const filteredQuery = useMemoFirebase(() => {
        if (!accountsRef) return null;
        if (activeTab === 'All Units') return accountsRef;
        return query(accountsRef, where('unit', '==', activeTab));
    }, [accountsRef, activeTab]);

    const { data: accounts, isLoading: accountsLoading } = useCollection<AssignedAccount>(filteredQuery);
    
    const { data: allAccounts } = useCollection<AssignedAccount>(accountsRef);

    React.useEffect(() => {
        if (user && firestore && allAccounts && allAccounts.length === 0) {
            const batch = writeBatch(firestore);
            seedData.forEach(acc => {
                const newDocRef = doc(collection(firestore, `users/${user.uid}/assignedAccounts`));
                batch.set(newDocRef, { ...acc, dueDate: Timestamp.fromDate(new Date()) });
            });
            batch.commit().catch(e => console.error("Failed to seed accounts", e));
        }
    }, [user, firestore, allAccounts]);

    const calculateOverdue = (unit: string) => {
        if (!allAccounts) return 0;
        return allAccounts
            .filter(acc => acc.unit === unit && acc.status === 'Overdue')
            .reduce((sum, acc) => sum + acc.amountDue, 0);
    }

    const fuelOverdue = calculateOverdue('Fuel');
    const bricksOverdue = calculateOverdue('Bricks');
    const pharmacyOverdue = calculateOverdue('Pharmacy');


    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Previous Dues Collection</h1>
                    <Button onClick={() => toast({title: "Coming Soon!"})}>Generate Report</Button>
                </div>
                <p className="text-muted-foreground">Centralized Performance Hub</p>


                <Card>
                    <CardContent className="p-0">
                         <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
                            <TabsList>
                                <TabsTrigger value="All Units">All Units</TabsTrigger>
                                <TabsTrigger value="Bricks">Bricks</TabsTrigger>
                                <TabsTrigger value="Pharmacy">Pharmacy</TabsTrigger>
                                <TabsTrigger value="Fuel">Fuel</TabsTrigger>
                            </TabsList>
                        </Tabs>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Amount Due</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accountsLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>}
                                {accounts?.map(acc => (
                                    <TableRow key={acc.id}>
                                        <TableCell>{acc.unit}</TableCell>
                                        <TableCell className="font-medium">{acc.customer}</TableCell>
                                        <TableCell>{acc.invoice}</TableCell>
                                        <TableCell>{format((acc.dueDate as any).toDate(), "PPP")}</TableCell>
                                        <TableCell>{formatCurrency(acc.amountDue)}</TableCell>
                                        <TableCell>
                                             <Badge variant={acc.status === 'Paid' ? 'default' : 'secondary'} className={cn(
                                                acc.status === 'Paid' && 'bg-green-100 text-green-800',
                                                acc.status === 'Pending' && 'bg-yellow-100 text-yellow-800',
                                                acc.status === 'Overdue' && 'bg-red-100 text-red-800',
                                             )}>{acc.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                     <Card className="bg-card border-primary">
                        <CardHeader>
                            <CardTitle className="text-base">Fuel Unit: Total Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(fuelOverdue)}</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-card border-primary">
                        <CardHeader>
                             <CardTitle className="text-base">Bricks Unit: Total Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(bricksOverdue)}</p>
                        </CardContent>
                    </Card>
                     <Card className="bg-card border-primary">
                        <CardHeader>
                           <CardTitle className="text-base">Pharmacy Unit: Total Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(pharmacyOverdue)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
