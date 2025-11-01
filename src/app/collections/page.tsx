'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Loader2, PlusCircle, Upload, TrendingDown, Users, FileStack, Database } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { initialAssignedAccounts, initialResponsibilities } from '@/lib/collections-data';

const officer = {
  id: 'collections-officer',
  name: 'Ahmed Rahman',
  avatarId: 'officer-avatar',
};

type Officer = {
  id: string;
  name: string;
  avatarId: string;
}

type AssignedAccount = {
  unit: string;
  customer: string;
  invoice: string;
  dueDate: string;
  amountDue: number;
  status: 'Pending' | 'Overdue' | 'Paid';
};

type Responsibility = {
  task: string;
  completed: boolean;
};

const accountFormSchema = z.object({
  unit: z.string().min(1, 'Business unit is required.'),
  customer: z.string().min(1, 'Customer name is required.'),
  invoice: z.string().min(1, 'Invoice ID is required.'),
  dueDate: z.date({ required_error: 'A due date is required.' }),
  amountDue: z.coerce.number().min(0, 'Amount must be a positive number.'),
  status: z.enum(['Pending', 'Overdue', 'Paid']),
});

export default function CollectionsPage() {
  const [assignOfficerOpen, setAssignOfficerOpen] = React.useState(false);
  const [newAccountOpen, setNewAccountOpen] = React.useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = React.useState(false);
  const [newOfficerName, setNewOfficerName] = React.useState('');
  const [isSeeding, setIsSeeding] = React.useState(false);
  const { toast } = useToast();
  
  const firestore = useFirestore();

  const officerDocRef = useMemoFirebase(() => {
    return firestore ? doc(firestore, 'officers', officer.id) : null;
  }, [firestore]);
  const { data: officerState, isLoading: isLoadingOfficer } = useDoc<Officer>(officerDocRef);
  
  const accountsCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'assigned_accounts') : null;
  }, [firestore]);
  const { data: assignedAccounts, isLoading: isLoadingAccounts } = useCollection<AssignedAccount>(accountsCollection);
  
  const responsibilitiesCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'responsibilities') : null;
  }, [firestore]);
  const { data: responsibilities, isLoading: isLoadingResponsibilities } = useCollection<Responsibility>(responsibilitiesCollection);

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      unit: '',
      customer: '',
      invoice: '',
      amountDue: 0,
      status: 'Pending',
    },
  });
  
  const officerAvatar = PlaceHolderImages.find((p) => p.id === officer.avatarId);
  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;
  
  const kpiData = React.useMemo(() => {
    if (!assignedAccounts) {
      return { totalAssigned: 0, totalOverdue: 0, overdueAccounts: 0 };
    }
    const totalAssigned = assignedAccounts.reduce((sum, acc) => sum + acc.amountDue, 0);
    const overdueAccountsList = assignedAccounts.filter(acc => acc.status === 'Overdue');
    const totalOverdue = overdueAccountsList.reduce((sum, acc) => sum + acc.amountDue, 0);
    const overdueAccounts = overdueAccountsList.length;

    return { totalAssigned, totalOverdue, overdueAccounts };
  }, [assignedAccounts]);

  const seedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
        const batch = writeBatch(firestore);
        
        // Seed officer
        const officerRef = doc(firestore, 'officers', officer.id);
        const officerSnap = await getDocs(query(collection(firestore, 'officers'), where('id', '==', officer.id)));
        if(officerSnap.empty) batch.set(officerRef, officer);

        // Seed responsibilities
        const respCollectionRef = collection(firestore, 'responsibilities');
        const respSnap = await getDocs(respCollectionRef);
        if (respSnap.empty) {
            initialResponsibilities.forEach(item => {
                const docRef = doc(respCollectionRef);
                batch.set(docRef, item);
            });
        }

        // Seed accounts
        const acctsCollectionRef = collection(firestore, 'assigned_accounts');
        const acctsSnap = await getDocs(acctsCollectionRef);
        if (acctsSnap.empty) {
            initialAssignedAccounts.forEach(item => {
                const docRef = doc(acctsCollectionRef);
                batch.set(docRef, item);
            });
        }
        
        await batch.commit();
        toast({ title: 'Seeding Complete', description: `Initial collections data has been added.` });
    } catch (error) {
        console.error('Error seeding data:', error);
        toast({ variant: 'destructive', title: 'Seeding Failed', description: 'Could not seed collections data.' });
    } finally {
        setIsSeeding(false);
    }
};

  const handleAssignOfficer = () => {
    if (newOfficerName.trim() && officerDocRef) {
      setDocumentNonBlocking(officerDocRef, { name: newOfficerName }, { merge: true });
      setNewOfficerName('');
      setAssignOfficerOpen(false);
      toast({
        title: "Officer Assigned",
        description: `${newOfficerName} has been assigned as the new collections officer.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Please enter a name for the officer.",
      });
    }
  };

  function onAddAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    if (!accountsCollection) return;

    const newAccountData = {
      ...values,
      dueDate: format(values.dueDate, 'yyyy-MM-dd'),
    };
    
    addDocumentNonBlocking(accountsCollection, newAccountData);
    
    toast({
      title: 'Account Added',
      description: `Invoice ${values.invoice} for ${values.customer} has been added.`,
    });
    accountForm.reset();
    setNewAccountOpen(false);
  }

  const handleBulkUpload = () => {
    toast({
      title: 'Upload Started',
      description: 'Your file is being processed. This is a mock action for now.',
    });
    setBulkUploadOpen(false);
  };


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Due Collection Monitoring & Assignment</h1>
            <p className="text-muted-foreground">Centralized Performance Hub</p>
          </div>
           <div className="flex gap-2">
             <Button variant="outline" onClick={seedData} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Seed Data
            </Button>
             <Dialog open={assignOfficerOpen} onOpenChange={setAssignOfficerOpen}>
              <DialogTrigger asChild>
                  <Button variant="outline">Assign Officer</Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Assign New Collections Officer</DialogTitle>
                      <DialogDescription>Enter the name of the new officer to assign them to this portfolio.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="officer-name" className="text-right">Name</Label>
                          <Input 
                              id="officer-name" 
                              value={newOfficerName}
                              onChange={(e) => setNewOfficerName(e.target.value)}
                              className="col-span-3"
                              placeholder="e.g. Jane Doe"
                           />
                      </div>
                  </div>
                  <DialogFooter>
                      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                      <Button onClick={handleAssignOfficer}>Assign</Button>
                  </DialogFooter>
              </DialogContent>
             </Dialog>
              <Dialog open={newAccountOpen} onOpenChange={setNewAccountOpen}>
                <DialogTrigger asChild>
                  <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Add New Assigned Account</DialogTitle>
                    <DialogDescription>Enter the details for the new account below.</DialogDescription>
                  </DialogHeader>
                  <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(onAddAccountSubmit)} className="grid gap-4 py-4">
                      <FormField control={accountForm.control} name="unit" render={({ field }) => (
                        <FormItem><FormLabel>Business Unit</FormLabel><FormControl><Input placeholder="e.g., Huq Bricks" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={accountForm.control} name="customer" render={({ field }) => (
                        <FormItem><FormLabel>Customer</FormLabel><FormControl><Input placeholder="e.g., ABC Construction" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={accountForm.control} name="invoice" render={({ field }) => (
                        <FormItem><FormLabel>Invoice ID</FormLabel><FormControl><Input placeholder="e.g., INV-2024-001" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                       <FormField control={accountForm.control} name="dueDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel>
                          <Popover><PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent></Popover>
                        <FormMessage /></FormItem>
                      )} />
                      <FormField control={accountForm.control} name="amountDue" render={({ field }) => (
                        <FormItem><FormLabel>Amount Due</FormLabel><FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={accountForm.control} name="status" render={({ field }) => (
                        <FormItem><FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        <FormMessage /></FormItem>
                      )} />
                      <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit">Add Account</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-card/80 border-border/60">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                {isLoadingOfficer ? <Loader2 className="w-20 h-20 mb-4 animate-spin" /> : (
                  <>
                    {officerAvatar && <Avatar className="w-20 h-20 mb-4 border-2 border-primary">
                        <AvatarImage src={officerAvatar.imageUrl} alt={officerState?.name || ''} data-ai-hint={officerAvatar.imageHint} />
                        <AvatarFallback>{officerState?.name.charAt(0)}</AvatarFallback>
                    </Avatar>}
                    <p className="text-sm text-muted-foreground">Responsible Officer:</p>
                    <p className="text-lg font-semibold">{officerState?.name}</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assigned Dues</CardTitle>
                        <FileStack className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(kpiData.totalAssigned)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Overdue Dues</CardTitle>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{formatCurrency(kpiData.totalOverdue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Accounts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpiData.overdueAccounts}</div>
                    </CardContent>
                </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-card/80 border-border/60 h-full">
              <CardHeader>
                <CardTitle>{officerState?.name || 'Officer'} - Job Responsibilities & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingResponsibilities ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                <ul className="space-y-4">
                  {responsibilities?.map((item, index) => (
                     <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                       <div className="flex items-center gap-4">
                         <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground' }`}>{index + 1}</div>
                         <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>{item.task}</span>
                       </div>
                       {item.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground/50" />}
                     </li>
                  ))}
                </ul>
                )}
                <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">70% of Focus Collected</p>
                        <p className="text-sm font-medium text-amber-400">Pending</p>
                    </div>
                    <Progress value={70} className="h-2 [&>div]:bg-primary" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Dec-23</span>
                        <span>Jan-24</span>
                        <span>Feb-29</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-card/80 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assigned Accounts</CardTitle>
                <div className="flex gap-2">
                    <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Bulk Upload</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bulk Upload Accounts</DialogTitle>
                                <DialogDescription>Upload a CSV file with account information.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Input type="file" accept=".csv" />
                                <p className="text-xs text-muted-foreground mt-2">Note: This is a placeholder. File processing is not implemented.</p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                                <Button onClick={handleBulkUpload}>Upload File</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount Due</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingAccounts ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        ) : (
                        assignedAccounts?.map((account, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{account.unit}</TableCell>
                            <TableCell>{account.customer}</TableCell>
                            <TableCell>{account.invoice}</TableCell>
                            <TableCell>{account.dueDate}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(account.amountDue)}</TableCell>
                            <TableCell>
                                <Badge variant={account.status === 'Overdue' ? 'destructive' : 'secondary'} className={account.status === 'Pending' ? 'bg-amber-100 text-amber-800' : account.status === 'Paid' ? 'bg-green-100 text-green-800' : ''}>
                                    {account.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

    