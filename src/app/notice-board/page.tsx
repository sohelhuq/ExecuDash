import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NoticeBoardPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Notice Board</h1>
        <Card>
          <CardHeader>
            <CardTitle>Company Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Company-wide notices will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
