'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, writeBatch, doc } from 'firebase/firestore';
import { Database, TrendingUp, TrendingDown, Wallet, PlusCircle } from 'lucide-react';

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-BD').format(value)}`;

type RentalEntry = {
  id: string;
  category: 'shetue_vanga_dokan' | 'jaman_tower' | 'others';
  location: string;
  tenant: string;
  opening: number;
  rent: number;
  collection: number;
  expense: number;
};

type Summary = {
  opening: number;
  rent: number;
  total: number;
  collection: number;
  expense: number;
  due: number;
};

const calculateSummary = (data: RentalEntry[] | null): Summary => {
  if (!data) return { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 };
  return data.reduce(
    (acc, item) => {
      const total = (item.opening || 0) + (item.rent || 0);
      const due = total - (item.collection || 0);
      acc.opening += item.opening || 0;
      acc.rent += item.rent || 0;
      acc.total += total;
      acc.collection += item.collection || 0;
      acc.expense += item.expense || 0;
      acc.due += due;
      return acc;
    },
    { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 }
  );
};

const seedData: Omit<RentalEntry, 'id'>[] = [
    // Shetue Vanga Dokan
    { category: 'shetue_vanga_dokan', location: 'Shop-101', tenant: 'A-Rahim', opening: 5000, rent: 15000, collection: 18000, expense: 1200 },
    { category: 'shetue_vanga_dokan', location: 'Shop-102', tenant: 'B-Karim', opening: 0, rent: 15000, collection: 15000, expense: 500 },
    // Jaman Tower
    { category: 'jaman_tower', location: 'A-1', tenant: 'C-Ltd', opening: 20000, rent: 50000, collection: 70000, expense: 5000 },
    { category: 'jaman_tower', location: 'A-2', tenant: 'D-Corp', opening: 0, rent: 55000, collection: 50000, expense: 2500 },
    // Others
    { category: 'others', location: 'Warehouse-X', tenant: 'E-Ent', opening: 10000, rent: 30000, collection: 30000, expense: 3000 },
];

const RentTable = ({ title, data, isLoading }: { title: string, data: RentalEntry[] | null, isLoading: boolean }) => {
  const totals = calculateSummary(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead className="text-right">Opening</TableHead>
              <TableHead className="text-right">Rent</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Collection</TableHead>
              <TableHead className="text-right">Expense</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={8} className="text-center">Loading...</TableCell></TableRow>}
            {data?.map((item) => {
              const total = (item.opening || 0) + (item.rent || 0);
              const due = total - (item.collection || 0);
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.tenant}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.opening)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.rent)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(item.collection)}</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(item.expense)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(due)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="font-bold text-lg">Total</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(totals.opening)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(totals.rent)}</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(totals.total)}</TableCell>
              <TableCell className="text-right font-bold text-green-600">{formatCurrency(totals.collection)}</TableCell>
              <TableCell className="text-right font-bold text-red-600">{formatCurrency(totals.expense)}</TableCell>
              <TableCell className="text-right font-bold text-lg">{formatCurrency(totals.due)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};


export default function PropertiesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const baseCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/rentalEntries`) : null, [user, firestore]);
  
  const shetueVangaDokanQuery = useMemoFirebase(() => baseCollectionRef ? query(baseCollectionRef, where('category', '==', 'shetue_vanga_dokan')) : null, [baseCollectionRef]);
  const jamanTowerQuery = useMemoFirebase(() => baseCollectionRef ? query(baseCollectionRef, where('category', '==', 'jaman_tower')) : null, [baseCollectionRef]);
  const othersQuery = useMemoFirebase(() => baseCollectionRef ? query(baseCollectionRef, where('category', '==', 'others')) : null, [baseCollectionRef]);

  const { data: shetueData, isLoading: shetueLoading } = useCollection<RentalEntry>(shetueVangaDokanQuery);
  const { data: jamanData, isLoading: jamanLoading } = useCollection<RentalEntry>(jamanTowerQuery);
  const { data: othersData, isLoading: othersLoading } = useCollection<RentalEntry>(othersQuery);

  const handleSeedData = async () => {
    if (!baseCollectionRef || !firestore || !user) return;
    try {
        const batch = writeBatch(firestore);
        seedData.forEach(entry => {
            const docRef = doc(baseCollectionRef);
            batch.set(docRef, entry);
        });
        await batch.commit();
        toast({ title: "Success", description: "Demo rental data has been seeded." });
    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Error", description: "Could not seed data." });
    }
  }

  const shetueTotals = calculateSummary(shetueData);
  const jamanTotals = calculateSummary(jamanData);
  const othersTotals = calculateSummary(othersData);

  const grandTotals: Summary = {
    opening: shetueTotals.opening + jamanTotals.opening + othersTotals.opening,
    rent: shetueTotals.rent + jamanTotals.rent + othersTotals.rent,
    total: shetueTotals.total + jamanTotals.total + othersTotals.total,
    collection: shetueTotals.collection + jamanTotals.collection + othersTotals.collection,
    expense: shetueTotals.expense + jamanTotals.expense + othersTotals.expense,
    due: shetueTotals.due + jamanTotals.due + othersTotals.due,
  };
  
  const cashInHand = grandTotals.collection - grandTotals.expense;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties: Rent Collection & Due</h1>
            <p className="text-muted-foreground">As of {new Date().toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => toast({ description: "Functionality will be implemented here." })}><PlusCircle className="mr-2"/> Data Entry</Button>
            <Button variant="outline" onClick={handleSeedData}><Database className="mr-2"/> Seed Demo Data</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Opening Cash</CardTitle></CardHeader>
                <CardContent><p className="text-2xl font-bold">{formatCurrency(grandTotals.opening)}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Total Collection</CardTitle><TrendingUp className="w-4 h-4 text-muted-foreground"/></CardHeader>
                <CardContent><p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.collection)}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Total Expense</CardTitle><TrendingDown className="w-4 h-4 text-muted-foreground"/></CardHeader>
                <CardContent><p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.expense)}</p></CardContent>
            </Card>
             <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-medium">Cash in Hand</CardTitle><Wallet className="w-4 h-4 text-muted-foreground"/></CardHeader>
                <CardContent><p className="text-2xl font-bold">{formatCurrency(cashInHand)}</p></CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <RentTable title="Shetue Vanga Dokan" data={shetueData} isLoading={shetueLoading} />
            <RentTable title="Jaman Tower" data={jamanData} isLoading={jamanLoading} />
            <RentTable title="Others" data={othersData} isLoading={othersLoading} />

            <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle>Grand Total Summary</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow className="border-primary-foreground/20 hover:bg-primary/90">
                                <TableHead className="text-primary-foreground">Opening</TableHead>
                                <TableHead className="text-primary-foreground">Rent</TableHead>
                                <TableHead className="text-primary-foreground">Total</TableHead>
                                <TableHead className="text-primary-foreground">Collection</TableHead>
                                <TableHead className="text-primary-foreground">Expense</TableHead>
                                <TableHead className="text-primary-foreground">Due</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-0 font-bold text-lg hover:bg-primary/90">
                                <TableCell>{formatCurrency(grandTotals.opening)}</TableCell>
                                <TableCell>{formatCurrency(grandTotals.rent)}</TableCell>
                                <TableCell>{formatCurrency(grandTotals.total)}</TableCell>
                                <TableCell>{formatCurrency(grandTotals.collection)}</TableCell>
                                <TableCell>{formatCurrency(grandTotals.expense)}</TableCell>
                                <TableCell>{formatCurrency(grandTotals.due)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

      </div>
    </AppShell>
  );
}
