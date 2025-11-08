import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2, Clock } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface StaffMember {
  staffId: string;
  name: string;
}

interface WorkingHours {
  dow: number;
  start: string;
  end: string;
}

interface TimeoffRange {
  timeMin: string;
  timeMax: string;
  reason?: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function StaffScheduleEditor({ staff }: { staff: StaffMember[] }) {
  // Early return BEFORE hooks to prevent React hooks rule violation
  if (!staff || staff.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        Add staff members first to manage their schedules
      </p>
    );
  }

  const [selectedStaff, setSelectedStaff] = useState<string>(staff[0]?.staffId || '');
  const { toast } = useToast();

  return (
    <Tabs defaultValue="hours" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList data-testid="tabs-schedule">
          <TabsTrigger value="hours" data-testid="tab-hours">Working Hours</TabsTrigger>
          <TabsTrigger value="timeoff" data-testid="tab-timeoff">Time Off</TabsTrigger>
        </TabsList>
        <Select value={selectedStaff} onValueChange={setSelectedStaff}>
          <SelectTrigger className="w-[200px]" data-testid="select-staff">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {staff.map((s) => (
              <SelectItem key={s.staffId} value={s.staffId}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TabsContent value="hours" className="space-y-4">
        <WorkingHoursEditor staffId={selectedStaff} />
      </TabsContent>

      <TabsContent value="timeoff" className="space-y-4">
        <TimeOffEditor staffId={selectedStaff} />
      </TabsContent>
    </Tabs>
  );
}

function WorkingHoursEditor({ staffId }: { staffId: string }) {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{ hours: WorkingHours[] }>({
    queryKey: ['/staff', staffId, 'hours'],
    queryFn: async () => {
      const res = await fetch(`/staff/${staffId}/hours`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch hours');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (hours: WorkingHours[]) => {
      const res = await apiRequest('PUT', '/staff/hours', { staffId, hours });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/staff', staffId, 'hours'] });
      toast({ title: 'Success', description: 'Working hours updated' });
    },
    onError: (error: any) => {
      console.error('Update hours error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to update hours', variant: 'destructive' });
    },
  });

  const hours = data?.hours || [];
  const [localHours, setLocalHours] = useState<WorkingHours[]>([]);

  // Initialize local hours from fetched data
  useEffect(() => {
    if (hours.length > 0) {
      setLocalHours(hours);
    }
  }, [hours]);

  const addHour = (dow: number) => {
    const newHours = [...localHours, { dow, start: '09:00', end: '17:00' }];
    setLocalHours(newHours);
  };

  const removeHour = (index: number) => {
    const newHours = localHours.filter((_, i) => i !== index);
    setLocalHours(newHours);
  };

  const updateHour = (index: number, field: 'start' | 'end', value: string) => {
    const newHours = [...localHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setLocalHours(newHours);
  };

  const saveHours = () => {
    updateMutation.mutate(localHours);
  };

  if (isLoading) return <p>Loading...</p>;

  const groupedHours = DAYS.map((day, dow) => ({
    day,
    dow,
    slots: localHours.filter(h => h.dow === dow)
  }));

  return (
    <div className="space-y-4">
      {groupedHours.map(({ day, dow, slots }) => (
        <div key={dow} className="border rounded-lg p-4" data-testid={`day-${dow}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">{day}</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addHour(dow)}
              data-testid={`button-add-hours-${dow}`}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Hours
            </Button>
          </div>
          
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">Closed</p>
          ) : (
            <div className="space-y-2">
              {slots.map((slot, idx) => {
                const globalIndex = localHours.findIndex(h => 
                  h.dow === slot.dow && h.start === slot.start && h.end === slot.end
                );
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={slot.start}
                      onChange={(e) => updateHour(globalIndex, 'start', e.target.value)}
                      className="w-32"
                      data-testid={`input-start-${dow}-${idx}`}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={slot.end}
                      onChange={(e) => updateHour(globalIndex, 'end', e.target.value)}
                      className="w-32"
                      data-testid={`input-end-${dow}-${idx}`}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeHour(globalIndex)}
                      data-testid={`button-remove-hours-${dow}-${idx}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      
      <div className="flex justify-end">
        <Button
          onClick={saveHours}
          disabled={updateMutation.isPending}
          data-testid="button-save-hours"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Working Hours'}
        </Button>
      </div>
    </div>
  );
}

function TimeOffEditor({ staffId }: { staffId: string }) {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [reason, setReason] = useState('');

  const { data, isLoading } = useQuery<{ ranges: TimeoffRange[] }>({
    queryKey: ['/staff', staffId, 'timeoff'],
    queryFn: async () => {
      const res = await fetch(`/staff/${staffId}/timeoff`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch time off');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (ranges: TimeoffRange[]) => {
      const res = await apiRequest('PUT', '/staff/timeoff', { staffId, ranges });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/staff', staffId, 'timeoff'] });
      toast({ title: 'Success', description: 'Time off updated' });
    },
    onError: (error: any) => {
      console.error('Update timeoff error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to update time off', variant: 'destructive' });
    },
  });

  const ranges = data?.ranges || [];

  const addTimeOff = () => {
    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Please select both dates', variant: 'destructive' });
      return;
    }
    
    const newRanges = [
      ...ranges,
      {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        reason: reason || undefined,
      }
    ];
    
    updateMutation.mutate(newRanges);
    setStartDate(undefined);
    setEndDate(undefined);
    setReason('');
  };

  const removeTimeOff = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    updateMutation.mutate(newRanges);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-4">Add Time Off</h4>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-start-date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-end-date">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              placeholder="e.g., Vacation, Personal"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              data-testid="input-timeoff-reason"
            />
          </div>
          
          <Button onClick={addTimeOff} disabled={updateMutation.isPending} data-testid="button-add-timeoff">
            <Plus className="w-4 h-4 mr-2" />
            Add Time Off
          </Button>
        </div>
      </div>

      {ranges.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Scheduled Time Off</h4>
          <div className="space-y-2">
            {ranges.map((range, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`timeoff-${idx}`}>
                <div>
                  <p className="font-medium">
                    {format(new Date(range.timeMin), 'MMM d, yyyy')} - {format(new Date(range.timeMax), 'MMM d, yyyy')}
                  </p>
                  {range.reason && <p className="text-sm text-muted-foreground">{range.reason}</p>}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeTimeOff(idx)}
                  data-testid={`button-remove-timeoff-${idx}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
