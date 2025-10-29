import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LeavePage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Leave</h1>
        <Card>
          <CardHeader>
            <CardTitle>Leave Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Leave requests and balances will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
