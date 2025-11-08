import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Calendar, ExternalLink, Key, Info } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Integrations() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  
  // Query Cal.com connection status
  const { data: status } = useQuery<{ calcomConnected: boolean; calcomApiKey?: string }>({
    queryKey: ['/api/receptionist/status'],
  });

  const calcomConnected = status?.calcomConnected || false;
  const hasApiKey = !!status?.calcomApiKey;
  
  // Mutation to save Cal.com API key
  const saveApiKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      return await apiRequest('POST', '/api/receptionist/calcom-api-key', { calcomApiKey: key });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Cal.com API key saved successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
      setApiKey('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save API key',
        variant: 'destructive',
      });
    }
  });
  
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive',
      });
      return;
    }
    saveApiKeyMutation.mutate(apiKey);
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('/oauth/calcom/start');
      const data = await res.json();
      
      if (!res.ok || !data.url) {
        console.error('Cal.com OAuth start failed:', data);
        alert(`Failed to start Cal.com connection: ${data.error || 'Unknown error'}`);
        return;
      }
      
      console.log('Opening Cal.com OAuth in popup:', data.url);
      
      // Open OAuth in a centered popup window
      const width = 600;
      const height = 700;
      const left = (window.screen.width / 2) - (width / 2);
      const top = (window.screen.height / 2) - (height / 2);
      
      const popup = window.open(
        data.url,
        'Cal.com Authorization',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      );
      
      if (!popup) {
        alert('Popup blocked! Please allow popups for this site and try again.');
        return;
      }
      
      // Listen for OAuth success message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'CALCOM_OAUTH_SUCCESS') {
          console.log('Cal.com OAuth succeeded! Refreshing page...');
          window.removeEventListener('message', handleMessage);
          clearInterval(checkPopup);
          // Reload page to show connected status
          window.location.reload();
        }
      };
      window.addEventListener('message', handleMessage);
      
      // Also poll for popup close as fallback
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', handleMessage);
          // Reload page to check if OAuth succeeded
          window.location.reload();
        }
      }, 500);
    } catch (error) {
      console.error('Failed to connect Cal.com:', error);
      alert('Failed to start Cal.com connection. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Manage your calendar and booking integrations</p>
      </div>

      {/* Cal.com Integration */}
      <Card data-testid="card-calcom-integration">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Cal.com Calendar</CardTitle>
                <CardDescription>
                  Professional booking and calendar management
                </CardDescription>
              </div>
            </div>
            {calcomConnected ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Connected
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your Cal.com account to enable AI-powered appointment booking and calendar management.
            Your AI receptionist will use Cal.com to check availability and create bookings.
          </p>
          
          {!calcomConnected ? (
            <div className="space-y-3">
              <Button 
                onClick={handleConnect} 
                className="w-full"
                data-testid="button-connect-calcom"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Connect Cal.com
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://cal.com', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Create Cal.com Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✓ Cal.com is connected and your AI receptionist can book appointments
                </p>
              </div>
              
              {/* API Key Section */}
              <div className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-start gap-2">
                  <Key className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="calcom-api-key">
                      Cal.com API Key {hasApiKey && <Badge variant="default" className="ml-2 text-xs">Configured</Badge>}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Required for AI booking functions. OAuth tokens expire after 30-60 minutes.
                      A permanent API key ensures your AI receptionist works reliably.
                    </p>
                  </div>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>How to get your Cal.com API key:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to <a href="https://app.cal.com/settings/security" target="_blank" rel="noopener noreferrer" className="underline text-primary">Cal.com Security Settings</a></li>
                      <li>Scroll to "API Keys" section</li>
                      <li>Click "Create API Key"</li>
                      <li>Copy the key (starts with "cal_live_...")</li>
                      <li>Paste it below and click Save</li>
                    </ol>
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-2">
                  <Input
                    id="calcom-api-key"
                    type="password"
                    placeholder="cal_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    data-testid="input-calcom-api-key"
                  />
                  <Button 
                    onClick={handleSaveApiKey}
                    disabled={saveApiKeyMutation.isPending}
                    data-testid="button-save-api-key"
                  >
                    {saveApiKeyMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => window.open('https://cal.com/event-types', '_blank')}
                data-testid="button-manage-calcom"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Event Types
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Future Integrations Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Integrations</CardTitle>
          <CardDescription>More integrations coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Future integrations: Stripe payments, SMS notifications, and more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
