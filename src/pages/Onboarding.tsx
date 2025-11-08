import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { timezones, guessTimezone } from '@/lib/timezones';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

export default function Onboarding() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState<{ [key: number]: boolean }>({});

  // Step 1 - Business Settings
  const [businessName, setBusinessName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [hoursStart, setHoursStart] = useState('09:00');
  const [hoursEnd, setHoursEnd] = useState('18:00');
  const [address, setAddress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [frontDeskPhone, setFrontDeskPhone] = useState('');

  // Step 2 - Services
  const [services, setServices] = useState<Array<{ name: string; duration: string; buffer: string; price: string }>>([
    { name: '', duration: '30', buffer: '0', price: '0.00' }
  ]);

  // Initialize timezone from browser
  useEffect(() => {
    if (!timezone) {
      setTimezone(guessTimezone());
    }
  }, []);

  const saveSettings = useMutation({
    mutationFn: async () => {
      return await apiRequest('PUT', '/portal/tenants/settings', {
        name: businessName,
        timezone,
        hours: { start: hoursStart, end: hoursEnd },
        address,
        ownerPhone,
        frontDeskPhone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/portal/tenants/settings'] });
      setSaved(prev => ({ ...prev, 1: true }));
    },
  });

  const saveServices = useMutation({
    mutationFn: async () => {
      const formatted = services
        .filter(s => s.name.trim())
        .map(s => ({
          serviceId: s.name.toLowerCase().replace(/\s+/g, '-'),
          name: s.name,
          durationMin: parseInt(s.duration) || 30,
          bufferMin: parseInt(s.buffer) || 0,
          price: parseFloat(s.price) || 0,
        }));
      return await apiRequest('PUT', '/portal/tenants/services', formatted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/portal/tenants/services'] });
      setSaved(prev => ({ ...prev, 2: true }));
    },
  });

  const finalizeOnboarding = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/portal/tenants/onboarding/complete', {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/portal/tenants/settings'] });
      localStorage.setItem('onboardingComplete', '1');
    },
  });

  const handleNext = async () => {
    try {
      if (step === 1) {
        if (!businessName) {
          toast({
            title: 'Required',
            description: 'Please enter a business name',
            variant: 'destructive',
          });
          return;
        }
        await saveSettings.mutateAsync();
        toast({
          title: 'Saved',
          description: 'Business settings saved successfully',
        });
        setStep(2);
      } else if (step === 2) {
        if (services.every(s => !s.name.trim())) {
          toast({
            title: 'Required',
            description: 'Please add at least one service',
            variant: 'destructive',
          });
          return;
        }
        await saveServices.mutateAsync();
        await finalizeOnboarding.mutateAsync();
        
        toast({
          title: 'All set!',
          description: 'Your portal is ready to use',
        });
        setLocation('/app/overview');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save',
        variant: 'destructive',
      });
    }
  };

  const addService = () => {
    setServices([...services, { name: '', duration: '30', buffer: '0', price: '0.00' }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const formatPrice = (index: number) => {
    const updated = [...services];
    const price = parseFloat(updated[index].price) || 0;
    updated[index].price = price.toFixed(2);
    setServices(updated);
  };

  const isLoading = saveSettings.isPending || saveServices.isPending || finalizeOnboarding.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Setup Your Portal</CardTitle>
          <CardDescription>
            Complete these steps to get started
          </CardDescription>
          
          {/* Stepper */}
          <div className="flex items-center gap-2 pt-4">
            {[1, 2].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step > num || saved[num]
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step === num
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                }`}>
                  {saved[num] ? <Check className="w-4 h-4" /> : num}
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${
                  num < 2 ? (step > num || saved[num] ? 'bg-primary' : 'bg-muted') : 'hidden'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 text-sm">
            <span className={step === 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>Settings</span>
            <span className={step === 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}>Services</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Business Settings */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName" data-testid="label-business-name">Business Name *</Label>
                <Input
                  id="businessName"
                  data-testid="input-business-name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Modern Cuts Barbershop"
                />
              </div>

              <div>
                <Label htmlFor="timezone" data-testid="label-timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger data-testid="select-timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address" data-testid="label-address">Address</Label>
                <Input
                  id="address"
                  data-testid="input-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, State"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Start typing to search your address
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerPhone" data-testid="label-owner-phone">Owner Phone</Label>
                  <Input
                    id="ownerPhone"
                    data-testid="input-owner-phone"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+12025550123"
                  />
                </div>
                <div>
                  <Label htmlFor="frontDeskPhone" data-testid="label-front-desk-phone">Front Desk Phone</Label>
                  <Input
                    id="frontDeskPhone"
                    data-testid="input-front-desk-phone"
                    value={frontDeskPhone}
                    onChange={(e) => setFrontDeskPhone(e.target.value)}
                    placeholder="+12025550124"
                  />
                </div>
              </div>

              <div>
                <Label>Business Hours</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="hoursStart" className="text-sm text-muted-foreground">Open</Label>
                    <Input
                      id="hoursStart"
                      type="time"
                      data-testid="input-hours-start"
                      value={hoursStart}
                      onChange={(e) => setHoursStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hoursEnd" className="text-sm text-muted-foreground">Close</Label>
                    <Input
                      id="hoursEnd"
                      type="time"
                      data-testid="input-hours-end"
                      value={hoursEnd}
                      onChange={(e) => setHoursEnd(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Used to filter bookable times
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Services</h3>
                  <p className="text-sm text-muted-foreground">
                    Set how long each service takes with an optional buffer. Price is shown on confirmations.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addService}
                  data-testid="button-add-service"
                >
                  Add Service
                </Button>
              </div>

              <div className="space-y-2">
                {services.map((service, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-sm">Service Name</Label>
                      <Input
                        placeholder="Haircut"
                        data-testid={`input-service-name-${index}`}
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                      />
                    </div>

                    <div className="w-24">
                      <div className="flex items-center gap-1">
                        <Label className="text-sm">Duration</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Client time</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        type="number"
                        placeholder="30"
                        data-testid={`input-service-duration-${index}`}
                        value={service.duration}
                        onChange={(e) => updateService(index, 'duration', e.target.value)}
                      />
                    </div>

                    <div className="w-24">
                      <div className="flex items-center gap-1">
                        <Label className="text-sm">Buffer</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cleanup time after service</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        type="number"
                        placeholder="0"
                        data-testid={`input-service-buffer-${index}`}
                        value={service.buffer}
                        onChange={(e) => updateService(index, 'buffer', e.target.value)}
                      />
                    </div>

                    <div className="w-28">
                      <Label className="text-sm">Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        data-testid={`input-service-price-${index}`}
                        value={service.price}
                        onChange={(e) => updateService(index, 'price', e.target.value)}
                        onBlur={() => formatPrice(index)}
                      />
                    </div>

                    {services.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(index)}
                        data-testid={`button-remove-service-${index}`}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                data-testid="button-back"
                disabled={isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className={step === 1 ? 'ml-auto' : ''}
              data-testid="button-next"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : step === 2 ? 'Save & Finish' : 'Save & Continue'}
              {step < 2 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
