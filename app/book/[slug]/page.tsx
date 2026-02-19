'use client';

import { use, useState } from 'react';
import { useTenantBySlug, useAvailableSlots, useCreatePublicAppointment } from '@/hooks';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Zap,
  MapPin,
  Star,
  Clock,
  ChevronRight,
  CalendarDays,
  User,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  Shield,
} from 'lucide-react';

// Mock services data (to be fetched from API)
const MOCK_SERVICES = [
  { id: '1', name: 'Corte Masculino', price: 45, duration: 30 },
  { id: '2', name: 'Corte + Barba', price: 65, duration: 45 },
  { id: '3', name: 'Barba', price: 30, duration: 20 },
  { id: '4', name: 'Corte Infantil', price: 35, duration: 25 },
  { id: '5', name: 'Hidratação', price: 50, duration: 40 },
];

// Mock professionals
const MOCK_PROFESSIONALS = [
  { id: '1', name: 'Carlos Silva', specialty: 'Barbeiro Senior', initials: 'CS' },
  { id: '2', name: 'André Lima', specialty: 'Barbeiro', initials: 'AL' },
  { id: '3', name: 'Roberto Souza', specialty: 'Barbeiro', initials: 'RS' },
];

type BookingStep = 'services' | 'professional' | 'datetime' | 'confirm' | 'success';

export default function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [step, setStep] = useState<BookingStep>('services');
  const [selectedService, setSelectedService] = useState<typeof MOCK_SERVICES[0] | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<typeof MOCK_PROFESSIONALS[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null);
  const [clientData, setClientData] = useState({ name: '', phone: '', email: '', notes: '' });

  const { data: tenant, isLoading: tenantLoading } = useTenantBySlug(slug);
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(slug, selectedDate);
  const createAppointment = useCreatePublicAppointment(slug);

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedService) return;
    try {
      await createAppointment.mutateAsync({
        title: `${clientData.name} - ${selectedService.name}`,
        description: clientData.notes,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        status: 'SCHEDULED',
      });
      setStep('success');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const goBack = () => {
    const order: BookingStep[] = ['services', 'professional', 'datetime', 'confirm'];
    const currentIndex = order.indexOf(step);
    if (currentIndex > 0) setStep(order[currentIndex - 1]);
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-500 font-medium">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!tenant || !tenant.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
          <p className="text-gray-500">Este link de agendamento não está disponível ou foi desativado.</p>
        </div>
      </div>
    );
  }

  // =============================================
  // SUCCESS PAGE
  // =============================================
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Agendamento confirmado!
            </h1>
            <p className="text-gray-500 mb-6">
              Você receberá uma confirmação por WhatsApp/e-mail em breve.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Serviço</p>
                  <p className="text-sm font-medium text-gray-900">{selectedService?.name}</p>
                </div>
              </div>
              {selectedProfessional && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Profissional</p>
                    <p className="text-sm font-medium text-gray-900">{selectedProfessional.name}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Data e horário</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedSlot && format(new Date(selectedDate), "d 'de' MMMM", { locale: ptBR })}
                    {selectedSlot && ` às ${format(new Date(selectedSlot.startTime), 'HH:mm')}`}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep('services');
                setSelectedService(null);
                setSelectedProfessional(null);
                setSelectedSlot(null);
                setClientData({ name: '', phone: '', email: '', notes: '' });
              }}
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Fazer novo agendamento
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Powered by <span className="font-semibold">AgFlow</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo placeholder */}
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl font-bold text-white">
                {tenant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">4.9 (127)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Flow */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {step !== 'services' && (
            <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
          )}
          <div className="flex items-center gap-2 flex-1">
            {['services', 'professional', 'datetime', 'confirm'].map((s, i) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  ['services', 'professional', 'datetime', 'confirm'].indexOf(step) >= i
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* =============================================
            STEP: SELECT SERVICE
            ============================================= */}
        {step === 'services' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Escolha o serviço</h2>
            <p className="text-sm text-gray-500 mb-5">Selecione o que você deseja agendar</p>

            <div className="space-y-3">
              {MOCK_SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setStep('professional');
                  }}
                  className={`w-full flex items-center justify-between p-4 bg-white rounded-xl border transition-all hover:shadow-md hover:border-primary-200 ${
                    selectedService?.id === service.id
                      ? 'border-primary-500 shadow-md'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{service.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      R${service.price}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =============================================
            STEP: SELECT PROFESSIONAL
            ============================================= */}
        {step === 'professional' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Escolha o profissional</h2>
            <p className="text-sm text-gray-500 mb-5">Quem vai te atender?</p>

            <div className="space-y-3">
              {/* No preference option */}
              <button
                onClick={() => {
                  setSelectedProfessional(null);
                  setStep('datetime');
                }}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">Sem preferência</p>
                  <p className="text-sm text-gray-500">Qualquer profissional disponível</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {MOCK_PROFESSIONALS.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    setSelectedProfessional(prof);
                    setStep('datetime');
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-white font-bold">
                    {prof.initials}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-gray-900">{prof.name}</p>
                    <p className="text-sm text-gray-500">{prof.specialty}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =============================================
            STEP: SELECT DATE & TIME
            ============================================= */}
        {step === 'datetime' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Escolha o horário</h2>
            <p className="text-sm text-gray-500 mb-5">Selecione a data e o horário desejado</p>

            {/* Date selector */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {[...Array(14)].map((_, i) => {
                  const date = addDays(new Date(), i);
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = selectedDate === dateStr;
                  const isToday = i === 0;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedSlot(null);
                      }}
                      className={`flex-shrink-0 w-16 py-3 text-center rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}
                    >
                      <div className={`text-xs font-medium uppercase ${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
                        {isToday ? 'Hoje' : format(date, 'EEE', { locale: ptBR })}
                      </div>
                      <div className={`text-xl font-bold mt-0.5 ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                        {format(date, 'd')}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-primary-500' : 'text-gray-400'}`}>
                        {format(date, 'MMM', { locale: ptBR })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                {format(new Date(selectedDate + 'T12:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              {slotsLoading ? (
                <div className="flex items-center gap-2 py-8 justify-center text-gray-400">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm">Carregando horários...</span>
                </div>
              ) : slotsData?.availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Nenhum horário disponível</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {slotsData?.availableSlots
                    .filter((slot) => slot.available)
                    .map((slot) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 text-sm font-medium rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                              : 'border-gray-100 bg-white text-gray-700 hover:border-primary-200'
                          }`}
                        >
                          {format(new Date(slot.startTime), 'HH:mm')}
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Continue button */}
            {selectedSlot && (
              <button
                onClick={() => setStep('confirm')}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
              >
                Continuar
              </button>
            )}
          </div>
        )}

        {/* =============================================
            STEP: CONFIRM BOOKING
            ============================================= */}
        {step === 'confirm' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Confirme seu agendamento</h2>
            <p className="text-sm text-gray-500 mb-5">Preencha seus dados e confirme</p>

            {/* Booking summary */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-3">
              {selectedService && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Serviço</span>
                  <span className="text-sm font-medium text-gray-900">{selectedService.name} - R${selectedService.price}</span>
                </div>
              )}
              {selectedProfessional && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Profissional</span>
                  <span className="text-sm font-medium text-gray-900">{selectedProfessional.name}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Data</span>
                <span className="text-sm font-medium text-gray-900">
                  {format(new Date(selectedDate + 'T12:00:00'), "d 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Horário</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedSlot && format(new Date(selectedSlot.startTime), 'HH:mm')}
                  {selectedSlot && ` - ${format(new Date(selectedSlot.endTime), 'HH:mm')}`}
                </span>
              </div>
            </div>

            {/* Client form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> Nome completo *</span>
                </label>
                <input
                  type="text"
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Telefone *</span>
                  </label>
                  <input
                    type="tel"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> E-mail</span>
                  </label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  value={clientData.notes}
                  onChange={(e) => setClientData({ ...clientData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Alguma informação adicional..."
                />
              </div>
            </div>

            {/* Policy */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-xs text-yellow-700">
                <strong>Política de cancelamento:</strong> Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.
              </p>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={createAppointment.isPending || !clientData.name || !clientData.phone}
              className="w-full mt-6 py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg shadow-accent-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createAppointment.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Confirmando...
                </span>
              ) : (
                'Confirmar agendamento'
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Seus dados estão protegidos
            </div>
          </div>
        )}
      </div>

      {/* Powered by footer */}
      <div className="text-center py-6 border-t border-gray-100 mt-8">
        <p className="text-xs text-gray-400">
          Agendamento por{' '}
          <a href="/" className="font-semibold text-primary-500 hover:text-primary-600">
            AgFlow
          </a>
        </p>
      </div>
    </div>
  );
}
