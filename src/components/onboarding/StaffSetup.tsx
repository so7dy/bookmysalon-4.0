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
import { Checkbox } from '@/components/ui/checkbox';
import { Users, UserPlus, Trash2, Mail, User } from 'lucide-react';

const staffMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  services: z.array(z.string()).min(1, 'Assign at least one service'),
});

const staffSetupSchema = z.object({
  staffMembers: z.array(staffMemberSchema).min(1, 'Add at least one staff member'),
});

type StaffSetupFormData = z.infer<typeof staffSetupSchema>;

interface StaffSetupProps {
  onComplete: (data: StaffSetupFormData) => void;
  initialData?: Partial<StaffSetupFormData>;
  availableServices?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export function StaffSetup({ 
  onComplete, 
  initialData, 
  availableServices = [],
  isLoading 
}: StaffSetupProps) {
  const form = useForm<StaffSetupFormData>({
    resolver: zodResolver(staffSetupSchema),
    defaultValues: {
      staffMembers: [
        {
          id: `staff_${Date.now()}`,
          name: '',
          email: '',
          services: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'staffMembers',
  });

  // Hydrate form when initialData arrives from API
  useEffect(() => {
    if (initialData) {
      // Deep clone staff members to prevent parent state mutation
      const staffMembers = initialData.staffMembers && initialData.staffMembers.length > 0
        ? JSON.parse(JSON.stringify(initialData.staffMembers))
        : [{ id: `staff_${Date.now()}`, name: '', email: '', services: [] }];

      form.reset({
        staffMembers,
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: StaffSetupFormData) => {
    onComplete(data);
  };

  const addStaffMember = () => {
    append({
      id: `staff_${Date.now()}`,
      name: '',
      email: '',
      services: [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold">Staff Setup</h2>
              <p className="text-sm text-muted-foreground">
                Add your team members and assign services
              </p>
            </div>
          </div>

          {availableServices.length === 0 && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardContent className="pt-6">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  No services available. Please complete Step 2 first.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
                  <CardTitle className="text-base font-medium">
                    Staff Member {index + 1}
                  </CardTitle>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      data-testid={`button-remove-staff-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`staffMembers.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="John Doe"
                                className="pl-9"
                                data-testid={`input-staff-name-${index}`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`staffMembers.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="john@example.com"
                                className="pl-9"
                                data-testid={`input-staff-email-${index}`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`staffMembers.${index}.services`}
                    render={() => (
                      <FormItem>
                        <FormLabel>Assigned Services</FormLabel>
                        <FormDescription>
                          Select which services this staff member can provide
                        </FormDescription>
                        <div className="grid gap-3 md:grid-cols-2">
                          {availableServices.map((service) => (
                            <FormField
                              key={service.id}
                              control={form.control}
                              name={`staffMembers.${index}.services`}
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={service.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(service.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, service.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== service.id
                                                )
                                              );
                                        }}
                                        data-testid={`checkbox-service-${service.id}-staff-${index}`}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {service.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addStaffMember}
            className="w-full"
            data-testid="button-add-staff"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Another Staff Member
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading || availableServices.length === 0}
            data-testid="button-continue"
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
