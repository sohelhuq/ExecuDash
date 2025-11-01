'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Database } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input';
import { Label } from "@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

// Schemas for form validation
const ccAccountSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  interestRate: z.coerce.number().min(0, 'Interest rate cannot be negative'),
  openingBalance: z.coerce.number(),
  totalDeposit: z.coerce.number(),
  totalWithdrawal: z.coerce.number(),
});

const savingsAccountSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  openingBalance: z.coerce.number(),
  totalDeposit: z.coerce.number(),
  totalWithdrawal: z.coerce.number(),
});

type CcAccount = z.infer<typeof ccAccountSchema>;
type SavingsAccount = z.infer<typeof savingsAccountSchema>;

// Seed data
const seedCcAccounts: CcAccount[] = [
    { bankName: "City Bank", accountName: "Main Business CC", accountNumber: "C-12345", interestRate: 9.5, openingBalance: 500000, totalDeposit: 1200000, totalWithdrawal: 1100000 },
    { bankName: "Brac Bank", accountName: "Project Finance", accountNumber: "C-67890", interestRate: 10.0, openingBalance: 200000, totalDeposit: 800000, totalWithdrawal: 750000 },
];
const seedSavingsAccounts: SavingsAccount[] = [
    { bankName: "EBL", accountName: "Operational Savings", accountNumber: "S-54321", openingBalance: 150000, totalDeposit: 400000, totalWithdrawal: 350000 },
    { bankName: "Standard Chartered", accountName: "Emergency Fund", accountNumber: "S-09876", openingBalance: 250000, totalDeposit: 100000, totalWithdrawal: 50000 },
];

export default function BankingPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [isCcDialogOpen, setCcDialogOpen] = React.useState(false);
  const [isSavingsDialogOpen, setSavingsDialogOpen] = React.useState(false);

  const ccForm = useForm<CcAccount>({ resolver: zodResolver(ccAccountSchema), defaultValues: { openingBalance: 0, totalDeposit: 0, totalWithdrawal: 0, interestRate: 0 } });
  const savingsForm = useForm<SavingsAccount>({ resolver: zodResolver(savingsAccountSchema), defaultValues: { openingBalance: 0, totalDeposit: 0, totalWithdrawal: 0 } });

  const ccAccountsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/ccAccounts`) : null, [firestore, user]);
  const { data: ccAccounts, isLoading: ccLoading } = useCollection<CcAccount>(ccAccountsRef);

  const savingsAccountsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/savingsAccounts`) : null, [firestore, user]);
  const { data: savingsAccounts, isLoading: savingsLoading } = useCollection<SavingsAccount>(savingsAccountsRef);

  const handleSeedData = async () => {
    if (!firestore || !user) return;
    try {
      const batch = writeBatch(firestore);
      seedCcAccounts.forEach(acc => {
        const ref = doc(collection(firestore, `users/${user.uid}/ccAccounts`));
        batch.set(ref, acc);
      });
      seedSavingsAccounts.forEach(acc => {
        const ref = doc(collection(firestore, `users/${user.uid}/savingsAccounts`));
        batch.set(ref, acc);
      });
      await batch.commit();
      toast({ title: "Success", description: "Demo data has been added to your accounts." });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Error", description: "Could not seed data." });
    }
  };

  const onCcSubmit = async (data: CcAccount) => {
    if (!ccAccountsRef) return;
    try {
      await addDoc(ccAccountsRef, data);
      toast({ title: "Success", description: "CC Account added successfully." });
      ccForm.reset();
      setCcDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Error", description: "Could not add CC account." });
    }
  };

  const onSavingsSubmit = async (data: SavingsAccount) => {
    if (!savingsAccountsRef) return;
    try {
      await addDoc(savingsAccountsRef, data);
      toast({ title: "Success", description: "Savings Account added successfully." });
      savingsForm.reset();
      setSavingsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: "Error", description: "Could not add savings account." });
    }
  };
  
  const calculateTotals = (accounts: (CcAccount[] | SavingsAccount[] | null)) => {
    if (!accounts) return { opening: 0, deposit: 0, withdrawal: 0, balance: 0 };
    return accounts.reduce((acc, curr) => {
        const opening = curr.openingBalance || 0;
        const deposit = curr.totalDeposit || 0;
        const withdrawal = curr.totalWithdrawal || 0;
        return {
            opening: acc.opening + opening,
            deposit: acc.deposit + deposit,
            withdrawal: acc.withdrawal + withdrawal,
            balance: acc.balance + opening + deposit - withdrawal,
        };
    }, { opening: 0, deposit: 0, withdrawal: 0, balance: 0 });
  };
  
  const ccTotals = calculateTotals(ccAccounts);
  const savingsTotals = calculateTotals(savingsAccounts);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banking Dashboard</h1>
            <p className="text-muted-foreground">Manage your CC (Loan) and Savings accounts.</p>
          </div>
           <Button variant="outline" onClick={handleSeedData}><Database className="mr-2"/> Seed Demo Data</Button>
        </div>

        {/* CC Accounts Section */}
        <Card>
          <CardHeader className='flex-row items-center justify-between'>
            <div>
                <CardTitle>CC (Loan) Accounts</CardTitle>
                <CardDescription>Your cash credit and loan accounts.</CardDescription>
            </div>
             <Dialog open={isCcDialogOpen} onOpenChange={setCcDialogOpen}>
              <DialogTrigger asChild><Button><PlusCircle className="mr-2"/> Add CC Account</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New CC Account</DialogTitle>
                  <DialogDescription>Fill in the details for your new CC or loan account.</DialogDescription>
                </DialogHeader>
                 <Form {...ccForm}><form onSubmit={ccForm.handleSubmit(onCcSubmit)} className="space-y-4">
                  <FormField control={ccForm.control} name="bankName" render={({field}) => (<FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} placeholder="e.g., City Bank"/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="accountName" render={({field}) => (<FormItem><FormLabel>Account Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Main Business CC"/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="accountNumber" render={({field}) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="interestRate" render={({field}) => (<FormItem><FormLabel>Interest Rate (%)</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="openingBalance" render={({field}) => (<FormItem><FormLabel>Opening Balance</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="totalDeposit" render={({field}) => (<FormItem><FormLabel>Total Deposit (CR)</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={ccForm.control} name="totalWithdrawal" render={({field}) => (<FormItem><FormLabel>Total Withdrawal (DR)</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <DialogFooter><Button type="submit">Save Account</Button></DialogFooter>
                </form></Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead><TableHead>Account</TableHead><TableHead>Interest</TableHead>
                  <TableHead className="text-right">Opening</TableHead><TableHead className="text-right">Deposit (CR)</TableHead>
                  <TableHead className="text-right">Withdrawal (DR)</TableHead><TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ccLoading ? <TableRow><TableCell colSpan={7} className="text-center">Loading...</TableCell></TableRow> :
                 ccAccounts?.map(acc => {
                     const balance = (acc.openingBalance || 0) + (acc.totalDeposit || 0) - (acc.totalWithdrawal || 0);
                     return (
                        <TableRow key={acc.id}>
                            <TableCell className="font-medium">{acc.bankName}</TableCell>
                            <TableCell>{acc.accountName} <br/><span className="text-xs text-muted-foreground">{acc.accountNumber}</span></TableCell>
                            <TableCell>{acc.interestRate}%</TableCell>
                            <TableCell className="text-right">{formatCurrency(acc.openingBalance)}</TableCell>
                            <TableCell className="text-right text-green-600">{formatCurrency(acc.totalDeposit)}</TableCell>
                            <TableCell className="text-right text-red-600">{formatCurrency(acc.totalWithdrawal)}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(balance)}</TableCell>
                        </TableRow>
                     )
                 })
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="font-bold text-lg">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(ccTotals.opening)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{formatCurrency(ccTotals.deposit)}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">{formatCurrency(ccTotals.withdrawal)}</TableCell>
                    <TableCell className="text-right font-bold text-lg">{formatCurrency(ccTotals.balance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
        
        {/* Savings Accounts Section */}
        <Card>
          <CardHeader className='flex-row items-center justify-between'>
            <div>
                <CardTitle>Savings Accounts</CardTitle>
                <CardDescription>Your standard savings and current accounts.</CardDescription>
            </div>
             <Dialog open={isSavingsDialogOpen} onOpenChange={setSavingsDialogOpen}>
              <DialogTrigger asChild><Button><PlusCircle className="mr-2"/> Add Savings Account</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Savings Account</DialogTitle>
                  <DialogDescription>Fill in the details for your new savings account.</DialogDescription>
                </DialogHeader>
                <Form {...savingsForm}><form onSubmit={savingsForm.handleSubmit(onSavingsSubmit)} className="space-y-4">
                  <FormField control={savingsForm.control} name="bankName" render={({field}) => (<FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} placeholder="e.g., EBL"/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={savingsForm.control} name="accountName" render={({field}) => (<FormItem><FormLabel>Account Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Operational Savings"/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={savingsForm.control} name="accountNumber" render={({field}) => (<FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={savingsForm.control} name="openingBalance" render={({field}) => (<FormItem><FormLabel>Opening Balance</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={savingsForm.control} name="totalDeposit" render={({field}) => (<FormItem><FormLabel>Total Deposit (CR)</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <FormField control={savingsForm.control} name="totalWithdrawal" render={({field}) => (<FormItem><FormLabel>Total Withdrawal (DR)</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                  <DialogFooter><Button type="submit">Save Account</Button></DialogFooter>
                </form></Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead><TableHead>Account</TableHead>
                  <TableHead className="text-right">Opening</TableHead><TableHead className="text-right">Deposit (CR)</TableHead>
                  <TableHead className="text-right">Withdrawal (DR)</TableHead><TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savingsLoading ? <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow> :
                 savingsAccounts?.map(acc => {
                     const balance = (acc.openingBalance || 0) + (acc.totalDeposit || 0) - (acc.totalWithdrawal || 0);
                     return (
                        <TableRow key={acc.id}>
                            <TableCell className="font-medium">{acc.bankName}</TableCell>
                            <TableCell>{acc.accountName} <br/><span className="text-xs text-muted-foreground">{acc.accountNumber}</span></TableCell>
                            <TableCell className="text-right">{formatCurrency(acc.openingBalance)}</TableCell>
                            <TableCell className="text-right text-green-600">{formatCurrency(acc.totalDeposit)}</TableCell>
                            <TableCell className="text-right text-red-600">{formatCurrency(acc.totalWithdrawal)}</TableCell>
                            <TableCell className="text-right font-bold">{formatCurrency(balance)}</TableCell>
                        </TableRow>
                     )
                 })
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={2} className="font-bold text-lg">Total</TableCell>
                    <TableCell className="text-right font-bold">{formatCurrency(savingsTotals.opening)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{formatCurrency(savingsTotals.deposit)}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">{formatCurrency(savingsTotals.withdrawal)}</TableCell>
                    <TableCell className="text-right font-bold text-lg">{formatCurrency(savingsTotals.balance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
    