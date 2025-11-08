import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface Service {
  serviceId: string;
  name: string;
  durationMin: number;
  bufferMin: number;
  price: number;
}

export default function Services() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const isDirtyRef = useRef(false);

  const { data, isLoading } = useQuery<Service[]>({
    queryKey: ['/portal/tenants/services'],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const saveServices = useMutation({
    mutationFn: async () => {
      return await apiRequest('PUT', '/portal/tenants/services', services);
    },
    onSuccess: () => {
      isDirtyRef.current = false;
      queryClient.invalidateQueries({ queryKey: ['/portal/tenants/services'] });
      toast({
        title: 'Saved',
        description: 'Services updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save services',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (data && !isDirtyRef.current) {
      setServices(data);
    }
  }, [data]);

  const addService = () => {
    isDirtyRef.current = true;
    setServices([...services, {
      serviceId: '',
      name: '',
      durationMin: 30,
      bufferMin: 0,
      price: 0,
    }]);
  };

  const removeService = (index: number) => {
    isDirtyRef.current = true;
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: any) => {
    isDirtyRef.current = true;
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'name') {
      updated[index].serviceId = value.toLowerCase().replace(/\s+/g, '-');
    }
    setServices(updated);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">Manage your services and pricing</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service List</CardTitle>
              <CardDescription>
                Set how long each service takes with an optional buffer. Price is shown on confirmations.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addService}
              data-testid="button-add-service"
            >
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No services yet. Add your first service.
            </p>
          ) : (
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
                      <Label className="text-sm">Duration (min)</Label>
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
                      value={service.durationMin}
                      onChange={(e) => updateService(index, 'durationMin', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="w-24">
                    <div className="flex items-center gap-1">
                      <Label className="text-sm">Buffer (min)</Label>
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
                      value={service.bufferMin}
                      onChange={(e) => updateService(index, 'bufferMin', parseInt(e.target.value))}
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
                      onChange={(e) => updateService(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeService(index)}
                    data-testid={`button-remove-service-${index}`}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => saveServices.mutate()}
              disabled={saveServices.isPending}
              data-testid="button-save-services"
            >
              {saveServices.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
