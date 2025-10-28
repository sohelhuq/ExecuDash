import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function TrendsPage() {
  return (
    <AppShell>
      <div className="space-y-4">
         <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trend Analysis & Forecasting</h1>
            <p className="text-muted-foreground">
              Leverage AI to understand trends and forecast future performance.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Analyze a Metric</CardTitle>
            <CardDescription>Select a business unit and metric to generate an AI-powered analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* The form to call analyzeTrendsAndForecast would be implemented here */}
            <p className="text-muted-foreground">Trend analysis form and results will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
