import { useEffect, useState, type ReactElement } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

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

import { staffService } from '../services/staff.service';
import type { CreateStaffRequest, Staff, UpdateStaffRequest } from '../staff.types';

const staffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  dailyCapacity: z.number().min(1, 'Capacity must be at least 1'),
  availabilityStatus: z.enum(['Available', 'On Leave']),
});

type StaffFormData = z.infer<typeof staffSchema>;

interface StaffFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: Staff;
  onSuccess: () => void;
}

export function StaffFormDialog({
  open,
  onOpenChange,
  staff,
  onSuccess,
}: StaffFormDialogProps): ReactElement {
  const isEdit = !!staff;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    name: '',
    serviceType: '',
    dailyCapacity: 5,
    availabilityStatus: 'Available',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        serviceType: staff.serviceType,
        dailyCapacity: staff.dailyCapacity,
        availabilityStatus: staff.availabilityStatus,
      });
    } else {
      setFormData({
        name: '',
        serviceType: '',
        dailyCapacity: 5,
        availabilityStatus: 'Available',
      });
    }
    setErrors({});
  }, [staff, open]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = staffSchema.safeParse(formData);
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
      if (isEdit && staff) {
        await staffService.updateStaff(staff._id, formData as UpdateStaffRequest);
        toast.success('Staff member updated successfully');
      } else {
        await staffService.createStaff(formData as CreateStaffRequest);
        toast.success('Staff member created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? 'Failed to update staff member' : 'Failed to create staff member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof StaffFormData, value: string | number): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the staff member details.' : 'Add a new staff member to your team.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Staff name"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceType">Service Type</Label>
              <div className="col-span-3">
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleChange('serviceType', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceType && (
                  <p className="text-sm text-destructive mt-1">{errors.serviceType}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dailyCapacity">Daily Capacity</Label>
              <div className="col-span-3">
                <Input
                  id="dailyCapacity"
                  type="number"
                  value={formData.dailyCapacity}
                  onChange={(e) => handleChange('dailyCapacity', parseInt(e.target.value) || 1)}
                  min={1}
                  disabled={isLoading}
                />
                {errors.dailyCapacity && (
                  <p className="text-sm text-destructive mt-1">{errors.dailyCapacity}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="availabilityStatus">Status</Label>
              <div className="col-span-3">
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value: 'Available' | 'On Leave') =>
                    handleChange('availabilityStatus', value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
