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
import { PlusCircle, Users, Banknote, DivideCircle, Database } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type Employee = { id: string; name: string; department: string; jobRole: string; salary: number; };

const employeeSchema = z.object({
  name: z.string().min(1, 'Employee name is required'),
  department: z.string().min(1, 'Department is required'),
  jobRole: z.string().min(1, 'Job role is required'),
  salary: z.coerce.number().positive('Salary must be a positive number'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const seedEmployees: Omit<Employee, 'id'>[] = [
  { name: "Jahirul Haque", department: "Accounts", jobRole: "Manager", salary: 30000 },
  { name: "Rahim Uddin", department: "Sales", jobRole: "Sales Officer", salary: 25000 },
  { name: "Selina Begum", department: "HR", jobRole: "HR Executive", salary: 22000 },
];

export default function EmployeePage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const employeesRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/employees`) : null, [firestore, user]);
    const { data: employees, isLoading } = useCollection<Employee>(employeesRef);

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: { name: '', department: '', jobRole: '', salary: 0 },
    });

    const handleSeedData = async () => {
        if (!employeesRef) return;
        try {
            const batch = writeBatch(firestore);
            seedEmployees.forEach(emp => {
                const docRef = doc(employeesRef);
                batch.set(docRef, emp);
            });
            await batch.commit();
            toast({ title: 'Success', description: 'Demo employees have been added.' });
        } catch (error) {
            console.error("Error seeding employees:", error);
            const contextualError = new FirestorePermissionError({
              path: employeesRef.path,
              operation: 'create',
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo employees.' });
        }
    };

    const onSubmit = async (values: EmployeeFormData) => {
        if (!employeesRef) return;
        
        addDoc(employeesRef, values).then(() => {
          toast({ title: 'Success', description: 'Employee added successfully.' });
          form.reset();
          setIsDialogOpen(false);
        }).catch(error => {
            console.error("Error adding employee:", error);
            const contextualError = new FirestorePermissionError({
              path: employeesRef.path,
              operation: 'create',
              requestResourceData: values,
            });
            errorEmitter.emit('permission-error', contextualError);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add employee.' });
        });
    };

    const employeeStats = React.useMemo(() => {
        if (!employees || employees.length === 0) {
            return { totalEmployees: 0, totalMonthlySalary: 0, averageSalary: 0 };
        }
        const totalEmployees = employees.length;
        const totalMonthlySalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
        const averageSalary = totalMonthlySalary / totalEmployees;
        return { totalEmployees, totalMonthlySalary, averageSalary };
    }, [employees]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
                <p className="text-muted-foreground">Add, view, and manage your company's employees.</p>
            </div>
            <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Add Employee</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>Fill in the details for the new employee.</DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Employee Name</FormLabel><FormControl><Input {...field} placeholder="e.g., John Doe" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department</FormLabel><FormControl><Input {...field} placeholder="e.g., Sales" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="jobRole" render={({ field }) => (<FormItem><FormLabel>Job Role</FormLabel><FormControl><Input {...field} placeholder="e.g., Sales Manager" /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="salary" render={({ field }) => (<FormItem><FormLabel>Monthly Salary (BDT)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <DialogFooter>
                                    <Button type="submit">Save Employee</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Demo Data</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Employees</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{employeeStats.totalEmployees}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Monthly Salary</CardTitle><Banknote className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{formatCurrency(employeeStats.totalMonthlySalary)}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Salary</CardTitle><DivideCircle className="h-4 w-4 text-muted-foreground" /></CardHeader>
                <CardContent><div className="text-2xl font-bold">{formatCurrency(employeeStats.averageSalary)}</div></CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>The central directory of all active employees.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead className="text-right">Salary</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading employees...</TableCell></TableRow>}
                    {employees?.map(emp => (
                        <TableRow key={emp.id}>
                            <TableCell className="font-medium">{emp.name}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.jobRole}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(emp.salary)}</TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && employees?.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No employees found. Add one to get started.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
