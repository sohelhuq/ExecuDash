'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, UserPlus, HandCoins } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const kpiData = [
  { title: "Total Commission", value: "৳250,500", change: "+15% this month", icon: DollarSign, color: "text-green-500" },
  { title: "New Customers", value: "32", change: "+5 this week", icon: UserPlus, color: "text-blue-500" },
  { title: "Pending Withdrawals", value: "৳45,000", change: "3 requests", icon: HandCoins, color: "text-yellow-500" },
  { title: "Active Agents", value: "12", change: "+1 this month", icon: Users },
];

const chartData = [
  { month: 'Jan', commission: 40000, customers: 24 },
  { month: 'Feb', commission: 30000, customers: 13 },
  { month: 'Mar', commission: 50000, customers: 38 },
  { month: 'Apr', commission: 47800, customers: 29 },
  { month: 'May', commission: 68900, customers: 48 },
  { month: 'Jun', commission: 53900, customers: 38 },
];

const recentActivities = [
  { id: 'act1', description: "Agent Rahim signed up a new customer: 'ABC Corp'", time: "10 minutes ago", type: "customer" },
  { id: 'act2', description: "Agent Fatima requested a withdrawal of ৳15,000", time: "1 hour ago", type: "withdrawal" },
  { id: 'act3', description: "Customer 'XYZ Ltd' registration was approved", time: "3 hours ago", type: "approval" },
  { id: 'act4', description: "You earned ৳5,000 commission from 'DEF Industries' transaction", time: "Yesterday", type: "commission" },
  { id: 'act5', description: "Agent Karim updated his profile information", time: "Yesterday", type: "profile" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your performance overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.color || 'text-muted-foreground'}`}>{kpi.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Commission earned and new customers acquired in the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                            <Tooltip formatter={(value: number, name: string) => name === 'commission' ? formatCurrency(value) : value} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="commission" fill="hsl(var(--primary))" name="Commission" />
                            <Bar yAxisId="right" dataKey="customers" fill="hsl(var(--chart-2))" name="New Customers" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>A log of the latest events in your network.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Activity</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentActivities.map(activity => (
                                <TableRow key={activity.id}>
                                    <TableCell>
                                        <div className="font-medium">{activity.description}</div>
                                        <Badge variant="outline" className="mt-1">{activity.type}</Badge>
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
      </div>
    </AppShell>
  );
}
