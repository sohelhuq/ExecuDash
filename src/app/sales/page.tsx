'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileText,
  FileSignature,
  ShoppingCart,
  Truck,
  Files,
  Undo2,
  WalletCards,
  Banknote,
  CircleUserRound,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const salesModules = [
  {
    icon: FileText,
    title: "Direct Invoice",
    description: "Quickly generate error-free invoices with tax, discounts, and due amounts automatically calculated for smooth transactions.",
    href: "#"
  },
  {
    icon: FileSignature,
    title: "Quotation",
    description: "Create, send, and track quotations with expiration dates and approval workflows, ensuring better deal closure and follow-ups.",
    href: "#"
  },
  {
    icon: ShoppingCart,
    title: "Order Management",
    description: "Easily manage and track all sales orders, monitor their status (approved, pending, or completed), and ensure accurate processing.",
    href: "#"
  },
  {
    icon: Truck,
    title: "Delivery Tracking",
    description: "Monitor deliveries with real-time updates, track delivery types (store pickup, custom delivery), and ensure timely fulfillment.",
    href: "#"
  },
  {
    icon: Files,
    title: "Invoice Management",
    description: "Keep a centralized record of all invoices, track payments, and manage due amounts for better financial accuracy.",
    href: "#"
  },
  {
    icon: Undo2,
    title: "Returns & Refunds",
    description: "Handle customer returns and refunds efficiently, track return reasons, and ensure accurate adjustments for seamless processing.",
    href: "#"
  },
  {
    icon: WalletCards,
    title: "Batch Payment Processing",
    description: "Process multiple customer payments in a single transaction, reducing manual work and improving efficiency.",
    href: "#"
  },
  {
    icon: Banknote,
    title: "Payment Tracking",
    description: "Monitor all sales payments, track verified and in-process payments, and ensure timely collections to maintain cash flow.",
    href: "#"
  },
  {
    icon: CircleUserRound,
    title: "Customer Debits",
    description: "Track customer credit balances, manage overdue payments, and adjust amounts for a seamless debt management system.",
    href: "/sundry-debtors"
  },
];

export default function SalesPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
          <p className="text-muted-foreground">
            Handle orders, invoices, payments, and customers—all in one place for smooth and fast sales.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {salesModules.map((module) => {
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
