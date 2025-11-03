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
  Boxes,
  Wrench,
  Truck,
  Percent,
  HardHat,
  Archive,
  BookLock,
  Warehouse,
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
    label: 'HR',
    icon: Users,
    subItems: [
        { href: '/hr', label: 'HR Hub' },
        { href: '/employee', label: 'Employees' },
        { href: '/payroll', label: 'Payroll' },
        { href: '/attendance', label: 'Attendance' },
        { href: '/department', label: 'Departments' },
        { href: '/recruitment', label: 'Recruitment' },
    ],
  },
  {
    label: 'Finance',
    icon: CircleDollarSign,
    subItems: [
      { href: '/accounting', label: 'Accounting', icon: BookOpenCheck },
      { href: '/banking', label: 'Banking', icon: Landmark },
      { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
      { href: '/withdrawals', label: 'Withdrawals', icon: Banknote },
    ],
  },
    {
    label: 'Taxes',
    icon: Landmark,
    subItems: [
      { href: '/taxes', label: 'Tax Rates', icon: Percent },
      { href: '/tax-center', label: 'AI Tax Center', icon: FileText },
    ]
  },
    {
    label: 'Operations',
    icon: Briefcase,
    subItems: [
      { href: '/units', label: 'Business Units' },
      { href: '/construct-ops', label: 'ConstructOps', icon: HardHat },
      { href: '/fuel-entry', label: 'Fuel Entry', icon: Fuel },
      { href: '/manufacturing', label: 'Manufacturing', icon: Factory },
      { href: '/project-management', label: 'Projects', icon: ClipboardCheck },
      { href: '/properties', label: 'Properties', icon: Home },
      { href: '/service', label: 'Services', icon: Wrench },
      { href: '/inventory', label: 'Inventory', icon: Warehouse },
    ],
  },
  {
    label: 'CRM',
    icon: Contact,
    subItems: [
        { href: '/customers', label: 'Customers' },
        { href: '/collections', label: 'Dues Collection' },
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
    {
    label: 'Procurement',
    icon: ShoppingCart,
    subItems: [
        { href: '/procurement', label: 'Procurement Hub' },
        { href: '/suppliers', label: 'Suppliers' },
    ],
  },
  {
    label: 'Investments',
    icon: Landmark,
    subItems: [
        { href: '/dps', label: 'DPS' },
        { href: '/fdr', label: 'FDR' },
        { href: '/goals', label: 'Goals' },
    ],
  },
    {
    label: 'Reports & Vault',
    icon: Archive,
    subItems: [
        { href: '/reports', label: 'Reports Center', icon: FilePieChart },
        { href: '/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/storage', label: 'File Storage', icon: Archive },
        { href: '/vault', label: 'Digital Vault', icon: BookLock },
    ],
  },
    {
    label: 'Company',
    icon: Building,
    subItems: [
        { href: '/notice-board', label: 'Notice Board' },
        { href: '/points/dashboard', label: 'Attendance Points' },
        { href: '/settings', label: 'Settings' },
    ],
  },
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

            const isParentActive = item.subItems ? item.subItems.some(si => si.href && pathname.startsWith(si.href)) : false;

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
                             <SidebarMenuSubButton isActive={subItem.href && pathname.startsWith(subItem.href)}>
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
