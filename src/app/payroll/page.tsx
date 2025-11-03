
'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, query, where, getDocs, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Banknote, Users, CheckCircle, Hourglass } from 'lucide-react';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type Employee = { id: string; name: string; department: string; jobRole: string; salary: number; };
type Payroll = { id: string; employeeId: string; employeeName: string; period: string; grossSalary: number; deductions: number; netSalary: number; status: 'pending' | 'paid'; createdAt: Timestamp; };

const seedEmployees: Omit<Employee, 'id'>[] = [
  { name: "Jahirul Haque", department: "Accounts", jobRole: "Manager", salary: 30000 },
  { name: "Rahim Uddin", department: "Sales", jobRole: "Sales Officer", salary: 25000 },
  { name: "Selina Begum", department: "HR", jobRole: "HR Executive", salary: 22000 },
];

export default function PayrollPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    
    const [isRunPayrollOpen, setRunPayrollOpen] = React.useState(false);
    const [selectedPeriod, setSelectedPeriod] = React.useState<{ month: string, year: string }>({ month: '', year: '' });
    const [isProcessing, setIsProcessing] = React.useState(false);

    const employeesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/employees`) : null, [firestore, user]);
    const { data: employees, isLoading: employeesLoading } = useCollection<Employee>(employeesRef);

    const payrollsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/payrolls`) : null, [firestore, user]);
    const { data: payrolls, isLoading: payrollsLoading } = useCollection<Payroll>(payrollsRef);

    React.useEffect(() => {
        if (!user || !firestore || employeesLoading || !employees) return;
        
        const seedData = async () => {
            if (employees.length === 0) {
                if(!employeesRef) return;
                try {
                    const batch = writeBatch(firestore);
                    seedEmployees.forEach(emp => {
                        const docRef = doc(employeesRef);
                        batch.set(docRef, emp);
                    });
                    await batch.commit();
                    toast({ title: 'Sample employees added', description: 'You can now run payroll.' });
                } catch (error) {
                    console.error("Error seeding employees:", error);
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not add sample employees.' });
                }
            }
        };

        seedData();
    }, [user, firestore, employees, employeesLoading, employeesRef, toast]);

    const handleRunPayroll = async () => {
        if (!firestore || !user || !employees || !selectedPeriod.month || !selectedPeriod.year) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a period and ensure employees are loaded.' });
            return;
        }

        setIsProcessing(true);
        const period = `${selectedPeriod.year}-${selectedPeriod.month}`;
        
        try {
            if (!payrollsRef) throw new Error("Payrolls collection reference is not available.");
            const existingPayrollQuery = query(payrollsRef, where('period', '==', period));
            const existingPayrollSnap = await getDocs(existingPayrollQuery);
            if (!existingPayrollSnap.empty) {
                toast({ variant: 'destructive', title: 'Payroll Exists', description: `Payroll for ${period} has already been processed.` });
                setIsProcessing(false);
                setRunPayrollOpen(false);
                return;
            }

            const batch = writeBatch(firestore);
            employees.forEach(emp => {
                const payrollDocRef = doc(payrollsRef);
                const deductions = 0; // Future deduction logic can go here
                const netSalary = emp.salary - deductions;
                const newPayroll: Omit<Payroll, 'id' | 'createdAt'> = {
                    employeeId: emp.id,
                    employeeName: emp.name,
                    period,
                    grossSalary: emp.salary,
                    deductions,
                    netSalary,
                    status: 'pending'
                };
                batch.set(payrollDocRef, { ...newPayroll, createdAt: serverTimestamp() });
            });

            await batch.commit();
            toast({ title: 'Payroll Processed', description: `Successfully processed payroll for ${period}.` });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to process payroll.' });
        } finally {
            setIsProcessing(false);
            setRunPayrollOpen(false);
        }
    };

    const payrollStats = React.useMemo(() => {
        if (!payrolls) return { totalNet: 0, paidCount: 0, pendingCount: 0, totalGross: 0, totalDeductions: 0 };
        return payrolls.reduce((acc, p) => {
            acc.totalNet += p.netSalary;
            acc.totalGross += p.grossSalary;
            acc.totalDeductions += p.deductions;
            if (p.status === 'paid') acc.paidCount++;
            else acc.pendingCount++;
            return acc;
        }, { totalNet: 0, paidCount: 0, pendingCount: 0, totalGross: 0, totalDeductions: 0 });
    }, [payrolls]);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString().padStart(2, '0'), name: new Date(0, i).toLocaleString('default', { month: 'long' }) }));

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
                    <p className="text-muted-foreground">Process and manage employee salaries.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Employees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{employees?.length || 0}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Net Payout</CardTitle><Banknote className="h-4 w-4 text-muted-foreground" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{formatCurrency(payrollStats.totalNet)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Paid Records</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{payrollStats.paidCount}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Records</CardTitle><Hourglass className="h-4 w-4 text-yellow-500" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{payrollStats.pendingCount}</div></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Payroll History</CardTitle>
                            <CardDescription>History of all processed payrolls.</CardDescription>
                        </div>
                        <Dialog open={isRunPayrollOpen} onOpenChange={setRunPayrollOpen}>
                            <DialogTrigger asChild><Button>Run Payroll</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Run Monthly Payroll</DialogTitle><DialogDescription>Select the period to process payroll for all employees.</DialogDescription></DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                    <Select onValueChange={(v) => setSelectedPeriod(p => ({...p, year: v}))}>
                                        <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                                        <SelectContent>{years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Select onValueChange={(v) => setSelectedPeriod(p => ({...p, month: v}))}>
                                        <SelectTrigger><SelectValue placeholder="Select Month" /></SelectTrigger>
                                        <SelectContent>{months.map(m => <SelectItem key={m.value} value={m.value}>{m.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleRunPayroll} disabled={isProcessing || !selectedPeriod.year || !selectedPeriod.month}>{isProcessing ? 'Processing...' : 'Confirm & Run'}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Period</TableHead><TableHead>Gross Salary</TableHead><TableHead>Deductions</TableHead><TableHead>Net Salary</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {payrollsLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading payrolls...</TableCell></TableRow>}
                                {payrolls?.map(p => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.employeeName}</TableCell>
                                        <TableCell>{p.period}</TableCell>
                                        <TableCell>{formatCurrency(p.grossSalary)}</TableCell>
                                        <TableCell>{formatCurrency(p.deductions)}</TableCell>
                                        <TableCell className="font-semibold">{formatCurrency(p.netSalary)}</TableCell>
                                        <TableCell><Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className={p.status === 'paid' ? 'bg-green-600 text-primary-foreground' : ''}>{p.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={2} className="text-right font-bold">Totals</TableCell>
                                    <TableCell className="font-bold">{formatCurrency(payrollStats.totalGross)}</TableCell>
                                    <TableCell className="font-bold">{formatCurrency(payrollStats.totalDeductions)}</TableCell>
                                    <TableCell className="font-bold">{formatCurrency(payrollStats.totalNet)}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
