'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { 
    FileText, 
    ShoppingCart, 
    Truck, 
    Undo2, 
    CreditCard, 
    Users, 
    Receipt, 
    ScrollText,
    type LucideIcon 
} from 'lucide-react';

type SalesModule = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const salesModules: SalesModule[] = [
  {
    title: "Quotation",
    description: "Create and manage customer quotations before finalizing sales.",
    icon: ScrollText,
    href: "#",
  },
  {
    title: "Direct Invoice",
    description: "Generate and send invoices for immediate sales and services.",
    icon: FileText,
    href: "/sales/invoices",
  },
  {
    title: "Order Management",
    description: "Track sales orders from creation to fulfillment.",
    icon: ShoppingCart,
    href: "#",
  },
  {
    title: "Delivery Tracking",
    description: "Monitor the delivery status of customer orders.",
    icon: Truck,
    href: "#",
  },
  {
    title: "Returns & Refunds",
    description: "Process customer returns and manage refunds efficiently.",
    icon: Undo2,
    href: "#",
  },
  {
    title: "Batch Payment",
    description: "Record and manage bulk payments received from customers.",
    icon: Receipt,
    href: "#",
  },
  {
    title: "Payment Tracking",
    description: "Keep a close watch on all incoming payment statuses.",
    icon: CreditCard,
    href: "#",
  },
   {
    title: "Sundry Debtors",
    description: "Manage and track outstanding debts from all customers.",
    icon: Users,
    href: "/sales/debtors",
  },
];

export default function SalesManagementPage() {
  const { toast } = useToast();

  const handleLearnMoreClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
      e.preventDefault();
      toast({
        title: 'Coming Soon!',
        description: 'This feature is under construction.',
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            A centralized hub for all your sales and invoicing activities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {salesModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.title} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-start gap-4">
                         <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <Icon className="h-6 w-6" />
                        </div>
                        <div>
                             <CardTitle>{module.title}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-3">{module.description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Button asChild className="w-full">
                    <Link href={module.href} onClick={(e) => handleLearnMoreClick(e, module.href)}>
                      Explore Module
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
