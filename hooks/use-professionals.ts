import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professionalService, CreateProfessionalRequest, UpdateProfessionalRequest, QueryProfessionalsParams } from '@/services';
import { Professional } from '@/types';

export function useProfessionals(params?: QueryProfessionalsParams) {
  return useQuery({
    queryKey: ['professionals', params],
    queryFn: async () => {
      const result = await professionalService.listProfessionals(params);
      return (result?.data ?? result) as Professional[];
    },
  });
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: ['professional', id],
    queryFn: () => professionalService.getProfessional(id),
    enabled: !!id,
  });
}

export function usePublicProfessionals(tenantSlug: string) {
  return useQuery({
    queryKey: ['public-professionals', tenantSlug],
    queryFn: () => professionalService.getPublicProfessionals(tenantSlug),
    enabled: !!tenantSlug,
  });
}

export function useProfessionalServices(professionalId: string) {
  return useQuery({
    queryKey: ['professional-services', professionalId],
    queryFn: () => professionalService.getProfessionalServices(professionalId),
    enabled: !!professionalId,
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProfessionalRequest) => professionalService.createProfessional(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfessionalRequest }) =>
      professionalService.updateProfessional(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      queryClient.invalidateQueries({ queryKey: ['professional', variables.id] });
    },
  });
}

export function useDeleteProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => professionalService.deleteProfessional(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
}
