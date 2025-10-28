'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Users,
  CalendarClock,
  Wallet,
  Calendar,
  Briefcase,
  FileEdit,
  ReceiptText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const hrModules = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Keep track of employees with detailed records, including job roles, departments, and contact details.",
    href: "/hr/employees"
  },
  {
    icon: CalendarClock,
    title: "Absence Tracking",
    description: "Easily monitor work hours, track absences, and manage shifts with a real-time attendance system.",
    href: "/hr/attendance"
  },
  {
    icon: Wallet,
    title: "Payroll Processing",
    description: "Easily manage payroll with automated salary calculations, deductions, and payslip generation—all optimized for accuracy.",
    href: "/hr/payroll"
  },
  {
    icon: Calendar,
    title: "Leave & Holiday Management",
    description: "Approve and track leave requests, assign leave types, and manage public holidays with ease.",
    href: "#"
  },
  {
    icon: Briefcase,
    title: "Job Roles & Departments",
    description: "Organize employees based on job positions, departments, and office locations for better structure.",
    href: "#"
  },
  {
    icon: FileEdit,
    title: "Resignation & Rejoining",
    description: "Handle employee resignations, approvals, and rejoining smoothly with a structured and efficient process.",
    href: "#"
  },
  {
    icon: ReceiptText,
    title: "Billing & Salary Sheets",
    description: "Keep track of employee salaries, generate detailed salary sheets, and monitor payments easily.",
    href: "#"
  },
];

export default function HrPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
          <p className="text-muted-foreground">
            A comprehensive suite of tools to manage your workforce.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hrModules.map((module) => {
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
