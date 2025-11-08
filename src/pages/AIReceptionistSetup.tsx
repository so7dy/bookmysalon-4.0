import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import { 
  Check, ChevronRight, ChevronLeft, Sparkles, Phone, 
  Calendar, MapPin, Users, Scissors, Loader2,
  CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'calcom_auth' | 'business_info' | 'staff' | 'services' | 'review';

interface ReceptionistStatus {
  status: string;
  calcomConnected: boolean;
  hasBusinessInfo: boolean;
  hasStaff: boolean;
  hasServices: boolean;
  agentId?: string;
  phoneNumber?: string;
  formattedPhoneNumber?: string;
  agentStatus?: string;
  calcomDefaultEventTypeId?: number;
  businessInfo?: {
    location?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    areaCode?: string;
    operatingHours?: Record<string, { open: string; close: string; closed: boolean }>;
    aiName?: string;
    voiceId?: string;
    additionalLanguages?: string;
  };
  staff?: any[];
  services?: any[];
}

interface EventType {
  id: number;
  title: string;
  lengthInMinutes: number;
  description?: string;
}

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: 'calcom_auth', label: 'Connect Calendar', icon: Calendar },
  { id: 'business_info', label: 'Business Info', icon: MapPin },
  { id: 'staff', label: 'Add Staff', icon: Users },
  { id: 'services', label: 'Add Services', icon: Scissors },
  { id: 'review', label: 'Review & Launch', icon: Sparkles },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function AIReceptionistSetup() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('calcom_auth');
  const [oauthWindowOpened, setOauthWindowOpened] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    location: '',
    city: '',
    state: '',
    zipCode: '',
    areaCode: '',
    aiName: 'Brian',
    voiceId: '11labs-Brian', // Default to male voice
    additionalLanguages: 'English',
    hours: {} as Record<string, { open: string; close: string; closed: boolean }>,
  });
  const [staff, setStaff] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({ name: '', title: '', email: '' });
  const [newService, setNewService] = useState({ name: '', duration: 30, price: 0 });

  // Fetch current status and existing data
  const { data: status, isLoading, refetch } = useQuery<ReceptionistStatus>({
    queryKey: ['/api/receptionist/status'],
    refetchInterval: (query) => {
      // Poll every 2 seconds during provisioning
      if (query.state.data?.status === 'provisioning') return 2000;
      return false;
    },
  });

  // Load existing data on mount
  useEffect(() => {
    if (status) {
      // Set current step based on backend status
      const statusToStep: Record<string, Step> = {
        'not_started': 'calcom_auth',
        'calcom_auth': 'calcom_auth',
        'business_info': 'business_info',
        'staff': 'staff',
        'services': 'services',
        'review': 'review',
        'provisioning': 'review',
        'ready': 'review',
      };
      setCurrentStep(statusToStep[status.status] || 'calcom_auth');

      // Hydrate local state with saved data
      if (status.businessInfo) {
        setBusinessInfo({
          location: status.businessInfo.location || '',
          city: status.businessInfo.city || '',
          state: status.businessInfo.state || '',
          zipCode: status.businessInfo.zipCode || '',
          areaCode: status.businessInfo.areaCode || '',
          aiName: status.businessInfo.aiName || 'Brian',
          voiceId: status.businessInfo.voiceId || '11labs-Brian',
          additionalLanguages: status.businessInfo.additionalLanguages || 'English',
          hours: status.businessInfo.operatingHours || {},
        });
      }

      if (status.staff && status.staff.length > 0) {
        setStaff(status.staff);
      }

      if (status.services && status.services.length > 0) {
        setServices(status.services.map((s: any) => ({
          id: s.serviceId,
          name: s.name,
          duration: s.durationMin,
          price: s.price || 0,
        })));
      }
    }
  }, [status]);

  // Save business info mutation
  const saveBusinessInfo = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/receptionist/business-info', {
        location: data.location,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        areaCode: data.areaCode,
        aiName: data.aiName,
        voiceId: data.voiceId,
        additionalLanguages: data.additionalLanguages || 'English',
        operatingHours: data.hours,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
      toast({ title: 'Business info saved!' });
    },
  });

  // Save staff mutation
  const saveStaff = useMutation({
    mutationFn: async (staffData: any) => {
      const res = await apiRequest('POST', '/api/receptionist/staff', staffData);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
      // Update staff list with returned staff member
      setStaff(prev => [...prev, data.staff]);
      setNewStaff({ name: '', title: '', email: '' });
      toast({ title: 'Staff member added!' });
    },
  });

  // Save services mutation
  const saveServices = useMutation({
    mutationFn: async (serviceList: any[]) => {
      return await apiRequest('POST', '/api/receptionist/services', { services: serviceList });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
      toast({ title: 'Services saved!' });
    },
  });

  // Provision AI receptionist
  const provisionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/receptionist/provision');
    },
    onSuccess: () => {
      // Start polling for status updates
      refetch();
      toast({
        title: 'Provisioning started!',
        description: 'Creating your AI receptionist...',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Provisioning failed',
        description: error.message,
        variant: 'destructive',
      });
      refetch(); // Reload status to go back to review
    },
  });

  const stepIndex = STEPS.findIndex(s => s.id === currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const canProceed = () => {
    if (currentStep === 'calcom_auth') return status?.calcomConnected;
    if (currentStep === 'business_info') return businessInfo.location && businessInfo.city;
    if (currentStep === 'staff') return staff.length > 0;
    if (currentStep === 'services') return services.length > 0;
    return true;
  };

  const handleNext = async () => {
    // Save current step data before proceeding
    if (currentStep === 'business_info') {
      await saveBusinessInfo.mutateAsync(businessInfo);
    }

    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const addStaff = async () => {
    if (newStaff.name && newStaff.email) {
      await saveStaff.mutateAsync(newStaff);
    }
  };

  const addService = async () => {
    if (newService.name) {
      const newServiceData = { ...newService, id: Date.now() };
      const updatedServices = [...services, newServiceData];
      setServices(updatedServices);
      setNewService({ name: '', duration: 30, price: 0 });
      
      // Save to backend immediately
      await saveServices.mutateAsync(updatedServices);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show success screen when ready
  if (status?.status === 'ready') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">AI Receptionist Active!</h2>
            <p className="text-muted-foreground mb-4">
              Your AI receptionist is live and ready to take calls
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg mb-6">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">{status.formattedPhoneNumber}</span>
            </div>
            <Button onClick={() => setLocation('/app/overview')} data-testid="button-go-dashboard">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show provisioning overlay when provisioning
  if (status?.status === 'provisioning') {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Creating Your AI Receptionist</h3>
                <p className="text-sm text-muted-foreground">This will take about 10-15 seconds...</p>
              </div>
              <div className="w-full space-y-2 text-sm text-left text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Crafting AI with your business data...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Provisioning phone number...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Linking number to agent...</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl" data-testid="ai-receptionist-setup">
      {/* Progress Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Setup AI Receptionist</h1>
        <p className="text-muted-foreground mb-4">
          Complete these steps to activate your 24/7 AI phone receptionist
        </p>
        <Progress value={progress} className="h-2 mb-6" />
        
        {/* Step Indicators */}
        <div className="flex justify-between">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isComplete = idx < stepIndex;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                  isActive && 'bg-primary text-primary-foreground',
                  isComplete && 'bg-green-500 text-white',
                  !isActive && !isComplete && 'bg-muted text-muted-foreground'
                )}>
                  {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={cn(
                  'text-sm',
                  isActive && 'font-semibold',
                  !isActive && 'text-muted-foreground'
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Cal.com Calendar */}
          {currentStep === 'calcom_auth' && (
            <div className="space-y-4 text-center py-8">
              <Calendar className="h-16 w-16 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Connect Cal.com Calendar</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Connect your Cal.com account to enable AI-powered appointment booking
              </p>
              {status?.calcomConnected ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Cal.com Connected</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button 
                    onClick={async () => {
                      try {
                        console.log('[OAuth] Starting Cal.com OAuth flow...');
                        const res = await fetch('/oauth/calcom/start');
                        const data = await res.json();
                        
                        if (!data.url) {
                          throw new Error('Failed to get OAuth URL');
                        }

                        console.log('[OAuth] Opening Cal.com authorization...');
                        
                        // Open in new window/tab (browser will decide)
                        window.open(data.url, '_blank');
                        setOauthWindowOpened(true);
                        
                        toast({
                          title: "Authorization Window Opened",
                          description: "After authorizing Cal.com, click 'Check Connection' below.",
                        });
                      } catch (error) {
                        console.error('[OAuth] Error starting OAuth:', error);
                        toast({
                          title: "Connection Failed",
                          description: "Failed to connect to Cal.com. Please try again.",
                          variant: "destructive"
                        });
                      }
                    }} 
                    size="lg" 
                    data-testid="button-connect-calcom"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Connect Cal.com Calendar
                  </Button>
                  
                  {oauthWindowOpened && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        After you authorize Cal.com and see "Connected Successfully!", close that tab and click the button below:
                      </p>
                      <Button
                        onClick={() => {
                          queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
                          toast({
                            title: "Checking Connection",
                            description: "Refreshing connection status...",
                          });
                        }}
                        variant="outline"
                        size="lg"
                        data-testid="button-check-connection"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Check Connection Status
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Business Info */}
          {currentStep === 'business_info' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Business Information</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="location">Business Address</Label>
                    <Input
                      id="location"
                      value={businessInfo.location}
                      onChange={e => setBusinessInfo({ ...businessInfo, location: e.target.value })}
                      placeholder="123 Main St"
                      data-testid="input-location"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={businessInfo.city}
                        onChange={e => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                        placeholder="San Francisco"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={businessInfo.state}
                        onChange={e => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                        placeholder="CA"
                        data-testid="input-state"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={businessInfo.zipCode}
                        onChange={e => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
                        placeholder="94105"
                        data-testid="input-zipcode"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="areaCode">Preferred Area Code (for phone number)</Label>
                    <Input
                      id="areaCode"
                      value={businessInfo.areaCode}
                      onChange={e => setBusinessInfo({ ...businessInfo, areaCode: e.target.value })}
                      placeholder="415"
                      data-testid="input-areacode"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aiName">AI Receptionist Name</Label>
                    <Input
                      id="aiName"
                      value={businessInfo.aiName}
                      onChange={e => setBusinessInfo({ ...businessInfo, aiName: e.target.value })}
                      placeholder="Brian"
                      data-testid="input-ai-name"
                    />
                    <p className="text-sm text-muted-foreground mt-1">This is how your AI receptionist will introduce itself</p>
                  </div>
                  <div>
                    <Label htmlFor="voiceId">AI Voice</Label>
                    <Select 
                      value={businessInfo.voiceId} 
                      onValueChange={value => setBusinessInfo({ ...businessInfo, voiceId: value })}
                    >
                      <SelectTrigger id="voiceId" data-testid="select-voice">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11labs-Brian" data-testid="voice-brian">Brian (Male Voice)</SelectItem>
                        <SelectItem value="11labs-Anna" data-testid="voice-anna">Anna (Female Voice)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">Choose the voice for your AI receptionist</p>
                  </div>
                  <div>
                    <Label htmlFor="additionalLanguages">Additional Languages (optional)</Label>
                    <Input
                      id="additionalLanguages"
                      value={businessInfo.additionalLanguages}
                      onChange={e => setBusinessInfo({ ...businessInfo, additionalLanguages: e.target.value })}
                      placeholder="Spanish, French"
                      data-testid="input-additional-languages"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Languages besides English that your AI should support</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Operating Hours</h4>
                <div className="space-y-2">
                  {DAYS.map(day => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-28 capitalize">{day}</div>
                      <Input
                        type="time"
                        value={businessInfo.hours[day]?.open || '09:00'}
                        onChange={e => setBusinessInfo({
                          ...businessInfo,
                          hours: { ...businessInfo.hours, [day]: { ...businessInfo.hours[day], open: e.target.value, closed: false } }
                        })}
                        className="w-32"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={businessInfo.hours[day]?.close || '17:00'}
                        onChange={e => setBusinessInfo({
                          ...businessInfo,
                          hours: { ...businessInfo.hours, [day]: { ...businessInfo.hours[day], close: e.target.value, closed: false } }
                        })}
                        className="w-32"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Staff */}
          {currentStep === 'staff' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Add Staff Members</h3>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={newStaff.name}
                      onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="John Doe"
                      data-testid="input-staff-name"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={newStaff.title}
                      onChange={e => setNewStaff({ ...newStaff, title: e.target.value })}
                      placeholder="Hair Stylist"
                      data-testid="input-staff-title"
                    />
                  </div>
                </div>
                <div>
                  <Label>Calendar Email</Label>
                  <Input
                    type="email"
                    value={newStaff.email}
                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="john@example.com"
                    data-testid="input-staff-email"
                  />
                </div>
                <Button onClick={addStaff} disabled={saveStaff.isPending} data-testid="button-add-staff">
                  {saveStaff.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Staff Member
                </Button>
              </div>

              {staff.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Staff List ({staff.length})</h4>
                  {staff.map((s: any) => (
                    <div key={s.staffId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Services */}
          {currentStep === 'services' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Add Services</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label>Service Name</Label>
                  <Input
                    value={newService.name}
                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Haircut"
                    data-testid="input-service-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={newService.duration}
                      onChange={e => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                      data-testid="input-service-duration"
                    />
                  </div>
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={newService.price}
                      onChange={e => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                      data-testid="input-service-price"
                    />
                  </div>
                </div>
                <Button onClick={addService} data-testid="button-add-service">
                  Add Service
                </Button>
              </div>

              {services.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Services List ({services.length})</h4>
                  {services.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.duration} min • ${s.price}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setServices(services.filter((x: any) => x.id !== s.id))}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Ready to Launch!</h3>
                <p className="text-muted-foreground">
                  Review your information and create your AI receptionist
                </p>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Business Information</h4>
                    <p>{businessInfo.location}</p>
                    <p>{businessInfo.city}, {businessInfo.state} {businessInfo.zipCode}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Phone area code: {businessInfo.areaCode || '800'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Staff ({staff.length})</h4>
                    {staff.slice(0, 3).map((s: any) => (
                      <div key={s.staffId} className="mb-2">
                        <p className="font-medium">{s.name}</p>
                      </div>
                    ))}
                    {staff.length > 3 && <p className="text-sm text-muted-foreground">+{staff.length - 3} more</p>}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Services ({services.length})</h4>
                    {services.slice(0, 3).map((s: any) => (
                      <div key={s.id} className="mb-2">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.duration} min • ${s.price}</p>
                      </div>
                    ))}
                    {services.length > 3 && <p className="text-sm text-muted-foreground">+{services.length - 3} more</p>}
                  </CardContent>
                </Card>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => provisionMutation.mutate()}
                disabled={provisionMutation.isPending}
                data-testid="button-launch"
              >
                {provisionMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating AI Receptionist...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Create AI Receptionist
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={stepIndex === 0}
          data-testid="button-back"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentStep !== 'review' && (
          <Button
            onClick={handleNext}
            disabled={!canProceed() || saveBusinessInfo.isPending}
            data-testid="button-next"
          >
            {saveBusinessInfo.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
