export enum Plan {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
}

export interface Feature {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantFeature {
  id: string;
  tenantId: string;
  featureId: string;
  isActive: boolean;
  feature: Feature;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  internalNotes?: string;
  isPaid: boolean;
  isNoShow: boolean;
  isRecurring: boolean;
  recurringRule?: string;
  source?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  tenantId: string;
  branchId?: string;
  professionalId: string;
  serviceId: string;
  resourceId?: string;
  clientId: string;
  professional?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
    price?: number;
    duration?: number;
  };
  client?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  appointments: Appointment[];
  availableSlots: TimeSlot[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
