'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const transactions = [
  { id: 'txn1', description: "Salary Deposit", date: "2024-07-28", amount: 250000, type: "income", category: "Salary" },
  { id: 'txn2', description: "Grocery Shopping at Meena Bazar", date: "2024-07-27", amount: -8500, type: "expense", category: "Groceries" },
  { id: 'txn3', description: "Freelance Project Payment", date: "2024-07-26", amount: 75000, type: "income", category: "Freelance" },
  { id: 'txn4', description: "Utility Bill - Electricity", date: "2024-07-25", amount: -4200, type: "expense", category: "Utilities" },
  { id: 'txn5', description: "Investment in Mutual Fund", date: "2024-07-24", amount: -50000, type: "expense", category: "Investment" },
  { id: 'txn6', description: "Dinner at Pizza Hut", date: "2024-07-23", amount: -2500, type: "expense", category: "Food" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function TransactionsPage() {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleAddTransaction = () => {
        // Mock function
        toast({
            title: "Transaction Added",
            description: "Your new transaction has been successfully recorded."
        });
        setIsDialogOpen(false);
    }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">A detailed history of your financial activities.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Transaction</DialogTitle>
                        <DialogDescription>Enter the details of your financial activity.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <Input id="date" type="date" className="col-span-3" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">Description</Label>
                            <Input id="description" className="col-span-3" placeholder="e.g., Coffee with client" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Amount</Label>
                            <Input id="amount" type="number" className="col-span-3" placeholder="e.g., -500 for expense" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Input id="category" className="col-span-3" placeholder="e.g., Business Meal" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                        <Button onClick={handleAddTransaction}>Save Transaction</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>{txn.date}</TableCell>
                    <TableCell className="font-medium">{txn.description}</TableCell>
                    <TableCell><Badge variant="outline">{txn.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={txn.type === 'income' ? 'default' : 'secondary'} className={txn.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {txn.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(txn.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
