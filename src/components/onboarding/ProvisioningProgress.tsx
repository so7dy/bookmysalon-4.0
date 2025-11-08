import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  CheckCircle2, 
  Phone, 
  Calendar, 
  Mic2, 
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface ProvisioningProgressProps {
  onComplete: () => void;
}

interface ProvisionStep {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  status: 'pending' | 'loading' | 'complete' | 'error';
  message?: string;
}

export function ProvisioningProgress({ onComplete }: ProvisioningProgressProps) {
  const [, setLocation] = useLocation();
  const [steps, setSteps] = useState<ProvisionStep[]>([
    { id: 'calendar', title: 'Creating calendar events', icon: Calendar, status: 'pending' },
    { id: 'llm', title: 'Configuring AI brain', icon: Sparkles, status: 'pending' },
    { id: 'agent', title: 'Creating AI agent', icon: Mic2, status: 'pending' },
    { id: 'phone', title: 'Provisioning phone number', icon: Phone, status: 'pending' },
  ]);

  const provisionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/tenants/create-ai-agent', {});
      return response;
    },
    onSuccess: async () => {
      // Mark all steps as complete
      setSteps(prev => prev.map(step => ({ ...step, status: 'complete' as const })));
      
      try {
        // Update onboarding step 7 to 'ready' status
        await apiRequest('POST', '/api/receptionist/onboarding/step', {
          step: 7,
          status: 'ready',
        });
        
        // Mark onboarding as complete
        await apiRequest('POST', '/api/receptionist/onboarding/complete', {});
        
        // Invalidate queries to reflect new status
        queryClient.invalidateQueries({ queryKey: ['/api/receptionist/onboarding/progress'] });
        
        // Wait a moment then call onComplete
        setTimeout(() => {
          onComplete();
        }, 1500);
      } catch (error: any) {
        console.error('Failed to mark onboarding complete:', error);
        
        // Mark the last step as error
        setSteps(prev => {
          const newSteps = [...prev];
          newSteps[newSteps.length - 1] = {
            ...newSteps[newSteps.length - 1],
            status: 'error',
            message: 'Failed to save completion status. Please retry.',
          };
          return newSteps;
        });
        
        // Do NOT call onComplete() - keep user on Step 7 to retry
      }
    },
    onError: (error: any) => {
      // Mark current step as error
      setSteps(prev => {
        const currentIndex = prev.findIndex(s => s.status === 'loading');
        if (currentIndex >= 0) {
          const newSteps = [...prev];
          newSteps[currentIndex] = {
            ...newSteps[currentIndex],
            status: 'error',
            message: error.message || 'An error occurred',
          };
          return newSteps;
        }
        return prev;
      });
    },
  });

  // Auto-start provisioning when component mounts
  useEffect(() => {
    const startProvisioning = async () => {
      // Simulate step-by-step progress
      for (let i = 0; i < steps.length; i++) {
        setSteps(prev => {
          const newSteps = [...prev];
          newSteps[i] = { ...newSteps[i], status: 'loading' };
          return newSteps;
        });

        // Wait a bit before showing next step
        await new Promise(resolve => setTimeout(resolve, 800));

        // If last step, trigger actual API call
        if (i === steps.length - 1) {
          provisionMutation.mutate();
        } else {
          // Mark step as complete
          setSteps(prev => {
            const newSteps = [...prev];
            newSteps[i] = { ...newSteps[i], status: 'complete' };
            return newSteps;
          });
        }
      }
    };

    startProvisioning();
  }, []); // Run only once on mount

  const allComplete = steps.every(s => s.status === 'complete');
  const hasError = steps.some(s => s.status === 'error');

  const handleRetry = () => {
    // Reset all steps and trigger provisioning again
    setSteps([
      { id: 'calendar', title: 'Creating calendar events', icon: Calendar, status: 'pending' },
      { id: 'llm', title: 'Configuring AI brain', icon: Sparkles, status: 'pending' },
      { id: 'agent', title: 'Creating AI agent', icon: Mic2, status: 'pending' },
      { id: 'phone', title: 'Provisioning phone number', icon: Phone, status: 'pending' },
    ]);
    
    // Reset mutation state and trigger auto-provisioning again
    provisionMutation.reset();
    
    // Re-trigger provisioning
    const startProvisioning = async () => {
      for (let i = 0; i < 4; i++) {
        setSteps(prev => {
          const newSteps = [...prev];
          newSteps[i] = { ...newSteps[i], status: 'loading' };
          return newSteps;
        });

        await new Promise(resolve => setTimeout(resolve, 800));

        if (i === 3) {
          provisionMutation.mutate();
        } else {
          setSteps(prev => {
            const newSteps = [...prev];
            newSteps[i] = { ...newSteps[i], status: 'complete' };
            return newSteps;
          });
        }
      }
    };

    startProvisioning();
  };

  const handleDashboard = () => {
    setLocation('/app/overview');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">
            {allComplete ? 'Setup Complete!' : hasError ? 'Setup Error' : 'Setting Up Your AI Receptionist'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {allComplete
              ? 'Your AI receptionist is ready to take calls!'
              : hasError
              ? 'Something went wrong during setup'
              : 'This will take just a moment...'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Provisioning Progress</CardTitle>
          <CardDescription>
            {allComplete
              ? 'All systems are go!'
              : hasError
              ? 'Please retry or contact support'
              : 'Please wait while we set up your system'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
                data-testid={`provision-step-${step.id}`}
              >
                <div className="flex-shrink-0">
                  {step.status === 'complete' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" data-testid={`status-complete-${step.id}`} />
                  ) : step.status === 'loading' ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" data-testid={`status-loading-${step.id}`} />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-destructive" data-testid={`status-error-${step.id}`} />
                  ) : (
                    <Icon className="h-5 w-5 text-muted-foreground" data-testid={`status-pending-${step.id}`} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{step.title}</p>
                  {step.message && (
                    <p className="text-sm text-destructive mt-1">{step.message}</p>
                  )}
                  {step.status === 'loading' && (
                    <p className="text-sm text-muted-foreground mt-1">In progress...</p>
                  )}
                  {step.status === 'complete' && (
                    <p className="text-sm text-green-600 mt-1">Complete</p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {allComplete && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Your AI receptionist is live!</p>
            <p className="text-sm">
              You can now start receiving calls. Your phone number and all settings are configured.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Provisioning failed</p>
            <p className="text-sm">
              There was an error setting up your AI receptionist. Please try again or contact support if the problem persists.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t">
        {hasError && (
          <Button
            variant="outline"
            onClick={handleRetry}
            data-testid="button-retry"
          >
            Retry Setup
          </Button>
        )}
        {allComplete && (
          <Button
            onClick={handleDashboard}
            data-testid="button-go-to-dashboard"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
