import { useState } from 'react';
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { 
  Calendar, 
  TrendingUp, 
  Phone, 
  DollarSign, 
  Users, 
  Scissors,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  PhoneCall,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { format, parseISO, isSameDay } from "date-fns";

function UpdateAgentButton() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await apiRequest('POST', '/api/receptionist/provision');
      
      await queryClient.invalidateQueries({ 
        queryKey: ['/api/receptionist/status'] 
      });
      
      toast({
        title: '✅ Agent Updated Successfully',
        description: 'Your AI receptionist now has all the latest functions including cancellation and rescheduling.',
      });
    } catch (error: any) {
      toast({
        title: '❌ Update Failed',
        description: error.message || 'Failed to update agent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button 
      variant="default" 
      className="flex-1"
      onClick={handleUpdate}
      disabled={isUpdating}
      data-testid="button-update-agent"
    >
      {isUpdating ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Force Update Agent
        </>
      )}
    </Button>
  );
}

interface Analytics {
  totalCalls: number;
  successfulBookings: number;
  missedOpportunities: number;
  conversionRate: number;
  totalRevenue: number;
  averageBookingValue: number;
}

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
}

interface CallLog {
  id: string;
  phoneNumber: string;
  duration: number;
  outcome: 'booked' | 'missed' | 'inquiry' | 'cancelled';
  timestamp: string;
  notes: string;
}

interface ReceptionistStatus {
  status: string;
  calcomConnected: boolean;
  calcomApiKey?: boolean;
  phoneNumber?: string;
  formattedPhoneNumber?: string;
  agentId?: string;
  agentStatus?: string;
}

export default function Overview() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analytics data
  const { data: analytics } = useQuery<Analytics>({
    queryKey: ['/api/dashboard/analytics'],
  });

  // Fetch recent appointments
  const { data: appointments } = useQuery<Appointment[]>({
    queryKey: ['/api/dashboard/appointments'],
  });

  // Fetch recent call logs
  const { data: callLogs } = useQuery<CallLog[]>({
    queryKey: ['/api/dashboard/call-logs'],
  });

  // Fetch AI receptionist status
  const { data: status } = useQuery<ReceptionistStatus>({
    queryKey: ['/api/receptionist/status'],
  });

  // Get today's appointments
  const todayAppointments = appointments?.filter(apt => {
    const aptDate = new Date(apt.date).toDateString();
    const today = new Date().toDateString();
    return aptDate === today && apt.status === 'scheduled';
  }) || [];

  // Get upcoming appointments (next 7 days)
  const upcomingAppointments = appointments?.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return aptDate >= today && aptDate <= nextWeek && apt.status === 'scheduled';
  }).slice(0, 5) || [];

  // Get recent calls (last 5)
  const recentCalls = callLogs?.slice(0, 5) || [];

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    if (!appointments) return [];
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, date);
    });
  };

  // Get appointments for selected date
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-500">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCallOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'booked':
        return <Badge variant="default" className="bg-green-500">Booked</Badge>;
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'inquiry':
        return <Badge variant="secondary">Inquiry</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{outcome}</Badge>;
    }
  };

  const handleRefreshCalendar = async () => {
    setIsRefreshing(true);
    try {
      // Refetch both queries
      await Promise.all([
        queryClient.refetchQueries({ 
          queryKey: ['/api/dashboard/appointments'],
          type: 'active'
        }),
        queryClient.refetchQueries({ 
          queryKey: ['/api/dashboard/analytics'],
          type: 'active'
        })
      ]);
      
      // Check the actual query states after refetch
      const appointmentsState = queryClient.getQueryState(['/api/dashboard/appointments']);
      const analyticsState = queryClient.getQueryState(['/api/dashboard/analytics']);
      
      const hasError = appointmentsState?.status === 'error' || analyticsState?.status === 'error';
      
      if (hasError) {
        toast({
          title: "Sync failed",
          description: "Failed to refresh appointments. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Calendar synced",
          description: "Your appointments have been refreshed from Cal.com",
        });
      }
    } catch (error) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Sync failed",
        description: "Failed to refresh appointments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your BookMySalon dashboard</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-calls">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalCalls || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.conversionRate?.toFixed(1) || 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-successful-bookings">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Bookings</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.successfulBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.missedOpportunities || 0} missed opportunities
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(analytics?.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ${(analytics?.averageBookingValue || 0).toFixed(2)} avg booking
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-today-appointments">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length} upcoming this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Receptionist Status */}
      <Card data-testid="card-ai-receptionist">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                AI Phone Receptionist
              </CardTitle>
              <CardDescription>
                Your 24/7 AI-powered booking assistant
              </CardDescription>
            </div>
            {status?.status === 'ready' ? (
              <Badge variant="default" className="bg-green-500 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="h-3 w-3" />
                Not Setup
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {status?.status === 'ready' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    {status.formattedPhoneNumber || status.phoneNumber || 'Phone number active'}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Ready to receive calls and book appointments
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild data-testid="button-manage-ai-settings">
                  <Link href="/setup-ai">
                    Manage Settings
                  </Link>
                </Button>
                <UpdateAgentButton />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Set up your AI receptionist to start receiving bookings via phone
                </p>
              </div>
              <Button className="w-full flex items-center gap-2" asChild data-testid="button-setup-ai">
                <Link href="/setup-ai">
                  Set Up AI Receptionist
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Widget */}
      <Card data-testid="card-calendar-widget">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointments Calendar
              </CardTitle>
              <CardDescription>View your bookings by date</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshCalendar}
                disabled={isRefreshing}
                className="mr-2"
                data-testid="button-sync-calendar"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={calendarView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('month')}
                  className="rounded-r-none"
                  data-testid="button-view-month"
                >
                  Month
                </Button>
                <Button
                  variant={calendarView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('week')}
                  className="rounded-none border-x"
                  data-testid="button-view-week"
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('day')}
                  className="rounded-l-none"
                  data-testid="button-view-day"
                >
                  Day
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            {/* Calendar View */}
            <div>
              {calendarView === 'month' && (
                <CalendarUI
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  data-testid="calendar-month-view"
                />
              )}

              {calendarView === 'week' && (
                <div className="space-y-2" data-testid="calendar-week-view">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 7);
                        setSelectedDate(newDate);
                      }}
                      data-testid="button-prev-week"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-medium">
                      Week of {format(selectedDate, 'MMM d, yyyy')}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 7);
                        setSelectedDate(newDate);
                      }}
                      data-testid="button-next-week"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const date = new Date(selectedDate);
                      date.setDate(date.getDate() - date.getDay() + i);
                      const dayAppointments = getAppointmentsForDate(date);
                      const isSelected = isSameDay(date, selectedDate);
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setSelectedDate(date)}
                          className={`p-3 border rounded-md text-center hover-elevate ${
                            isSelected ? 'border-primary bg-primary/10' : ''
                          }`}
                          data-testid={`day-button-${i}`}
                        >
                          <p className="text-xs text-muted-foreground">
                            {format(date, 'EEE')}
                          </p>
                          <p className="text-lg font-bold">{format(date, 'd')}</p>
                          {dayAppointments.length > 0 && (
                            <div className="flex justify-center mt-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {calendarView === 'day' && (
                <div className="space-y-4" data-testid="calendar-day-view">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - 1);
                        setSelectedDate(newDate);
                      }}
                      data-testid="button-prev-day"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-medium text-lg">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + 1);
                        setSelectedDate(newDate);
                      }}
                      data-testid="button-next-day"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedDateAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between p-3 border rounded-md hover-elevate"
                          data-testid={`day-appointment-${apt.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{apt.time}</span>
                            </div>
                            <div>
                              <p className="font-medium">{apt.customerName}</p>
                              <p className="text-sm text-muted-foreground">{apt.service}</p>
                            </div>
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No appointments for this day</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Date Info */}
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">
                  {format(selectedDate, 'EEEE, MMM d')}
                </h4>
                <p className="text-2xl font-bold mb-1">
                  {selectedDateAppointments.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedDateAppointments.length === 1 ? 'appointment' : 'appointments'}
                </p>
              </div>

              {selectedDateAppointments.length > 0 && calendarView === 'month' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Appointments:</h4>
                  {selectedDateAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-2 border rounded-md text-sm"
                      data-testid={`selected-appointment-${apt.id}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{apt.time}</span>
                      </div>
                      <p className="text-muted-foreground">{apt.customerName}</p>
                      <p className="text-muted-foreground text-xs">{apt.service}</p>
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full flex items-center gap-2" asChild data-testid="button-view-all-calendar">
                <Link href="/app/bookings">
                  View All Bookings
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Appointments */}
        <Card data-testid="card-recent-appointments">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>Your upcoming bookings</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild data-testid="link-view-all-bookings">
                <Link href="/app/bookings">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-3 border rounded-md hover-elevate"
                    data-testid={`appointment-${apt.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center p-2 bg-primary/10 rounded-md">
                        <span className="text-xs font-medium text-primary">
                          {format(parseISO(apt.date), 'MMM')}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {format(parseISO(apt.date), 'd')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{apt.customerName}</p>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{apt.time}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(apt.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming appointments</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Call Logs */}
        <Card data-testid="card-recent-calls">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Calls</CardTitle>
                <CardDescription>Latest AI receptionist activity</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-3">
                {recentCalls.map((call) => (
                  <div 
                    key={call.id} 
                    className="flex items-center justify-between p-3 border rounded-md"
                    data-testid={`call-${call.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <PhoneCall className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{call.phoneNumber}</p>
                        <p className="text-sm text-muted-foreground">{call.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(parseISO(call.timestamp), 'MMM d, h:mm a')} • {call.duration}s
                        </p>
                      </div>
                    </div>
                    {getCallOutcomeBadge(call.outcome)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <PhoneCall className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent calls</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card data-testid="card-quick-actions">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button variant="default" className="justify-start flex items-center gap-2" asChild data-testid="button-create-booking">
              <Link href="/app/bookings?action=create">
                <Plus className="h-4 w-4" />
                Create Booking
              </Link>
            </Button>
            <Button variant="outline" className="justify-start flex items-center gap-2" asChild data-testid="button-manage-services">
              <Link href="/app/services">
                <Scissors className="h-4 w-4" />
                Manage Services
              </Link>
            </Button>
            <Button variant="outline" className="justify-start flex items-center gap-2" asChild data-testid="button-manage-staff">
              <Link href="/app/staff">
                <Users className="h-4 w-4" />
                Manage Staff
              </Link>
            </Button>
            <Button variant="outline" className="justify-start flex items-center gap-2" asChild data-testid="button-calendar-settings">
              <Link href="/app/integrations">
                <Calendar className="h-4 w-4" />
                Calendar Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
