'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type { LucideIcon } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { PlusCircle, Database, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type Report = {
  id: string;
  title: string;
  module: string;
  date: Timestamp;
};

const reportSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  module: z.string().min(1, 'Module is required'),
});

type ReportFormData = z.infer<typeof reportSchema>;

const seedReports: Omit<Report, 'id' | 'date'>[] = [
  { title: "Monthly Sales", module: "Sales" },
  { title: "Purchase Analysis", module: "Purchase" },
];


export default function ReportsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const reportsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/reports`) : null, [firestore, user]);
  const { data: reports, isLoading } = useCollection<Report>(reportsRef);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { title: '', module: '' },
  });

  const handleSeedData = async () => {
    if (!reportsRef) return;
    try {
      const batch = writeBatch(firestore);
      seedReports.forEach(report => {
        const docRef = doc(reportsRef);
        batch.set(docRef, {...report, date: Timestamp.now()});
      });
      await batch.commit();
      toast({ title: 'Success', description: 'Demo reports have been added.' });
    } catch (error) {
        console.error("Error seeding reports:", error);
        const contextualError = new FirestorePermissionError({ path: reportsRef.path, operation: 'create' });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not add demo reports.' });
    }
  };

  const onSubmit = (values: ReportFormData) => {
    if (!reportsRef) return;

    addDoc(reportsRef, {...values, date: Timestamp.now()}).then(() => {
        toast({ title: 'Success', description: 'Report generated successfully.' });
        form.reset();
        setIsDialogOpen(false);
    }).catch(error => {
        console.error("Error adding report:", error);
        const contextualError = new FirestorePermissionError({ path: reportsRef.path, operation: 'create', requestResourceData: values });
        errorEmitter.emit('permission-error', contextualError);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not generate report.' });
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports Center</h1>
            <p className="text-muted-foreground">Generate, view, and manage all your business reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Generate Report</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New Report</DialogTitle>
                  <DialogDescription>Fill in the details to generate a new report.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Report Title</FormLabel><FormControl><Input {...field} placeholder="e.g., Quarterly Sales Summary" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="module" render={({ field }) => (<FormItem><FormLabel>Module</FormLabel><FormControl><Input {...field} placeholder="e.g., Sales" /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter><Button type="submit">Generate</Button></DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2 h-4 w-4" /> Seed Data</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>A list of all generated reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading reports...</TableCell></TableRow>}
                {reports?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.module}</TableCell>
                    <TableCell>{format(report.date.toDate(), 'PPP')}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && reports?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No reports found. Generate one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
