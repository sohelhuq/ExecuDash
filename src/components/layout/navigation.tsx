'use client';
import {
  Home,
  LineChart,
  Settings,
  CircleHelp,
  Briefcase,
  Users,
  Bell,
  TrendingUp,
  ReceiptText,
  Building,
  Landmark as BankIcon,
  UserCheck,
  ShieldCheck,
  Wallet,
  BookCopy,
  Boxes,
  Factory,
  Workflow,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/accounting', label: 'Accounting', icon: BookCopy },
  { href: '/banking', label: 'Banking', icon: BankIcon },
  { href: '/fdr', label: 'FDR', icon: ShieldCheck },
  { href: '/dps', label: 'DPS', icon: Wallet },
  { href: '/sales', label: 'Sales Management', icon: Briefcase },
  { href: '/sales/sundry-debtors', label: 'Sundry Debtors', icon: UserCheck },
  { href: '/collections', label: 'Collections', icon: ReceiptText },
  { href: '/properties', label: 'Properties', icon: Building },
  { href: '/inventory', label: 'Inventory', icon: Boxes },
  { href: '/manufacturing', label: 'Manufacturing', icon: Factory },
  { href: '/hr', label: 'HR Management', icon: Users },
  { href: '/automations', label: 'Automations', icon: Workflow },
  { href: '/trends', label: 'Trends', icon: TrendingUp },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <Logo />
          <span className="text-lg font-semibold text-sidebar-foreground">ExecuDash</span>
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
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/help">
              <SidebarMenuButton tooltip="Help" className="justify-start">
                <CircleHelp />
                <span>Help & Support</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
