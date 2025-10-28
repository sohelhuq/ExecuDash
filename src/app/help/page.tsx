import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Documentation, FAQs, and support contact information will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
