import { apiClient } from './api';
import { Professional } from '@/types';

export interface CreateProfessionalRequest {
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  color?: string;
  slotDuration?: number;
  bufferBefore?: number;
  bufferAfter?: number;
  userId?: string;
  branchId?: string;
  isActive?: boolean;
}

export type UpdateProfessionalRequest = Partial<CreateProfessionalRequest>;

export interface QueryProfessionalsParams {
  page?: number;
  limit?: number;
}

class ProfessionalService {
  async listProfessionals(params?: QueryProfessionalsParams) {
    const response = await apiClient.get<{ data: Professional[]; meta: any }>('/professionals', { params });
    return response.data;
  }

  async getProfessional(id: string): Promise<Professional> {
    const response = await apiClient.get<Professional>(`/professionals/${id}`);
    return response.data;
  }

  async createProfessional(data: CreateProfessionalRequest): Promise<Professional> {
    const response = await apiClient.post<Professional>('/professionals', data);
    return response.data;
  }

  async updateProfessional(id: string, data: UpdateProfessionalRequest): Promise<Professional> {
    const response = await apiClient.patch<Professional>(`/professionals/${id}`, data);
    return response.data;
  }

  async deleteProfessional(id: string): Promise<void> {
    await apiClient.delete(`/professionals/${id}`);
  }

  async getProfessionalStats(id: string) {
    const response = await apiClient.get(`/professionals/${id}/stats`);
    return response.data;
  }

  // Public endpoint — no auth required
  async getPublicProfessionals(tenantSlug: string): Promise<Professional[]> {
    const response = await apiClient.get<Professional[]>(
      `/professionals/public/tenant/${tenantSlug}`
    );
    return response.data;
  }

  async assignService(professionalId: string, serviceId: string, opts?: { customDuration?: number; customPrice?: number }) {
    const response = await apiClient.post(`/professionals/${professionalId}/services/${serviceId}`, opts ?? {});
    return response.data;
  }

  async removeService(professionalId: string, serviceId: string) {
    await apiClient.delete(`/professionals/${professionalId}/services/${serviceId}`);
  }

  async getProfessionalServices(professionalId: string) {
    const response = await apiClient.get(`/professionals/${professionalId}/services`);
    return response.data;
  }
}

export const professionalService = new ProfessionalService();
