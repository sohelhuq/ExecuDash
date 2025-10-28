
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { PlusCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { employeeData } from '@/lib/employee-data';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

type Employee = {
  id: string;
  name: string;
  department: string;
  jobRole: string;
  salary: number;
};

const employeeFormSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    department: z.string().min(1, 'Department is required.'),
    jobRole: z.string().min(1, 'Job role is required.'),
    salary: z.coerce.number().positive('Salary must be a positive number.'),
    locationConsent: z.literal<boolean>(true, {
        errorMap: () => ({ message: "Location consent is required for employee tracking." }),
    }),
});

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);


export default function EmployeeManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const employeesCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'employees') : null;
  }, [firestore]);

  const { data: employees, isLoading } = useCollection<Employee>(employeesCollection);
  
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: '',
      department: '',
      jobRole: '',
      salary: 0,
    },
  });

  const seedData = async () => {
    if (!employeesCollection || !firestore) return;
    setIsSeeding(true);
    try {
      const snapshot = await getDocs(employeesCollection);
      if (!snapshot.empty) {
        toast({
          title: 'Data Already Exists',
          description: 'Employee data has already been seeded.',
        });
        return;
      }
      
      const batch = writeBatch(firestore);
      employeeData.forEach((employee) => {
        const docRef = doc(employeesCollection);
        batch.set(docRef, employee);
      });
      await batch.commit();

      toast({
        title: 'Seeding Complete',
        description: `${employeeData.length} employee records have been added.`,
      });
    } catch (error) {
      console.error('Error seeding data:', error);
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'Could not seed employee data.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const totalSalary = React.useMemo(() => {
    return employees?.reduce((sum, emp) => sum + emp.salary, 0) || 0;
  }, [employees]);

  async function onSubmit(values: z.infer<typeof employeeFormSchema>) {
    if (!employeesCollection) return;

    // We don't save the consent checkbox itself, just the employee data
    const { locationConsent, ...employeeInfo } = values;

    addDocumentNonBlocking(employeesCollection, {
        ...employeeInfo,
        joiningDate: new Date().toISOString().split('T')[0], // Set joining date to today
        status: 'active',
    });

    toast({
        title: "Employee Added",
        description: `${values.name} has been successfully added.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
            <p className="text-muted-foreground">
              Browse, add, and manage employee records.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={seedData} variant="outline" disabled={isSeeding}>
              {isSeeding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Seed Initial Data
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Employee</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new employee.
                  </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g. John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="department" render={({ field }) => (
                            <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="e.g. Sales" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="jobRole" render={({ field }) => (
                            <FormItem><FormLabel>Job Role / Designation</FormLabel><FormControl><Input placeholder="e.g. Manager" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="salary" render={({ field }) => (
                            <FormItem><FormLabel>Salary (BDT)</FormLabel><FormControl><Input type="number" placeholder="e.g. 50000" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="locationConsent" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Location Consent</FormLabel>
                                    <FormDescription>
                                        By checking this box, the employee agrees to enable location services for tracking purposes. This is mandatory for enrollment.
                                    </FormDescription>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )} />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                            <Button type="submit">Add Employee</Button>
                        </DialogFooter>
                    </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : (
                  employees?.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.jobRole}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(employee.salary)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold text-lg">
                    <TableCell colSpan={3}>Total Monthly Salary</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalSalary)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
