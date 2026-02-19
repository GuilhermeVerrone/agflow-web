import { apiClient } from './api';
import { ServiceCatalog } from '@/types';

export interface CreateServiceRequest {
  name: string;
  description?: string;
  duration: number;
  price?: number;
  bufferBefore?: number;
  bufferAfter?: number;
  maxConcurrent?: number;
  requiresDeposit?: boolean;
  depositAmount?: number;
  depositPercent?: number;
  category?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateServiceRequest = Partial<CreateServiceRequest>;

export interface QueryServicesParams {
  page?: number;
  limit?: number;
}

class ServiceCatalogService {
  async listServices(params?: QueryServicesParams) {
    const response = await apiClient.get<{ data: ServiceCatalog[]; meta: any }>('/services', { params });
    return response.data;
  }

  async getActiveServices() {
    const response = await apiClient.get<ServiceCatalog[]>('/services/active');
    return response.data;
  }

  async getServicesByCategory() {
    const response = await apiClient.get<Record<string, ServiceCatalog[]>>('/services/by-category');
    return response.data;
  }

  async getService(id: string): Promise<ServiceCatalog> {
    const response = await apiClient.get<ServiceCatalog>(`/services/${id}`);
    return response.data;
  }

  async createService(data: CreateServiceRequest): Promise<ServiceCatalog> {
    const response = await apiClient.post<ServiceCatalog>('/services', data);
    return response.data;
  }

  async updateService(id: string, data: UpdateServiceRequest): Promise<ServiceCatalog> {
    const response = await apiClient.patch<ServiceCatalog>(`/services/${id}`, data);
    return response.data;
  }

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  }

  // Public endpoints — no auth required
  async getPublicServices(tenantSlug: string): Promise<ServiceCatalog[]> {
    const response = await apiClient.get<ServiceCatalog[]>(`/services/public/${tenantSlug}`);
    return response.data;
  }

  async getPublicCategories(tenantSlug: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/services/public/${tenantSlug}/categories`);
    return response.data;
  }
}

export const serviceCatalogService = new ServiceCatalogService();
