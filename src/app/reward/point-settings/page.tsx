import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PointSettingsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Point Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>General Point Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              General settings for the reward point system will be here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
