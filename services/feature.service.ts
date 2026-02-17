import { apiClient } from './api';
import { Feature, TenantFeature } from '@/types';

class FeatureService {
  async listFeatures(): Promise<Feature[]> {
    const response = await apiClient.get<Feature[]>('/features');
    return response.data;
  }

  async getTenantFeatures(tenantId: string): Promise<TenantFeature[]> {
    const response = await apiClient.get<TenantFeature[]>(`/features/tenant/${tenantId}/features`);
    return response.data;
  }

  async checkTenantFeature(tenantId: string, featureCode: string): Promise<boolean> {
    const response = await apiClient.get<{ hasFeature: boolean }>(
      `/features/tenant/${tenantId}/check/${featureCode}`
    );
    return response.data.hasFeature;
  }

  async enableFeatureForTenant(data: { tenantId: string; featureCode: string }): Promise<TenantFeature> {
    const response = await apiClient.post<TenantFeature>('/features/enable-for-tenant', data);
    return response.data;
  }

  async disableFeatureForTenant(data: { tenantId: string; featureCode: string }): Promise<void> {
    await apiClient.post('/features/disable-for-tenant', data);
  }
}

export const featureService = new FeatureService();
