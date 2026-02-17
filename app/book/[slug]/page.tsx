'use client';

import { useState } from 'react';
import { useTenantBySlug, useAvailableSlots, useCreatePublicAppointment } from '@/hooks';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PublicBookingPage({ params }: { params: { slug: string } }) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [success, setSuccess] = useState(false);

  const { data: tenant, isLoading: tenantLoading } = useTenantBySlug(params.slug);
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(params.slug, selectedDate);
  const createAppointment = useCreatePublicAppointment(params.slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    try {
      await createAppointment.mutateAsync({
        ...formData,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'SCHEDULED',
      });
      setSuccess(true);
      setSelectedSlot(null);
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  if (!tenant || !tenant.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Tenant não encontrado</h1>
          <p className="text-gray-600 mt-2">Este link de agendamento não está disponível.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
          <p className="text-gray-600 mt-2">Agende seu horário</p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Agendamento criado com sucesso! Entraremos em contato em breve.
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Date Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecione a Data
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => {
                const date = addDays(new Date(), i);
                const dateStr = format(date, 'yyyy-MM-dd');
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-3 text-center rounded-lg border ${
                      selectedDate === dateStr
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="text-xs">{format(date, 'EEE', { locale: ptBR })}</div>
                    <div className="text-lg font-semibold">{format(date, 'd')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Slots */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horários Disponíveis
            </label>
            {slotsLoading ? (
              <p className="text-gray-500">Carregando horários...</p>
            ) : slotsData?.availableSlots.length === 0 ? (
              <p className="text-gray-500">Nenhum horário disponível para esta data</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slotsData?.availableSlots
                  .filter((slot) => slot.available)
                  .map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 text-sm rounded-lg border ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {format(new Date(slot.startTime), 'HH:mm')}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Booking Form */}
          {selectedSlot && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome / Assunto *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: João Silva - Consulta"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Informações adicionais"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Horário selecionado:</strong>{' '}
                  {format(new Date(selectedDate), "d 'de' MMMM", { locale: ptBR })} às{' '}
                  {format(new Date(selectedSlot.startTime), 'HH:mm')} -{' '}
                  {format(new Date(selectedSlot.endTime), 'HH:mm')}
                </p>
              </div>

              <button
                type="submit"
                disabled={createAppointment.isPending}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAppointment.isPending ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
