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
  Fuel,
  Users,
  Activity,
  Bell,
  LineChart,
  ChevronRight,
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
    title: "Total Revenue",
    value: "৳45,231.89",
    change: "+20.1% from last month",
    icon: DollarSign,
  },
  {
    title: "Fuel Volume",
    value: "+2350 L",
    change: "+180.1% from last month",
    icon: Fuel,
  },
  {
    title: "Hotel Occupancy",
    value: "72%",
    change: "+19% from last month",
    icon: Users,
  },
  {
    title: "Tech Uptime",
    value: "99.98%",
    change: "+0.2% from last month",
    icon: Activity,
  },
];

const salesData = [
  { month: "Jan", "Filling Station": 4000, "CNG Station": 2400 },
  { month: "Feb", "Filling Station": 3000, "CNG Station": 1398 },
  { month: "Mar", "Filling Station": 2000, "CNG Station": 9800 },
  { month: "Apr", "Filling Station": 2780, "CNG Station": 3908 },
  { month: "May", "Filling Station": 1890, "CNG Station": 4800 },
  { month: "Jun", "Filling Station": 2390, "CNG Station": 3800 },
];

const chartConfig = {
  "Filling Station": {
    label: "Filling Station Sales",
    color: "hsl(var(--chart-1))",
  },
  "CNG Station": {
    label: "CNG Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
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

      <Card>
        <CardHeader>
          <CardTitle>Business Units</CardTitle>
          <CardDescription>Select a business unit to view its detailed financial performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessUnits.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.description}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/${unit.id}`} legacyBehavior>
                      <Button variant="ghost" size="sm">
                        Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Energy Sales Overview</CardTitle>
            <CardDescription>
              Sales comparison for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={salesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <RechartsTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Legend />
                <Bar
                  dataKey="Filling Station"
                  fill="var(--color-Filling Station)"
                  radius={4}
                />
                <Bar
                  dataKey="CNG Station"
                  fill="var(--color-CNG Station)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              A feed of recent alerts and system notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <Bell className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Alert: Fuel Stock Low</p>
                <p className="text-sm text-muted-foreground">
                  Setu Filling Station stock is at 450 liters.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/20">
                <Bell className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium">Critical: Pump Offline</p>
                <p className="text-sm text-muted-foreground">
                  Pump 2 at Setu CNG has been offline for 7 minutes.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                <LineChart className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Trend: Occupancy Up</p>
                <p className="text-sm text-muted-foreground">
                  Hotel Midway occupancy shows a positive 7-day trend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}