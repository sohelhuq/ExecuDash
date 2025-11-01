'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PointCategoriesPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Point Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Reward Point Categories</div>
          <div className="text-muted-foreground">
            Management of reward point categories will be done here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
