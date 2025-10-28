'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    LayoutDashboard,
    FileText,
    BookUser,
    ShoppingCart,
    Gauge,
    Fuel,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Factory,
    Pill
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { BusinessUnit } from "@/lib/business-units-types";
import { Loader2 } from 'lucide-react';


const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

const kpis = [
    { title: 'Total Sales / মোট বিক্রয়', value: '৳538,000', change: '+12%', icon: TrendingUp },
    { title: 'Total Expenses / মোট খরচ', value: '৳363,000', change: '+5%', icon: TrendingDown, changeColor: 'text-red-500' },
    { title: 'Net Profit / নীট লাভ', value: '৳175,000', change: '+18%', icon: DollarSign },
];

const unitIcons: {[key: string]: React.ElementType} = {
    'setu-filling-station': Fuel,
    'huq-bricks': Factory,
    'hridoy-tara-pharmacy': Pill,
    'setu-tech': LayoutDashboard,
}

export function Dashboard() {
  const firestore = useFirestore();
  const businessUnitsCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'business_units') : null;
  }, [firestore]);
  const { data: businessUnits, isLoading } = useCollection<BusinessUnit>(businessUnitsCollection);

  const getUnitIcon = (id: string) => {
      return unitIcons[id] || LayoutDashboard;
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard / ড্যাশবোর্ড</h1>
            <p className="text-muted-foreground">Overview of all business units</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map(kpi => {
                const Icon = kpi.icon;
                return (
                    <Card key={kpi.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <p className={cn("text-xs text-muted-foreground", kpi.changeColor)}>{kpi.change}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
        
        <div>
             <h2 className="text-2xl font-bold tracking-tight mb-4">Business Units / ব্যবসা ইউনিট</h2>
             {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
             ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {businessUnits?.filter(u => ['setu-filling-station', 'huq-bricks', 'hridoy-tara-pharmacy', 'setu-tech'].includes(u.id)).map(unit => {
                    const Icon = getUnitIcon(unit.id);
                    const totalSales = unit.transactions?.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) || 0;
                    const totalExpenses = unit.transactions?.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0) || 0;
                    const netProfit = totalSales - totalExpenses;
                    
                    return(
                        <Link href={`/dashboard/${unit.id}`} key={unit.id}>
                            <Card className="hover:bg-muted/50 transition-colors h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg", 
                                            unit.id === 'setu-filling-station' ? 'bg-blue-500/10 text-blue-500' :
                                            unit.id === 'huq-bricks' ? 'bg-red-500/10 text-red-500' :
                                            unit.id === 'setu-tech' ? 'bg-purple-500/10 text-purple-500' :
                                            'bg-green-500/10 text-green-500'
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle>{unit.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Sales / বিক্রয়</p>
                                        <p className="font-semibold">{formatCurrency(totalSales)}</p>
                                    </div>
                                     <div>
                                        <p className="text-xs text-muted-foreground">Expenses / খরচ</p>
                                        <p className="font-semibold">{formatCurrency(totalExpenses)}</p>
                                    </div>
                                     <div>
                                        <p className="text-xs text-muted-foreground">Profit / লাভ</p>
                                        <p className="font-semibold">{formatCurrency(netProfit)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
                </div>
             )}
        </div>
    </div>
  );
}
