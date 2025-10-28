'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import React from 'react';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const officer = {
  name: 'Ahmed Rahman',
  avatarId: 'officer-avatar',
};

type AssignedAccount = {
  unit: string;
  customer: string;
  invoice: string;
  dueDate: string;
  amountDue: number;
  status: 'Pending' | 'Overdue' | 'Paid';
};

type Responsibility = {
  task: string;
  completed: boolean;
};

export default function CollectionsPage() {
  const [officerState, setOfficerState] = React.useState(officer);
  const [open, setOpen] = React.useState(false);
  const [newOfficerName, setNewOfficerName] = React.useState('');
  const { toast } = useToast();
  
  const firestore = useFirestore();
  
  const accountsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'assigned_accounts') : null, [firestore]);
  const { data: assignedAccounts, isLoading: isLoadingAccounts } = useCollection<AssignedAccount>(accountsCollection);
  
  const responsibilitiesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'responsibilities') : null, [firestore]);
  const { data: responsibilities, isLoading: isLoadingResponsibilities } = useCollection<Responsibility>(responsibilitiesCollection);

  const officerAvatar = PlaceHolderImages.find((p) => p.id === officerState.avatarId);
  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;
  
  const handleAssignOfficer = () => {
    if (newOfficerName.trim()) {
      setOfficerState(prev => ({...prev, name: newOfficerName}));
      setNewOfficerName('');
      setOpen(false);
      toast({
        title: "Officer Assigned",
        description: `${newOfficerName} has been assigned as the new collections officer.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Please enter a name for the officer.",
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Due Collection Monitoring & Assignment</h1>
            <p className="text-muted-foreground">Centralized Performance Hub</p>
          </div>
           <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-primary/90 text-primary-foreground border-primary-foreground/20 hover:bg-primary">Assign Officer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign New Collections Officer</DialogTitle>
                    <DialogDescription>Enter the name of the new officer to assign them to this portfolio.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="officer-name" className="text-right">Name</Label>
                        <Input 
                            id="officer-name" 
                            value={newOfficerName}
                            onChange={(e) => setNewOfficerName(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. Jane Doe"
                         />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button onClick={handleAssignOfficer}>Assign</Button>
                </DialogFooter>
            </DialogContent>
           </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-card/80 border-border/60">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                 {officerAvatar && <Avatar className="w-20 h-20 mb-4 border-2 border-primary">
                    <AvatarImage src={officerAvatar.imageUrl} alt={officerState.name} data-ai-hint={officerAvatar.imageHint} />
                    <AvatarFallback>{officerState.name.charAt(0)}</AvatarFallback>
                </Avatar>}
                <p className="text-sm text-muted-foreground">Responsible Officer:</p>
                <p className="text-lg font-semibold">{officerState.name}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/60 text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-normal text-muted-foreground">Dedicated Dues: Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{formatCurrency(1450000)}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 border-border/60 text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-normal text-muted-foreground">Total Assigned Dues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(1450000)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-card/80 border-border/60 h-full">
              <CardHeader>
                <CardTitle>{officerState.name} - Job Responsibilities & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingResponsibilities ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                <ul className="space-y-4">
                  {responsibilities?.map((item, index) => (
                     <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                       <div className="flex items-center gap-4">
                         <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground' }`}>{index + 1}</div>
                         <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>{item.task}</span>
                       </div>
                       {item.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground/50" />}
                     </li>
                  ))}
                </ul>
                )}
                <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-muted-foreground">70% of Focus Collected</p>
                        <p className="text-sm font-medium text-amber-400">Pending</p>
                    </div>
                    <Progress value={70} className="h-2 [&>div]:bg-primary" />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Dec-23</span>
                        <span>Jan-24</span>
                        <span>Feb-29</span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-card/80 border-border/60">
            <CardHeader>
                <CardTitle>Assigned Accounts</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Unit</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Amount Due</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingAccounts ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                            </TableCell>
                          </TableRow>
                        ) : (
                        assignedAccounts?.map((account, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{account.unit}</TableCell>
                            <TableCell>{account.customer}</TableCell>
                            <TableCell>{account.invoice}</TableCell>
                            <TableCell>{account.dueDate}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(account.amountDue)}</TableCell>
                            <TableCell>
                                <Badge variant={account.status === 'Overdue' ? 'destructive' : 'secondary'} className={account.status === 'Pending' ? 'bg-accent/80 text-accent-foreground' : ''}>
                                    {account.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        )))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
