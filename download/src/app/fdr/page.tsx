'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type Fdr = {
  id: string;
  bank: string;
  category: string;
  amount: number;
};

const defaultFdrState = {
    bank: '',
    category: '',
    amount: 0,
};

export default function FdrPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newFdr, setNewFdr] = React.useState(defaultFdrState);

  const fdrCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/fdr`) : null, [firestore, user]);
  const { data: fdrData, isLoading: fdrLoading } = useCollection<Fdr>(fdrCollectionRef);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
        setNewFdr(prev => ({ ...prev, amount: parseFloat(value) || 0 }));
    } else {
        setNewFdr(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFdr = () => {
    if (!fdrCollectionRef) return;
    const { bank, category, amount } = newFdr;

    if (!bank || !category || amount <= 0) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all fields and ensure the amount is positive.'
        });
        return;
    }
    
    addDocumentNonBlocking(fdrCollectionRef, { bank, category, amount });
    toast({ title: 'Success', description: 'New FDR has been added.' });
    setIsDialogOpen(false);
    setNewFdr(defaultFdrState);
  };

  const totalAmount = React.useMemo(() => {
    return fdrData?.reduce((acc, fdr) => acc + fdr.amount, 0) || 0;
  }, [fdrData]);
  
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>FDR Summary</CardTitle>
              <CardDescription>An overview of your Fixed Deposit Receipts as of {currentDate}.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New FDR</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New FDR</DialogTitle>
                  <DialogDescription>Enter the details for your new Fixed Deposit Receipt.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="bank">Bank Name</Label>
                        <Input id="bank" name="bank" value={newFdr.bank} onChange={handleInputChange} placeholder="e.g., Eastern Bank"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" value={newFdr.category} onChange={handleInputChange} placeholder="e.g., Personal Savings"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" name="amount" type="number" value={newFdr.amount} onChange={handleInputChange} />
                    </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddFdr}>Add FDR</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                {fdrLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading FDRs...</TableCell></TableRow>}
                {fdrData?.map((fdr) => (
                  <TableRow key={fdr.id}>
                    <TableCell className="font-medium">{fdr.bank}</TableCell>
                    <TableCell>{fdr.category}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(fdr.amount)}</TableCell>
                  </TableRow>
                ))}
                {!fdrLoading && fdrData?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No FDRs found. Add one to get started.</TableCell></TableRow>}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="font-bold text-lg">Total Amount</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(totalAmount)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
