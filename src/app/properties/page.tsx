'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type RentEntry = {
  id: string;
  name: string;
  opening: number;
  vara: number;
  total: number;
  collection: number;
  exp: number;
  due: number;
};

const shetueVangaDokanData: RentEntry[] = [
  { id: 'Dokan 1', name: 'Rofiq Mia', opening: 1772, vara: 39759, total: 41531, collection: 38271, exp: 0, due: 3260 },
  { id: 'Dokan 2', name: 'Shipon', opening: 3914, vara: 61758, total: 65672, collection: 65672, exp: 0, due: 0 },
  { id: 'Dokan 3', name: 'Iqbal Mia', opening: 0, vara: 44495, total: 44495, collection: 41433, exp: 0, due: 3062 },
  { id: 'Dokan 4', name: 'Ismail Mia', opening: 11004, vara: 37051, total: 48055, collection: 48055, exp: 0, due: 0 },
  { id: 'Dokan 5', name: 'Feed office', opening: 0, vara: 0, total: 0, collection: 0, exp: 0, due: 0 },
  { id: 'Dokan 6', name: 'Dulal', opening: 3541, vara: 28987, total: 32528, collection: 28236, exp: 440, due: 4292 },
  { id: 'Dokan 7', name: 'Jamal', opening: 5782, vara: 31591, total: 37373, collection: 29241, exp: 1600, due: 8132 },
  { id: 'Dokan 8', name: 'Abdul Halim', opening: 19642, vara: 49743, total: 69385, collection: 32000, exp: 0, due: 37385 },
  { id: 'Dokan 9', name: 'Faruk', opening: 19479, vara: 66307, total: 85786, collection: 58508, exp: 0, due: 27278 },
  { id: 'Dokan 10', name: 'Mosjid', opening: 0, vara: 0, total: 0, collection: 0, exp: 0, due: 0 },
];

const jamanTowerData: RentEntry[] = [
  { id: '3Floor/01', name: 'Shetue Tech', opening: 0, vara: 0, total: 0, collection: 0, exp: 0, due: 0 },
  { id: '3Floor/02', name: 'Piber Cabel', opening: 5500, vara: 66000, total: 71500, collection: 66000, exp: 0, due: 5500 },
  { id: '3Floor/03', name: 'Family Basa', opening: 0, vara: 0, total: 0, collection: 0, exp: 0, due: 0 },
  { id: '3Floor/04', name: 'Golden Ispat', opening: 10000, vara: 132000, total: 142000, collection: 110000, exp: 0, due: 32000 },
  { id: '3Floor/05', name: 'Family Basa', opening: 9000, vara: 54000, total: 63000, collection: 49500, exp: 0, due: 13500 },
  { id: '4Floor/01', name: 'Khalek vai', opening: 52000, vara: 78000, total: 130000, collection: 130000, exp: 0, due: 0 },
  { id: '4Floor/02', name: 'Family Basa', opening: 4000, vara: 48000, total: 52000, collection: 40000, exp: 0, due: 12000 },
  { id: '4Floor/03', name: 'Family Basa', opening: 0, vara: 15000, total: 15000, collection: 6500, exp: 0, due: 8500 },
  { id: '4Floor/04', name: 'Family Basa', opening: 4500, vara: 13500, total: 18000, collection: 18000, exp: 0, due: 0 },
  { id: '4Floor/05', name: 'Family Basa', opening: 4500, vara: 54000, total: 58500, collection: 45000, exp: 70634, due: 13500 },
];

const othersData: RentEntry[] = [
  { id: 'Room 1', name: 'Mohiuddin Plastic', opening: 140000, vara: 240000, total: 380000, collection: 210000, exp: 0, due: 170000 },
  { id: 'Dalia Market', name: 'Juta dokan', opening: 24000, vara: 60000, total: 84000, collection: 84000, exp: 2500, due: 0 },
  { id: 'Dalia Market', name: 'Kapor dokan', opening: 34000, vara: 60000, total: 94000, collection: 94000, exp: 0, due: 0 },
  { id: 'College road', name: '', opening: 7300, vara: 132000, total: 139300, collection: 139300, exp: 0, due: 0 },
  { id: 'Sohel vai basa', name: '', opening: 60000, vara: 360000, total: 420000, collection: 390000, exp: 153120, due: 30000 },
  { id: 'Arambag', name: '', opening: 140000, vara: 200000, total: 340000, collection: 0, exp: 0, due: 340000 },
  { id: 'Nakhal para', name: '', opening: 60000, vara: 240000, total: 300000, collection: 280000, exp: 0, due: 20000 },
  { id: 'Masud', name: 'Number 01', opening: 25000, vara: 0, total: 25000, collection: 0, exp: 0, due: 25000 },
  { id: 'Mater shed', name: '', opening: 35000, vara: 300000, total: 335000, collection: 400000, exp: 0, due: -65000 },
  { id: 'Pablic hall', name: '', opening: 8000, vara: 96000, total: 104000, collection: 80000, exp: 0, due: 24000 },
  { id: 'New Shed', name: '', opening: 45000, vara: 180000, total: 225000, collection: 140000, exp: 0, due: 85000 },
  { id: 'Kutubpur Fram', name: '', opening: 375000, vara: 300000, total: 675000, collection: 150000, exp: 0, due: 525000 },
];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN').format(value);

const RentTable = ({ title, data }: { title: string, data: RentEntry[] }) => {
  const totals = data.reduce((acc, item) => ({
    opening: acc.opening + item.opening,
    vara: acc.vara + item.vara,
    total: acc.total + item.total,
    collection: acc.collection + item.collection,
    exp: acc.exp + item.exp,
    due: acc.due + item.due,
  }), { opening: 0, vara: 0, total: 0, collection: 0, exp: 0, due: 0 });

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
            {data.map((item) => (
              <TableRow key={item.id + item.name}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.opening)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.vara)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.total)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.collection)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.exp)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(item.due)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="font-bold">
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.opening)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.vara)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.total)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.collection)}</TableCell>
              <TableCell className="text-right font-mono">{formatCurrency(totals.exp)}</TableCell>
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

    const handleButtonClick = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `${action} functionality will be implemented here.`,
        });
    };

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
            <SummaryCard title="Grand Total Opening" value="1,107,934" />
            <SummaryCard title="Grand Total Rent" value="2,988,191" />
            <SummaryCard title="Grand Total Collection" value="2,773,716" />
            <SummaryCard title="Grand Total Due" value="1,322,409" />
        </div>

        <div className="space-y-6">
            <RentTable title="Shetue Vanga Dokan Vara" data={shetueVangaDokanData} />
            <RentTable title="Jaman Tower" data={jamanTowerData} />
            <RentTable title="Others" data={othersData} />
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
                            <TableRow><TableCell>Total Collection</TableCell><TableCell className="text-right font-mono">{formatCurrency(2773716)}</TableCell></TableRow>
                        </TableBody>
                        <TableFooter><TableRow className="font-bold"><TableCell>Total</TableCell><TableCell className="text-right font-mono">{formatCurrency(3376278)}</TableCell></TableRow></TableFooter>
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
                                <TableCell className="text-right font-mono">{formatCurrency(964584)}</TableCell>
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
