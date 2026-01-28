export interface Staff {
  _id: string;
  name: string;
  serviceType: string;
  dailyCapacity: number;
  availabilityStatus: 'Available' | 'On Leave';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  name: string;
  serviceType: string;
  dailyCapacity: number;
  availabilityStatus: 'Available' | 'On Leave';
}

export type UpdateStaffRequest = Partial<CreateStaffRequest>;
