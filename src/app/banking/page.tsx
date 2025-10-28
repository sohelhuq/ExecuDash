
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


type Account = {
  bank: string;
  name: string;
  no: string;
  interest: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
}

const defaultAccountState: Omit<Account, 'balance'> = {
  bank: '',
  name: '',
  no: '',
  interest: '',
  opening: 0,
  cr: 0,
  dr: 0,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function BankingPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const ccAccountsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'cc_accounts') : null, [firestore]);
    const { data: ccAccounts, isLoading: isLoadingCc } = useCollection<Account>(ccAccountsCollection);

    const savingsAccountsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'savings_accounts') : null, [firestore]);
    const { data: savingsAccounts, isLoading: isLoadingSavings } = useCollection<Account>(savingsAccountsCollection);

    const [isCcDialogOpen, setIsCcDialogOpen] = React.useState(false);
    const [isSavingsDialogOpen, setIsSavingsDialogOpen] = React.useState(false);

    const [newAccount, setNewAccount] = React.useState<Omit<Account, 'balance'>>(defaultAccountState);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['opening', 'cr', 'dr'].includes(name);
        setNewAccount(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleAddAccount = (type: 'cc' | 'savings') => {
        const { bank, name, no, opening, cr, dr } = newAccount;
        if (!bank || !name || !no) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Bank, Account Name, and Account No are required.' });
            return;
        }

        const newEntry: Account = { ...newAccount, balance: opening + cr - dr };
        const targetCollection = type === 'cc' ? ccAccountsCollection : savingsAccountsCollection;

        if (targetCollection) {
          addDocumentNonBlocking(targetCollection, newEntry);
          toast({ title: 'Account Added', description: `${newAccount.name} has been successfully added.` });
          
          if (type === 'cc') {
              setIsCcDialogOpen(false);
          } else {
              setIsSavingsDialogOpen(false);
          }
          setNewAccount(defaultAccountState);
        }
    };

    const totalCCOpening = ccAccounts?.reduce((acc, curr) => acc + curr.opening, 0) || 0;
    const totalCCCr = ccAccounts?.reduce((acc, curr) => acc + curr.cr, 0) || 0;
    const totalCCDr = ccAccounts?.reduce((acc, curr) => acc + curr.dr, 0) || 0;
    const totalCCBalance = ccAccounts?.reduce((acc, curr) => acc + curr.balance, 0) || 0;

    const totalSavingsOpening = savingsAccounts?.reduce((acc, curr) => acc + curr.opening, 0) || 0;
    const totalSavingsCr = savingsAccounts?.reduce((acc, curr) => acc + curr.cr, 0) || 0;
    const totalSavingsDr = savingsAccounts?.reduce((acc, curr) => acc + curr.dr, 0) || 0;
    const totalSavingsBalance = savingsAccounts?.reduce((acc, curr) => acc + curr.balance, 0) || 0;

    const AccountForm = ({ onAdd, type, onOpenChange }: { onAdd: () => void; type: 'cc' | 'savings', onOpenChange: (open: boolean) => void }) => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New {type === 'cc' ? 'CC' : 'Savings'} Account</DialogTitle>
                <DialogDescription>Enter the details for the new account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank" className="text-right">Bank</Label>
                    <Input id="bank" name="bank" value={newAccount.bank} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Account Name</Label>
                    <Input id="name" name="name" value={newAccount.name} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="no" className="text-right">Account No</Label>
                    <Input id="no" name="no" value={newAccount.no} onChange={handleInputChange} className="col-span-3" />
                </div>
                 {type === 'cc' && <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="interest" className="text-right">Interest %</Label>
                    <Input id="interest" name="interest" value={newAccount.interest} onChange={handleInputChange} className="col-span-3" />
                </div>}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="opening" className="text-right">Opening</Label>
                    <Input id="opening" name="opening" type="number" value={newAccount.opening} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr" className="text-right">CR</Label>
                    <Input id="cr" name="cr" type="number" value={newAccount.cr} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dr" className="text-right">DR</Label>
                    <Input id="dr" name="dr" type="number" value={newAccount.dr} onChange={handleInputChange} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={onAdd}>Add Account</Button>
            </DialogFooter>
        </DialogContent>
    );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banking Summary</h1>
          <p className="text-muted-foreground">An overview of your CC and Savings accounts.</p>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>CC Account Transactions</CardTitle>
              <CardDescription>Summary of transactions for all Credit Card accounts.</CardDescription>
            </div>
            <Dialog open={isCcDialogOpen} onOpenChange={setIsCcDialogOpen}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
              </DialogTrigger>
              <AccountForm type="cc" onAdd={() => handleAddAccount('cc')} onOpenChange={setIsCcDialogOpen} />
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account No</TableHead>
                  <TableHead>Interest %</TableHead>
                  <TableHead className="text-right">Opening</TableHead>
                  <TableHead className="text-right">CR</TableHead>
                  <TableHead className="text-right">DR</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingCc ? (
                  <TableRow><TableCell colSpan={8} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : ccAccounts?.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell>{account.bank}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.no}</TableCell>
                    <TableCell>{account.interest}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.opening)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.cr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.dr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                    <TableCell colSpan={4}>Total CC Account Transaction</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCCOpening)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCCCr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCCDr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCCBalance)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Savings Accounts</CardTitle>
              <CardDescription>Summary of all savings accounts.</CardDescription>
            </div>
            <Dialog open={isSavingsDialogOpen} onOpenChange={setIsSavingsDialogOpen}>
                <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
                </DialogTrigger>
                <AccountForm type="savings" onAdd={() => handleAddAccount('savings')} onOpenChange={setIsSavingsDialogOpen} />
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Account No</TableHead>
                  <TableHead className="text-right">Opening</TableHead>
                  <TableHead className="text-right">CR</TableHead>
                  <TableHead className="text-right">DR</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingSavings ? (
                   <TableRow><TableCell colSpan={7} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
                ) : savingsAccounts?.map((account, index) => (
                  <TableRow key={index}>
                    <TableCell>{account.bank}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.no}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.opening)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.cr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.dr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
                <TableFooter>
                    <TableRow className="font-bold">
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalSavingsOpening)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalSavingsCr)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalSavingsDr)}</TableCell>
                        <TableCell className="text-right font-mono">{formatCurrency(totalSavingsBalance)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

    