import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProcurementPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Procurement</h1>
        <Card>
          <CardHeader>
            <CardTitle>Procurement Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Procurement information will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
