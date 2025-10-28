
'use client';
import { AppShell } from '@/components/layout/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
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
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type BankDeposit = {
  id: string;
  amount: number;
  date: string;
  reference: string;
};

const defaultDepositState: Omit<BankDeposit, 'id' | 'date'> & { date?: Date } = {
  amount: 0,
  reference: '',
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function BankDepositsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const depositsCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'bank_deposits') : null;
    }, [firestore]);
    const { data: deposits, isLoading } = useCollection<BankDeposit>(depositsCollection);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [newDeposit, setNewDeposit] = React.useState(defaultDepositState);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            setNewDeposit(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setNewDeposit(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleDateChange = (date?: Date) => {
        setNewDeposit(prev => ({...prev, date: date}));
    }

    const handleAddDeposit = () => {
        const { amount, date, reference } = newDeposit;
        if (!date || amount <= 0) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Date and a positive amount are required.' });
            return;
        }
        
        if (depositsCollection) {
          const newDepositData: Omit<BankDeposit, 'id'> = {
              amount,
              date: date.toISOString(),
              reference,
          };
          addDocumentNonBlocking(depositsCollection, newDepositData);
          toast({ title: 'Deposit Added', description: `A new deposit of ${formatCurrency(amount)} has been added.` });
          setIsDialogOpen(false);
          setNewDeposit(defaultDepositState);
        }
    };

    const totalDeposits = deposits?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    
    const DepositForm = () => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Bank Deposit</DialogTitle>
                <DialogDescription>Enter the details for the new deposit transaction.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("col-span-3 justify-start text-left font-normal", !newDeposit.date && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newDeposit.date ? format(newDeposit.date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newDeposit.date} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input id="amount" name="amount" type="number" value={newDeposit.amount} onChange={handleInputChange} className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reference" className="text-right">Reference</Label>
                    <Input id="reference" name="reference" value={newDeposit.reference} onChange={handleInputChange} className="col-span-3" placeholder="e.g. Cheque #123, Deposit Slip"/>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleAddDeposit}>Add Deposit</Button>
            </DialogFooter>
        </DialogContent>
    );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bank Deposits</h1>
                <p className="text-muted-foreground">A record of all deposits made to the bank.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
                if (!isOpen) setNewDeposit(defaultDepositState);
            }}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Deposit</Button>
              </DialogTrigger>
              <DepositForm />
            </Dialog>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>Deposit History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : deposits?.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{format(new Date(deposit.date), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>{deposit.reference}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(deposit.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Total Deposits</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalDeposits)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
