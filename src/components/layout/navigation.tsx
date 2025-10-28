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
  ChevronDown,
  Fuel,
  LayoutDashboard,
  Pill,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { BusinessUnit } from '@/lib/business-units-types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, exactMatch: true },
  { href: '/accounting', label: 'Accounting', icon: BookCopy },
  { href: '/banking', label: 'Banking', icon: BankIcon },
  { href: '/fdr', label: 'FDR', icon: ShieldCheck },
  { href: '/dps', label: 'DPS', icon: Wallet },
  { href: '/sales', label: 'Sales Management', icon: Briefcase },
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

const unitIcons: {[key: string]: React.ElementType} = {
    'setu-filling-station': Fuel,
    'huq-bricks': Factory,
    'hridoy-tara-pharmacy': Pill,
    'setu-tech': LayoutDashboard,
};
const getUnitIcon = (id: string) => {
    return unitIcons[id] || Briefcase;
};


function BusinessUnitsNav() {
    const pathname = usePathname();
    const firestore = useFirestore();
    const businessUnitsCollection = useMemoFirebase(() => {
        return firestore ? collection(firestore, 'business_units') : null;
    }, [firestore]);
    const { data: businessUnits, isLoading } = useCollection<BusinessUnit>(businessUnitsCollection);
    const [isOpen, setIsOpen] = React.useState(true);

    const isBusinessUnitActive = pathname.startsWith('/dashboard/');

    if (isLoading) {
        return (
            <>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
            </>
        )
    }

    if (!businessUnits || businessUnits.length === 0) {
        return null;
    }

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isBusinessUnitActive}
                        className="justify-between"
                    >
                        <div className="flex items-center gap-2">
                           <Briefcase />
                            <span>Business Units</span>
                        </div>
                        <ChevronDown className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {businessUnits.map(unit => {
                        const Icon = getUnitIcon(unit.id);
                        const href = `/dashboard/${unit.id}`;
                        return (
                            <SidebarMenuSubItem key={unit.id}>
                                <Link href={href}>
                                    <SidebarMenuSubButton isActive={pathname === href}>
                                        <Icon />
                                        <span>{unit.name}</span>
                                    </SidebarMenuSubButton>
                                </Link>
                            </SidebarMenuSubItem>
                        );
                    })}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}

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
          {navItems.map((item) => {
              if (item.href === '/dashboard') {
                  return (
                      <React.Fragment key="dashboard-and-units">
                          <SidebarMenuItem>
                              <Link href={item.href}>
                                  <SidebarMenuButton
                                      isActive={pathname === item.href}
                                      tooltip={item.label}
                                      className="justify-start"
                                  >
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </SidebarMenuButton>
                              </Link>
                          </SidebarMenuItem>
                          <BusinessUnitsNav />
                      </React.Fragment>
                  );
              }

              // Hide sundry debtors from the main nav list as it's part of sales
              if (item.href === '/sales/sundry-debtors') return null;

              return (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href) && !item.exactMatch}
                      tooltip={item.label}
                      className="justify-start"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
          })}
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
