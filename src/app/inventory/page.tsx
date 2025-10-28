'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  PackageSearch,
  Move,
  PackagePlus,
  Warehouse,
  LineChart,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const inventoryModules = [
  {
    icon: PackageSearch,
    title: "Stock Adjustment",
    description: "Easily update and correct stock levels due to damages, returns, or missing items. Keep inventory data up to date for smooth operations and financial accuracy.",
    href: "#"
  },
  {
    icon: Move,
    title: "Stock Movement",
    description: "Track warehouse transfers in real time, ensuring stock reaches the right location without delays. Avoid misplacement and improve inventory efficiency.",
    href: "#"
  },
  {
    icon: PackagePlus,
    title: "Receivable Stock",
    description: "Monitor incoming shipments and verify deliveries to prevent shortages and stock discrepancies. Ensure every item you receive matches your purchase orders.",
    href: "#"
  },
  {
    icon: Warehouse,
    title: "Warehouse Access",
    description: "Control who can manage inventory and assign user access to different warehouses. Improve security while keeping stock data organized and accessible.",
    href: "#"
  },
  {
    icon: LineChart,
    title: "Real-Time Inventory Insights",
    description: "Gain instant visibility into your stock levels across multiple warehouses. Make informed decisions, reduce waste, and optimize purchasing based on real-time data.",
    href: "#"
  },
];

export default function InventoryPage() {
  const { toast } = useToast();

  const handleLearnMore = (title: string, href: string) => {
    if (href === '#') {
      toast({
        title: 'Coming Soon!',
        description: `The "${title}" module is under construction.`,
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track stock, manage warehouses, and prevent shortages effortlessly.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inventoryModules.map((module) => {
            const Icon = module.icon;
            const cardContent = (
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <CardDescription className="mt-2">{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Button variant="outline" onClick={(e) => {
                    if (module.href === '#') {
                        e.preventDefault();
                        handleLearnMore(module.title, module.href)
                    }
                  }}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );

            if (module.href !== '#') {
                return (
                    <Link href={module.href} key={module.title} className="flex">
                        {cardContent}
                    </Link>
                )
            }
            
            return <div key={module.title}>{cardContent}</div>
          })}
        </div>
      </div>
    </AppShell>
  );
}
