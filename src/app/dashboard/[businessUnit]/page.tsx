
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useCollection, useDoc, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { Loader2, DollarSign, Banknote, Landmark, TrendingUp, Archive, Package, UserPlus, Fuel, ShoppingCart, ArrowRightLeft, Factory, Receipt, Pill, Droplet, Flame, PlusCircle, Gauge, Users, CalendarClock } from 'lucide-react';
import type { BusinessUnit, FuelProduct, CngProduct, LpgProduct, MeterReading } from '@/lib/business-units-types';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ICONS: { [key: string]: React.ElementType } = {
  DollarSign, Banknote, Landmark, TrendingUp, Archive, Package, UserPlus, Fuel, ShoppingCart, ArrowRightLeft, Factory, Receipt, Pill, Droplet, Flame, Gauge, Users, CalendarClock,
};


export default function BusinessUnitPage() {
  const params = useParams();
  const businessUnitId = params.businessUnit as string;

  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [readingOpen, setReadingOpen] = React.useState(false);
  const [newReading, setNewReading] = React.useState<{product?: string, nozzle?: string, reading?: string}>({});

  const unitDocRef = useMemoFirebase(() => {
    return firestore ? doc(firestore, 'business_units', businessUnitId) : null;
  }, [firestore, businessUnitId]);
  const { data: unit, isLoading: isLoadingUnit } = useDoc<BusinessUnit>(unitDocRef);
  
  const readingsCollectionRef = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'business_units', businessUnitId, 'meter_readings') : null;
  }, [firestore, businessUnitId]);
  const { data: readings, isLoading: isLoadingReadings } = useCollection<MeterReading>(readingsCollectionRef);

  if (isLoadingUnit) {
    return (
        <AppShell>
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
        </AppShell>
    );
  }

  if (!unit) {
    notFound();
  }

  const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;
  
  const handleAddReading = () => {
    if (!readingsCollectionRef || !newReading.product || !newReading.nozzle || !newReading.reading) {
        toast({
            variant: "destructive",
            title: "Missing Fields",
            description: "Please fill out all fields for the reading.",
        });
        return;
    }

    const readingData = {
        product: newReading.product,
        nozzle: newReading.nozzle,
        reading: parseFloat(newReading.reading),
        timestamp: serverTimestamp(),
    };

    addDocumentNonBlocking(readingsCollectionRef, readingData);

    toast({
        title: "Reading Recorded",
        description: `New reading for ${newReading.nozzle} has been added.`,
    });
    setNewReading({});
    setReadingOpen(false);
  };

  const StockTable = ({ products, type }: { products: (FuelProduct | CngProduct | LpgProduct)[], type: 'Fuel' | 'CNG' | 'LPG' }) => (
    <Card>
      <CardHeader>
        <CardTitle>{type} Stock Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Purchase</TableHead>
              <TableHead className="text-right">Sale</TableHead>
              <TableHead>Available Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(product.purchase)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(product.sale)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={product.stockPercentage} className="h-2 w-24" />
                    <span className="text-xs text-muted-foreground">{product.stockPercentage}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{unit.name}</h1>
          <p className="text-muted-foreground">{unit.description}</p>
        </div>

        <Tabs defaultValue="overall" className="w-full">
          <TabsList>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="dailyReadings">Daily Readings</TabsTrigger>
            <TabsTrigger value="fuel">Fuel Sector</TabsTrigger>
            <TabsTrigger value="cng">CNG Sector</TabsTrigger>
            <TabsTrigger value="lpg">LPG Sector</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {unit.kpis?.map((kpi) => {
                const Icon = ICONS[kpi.icon] || DollarSign;
                return (
                    <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground">{kpi.change}</p>
                    </CardContent>
                    </Card>
                );
              })}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A log of the most recent financial activities across all sectors.</CardDescription>
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
                            {unit.transactions?.map((txn) => (
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
          </TabsContent>

          <TabsContent value="dailyReadings" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Daily Meter & Dip Readings</CardTitle>
                  <CardDescription>Enter and review daily readings from nozzles and tanks.</CardDescription>
                </div>
                <Dialog open={readingOpen} onOpenChange={setReadingOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" /> New Reading</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record New Reading</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                             <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="product" className="text-right">Product</Label>
                                <Select value={newReading.product} onValueChange={(value) => setNewReading(p => ({...p, product: value}))}>
                                    <SelectTrigger id="product" className="col-span-3"><SelectValue placeholder="Select product" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hsd">HSD</SelectItem>
                                        <SelectItem value="ms">MS</SelectItem>
                                        <SelectItem value="kml">KML</SelectItem>
                                        <SelectItem value="cng">CNG</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nozzle" className="text-right">Nozzle/Dip</Label>
                                <Input id="nozzle" value={newReading.nozzle || ''} onChange={(e) => setNewReading(p => ({...p, nozzle: e.target.value}))} className="col-span-3" placeholder="e.g., Nozzle 1, Tank 2 Dip" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="reading" className="text-right">Reading</Label>
                                <Input id="reading" type="number" value={newReading.reading || ''} onChange={(e) => setNewReading(p => ({...p, reading: e.target.value}))} className="col-span-3" placeholder="e.g., 12345.67" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                            <Button onClick={handleAddReading}>Save Reading</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>Product</TableHead><TableHead>Nozzle/Dip</TableHead><TableHead className="text-right">Reading</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {isLoadingReadings ? <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow> 
                        : readings?.map(r => (
                            <TableRow key={r.id}>
                                <TableCell>{format(r.timestamp.toDate(), 'dd MMM, yyyy HH:mm')}</TableCell>
                                <TableCell>{r.product.toUpperCase()}</TableCell>
                                <TableCell>{r.nozzle}</TableCell>
                                <TableCell className="text-right font-mono">{r.reading}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fuel" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">3</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tanks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">4</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Nozzles</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">12</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Salesmen</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">8</div></CardContent></Card>
            </div>
            {unit.fuelSector && <StockTable products={unit.fuelSector.products} type="Fuel" />}
          </TabsContent>

          <TabsContent value="cng" className="mt-4 space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Compressors</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">2</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Dispensers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">4</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Sales (Today)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(450000)}</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pressure</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">2800 PSI</div></CardContent></Card>
            </div>
             {unit.cngSector && <StockTable products={unit.cngSector.products} type="CNG" />}
          </TabsContent>

          <TabsContent value="lpg" className="mt-4 space-y-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Storage Tanks</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">3</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cylinder Types</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">4</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Sales (Today)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(180000)}</div></CardContent></Card>
                <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Safety Status</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">OK</div></CardContent></Card>
            </div>
             {unit.lpgSector && <StockTable products={unit.lpgSector.products} type="LPG" />}
          </TabsContent>

        </Tabs>
      </div>
    </AppShell>
  );
}
