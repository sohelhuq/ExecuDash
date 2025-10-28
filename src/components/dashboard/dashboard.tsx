'use client';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
    LayoutDashboard,
    FileText,
    BookUser,
    ShoppingCart,
    Gauge,
    Fuel
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-purple-100 text-purple-600' },
  { href: '/sales', label: 'Trial Balance', icon: FileText, color: 'bg-red-100 text-red-600' },
  { href: '/collections', label: 'Ledger', icon: BookUser, color: 'bg-green-100 text-green-600' },
  { href: '/sundry-debtors', label: 'Outstandings', icon: ShoppingCart, color: 'bg-yellow-100 text-yellow-600' },
  { href: '/#', label: 'Vehicles', icon: Gauge, color: 'bg-pink-100 text-pink-600' },
  { href: '/dashboard/setu-filling-station', label: 'Meter Reading', icon: Fuel, color: 'bg-teal-100 text-teal-600' },
];

export function Dashboard() {

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Home</h1>
        </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link href={item.href} key={item.label}>
                <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
                         <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", item.color)}>
                            <Icon className="h-8 w-8" />
                        </div>
                        <p className="font-semibold text-center text-sm">{item.label}</p>
                    </CardContent>
                </Card>
            </Link>
        )})}
      </div>
    </div>
  );
}
