'use client';
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
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialAlerts = [
  { unit: "Setu Filling Station", metric: "fuel_stock", condition: "< 500 liters", severity: "High" },
  { unit: "Hotel Midway", metric: "guest_rating", condition: "< 3.5 stars", severity: "Medium" },
  { unit: "Setu Tech", metric: "uptime", condition: "< 99.9%", severity: "High" },
  { unit: "Huq Bricks", metric: "defect_rate", condition: "> 5%", severity: "Medium" },
  { unit: "Video Tara Pharmacy", metric: "expiry_within_30d", condition: "> 10 items", severity: "Low" },
];

type Alert = {
  unit: string;
  metric: string;
  condition: string;
  severity: 'High' | 'Medium' | 'Low';
};

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts);
  const [newAlert, setNewAlert] = React.useState<Partial<Alert>>({});
  const [open, setOpen] = React.useState(false);

  const businessUnits = Array.from(new Set(initialAlerts.map(a => a.unit)));

  const handleAddAlert = () => {
    if (newAlert.unit && newAlert.metric && newAlert.condition && newAlert.severity) {
      setAlerts(prev => [...prev, newAlert as Alert]);
      setNewAlert({});
      setOpen(false);
    }
  };

  const severityVariant = (severity: Alert['severity']) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'default';
    }
  };

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Alert Rule</DialogTitle>
                <DialogDescription>
                  Set up a new alert to monitor a business metric.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="business-unit" className="text-right">
                    Business Unit
                  </Label>
                  <Select onValueChange={(value) => setNewAlert(prev => ({...prev, unit: value}))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessUnits.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="metric" className="text-right">
                    Metric
                  </Label>
                  <Input id="metric" placeholder="e.g., fuel_stock" className="col-span-3" onChange={(e) => setNewAlert(prev => ({...prev, metric: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Condition
                  </Label>
                  <Input id="condition" placeholder="e.g., < 500" className="col-span-3" onChange={(e) => setNewAlert(prev => ({...prev, condition: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-right">
                    Severity
                  </Label>
                  <Select onValueChange={(value: Alert['severity']) => setNewAlert(prev => ({...prev, severity: value}))}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddAlert}>Create Alert</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                {alerts.map((alert, index) => (
                  <TableRow key={`${alert.unit}-${alert.metric}-${index}`}>
                    <TableCell className="font-medium">{alert.unit}</TableCell>
                    <TableCell>{alert.metric}</TableCell>
                    <TableCell>{alert.condition}</TableCell>
                    <TableCell>
                      <Badge variant={severityVariant(alert.severity)}
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