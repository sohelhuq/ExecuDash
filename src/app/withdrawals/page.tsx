'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const withdrawalRequests = [
  { id: 'wd1', amount: 15000, status: "Pending", requestDate: "2024-07-28", processedDate: "" },
  { id: 'wd2', amount: 50000, status: "Approved", requestDate: "2024-07-15", processedDate: "2024-07-16" },
  { id: 'wd3', amount: 20000, status: "Rejected", requestDate: "2024-07-10", processedDate: "2024-07-11" },
  { id: 'wd4', amount: 35000, status: "Approved", requestDate: "2024-06-25", processedDate: "2024-06-26" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function WithdrawalsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Withdrawal Requests</h1>
            <p className="text-muted-foreground">Request and track your commission withdrawals.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Withdrawal Request</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>A log of all your past and pending withdrawal requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Processed Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.requestDate}</TableCell>
                    <TableCell>{req.processedDate || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(req.amount)}</TableCell>
                    <TableCell className="text-right">
                       <Badge 
                        variant={req.status === 'Approved' ? 'default' : 'secondary'}
                        className={
                            req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }
                      >
                        {req.status}
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
