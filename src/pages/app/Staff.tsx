import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Plus, Mail, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { StaffScheduleEditor } from '@/components/StaffScheduleEditor';

interface StaffCalendar {
  staffId: string;
  name: string;
  email?: string;
  calendarId?: string;
  calendarPending?: boolean;
}

export default function Staff() {
  const [open, setOpen] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffCalendar | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffCalendar | null>(null);
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{ staff: StaffCalendar[] }>({
    queryKey: ['/staff/calendars'],
  });

  const { data: googleStatus } = useQuery<{ connected: boolean }>({
    queryKey: ['/auth/google/status'],
  });

  const addStaffMutation = useMutation({
    mutationFn: async (data: { staffId: string; name: string; email?: string }) => {
      return await apiRequest('POST', '/staff/calendars/provision', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/staff/calendars'] });
      setOpen(false);
      setStaffId('');
      setName('');
      setEmail('');
      toast({
        title: 'Success',
        description: 'Staff member added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add staff member',
        variant: 'destructive',
      });
    },
  });

  const addEmailMutation = useMutation({
    mutationFn: async (data: { staffId: string; email: string }) => {
      return await apiRequest('POST', '/staff/calendars/provision', {
        staffId: data.staffId,
        name: selectedStaff?.name || '',
        email: data.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/staff/calendars'] });
      setEmailDialogOpen(false);
      setSelectedStaff(null);
      setNewEmail('');
      toast({
        title: 'Success',
        description: 'Email added and calendar shared successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add email',
        variant: 'destructive',
      });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId: string) => {
      return await apiRequest('DELETE', `/staff/calendars/${staffId}`, { deleteCalendar: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/staff/calendars'] });
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId.trim() || !name.trim()) {
      toast({
        title: 'Error',
        description: 'Staff ID and name are required',
        variant: 'destructive',
      });
      return;
    }
    addStaffMutation.mutate({
      staffId: staffId.trim(),
      name: name.trim(),
      email: email.trim() || undefined,
    });
  };

  const handleAddEmail = (staff: StaffCalendar) => {
    if (!googleStatus?.connected) {
      toast({
        title: 'Google Calendar Not Connected',
        description: 'Please connect your Google Calendar first to share calendars with staff',
        variant: 'destructive',
      });
      return;
    }
    setSelectedStaff(staff);
    setNewEmail('');
    setEmailDialogOpen(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !newEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }
    addEmailMutation.mutate({
      staffId: selectedStaff.staffId,
      email: newEmail.trim(),
    });
  };

  const handleDeleteClick = (staff: StaffCalendar) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (staffToDelete) {
      deleteStaffMutation.mutate(staffToDelete.staffId);
    }
  };

  const calendars = data?.staff || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff</h1>
        <p className="text-muted-foreground">Manage your staff and their calendars</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Staff Calendars</CardTitle>
              <CardDescription>
                Each staff member has a dedicated Google Calendar
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-staff">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent data-testid="dialog-add-staff">
                <DialogHeader>
                  <DialogTitle>Add Staff Member</DialogTitle>
                  <DialogDescription>
                    Add a new staff member and create their calendar
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input
                      id="staffId"
                      placeholder="e.g., jay, jaden"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      data-testid="input-staff-id"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Short unique identifier (used in URLs)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Jay Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-staff-name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., jay@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      data-testid="input-staff-email"
                    />
                    <p className="text-sm text-muted-foreground">
                      Calendar will be shared with this email if provided
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      data-testid="button-cancel-add-staff"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addStaffMutation.isPending}
                      data-testid="button-submit-add-staff"
                    >
                      {addStaffMutation.isPending ? 'Adding...' : 'Add Staff'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!calendars || calendars.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No staff yet. Add barbers to create and link calendars.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {calendars.map((staff) => (
                <div
                  key={staff.staffId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  data-testid={`staff-card-${staff.staffId}`}
                >
                  <div>
                    <h3 className="font-medium">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {staff.email || 'No email provided'}
                    </p>
                    {staff.calendarPending && (
                      <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                        Calendar pending - connect Google Calendar to provision
                      </p>
                    )}
                    {staff.calendarId && !staff.email && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Calendar created (not shared - no email)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!staff.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddEmail(staff)}
                        data-testid={`button-add-email-${staff.staffId}`}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Add Staff's Email
                      </Button>
                    )}
                    {staff.calendarId && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        data-testid={`button-open-calendar-${staff.staffId}`}
                      >
                        <a
                          href={`https://calendar.google.com/calendar/u/0/r?cid=${staff.calendarId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Google Calendar
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(staff)}
                      data-testid={`button-delete-${staff.staffId}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Staff Email</DialogTitle>
            <DialogDescription>
              Share {selectedStaff?.name}'s calendar with their email address
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Email Address</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="e.g., staff@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                data-testid="input-new-email"
                required
              />
              <p className="text-sm text-muted-foreground">
                The calendar will be shared with this email address
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEmailDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addEmailMutation.isPending}
                data-testid="button-submit-email"
              >
                {addEmailMutation.isPending ? 'Adding...' : 'Add Email'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {staffToDelete?.name}? This will also delete their Google Calendar and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteStaffMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours & PTO</CardTitle>
          <CardDescription>
            Manage staff schedules and time off
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffScheduleEditor staff={calendars} />
        </CardContent>
      </Card>
    </div>
  );
}
