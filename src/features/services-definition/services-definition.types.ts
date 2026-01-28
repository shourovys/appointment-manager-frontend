export interface ServiceDefinition {
  _id: string;
  name: string;
  duration: 15 | 30 | 60;
  requiredStaffType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  duration: 15 | 30 | 60;
  requiredStaffType: string;
}

export type UpdateServiceRequest = Partial<CreateServiceRequest>;
