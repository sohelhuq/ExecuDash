
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
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialCcAccounts = [
    { bank: 'UCB', name: 'Shetue Filling Station', no: '513', interest: '14.25%', opening: -20632117, cr: 67440735, dr: 57880318.85, balance: -11071701 },
    { bank: 'NCC', name: 'Shetue Feed Mills', no: '587', interest: '14.50%', opening: -25712932, cr: 13636000, dr: 13781431, balance: -25858363 },
    { bank: 'NCC', name: 'Shetue Feed Mills', no: '587 N', interest: '14.50%', opening: 0, cr: 0, dr: 0, balance: 0 },
    { bank: 'NCC', name: 'Shetue Plastic', no: '774', interest: '14.50%', opening: -2568923, cr: 1240000, dr: 6744392, balance: -8073315 },
    { bank: 'SIBL', name: 'Shetue Filling Station', no: '7107', interest: '15.50%', opening: -20176029, cr: 2370500, dr: 1356250, balance: -19161779 },
    { bank: 'UCB', name: 'Shetue CNG Refualing', no: '57', interest: '14.25%', opening: -3045911, cr: 17120703, dr: 17027616, balance: -2952824 },
    { bank: 'IDLC', name: 'IDLC', no: '1111', interest: '13.50%', opening: -941186, cr: 666960, dr: 9329, balance: -283555 },
    { bank: 'UCB', name: 'Hoque Brick', no: '433', interest: '14.25%', opening: -16116968, cr: 2274844, dr: 1101249, balance: -14943373 },
    { bank: 'NCC', name: 'Duplex House Loan', no: '999', interest: '12.00%', opening: -6973239, cr: 785000, dr: 416791, balance: -6605030 },
];

const initialSavingsAccounts = [
    { bank: 'UCB', name: 'Filling', no: '20', interest: '', opening: 6601186, cr: 3715000, dr: 11504100, balance: -1187914 },
    { bank: 'UCB', name: 'Sabikun', no: '2489', interest: '', opening: 2927, cr: 0, dr: 0, balance: 2927 },
    { bank: 'UCB', name: 'CNG', no: '249', interest: '', opening: 15866, cr: 0, dr: 0, balance: 15866 },
    { bank: 'UCB', name: 'Filling', no: '163', interest: '', opening: 1655, cr: 0, dr: 0, balance: 1655 },
    { bank: 'NCC', name: 'Fish Feed', no: '5894', interest: '', opening: 10650, cr: 0, dr: 0, balance: 10650 },
    { bank: 'NCC', name: 'Plastic', no: '8220', interest: '', opening: 2288, cr: 0, dr: 0, balance: 2288 },
    { bank: 'NCC', name: 'Sabikun', no: '556', interest: '', opening: 74627, cr: 79300, dr: 0, balance: 153927 },
    { bank: 'SIBL', name: 'Shaheb ulla trading', no: '603', interest: '', opening: 2496, cr: 0, dr: 0, balance: 2496 },
    { bank: 'SIBL', name: 'Shetue Trading', no: '507', interest: '', opening: 2384, cr: 0, dr: 0, balance: 2384 },
    { bank: 'UCB', name: 'Plastic', no: '2860', interest: '', opening: 1308, cr: 0, dr: 0, balance: 1308 },
    { bank: 'One bank', name: 'Jahirul', no: '668', interest: '', opening: 1352, cr: 0, dr: 0, balance: 1352 },
    { bank: 'IFIC', name: 'Shetue Filling Station', no: '0', interest: '', opening: 0, cr: 0, dr: 0, balance: 0 },
    { bank: 'Mercantile', name: 'CNG', no: '2786', interest: '', opening: 70215, cr: 0, dr: 0, balance: 70215 },
    { bank: 'Meghna', name: 'Filling', no: '121', interest: '', opening: 4533, cr: 0, dr: 0, balance: 4533 },
    { bank: 'Jamuna', name: 'Sabikun', no: '447', interest: '', opening: 26317, cr: 0, dr: 0, balance: 26317 },
    { bank: 'IFIC', name: 'Jahirul', no: '811', interest: '', opening: -490000, cr: 400000, dr: 600000, balance: -690000 },
    { bank: 'DBBL', name: 'Jahirul', no: '4578', interest: '', opening: 28770, cr: 500000, dr: 0, balance: 528770 },
    { bank: 'City', name: 'Jahirul', no: '001', interest: '', opening: 8832, cr: 0, dr: 0, balance: 8832 },
    { bank: 'Brac', name: 'Johirul', no: '9001', interest: '', opening: 154712, cr: 2835230, dr: 0, balance: 2989942 },
];

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

const defaultAccountState = {
  bank: '',
  name: '',
  no: '',
  interest: '',
  opening: 0,
  cr: 0,
  dr: 0,
  balance: 0,
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

export default function BankingPage() {
    const [ccAccounts, setCcAccounts] = React.useState(initialCcAccounts);
    const [savingsAccounts, setSavingsAccounts] = React.useState(initialSavingsAccounts);

    const [isCcDialogOpen, setIsCcDialogOpen] = React.useState(false);
    const [isSavingsDialogOpen, setIsSavingsDialogOpen] = React.useState(false);

    const [newAccount, setNewAccount] = React.useState<Omit<Account, 'balance'>>(defaultAccountState);
    const { toast } = useToast();
    
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

        if (type === 'cc') {
            setCcAccounts(prev => [...prev, newEntry]);
            setIsCcDialogOpen(false);
        } else {
            setSavingsAccounts(prev => [...prev, newEntry]);
            setIsSavingsDialogOpen(false);
        }
        
        toast({ title: 'Account Added', description: `${newAccount.name} has been successfully added.` });
        setNewAccount(defaultAccountState);
    };

    const totalCCOpening = ccAccounts.reduce((acc, curr) => acc + curr.opening, 0);
    const totalCCCr = ccAccounts.reduce((acc, curr) => acc + curr.cr, 0);
    const totalCCDr = ccAccounts.reduce((acc, curr) => acc + curr.dr, 0);
    const totalCCBalance = ccAccounts.reduce((acc, curr) => acc + curr.balance, 0);

    const totalSavingsOpening = savingsAccounts.reduce((acc, curr) => acc + curr.opening, 0);
    const totalSavingsCr = savingsAccounts.reduce((acc, curr) => acc + curr.cr, 0);
    const totalSavingsDr = savingsAccounts.reduce((acc, curr) => acc + curr.dr, 0);
    const totalSavingsBalance = savingsAccounts.reduce((acc, curr) => acc + curr.balance, 0);

    const AccountForm = ({ onAdd, type }: { onAdd: () => void; type: 'cc' | 'savings' }) => (
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
              <AccountForm type="cc" onAdd={() => handleAddAccount('cc')} />
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
                {ccAccounts.map((account, index) => (
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
                <AccountForm type="savings" onAdd={() => handleAddAccount('savings')} />
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
                {savingsAccounts.map((account, index) => (
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

