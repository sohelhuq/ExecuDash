'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttendancePage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Attendance Records</div>
          <div className="text-muted-foreground">
            Attendance tracking and records will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
