import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

const DEFAULT_TENANT_ID = 'modern-cuts';

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');

  // Settings Tab
  const { data: settings } = useQuery({
    queryKey: [`/tenants/${DEFAULT_TENANT_ID}/settings`],
  });

  const saveSettings = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', `/tenants/${DEFAULT_TENANT_ID}/settings`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/tenants/${DEFAULT_TENANT_ID}/settings`] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    },
  });

  const [settingsForm, setSettingsForm] = useState({
    name: '',
    timezone: 'America/New_York',
    hoursStart: '09:00',
    hoursEnd: '18:00',
    address: '',
    ownerPhone: '',
    frontDeskPhone: '',
  });

  // Sync settings from server
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        name: settings.name || '',
        timezone: settings.timezone || 'America/New_York',
        hoursStart: settings.hours?.start || '09:00',
        hoursEnd: settings.hours?.end || '18:00',
        address: settings.address || '',
        ownerPhone: settings.ownerPhone || '',
        frontDeskPhone: settings.frontDeskPhone || '',
      });
    }
  }, [settings]);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings.mutate({
      name: settingsForm.name,
      timezone: settingsForm.timezone,
      hours: { start: settingsForm.hoursStart, end: settingsForm.hoursEnd },
      address: settingsForm.address,
      ownerPhone: settingsForm.ownerPhone,
      frontDeskPhone: settingsForm.frontDeskPhone,
    });
  };

  // Services Tab
  const { data: services = [] } = useQuery({
    queryKey: [`/tenants/${DEFAULT_TENANT_ID}/services`],
  });

  const [servicesList, setServicesList] = useState<any[]>([]);

  // Sync services from server
  useEffect(() => {
    if (services && Array.isArray(services) && services.length > 0) {
      setServicesList(services);
    }
  }, [services]);

  const saveServices = useMutation({
    mutationFn: async (data: any[]) => {
      return await apiRequest('PUT', `/tenants/${DEFAULT_TENANT_ID}/services`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/tenants/${DEFAULT_TENANT_ID}/services`] });
      toast({ title: 'Services saved successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error saving services', description: error.message, variant: 'destructive' });
    },
  });

  const addService = () => {
    setServicesList([
      ...servicesList,
      { serviceId: '', name: '', durationMin: 30, price: 0, bufferMin: 0 },
    ]);
  };

  const removeService = (index: number) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...servicesList];
    updated[index] = { ...updated[index], [field]: value };
    setServicesList(updated);
  };

  const handleServicesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveServices.mutate(servicesList);
  };

  // Staff Hours Tab
  const { data: staffList = [] } = useQuery({
    queryKey: ['/staff/calendars'],
  });

  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffHoursData, setStaffHoursData] = useState<any[]>([
    { dow: 1, enabled: false, start: '09:00', end: '18:00' },
    { dow: 2, enabled: false, start: '09:00', end: '18:00' },
    { dow: 3, enabled: false, start: '09:00', end: '18:00' },
    { dow: 4, enabled: false, start: '09:00', end: '18:00' },
    { dow: 5, enabled: false, start: '09:00', end: '18:00' },
    { dow: 6, enabled: false, start: '09:00', end: '18:00' },
    { dow: 0, enabled: false, start: '09:00', end: '18:00' },
  ]);

  const { data: staffHours } = useQuery({
    queryKey: [`/staff/${selectedStaff}/hours`, { tenantId: DEFAULT_TENANT_ID }],
    enabled: !!selectedStaff,
    queryFn: async () => {
      const res = await fetch(`/staff/${selectedStaff}/hours?tenantId=${DEFAULT_TENANT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch staff hours');
      return res.json();
    },
  });

  const { data: staffTimeoff } = useQuery({
    queryKey: [`/staff/${selectedStaff}/timeoff`, { tenantId: DEFAULT_TENANT_ID }],
    enabled: !!selectedStaff,
    queryFn: async () => {
      const res = await fetch(`/staff/${selectedStaff}/timeoff?tenantId=${DEFAULT_TENANT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch staff timeoff');
      const data = await res.json();
      return data.ranges || [];
    },
  });

  const [ptoList, setPtoList] = useState<any[]>([]);

  // Sync staff hours from server
  useEffect(() => {
    if (staffHours?.hours && Array.isArray(staffHours.hours)) {
      const updated = staffHoursData.map(day => {
        const serverHours = staffHours.hours.find((h: any) => h.dow === day.dow);
        if (serverHours) {
          return {
            dow: day.dow,
            enabled: true,
            start: serverHours.start,
            end: serverHours.end,
          };
        }
        return { ...day, enabled: false };
      });
      setStaffHoursData(updated);
    } else {
      // Reset to default when no hours or switching staff
      setStaffHoursData([
        { dow: 1, enabled: false, start: '09:00', end: '18:00' },
        { dow: 2, enabled: false, start: '09:00', end: '18:00' },
        { dow: 3, enabled: false, start: '09:00', end: '18:00' },
        { dow: 4, enabled: false, start: '09:00', end: '18:00' },
        { dow: 5, enabled: false, start: '09:00', end: '18:00' },
        { dow: 6, enabled: false, start: '09:00', end: '18:00' },
        { dow: 0, enabled: false, start: '09:00', end: '18:00' },
      ]);
    }
  }, [staffHours]);

  // Sync staff timeoff from server
  useEffect(() => {
    if (staffTimeoff && Array.isArray(staffTimeoff) && staffTimeoff.length > 0) {
      // Convert ISO strings to datetime-local format, preserving timezone
      const formatted = staffTimeoff.map((pto: any) => ({
        timeMin: pto.timeMin ? formatToDatetimeLocal(pto.timeMin) : '',
        timeMax: pto.timeMax ? formatToDatetimeLocal(pto.timeMax) : '',
        reason: pto.reason || '',
      }));
      setPtoList(formatted);
    } else {
      setPtoList([]);
    }
  }, [staffTimeoff]);

  // Helper: Format ISO string to datetime-local format preserving the original timezone
  function formatToDatetimeLocal(isoString: string): string {
    // Parse the ISO string, keeping the original timezone
    const date = new Date(isoString);
    // Format to YYYY-MM-DDTHH:mm by extracting components in local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  const saveStaffHours = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', '/staff/hours', data);
    },
    onSuccess: () => {
      toast({ title: 'Staff hours saved successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error saving staff hours', description: error.message, variant: 'destructive' });
    },
  });

  const saveStaffTimeoff = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', '/staff/timeoff', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/staff/${selectedStaff}/timeoff`] });
      toast({ title: 'Staff PTO saved successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error saving staff PTO', description: error.message, variant: 'destructive' });
    },
  });

  const handleStaffHoursSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enabledHours = staffHoursData.filter(h => h.enabled).map(({ dow, start, end }) => ({ dow, start, end }));
    saveStaffHours.mutate({
      tenantId: DEFAULT_TENANT_ID,
      staffId: selectedStaff,
      hours: enabledHours,
    });
  };

  const handlePtoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert datetime-local back to ISO format with timezone
    const ranges = ptoList.map(pto => ({
      timeMin: pto.timeMin ? new Date(pto.timeMin).toISOString() : '',
      timeMax: pto.timeMax ? new Date(pto.timeMax).toISOString() : '',
      reason: pto.reason || '',
    }));
    saveStaffTimeoff.mutate({
      tenantId: DEFAULT_TENANT_ID,
      staffId: selectedStaff,
      ranges,
    });
  };

  const addPto = () => {
    setPtoList([...ptoList, { timeMin: '', timeMax: '', reason: '' }]);
  };

  const removePto = (index: number) => {
    setPtoList(ptoList.filter((_, i) => i !== index));
  };

  const updatePto = (index: number, field: string, value: string) => {
    const updated = [...ptoList];
    updated[index] = { ...updated[index], [field]: value };
    setPtoList(updated);
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="container mx-auto p-6" data-testid="admin-container">
      <h1 className="text-3xl font-bold mb-6" data-testid="text-admin-title">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-admin">
        <TabsList data-testid="tablist-admin">
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
          <TabsTrigger value="staff-hours" data-testid="tab-staff-hours">Staff Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" data-testid="tabcontent-settings">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-settings-title">Business Settings</CardTitle>
              <CardDescription data-testid="text-settings-description">Configure your business information and operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" data-testid="label-business-name">Business Name</Label>
                  <Input
                    id="name"
                    data-testid="input-business-name"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone" data-testid="label-timezone">Timezone</Label>
                  <Select
                    value={settingsForm.timezone}
                    onValueChange={(value) => setSettingsForm({ ...settingsForm, timezone: value })}
                  >
                    <SelectTrigger data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York" data-testid="option-timezone-ny">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles" data-testid="option-timezone-la">America/Los_Angeles</SelectItem>
                      <SelectItem value="Europe/London" data-testid="option-timezone-london">Europe/London</SelectItem>
                      <SelectItem value="Africa/Casablanca" data-testid="option-timezone-casablanca">Africa/Casablanca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours-start" data-testid="label-hours-start">Hours Start</Label>
                    <Input
                      id="hours-start"
                      type="time"
                      data-testid="input-hours-start"
                      value={settingsForm.hoursStart}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hoursStart: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours-end" data-testid="label-hours-end">Hours End</Label>
                    <Input
                      id="hours-end"
                      type="time"
                      data-testid="input-hours-end"
                      value={settingsForm.hoursEnd}
                      onChange={(e) => setSettingsForm({ ...settingsForm, hoursEnd: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" data-testid="label-address">Address</Label>
                  <Input
                    id="address"
                    data-testid="input-address"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="owner-phone" data-testid="label-owner-phone">Owner Phone</Label>
                  <Input
                    id="owner-phone"
                    data-testid="input-owner-phone"
                    value={settingsForm.ownerPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerPhone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="front-desk-phone" data-testid="label-front-desk-phone">Front Desk Phone</Label>
                  <Input
                    id="front-desk-phone"
                    data-testid="input-front-desk-phone"
                    value={settingsForm.frontDeskPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, frontDeskPhone: e.target.value })}
                  />
                </div>

                <Button type="submit" data-testid="button-save-settings" disabled={saveSettings.isPending}>
                  {saveSettings.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" data-testid="tabcontent-services">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-services-title">Services</CardTitle>
              <CardDescription data-testid="text-services-description">Manage your salon services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServicesSubmit} className="space-y-4">
                {servicesList.length === 0 && services.length === 0 && (
                  <p className="text-muted-foreground" data-testid="text-no-services">No services configured yet. Click "Add Service" to get started.</p>
                )}

                {(servicesList.length > 0 ? servicesList : services).map((service: any, index: number) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-end border p-4 rounded" data-testid={`service-row-${index}`}>
                    <div>
                      <Label data-testid={`label-service-id-${index}`}>Service ID</Label>
                      <Input
                        data-testid={`input-service-id-${index}`}
                        value={service.serviceId}
                        onChange={(e) => updateService(index, 'serviceId', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label data-testid={`label-service-name-${index}`}>Name</Label>
                      <Input
                        data-testid={`input-service-name-${index}`}
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label data-testid={`label-service-duration-${index}`}>Duration (min)</Label>
                      <Input
                        type="number"
                        data-testid={`input-service-duration-${index}`}
                        value={service.durationMin}
                        onChange={(e) => updateService(index, 'durationMin', parseInt(e.target.value))}
                        min="5"
                        required
                      />
                    </div>
                    <div>
                      <Label data-testid={`label-service-price-${index}`}>Price</Label>
                      <Input
                        type="number"
                        data-testid={`input-service-price-${index}`}
                        value={service.price || 0}
                        onChange={(e) => updateService(index, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label data-testid={`label-service-buffer-${index}`}>Buffer (min)</Label>
                      <Input
                        type="number"
                        data-testid={`input-service-buffer-${index}`}
                        value={service.bufferMin || 0}
                        onChange={(e) => updateService(index, 'bufferMin', parseInt(e.target.value))}
                        min="0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      data-testid={`button-remove-service-${index}`}
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" data-testid="button-add-service" onClick={addService}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                  <Button type="submit" data-testid="button-save-services" disabled={saveServices.isPending}>
                    {saveServices.isPending ? 'Saving...' : 'Save Services'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff-hours" data-testid="tabcontent-staff-hours">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-staff-hours-title">Staff Hours & PTO</CardTitle>
              <CardDescription data-testid="text-staff-hours-description">Configure staff working hours and time off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="staff-select" data-testid="label-staff-select">Select Staff Member</Label>
                <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                  <SelectTrigger data-testid="select-staff">
                    <SelectValue placeholder="Choose staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(staffList.staff) && staffList.staff.map((staff: any) => (
                      <SelectItem key={staff.staffId} value={staff.staffId} data-testid={`option-staff-${staff.staffId}`}>
                        {staff.name} ({staff.staffId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedStaff && (
                <>
                  <form onSubmit={handleStaffHoursSubmit} className="space-y-4">
                    <h3 className="font-semibold" data-testid="text-working-hours">Working Hours</h3>
                    {staffHoursData.map((day, index) => (
                      <div key={day.dow} className="grid grid-cols-4 gap-4 items-center" data-testid={`hours-row-${day.dow}`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            data-testid={`checkbox-day-${day.dow}`}
                            checked={day.enabled}
                            onChange={(e) => {
                              const updated = [...staffHoursData];
                              updated[index].enabled = e.target.checked;
                              setStaffHoursData(updated);
                            }}
                          />
                          <Label data-testid={`label-day-${day.dow}`}>{dayNames[day.dow]}</Label>
                        </div>
                        <Input
                          type="time"
                          data-testid={`input-start-${day.dow}`}
                          value={day.start}
                          onChange={(e) => {
                            const updated = [...staffHoursData];
                            updated[index].start = e.target.value;
                            setStaffHoursData(updated);
                          }}
                          disabled={!day.enabled}
                        />
                        <Input
                          type="time"
                          data-testid={`input-end-${day.dow}`}
                          value={day.end}
                          onChange={(e) => {
                            const updated = [...staffHoursData];
                            updated[index].end = e.target.value;
                            setStaffHoursData(updated);
                          }}
                          disabled={!day.enabled}
                        />
                      </div>
                    ))}
                    <Button type="submit" data-testid="button-save-hours" disabled={saveStaffHours.isPending}>
                      {saveStaffHours.isPending ? 'Saving...' : 'Save Hours'}
                    </Button>
                  </form>

                  <form onSubmit={handlePtoSubmit} className="space-y-4">
                    <h3 className="font-semibold" data-testid="text-pto-title">Time Off (PTO)</h3>
                    {ptoList.map((pto, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2 items-end" data-testid={`pto-row-${index}`}>
                        <div>
                          <Label data-testid={`label-pto-start-${index}`}>Start</Label>
                          <Input
                            type="datetime-local"
                            data-testid={`input-pto-start-${index}`}
                            value={pto.timeMin}
                            onChange={(e) => updatePto(index, 'timeMin', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label data-testid={`label-pto-end-${index}`}>End</Label>
                          <Input
                            type="datetime-local"
                            data-testid={`input-pto-end-${index}`}
                            value={pto.timeMax}
                            onChange={(e) => updatePto(index, 'timeMax', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label data-testid={`label-pto-reason-${index}`}>Reason</Label>
                          <Input
                            data-testid={`input-pto-reason-${index}`}
                            value={pto.reason || ''}
                            onChange={(e) => updatePto(index, 'reason', e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          data-testid={`button-remove-pto-${index}`}
                          onClick={() => removePto(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" data-testid="button-add-pto" onClick={addPto}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add PTO
                      </Button>
                      <Button type="submit" data-testid="button-save-pto" disabled={saveStaffTimeoff.isPending}>
                        {saveStaffTimeoff.isPending ? 'Saving...' : 'Save PTO'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
