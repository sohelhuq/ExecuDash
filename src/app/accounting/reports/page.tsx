'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FilePieChart, Book, AreaChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reports = [
  {
    icon: FilePieChart,
    title: "Profit & Loss Statement",
    description: "View your company's financial performance over a specific period.",
    href: "#"
  },
  {
    icon: Book,
    title: "Balance Sheet",
    description: "Get a snapshot of your company's financial health at a single point in time.",
    href: "#"
  },
  {
    icon: AreaChart,
    title: "Cash Flow Statement",
    description: "Track the movement of cash in and out of your company.",
    href: "#"
  },
];

export default function ReportsPage() {
  const { toast } = useToast();

  const handleViewReport = (title: string, href: string) => {
    if (href === '#') {
      toast({
        title: 'Coming Soon!',
        description: `The "${title}" report is under construction.`,
      });
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Generate and view key financial statements.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.title} className="flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription className="mt-2">{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                   <Button variant="outline" onClick={() => handleViewReport(report.title, report.href)}>
                    View Report
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
