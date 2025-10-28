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

type Dps = {
  id: string;
  bank: string;
  maturityDate: string; // Stored as ISO string
  dpsBalance: number;
}

const defaultDpsState: Omit<Dps, 'id' | 'maturityDate'> & { maturityDate?: Date } = {
  bank: '',
  dpsBalance: 0,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function DpsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const dpsCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'dps') : null;
    }, [firestore]);
    const { data: dpsData, isLoading } = useCollection<Dps>(dpsCollection);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [newDps, setNewDps] = React.useState(defaultDpsState);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'dpsBalance') {
            setNewDps(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setNewDps(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleDateChange = (date?: Date) => {
        setNewDps(prev => ({...prev, maturityDate: date}));
    }

    const handleAddDps = () => {
        if (!dpsCollection) return;
        
        const { bank, maturityDate, dpsBalance } = newDps;
        if (!bank || !maturityDate || dpsBalance <= 0) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'All fields are required and balance must be positive.' });
            return;
        }
        
        const newDpsData: Omit<Dps, 'id'> = {
            bank,
            maturityDate: maturityDate.toISOString(),
            dpsBalance,
        };
        addDocumentNonBlocking(dpsCollection, newDpsData);
        toast({ title: 'DPS Added', description: `A new DPS from ${newDps.bank} has been successfully added.` });
        setIsDialogOpen(false);
        setNewDps(defaultDpsState);
    };

    const totalBalance = dpsData?.reduce((acc, curr) => acc + curr.dpsBalance, 0) || 0;
    
    const DpsForm = () => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New DPS</DialogTitle>
                <DialogDescription>Enter the details for the new Deposit Pension Scheme.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank" className="text-right">Bank</Label>
                    <Input id="bank" name="bank" value={newDps.bank} onChange={handleInputChange} className="col-span-3" placeholder="e.g. IFIC Bank"/>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maturityDate" className="text-right">Maturity Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("col-span-3 justify-start text-left font-normal", !newDps.maturityDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newDps.maturityDate ? format(newDps.maturityDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newDps.maturityDate} onSelect={handleDateChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dpsBalance" className="text-right">Balance</Label>
                    <Input id="dpsBalance" name="dpsBalance" type="number" value={newDps.dpsBalance} onChange={handleInputChange} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleAddDps}>Add DPS</Button>
            </DialogFooter>
        </DialogContent>
    );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">DPS Summary</h1>
                <p className="text-muted-foreground">An overview of your Deposit Pension Schemes.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
                if (!isOpen) setNewDps(defaultDpsState);
            }}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New DPS</Button>
              </DialogTrigger>
              <DpsForm />
            </Dialog>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>DPS Details</CardTitle>
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
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : dpsData?.map((dps) => (
                  <TableRow key={dps.id}>
                    <TableCell>{dps.bank}</TableCell>
                    <TableCell>{format(new Date(dps.maturityDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(dps.dpsBalance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalBalance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
