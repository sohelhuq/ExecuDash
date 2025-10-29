import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecruitmentPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Recruitment</h1>
        <Card>
          <CardHeader>
            <CardTitle>Recruitment Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Recruitment and hiring information will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
