'use client';
import { AppShell } from '@/components/layout/app-shell';
import { businessUnits, type BusinessUnit } from '@/lib/business-units';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


export default function BusinessUnitPage({ params }: { params: { businessUnit: string } }) {
  const unit = businessUnits.find(u => u.id === params.businessUnit);

  if (!unit) {
    notFound();
  }

  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{unit.name}</h1>
          <p className="text-muted-foreground">{unit.description}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {unit.kpis.map((kpi) => (
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
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Revenue and profit over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={unit.timeSeriesData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                    >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickFormatter={(value) => formatCurrency(Number(value) / 1000) + 'k'}
                     />
                    <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => formatCurrency(Number(value))}/>} />
                    <Legend />
                    <Area
                        dataKey="revenue"
                        type="natural"
                        fill="var(--color-revenue)"
                        fillOpacity={0.4}
                        stroke="var(--color-revenue)"
                        stackId="a"
                    />
                    <Area
                        dataKey="profit"
                        type="natural"
                        fill="var(--color-profit)"
                        fillOpacity={0.4}
                        stroke="var(--color-profit)"
                        stackId="a"
                    />
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>A log of the most recent financial activities.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {unit.transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell>{format(new Date(txn.date), 'dd MMM, yyyy')}</TableCell>
                                <TableCell className="font-medium">{txn.description}</TableCell>
                                <TableCell>
                                    <Badge variant={txn.type === 'income' ? 'default' : 'destructive'} className={txn.type === 'income' ? 'bg-green-500/20 text-green-700' : ''}>
                                        {txn.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className={`text-right font-mono ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(txn.amount)}
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