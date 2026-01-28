export interface Appointment {
  id?: string;
  _id?: string;
  customerName: string;
  serviceId: string;
  staffId?: string;
  appointmentDate: string; // ISO date string
  appointmentTime: string; // HH:MM format
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show' | 'Waiting';
  queuePosition?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  customerName: string;
  serviceId: string;
  staffId?: string;
  appointmentDate: string;
  appointmentTime: string;
}

export type UpdateAppointmentRequest = Partial<
  CreateAppointmentRequest & { status: Appointment['status'] }
>;

export interface AppointmentWithDetails extends Appointment {
  service?: {
    id: string;
    name: string;
    duration: number;
  };
  staff?: {
    id: string;
    name: string;
  };
}
