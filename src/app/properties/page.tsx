
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';


type RentEntry = {
  id: string;
  category: 'shetue_vanga_dokan' | 'jaman_tower' | 'others';
  location: string;
  tenant: string;
  opening: number;
  rent: number;
  total: number;
  collection: number;
  expense: number;
  due: number;
};

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN').format(value);

const RentTable = ({ title, data, isLoading }: { title: string, data: RentEntry[] | null, isLoading: boolean }) => {
  const totals = data?.reduce((acc, item) => ({
    opening: acc.opening + item.opening,
    rent: acc.rent + item.rent,
    total: acc.total + item.total,
    collection: acc.collection + item.collection,
    expense: acc.expense + item.expense,
    due: acc.due + item.due,
  }), { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 }) || { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 };

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
            {isLoading ? (
                <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground"/></TableCell></TableRow>
            ) : (
                data?.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.tenant}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.opening)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.rent)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.total)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.collection)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.expense)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(item.due)}</TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.opening)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.rent)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.total)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.collection)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.expense)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.due)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}

const SummaryCard = ({ title, value }: { title: string; value: string }) => (
    <Card className="text-center">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);


export default function PropertiesPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const vangaDokanQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'shetue_vanga_dokan')) : null, [firestore]);
    const { data: shetueVangaDokanData, isLoading: isLoadingVangaDokan } = useCollection<RentEntry>(vangaDokanQuery);

    const jamanTowerQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'jaman_tower')) : null, [firestore]);
    const { data: jamanTowerData, isLoading: isLoadingJamanTower } = useCollection<RentEntry>(jamanTowerQuery);

    const othersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'others')) : null, [firestore]);
    const { data: othersData, isLoading: isLoadingOthers } = useCollection<RentEntry>(othersQuery);

    const handleButtonClick = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `${action} functionality will be implemented here.`,
        });
    };

    const grandTotalOpening = (shetueVangaDokanData?.reduce((a,c) => a+c.opening, 0) || 0) + (jamanTowerData?.reduce((a,c) => a+c.opening, 0) || 0) + (othersData?.reduce((a,c) => a+c.opening, 0) || 0);
    const grandTotalRent = (shetueVangaDokanData?.reduce((a,c) => a+c.rent, 0) || 0) + (jamanTowerData?.reduce((a,c) => a+c.rent, 0) || 0) + (othersData?.reduce((a,c) => a+c.rent, 0) || 0);
    const grandTotalCollection = (shetueVangaDokanData?.reduce((a,c) => a+c.collection, 0) || 0) + (jamanTowerData?.reduce((a,c) => a+c.collection, 0) || 0) + (othersData?.reduce((a,c) => a+c.collection, 0) || 0);
    const grandTotalDue = (shetueVangaDokanData?.reduce((a,c) => a+c.due, 0) || 0) + (jamanTowerData?.reduce((a,c) => a+c.due, 0) || 0) + (othersData?.reduce((a,c) => a+c.due, 0) || 0);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rent Collection Dashboard</h1>
            <p className="text-muted-foreground">Vara collection & Due as of 31-12-24</p>
          </div>
          <Button size="lg" onClick={() => handleButtonClick('Data Entry')}>
              <FilePlus className="mr-2 h-5 w-5" />
              Data Entry
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title="Grand Total Opening" value={formatCurrency(grandTotalOpening)} />
            <SummaryCard title="Grand Total Rent" value={formatCurrency(grandTotalRent)} />
            <SummaryCard title="Grand Total Collection" value={formatCurrency(grandTotalCollection)} />
            <SummaryCard title="Grand Total Due" value={formatCurrency(grandTotalDue)} />
        </div>

        <div className="space-y-6">
            <RentTable title="Shetue Vanga Dokan Vara" data={shetueVangaDokanData} isLoading={isLoadingVangaDokan} />
            <RentTable title="Jaman Tower" data={jamanTowerData} isLoading={isLoadingJamanTower} />
            <RentTable title="Others" data={othersData} isLoading={isLoadingOthers} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Receipts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Particular</TableHead><TableHead className="text-right">Taka</TableHead></TableRow></TableHeader>
                        <TableBody>
                            <TableRow><TableCell>Opening cash</TableCell><TableCell className="text-right font-mono">{formatCurrency(602562)}</TableCell></TableRow>
                            <TableRow><TableCell>Total Collection</TableCell><TableCell className="text-right font-mono">{formatCurrency(grandTotalCollection)}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter><TableRow className="font-bold"><TableCell>Total</TableCell><TableCell className="text-right font-mono">{formatCurrency(602562 + grandTotalCollection)}</TableCell></TableRow></TableFooter>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Payments</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Particular</TableHead><TableHead className="text-right">Taka</TableHead></TableRow></TableHeader>
                        <TableBody>
                            <TableRow><TableCell>Advance</TableCell><TableCell className="text-right font-mono">{formatCurrency(200000)}</TableCell></TableRow>
                            <TableRow><TableCell>DBBL bank</TableCell><TableCell className="text-right font-mono">{formatCurrency(1863400)}</TableCell></TableRow>
                            <TableRow><TableCell>Saiful vai</TableCell><TableCell className="text-right font-mono">{formatCurrency(120000)}</TableCell></TableRow>
                            <TableRow><TableCell>Exp;</TableCell><TableCell className="text-right font-mono">{formatCurrency(228294)}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter>
                           <TableRow className="font-bold">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right font-mono">{formatCurrency(2411694)}</TableCell>
                            </TableRow>
                             <TableRow className="font-bold text-primary">
                                <TableCell>Cash in hand</TableCell>
                                <TableCell className="text-right font-mono">{formatCurrency((602562 + grandTotalCollection) - 2411694)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </div>

      </div>
    </AppShell>
  );
}

    
