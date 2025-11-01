'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const customers = [
  { id: 'cust1', name: "ABC Corporation", agent: "Rahim Sheikh", email: "contact@abccorp.com", status: "Approved", registrationDate: "2024-02-10" },
  { id: 'cust2', name: "XYZ Ltd", agent: "Rahim Sheikh", email: "info@xyz.com", status: "Pending", registrationDate: "2024-07-20" },
  { id: 'cust3', name: "DEF Industries", agent: "Fatima Ahmed", email: "accounts@def.com", status: "Approved", registrationDate: "2024-05-01" },
  { id: 'cust4', name: "GHI Solutions", agent: "Fatima Ahmed", email: "support@ghi.com", status: "Rejected", registrationDate: "2024-06-15" },
];

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Registration</h1>
            <p className="text-muted-foreground">Register new customers and view their status.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Register New Customer</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>A list of customers you have registered.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.registrationDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={customer.status === 'Approved' ? 'default' : 'secondary'}
                        className={
                            customer.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }
                      >
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={customer.status !== 'Pending'}>
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
