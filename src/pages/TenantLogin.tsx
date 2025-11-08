import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function TenantLogin() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [devCode, setDevCode] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiRequest('POST', '/auth/magic/start', { email });
      const result = await res.json();
      
      if (result.devCode) {
        setDevCode(result.devCode);
        toast({
          title: 'Development Mode',
          description: `Your code is: ${result.devCode}`,
        });
      } else {
        toast({
          title: 'Code Sent',
          description: 'Check your email for the login code',
        });
      }
      
      setStep('code');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await apiRequest('POST', '/auth/magic/verify', { email, code });
      const result = await res.json();
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      setLocation('/portal');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>BookMySalon Portal</CardTitle>
          <CardDescription>
            {step === 'email' 
              ? 'Enter your email to receive a login code' 
              : 'Enter the 6-digit code sent to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" data-testid="label-email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@moderncuts.example"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                data-testid="button-send-code"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              {devCode && (
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium">Development Mode</p>
                  <p className="text-muted-foreground">Code: {devCode}</p>
                </div>
              )}
              <div>
                <Label htmlFor="code" data-testid="label-code">6-Digit Code</Label>
                <Input
                  id="code"
                  type="text"
                  data-testid="input-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  data-testid="button-verify-code"
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  data-testid="button-back"
                  onClick={() => {
                    setStep('email');
                    setCode('');
                    setDevCode('');
                  }}
                >
                  Back to Email
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
