import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceCatalogService, CreateServiceRequest, UpdateServiceRequest, QueryServicesParams } from '@/services';
import { ServiceCatalog } from '@/types';

export function useServices(params?: QueryServicesParams) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const result = await serviceCatalogService.listServices(params);
      return (result?.data ?? result) as ServiceCatalog[];
    },
  });
}

export function useActiveServices() {
  return useQuery({
    queryKey: ['services-active'],
    queryFn: () => serviceCatalogService.getActiveServices(),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceCatalogService.getService(id),
    enabled: !!id,
  });
}

export function usePublicServices(tenantSlug: string) {
  return useQuery({
    queryKey: ['public-services', tenantSlug],
    queryFn: () => serviceCatalogService.getPublicServices(tenantSlug),
    enabled: !!tenantSlug,
  });
}

export function usePublicCategories(tenantSlug: string) {
  return useQuery({
    queryKey: ['public-categories', tenantSlug],
    queryFn: () => serviceCatalogService.getPublicCategories(tenantSlug),
    enabled: !!tenantSlug,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceRequest) => serviceCatalogService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-active'] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
      serviceCatalogService.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['service', variables.id] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => serviceCatalogService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['services-active'] });
    },
  });
}
