import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Phone,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import type { Appointment, Customer, CallLog, Analytics } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSection]);

  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/dashboard/analytics"],
  });

  const { data: appointments, isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/dashboard/appointments"],
  });

  const { data: customers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/dashboard/customers"],
  });

  const { data: callLogs, isLoading: callLogsLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/dashboard/call-logs"],
  });

  const menuItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "customers", name: "Customers", icon: Users },
    { id: "calls", name: "Call Logs", icon: Phone },
  ];

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-4">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-foreground font-mono">BookMySalon</span>
                  <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                </div>
              </SidebarGroupLabel>
              <Separator className="my-2" />
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.id)}
                        className={activeSection === item.id ? "bg-sidebar-accent" : ""}
                        data-testid={`button-nav-${item.id}`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-2xl font-bold text-foreground">
                {menuItems.find((item) => item.id === activeSection)?.name}
              </h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {activeSection === "overview" && (
              <OverviewSection 
                analytics={analytics} 
                appointments={appointments} 
                callLogs={callLogs}
                isLoading={analyticsLoading || appointmentsLoading || callLogsLoading}
              />
            )}
            {activeSection === "appointments" && (
              <AppointmentsSection appointments={appointments} isLoading={appointmentsLoading} />
            )}
            {activeSection === "customers" && (
              <CustomersSection customers={customers} isLoading={customersLoading} />
            )}
            {activeSection === "calls" && (
              <CallLogsSection callLogs={callLogs} isLoading={callLogsLoading} />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function OverviewSection({
  analytics,
  appointments,
  callLogs,
  isLoading,
}: {
  analytics?: Analytics;
  appointments?: Appointment[];
  callLogs?: CallLog[];
  isLoading: boolean;
}) {
  const recentAppointments = appointments?.slice(0, 5) || [];
  const recentCalls = callLogs?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Phone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalCalls || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                All time
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Bookings</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.successfulBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {analytics ? analytics.conversionRate.toFixed(1) : "0.0"}% conversion
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics ? analytics.totalRevenue.toFixed(0) : "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${analytics ? analytics.averageBookingValue.toFixed(0) : "0"} per booking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Latest bookings from your salon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{appointment.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.service} • {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "default"
                        : appointment.status === "scheduled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>Latest call activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{call.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(call.duration / 60)}m {call.duration % 60}s • {new Date(call.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      call.outcome === "booked"
                        ? "default"
                        : call.outcome === "inquiry"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {call.outcome}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AppointmentsSection({ appointments, isLoading }: { appointments?: Appointment[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Appointments</CardTitle>
        <CardDescription>Manage and view all salon appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments?.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{appointment.customerName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.customerEmail}</p>
                  </div>
                </TableCell>
                <TableCell>{appointment.service}</TableCell>
                <TableCell>
                  {appointment.date} at {appointment.time}
                </TableCell>
                <TableCell>{appointment.duration} min</TableCell>
                <TableCell>${appointment.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "completed"
                        ? "default"
                        : appointment.status === "scheduled"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CustomersSection({ customers, isLoading }: { customers?: Customer[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customers) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Directory</CardTitle>
        <CardDescription>View and manage your customer base</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Appointments</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{customer.email}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{customer.totalAppointments}</TableCell>
                <TableCell className="font-medium">${customer.totalSpent}</TableCell>
                <TableCell>{customer.lastVisit}</TableCell>
                <TableCell>{customer.joinedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CallLogsSection({ callLogs, isLoading }: { callLogs?: CallLog[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
        <CardDescription>Complete log of all incoming calls</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Outcome</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogs?.map((call) => (
              <TableRow key={call.id}>
                <TableCell className="font-medium">{call.phoneNumber}</TableCell>
                <TableCell>
                  <Clock className="w-3 h-3 inline mr-1" />
                  {Math.floor(call.duration / 60)}m {call.duration % 60}s
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      call.outcome === "booked"
                        ? "default"
                        : call.outcome === "inquiry"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {call.outcome}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(call.timestamp).toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{call.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
