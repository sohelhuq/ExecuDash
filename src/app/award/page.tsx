import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AwardPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Award</h1>
        <Card>
          <CardHeader>
            <CardTitle>Employee Awards</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Employee awards and recognition information will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
