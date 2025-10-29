
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, updateDoc, increment } from 'firebase/firestore';
import React, { useState, useMemo } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

type Employee = { id: string; name: string };

type LeaveBalance = {
  id: string;
  employeeId: string;
  year: number;
  leaveType: 'vacation' | 'medical';
  allottedHours: number;
  monthlyUsage: { [key: string]: number };
};

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const leaveFormSchema = z.object({
    employeeId: z.string().min(1, "Please select an employee."),
    leaveType: z.enum(['vacation', 'medical']),
    month: z.string().min(1, "Please select a month."),
    hours: z.coerce.number().min(1, "Hours must be greater than 0."),
});

export default function AttendancePage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const employeesCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'employees') : null;
  }, [firestore]);
  const { data: employees, isLoading: isLoadingEmployees } = useCollection<Employee>(employeesCollection);

  const leaveBalancesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'leave_balances'), where('year', '==', currentYear));
  }, [firestore, currentYear]);
  const { data: leaveBalances, isLoading: isLoadingLeave } = useCollection<LeaveBalance>(leaveBalancesQuery);

  const form = useForm<z.infer<typeof leaveFormSchema>>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leaveType: 'vacation',
    }
  });
  
  const seedInitialLeaveBalances = async () => {
    if (!firestore || !employees || employees.length === 0) {
      toast({ variant: 'destructive', title: 'Prerequisites not met', description: 'Cannot seed leave balances without employees loaded.' });
      return;
    }
    setIsSeeding(true);

    try {
        const balancesCollectionRef = collection(firestore, 'leave_balances');
        const q = query(balancesCollectionRef, where('year', '==', currentYear));
        const existingDocs = await getDocs(q);
        if (!existingDocs.empty) {
            toast({ title: 'Already Seeded', description: `Leave balances for ${currentYear} already exist.`});
            return;
        }

        const batch = writeBatch(firestore);
        for (const employee of employees) {
            const vacationBalance: Omit<LeaveBalance, 'id'> = {
                employeeId: employee.id,
                year: currentYear,
                leaveType: 'vacation',
                allottedHours: 80,
                monthlyUsage: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
            };
            const medicalBalance: Omit<LeaveBalance, 'id'> = {
                employeeId: employee.id,
                year: currentYear,
                leaveType: 'medical',
                allottedHours: 80,
                monthlyUsage: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
            };
            batch.set(doc(collection(firestore, 'leave_balances')), vacationBalance);
            batch.set(doc(collection(firestore, 'leave_balances')), medicalBalance);
        }
        await batch.commit();
        toast({ title: 'Seeding Complete', description: `Initial leave balances for ${currentYear} have been created for ${employees.length} employees.`});

    } catch (error) {
        console.error('Error seeding leave balances:', error);
        toast({ variant: 'destructive', title: 'Seeding Failed', description: 'An error occurred while seeding leave balances.' });
    } finally {
        setIsSeeding(false);
    }
  };
  
  const combinedData = useMemo(() => {
    if (!employees || !leaveBalances) return [];
    
    return employees.map(emp => {
      const vacation = leaveBalances.find(lb => lb.employeeId === emp.id && lb.leaveType === 'vacation');
      const medical = leaveBalances.find(lb => lb.employeeId === emp.id && lb.leaveType === 'medical');
      return { employee: emp, vacation, medical };
    });

  }, [employees, leaveBalances]);

  async function onSubmit(values: z.infer<typeof leaveFormSchema>) {
    if (!firestore || !leaveBalances) return;

    const { employeeId, leaveType, month, hours } = values;

    const targetBalance = leaveBalances.find(lb => 
        lb.employeeId === employeeId && 
        lb.leaveType === leaveType &&
        lb.year === currentYear
    );

    if (!targetBalance) {
        toast({ variant: 'destructive', title: 'Balance record not found', description: 'Could not find a matching leave balance record to update.'});
        return;
    }

    const docRef = doc(firestore, 'leave_balances', targetBalance.id);
    const updatePayload = {
      [`monthlyUsage.${month}`]: increment(hours)
    };
    
    try {
        await updateDoc(docRef, updatePayload);
        toast({ title: 'Leave Recorded', description: `${hours} hours of ${leaveType} leave for ${month} have been recorded.`});
        form.reset();
        setIsDialogOpen(false);
    } catch (error) {
        console.error('Error updating leave:', error);
        toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not record the leave hours.'});
    }
  }
  
  const renderRow = (label: string, balanceData: LeaveBalance | undefined) => {
    const totalUsed = balanceData ? months.reduce((sum, m) => sum + (balanceData.monthlyUsage[m] || 0), 0) : 0;
    const totalAllotted = balanceData?.allottedHours || 0;
    const totalLeft = totalAllotted - totalUsed;
    
    return (
      <TableRow>
        <TableCell className="font-medium">{label}</TableCell>
        {months.map(m => <TableCell key={m}>{balanceData?.monthlyUsage[m] || 0}</TableCell>)}
        <TableCell className="font-bold">{totalUsed}</TableCell>
        <TableCell>{totalAllotted}</TableCell>
        <TableCell className="font-bold">{totalLeft}</TableCell>
      </TableRow>
    );
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Absence Tracking</h1>
            <p className="text-muted-foreground">Summary for {currentYear}</p>
          </div>
          <div className="flex items-center gap-4">
             <Select value={String(currentYear)} onValueChange={(val) => setCurrentYear(Number(val))}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {[2024, 2023, 2022].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={seedInitialLeaveBalances} disabled={isSeeding || isLoadingEmployees}>
              {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
              Seed Balances
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                if (!isOpen) form.reset();
                setIsDialogOpen(isOpen)
            }}>
                <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Record Leave</Button></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Employee Leave</DialogTitle>
                        <DialogDescription>Add new leave hours for an employee for a specific month.</DialogDescription>
                    </DialogHeader>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                            <FormField control={form.control} name="employeeId" render={({ field }) => (
                                <FormItem><FormLabel>Employee</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {employees?.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="leaveType" render={({ field }) => (
                                <FormItem><FormLabel>Leave Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select leave type" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="vacation">Vacation</SelectItem>
                                            <SelectItem value="medical">Medical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="month" render={({ field }) => (
                                <FormItem><FormLabel>Month</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {months.map(m => <SelectItem key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                <FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="hours" render={({ field }) => (
                                <FormItem><FormLabel>Hours Used</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                                <FormMessage /></FormItem>
                            )} />
                            <DialogFooter className="pt-4">
                                <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                <Button type="submit">Save Record</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        {(isLoadingEmployees || isLoadingLeave) && !combinedData.length ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ) : (
            <div className="space-y-4">
            {combinedData.map(({ employee, vacation, medical }) => (
                <Card key={employee.id}>
                    <CardHeader><CardTitle>{employee.name}</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{currentYear}</TableHead>
                                    {months.map(m => <TableHead key={m} className="uppercase">{m}</TableHead>)}
                                    <TableHead>Total Used</TableHead>
                                    <TableHead>Total Allotted</TableHead>
                                    <TableHead>Total Left</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {renderRow("Vacation hours used", vacation)}
                                {renderRow("Medical leave hours used", medical)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
            </div>
        )}
      </div>
    </AppShell>
  );
}
