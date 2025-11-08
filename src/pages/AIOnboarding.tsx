import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { BusinessInfo } from '@/components/onboarding/BusinessInfo';
import { ServicesOperations } from '@/components/onboarding/ServicesOperations';
import { StaffSetup } from '@/components/onboarding/StaffSetup';
import { CalOAuthConnect } from '@/components/onboarding/CalOAuthConnect';
import { AISettings } from '@/components/onboarding/AISettings';
import { ReviewConfirm } from '@/components/onboarding/ReviewConfirm';
import { ProvisioningProgress } from '@/components/onboarding/ProvisioningProgress';

interface OnboardingProgress {
  currentStep: number;
  status: string;
  completedSteps: number;
  totalSteps: number;
  onboardingCompleted: boolean;
  savedData?: {
    // Step 1 - Business Info
    name?: string;
    email?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneAreaCode?: string;
    timezone?: string;
    // Step 2 - Services & Hours
    services?: Array<{
      id: string;
      name: string;
      durationMin: number;
      price?: number;
    }>;
    operatingHours?: any;
    // Step 3 - Staff Setup
    staffMembers?: Array<{
      id: string;
      name: string;
      email: string;
      services: string[];
    }>;
    // Step 5 - AI Settings
    voiceChoice?: string;
    greetingMessage?: string;
  };
}

const STEP_TITLES = [
  'Business Information',
  'Services & Hours',
  'Staff Setup',
  'Calendar Connection',
  'AI Voice Settings',
  'Review & Confirm',
  'Setting Up Your AI',
];

const STEP_DESCRIPTIONS = [
  'Tell us about your business',
  'Add your services and operating hours',
  'Configure your team members',
  'Connect your calendar',
  'Choose your AI voice and greeting',
  'Review everything before we set up your AI',
  'Creating your AI receptionist...',
];

export default function AIOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch onboarding progress
  const { data: progress, isLoading: progressLoading } = useQuery<{ success: boolean; progress: OnboardingProgress }>({
    queryKey: ['/api/receptionist/onboarding/progress'],
  });

  // Update current step from backend progress
  useEffect(() => {
    if (progress?.progress?.currentStep) {
      setCurrentStep(progress.progress.currentStep);
    }
  }, [progress]);

  // Redirect to dashboard if onboarding is complete
  useEffect(() => {
    if (progress?.progress?.onboardingCompleted) {
      setLocation('/app/overview');
    }
  }, [progress, setLocation]);

  // Mutation to update step
  const updateStep = useMutation({
    mutationFn: async ({ step, status, data }: { step: number; status: string; data?: any }) => {
      return await apiRequest('POST', '/api/receptionist/onboarding/step', {
        step,
        status,
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/onboarding/progress'] });
    },
  });

  const handleStepComplete = async (data?: any) => {
    const statusMap: Record<number, string> = {
      1: 'business_info',
      2: 'services',
      3: 'staff',
      4: 'calcom_auth',
      5: 'review', // TODO: Add 'ai_settings' status when backend supports it
      6: 'review',
      7: 'ready',
    };

    try {
      // Save current step
      await updateStep.mutateAsync({
        step: currentStep,
        status: statusMap[currentStep],
        data,
      });

      // If we just completed step 6 (review), move to step 7 (provisioning)
      if (currentStep === 6) {
        // Move to provisioning step
        setCurrentStep(7);
        
        // Set status to provisioning
        await updateStep.mutateAsync({
          step: 7,
          status: 'provisioning',
        });
        
        // ProvisioningProgress component will handle the actual provisioning
        // and call onComplete when done
      } else if (currentStep < 6) {
        // Normal step progression
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save progress',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    const isLoading = updateStep.isPending;

    switch (currentStep) {
      case 1:
        return (
          <BusinessInfo
            onComplete={(data) => handleStepComplete(data)}
            initialData={progress?.progress?.savedData}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <ServicesOperations
            onComplete={(data) => handleStepComplete(data)}
            initialData={progress?.progress?.savedData}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <StaffSetup
            onComplete={(data) => handleStepComplete(data)}
            initialData={progress?.progress?.savedData}
            availableServices={progress?.progress?.savedData?.services?.map(s => ({ id: s.id, name: s.name })) || []}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <CalOAuthConnect
            onComplete={() => handleStepComplete()}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <AISettings
            savedData={{
              voiceChoice: progress?.progress?.savedData?.voiceChoice,
              greetingMessage: progress?.progress?.savedData?.greetingMessage,
            }}
            onComplete={(data) => handleStepComplete(data)}
            isLoading={isLoading}
          />
        );
      case 6:
        return (
          <ReviewConfirm
            onComplete={() => handleStepComplete()}
            onEdit={(step) => {
              // Navigate back to the specified step
              queryClient.setQueryData(['/api/receptionist/onboarding/progress'], (old: any) => ({
                ...old,
                progress: {
                  ...old?.progress,
                  currentStep: step,
                },
              }));
            }}
            isLoading={isLoading}
          />
        );
      case 7:
        return (
          <ProvisioningProgress
            onComplete={() => {
              // Provisioning complete - redirect to dashboard
              toast({
                title: 'Success!',
                description: 'Your AI receptionist is ready',
              });
              setLocation('/app/overview');
            }}
          />
        );
      default:
        return null;
    }
  };

  if (progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep - 1) / 7) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>AI Receptionist Setup</CardTitle>
          <CardDescription>
            Step {currentStep} of 7: {STEP_TITLES[currentStep - 1]}
          </CardDescription>

          {/* Progress Bar */}
          <div className="space-y-2 pt-4">
            <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1 pt-4 overflow-x-auto">
            {STEP_TITLES.map((title, index) => {
              const stepNumber = index + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <div key={stepNumber} className="flex items-center min-w-0">
                  <div className="flex flex-col items-center gap-1 min-w-0">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                        isCompleted
                          ? 'bg-primary border-primary text-primary-foreground'
                          : isCurrent
                          ? 'border-primary text-primary bg-background'
                          : 'border-muted text-muted-foreground bg-background'
                      }`}
                      data-testid={`step-indicator-${stepNumber}`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" data-testid={`step-check-${stepNumber}`} />
                      ) : (
                        <span className="text-xs font-medium">{stepNumber}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs text-center truncate max-w-[80px] ${
                        isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {stepNumber < 7 && (
                    <div
                      className={`h-0.5 w-4 mx-1 flex-shrink-0 ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">{STEP_TITLES[currentStep - 1]}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {STEP_DESCRIPTIONS[currentStep - 1]}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            {currentStep > 1 && currentStep < 7 && (
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
                disabled={updateStep.isPending}
              >
                {updateStep.isPending ? 'Loading...' : 'Back'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
