import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { ServiceFormDialog } from '../components/ServiceFormDialog';
import { useServicesDefinition } from '../hooks/use-services-definition';
import { servicesDefinitionService } from '../services/services-definition.service';
import type { ServiceDefinition } from '../services-definition.types';

function ServicesDefinitionListPage(): React.ReactElement {
  const { services, isLoading, mutate } = useServicesDefinition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceDefinition | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceDefinition | undefined>();

  const handleAddService = (): void => {
    setEditingService(undefined);
    setDialogOpen(true);
  };

  const handleEditService = (service: ServiceDefinition): void => {
    setEditingService(service);
    setDialogOpen(true);
  };

  const handleDialogSuccess = (): void => {
    mutate();
  };

  const handleDeleteService = (service: ServiceDefinition): void => {
    setServiceToDelete(service);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteService = async (): Promise<void> => {
    if (!serviceToDelete) return;

    try {
      await servicesDefinitionService.deleteService(serviceToDelete._id);
      toast.success('Service deleted successfully');
      mutate();
      setDeleteConfirmOpen(false);
      setServiceToDelete(undefined);
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Failed to delete service');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
        <Button onClick={handleAddService}>Add Service</Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No services found.</p>
          <p className="text-sm text-muted-foreground">Add your first service to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Required Staff Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.duration} minutes</TableCell>
                <TableCell>{service.requiredStaffType}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditService(service)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteService(service)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingService}
        onSuccess={handleDialogSuccess}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {serviceToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ServicesDefinitionListPage;
