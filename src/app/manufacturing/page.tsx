'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManufacturingPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Manufacturing Overview</div>
          <div className="text-muted-foreground">
            Manufacturing processes, bill of materials, and production data will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
