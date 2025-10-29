import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PointCategoriesPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Point Categories</h1>
        <Card>
          <CardHeader>
            <CardTitle>Reward Point Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Management of reward point categories will be done here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
