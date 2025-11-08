import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Clock, DollarSign, Scissors } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Service name is required'),
  durationMin: z.number().min(5, 'Duration must be at least 5 minutes').max(480, 'Duration cannot exceed 8 hours'),
  price: z.number().min(0, 'Price must be positive').optional(),
});

const daySchema = z.object({
  enabled: z.boolean(),
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
}).refine((data) => {
  if (!data.enabled) return true; // Skip validation if day is disabled
  const [startHour, startMin] = data.start.split(':').map(Number);
  const [endHour, endMin] = data.end.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['end'],
});

const operatingHoursSchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
});

const servicesOperationsSchema = z.object({
  services: z.array(serviceSchema).min(1, 'Add at least one service'),
  operatingHours: operatingHoursSchema,
});

type ServicesOperationsFormData = z.infer<typeof servicesOperationsSchema>;

interface ServicesOperationsProps {
  onComplete: (data: ServicesOperationsFormData) => void;
  initialData?: Partial<ServicesOperationsFormData>;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const;

export function ServicesOperations({ onComplete, initialData, isLoading }: ServicesOperationsProps) {
  const form = useForm<ServicesOperationsFormData>({
    resolver: zodResolver(servicesOperationsSchema),
    defaultValues: {
      services: [
        {
          id: `service_${Date.now()}`,
          name: '',
          durationMin: 30,
          price: undefined,
        },
      ],
      operatingHours: {
        monday: { enabled: true, start: '09:00', end: '17:00' },
        tuesday: { enabled: true, start: '09:00', end: '17:00' },
        wednesday: { enabled: true, start: '09:00', end: '17:00' },
        thursday: { enabled: true, start: '09:00', end: '17:00' },
        friday: { enabled: true, start: '09:00', end: '17:00' },
        saturday: { enabled: false, start: '09:00', end: '17:00' },
        sunday: { enabled: false, start: '09:00', end: '17:00' },
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'services',
  });

  // Hydrate form when initialData arrives from API
  useEffect(() => {
    if (initialData) {
      // Deep clone services to prevent parent state mutation
      const services = initialData.services && initialData.services.length > 0
        ? JSON.parse(JSON.stringify(initialData.services))
        : [{ id: `service_${Date.now()}`, name: '', durationMin: 30, price: undefined }];

      // Deep clone and normalize operating hours with fallbacks for each day
      const savedHours = initialData.operatingHours as any || {};
      
      // Helper to normalize a day's hours with fallback
      const normalizeDay = (day: any, defaultEnabled: boolean) => ({
        enabled: day?.enabled ?? defaultEnabled,
        start: day?.start || '09:00',
        end: day?.end || '17:00',
      });

      const operatingHours = {
        monday: normalizeDay(savedHours.monday, true),
        tuesday: normalizeDay(savedHours.tuesday, true),
        wednesday: normalizeDay(savedHours.wednesday, true),
        thursday: normalizeDay(savedHours.thursday, true),
        friday: normalizeDay(savedHours.friday, true),
        saturday: normalizeDay(savedHours.saturday, false),
        sunday: normalizeDay(savedHours.sunday, false),
      };

      form.reset({
        services,
        operatingHours,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: ServicesOperationsFormData) => {
    onComplete(data);
  };

  const addService = () => {
    append({
      id: `service_${Date.now()}_${Math.random()}`,
      name: '',
      durationMin: 30,
      price: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Services & Operating Hours</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your services and set your business hours
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Your Services
              </CardTitle>
              <CardDescription>
                Add the services you offer. These will be available for booking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-start border rounded-lg p-4">
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={form.control}
                      name={`services.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Haircut, Manicure, Facial"
                              data-testid={`input-service-name-${index}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`services.${index}.durationMin`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="number"
                                  min={5}
                                  max={480}
                                  className="pl-9"
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  data-testid={`input-service-duration-${index}`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`services.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (optional)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                  {...field}
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  className="pl-9"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                  data-testid={`input-service-price-${index}`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      data-testid={`button-remove-service-${index}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addService}
                className="w-full"
                data-testid="button-add-service"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Service
              </Button>

              {form.formState.errors.services?.root && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.services.root.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Operating Hours Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Set your business hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`operatingHours.${day.key}.enabled`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid={`checkbox-${day.key}`}
                          />
                        </FormControl>
                        <FormLabel className="w-24 font-normal cursor-pointer">
                          {day.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-2 flex-1">
                    <FormField
                      control={form.control}
                      name={`operatingHours.${day.key}.start`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              disabled={!form.watch(`operatingHours.${day.key}.enabled`)}
                              data-testid={`input-${day.key}-start`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <span className="text-muted-foreground">to</span>

                    <FormField
                      control={form.control}
                      name={`operatingHours.${day.key}.end`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              disabled={!form.watch(`operatingHours.${day.key}.enabled`)}
                              data-testid={`input-${day.key}-end`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="button-services-continue"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
