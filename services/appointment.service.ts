import { apiClient } from './api';
import { Appointment, TimeSlot, AvailableSlotsResponse } from '@/types';

export interface CreateAppointmentRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  professionalId: string;
  serviceId: string;
  clientId: string;
  resourceId?: string;
  branchId?: string;
  internalNotes?: string;
  source?: string;
  isRecurring?: boolean;
  recurringRule?: string;
}

export interface UpdateAppointmentRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  professionalId?: string;
  serviceId?: string;
  clientId?: string;
  resourceId?: string;
  branchId?: string;
  internalNotes?: string;
  source?: string;
  status?: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
  cancellationReason?: string;
}

export interface QueryAppointmentsParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  professionalId?: string;
  serviceId?: string;
  clientId?: string;
  branchId?: string;
  source?: string;
  page?: number;
  limit?: number;
}

export interface CheckAvailabilityRequest {
  professionalId: string;
  serviceId: string;
  date: string;
  resourceId?: string;
}

class AppointmentService {
  async listAppointments(params?: QueryAppointmentsParams) {
    const response = await apiClient.get<{ data: Appointment[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/appointments', { params });
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}`, data);
    return response.data;
  }

  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  }

  async getDashboardStats() {
    const response = await apiClient.get('/appointments/dashboard');
    return response.data;
  }

  async getDayAgenda(date: string, professionalId?: string) {
    const response = await apiClient.get(`/appointments/day/${date}`, {
      params: professionalId ? { professionalId } : undefined,
    });
    return response.data;
  }

  async getWeekAgenda(startDate: string, professionalId?: string) {
    const response = await apiClient.get(`/appointments/week/${startDate}`, {
      params: professionalId ? { professionalId } : undefined,
    });
    return response.data;
  }

  async checkAvailability(data: CheckAvailabilityRequest) {
    const response = await apiClient.post('/appointments/public/available-slots', data);
    return response.data;
  }

  // Endpoints públicos (para widget de agendamento)
  async getAvailableSlots(tenantId: string, data: CheckAvailabilityRequest) {
    const response = await apiClient.post(
      '/appointments/public/available-slots',
      data,
      { params: { tenantId } }
    );
    return response.data;
  }

  async createPublicAppointment(
    tenantId: string,
    data: CreateAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(
      '/appointments/public/book',
      { ...data, source: 'public_page' },
      { params: { tenantId } }
    );
    return response.data;
  }
}

export const appointmentService = new AppointmentService();
