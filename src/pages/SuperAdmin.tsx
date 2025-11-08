import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Phone, Sparkles, CheckCircle2, XCircle, Clock, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AgentStatus = 'not_provisioned' | 'provisioning' | 'webhooks_pending' | 'active' | 'failed';
type ReceptionistStatus = 'not_started' | 'google_auth' | 'business_info' | 'staff' | 'services' | 'review' | 'provisioning' | 'ready';

interface Tenant {
  tenantId: string;
  name: string;
  ownerEmail?: string;
  timezone: string;
  agentStatus: AgentStatus;
  receptionistStatus?: ReceptionistStatus;
  agentId?: string;
  phoneNumber?: string;
  formattedPhoneNumber?: string;
  webhooksConfigured: boolean;
  provisionedAt?: string;
  createdAt: string;
}

export default function SuperAdmin() {
  const { toast } = useToast();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState<string>('');

  // Get admin token from sessionStorage or prompt
  const getAdminToken = () => {
    let token = sessionStorage.getItem('admin_token');
    if (!token) {
      token = prompt('Enter admin token:');
      if (token) {
        sessionStorage.setItem('admin_token', token);
      }
    }
    return token;
  };

  const { data: tenants = [], isLoading } = useQuery<Tenant[]>({
    queryKey: ['/api/admin/tenants'],
    queryFn: async () => {
      const token = getAdminToken();
      if (!token) throw new Error('Admin token required');
      
      const res = await fetch('/api/admin/tenants', {
        headers: { 'x-admin-token': token }
      });
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          sessionStorage.removeItem('admin_token');
          throw new Error('Invalid admin token');
        }
        throw new Error('Failed to fetch tenants');
      }
      return res.json();
    }
  });

  const { data: webhookConfig } = useQuery({
    queryKey: ['/api/admin/webhook-config', selectedTenant?.tenantId],
    enabled: !!selectedTenant && showWebhookModal,
    queryFn: async () => {
      const token = getAdminToken();
      if (!token) throw new Error('Admin token required');
      
      const res = await fetch(`/api/admin/webhook-config/${selectedTenant?.tenantId}`, {
        headers: { 'x-admin-token': token }
      });
      if (!res.ok) throw new Error('Failed to fetch webhook config');
      return res.json();
    }
  });

  const provisionMutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const token = getAdminToken();
      if (!token) throw new Error('Admin token required');
      
      const res = await fetch(`/api/admin/provision-agent/${tenantId}`, {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Provisioning failed');
      }
      return res.json();
    },
    onMutate: () => {
      setProvisioningStep('Creating AI receptionist...');
    },
    onSuccess: (data, tenantId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tenants'] });
      const tenant = tenants.find(t => t.tenantId === tenantId);
      if (tenant) {
        setSelectedTenant({ ...tenant, ...data });
        setShowWebhookModal(true);
      }
      setProvisioningStep('');
      toast({
        title: 'Agent provisioned successfully!',
        description: 'Please configure webhooks to complete setup.'
      });
    },
    onError: (error: any) => {
      setProvisioningStep('');
      toast({
        title: 'Provisioning failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const markWebhooksConfigured = useMutation({
    mutationFn: async (tenantId: string) => {
      const token = getAdminToken();
      if (!token) throw new Error('Admin token required');
      
      const res = await fetch(`/api/admin/tenants/${tenantId}/webhooks`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ configured: true })
      });
      if (!res.ok) throw new Error('Failed to mark webhooks configured');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tenants'] });
      setShowWebhookModal(false);
      toast({
        title: 'Agent activated!',
        description: 'The AI receptionist is now active and ready to take calls.'
      });
    }
  });

  const getStatusBadge = (status: AgentStatus) => {
    const styles = {
      not_provisioned: { icon: Clock, className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', label: 'Not Provisioned' },
      provisioning: { icon: Loader2, className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Provisioning...' },
      webhooks_pending: { icon: Clock, className: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400', label: 'Webhooks Pending' },
      active: { icon: CheckCircle2, className: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'Active' },
      failed: { icon: XCircle, className: 'bg-red-500/10 text-red-600 dark:text-red-400', label: 'Failed' }
    };

    const config = styles[status];
    const Icon = config.icon;

    return (
      <Badge className={cn('gap-1.5', config.className)} data-testid={`badge-status-${status}`}>
        <Icon className={cn('h-3.5 w-3.5', status === 'provisioning' && 'animate-spin')} />
        {config.label}
      </Badge>
    );
  };

  const getReceptionistStatusBadge = (status?: ReceptionistStatus) => {
    if (!status || status === 'not_started') return null;
    
    const styles: Record<ReceptionistStatus, { className: string; label: string }> = {
      not_started: { className: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', label: 'Not Started' },
      google_auth: { className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Google Auth' },
      business_info: { className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', label: 'Business Info' },
      staff: { className: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', label: 'Adding Staff' },
      services: { className: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', label: 'Adding Services' },
      review: { className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', label: 'In Review' },
      provisioning: { className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Provisioning' },
      ready: { className: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'Ready' }
    };

    const config = styles[status];

    return (
      <Badge className={cn('gap-1.5', config.className)} data-testid={`badge-receptionist-${status}`}>
        {config.label}
      </Badge>
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard!` });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-testid="superadmin-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-superadmin-title">
          AI Agent Provisioning
        </h1>
        <p className="text-muted-foreground" data-testid="text-superadmin-description">
          Provision and manage AI receptionists for all tenants
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {tenants.map((tenant) => (
            <Card key={tenant.tenantId} data-testid={`card-tenant-${tenant.tenantId}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold" data-testid={`text-tenant-name-${tenant.tenantId}`}>
                        {tenant.name}
                      </h3>
                      {getStatusBadge(tenant.agentStatus)}
                      {getReceptionistStatusBadge(tenant.receptionistStatus)}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p data-testid={`text-tenant-email-${tenant.tenantId}`}>
                        {tenant.ownerEmail || 'No email'}
                      </p>
                      {tenant.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span data-testid={`text-phone-${tenant.tenantId}`}>
                            {tenant.formattedPhoneNumber}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            data-testid={`button-copy-phone-${tenant.tenantId}`}
                            onClick={() => copyToClipboard(tenant.phoneNumber!, 'Phone number')}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {tenant.agentId && (
                        <p className="font-mono text-xs" data-testid={`text-agent-id-${tenant.tenantId}`}>
                          Agent: {tenant.agentId}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {tenant.agentStatus === 'not_provisioned' && (
                      <Button
                        data-testid={`button-provision-${tenant.tenantId}`}
                        onClick={() => provisionMutation.mutate(tenant.tenantId)}
                        disabled={provisionMutation.isPending}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Provision AI
                      </Button>
                    )}

                    {tenant.agentStatus === 'webhooks_pending' && (
                      <Button
                        variant="outline"
                        data-testid={`button-configure-webhooks-${tenant.tenantId}`}
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowWebhookModal(true);
                        }}
                      >
                        Configure Webhooks
                      </Button>
                    )}

                    {tenant.agentStatus === 'active' && tenant.phoneNumber && (
                      <Button
                        variant="outline"
                        data-testid={`button-test-call-${tenant.tenantId}`}
                        onClick={() => window.open(`tel:${tenant.phoneNumber}`, '_self')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Test Call
                      </Button>
                    )}

                    {tenant.agentStatus === 'failed' && (
                      <Button
                        variant="destructive"
                        data-testid={`button-retry-${tenant.tenantId}`}
                        onClick={() => provisionMutation.mutate(tenant.tenantId)}
                        disabled={provisionMutation.isPending}
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Provisioning Overlay */}
      {provisionMutation.isPending && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-1">Provisioning AI Receptionist</h3>
                  <p className="text-sm text-muted-foreground">{provisioningStep}</p>
                </div>
                <div className="w-full space-y-2 text-sm text-left text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Creating custom LLM with business prompt
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Provisioning toll-free phone number
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Linking number to agent
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Webhook Configuration Modal */}
      <Dialog open={showWebhookModal} onOpenChange={setShowWebhookModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-webhook-config">
          <DialogHeader>
            <DialogTitle data-testid="text-webhook-title">Configure Webhooks</DialogTitle>
            <DialogDescription data-testid="text-webhook-description">
              Add these 6 custom functions to your agent in the Retell Dashboard to complete setup
            </DialogDescription>
          </DialogHeader>

          {webhookConfig && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm font-medium">Agent ID</p>
                  <p className="font-mono text-sm" data-testid="text-webhook-agent-id">{webhookConfig.agentId}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-open-dashboard"
                  onClick={() => window.open(webhookConfig.dashboardUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Retell Dashboard
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Functions to Add (copy/paste each):</h4>
                
                {webhookConfig.functions.map((func: any, index: number) => (
                  <Card key={index} data-testid={`card-function-${index}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base" data-testid={`text-function-name-${index}`}>
                          {index + 1}. {func.name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-copy-function-${index}`}
                          onClick={() => copyToClipboard(JSON.stringify(func.parameters, null, 2), `${func.name} parameters`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription data-testid={`text-function-desc-${index}`}>{func.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">URL:</span>
                          <code className="ml-2 bg-muted px-2 py-0.5 rounded" data-testid={`text-function-url-${index}`}>
                            {func.url}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Method:</span>
                          <Badge variant="outline" className="ml-2" data-testid={`badge-function-method-${index}`}>
                            {func.method}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  data-testid="button-mark-configured"
                  onClick={() => selectedTenant && markWebhooksConfigured.mutate(selectedTenant.tenantId)}
                  disabled={markWebhooksConfigured.isPending}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {markWebhooksConfigured.isPending ? 'Activating...' : 'Mark as Configured'}
                </Button>
                <Button
                  variant="outline"
                  data-testid="button-close-webhook"
                  onClick={() => setShowWebhookModal(false)}
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
