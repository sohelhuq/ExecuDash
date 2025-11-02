'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

type DpsAccount = {
  id: string;
  bank: string;
  maturityDate: Timestamp;
  dpsBalance: number;
};

const defaultDpsState = {
    bank: '',
    dpsBalance: 0,
    maturityDate: undefined as Date | undefined,
}

export default function DpsPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newDps, setNewDps] = React.useState(defaultDpsState);

  const dpsCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/dps`) : null, [firestore, user]);
  const { data: dpsData, isLoading: dpsLoading } = useCollection<DpsAccount>(dpsCollectionRef);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'dpsBalance') {
        setNewDps(prev => ({ ...prev, dpsBalance: parseFloat(value) || 0 }));
    } else {
        setNewDps(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
        setNewDps(prev => ({ ...prev, maturityDate: date }));
    }
  }

  const handleAddDps = () => {
    if (!dpsCollectionRef) return;
    const { bank, maturityDate, dpsBalance } = newDps;

    if (!bank || !maturityDate || dpsBalance <= 0) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all fields and ensure balance is positive.'
        });
        return;
    }
    
    const newDpsData = {
        bank,
        dpsBalance,
        maturityDate: Timestamp.fromDate(maturityDate),
    }

    addDocumentNonBlocking(dpsCollectionRef, newDpsData);
    toast({ title: 'Success', description: 'New DPS has been added.' });
    setIsDialogOpen(false);
    setNewDps(defaultDpsState);
  };

  const totalBalance = React.useMemo(() => {
    return dpsData?.reduce((acc, dps) => acc + dps.dpsBalance, 0) || 0;
  }, [dpsData]);

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>DPS Summary</CardTitle>
              <CardDescription>An overview of your Deposit Pension Schemes.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New DPS</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New DPS</DialogTitle>
                  <DialogDescription>Enter the details for your new DPS account.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank">Bank Name</Label>
                        <Input id="bank" name="bank" value={newDps.bank} onChange={handleInputChange} placeholder="e.g., Sonali Bank"/>
                    </div>
                    <div className="space-y-2">
                        <Label>Maturity Date</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !newDps.maturityDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newDps.maturityDate ? format(newDps.maturityDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={newDps.maturityDate} onSelect={handleDateChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dpsBalance">DPS Balance</Label>
                        <Input id="dpsBalance" name="dpsBalance" type="number" value={newDps.dpsBalance} onChange={handleInputChange} />
                    </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddDps}>Save DPS</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dpsLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading DPS accounts...</TableCell></TableRow>}
                {dpsData?.map((dps) => (
                  <TableRow key={dps.id}>
                    <TableCell className="font-medium">{dps.bank}</TableCell>
                    <TableCell>{format(dps.maturityDate.toDate(), 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(dps.dpsBalance)}</TableCell>
                  </TableRow>
                ))}
                {!dpsLoading && dpsData?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No DPS accounts found.</TableCell></TableRow>}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="font-bold text-lg">Total Balance</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(totalBalance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
