import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PayrollPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Payroll</h1>
        <Card>
          <CardHeader>
            <CardTitle>Payroll Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Payroll information and processing tools will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
