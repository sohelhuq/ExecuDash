'use client';
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  FileText,
  BarChart2,
  Settings,
  Users,
  Banknote,
  Landmark,
  BookOpenCheck,
  FilePieChart,
  UserCheck,
  Building,
  Briefcase,
  ShieldCheck,
  Contact,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/units', label: 'Units', icon: Building },
  { href: '/department', label: 'Department', icon: Briefcase },
  { href: '/employee', label: 'Employee', icon: Contact },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/withdrawals', label: 'Withdrawals', icon: Banknote },
  { href: '/attendance', label: 'Attendance', icon: UserCheck },
  { href: '/accounting', label: 'Accounting', icon: BookOpenCheck },
  { href: '/banking', label: 'Banking', icon: Landmark },
  { href: '/collections', label: 'Collections', icon: BookOpenCheck },
  { href: '/dps', label: 'DPS', icon: ShieldCheck },
  { href: '/fdr', label: 'FDR', icon: ShieldCheck },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/reports', label: 'Reports', icon: FilePieChart },
  { href: '/tax-center', label: 'Tax Center', icon: FileText },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/finance-tax', label: 'ফিনান্স ও ট্যাক্স', icon: Landmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Logo />
          <span className="text-xl font-bold text-sidebar-foreground">FinanSage</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                  className="justify-start"
                >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
