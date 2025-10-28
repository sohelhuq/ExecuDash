'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Library,
  BookOpen,
  ArrowRightLeft,
  Repeat,
  FilePieChart,
  LayoutDashboard,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const accountingModules = [
  {
    icon: LayoutDashboard,
    title: "Accounting Dashboard",
    description: "A comprehensive overview of your financial metrics, including income, expenses, and profitability.",
    href: "/accounting/dashboard"
  },
  {
    icon: Library,
    title: "Chart of Accounts",
    description: "Organize all financial transactions into clear categories for structured record-keeping and easy reporting.",
    href: "#"
  },
  {
    icon: BookOpen,
    title: "Journals",
    description: "Easily record daily transactions to maintain accurate financial records and track business activity.",
    href: "#"
  },
  {
    icon: ArrowRightLeft,
    title: "Incomes & Expenses",
    description: "Monitor cash flow in real-time, ensuring you always know where your money is coming from and where it's going.",
    href: "#"
  },
  {
    icon: Repeat,
    title: "Recurring Journals",
    description: "Automate repeat transactions like rent, salaries, and subscriptions to save time and reduce manual work.",
    href: "#"
  },
  {
    icon: ArrowRightLeft,
    title: "Internal Transfers",
    description: "Move funds between accounts while keeping detailed transaction records for better financial clarity.",
    href: "#"
  },
  {
    icon: FilePieChart,
    title: "Reports",
    description: "Manage finances effortlessly. Track income and expenses, generate insightful reports, and stay organized.",
    href: "/accounting/reports"
  },
];

export default function AccountingPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Accounting</h1>
          <p className="text-muted-foreground">
            Tools to manage your company's finances.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accountingModules.map((module) => {
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
                    <Link href={module.href} key={module.title} className="flex no-underline">
                        {cardContent}
                    </Link>
                )
            }
            
            return <div key={module.title} className="flex">{cardContent}</div>
          })}
        </div>
      </div>
    </AppShell>
  );
}
