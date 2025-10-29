'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Dashboard } from '@/components/dashboard/dashboard';

export default function DashboardPage() {
  return (
    <AppShell>
        <Dashboard />
    </AppShell>
  );
}
