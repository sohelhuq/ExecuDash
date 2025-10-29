import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoanPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Loan</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loan Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Employee loan information will be displayed here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
