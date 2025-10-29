import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Financial and Operational Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Various reports will be available for viewing here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
