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
import { CheckCircle, Circle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const officer = {
  name: 'Ahmed Rahman',
  avatarId: 'officer-avatar',
};

const assignedAccounts = [
  { unit: 'Glebal Corp', customer: 'Invoice ID', invoice: 'Teeam', dueDate: 'Tesafil', amountDue: 15331065, status: 'Pending' },
  { unit: 'Fuel', customer: 'Panys Fast', invoice: 'INV-005', dueDate: '2024-07-20', amountDue: 20000, status: 'Overdue' },
  { unit: 'Status Feed', customer: 'Panys Fast', invoice: 'INV-006', dueDate: '2024-07-25', amountDue: 23173, status: 'Pending' },
  { unit: 'Skabsa Pusskc', customer: '789-408', invoice: 'INV-007', dueDate: '2024-08-01', amountDue: 229168, status: 'Pending' },
];

const responsibilities = [
    { task: "Monitored Invoices (Daily)", completed: true },
    { task: "Monitor High-Value Clients (Weekly)", completed: true },
    { task: "Generate Weekly Collections Report (Friday PM)", completed: true },
    { task: "Follow-up Payment Plans (Bi-weekly)", completed: false },
]

export default function CollectionsPage() {
  const officerAvatar = PlaceHolderImages.find((p) => p.id === officer.avatarId);
  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Due Collection Monitoring & Assignment</h1>
            <p className="text-muted-foreground">Centralized Performance Hub</p>
          </div>
          <Button variant="outline" className="bg-primary/90 text-primary-foreground border-primary-foreground/20 hover:bg-primary">Assign Officer</Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <Card className="bg-card/80 border-border/60">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                 {officerAvatar && <Avatar className="w-20 h-20 mb-4 border-2 border-primary">
                    <AvatarImage src={officerAvatar.imageUrl} alt={officer.name} data-ai-hint={officerAvatar.imageHint} />
                    <AvatarFallback>{officer.name.charAt(0)}</AvatarFallback>
                </Avatar>}
                <p className="text-sm text-muted-foreground">Responsible Officer:</p>
                <p className="text-lg font-semibold">{officer.name}</p>
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
                <CardTitle>{officer.name} - Job Responsibilities & Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  {responsibilities.map((item, index) => (
                     <li key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                       <div className="flex items-center gap-4">
                         <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${item.completed ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground' }`}>{index + 1}</div>
                         <span className={item.completed ? 'text-foreground' : 'text-muted-foreground'}>{item.task}</span>
                       </div>
                       {item.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground/50" />}
                     </li>
                  ))}
                </ul>
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
                        {assignedAccounts.map((account, index) => (
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
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
