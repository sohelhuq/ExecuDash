'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Droplet, Wind, Banknote, Users, Thermometer, Gauge, Truck, PlusCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

type BusinessUnit = { id: string; name: string; location: string; };
type MeterReading = { id: string; productName: string; readingType: 'nozzle' | 'dip'; readingValue: number; timestamp: Timestamp; };
type StockItem = { id: string; productName: string; openingStock: number; purchase: number; sales: number; };
type Transaction = { id: string; date: Timestamp; description: string; type: 'income' | 'expense'; amount: number; };

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;
const formatLitre = (value: number) => `${new Intl.NumberFormat('en-BD').format(value)} L`;
const formatKg = (value: number) => `${new Intl.NumberFormat('en-BD').format(value)} kg`;

const readingFormSchema = z.object({
  productName: z.string().min(1, "Product is required"),
  readingType: z.enum(['nozzle', 'dip']),
  readingValue: z.coerce.number().min(0, "Reading must be positive"),
});
type ReadingFormData = z.infer<typeof readingFormSchema>;

const kpis = [
  { title: "Today's Sales", value: 450000, change: "+5%", icon: Banknote },
  { title: "Fuel Stock", value: 15000, unit: 'L', icon: Droplet },
  { title: "LPG Stock", value: 2500, unit: 'kg', icon: Package },
  { title: "CNG Pressure", value: 2900, unit: 'psi', icon: Wind },
];

export default function UnitDashboardPage({ params }: { params: { unitId: string } }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isReadingDialogOpen, setReadingDialogOpen] = React.useState(false);

  const unitRef = useMemoFirebase(() => user ? doc(firestore, `users/${user.uid}/businessUnits`, params.unitId) : null, [firestore, user, params.unitId]);
  const { data: unit, isLoading: unitLoading } = useDoc<BusinessUnit>(unitRef);

  const readingsRef = useMemoFirebase(() => unitRef ? collection(unitRef, 'meterReadings') : null, [unitRef]);
  const { data: readings, isLoading: readingsLoading } = useCollection<MeterReading>(readingsRef);

  const stockRef = useMemoFirebase(() => unitRef ? collection(unitRef, 'stockItems') : null, [unitRef]);
  const { data: stockItems, isLoading: stockLoading } = useCollection<StockItem>(stockRef);

  const transactionsRef = useMemoFirebase(() => unitRef ? collection(unitRef, 'transactions') : null, [unitRef]);
  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsRef);
  
  const readingForm = useForm<ReadingFormData>({
    resolver: zodResolver(readingFormSchema),
    defaultValues: { readingType: 'nozzle' },
  });

  const handleAddReading = async (values: ReadingFormData) => {
    if (!readingsRef) return;
    try {
      await addDoc(readingsRef, { ...values, productId: values.productName.toLowerCase().replace(' ', '-'), timestamp: Timestamp.now() });
      toast({ title: 'Success', description: 'Meter reading added.' });
      readingForm.reset();
      setReadingDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add reading.' });
    }
  };

  if (unitLoading) {
    return <AppShell><p>Loading Business Unit...</p></AppShell>;
  }

  if (!unit) {
    return <AppShell><p>Business Unit not found.</p></AppShell>;
  }
  
  const calculateStock = (item: StockItem) => item.openingStock + item.purchase - item.sales;

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{unit.name}</h1>
          <p className="text-muted-foreground">Master dashboard for {unit.location}.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kpi.title.includes("Sales") ? formatCurrency(kpi.value) : `${kpi.value.toLocaleString()} ${kpi.unit}`}
                </div>
                {kpi.change && <p className="text-xs text-muted-foreground">{kpi.change} from last day</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overall">
          <TabsList>
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="readings">Daily Readings</TabsTrigger>
            <TabsTrigger value="fuel">Fuel</TabsTrigger>
            <TabsTrigger value="cng">CNG</TabsTrigger>
            <TabsTrigger value="lpg">LPG</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="space-y-6 mt-4">
             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Stock Levels</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                         {stockLoading && <p>Loading stock...</p>}
                         {stockItems?.map(item => {
                            const available = calculateStock(item);
                            const capacity = item.openingStock + item.purchase;
                            const percentage = capacity > 0 ? (available / capacity) * 100 : 0;
                            return (
                                <div key={item.id}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{item.productName}</span>
                                        <span className="text-sm text-muted-foreground">{formatLitre(available)} / {formatLitre(capacity)}</span>
                                    </div>
                                    <Progress value={percentage} />
                                </div>
                            )
                         })}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                               {transactionsLoading && <TableRow><TableCell>Loading...</TableCell></TableRow>}
                               {transactions?.slice(0, 5).map(trx => (
                                <TableRow key={trx.id}>
                                    <TableCell>
                                        <div className="font-medium">{trx.description}</div>
                                        <div className="text-sm text-muted-foreground">{format(trx.date.toDate(), 'PPP')}</div>
                                    </TableCell>
                                    <TableCell className={`text-right font-semibold ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                                    </TableCell>
                                </TableRow>
                               ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="readings" className="space-y-6 mt-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Daily Meter/Dip Readings</CardTitle>
                  <CardDescription>Log and view nozzle and dip readings.</CardDescription>
                </div>
                 <Dialog open={isReadingDialogOpen} onOpenChange={setReadingDialogOpen}>
                  <DialogTrigger asChild><Button><PlusCircle className="w-4 h-4 mr-2"/>Add Reading</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add New Reading</DialogTitle></DialogHeader>
                    <Form {...readingForm}>
                      <form onSubmit={readingForm.handleSubmit(handleAddReading)} className="space-y-4">
                        <FormField control={readingForm.control} name="productName" render={({field}) => (<FormItem><FormLabel>Product</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a product"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Petrol">Petrol</SelectItem><SelectItem value="Diesel">Diesel</SelectItem><SelectItem value="Octane">Octane</SelectItem><SelectItem value="CNG">CNG</SelectItem><SelectItem value="LPG">LPG</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                        <FormField control={readingForm.control} name="readingType" render={({field}) => (<FormItem><FormLabel>Reading Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="nozzle">Nozzle</SelectItem><SelectItem value="dip">Dip</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                        <FormField control={readingForm.control} name="readingValue" render={({field}) => (<FormItem><FormLabel>Reading Value</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                        <DialogFooter><Button type="submit">Save Reading</Button></DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                 </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Reading</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {readingsLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading readings...</TableCell></TableRow>}
                    {readings?.map(r => (
                      <TableRow key={r.id}>
                        <TableCell>{format(r.timestamp.toDate(), 'PPp')}</TableCell>
                        <TableCell>{r.productName}</TableCell>
                        <TableCell>{r.readingType}</TableCell>
                        <TableCell className="text-right font-mono">{r.readingValue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="fuel" className="mt-4"><Card><CardHeader><CardTitle>Fuel Sector</CardTitle></CardHeader><CardContent><p>Details about Fuel (Petrol, Diesel, Octane) will be shown here.</p></CardContent></Card></TabsContent>
          <TabsContent value="cng" className="mt-4"><Card><CardHeader><CardTitle>CNG Sector</CardTitle></CardHeader><CardContent><p>Details about CNG will be shown here.</p></CardContent></Card></TabsContent>
          <TabsContent value="lpg" className="mt-4"><Card><CardHeader><CardTitle>LPG Sector</CardTitle></CardHeader><CardContent><p>Details about LPG will be shown here.</p></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
