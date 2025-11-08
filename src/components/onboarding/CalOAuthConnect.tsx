import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, CheckCircle2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface CalOAuthConnectProps {
  onComplete: () => void;
  isLoading?: boolean;
}

export function CalOAuthConnect({ onComplete, isLoading }: CalOAuthConnectProps) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check Cal.com connection status
  const { data: connectionStatus, isLoading: statusLoading } = useQuery<{
    success: boolean;
    connected: boolean;
    userEmail?: string;
    userId?: string;
  }>({
    queryKey: ['/api/receptionist/calcom-status'],
  });

  const isConnected = connectionStatus?.connected || false;
  const userEmail = connectionStatus?.userEmail;

  // Listen for OAuth success message from popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'CALCOM_OAUTH_SUCCESS') {
        console.log('Cal.com OAuth success message received');
        setConnecting(false);
        
        // Refresh connection status
        await queryClient.invalidateQueries({ queryKey: ['/api/receptionist/calcom-status'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/receptionist/onboarding/progress'] });
        
        // Auto-advance to next step after successful connection
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);

      // Get OAuth URL from backend
      const response = await fetch('/oauth/calcom/start');
      const data = await response.json();

      if (!data.url) {
        throw new Error('Failed to get OAuth URL');
      }

      // Open OAuth popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        data.url,
        'Cal.com OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        throw new Error('Failed to open popup. Please allow popups for this site.');
      }

      // Set timeout in case user closes popup without completing OAuth
      const timeout = setTimeout(() => {
        if (!popup.closed) {
          popup.close();
        }
        setConnecting(false);
        setError('Connection timed out. Please try again.');
      }, 300000); // 5 minute timeout

      // Poll for popup closure (for manual close or timeout)
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          clearTimeout(timeout);
          setConnecting(false);
          
          // Refresh connection status even on manual close
          queryClient.invalidateQueries({ queryKey: ['/api/receptionist/calcom-status'] });
          queryClient.invalidateQueries({ queryKey: ['/api/receptionist/onboarding/progress'] });
        }
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Cal.com');
      setConnecting(false);
    }
  };

  const handleContinue = () => {
    if (isConnected) {
      onComplete();
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">Connect Calendar</h2>
          <p className="text-sm text-muted-foreground">
            Connect your Cal.com account to manage bookings
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cal.com Integration</CardTitle>
          <CardDescription>
            We'll create event types for each of your services automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Connected to Cal.com
                  </p>
                  {userEmail && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  Your calendar is connected. We'll automatically create event types for your services when you complete the setup.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">What happens when you connect?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>We'll create event types for each service you offer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Your AI receptionist will check availability in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Bookings will sync automatically to your calendar</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full"
                data-testid="button-connect-calcom"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Connect Cal.com
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Don't have a Cal.com account?{' '}
                <a
                  href="https://cal.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                  data-testid="link-calcom-signup"
                >
                  Sign up here
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          onClick={handleContinue}
          disabled={!isConnected || isLoading}
          data-testid="button-continue"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
