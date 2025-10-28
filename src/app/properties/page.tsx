'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PropertiesPage() {
    const { toast } = useToast();

    const handleButtonClick = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `${action} functionality will be implemented here.`,
        });
    };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties Management</h1>
          <p className="text-muted-foreground">Manage property data and rent collection processes.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Property Actions</CardTitle>
                <CardDescription>Choose an action to manage your properties or view rent collection data.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => handleButtonClick('Data Entry')}>
                    <FilePlus className="mr-2 h-5 w-5" />
                    Data Entry
                </Button>
                <Button size="lg" variant="secondary" onClick={() => handleButtonClick('Rent Collection Dashboard')}>
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Rent Collection Dashboard
                </Button>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
