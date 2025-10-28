
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
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';


type Fdr = {
  bank: string;
  category: string;
  amount: number;
}

const defaultFdrState: Fdr = {
  bank: '',
  category: '',
  amount: 0,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function FdrPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const fdrCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'fdr') : null;
    }, [firestore]);
    const { data: fdrData, isLoading } = useCollection<Fdr>(fdrCollection);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [newFdr, setNewFdr] = React.useState<Fdr>(defaultFdrState);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['amount'].includes(name);
        setNewFdr(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleAddFdr = () => {
        const { bank, category, amount } = newFdr;
        if (!bank || !category || amount <= 0) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'All fields are required and amount must be positive.' });
            return;
        }
        
        if (fdrCollection) {
          addDocumentNonBlocking(fdrCollection, newFdr);
          toast({ title: 'FDR Added', description: `A new FDR from ${newFdr.bank} has been successfully added.` });
          setIsDialogOpen(false);
          setNewFdr(defaultFdrState);
        }
    };

    const totalAmount = fdrData?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    
    const FdrForm = () => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New FDR</DialogTitle>
                <DialogDescription>Enter the details for the new Fixed Deposit Receipt.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank" className="text-right">Bank</Label>
                    <Input id="bank" name="bank" value={newFdr.bank} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                    <Input id="category" name="category" value={newFdr.category} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input id="amount" name="amount" type="number" value={newFdr.amount} onChange={handleInputChange} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleAddFdr}>Add FDR</Button>
            </DialogFooter>
        </DialogContent>
    );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">FDR Summary</h1>
                <p className="text-muted-foreground">An overview of your Fixed Deposit Receipts as of 12/12/2023.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                setIsDialogOpen(isOpen);
                if (!isOpen) setNewFdr(defaultFdrState);
            }}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New FDR</Button>
              </DialogTrigger>
              <FdrForm />
            </Dialog>
        </div>

        <Card>
          <CardHeader>
              <CardTitle>FDR Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : fdrData?.map((fdr, index) => (
                  <TableRow key={index}>
                    <TableCell>{fdr.bank}</TableCell>
                    <TableCell>{fdr.category}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(fdr.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold text-lg">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
