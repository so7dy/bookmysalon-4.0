import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { timezones } from '@/lib/timezones';
import { AlertCircle, MessageSquare, Bell, Info } from 'lucide-react';
import { Link } from 'wouter';
import AgentReplacement from '@/components/AgentReplacement';

interface TenantSettings {
  name: string;
  timezone: string;
  hours: { start: string; end: string };
  address: string;
  ownerPhone: string;
  frontDeskPhone: string;
  onboardingComplete: boolean;
  smsRemindersEnabled?: boolean;
  sms24hReminderEnabled?: boolean;
  sms2hReminderEnabled?: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [hoursStart, setHoursStart] = useState('09:00');
  const [hoursEnd, setHoursEnd] = useState('18:00');
  const [address, setAddress] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [frontDeskPhone, setFrontDeskPhone] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [sms24h, setSms24h] = useState(true);
  const [sms2h, setSms2h] = useState(true);

  const { data: settings, isLoading } = useQuery<TenantSettings>({
    queryKey: ['/portal/tenants/settings'],
  });

  // Fetch receptionist status for agent replacement
  const { data: receptionistStatus } = useQuery<{
    status: string;
    agentId?: string;
    phoneNumber?: string;
    formattedPhoneNumber?: string;
    calcomConnected: boolean;
    calcomApiKey: boolean;
    hasBusinessInfo: boolean;
    hasStaff: boolean;
    hasServices: boolean;
  }>({
    queryKey: ['/api/receptionist/status'],
  });

  useEffect(() => {
    if (settings) {
      setBusinessName(settings.name || '');
      setTimezone(settings.timezone || 'America/New_York');
      setHoursStart(settings.hours?.start || '09:00');
      setHoursEnd(settings.hours?.end || '18:00');
      setAddress(settings.address || '');
      setOwnerPhone(settings.ownerPhone || '');
      setFrontDeskPhone(settings.frontDeskPhone || '');
      setSmsEnabled(settings.smsRemindersEnabled ?? true);
      setSms24h(settings.sms24hReminderEnabled ?? true);
      setSms2h(settings.sms2hReminderEnabled ?? true);
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: async () => {
      return await apiRequest('PUT', '/portal/tenants/settings', {
        name: businessName,
        timezone,
        hours: { start: hoursStart, end: hoursEnd },
        address,
        ownerPhone,
        frontDeskPhone,
        smsRemindersEnabled: smsEnabled,
        sms24hReminderEnabled: sms24h,
        sms2hReminderEnabled: sms2h,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/portal/tenants/settings'] });
      toast({
        title: 'Saved',
        description: 'Settings updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings</p>
      </div>

      {settings && !settings.onboardingComplete && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your onboarding is not complete.{' '}
            <Link href="/portal">
              <a className="font-medium underline">Complete onboarding</a>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Update your business details and operating hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              data-testid="input-business-name"
            />
          </div>

          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger data-testid="select-timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map(tz => (
                  <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              data-testid="input-address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ownerPhone">Owner Phone</Label>
              <Input
                id="ownerPhone"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                data-testid="input-owner-phone"
              />
            </div>
            <div>
              <Label htmlFor="frontDeskPhone">Front Desk Phone</Label>
              <Input
                id="frontDeskPhone"
                value={frontDeskPhone}
                onChange={(e) => setFrontDeskPhone(e.target.value)}
                data-testid="input-front-desk-phone"
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
                  value={hoursStart}
                  onChange={(e) => setHoursStart(e.target.value)}
                  data-testid="input-hours-start"
                />
              </div>
              <div>
                <Label htmlFor="hoursEnd" className="text-sm text-muted-foreground">Close</Label>
                <Input
                  id="hoursEnd"
                  type="time"
                  value={hoursEnd}
                  onChange={(e) => setHoursEnd(e.target.value)}
                  data-testid="input-hours-end"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Used to filter bookable times
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => saveSettings.mutate()}
              disabled={saveSettings.isPending}
              data-testid="button-save-settings"
            >
              {saveSettings.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SMS Reminder Settings */}
      <Card data-testid="card-sms-settings">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>SMS Reminders</CardTitle>
              <CardDescription>
                Automatically send appointment reminders via text message
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              SMS reminders are sent using your Retell phone number. Messages include appointment details like service, price, time, and location.
              Reminders respect your business timezone for proper delivery timing.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Master Toggle */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="sms-enabled" className="text-base font-semibold">
                  Enable SMS Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send appointment confirmations and reminders via SMS
                </p>
              </div>
              <Switch
                id="sms-enabled"
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
                disabled={saveSettings.isPending || isLoading}
                data-testid="switch-sms-enabled"
              />
            </div>

            {/* 24 Hour Reminder */}
            <div className="flex items-center justify-between py-4 border-b">
              <div className="space-y-0.5">
                <Label htmlFor="sms-24h" className="text-base">
                  24-Hour Reminder
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send reminder 24 hours before appointment
                </p>
              </div>
              <Switch
                id="sms-24h"
                checked={sms24h}
                onCheckedChange={setSms24h}
                disabled={!smsEnabled || saveSettings.isPending || isLoading}
                data-testid="switch-sms-24h"
              />
            </div>

            {/* 2 Hour Reminder */}
            <div className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <Label htmlFor="sms-2h" className="text-base">
                  2-Hour Reminder
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send reminder 2 hours before appointment (no confirmation required)
                </p>
              </div>
              <Switch
                id="sms-2h"
                checked={sms2h}
                onCheckedChange={setSms2h}
                disabled={!smsEnabled || saveSettings.isPending || isLoading}
                data-testid="switch-sms-2h"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4" />
              Message Preview
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-background rounded border">
                <p className="text-xs text-muted-foreground mb-1">Instant Confirmation:</p>
                <p className="text-sm">
                  Hi John! Your Haircut appointment at {businessName || 'Salon Name'} is confirmed for Monday, November 4 at 2:00 PM. 
                  Price: $45. Location: {address || '123 Main St'}. We look forward to seeing you!
                </p>
              </div>
              {sms24h && (
                <div className="p-3 bg-background rounded border">
                  <p className="text-xs text-muted-foreground mb-1">24h Reminder:</p>
                  <p className="text-sm">
                    Hi John! Reminder: Your Haircut appointment at {businessName || 'Salon Name'} is tomorrow on Monday, November 4 at 2:00 PM. 
                    Service price: $45. Location: {address || '123 Main St'}. See you soon!
                  </p>
                </div>
              )}
              {sms2h && (
                <div className="p-3 bg-background rounded border">
                  <p className="text-xs text-muted-foreground mb-1">2h Reminder:</p>
                  <p className="text-sm">
                    Hi John! Reminder: Your Haircut appointment at {businessName || 'Salon Name'} is in 2 hours on Monday, November 4 at 2:00 PM. 
                    Service price: $45. Location: {address || '123 Main St'}. See you soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agent Replacement - only show if agent exists (regardless of status) */}
      {receptionistStatus?.agentId && (
        <AgentReplacement
          currentAgentId={receptionistStatus.agentId}
          phoneNumber={receptionistStatus.formattedPhoneNumber || receptionistStatus.phoneNumber}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
          }}
        />
      )}
    </div>
  );
}
