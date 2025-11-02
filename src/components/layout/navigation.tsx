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
  Shield,
  HeartPulse,
  Boxes
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
import { useUserProfile } from '@/hooks/use-user-profile';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

type BusinessUnit = { id: string; name: string; location: string };

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
  {
    label: 'Pharmacy',
    icon: HeartPulse,
    subItems: [
      { href: '/pharmacy', label: 'POS Dashboard' },
      { href: '/pharmacy/products', label: 'Products', icon: Boxes },
    ]
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
  { href: '/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

function UnitsNavAccordion() {
  const pathname = usePathname();
  const { user } = useUser();
  const firestore = useFirestore();

  const unitsRef = useMemoFirebase(
    () => (user ? collection(firestore, `users/${user.uid}/businessUnits`) : null),
    [firestore, user]
  );
  const { data: units, isLoading } = useCollection<BusinessUnit>(unitsRef);

  const isParentActive = pathname.startsWith('/units');

  return (
    <SidebarMenuItem>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isParentActive}
            tooltip="Business Units"
            className="justify-start w-full"
          >
            <Building className="h-4 w-4" />
            <span>Units</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <li>
              <Link href="/units">
                <SidebarMenuSubButton isActive={pathname === '/units'}>
                  All Units
                </SidebarMenuSubButton>
              </Link>
            </li>
            {isLoading && (
              <li>
                <SidebarMenuSubButton disabled>Loading...</SidebarMenuSubButton>
              </li>
            )}
            {units?.map((unit) => (
              <li key={unit.id}>
                <Link href={`/units/${unit.id}`}>
                  <SidebarMenuSubButton isActive={pathname === `/units/${unit.id}`}>
                    {unit.name}
                  </SidebarMenuSubButton>
                </Link>
              </li>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { userProfile } = useUserProfile();

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
          {navItems.map((item) => {
            if (item.adminOnly && userProfile?.userType !== 'Admin') {
              return null;
            }
             if (item.href === '/units') {
              return <UnitsNavAccordion key={item.label}/>;
            }

            const isParentActive = item.subItems ? item.subItems.some(si => pathname.startsWith(si.href)) : false;

            return (
            <SidebarMenuItem key={item.label}>
              {item.subItems ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                     <SidebarMenuButton
                        isActive={isParentActive}
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
                                {subItem.icon && <subItem.icon className="h-4 w-4 mr-2"/>}
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
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          )})}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

    