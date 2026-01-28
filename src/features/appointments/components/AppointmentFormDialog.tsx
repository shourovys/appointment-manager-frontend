import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useServicesDefinition } from '../../services-definition/hooks/use-services-definition';
import { useStaff } from '../../staff/hooks/use-staff';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
} from '../appointments.types';
import { useAppointments } from '../hooks/use-appointments';
import { appointmentsService } from '../services/appointments.service';

const appointmentSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  serviceId: z.string().min(1, 'Service is required'),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  onSuccess: () => void;
}

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: AppointmentFormDialogProps): ReactElement {
  const isEdit = !!appointment;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    customerName: '',
    serviceId: '',
    staffId: '',
    appointmentDate: '',
    appointmentTime: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { services } = useServicesDefinition();
  const { staff } = useStaff();

  useEffect(() => {
    if (appointment) {
      // Handle both populated objects and string IDs
      const serviceId =
        typeof appointment.serviceId === 'string'
          ? appointment.serviceId
          : (appointment.serviceId as unknown as { _id: string })?._id ||
            (appointment.serviceId as unknown as { id: string })?.id ||
            '';

      const staffId =
        typeof appointment.staffId === 'string'
          ? appointment.staffId
          : (appointment.staffId as unknown as { _id: string })?._id ||
            (appointment.staffId as unknown as { id: string })?.id ||
            '';

      // Format date to YYYY-MM-DD for date input
      let formattedDate = appointment.appointmentDate || '';
      if (appointment.appointmentDate) {
        const date = new Date(appointment.appointmentDate);
        if (!isNaN(date.getTime())) {
          const isoString = date.toISOString();
          const datePart = isoString.split('T')[0];
          if (datePart) {
            formattedDate = datePart;
          }
        }
      }

      setFormData({
        customerName: appointment.customerName,
        serviceId: serviceId,
        staffId: staffId,
        appointmentDate: formattedDate,
        appointmentTime: appointment.appointmentTime,
      });
    } else {
      setFormData({
        customerName: '',
        serviceId: '',
        staffId: '',
        appointmentDate: '',
        appointmentTime: '',
      });
    }
    setErrors({});
    setShowConflictAlert(false);
    setServerError(null);
  }, [appointment, open]);

  const selectedService = services.find((s) => s._id === formData.serviceId);
  const availableStaff = staff.filter(
    (s) =>
      !selectedService ||
      s.serviceType === selectedService.requiredStaffType ||
      (isEdit && appointment?.staffId === s._id)
  );

  // Debounced date filter to prevent API calls while user is navigating date picker
  const [debouncedDateFilter, setDebouncedDateFilter] = useState<string | undefined>(undefined);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedDateFilter(formData.appointmentDate || undefined);
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [formData.appointmentDate]);

  const dateFilters = debouncedDateFilter ? { date: debouncedDateFilter } : undefined;
  const { appointments: dateAppointments } = useAppointments(dateFilters);
  const staffCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dateAppointments.forEach((app) => {
      if (app.staffId && app.status !== 'Cancelled' && app.status !== 'No-Show') {
        counts[app.staffId] = (counts[app.staffId] || 0) + 1;
      }
    });
    return counts;
  }, [dateAppointments]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = appointmentSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit && appointment) {
        const appointmentId = appointment.id || appointment._id;
        if (!appointmentId) {
          toast.error('Appointment ID not found');
          return;
        }
        await appointmentsService.updateAppointment(
          appointmentId,
          formData as UpdateAppointmentRequest
        );
        toast.success('Appointment updated successfully');
      } else {
        await appointmentsService.createAppointment(formData as CreateAppointmentRequest);
        toast.success('Appointment created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response
      ) {
        const axiosError = error as { response: { status: number; data?: { message?: string } } };
        const errorMessage = axiosError.response.data?.message || '';

        if (axiosError.response.status === 409) {
          setShowConflictAlert(true);
        } else if (axiosError.response.status === 400) {
          // Check if it's a time conflict message
          if (errorMessage.toLowerCase().includes('time conflict')) {
            setShowConflictAlert(true);
          } else {
            // Handle other 400 Bad Request errors - show the server error message
            setServerError(
              errorMessage ||
                (isEdit ? 'Failed to update appointment' : 'Failed to create appointment')
            );
          }
        } else {
          toast.error(isEdit ? 'Failed to update appointment' : 'Failed to create appointment');
        }
      } else {
        toast.error(isEdit ? 'Failed to update appointment' : 'Failed to create appointment');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof AppointmentFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    // Clear server error when user makes changes
    if (serverError) {
      setServerError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Appointment' : 'Book Appointment'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the appointment details.' : 'Schedule a new appointment.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName">Customer Name</Label>
              <div className="col-span-3">
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Customer name"
                  disabled={isLoading}
                />
                {errors.customerName && (
                  <p className="text-sm text-destructive mt-1">{errors.customerName}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceId">Service</Label>
              <div className="col-span-3">
                <Select
                  value={formData.serviceId}
                  onValueChange={(value) => handleChange('serviceId', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name} ({service.duration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceId && (
                  <p className="text-sm text-destructive mt-1">{errors.serviceId}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffId">Staff</Label>
              <div className="col-span-3">
                <Select
                  value={formData.staffId}
                  onValueChange={(value) => handleChange('staffId', value)}
                  disabled={isLoading || !formData.serviceId}
                >
                  <SelectTrigger id="staffId">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStaff.map((staffMember) => {
                      const count = staffCounts[staffMember._id] || 0;
                      const isAtCapacity = count >= staffMember.dailyCapacity;
                      const display = `${staffMember.name} (${count}/${staffMember.dailyCapacity} appointments today)${isAtCapacity ? ' ⚠️' : ''}`;
                      return (
                        <SelectItem key={staffMember._id} value={staffMember._id}>
                          {display}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentDate">Date</Label>
              <div className="col-span-3">
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleChange('appointmentDate', e.target.value)}
                  disabled={isLoading}
                />
                {errors.appointmentDate && (
                  <p className="text-sm text-destructive mt-1">{errors.appointmentDate}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentTime">Time</Label>
              <div className="col-span-3">
                <Input
                  id="appointmentTime"
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => handleChange('appointmentTime', e.target.value)}
                  disabled={isLoading}
                />
                {errors.appointmentTime && (
                  <p className="text-sm text-destructive mt-1">{errors.appointmentTime}</p>
                )}
              </div>
            </div>
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}
            {showConflictAlert && (
              <Alert variant="destructive">
                <AlertDescription>
                  Time conflict detected. Please choose a different time or staff.
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowConflictAlert(false);
                        document.getElementById('appointmentTime')?.focus();
                      }}
                    >
                      Change Time
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowConflictAlert(false);
                        document.getElementById('staffId')?.scrollIntoView();
                      }}
                    >
                      Pick Another Staff
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEdit
                  ? 'Updating...'
                  : 'Booking...'
                : isEdit
                  ? 'Update'
                  : 'Book Appointment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
