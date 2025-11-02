'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NoticeBoardPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Notice Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold mb-2">Company Notices</div>
          <div className="text-muted-foreground">
            Company-wide notices will be displayed here.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
