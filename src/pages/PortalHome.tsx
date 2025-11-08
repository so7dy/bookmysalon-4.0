import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Settings, List, Calendar, LogOut } from 'lucide-react';

export default function PortalHome() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ['/auth/whoami'],
    retry: false,
  });

  const { data: settings } = useQuery({
    queryKey: ['/portal/tenants/settings'],
    enabled: !!session,
  });

  const { data: services } = useQuery({
    queryKey: ['/portal/tenants/services'],
    enabled: !!session,
  });

  useEffect(() => {
    if (session === null) {
      setLocation('/tenant-login');
    }
  }, [session, setLocation]);

  useEffect(() => {
    if (settings && services) {
      const needsOnboarding = !settings.name || services.length === 0;
      if (needsOnboarding) {
        setLocation('/portal/onboarding');
      }
    }
  }, [settings, services, setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/auth/logout', {});
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
      setLocation('/tenant-login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  if (!session || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-business-name">
              {settings.name || 'Portal'}
            </h1>
            <p className="text-sm text-muted-foreground" data-testid="text-timezone">
              {settings.timezone}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/portal/settings">
            <Card className="hover-elevate cursor-pointer" data-testid="card-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
                <CardDescription>
                  Update business details, hours, and contact info
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/portal/services">
            <Card className="hover-elevate cursor-pointer" data-testid="card-services">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Services
                </CardTitle>
                <CardDescription>
                  Manage your service catalog and pricing
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/portal/staff">
            <Card className="hover-elevate cursor-pointer" data-testid="card-staff">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Staff Schedule
                </CardTitle>
                <CardDescription>
                  Configure staff hours and time off
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {settings.retellAgentId && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Retell Integration</CardTitle>
              <CardDescription>
                Your voice assistant is configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Agent ID: <code className="bg-muted px-1 rounded">{settings.retellAgentId}</code>
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
