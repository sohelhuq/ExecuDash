'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { userProfile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && userProfile?.userType !== 'Admin') {
      router.push('/dashboard');
    }
  }, [userProfile, isLoading, router]);

  if (isLoading || userProfile?.userType !== 'Admin') {
    return (
      <AppShell>
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>This page is only visible to administrators.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Welcome, Admin!</p>
          <p>You can manage users, settings, and other administrative tasks here.</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
