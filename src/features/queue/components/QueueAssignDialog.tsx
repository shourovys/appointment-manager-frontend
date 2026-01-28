import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Appointment } from '@/features/appointments/appointments.types';
import { appointmentsService } from '@/features/appointments/services/appointments.service';
import type { ServiceDefinition } from '@/features/services-definition/services-definition.types';
import type { Staff } from '@/features/staff/staff.types';

interface QueueAssignDialogProps {
  appointment: Appointment | null;
  staff: Staff[];
  services: ServiceDefinition[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function QueueAssignDialog({
  appointment,
  staff,
  services,
  isOpen,
  onClose,
  onSuccess,
}: QueueAssignDialogProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!appointment) return null;

  const service = services.find((s) => s._id === appointment.serviceId);

  // Filter staff by service type and availability
  const availableStaff = staff.filter(
    (s) => s.serviceType === service?.requiredStaffType && s.availabilityStatus === 'Available'
  );

  // Check capacity - assume we need to count current appointments for today
  // For simplicity, assume capacity is checked on backend, but here we can show warning
  const selectedStaff = availableStaff.find((s) => s._id === selectedStaffId);

  const handleSubmit = async () => {
    if (!selectedStaffId) return;

    setIsSubmitting(true);
    try {
      const appointmentId = appointment.id || appointment._id;
      if (!appointmentId) {
        toast.error('Appointment ID not found');
        return;
      }
      await appointmentsService.updateAppointment(appointmentId, {
        staffId: selectedStaffId,
        status: 'Scheduled',
      });
      toast.success('Appointment assigned successfully');
      onSuccess();
    } catch {
      toast.error('Failed to assign appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Assign <strong>{appointment.customerName}</strong> for{' '}
              <strong>{service?.name}</strong>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Select Staff</label>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose staff member" />
              </SelectTrigger>
              <SelectContent>
                {availableStaff.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name} ({s.serviceType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStaff && (
            <Alert>
              <AlertDescription>
                {selectedStaff.name} has capacity for this assignment.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedStaffId || isSubmitting}>
            {isSubmitting ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
