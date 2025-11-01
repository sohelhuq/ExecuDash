
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePlus, Loader2, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, writeBatch, getDocs, doc } from 'firebase/firestore';
import { initialRentEntries } from '@/lib/properties-data';


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

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(value);

const RentTable = ({ title, data, isLoading }: { title: string, data: RentEntry[] | null, isLoading: boolean }) => {
  const totals = React.useMemo(() => {
      if (!data) return { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 };
      return data.reduce((acc, item) => ({
        opening: acc.opening + item.opening,
        rent: acc.rent + item.rent,
        total: acc.total + item.total,
        collection: acc.collection + item.collection,
        expense: acc.expense + item.expense,
        due: acc.due + item.due,
      }), { opening: 0, rent: 0, total: 0, collection: 0, expense: 0, due: 0 });
  }, [data]);

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
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.opening)}</TableCell>
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.rent)}</TableCell>
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.total)}</TableCell>
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.collection)}</TableCell>
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.expense)}</TableCell>
                    <TableCell className="text-right font-mono">BDT {formatCurrency(item.due)}</TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.opening)}</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.rent)}</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.total)}</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.collection)}</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.expense)}</TableCell>
              <TableCell className="text-right font-mono">BDT {formatCurrency(totals.due)}</TableCell>
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
    const [isSeeding, setIsSeeding] = React.useState(false);

    const vangaDokanQuery = useMemoFirebase(() => {
        return firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'shetue_vanga_dokan')) : null;
    }, [firestore]);
    const { data: shetueVangaDokanData, isLoading: isLoadingVangaDokan } = useCollection<RentEntry>(vangaDokanQuery);

    const jamanTowerQuery = useMemoFirebase(() => {
        return firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'jaman_tower')) : null;
    }, [firestore]);
    const { data: jamanTowerData, isLoading: isLoadingJamanTower } = useCollection<RentEntry>(jamanTowerQuery);

    const othersQuery = useMemoFirebase(() => {
        return firestore ? query(collection(firestore, 'rent_entries'), where('category', '==', 'others')) : null;
    }, [firestore]);
    const { data: othersData, isLoading: isLoadingOthers } = useCollection<RentEntry>(othersQuery);

    const handleButtonClick = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `${action} functionality will be implemented here.`,
        });
    };
    
    const seedData = async () => {
        if (!firestore) return;
        setIsSeeding(true);
        try {
            const rentCollectionRef = collection(firestore, 'rent_entries');
            const snapshot = await getDocs(rentCollectionRef);
            if (!snapshot.empty) {
                toast({ title: 'Data Already Exists', description: 'Rent entry data has already been seeded.' });
                return;
            }

            const batch = writeBatch(firestore);
            initialRentEntries.forEach((entry) => {
                const docRef = doc(rentCollectionRef);
                batch.set(docRef, entry);
            });
            await batch.commit();
            toast({ title: 'Seeding Complete', description: `${initialRentEntries.length} rent entries have been added.` });
        } catch (error) {
            console.error('Error seeding data:', error);
            toast({ variant: 'destructive', title: 'Seeding Failed', description: 'Could not seed rent entry data.' });
        } finally {
            setIsSeeding(false);
        }
    };

    const summaryTotals = React.useMemo(() => {
        const allData = [...(shetueVangaDokanData || []), ...(jamanTowerData || []), ...(othersData || [])];
        return allData.reduce((acc, item) => ({
            opening: acc.opening + item.opening,
            rent: acc.rent + item.rent,
            collection: acc.collection + item.collection,
            due: acc.due + item.due,
            expense: acc.expense + item.expense,
        }), { opening: 0, rent: 0, collection: 0, due: 0, expense: 0 });
    }, [shetueVangaDokanData, jamanTowerData, othersData]);


  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rent Collection Dashboard</h1>
            <p className="text-muted-foreground">Vara collection & Due as of 31-12-24</p>
          </div>
          <div className='flex gap-2'>
            <Button variant="outline" onClick={seedData} disabled={isSeeding}>
                {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Seed Data
            </Button>
            <Button size="lg" onClick={() => handleButtonClick('Data Entry')}>
                <FilePlus className="mr-2 h-5 w-5" />
                Data Entry
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title="Grand Total Opening" value={`BDT ${formatCurrency(summaryTotals.opening)}`} />
            <SummaryCard title="Grand Total Rent" value={`BDT ${formatCurrency(summaryTotals.rent)}`} />
            <SummaryCard title="Grand Total Collection" value={`BDT ${formatCurrency(summaryTotals.collection)}`} />
            <SummaryCard title="Grand Total Due" value={`BDT ${formatCurrency(summaryTotals.due)}`} />
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
                            <TableRow><TableCell>Opening cash</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(602562)}</TableCell></TableRow>
                            <TableRow><TableCell>Total Collection</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(summaryTotals.collection)}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter><TableRow className="font-bold"><TableCell>Total</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(602562 + summaryTotals.collection)}</TableCell></TableRow></TableFooter>
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
                            <TableRow><TableCell>Advance</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(200000)}</TableCell></TableRow>
                            <TableRow><TableCell>DBBL bank</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(1863400)}</TableCell></TableRow>
                            <TableRow><TableCell>Saiful vai</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(120000)}</TableCell></TableRow>
                            <TableRow><TableCell>Exp;</TableCell><TableCell className="text-right font-mono">BDT {formatCurrency(summaryTotals.expense)}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter>
                           <TableRow className="font-bold">
                                <TableCell>Total</TableCell>
                                <TableCell className="text-right font-mono">BDT {formatCurrency(200000 + 1863400 + 120000 + summaryTotals.expense)}</TableCell>
                            </TableRow>
                             <TableRow className="font-bold text-primary">
                                <TableCell>Cash in hand</TableCell>
                                <TableCell className="text-right font-mono">BDT {formatCurrency((602562 + summaryTotals.collection) - (200000 + 1863400 + 120000 + summaryTotals.expense))}</TableCell>
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

    