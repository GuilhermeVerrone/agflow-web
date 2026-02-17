import { apiClient } from './api';
import { Appointment, TimeSlot, AvailableSlotsResponse } from '@/types';

export interface CreateAppointmentRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: string;
}

export interface UpdateAppointmentRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export interface QueryAppointmentsParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}

class AppointmentService {
  async listAppointments(params?: QueryAppointmentsParams): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/scheduling', { params });
    return response.data;
  }

  async getAppointment(id: string): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/scheduling/${id}`);
    return response.data;
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<Appointment>('/scheduling', data);
    return response.data;
  }

  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/scheduling/${id}`, data);
    return response.data;
  }

  async deleteAppointment(id: string): Promise<void> {
    await apiClient.delete(`/scheduling/${id}`);
  }

  async checkAvailability(startTime: string, endTime: string): Promise<{ available: boolean; conflicts: Appointment[] }> {
    const response = await apiClient.post<{ available: boolean; conflicts: Appointment[] }>(
      '/scheduling/check-availability',
      { startTime, endTime }
    );
    return response.data;
  }

  // Endpoints públicos (para widget de agendamento)
  async getAvailableSlots(tenantSlug: string, date: string): Promise<AvailableSlotsResponse> {
    const response = await apiClient.get<AvailableSlotsResponse>(
      `/scheduling/public/${tenantSlug}/available-slots`,
      { params: { date } }
    );
    return response.data;
  }

  async createPublicAppointment(
    tenantSlug: string,
    data: CreateAppointmentRequest
  ): Promise<Appointment> {
    const response = await apiClient.post<Appointment>(
      `/scheduling/public/${tenantSlug}/appointments`,
      data
    );
    return response.data;
  }
}

export const appointmentService = new AppointmentService();
