import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ManagementPointsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Management Points</h1>
        <Card>
          <CardHeader>
            <CardTitle>Management Point Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tools for managing and allocating special points will be here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
