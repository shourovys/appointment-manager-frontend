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

import { StaffFormDialog } from '../components/StaffFormDialog';
import { useStaff } from '../hooks/use-staff';
import { staffService } from '../services/staff.service';
import type { Staff } from '../staff.types';

function StaffListPage(): React.ReactElement {
  const { staff, isLoading, mutate } = useStaff();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | undefined>();

  const handleAddStaff = (): void => {
    setEditingStaff(undefined);
    setDialogOpen(true);
  };

  const handleEditStaff = (staffMember: Staff): void => {
    setEditingStaff(staffMember);
    setDialogOpen(true);
  };

  const handleDialogSuccess = (): void => {
    mutate();
  };

  const handleDeleteStaff = (staffMember: Staff): void => {
    setStaffToDelete(staffMember);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteStaff = async (): Promise<void> => {
    if (!staffToDelete) return;

    try {
      await staffService.deleteStaff(staffToDelete._id);
      toast.success('Staff member deleted successfully');
      mutate();
      setDeleteConfirmOpen(false);
      setStaffToDelete(undefined);
    } catch (error) {
      console.error('Failed to delete staff member:', error);
      toast.error('Failed to delete staff member');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <Button onClick={handleAddStaff}>Add Staff</Button>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No staff members found.</p>
          <p className="text-sm text-muted-foreground">
            Add your first staff member to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Daily Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.serviceType}</TableCell>
                <TableCell>{member.dailyCapacity}</TableCell>
                <TableCell>{member.availabilityStatus}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditStaff(member)}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteStaff(member)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <StaffFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        staff={editingStaff}
        onSuccess={handleDialogSuccess}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {staffToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStaff}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StaffListPage;
