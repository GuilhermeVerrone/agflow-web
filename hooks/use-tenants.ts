import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/services';

export function useTenantBySlug(slug: string) {
  return useQuery({
    queryKey: ['tenant-slug', slug],
    queryFn: () => tenantService.getTenantBySlug(slug),
    enabled: !!slug,
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantService.getTenant(id),
    enabled: !!id,
  });
}

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => tenantService.listTenants(),
  });
}
