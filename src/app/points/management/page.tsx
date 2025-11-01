'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagementPointsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Management Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Management Point Allocation</div>
          <div className="text-muted-foreground">
            Tools for managing and allocating special points will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
