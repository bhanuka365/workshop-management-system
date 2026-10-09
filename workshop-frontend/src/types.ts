export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

// Must match the backend WorkshopStatus enum exactly (case-sensitive)
export const WORKSHOP_STATUSES = ['UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type WorkshopStatus = (typeof WORKSHOP_STATUSES)[number];

export interface LoginResponse {
  message: string;
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  role: Role;
}

export interface AuthUser {
  token: string;
  userId: number;
  email: string;
  role: Role;
}

export interface Workshop {
  message?: string;
  id: number;
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  status: WorkshopStatus;
}

export interface WorkshopRequest {
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  status: WorkshopStatus;
}

export interface UserRequest {
  email: string;
  password: string;
  role: Role;
}