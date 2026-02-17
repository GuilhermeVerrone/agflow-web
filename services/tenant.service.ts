import { apiClient } from './api';
import { Tenant } from '@/types';

class TenantService {
  async getTenantBySlug(slug: string): Promise<Tenant> {
    const response = await apiClient.get<Tenant>(`/tenants/slug/${slug}`);
    return response.data;
  }

  async getTenant(id: string): Promise<Tenant> {
    const response = await apiClient.get<Tenant>(`/tenants/${id}`);
    return response.data;
  }

  async listTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<Tenant[]>('/tenants');
    return response.data;
  }

  async createTenant(data: { name: string; slug: string; plan: string }): Promise<Tenant> {
    const response = await apiClient.post<Tenant>('/tenants', data);
    return response.data;
  }

  async updateTenant(id: string, data: Partial<{ name: string; slug: string; plan: string }>): Promise<Tenant> {
    const response = await apiClient.patch<Tenant>(`/tenants/${id}`, data);
    return response.data;
  }

  async activateTenant(id: string): Promise<Tenant> {
    const response = await apiClient.post<Tenant>(`/tenants/${id}/activate`);
    return response.data;
  }

  async deactivateTenant(id: string): Promise<Tenant> {
    const response = await apiClient.post<Tenant>(`/tenants/${id}/deactivate`);
    return response.data;
  }
}

export const tenantService = new TenantService();
