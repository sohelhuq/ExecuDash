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
import { PlusCircle, Sparkles, Loader2 } from 'lucide-react';
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
import { suggestAlertThreshold, type SuggestAlertThresholdOutput } from '@/ai/flows/automated-alert-suggestions';
import { useToast } from '@/hooks/use-toast';

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
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const { toast } = useToast();

  const businessUnits = Array.from(new Set(initialAlerts.map(a => a.unit)));
  const metricsByUnit: Record<string, string[]> = {
    "Setu Filling Station": ["fuel_stock", "total_sales", "customer_traffic"],
    "Hotel Midway": ["guest_rating", "occupancy_rate", "revenue_per_room"],
    "Setu Tech": ["uptime", "new_tickets", "resolved_tickets"],
    "Huq Bricks": ["defect_rate", "production_volume", "orders_filled"],
    "Video Tara Pharmacy": ["expiry_within_30d", "stock_levels", "daily_sales"],
  };

  const handleAddAlert = () => {
    if (newAlert.unit && newAlert.metric && newAlert.condition && newAlert.severity) {
      setAlerts(prev => [...prev, newAlert as Alert]);
      setNewAlert({});
      setOpen(false);
       toast({
        title: "Alert Created",
        description: `New alert for ${newAlert.metric} has been successfully created.`,
      });
    } else {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill out all fields to create an alert.",
        });
    }
  };

  const handleSuggestion = async () => {
    if (!newAlert.unit || !newAlert.metric) {
      toast({
        variant: 'destructive',
        title: 'Selection Required',
        description: 'Please select a business unit and a metric before suggesting.',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      // Dummy historical data for demonstration purposes
      const historicalData = JSON.stringify([
        { timestamp: '2024-07-01', value: 100 },
        { timestamp: '2024-07-02', value: 105 },
        { timestamp: '2024-07-03', value: 98 },
        { timestamp: '2024-07-04', value: 110 },
      ]);
      const result = await suggestAlertThreshold({
        businessUnit: newAlert.unit,
        metric: newAlert.metric,
        historicalData: historicalData,
      });

      setNewAlert(prev => ({
        ...prev,
        condition: `${result.operator} ${result.threshold}`,
        severity: result.severity as Alert['severity']
      }));

       toast({
        title: "AI Suggestion Applied",
        description: "The suggested alert parameters have been filled in the form.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Suggestion Failed',
        description: 'Could not generate an AI suggestion at this time.',
      });
    } finally {
      setIsSuggesting(false);
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
          <Dialog open={open} onOpenChange={(isOpen) => {
              setOpen(isOpen);
              if (!isOpen) setNewAlert({});
          }}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Alert Rule</DialogTitle>
                <DialogDescription>
                  Set up a new alert to monitor a business metric. Use AI to get a suggestion.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="business-unit" className="text-right">
                    Business Unit
                  </Label>
                  <Select 
                    value={newAlert.unit}
                    onValueChange={(value) => setNewAlert(prev => ({...prev, unit: value, metric: undefined}))}>
                    <SelectTrigger id="business-unit" className="col-span-3">
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
                  <Select
                    value={newAlert.metric}
                    onValueChange={(value) => setNewAlert(prev => ({...prev, metric: value}))}
                    disabled={!newAlert.unit}
                  >
                    <SelectTrigger id="metric" className="col-span-3">
                      <SelectValue placeholder="Select a metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {(metricsByUnit[newAlert.unit || ''] || []).map(metric => (
                        <SelectItem key={metric} value={metric}>{metric.replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="condition" className="text-right">
                    Condition
                  </Label>
                  <Input id="condition" value={newAlert.condition || ''} placeholder="e.g., < 500" className="col-span-3" onChange={(e) => setNewAlert(prev => ({...prev, condition: e.target.value}))}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="severity" className="text-right">
                    Severity
                  </Label>
                  <Select value={newAlert.severity} onValueChange={(value: Alert['severity']) => setNewAlert(prev => ({...prev, severity: value}))}>
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
                <Button variant="outline" onClick={handleSuggestion} disabled={isSuggesting || !newAlert.unit || !newAlert.metric}>
                  {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Suggest
                </Button>
                <div className="flex-grow"></div>
                <DialogClose asChild>
                   <Button variant="ghost">Cancel</Button>
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
                    <TableCell>{alert.metric.replace(/_/g, ' ')}</TableCell>
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
