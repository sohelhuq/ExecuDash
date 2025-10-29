'use client';
import {
  Home,
  Users,
  Award,
  Building,
  Plane,
  CreditCard,
  Bell,
  Wallet,
  Briefcase,
  FileText,
  LineChart,
  Settings,
  Star,
  ChevronRight,
  Dot,
  User,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, exactMatch: true },
  { href: '/attendance', label: 'Attendance', icon: Users },
  { href: '/award', label: 'Award', icon: Award },
  { href: '/department', label: 'Department', icon: Building },
  { href: '/employee', label: 'Employee', icon: Users },
  { href: '/leave', label: 'Leave', icon: Plane },
  { href: '/loan', label: 'Loan', icon: CreditCard },
  { href: '/notice-board', label: 'Notice board', icon: Bell },
  { href: '/payroll', label: 'Payroll', icon: Wallet },
  { href: '/procurement', label: 'Procurement', icon: Briefcase },
  { href: '/project-management', label: 'Project management', icon: FileText },
  { href: '/recruitment', label: 'Recruitment', icon: Users },
  { href: '/reports', label: 'Reports', icon: LineChart },
];

const rewardPointsSubItems = [
    { href: '/reward/point-settings', label: 'Point settings' },
    { href: '/reward/point-categories', label: 'Point categories' },
    { href: '/reward/management-points', label: 'Management points' },
];

const hrSubItems = [
    { href: '/hr/employees', label: 'Employee Management' },
    { href: '/hr/attendance', label: 'Absence Tracking' },
    { href: '/hr/payroll', label: 'Payroll Processing' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Logo />
          <span className="text-xl font-bold text-sidebar-foreground">YRM</span>
        </div>
        <div className="p-2">
          <Input placeholder="Menu Search..." />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard">
              <SidebarMenuButton
                isActive={pathname === '/dashboard'}
                tooltip="Dashboard"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <Home />
                      <span>Dashboard</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <Collapsible asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/hr')}>
                      <div className="flex items-center gap-2">
                          <Users />
                          <span>HR Management</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                       {hrSubItems.map(subItem => (
                         <SidebarMenuItem key={subItem.href}>
                             <Link href={subItem.href}>
                                 <SidebarMenuSubButton isActive={pathname === subItem.href}>
                                     <Dot />
                                     <span>{subItem.label}</span>
                                 </SidebarMenuSubButton>
                             </Link>
                         </SidebarMenuItem>
                      ))}
                  </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          
          <Collapsible asChild>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/reward')}>
                        <div className="flex items-center gap-2">
                            <Star />
                            <span>Reward points</span>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        <SidebarMenuItem>
                            <Link href="/reward/attendance">
                                <SidebarMenuSubButton isActive={pathname === '/reward/attendance'}>
                                    <Dot />
                                    <span>Point settings</span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuItem>
                         {rewardPointsSubItems.map(subItem => (
                           <SidebarMenuItem key={subItem.href}>
                               <Link href={subItem.href}>
                                   <SidebarMenuSubButton isActive={pathname === subItem.href}>
                                       <Dot />
                                       <span>{subItem.label}</span>
                                   </SidebarMenuSubButton>
                               </Link>
                           </SidebarMenuItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
          </Collapsible>

          {navItems.filter(item => !['/dashboard', '/attendance', '/payroll'].includes(item.href)).map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-between"
                >
                    <div className="flex items-center gap-2">
                        <item.icon />
                        <span>{item.label}</span>
                    </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
