import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, CreateAppointmentRequest, UpdateAppointmentRequest, QueryAppointmentsParams } from '@/services';
import { Appointment } from '@/types';

export function useAppointments(params?: QueryAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentService.listAppointments(params),
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

export function useCheckAvailability() {
  return useMutation({
    mutationFn: ({ startTime, endTime }: { startTime: string; endTime: string }) =>
      appointmentService.checkAvailability(startTime, endTime),
  });
}

export function useAvailableSlots(tenantSlug: string, date: string) {
  return useQuery({
    queryKey: ['available-slots', tenantSlug, date],
    queryFn: () => appointmentService.getAvailableSlots(tenantSlug, date),
    enabled: !!tenantSlug && !!date,
  });
}

export function useCreatePublicAppointment(tenantSlug: string) {
  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.createPublicAppointment(tenantSlug, data),
  });
}
