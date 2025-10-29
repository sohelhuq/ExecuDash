'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ClipboardList,
  KanbanSquare,
  PackageCheck,
  Recycle,
  DraftingCompass,
  Brick,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const manufacturingModules = [
  {
    icon: Brick,
    title: "ERP Dashboard",
    description: "A comprehensive overview of your bricks business, from raw materials to sales.",
    href: "/manufacturing/dashboard"
  },
  {
    icon: ClipboardList,
    title: "Production Planning",
    description: "Create detailed production plans, assign teams, set deadlines, and track progress in real time to ensure timely manufacturing.",
    href: "#"
  },
  {
    icon: DraftingCompass,
    title: "Templates & Work Orders",
    description: "Save time with predefined templates for recurring production tasks and streamline work orders for a smoother workflow.",
    href: "#"
  },
  {
    icon: KanbanSquare,
    title: "Production Pipeline",
    description: "Track every stage of production visually with an easy-to-use pipeline system, ensuring efficient task allocation and progress monitoring.",
    href: "#"
  },
  {
    icon: PackageCheck,
    title: "Finished Goods Tracking",
    description: "Automatically track completed products, manage storage, and transfer items seamlessly to inventory or distribution.",
    href: "#"
  },
  {
    icon: Recycle,
    title: "Waste Management",
    description: "Reduce losses by monitoring defective or waste goods, helping you analyze and minimize production inefficiencies.",
    href: "#"
  },
];

export default function ManufacturingPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Manufacturing Management</h1>
          <p className="text-muted-foreground">
            Manage production plans, track inventory, and control waste with real-time insights.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {manufacturingModules.map((module) => {
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
