import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Calendar, 
  Users, 
  Scissors, 
  Mic2, 
  CheckCircle2, 
  Loader2, 
  Edit, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ReviewConfirmProps {
  onComplete: () => void;
  onEdit: (step: number) => void;
  isLoading?: boolean;
}

interface OnboardingData {
  businessInfo: {
    businessName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    website?: string;
    timezone: string;
  };
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  staff: Array<{
    id: string;
    name: string;
    email: string;
    calendarId?: string;
  }>;
  calOAuth: {
    connected: boolean;
    userEmail?: string;
  };
  aiSettings: {
    voiceChoice: string;
    greetingMessage?: string;
  };
}

export function ReviewConfirm({ onComplete, onEdit, isLoading }: ReviewConfirmProps) {
  const { data, isLoading: dataLoading, error } = useQuery<{
    success: boolean;
    data: OnboardingData;
  }>({
    queryKey: ['/api/receptionist/onboarding/data'],
  });

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load your onboarding data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const onboardingData = data.data;

  // Validate all required data is present
  const validationErrors: string[] = [];
  
  // Check business info
  if (!onboardingData.businessInfo.businessName) validationErrors.push('Business name is required');
  if (!onboardingData.businessInfo.email) validationErrors.push('Email is required');
  if (!onboardingData.businessInfo.phone) validationErrors.push('Phone number is required');
  if (!onboardingData.businessInfo.timezone) validationErrors.push('Timezone is required');
  
  // Check services
  if (!onboardingData.services || onboardingData.services.length === 0) {
    validationErrors.push('At least one service is required');
  }
  
  // Check staff
  if (!onboardingData.staff || onboardingData.staff.length === 0) {
    validationErrors.push('At least one staff member is required');
  }
  
  // Check Cal.com connection
  if (!onboardingData.calOAuth.connected) {
    validationErrors.push('Cal.com connection is required');
  }
  
  // Check AI settings
  if (!onboardingData.aiSettings.voiceChoice) {
    validationErrors.push('Voice selection is required');
  }
  if (!onboardingData.aiSettings.greetingMessage) {
    validationErrors.push('Greeting message is required');
  }
  
  const isValid = validationErrors.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">Review & Confirm</h2>
          <p className="text-sm text-muted-foreground">
            Review your setup before we create your AI receptionist
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Business Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Business Information</CardTitle>
                <CardDescription>Your business details</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(1)}
              data-testid="button-edit-business-info"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span data-testid="text-business-name">{onboardingData.businessInfo.businessName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span data-testid="text-email">{onboardingData.businessInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span data-testid="text-phone">{onboardingData.businessInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Timezone:</span>
                <span data-testid="text-timezone">{onboardingData.businessInfo.timezone}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-medium">Address:</span>
                <span className="ml-2" data-testid="text-address">
                  {onboardingData.businessInfo.address}, {onboardingData.businessInfo.city}, {onboardingData.businessInfo.state} {onboardingData.businessInfo.zipCode}
                </span>
              </div>
            </div>
            {onboardingData.businessInfo.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Website:</span>
                <a 
                  href={onboardingData.businessInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  data-testid="link-website"
                >
                  {onboardingData.businessInfo.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Scissors className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Services & Operations</CardTitle>
                <CardDescription>{onboardingData.services.length} services configured</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(2)}
              data-testid="button-edit-services"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onboardingData.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  data-testid={`service-${service.id}`}
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${service.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Staff Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Staff Members</CardTitle>
                <CardDescription>{onboardingData.staff.length} team members</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(3)}
              data-testid="button-edit-staff"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onboardingData.staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start justify-between p-3 bg-muted rounded-lg"
                  data-testid={`staff-${member.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.calendarId && (
                      <p className="text-xs text-muted-foreground mt-1">Calendar ID: {member.calendarId}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cal.com Connection Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Calendar Connection</CardTitle>
                <CardDescription>Cal.com integration</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(4)}
              data-testid="button-edit-calendar"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {onboardingData.calOAuth.connected ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Connected to Cal.com
                  </p>
                  {onboardingData.calOAuth.userEmail && (
                    <p className="text-sm text-green-700 dark:text-green-300" data-testid="text-calcom-email">
                      {onboardingData.calOAuth.userEmail}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Cal.com not connected. Please connect your calendar to continue.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* AI Settings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-3">
              <Mic2 className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">AI Voice Settings</CardTitle>
                <CardDescription>Receptionist configuration</CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(5)}
              data-testid="button-edit-ai-settings"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mic2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Voice:</span>
              <Badge variant="secondary" data-testid="text-voice-choice">
                {onboardingData.aiSettings.voiceChoice}
              </Badge>
            </div>
            {onboardingData.aiSettings.greetingMessage && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Greeting Message:</p>
                <p className="text-sm text-muted-foreground" data-testid="text-greeting-message">
                  "{onboardingData.aiSettings.greetingMessage}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {validationErrors.length > 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-medium mb-2">Please complete the following before continuing:</p>
            <ul className="list-disc list-inside space-y-1" data-testid="validation-errors">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Everything looks good! Click continue to provision your AI receptionist. This will create your calendar events and activate your phone system.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          onClick={onComplete}
          disabled={isLoading || !isValid}
          data-testid="button-continue"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Provisioning...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Continue to Provisioning
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
