'use client';
import *s React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const agents = [
  { id: 'agt1', name: "Rahim Sheikh", email: "rahim@demo.com", phone: "01700000001", status: "Active", joiningDate: "2023-01-15", commissionRate: 5 },
  { id: 'agt2', name: "Fatima Ahmed", email: "fatima@demo.com", phone: "01800000002", status: "Active", joiningDate: "2023-03-20", commissionRate: 5.5 },
  { id: 'agt3', name: "Karim Chowdhury", email: "karim@demo.com", phone: "01900000003", status: "Inactive", joiningDate: "2022-11-10", commissionRate: 4.5 },
  { id: 'agt4', name: "Ayesha Khan", email: "ayesha@demo.com", phone: "01600000004", status: "Pending", joiningDate: "2024-07-25", commissionRate: 5 },
];

export default function AgentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
            <p className="text-muted-foreground">View, add, and manage agents in your network.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Agent</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent List</CardTitle>
            <CardDescription>A complete list of all agents currently in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Commission Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>
                        <div>{agent.email}</div>
                        <div className="text-sm text-muted-foreground">{agent.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={agent.status === 'Active' ? 'default' : 'secondary'}
                        className={
                            agent.status === 'Active' ? 'bg-green-100 text-green-800' :
                            agent.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }
                      >
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.joiningDate}</TableCell>
                    <TableCell>{agent.commissionRate}%</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
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
