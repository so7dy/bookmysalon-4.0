import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Building2, Phone, Bot, Calendar, Activity, 
  Bell, Settings, Search, Users, Zap, Mail, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  // Fetch overview data - ONLY when authenticated
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['/api/admin/overview'],
    enabled: isAuthenticated && !!adminToken,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/overview', {
        headers: { 'x-admin-token': adminToken }
      });
      if (res.status === 403 || res.status === 401) {
        sessionStorage.removeItem('admin_token');
        setAdminToken('');
        setIsAuthenticated(false);
        throw new Error('Invalid admin token');
      }
      if (!res.ok) throw new Error('Failed to fetch overview');
      return res.json();
    }
  });

  // Fetch clients
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['/api/admin/clients', searchQuery],
    enabled: isAuthenticated && activeTab === 'clients',
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/admin/clients?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/clients';
      
      const res = await fetch(url, {
        headers: { 'x-admin-token': adminToken }
      });
      if (!res.ok) throw new Error('Failed to fetch clients');
      return res.json();
    }
  });

  // Fetch phone numbers
  const { data: phoneNumbers = [], isLoading: phonesLoading } = useQuery({
    queryKey: ['/api/admin/phone-numbers'],
    enabled: isAuthenticated && activeTab === 'phones',
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/phone-numbers', {
        headers: { 'x-admin-token': adminToken }
      });
      if (!res.ok) throw new Error('Failed to fetch phone numbers');
      return res.json();
    }
  });

  // Fetch agents
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/admin/agents'],
    enabled: isAuthenticated && activeTab === 'agents',
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/agents', {
        headers: { 'x-admin-token': adminToken }
      });
      if (!res.ok) throw new Error('Failed to fetch agents');
      return res.json();
    }
  });

  // Fetch audit logs
  const { data: auditLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
    enabled: isAuthenticated && activeTab === 'logs',
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { 'x-admin-token': adminToken }
      });
      if (!res.ok) throw new Error('Failed to fetch audit logs');
      return res.json();
    }
  });

  // Fetch integrations
  const { data: integrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ['/api/admin/integrations'],
    enabled: isAuthenticated && activeTab === 'integrations',
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/integrations', {
        headers: { 'x-admin-token': adminToken }
      });
      if (!res.ok) throw new Error('Failed to fetch integrations');
      return res.json();
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      active: { variant: 'default', label: 'Active' },
      not_provisioned: { variant: 'secondary', label: 'Not Provisioned' },
      webhooks_pending: { variant: 'outline', label: 'Webhooks Pending' },
      provisioning: { variant: 'outline', label: 'Provisioning' },
      failed: { variant: 'destructive', label: 'Failed' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant} data-testid={`badge-status-${status}`}>{config.label}</Badge>;
  };

  const handleLogin = () => {
    if (adminToken) {
      sessionStorage.setItem('admin_token', adminToken);
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[400px]" data-testid="card-admin-login">
          <CardHeader>
            <CardTitle data-testid="text-admin-login-title">Admin Authentication</CardTitle>
            <CardDescription data-testid="text-admin-login-description">
              Enter your admin token to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
                data-testid="input-admin-token"
              />
              <Button
                onClick={handleLogin}
                className="w-full"
                data-testid="button-admin-login"
              >
                Access Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold" data-testid="text-admin-title">BookMySalon Admin</h1>
          </div>
          
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-sm relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by phone, email, business..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-global-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" data-testid="button-notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => {
                sessionStorage.removeItem('admin_token');
                setAdminToken('');
                setIsAuthenticated(false);
              }}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-testid="tabs-admin">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl" data-testid="tablist-admin">
            <TabsTrigger value="overview" className="gap-2" data-testid="tab-overview">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="clients" className="gap-2" data-testid="tab-clients">
              <Users className="h-4 w-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="phones" className="gap-2" data-testid="tab-phones">
              <Phone className="h-4 w-4" />
              Phones
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2" data-testid="tab-agents">
              <Bot className="h-4 w-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2" data-testid="tab-logs">
              <Activity className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2" data-testid="tab-integrations">
              <Zap className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6" data-testid="tabcontent-overview">
            {overviewLoading ? (
              <div data-testid="loading-overview">Loading...</div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card data-testid="card-total-clients">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-clients">
                        {overview?.kpis?.totalClients || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +{overview?.kpis?.newClientsThisMonth || 0} this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-phone-numbers">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Phone Numbers</CardTitle>
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-phone-numbers">
                        {overview?.kpis?.phoneNumbersProvisioned || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Provisioned</p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-active-agents">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active AI Agents</CardTitle>
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-active-agents">
                        {overview?.kpis?.activeAgents || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Live and operational</p>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-total-bookings">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold" data-testid="text-total-bookings">
                        {overview?.kpis?.totalBookingsThisMonth || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Alerts */}
                {overview?.alerts && overview.alerts.length > 0 && (
                  <Card data-testid="card-alerts">
                    <CardHeader>
                      <CardTitle>Alerts & Warnings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {overview.alerts.map((alert: any, index: number) => (
                        <div 
                          key={index}
                          className={cn(
                            "flex items-start gap-2 p-3 rounded-lg",
                            alert.type === 'error' && "bg-destructive/10",
                            alert.type === 'warning' && "bg-orange-500/10",
                            alert.type === 'info' && "bg-blue-500/10"
                          )}
                          data-testid={`alert-${index}`}
                        >
                          <Bell className={cn(
                            "h-4 w-4 mt-0.5",
                            alert.type === 'error' && "text-destructive",
                            alert.type === 'warning' && "text-orange-500",
                            alert.type === 'info' && "text-blue-500"
                          )} />
                          <div className="flex-1">
                            <p className="text-sm font-medium" data-testid={`alert-message-${index}`}>
                              {alert.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card data-testid="card-recent-activity">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {overview?.recentActivity?.map((activity: any, index: number) => (
                        <div key={index} className="flex items-start gap-3" data-testid={`activity-${index}`}>
                          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium" data-testid={`activity-action-${index}`}>
                              {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid={`activity-details-${index}`}>
                              {activity.details}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6" data-testid="tabcontent-clients">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-clients-title">Clients Management</CardTitle>
                <CardDescription data-testid="text-clients-description">
                  Manage all tenant businesses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientsLoading ? (
                  <div data-testid="loading-clients">Loading clients...</div>
                ) : (
                  <div className="space-y-4">
                    {clients.map((client: any) => (
                      <div 
                        key={client.tenantId}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`client-${client.tenantId}`}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold" data-testid={`client-name-${client.tenantId}`}>
                            {client.name}
                          </h3>
                          <p className="text-sm text-muted-foreground" data-testid={`client-email-${client.tenantId}`}>
                            {client.ownerEmail}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(client.agentStatus)}
                            {client.phoneNumber && (
                              <Badge variant="outline" data-testid={`client-phone-${client.tenantId}`}>
                                <Phone className="h-3 w-3 mr-1" />
                                {client.formattedPhoneNumber}
                              </Badge>
                            )}
                            {client.calcomConnected && (
                              <Badge variant="outline" data-testid={`client-calcom-${client.tenantId}`}>
                                Cal.com Connected
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedClient(client);
                              setShowClientDetails(true);
                            }}
                            data-testid={`button-view-client-${client.tenantId}`}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p className="text-center text-muted-foreground py-8" data-testid="text-no-clients">
                        No clients found
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phone Numbers Tab */}
          <TabsContent value="phones" className="space-y-6" data-testid="tabcontent-phones">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-phones-title">Phone Numbers</CardTitle>
                <CardDescription data-testid="text-phones-description">
                  All provisioned phone numbers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {phonesLoading ? (
                  <div data-testid="loading-phones">Loading phone numbers...</div>
                ) : (
                  <div className="space-y-4">
                    {phoneNumbers.map((phone: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`phone-${index}`}
                      >
                        <div>
                          <p className="font-mono text-lg" data-testid={`phone-number-${index}`}>
                            {phone.formattedPhoneNumber}
                          </p>
                          <p className="text-sm text-muted-foreground" data-testid={`phone-tenant-${index}`}>
                            {phone.tenantName}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {getStatusBadge(phone.status)}
                          {phone.webhooksConfigured ? (
                            <Badge variant="default" data-testid={`phone-webhook-configured-${index}`}>
                              Webhooks OK
                            </Badge>
                          ) : (
                            <Badge variant="outline" data-testid={`phone-webhook-pending-${index}`}>
                              Webhooks Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {phoneNumbers.length === 0 && (
                      <p className="text-center text-muted-foreground py-8" data-testid="text-no-phones">
                        No phone numbers provisioned yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Agents Tab */}
          <TabsContent value="agents" className="space-y-6" data-testid="tabcontent-agents">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-agents-title">AI Agents</CardTitle>
                <CardDescription data-testid="text-agents-description">
                  All AI receptionist agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                {agentsLoading ? (
                  <div data-testid="loading-agents">Loading agents...</div>
                ) : (
                  <div className="space-y-4">
                    {agents.map((agent: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`agent-${index}`}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold" data-testid={`agent-tenant-${index}`}>
                            {agent.tenantName}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono" data-testid={`agent-id-${index}`}>
                            {agent.agentId}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {getStatusBadge(agent.status)}
                            {agent.phoneNumber && (
                              <Badge variant="outline" data-testid={`agent-phone-${index}`}>
                                {agent.formattedPhoneNumber}
                              </Badge>
                            )}
                            <Badge variant="outline" data-testid={`agent-voice-${index}`}>
                              {agent.voice}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Provisioned: {agent.provisionedAt ? new Date(agent.provisionedAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {agents.length === 0 && (
                      <p className="text-center text-muted-foreground py-8" data-testid="text-no-agents">
                        No AI agents provisioned yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="logs" className="space-y-6" data-testid="tabcontent-logs">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-logs-title">Audit Logs</CardTitle>
                <CardDescription data-testid="text-logs-description">
                  System activity and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div data-testid="loading-logs">Loading logs...</div>
                ) : (
                  <div className="space-y-2">
                    {auditLogs.map((log: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 border-l-2 border-primary/20"
                        data-testid={`log-${index}`}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium" data-testid={`log-action-${index}`}>
                            {log.action}
                          </p>
                          <p className="text-xs text-muted-foreground" data-testid={`log-tenant-${index}`}>
                            {log.tenantName} ({log.tenantId})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <p className="text-center text-muted-foreground py-8" data-testid="text-no-logs">
                        No activity logs yet
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6" data-testid="tabcontent-integrations">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-integrations-title">Webhooks & Integrations</CardTitle>
                <CardDescription data-testid="text-integrations-description">
                  External service status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {integrationsLoading ? (
                  <div data-testid="loading-integrations">Loading integrations...</div>
                ) : (
                  <div className="space-y-4">
                    {integrations.map((integration: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`integration-${index}`}
                      >
                        <div>
                          <h3 className="font-semibold" data-testid={`integration-name-${index}`}>
                            {integration.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Last checked: {new Date(integration.lastChecked).toLocaleString()}
                          </p>
                        </div>
                        <Badge 
                          variant={integration.status === 'configured' ? 'default' : 'secondary'}
                          data-testid={`integration-status-${index}`}
                        >
                          {integration.status === 'configured' ? 'Configured' : 'Not Configured'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Client Details Modal */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="dialog-client-details">
          <DialogHeader>
            <DialogTitle data-testid="text-client-details-title">
              {selectedClient?.name}
            </DialogTitle>
            <DialogDescription data-testid="text-client-details-description">
              Client details and configuration
            </DialogDescription>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tenant ID</p>
                    <p className="font-mono text-sm" data-testid="text-tenant-id">{selectedClient.tenantId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owner Email</p>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <p className="text-sm" data-testid="text-owner-email">{selectedClient.ownerEmail}</p>
                    </div>
                  </div>
                  {selectedClient.location && (
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <p className="text-sm" data-testid="text-location">{selectedClient.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Configuration */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">Status & Configuration</h3>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(selectedClient.agentStatus)}
                  {selectedClient.calcomConnected && (
                    <Badge variant="default" data-testid="badge-calcom-connected">
                      Cal.com Connected
                    </Badge>
                  )}
                  {selectedClient.phoneNumber && (
                    <Badge variant="outline" data-testid="badge-phone-number">
                      <Phone className="h-3 w-3 mr-1" />
                      {selectedClient.formattedPhoneNumber}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Services & Staff */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="text-2xl font-bold" data-testid="text-services-count">
                    {selectedClient.servicesCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Staff Members</p>
                  <p className="text-2xl font-bold" data-testid="text-staff-count">
                    {selectedClient.staffCount || 0}
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              {selectedClient.operatingHours && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Operating Hours</h3>
                  <p className="text-sm" data-testid="text-operating-hours">
                    {selectedClient.operatingHours}
                  </p>
                </div>
              )}

              {/* Agent Details */}
              {selectedClient.agentId && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">AI Agent</h3>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <p className="font-mono text-sm" data-testid="text-agent-id">{selectedClient.agentId}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowClientDetails(false)}
                  data-testid="button-close-details"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
