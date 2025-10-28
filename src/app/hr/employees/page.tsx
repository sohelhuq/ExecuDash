
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { PlusCircle, Loader2, MoreHorizontal } from 'lucide-react';
import React, { useEffect } from 'react';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  addDocumentNonBlocking,
} from '@/firebase';
import { collection, writeBatch, getDocs } from 'firebase/firestore';
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

type Employee = {
  id: string;
  name: string;
  department: string;
  jobRole: string;
  salary: number;
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);


export default function EmployeeManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const employeesCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'employees') : null),
    [firestore]
  );

  const { data: employees, isLoading } = useCollection<Employee>(employeesCollection);

  const seedData = async () => {
    if (!employeesCollection) return;
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
        const docRef = collection(employeesCollection);
        batch.set(doc(docRef.firestore, docRef.path), employee);
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
            <Dialog>
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
                <p className="text-center py-8 text-muted-foreground">(Form under construction)</p>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button disabled>Add Employee</Button>
                </DialogFooter>
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

    