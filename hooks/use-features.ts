import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureService } from '@/services';

export function useFeatures() {
  return useQuery({
    queryKey: ['features'],
    queryFn: () => featureService.listFeatures(),
  });
}

export function useTenantFeatures(tenantId: string) {
  return useQuery({
    queryKey: ['tenant-features', tenantId],
    queryFn: () => featureService.getTenantFeatures(tenantId),
    enabled: !!tenantId,
  });
}

export function useCheckTenantFeature(tenantId: string, featureCode: string) {
  return useQuery({
    queryKey: ['check-feature', tenantId, featureCode],
    queryFn: () => featureService.checkTenantFeature(tenantId, featureCode),
    enabled: !!tenantId && !!featureCode,
  });
}

export function useEnableFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, featureCode }: { tenantId: string; featureCode: string }) =>
      featureService.enableFeatureForTenant({ tenantId, featureCode }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-features', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['check-feature', variables.tenantId] });
    },
  });
}

export function useDisableFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, featureCode }: { tenantId: string; featureCode: string }) =>
      featureService.disableFeatureForTenant({ tenantId, featureCode }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-features', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['check-feature', variables.tenantId] });
    },
  });
}
