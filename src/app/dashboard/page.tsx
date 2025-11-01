'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Banknote, Users, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const kpiData = [
  { title: "Total Agents", value: "125", icon: Users, color: "text-blue-500" },
  { title: "Approved Customers", value: "2,350", icon: CheckCircle, color: "text-green-500" },
  { title: "Pending Customers", value: "150", icon: Clock, color: "text-yellow-500" },
  { title: "Total Commission", value: "৳450,800", icon: Banknote, color: "text-indigo-500" },
];

const recentActivities = [
  { id: 'act1', description: "New customer 'ABC Corp' registered by Agent Rahim.", time: "10 minutes ago" },
  { id: 'act2', description: "Withdrawal request for ৳15,000 approved for Agent Fatima.", time: "1 hour ago" },
  { id: 'act3', description: "Customer 'GHI Solutions' status changed to Rejected.", time: "3 hours ago" },
  { id: 'act4', description: "Agent Karim just signed in.", time: "Yesterday" },
  { id: 'act5', description: "New agent 'Rehana' joined the team.", time: "Yesterday" },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the agent management command center.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of the most recent activities in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                     <TableBody>
                        {recentActivities.map(activity => (
                            <TableRow key={activity.id}>
                                <TableCell>
                                    <div className="font-medium">{activity.description}</div>
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {activity.time}
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
