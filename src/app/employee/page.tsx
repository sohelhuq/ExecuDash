'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeePage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Employee Information</div>
          <div className="text-muted-foreground">
            Employee records and management tools will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
