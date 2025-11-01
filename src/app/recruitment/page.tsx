'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecruitmentPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Recruitment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Recruitment Pipeline</div>
          <div className="text-muted-foreground">
            Recruitment and hiring information will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
