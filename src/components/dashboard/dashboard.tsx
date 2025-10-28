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

const kpiData = [
  {
    title: 'Daily Cashflow',
    value: '৳1,20,500',
    change: '+5.5% from yesterday',
    icon: DollarSign,
  },
  {
    title: 'Weekly Cashflow',
    value: '৳7,80,000',
    change: '-1.2% from last week',
    icon: DollarSign,
  },
  {
    title: 'Monthly Cashflow',
    value: '৳32,50,000',
    change: '+8.7% from last month',
    icon: DollarSign,
  },
  {
    title: "Outstanding Invoices",
    value: "45",
    change: "-3 from last week",
    icon: FileText,
  },
];

const revenueData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: 1400 },
    { month: "Apr", revenue: 1800 },
    { month: "May", revenue: 2100 },
    { month: "Jun", revenue: 2500 },
    { month: "Jul", revenue: 2400 },
    { month: "Aug", revenue: 2600 },
];

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const salesDistributionData = [
    { name: 'Fuel', value: 45, color: 'hsl(var(--chart-1))' },
    { name: 'ISP', value: 10, color: 'hsl(var(--chart-2))' },
    { name: 'Feed', value: 5, color: 'hsl(var(--chart-3))' },
    { name: 'Pharmacy', value: 20, color: 'hsl(var(--chart-4))' },
    { name: 'Bricks', value: 20, color: 'hsl(var(--chart-5))' },
];

const lowStockAlerts = [
    { item: 'Diesel Fuel', level: 'Low', color: 'text-yellow-400' },
    { item: 'Red Bricks', level: 'Critical', color: 'text-red-500' },
]


export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-border/60">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={revenueData}
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
                        tickFormatter={(value) => `$${Number(value)/1000}k`}
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
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 border-border/60">
          <CardHeader>
            <CardTitle>Sales Distribution by Unit</CardTitle>
          </CardHeader>
          <CardContent>
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
                                <span>{entry.value} {entry.payload.percent.toFixed(0)}%</span>
                                </li>
                            ))}
                            </ul>
                        )}
                    />
                </PieChart>
            </ChartContainer>
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
                {lowStockAlerts.map((alert) => (
                  <TableRow key={alert.item}>
                    <TableCell className="font-medium">{alert.item}</TableCell>
                    <TableCell>
                      <span className={`flex items-center gap-2 ${alert.color}`}>
                        <span className="h-2 w-2 rounded-full bg-current"></span>
                        {alert.level}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
