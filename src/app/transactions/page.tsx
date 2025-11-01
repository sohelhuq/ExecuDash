'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, SlidersHorizontal, FileDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const transactions = [
    { id: 'trx1', date: "2024-07-29", description: "Invoice #INV-2024-015 payment", type: "income", category: "Client Payment", amount: 75000, source: "Bank Transfer" },
    { id: 'trx2', date: "2024-07-28", description: "Office rent for July", type: "expense", category: "Rent", amount: 50000, source: "Bank Cheque" },
    { id: 'trx3', date: "2024-07-28", description: "Cloud server subscription (AWS)", type: "expense", category: "Utilities", amount: 15000, source: "Credit Card" },
    { id: 'trx4', date: "2024-07-27", description: "Payment received from 'Global Imports'", type: "income", category: "Client Payment", amount: 120000, source: "Bank Transfer" },
    { id: 'trx5', date: "2024-07-26", description: "Software license renewal", type: "expense", category: "Software", amount: 5500, source: "Credit Card" },
    { id: 'trx6', date: "2024-07-25", description: "Employee Salaries - July", type: "expense", category: "Salaries", amount: 250000, source: "Bank Transfer" },
    { id: 'trx7', date: "2024-07-24", description: "Consulting fee", type: "income", category: "Consulting", amount: 45000, source: "Stripe" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function TransactionsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View, add, and manage your financial transactions.</p>
          </div>
          <div className="flex gap-2">
             <Dialog>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Transaction</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>
                    Enter the details of your new transaction here.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <Input id="date" type="date" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" placeholder="e.g., Office supplies" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount (৳)</Label>
                    <Input id="amount" type="number" placeholder="e.g., 5000" className="col-span-3" />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Select>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">Category</Label>
                     <Input id="category" placeholder="e.g., Utilities" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Transaction</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A complete record of all your financial activities.</CardDescription>
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
                {transactions.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>{trx.date}</TableCell>
                    <TableCell className="font-medium">{trx.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{trx.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trx.type === 'income' ? 'default' : 'secondary'}
                        className={trx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {trx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(trx.amount)}</TableCell>
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
