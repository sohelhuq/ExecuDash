'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepartmentPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Departments</div>
          <div className="text-muted-foreground">
            Department management and information will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
