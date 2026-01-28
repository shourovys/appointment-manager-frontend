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

import { servicesDefinitionService } from '../services/services-definition.service';
import type {
  CreateServiceRequest,
  ServiceDefinition,
  UpdateServiceRequest,
} from '../services-definition.types';

const serviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  duration: z.union([z.literal(15), z.literal(30), z.literal(60)]),
  requiredStaffType: z.string().min(1, 'Required staff type is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: ServiceDefinition;
  onSuccess: () => void;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceFormDialogProps): ReactElement {
  const isEdit = !!service;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    duration: 15,
    requiredStaffType: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        duration: service.duration,
        requiredStaffType: service.requiredStaffType,
      });
    } else {
      setFormData({
        name: '',
        duration: 15,
        requiredStaffType: '',
      });
    }
    setErrors({});
  }, [service, open]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const result = serviceSchema.safeParse(formData);
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
      if (isEdit && service) {
        await servicesDefinitionService.updateService(
          service._id,
          formData as UpdateServiceRequest
        );
        toast.success('Service updated successfully');
      } else {
        await servicesDefinitionService.createService(formData as CreateServiceRequest);
        toast.success('Service created successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      toast.error(isEdit ? 'Failed to update service' : 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ServiceFormData, value: string | number): void => {
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
          <DialogTitle>{isEdit ? 'Edit Service' : 'Add Service'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the service details.' : 'Add a new service to your offerings.'}
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
                  placeholder="Service name"
                  disabled={isLoading}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration">Duration</Label>
              <div className="col-span-3">
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => handleChange('duration', parseInt(value))}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requiredStaffType">Staff Type</Label>
              <div className="col-span-3">
                <Select
                  value={formData.requiredStaffType}
                  onValueChange={(value) => handleChange('requiredStaffType', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                  </SelectContent>
                </Select>
                {errors.requiredStaffType && (
                  <p className="text-sm text-destructive mt-1">{errors.requiredStaffType}</p>
                )}
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
