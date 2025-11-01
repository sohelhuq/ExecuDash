'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProjectManagementPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Projects Overview</div>
          <div className="text-muted-foreground">
            Project management information will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
