import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, CreateAppointmentRequest, UpdateAppointmentRequest, QueryAppointmentsParams, CheckAvailabilityRequest } from '@/services';
import { Appointment } from '@/types';

export function useAppointments(params?: QueryAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const result = await appointmentService.listAppointments(params);
      // Backend returns { data: Appointment[], meta: {...} }
      return (result?.data ?? result) as Appointment[];
    },
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) => appointmentService.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentRequest }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => appointmentService.getDashboardStats(),
  });
}

export function useDayAgenda(date: string, professionalId?: string) {
  return useQuery({
    queryKey: ['day-agenda', date, professionalId],
    queryFn: () => appointmentService.getDayAgenda(date, professionalId),
    enabled: !!date,
  });
}

export function useWeekAgenda(startDate: string, professionalId?: string) {
  return useQuery({
    queryKey: ['week-agenda', startDate, professionalId],
    queryFn: () => appointmentService.getWeekAgenda(startDate, professionalId),
    enabled: !!startDate,
  });
}

export function useCheckAvailability() {
  return useMutation({
    mutationFn: (data: CheckAvailabilityRequest) =>
      appointmentService.checkAvailability(data),
  });
}

export function useAvailableSlots(tenantId: string, data: CheckAvailabilityRequest) {
  return useQuery({
    queryKey: ['available-slots', tenantId, data],
    queryFn: () => appointmentService.getAvailableSlots(tenantId, data),
    enabled: !!tenantId && !!data.professionalId && !!data.serviceId && !!data.date,
  });
}

export function useCreatePublicAppointment(tenantId: string) {
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createPublicAppointment(tenantId, data),
  });
}
