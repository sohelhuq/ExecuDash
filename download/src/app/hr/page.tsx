'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Contact, UserCheck, Banknote, CalendarClock, Briefcase, UserMinus, FileSpreadsheet, type LucideIcon } from 'lucide-react';

type HRModule = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

const hrModules: HRModule[] = [
  {
    title: "Employee Management",
    description: "Manage employee profiles, records, and information.",
    icon: Contact,
    href: "/employee",
  },
  {
    title: "Absence Tracking",
    description: "Track and manage employee attendance and absences.",
    icon: UserCheck,
    href: "/attendance",
  },
  {
    title: "Payroll Processing",
    description: "Process monthly salaries, deductions, and view payroll history.",
    icon: Banknote,
    href: "/payroll",
  },
   {
    title: "Job Roles & Departments",
    description: "Define and manage company departments and job roles.",
    icon: Briefcase,
    href: "/department",
  },
  {
    title: "Leave & Holiday Management",
    description: "Handle leave requests, approvals, and company holidays.",
    icon: CalendarClock,
    href: "#",
  },
  {
    title: "Resignation & Rejoining",
    description: "Manage the offboarding and re-onboarding processes for employees.",
    icon: UserMinus,
    href: "#",
  },
  {
    title: "Billing & Salary Sheets",
    description: "Generate detailed salary sheets and billing reports.",
    icon: FileSpreadsheet,
    href: "#",
  },
];

export default function HRManagementPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
          <p className="text-muted-foreground">
            A comprehensive suite of tools to manage your workforce.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hrModules.map((module) => {
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
                      Learn More
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
