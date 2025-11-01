'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, MoreVertical, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

// Zod schema for form validation
const accountFormSchema = z.object({
  unit: z.string().min(1, 'Business unit is required'),
  customer: z.string().min(1, 'Customer name is required'),
  invoice: z.string().min(1, 'Invoice number is required'),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  amountDue: z.coerce.number().min(0, 'Amount must be a positive number'),
  status: z.enum(['Pending', 'Overdue', 'Paid']),
});

type AssignedAccount = z.infer<typeof accountFormSchema> & { id: string; officer?: string };
type JobResponsibility = { id: string; text: string; completed: boolean };

const initialResponsibilities: Omit<JobResponsibility, 'id'>[] = [
    { text: 'Review all newly assigned accounts within 24 hours.', completed: false },
    { text: 'Make initial contact with all "Pending" accounts.', completed: true },
    { text: 'Send first reminder for "Overdue" accounts.', completed: false },
    { text: 'Follow up on payment promises.', completed: false },
    { text: 'Escalate accounts overdue by >30 days to management.', completed: false },
];

export default function CollectionsPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    
    const [isAccountDialogOpen, setAccountDialogOpen] = React.useState(false);
    const [isBulkUploadOpen, setBulkUploadOpen] = React.useState(false);
    const [collectionsOfficer, setCollectionsOfficer] = React.useState('Mr. Rahim');

    const accountsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/assignedAccounts`) : null, [firestore, user]);
    const { data: accounts, isLoading: accountsLoading } = useCollection<Omit<AssignedAccount, 'id'>>(accountsRef);
    
    const responsibilitiesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/jobResponsibilities`) : null, [firestore, user]);
    const { data: responsibilities, isLoading: responsibilitiesLoading } = useCollection<Omit<JobResponsibility, 'id'>>(responsibilitiesRef);

    const accountForm = useForm<z.infer<typeof accountFormSchema>>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: { status: 'Pending', amountDue: 0 }
    });

    React.useEffect(() => {
        if (user && firestore && responsibilities && responsibilities.length === 0) {
            const batch = writeBatch(firestore);
            initialResponsibilities.forEach(res => {
                const newDocRef = doc(collection(firestore, `users/${user.uid}/jobResponsibilities`));
                batch.set(newDocRef, res);
            });
            batch.commit().catch(e => console.error("Failed to seed responsibilities", e));
        }
    }, [user, firestore, responsibilities]);

    const handleAddAccount = async (values: z.infer<typeof accountFormSchema>) => {
        if (!accountsRef) return;
        try {
            await addDoc(accountsRef, {
                ...values,
                dueDate: Timestamp.fromDate(values.dueDate),
                officer: collectionsOfficer,
            });
            toast({ title: "Success", description: "Account assigned successfully." });
            accountForm.reset();
            setAccountDialogOpen(false);
        } catch (error) {
            console.error("Failed to add account:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not assign account." });
        }
    };
    
    const handleToggleResponsibility = async (item: JobResponsibility) => {
        if(!user || !firestore) return;
        try {
            const docRef = doc(firestore, `users/${user.uid}/jobResponsibilities`, item.id);
            await updateDoc(docRef, { completed: !item.completed });
        } catch (error) {
             toast({ variant: 'destructive', title: "Error", description: "Could not update task." });
        }
    }

    const { totalDue, totalOverdue, overdueCount } = React.useMemo(() => {
        if (!accounts) return { totalDue: 0, totalOverdue: 0, overdueCount: 0 };
        return accounts.reduce((acc, account) => {
            if(account.status !== 'Paid'){
                acc.totalDue += account.amountDue;
                if (account.status === 'Overdue' || (account.dueDate as any).toDate() < new Date()) {
                    acc.totalOverdue += account.amountDue;
                    acc.overdueCount += 1;
                }
            }
            return acc;
        }, { totalDue: 0, totalOverdue: 0, overdueCount: 0 });
    }, [accounts]);
    
    const completionPercentage = React.useMemo(() => {
        if(!responsibilities || responsibilities.length === 0) return 0;
        const completed = responsibilities.filter(r => r.completed).length;
        return Math.round((completed / responsibilities.length) * 100);
    }, [responsibilities]);

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Due Collections Hub</h1>
                    <p className="text-muted-foreground">Manage assigned accounts and track collection performance.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <CardTitle className="text-sm font-medium">Responsible Officer</CardTitle>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://avatar.vercel.sh/${collectionsOfficer}.png`} />
                                <AvatarFallback>{collectionsOfficer.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{collectionsOfficer}</div>
                            <Button variant="link" className="p-0 h-auto text-xs" onClick={() => toast({title: "Coming Soon!"})}>Change Officer</Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Assigned Due</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{formatCurrency(totalDue)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-600">Total Overdue Due</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-red-600">{formatCurrency(totalOverdue)}</div></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{overdueCount}</div></CardContent>
                    </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <div>
                                <CardTitle>Assigned Accounts</CardTitle>
                                <CardDescription>All accounts currently assigned for collection.</CardDescription>
                            </div>
                             <div className="flex gap-2">
                                <Dialog open={isAccountDialogOpen} onOpenChange={setAccountDialogOpen}>
                                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4"/>Assign Account</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Assign New Account</DialogTitle></DialogHeader>
                                        <Form {...accountForm}>
                                            <form onSubmit={accountForm.handleSubmit(handleAddAccount)} className="space-y-4">
                                                <FormField control={accountForm.control} name="unit" render={({ field }) => (<FormItem><FormLabel>Business Unit</FormLabel><FormControl><Input {...field} placeholder="e.g., Retail" /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={accountForm.control} name="customer" render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input {...field} placeholder="e.g., ABC Corp" /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={accountForm.control} name="invoice" render={({ field }) => (<FormItem><FormLabel>Invoice #</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={accountForm.control} name="dueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)}/>
                                                <FormField control={accountForm.control} name="amountDue" render={({ field }) => (<FormItem><FormLabel>Amount Due</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={accountForm.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Overdue">Overdue</SelectItem><SelectItem value="Paid">Paid</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                                <DialogFooter><Button type="submit">Assign Account</Button></DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                                <Dialog open={isBulkUploadOpen} onOpenChange={setBulkUploadOpen}>
                                    <DialogTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4"/>Bulk Upload</Button></DialogTrigger>
                                     <DialogContent>
                                        <DialogHeader><DialogTitle>Bulk Upload Accounts</DialogTitle><DialogDescription>Select a CSV file with accounts to assign.</DialogDescription></DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input type="file" accept=".csv" />
                                            <p className="text-sm text-muted-foreground">Make sure your CSV has columns: unit, customer, invoice, dueDate, amountDue, status</p>
                                        </div>
                                        <DialogFooter><Button onClick={() => {toast({title: "Coming Soon!"}); setBulkUploadOpen(false)}}>Upload & Assign</Button></DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Unit</TableHead><TableHead>Customer</TableHead><TableHead>Due Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {accountsLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                                    {accounts?.map(acc => (
                                        <TableRow key={acc.id}>
                                            <TableCell>{acc.unit}</TableCell>
                                            <TableCell className="font-medium">{acc.customer}<br/><span className="text-xs text-muted-foreground">{acc.invoice}</span></TableCell>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Responsibility Checklist</CardTitle>
                            <CardDescription>Key tasks for the collections officer.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium">Completion</span>
                                    <span className="font-bold">{completionPercentage}%</span>
                                </div>
                                <Progress value={completionPercentage}/>
                            </div>
                            <div className="space-y-3">
                                {responsibilitiesLoading && <p>Loading tasks...</p>}
                                {responsibilities?.map(item => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <Checkbox id={item.id} checked={item.completed} onCheckedChange={() => handleToggleResponsibility(item)} />
                                        <Label htmlFor={item.id} className={cn("text-sm", item.completed && "line-through text-muted-foreground")}>{item.text}</Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    );
}
    