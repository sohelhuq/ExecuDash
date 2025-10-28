
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
import { Loader2, PlusCircle, Database, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { initialCcAccounts, initialSavingsAccounts } from '@/lib/banking-data';
import Link from 'next/link';


type Account = {
  bank: string;
  name: string;
  no: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
}

type CcAccount = Account & {
    interest?: number;
}

const defaultCcAccountState: Omit<CcAccount, 'balance'> = {
  bank: '',
  name: '',
  no: '',
  interest: 0,
  opening: 0,
  cr: 0,
  dr: 0,
};

const defaultSavingsAccountState: Omit<Account, 'balance'> = {
  bank: '',
  name: '',
  no: '',
  opening: 0,
  cr: 0,
  dr: 0,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function BankingPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = React.useState(false);

    const ccAccountsCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'cc_accounts') : null;
    }, [firestore]);
    const { data: ccAccounts, isLoading: isLoadingCc } = useCollection<CcAccount>(ccAccountsCollection);

    const savingsAccountsCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'savings_accounts') : null;
    }, [firestore]);
    const { data: savingsAccounts, isLoading: isLoadingSavings } = useCollection<Account>(savingsAccountsCollection);

    const [isCcDialogOpen, setIsCcDialogOpen] = React.useState(false);
    const [isSavingsDialogOpen, setIsSavingsDialogOpen] = React.useState(false);

    const [newCcAccount, setNewCcAccount] = React.useState<Omit<CcAccount, 'balance'>>(defaultCcAccountState);
    const [newSavingsAccount, setNewSavingsAccount] = React.useState<Omit<Account, 'balance'>>(defaultSavingsAccountState);
    
    const handleCcInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['opening', 'cr', 'dr', 'interest'].includes(name);
        setNewCcAccount(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleSavingsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['opening', 'cr', 'dr'].includes(name);
        setNewSavingsAccount(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) || 0 : value }));
    };

    const handleAddCcAccount = () => {
        const { bank, name, no, opening, cr, dr } = newCcAccount;
        if (!bank || !name || !no) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Bank, Account Name, and Account No are required.' });
            return;
        }

        const newEntry: CcAccount = { ...newCcAccount, balance: opening + dr - cr };
        
        if (ccAccountsCollection) {
          addDocumentNonBlocking(ccAccountsCollection, newEntry);
          toast({ title: 'Account Added', description: `${newCcAccount.name} has been successfully added.` });
          setIsCcDialogOpen(false);
          setNewCcAccount(defaultCcAccountState);
        }
    };
    
    const handleAddSavingsAccount = () => {
        const { bank, name, no, opening, cr, dr } = newSavingsAccount;
        if (!bank || !name || !no) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Bank, Account Name, and Account No are required.' });
            return;
        }

        const newEntry: Account = { ...newSavingsAccount, balance: opening + cr - dr };

        if (savingsAccountsCollection) {
          addDocumentNonBlocking(savingsAccountsCollection, newEntry);
          toast({ title: 'Account Added', description: `${newSavingsAccount.name} has been successfully added.` });
          setIsSavingsDialogOpen(false);
          setNewSavingsAccount(defaultSavingsAccountState);
        }
    };

    const seedData = async () => {
        if (!firestore) return;
        setIsSeeding(true);
        try {
            const ccSnapshot = await getDocs(collection(firestore, 'cc_accounts'));
            const savingsSnapshot = await getDocs(collection(firestore, 'savings_accounts'));

            if (!ccSnapshot.empty && !savingsSnapshot.empty) {
                toast({ title: 'Data Already Exists', description: 'Banking data has already been seeded.' });
                return;
            }

            const batch = writeBatch(firestore);

            if (ccSnapshot.empty) {
                initialCcAccounts.forEach((account) => {
                    const docRef = doc(collection(firestore, 'cc_accounts'));
                    batch.set(docRef, account);
                });
            }

            if (savingsSnapshot.empty) {
                initialSavingsAccounts.forEach((account) => {
                    const docRef = doc(collection(firestore, 'savings_accounts'));
                    batch.set(docRef, account);
                });
            }

            await batch.commit();
            toast({ title: 'Seeding Complete', description: `Initial banking records have been added.` });
        } catch (error) {
            console.error('Error seeding data:', error);
            toast({ variant: 'destructive', title: 'Seeding Failed', description: 'Could not seed banking data.' });
        } finally {
            setIsSeeding(false);
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

    const CcAccountForm = () => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New CC Account</DialogTitle>
                <DialogDescription>Enter the details for the new loan account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank" className="text-right">Bank</Label>
                    <Input id="bank" name="bank" value={newCcAccount.bank} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Account Name</Label>
                    <Input id="name" name="name" value={newCcAccount.name} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="no" className="text-right">Account No</Label>
                    <Input id="no" name="no" value={newCcAccount.no} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="interest" className="text-right">Interest %</Label>
                    <Input id="interest" name="interest" type="number" value={newCcAccount.interest} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="opening" className="text-right">Opening</Label>
                    <Input id="opening" name="opening" type="number" value={newCcAccount.opening} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr" className="text-right">CR (Deposits)</Label>
                    <Input id="cr" name="cr" type="number" value={newCcAccount.cr} onChange={handleCcInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dr" className="text-right">DR (Withdrawals)</Label>
                    <Input id="dr" name="dr" type="number" value={newCcAccount.dr} onChange={handleCcInputChange} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleAddCcAccount}>Add Account</Button>
            </DialogFooter>
        </DialogContent>
    );

    const SavingsAccountForm = () => (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add New Savings Account</DialogTitle>
                <DialogDescription>Enter the details for the new account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank" className="text-right">Bank</Label>
                    <Input id="bank" name="bank" value={newSavingsAccount.bank} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Account Name</Label>
                    <Input id="name" name="name" value={newSavingsAccount.name} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="no" className="text-right">Account No</Label>
                    <Input id="no" name="no" value={newSavingsAccount.no} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="opening" className="text-right">Opening</Label>
                    <Input id="opening" name="opening" type="number" value={newSavingsAccount.opening} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cr" className="text-right">CR</Label>
                    <Input id="cr" name="cr" type="number" value={newSavingsAccount.cr} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dr" className="text-right">DR</Label>
                    <Input id="dr" name="dr" type="number" value={newSavingsAccount.dr} onChange={handleSavingsInputChange} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleAddSavingsAccount}>Add Account</Button>
            </DialogFooter>
        </DialogContent>
    );

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banking Summary</h1>
            <p className="text-muted-foreground">An overview of your CC and Savings accounts.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/banking/deposits">
                <Button variant="outline">Bank Deposits <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
            <Button variant="outline" onClick={seedData} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Seed Data
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>CC (Loan) Account Transactions</CardTitle>
              <CardDescription>Summary of transactions for all Credit Card loan accounts.</CardDescription>
            </div>
            <Dialog open={isCcDialogOpen} onOpenChange={(isOpen) => {
                setIsCcDialogOpen(isOpen);
                if (!isOpen) setNewCcAccount(defaultCcAccountState);
            }}>
              <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
              </DialogTrigger>
              <CcAccountForm />
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
                  <TableHead className="text-right">CR (Deposits)</TableHead>
                  <TableHead className="text-right">DR (Withdrawals)</TableHead>
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
                    <TableCell>{account.interest ? `${account.interest}%` : 'N/A'}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.opening)}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">{formatCurrency(account.cr)}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">{formatCurrency(account.dr)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                    <TableCell colSpan={4}>Total CC Account Transaction</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(totalCCOpening)}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">{formatCurrency(totalCCCr)}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">{formatCurrency(totalCCDr)}</TableCell>
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
            <Dialog open={isSavingsDialogOpen} onOpenChange={(isOpen) => {
                setIsSavingsDialogOpen(isOpen);
                if (!isOpen) setNewSavingsAccount(defaultSavingsAccountState);
            }}>
                <DialogTrigger asChild>
                    <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
                </DialogTrigger>
                <SavingsAccountForm />
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
