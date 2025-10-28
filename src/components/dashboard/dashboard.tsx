'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  Package,
  Users,
  Archive,
  Bell,
  LineChart,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Warehouse,
  FileText,
  Fuel,
  Loader2,
  Banknote as BanknoteIcon,
  PiggyBank,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { businessUnits } from "@/lib/business-units";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ICONS: { [key: string]: React.ElementType } = {
  DollarSign,
  Package,
  Users,
  Archive,
  Bell,
  LineChart,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Warehouse,
  FileText,
  Fuel,
};

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const salesDistributionColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
];

type Kpi = {
    id: string;
    title: string;
    value: string;
    change: string;
    icon: string;
};

type RevenueTrend = {
    id: string;
    month: string;
    revenue: number;
    order: number;
};

type Invoice = {
    id: string;
    unit: string;
    amount: number;
}

type Alert = {
    id: string;
    metric: string;
    condition: string;
    severity: 'High' | 'Medium' | 'Low';
}

type BankDeposit = {
    amount: number;
    date: any;
    reference?: string;
};


export function Dashboard() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [depositOpen, setDepositOpen] = React.useState(false);
    const [depositAmount, setDepositAmount] = React.useState('');
    const [depositReference, setDepositReference] = React.useState('');

    const kpisCollection = useMemoFirebase(() => firestore ? collection(firestore, 'kpis') : null, [firestore]);
    const { data: kpiData, isLoading: isLoadingKpis } = useCollection<Kpi>(kpisCollection);

    const revenueTrendsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'revenue_trends'), orderBy('order')) : null, [firestore]);
    const { data: revenueData, isLoading: isLoadingRevenue } = useCollection<RevenueTrend>(revenueTrendsQuery);

    const invoicesCollection = useMemoFirebase(() => firestore ? collection(firestore, 'invoices') : null, [firestore]);
    const { data: invoiceData, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesCollection);
    
    const lowStockAlertsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'alerts'), where('severity', 'in', ['High', 'Medium'])) : null, [firestore]);
    const { data: lowStockAlerts, isLoading: isLoadingAlerts } = useCollection<Alert>(lowStockAlertsQuery);

    const bankDepositsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'bank_deposits') : null, [firestore]);

    const salesDistributionData = React.useMemo(() => {
        if (!invoiceData) return [];
        const salesByUnit = invoiceData.reduce((acc, invoice) => {
            if (!acc[invoice.unit]) {
                acc[invoice.unit] = 0;
            }
            acc[invoice.unit] += invoice.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(salesByUnit).map(([name, value], index) => ({
            name,
            value,
            color: salesDistributionColors[index % salesDistributionColors.length],
        }));
    }, [invoiceData]);
    
    const handleCashflow = () => {
        toast({
            title: "Daily Cashflow",
            description: "Today's cashflow summary will be displayed here.",
        });
    };

    const handleDeposit = () => {
        if (!bankDepositsCollection || !depositAmount) {
             toast({
                variant: "destructive",
                title: "Invalid Input",
                description: "Please enter a valid deposit amount.",
            });
            return;
        }

        const newDeposit: BankDeposit = {
            amount: parseFloat(depositAmount),
            date: serverTimestamp(),
            reference: depositReference,
        };

        addDocumentNonBlocking(bankDepositsCollection, newDeposit);

        toast({
            title: "Deposit Recorded",
            description: `A deposit of ৳${depositAmount} has been recorded.`,
        });

        setDepositAmount('');
        setDepositReference('');
        setDepositOpen(false);
    };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Main Dashboard</h1>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleCashflow}>
                    <BanknoteIcon className="mr-2 h-4 w-4" />
                    Daily Cashflow
                </Button>
                <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PiggyBank className="mr-2 h-4 w-4" />
                            Deposit to Bank
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Bank Deposit</DialogTitle>
                            <DialogDescription>Enter the details of the deposit below.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Amount</Label>
                                <Input 
                                    id="amount" 
                                    type="number" 
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="e.g., 50000"
                                    className="col-span-3"
                                />
                            </div>
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reference" className="text-right">Reference</Label>
                                <Input 
                                    id="reference" 
                                    value={depositReference}
                                    onChange={(e) => setDepositReference(e.target.value)}
                                    placeholder="Optional: e.g., daily sales"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button onClick={handleDeposit}>Save Deposit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingKpis ? (
            Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-3/4 rounded-md bg-muted animate-pulse"></div>
                        <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse mt-2"></div>
                    </CardContent>
                </Card>
            ))
        ) : (
          kpiData?.map((kpi) => {
              const Icon = ICONS[kpi.icon] || DollarSign;
              return (
                <Card key={kpi.title} className="border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </CardContent>
                </Card>
            )})
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/60">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoadingRevenue ? <div className="flex justify-center items-center h-[250px]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> : (
             <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={revenueData || []}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                    >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `৳${Number(value)/1000}k`}
                     />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                    <Area
                        dataKey="revenue"
                        type="natural"
                        fill="var(--color-revenue)"
                        fillOpacity={0.1}
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-border/60">
          <CardHeader>
            <CardTitle>Sales Distribution by Unit</CardTitle>
          </CardHeader>
          <CardContent>
          {isLoadingInvoices ? <div className="flex justify-center items-center h-[250px]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> : (
            <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                    <Pie
                        data={salesDistributionData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        strokeWidth={2}
                    >
                         {salesDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                        ))}
                    </Pie>
                    <Legend
                        content={({ payload }) => (
                            <ul className="flex flex-wrap gap-x-4 justify-center">
                            {payload?.map((entry, index) => (
                                <li key={`item-${index}`} className="flex items-center gap-2 text-xs">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span>{entry.value}</span>
                                </li>
                            ))}
                            </ul>
                        )}
                    />
                </PieChart>
            </ChartContainer>
             )}
          </CardContent>
        </Card>
      </div>

       <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingAlerts ? (
                    <TableRow><TableCell colSpan={2} className="text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground"/></TableCell></TableRow>
                ) : (
                    lowStockAlerts?.map((alert) => (
                    <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.metric.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                        <span className={`flex items-center gap-2 ${alert.severity === 'High' ? 'text-red-500' : 'text-yellow-400'}`}>
                            <span className="h-2 w-2 rounded-full bg-current"></span>
                            {alert.severity}
                        </span>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}

    