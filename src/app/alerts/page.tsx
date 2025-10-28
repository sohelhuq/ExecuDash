import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

const alerts = [
  { unit: "Setu Filling Station", metric: "fuel_stock", condition: "< 500 liters", severity: "High" },
  { unit: "Hotel Midway", metric: "guest_rating", condition: "< 3.5 stars", severity: "Medium" },
  { unit: "Setu Tech", metric: "uptime", condition: "< 99.9%", severity: "High" },
  { unit: "Huq Bricks", metric: "defect_rate", condition: "> 5%", severity: "Medium" },
  { unit: "Video Tara Pharmacy", metric: "expiry_within_30d", condition: "> 10 items", severity: "Low" },
];

export default function AlertsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alert Management</h1>
            <p className="text-muted-foreground">
              Create and manage automated alerts for your business units.
            </p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Alert
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Active Alert Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Unit</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.unit + alert.metric}>
                    <TableCell className="font-medium">{alert.unit}</TableCell>
                    <TableCell>{alert.metric}</TableCell>
                    <TableCell>{alert.condition}</TableCell>
                    <TableCell>
                      <Badge variant={alert.severity === 'High' ? 'destructive' : alert.severity === 'Medium' ? 'secondary' : 'default'}
                        className={alert.severity === 'Medium' ? 'bg-accent/80 text-accent-foreground' : ''}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
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
