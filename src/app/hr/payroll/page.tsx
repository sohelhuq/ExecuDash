
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '@/components/ui/table';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, getDocs, doc, query, where } from 'firebase/firestore';
import React, { useState, useMemo } from 'react';
import { Loader2, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


type Employee = {
  id: string;
  name: string;
  department: string;
  jobRole: string;
  salary: number;
};

type Payroll = {
    id: string;
    employeeId: string;
    period: string; // "YYYY-MM"
    grossSalary: number;
    deductions: number;
    netSalary: number;
    status: 'pending' | 'paid';
}

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

export default function PayrollPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

    const employeesCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'employees') : null;
    }, [firestore]);
    const { data: employees, isLoading: isLoadingEmployees } = useCollection<Employee>(employeesCollection);

    const payrollCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'payroll') : null;
    }, [firestore]);
    const { data: payrolls, isLoading: isLoadingPayrolls } = useCollection<Payroll>(payrollCollection);

    const employeeMap = useMemo(() => {
        if (!employees) return new Map();
        return new Map(employees.map(e => [e.id, e.name]));
    }, [employees]);

    const handleRunPayroll = async () => {
        if (!firestore || !employees || employees.length === 0) {
            toast({ variant: 'destructive', title: 'Prerequisites not met', description: 'Cannot run payroll without employee data.' });
            return;
        }
        setIsRunning(true);
        const period = `${selectedYear}-${selectedMonth}`;

        try {
            const payrollsRef = collection(firestore, 'payroll');
            const q = query(payrollsRef, where('period', '==', period));
            const existingDocs = await getDocs(q);
            if (!existingDocs.empty) {
                toast({ title: 'Payroll Already Run', description: `Payroll for ${period} has already been processed.` });
                setIsRunning(false);
                setIsDialogOpen(false);
                return;
            }

            const batch = writeBatch(firestore);
            let processedCount = 0;
            for (const employee of employees) {
                // Ensure employee has a valid ID before creating payroll doc
                if (!employee.id) {
                    console.warn('Skipping employee without ID:', employee);
                    continue;
                }
                const payrollDoc: Omit<Payroll, 'id'> = {
                    employeeId: employee.id,
                    period: period,
                    grossSalary: employee.salary,
                    deductions: 0, // Placeholder for future deduction logic
                    netSalary: employee.salary, // Gross - deductions
                    status: 'pending',
                };
                const newDocRef = doc(collection(firestore, 'payroll'));
                batch.set(newDocRef, payrollDoc);
                processedCount++;
            }
            await batch.commit();
            toast({ title: 'Payroll Run Successfully', description: `${processedCount} payroll records created for ${period}.` });
        } catch (error) {
            console.error('Error running payroll:', error);
            toast({ variant: 'destructive', title: 'Payroll Failed', description: 'An error occurred while processing payroll.' });
        } finally {
            setIsRunning(false);
            setIsDialogOpen(false);
        }
    };
    
    const totalNetSalary = useMemo(() => {
      return payrolls?.reduce((sum, p) => sum + p.netSalary, 0) || 0;
    }, [payrolls]);

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payroll Processing</h1>
                        <p className="text-muted-foreground">Manage and process employee salaries.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><Rocket className="mr-2 h-4 w-4" /> Run Payroll</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Run Payroll for a New Period</DialogTitle>
                                <DialogDescription>Select the month and year to generate payroll records for all employees.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <Label htmlFor="year">Year</Label>
                                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                                            <SelectTrigger id="year"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="month">Month</Label>
                                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                            <SelectTrigger id="month"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild><Button variant="ghost" disabled={isRunning}>Cancel</Button></DialogClose>
                                <Button onClick={handleRunPayroll} disabled={isRunning}>
                                    {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Confirm & Run
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader><CardTitle>Payroll History</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Period</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Gross Salary</TableHead>
                                    <TableHead className="text-right">Deductions</TableHead>
                                    <TableHead className="text-right">Net Salary</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingPayrolls || isLoadingEmployees ? (
                                    <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                                ) : (
                                    payrolls?.map((payroll) => (
                                        <TableRow key={payroll.id}>
                                            <TableCell className="font-medium">{employeeMap.get(payroll.employeeId) || payroll.employeeId}</TableCell>
                                            <TableCell>{payroll.period}</TableCell>
                                            <TableCell><Badge variant={payroll.status === 'paid' ? 'default' : 'secondary'}>{payroll.status}</Badge></TableCell>
                                            <TableCell className="text-right font-mono">{formatCurrency(payroll.grossSalary)}</TableCell>
                                            <TableCell className="text-right font-mono">{formatCurrency(payroll.deductions)}</TableCell>
                                            <TableCell className="text-right font-mono">{formatCurrency(payroll.netSalary)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="font-bold text-lg">
                                    <TableCell colSpan={5}>Total Net Salary (All Records)</TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(totalNetSalary)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
