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
  Library,
  Landmark,
  ShoppingCart,
  Building2,
  FolderKanban,
  Factory,
  ToyBrick,
  Fuel,
  Archive,
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
import { allBusinessUnits } from '@/lib/business-units';

const navItems = [
  { href: '/procurement', label: 'Procurement', icon: Briefcase },
  { href: '/project-management', label: 'Project management', icon: FileText },
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
    { href: '/recruitment', label: 'Recruitment', icon: Users },
    { href: '/department', label: 'Department', icon: Building },
    { href: '/notice-board', label: 'Notice Board', icon: Bell },
];

const manufacturingSubItems = [
    { href: '/manufacturing/dashboard', label: 'ERP Dashboard' },
];

const fuelStationSubItems = [
    { href: '/fuel-station/entry', label: 'Daily Entry Form' },
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
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/dashboard/')}>
                      <div className="flex items-center gap-2">
                          <Factory />
                          <span>Business Units</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                       {allBusinessUnits.map(unit => (
                         <SidebarMenuItem key={unit.id}>
                             <Link href={`/dashboard/${unit.id}`}>
                                 <SidebarMenuSubButton isActive={pathname === `/dashboard/${unit.id}`}>
                                     <Dot />
                                     <span>{unit.name}</span>
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
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/hr') || pathname.startsWith('/reward') || ['/recruitment', '/department', '/notice-board'].includes(pathname)}>
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

                      <Collapsible asChild>
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/reward')}>
                                    <div className="flex items-center gap-2">
                                        <Dot />
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
                                                <span>Attendance points</span>
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
                  </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <SidebarMenuItem>
            <Link href="/accounting">
              <SidebarMenuButton
                isActive={pathname.startsWith('/accounting')}
                tooltip="Accounting"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <Library />
                      <span>Accounting</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          
           <Collapsible asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/banking') || pathname.startsWith('/fdr') || pathname.startsWith('/dps')}>
                      <div className="flex items-center gap-2">
                          <Landmark />
                          <span>Banking & Finance</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                        <SidebarMenuItem>
                            <Link href="/banking">
                                <SidebarMenuSubButton isActive={pathname.startsWith('/banking')}>
                                    <Dot />
                                    <span>Accounts Summary</span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/fdr">
                                <SidebarMenuSubButton isActive={pathname.startsWith('/fdr')}>
                                    <Dot />
                                    <span>FDR</span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link href="/dps">
                                <SidebarMenuSubButton isActive={pathname.startsWith('/dps')}>
                                    <Dot />
                                    <span>DPS</span>
                                </SidebarMenuSubButton>
                            </Link>
                        </SidebarMenuItem>
                  </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
          
          <SidebarMenuItem>
            <Link href="/sales">
              <SidebarMenuButton
                isActive={pathname.startsWith('/sales')}
                tooltip="Sales"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <ShoppingCart />
                      <span>Sales</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/inventory">
              <SidebarMenuButton
                isActive={pathname.startsWith('/inventory')}
                tooltip="Inventory"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <Archive />
                      <span>Inventory</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <Link href="/collections">
              <SidebarMenuButton
                isActive={pathname.startsWith('/collections')}
                tooltip="Collections"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <FolderKanban />
                      <span>Collections</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link href="/properties">
              <SidebarMenuButton
                isActive={pathname.startsWith('/properties')}
                tooltip="Properties"
                className="justify-between"
              >
                  <div className="flex items-center gap-2">
                      <Building2 />
                      <span>Properties</span>
                  </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <Collapsible asChild>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/manufacturing')}>
                      <div className="flex items-center gap-2">
                          <ToyBrick />
                          <span>Bricks ERP</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                       {manufacturingSubItems.map(subItem => (
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
                  <SidebarMenuButton className="justify-between w-full" isActive={pathname.startsWith('/fuel-station')}>
                      <div className="flex items-center gap-2">
                          <Fuel />
                          <span>Fuel Station</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                  <SidebarMenuSub>
                       {fuelStationSubItems.map(subItem => (
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

          {navItems.map((item) => (
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
