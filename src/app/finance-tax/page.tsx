'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FinanceTaxPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ফিনান্স ও ট্যাক্স ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">Manage your finance and tax information.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Finance & Tax Overview</CardTitle>
            <CardDescription>This is a placeholder page for finance and tax management.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Future content for finance and tax management will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
