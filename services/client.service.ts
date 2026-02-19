import { apiClient } from './api';
import { Client } from '@/types';

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  avatarUrl?: string;
  birthDate?: string;
  gender?: string;
  internalNotes?: string;
  isActive?: boolean;
}

export type UpdateClientRequest = Partial<CreateClientRequest>;

export interface QueryClientsParams {
  search?: string;
  classification?: string;
  tag?: string;
  sortBy?: 'name' | 'lastVisitAt' | 'lifetimeValue' | 'totalVisits' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class ClientService {
  async listClients(params?: QueryClientsParams) {
    const response = await apiClient.get<{ data: Client[]; meta: any }>('/clients', { params });
    return response.data;
  }

  async getClientStats() {
    const response = await apiClient.get('/clients/stats');
    return response.data;
  }

  async getClient(id: string): Promise<Client> {
    const response = await apiClient.get<Client>(`/clients/${id}`);
    return response.data;
  }

  async createClient(data: CreateClientRequest): Promise<Client> {
    const response = await apiClient.post<Client>('/clients', data);
    return response.data;
  }

  async updateClient(id: string, data: UpdateClientRequest): Promise<Client> {
    const response = await apiClient.patch<Client>(`/clients/${id}`, data);
    return response.data;
  }

  async deleteClient(id: string): Promise<void> {
    await apiClient.delete(`/clients/${id}`);
  }

  async addTag(clientId: string, name: string, color?: string) {
    const response = await apiClient.post(`/clients/${clientId}/tags`, { name, color });
    return response.data;
  }

  async removeTag(clientId: string, tagName: string) {
    await apiClient.delete(`/clients/${clientId}/tags/${encodeURIComponent(tagName)}`);
  }

  async recalculate(clientId: string) {
    const response = await apiClient.post(`/clients/${clientId}/recalculate`);
    return response.data;
  }
}

export const clientService = new ClientService();
