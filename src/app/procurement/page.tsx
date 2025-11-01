import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProcurementPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Procurement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Procurement Dashboard</div>
          <div className="text-muted-foreground">
            Procurement information will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
