'use client';
import *s React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const activities = [
  { id: 'log1', timestamp: "2024-07-29 10:05:15", actor: "Admin", action: "CUSTOMER_APPROVE", target: "XYZ Ltd", details: "Approved customer 'XYZ Ltd' for Agent Fatima." },
  { id: 'log2', timestamp: "2024-07-29 09:30:00", actor: "Fatima Ahmed", action: "WITHDRAWAL_REQUEST", target: "WD-0012", details: "Agent Fatima requested withdrawal of ৳15,000." },
  { id: 'log3', timestamp: "2024-07-28 16:45:20", actor: "Rahim Sheikh", action: "CUSTOMER_REGISTER", target: "New Client Inc.", details: "Agent Rahim registered 'New Client Inc.'." },
  { id: 'log4', timestamp: "2024-07-28 14:00:00", actor: "System", action: "COMMISSION_PAYOUT", target: "COM-0987", details: "Commission of ৳5,000 paid out to Rahim Sheikh." },
  { id: 'log5', timestamp: "2024-07-27 11:10:00", actor: "Admin", action: "AGENT_DEACTIVATE", target: "Karim Chowdhury", details: "Deactivated agent Karim Chowdhury." },
];

export default function ActivityLogPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground">A chronological record of all system events.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Shows all significant actions performed by users and the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.actor}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.details}</TableCell>
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
