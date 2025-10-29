'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, LineChart, TrendingDown, DollarSign, Archive, Flame, Truck, CircleDot, CheckCircle } from 'lucide-react';
import type { RawMaterial, ProductionBatch, FinishedGood } from '@/lib/erp-types';
import { Button } from '@/components/ui/button';

const kpiData = [
  { title: "Total Stock Value", title_bn: "মোট স্টক মূল্য", value: "৳2,500,000", icon: Package },
  { title: "Total Sales", title_bn: "মোট বিক্রয়", value: "৳1,800,000", icon: LineChart },
  { title: "Total Dues", title_bn: "মোট বকেয়া", value: "৳250,000", icon: TrendingDown },
  { title: "Raw Material Value", title_bn: "কাঁচামালের মূল্য", value: "৳500,000", icon: Archive },
];

const rawMaterials: RawMaterial[] = [
  { id: '1', name: 'Clay', name_bn: 'মাটি', stockLevel: 50, unit: 'ton', reorderLevel: 20, unitPrice: 1500 },
  { id: '2', name: 'Coal', name_bn: 'কয়লা', stockLevel: 100, unit: 'ton', reorderLevel: 50, unitPrice: 10000 },
  { id: '3', name: 'Sand', name_bn: 'বালি', stockLevel: 30, unit: 'truck', reorderLevel: 10, unitPrice: 3000 },
];

const productionBatches: ProductionBatch[] = [
  { id: 'B001', date: '2024-07-28', totalBricks: 100000, wastage: 6000, status: 'Completed' },
  { id: 'B002', date: '2024-07-29', totalBricks: 120000, wastage: 5500, status: 'In Kiln' },
  { id: 'B003', date: '2024-07-30', totalBricks: 95000, wastage: 4000, status: 'Completed' },
];

const finishedGoods: FinishedGood[] = [
  { id: 'FG01', grade: 'No. 1 Brick', grade_bn: 'নং ১ ইট', stock: 500000, price: 12.50 },
  { id: 'FG02', grade: 'Picket', grade_bn: 'পিকেট', stock: 200000, price: 9.00 },
  { id: 'FG03', grade: 'Jhama', grade_bn: 'ঝামা', stock: 80000, price: 6.00 },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN').format(value);

export default function ManufacturingDashboard() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bricks ERP Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of your construction material business.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title} / {kpi.title_bn}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Raw Materials Management (কাঁচামাল)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Material</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rawMaterials.map(mat => (
                                <TableRow key={mat.id}>
                                    <TableCell>
                                        <div className="font-medium">{mat.name}</div>
                                        <div className="text-sm text-muted-foreground">{mat.name_bn}</div>
                                    </TableCell>
                                    <TableCell>
                                        {mat.stockLevel < mat.reorderLevel ? (
                                            <Badge variant="destructive">Low: {mat.stockLevel} {mat.unit}</Badge>
                                        ) : (
                                            <span>{mat.stockLevel} {mat.unit}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">৳{formatCurrency(mat.stockLevel * mat.unitPrice)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Finished Goods Inventory (প্রস্তুতকৃত পণ্য)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Grade</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finishedGoods.map(good => (
                                <TableRow key={good.id}>
                                    <TableCell>
                                        <div className="font-medium">{good.grade}</div>
                                        <div className="text-sm text-muted-foreground">{good.grade_bn}</div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(good.stock)}</TableCell>
                                    <TableCell className="text-right font-mono">৳{formatCurrency(good.stock * good.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Production Module (উৎপাদন)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total Bricks</TableHead>
                            <TableHead>Wastage / ঝামা</TableHead>
                            <TableHead>Wastage %</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productionBatches.map(batch => {
                            const wastagePercent = (batch.wastage / batch.totalBricks) * 100;
                            return (
                                <TableRow key={batch.id}>
                                    <TableCell className="font-medium">{batch.id}</TableCell>
                                    <TableCell>{batch.date}</TableCell>
                                    <TableCell>{formatCurrency(batch.totalBricks)}</TableCell>
                                    <TableCell>{formatCurrency(batch.wastage)}</TableCell>
                                    <TableCell>
                                        {wastagePercent > 5 ? (
                                            <Badge variant="destructive">{wastagePercent.toFixed(2)}%</Badge>
                                        ) : (
                                            <span>{wastagePercent.toFixed(2)}%</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={batch.status === 'Completed' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                                            {batch.status === 'Completed' ? <CheckCircle className="h-3 w-3" /> : <CircleDot className="h-3 w-3" />}
                                            {batch.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
