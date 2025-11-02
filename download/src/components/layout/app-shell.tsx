import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './navigation';
import type { ReactNode } from 'react';
import { Header } from './header';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
