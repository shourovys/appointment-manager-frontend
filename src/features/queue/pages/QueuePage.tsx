import { format } from 'date-fns';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Appointment } from '@/features/appointments/appointments.types';
import { useQueue } from '@/features/appointments/hooks/use-appointments';
import { useServicesDefinition } from '@/features/services-definition/hooks/use-services-definition';
import { useStaff } from '@/features/staff/hooks/use-staff';

import { QueueAssignDialog } from '../components/QueueAssignDialog';

export default function QueuePage() {
  const { queue, isLoading, mutate } = useQueue();
  const { staff } = useStaff();
  const { services } = useServicesDefinition();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssignClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleAssignSuccess = () => {
    mutate();
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Waiting Queue</h1>
        <p className="text-muted-foreground">Manage appointments waiting for assignment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue ({queue.length} appointments)</CardTitle>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments in queue</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Requested Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((appointment, index) => (
                  <TableRow key={appointment.id || appointment._id}>
                    <TableCell>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </TableCell>
                    <TableCell>{appointment.customerName}</TableCell>
                    <TableCell>
                      {(appointment.serviceId as unknown as { name: string })?.name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at{' '}
                      {appointment.appointmentTime}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleAssignClick(appointment)}>
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <QueueAssignDialog
        appointment={selectedAppointment}
        staff={staff}
        services={services}
        isOpen={isDialogOpen}
        onClose={handleClose}
        onSuccess={handleAssignSuccess}
      />
    </div>
  );
}
