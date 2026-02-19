export enum Plan {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  PROFESSIONAL = 'PROFESSIONAL',
  RECEPTIONIST = 'RECEPTIONIST',
  FINANCIAL = 'FINANCIAL',
  USER = 'USER',
}

export enum ClientClassification {
  NEW = 'NEW',
  RECURRING = 'RECURRING',
  VIP = 'VIP',
  AT_RISK = 'AT_RISK',
  INACTIVE = 'INACTIVE',
  LOST = 'LOST',
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
  // Branding
  logoUrl?: string;
  coverImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  // Address
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  addressCountry?: string;
  // Scheduling defaults
  defaultSlotDuration?: number;
  businessHourStart?: string;
  businessHourEnd?: string;
  workingDays?: number[];
  cancellationPolicy?: string;
  cancellationHoursLimit?: number;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  color?: string;
  isActive: boolean;
  slotDuration?: number;
  bufferBefore?: number;
  bufferAfter?: number;
  userId?: string;
  tenantId: string;
  branchId?: string;
  services?: ProfessionalService[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalog {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  bufferBefore?: number;
  bufferAfter?: number;
  maxConcurrent?: number;
  requiresDeposit?: boolean;
  depositAmount?: number;
  depositPercent?: number;
  category?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalService {
  id: string;
  professionalId: string;
  serviceId: string;
  customDuration?: number;
  customPrice?: number;
  isActive: boolean;
  service?: ServiceCatalog;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  avatarUrl?: string;
  birthDate?: string;
  gender?: string;
  isActive: boolean;
  internalNotes?: string;
  classification: ClientClassification;
  lifetimeValue: number;
  totalVisits: number;
  lastVisitAt?: string;
  averageTicket: number;
  avgVisitInterval?: number;
  tenantId: string;
  tags?: ClientTag[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientTag {
  id: string;
  name: string;
  color?: string;
  clientId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
  isActive: boolean;
  avatarUrl?: string;
  professional?: Professional;
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
