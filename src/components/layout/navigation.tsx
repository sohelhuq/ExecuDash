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
  Fuel,
  ClipboardList,
  ShoppingCart,
  ClipboardCheck,
  Home,
  UserPlus,
  Gem,
  TrendingUp,
  Factory,
  CircleDollarSign,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/units', label: 'Units', icon: Building },
  { href: '/fuel-entry', label: 'Fuel Entry', icon: Fuel },
  {
    label: 'Sales',
    icon: TrendingUp,
    subItems: [
      { href: '/sales', label: 'Sales Hub' },
      { href: '/sales/invoices', label: 'Invoices' },
      { href: '/sales/debtors', label: 'Debtors' },
    ],
  },
  { href: '/hr', label: 'HR Management', icon: Users },
  { href: '/accounting', label: 'Accounting', icon: BookOpenCheck },
  { href: '/manufacturing', label: 'Manufacturing', icon: Factory },
  {
    label: 'Points',
    icon: Gem,
    subItems: [
      { href: '/points/dashboard', label: 'Attendance' },
      { href: '/points/categories', label: 'Categories' },
      { href: '/points/management', label: 'Management' },
      { href: '/points/settings', label: 'Settings' },
    ],
  },
  { href: '/department', label: 'Department', icon: Briefcase },
  { href: '/employee', label: 'Employee', icon: Contact },
  { href: '/payroll', label: 'Payroll', icon: Banknote },
  { href: '/recruitment', label: 'Recruitment', icon: UserPlus },
  { href: '/procurement', label: 'Procurement', icon: ShoppingCart },
  { href: '/project-management', label: 'Project Management', icon: ClipboardCheck },
  { href: '/properties', label: 'Properties', icon: Home },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/withdrawals', label: 'Withdrawals', icon: Banknote },
  { href: '/attendance', label: 'Attendance', icon: UserCheck },
  { href: '/notice-board', label: 'Notice Board', icon: ClipboardList },
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
          <span className="text-xl font-bold text-sidebar-foreground">ExecuDash</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              {item.subItems ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                     <SidebarMenuButton
                        isActive={item.href ? pathname.startsWith(item.href) : item.subItems.some(si => pathname.startsWith(si.href))}
                        tooltip={item.label}
                        className="justify-start w-full"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map(subItem => (
                        <li key={subItem.label}>
                          <Link href={subItem.href}>
                             <SidebarMenuSubButton isActive={pathname.startsWith(subItem.href)}>
                                {subItem.label}
                             </SidebarMenuSubButton>
                          </Link>
                        </li>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.href!}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href!)}
                    tooltip={item.label}
                    className="justify-start"
                  >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
