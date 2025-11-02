'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GeneralPointSettingsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Point Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">General Point Settings</div>
          <div className="text-muted-foreground">
            General settings for the reward point system will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
