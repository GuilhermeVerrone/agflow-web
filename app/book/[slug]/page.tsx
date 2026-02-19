'use client';

import { useState } from 'react';
import { use } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  MessageCircle,
  Star,
  Scissors,
  X,
  Loader2,
} from 'lucide-react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  usePublicServices,
  usePublicProfessionals,
  useAvailableSlots,
  useCreatePublicAppointment,
} from '@/hooks';
import { ServiceCatalog, Professional } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { tenantService } from '@/services';

type Step = 'landing' | 'service' | 'professional' | 'datetime' | 'confirm' | 'success';

interface BookingState {
  service: ServiceCatalog | null;
  professional: Professional | null;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
}

const INITIAL_STATE: BookingState = {
  service: null,
  professional: null,
  date: '',
  time: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: '',
};

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [step, setStep] = useState<Step>('landing');
  const [booking, setBooking] = useState<BookingState>(INITIAL_STATE);

  // Public tenant data
  const { data: tenant } = useQuery({
    queryKey: ['tenant-public', slug],
    queryFn: () => tenantService.getTenantBySlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: services = [], isLoading: servicesLoading } = usePublicServices(slug);
  const { data: professionals = [], isLoading: profLoading } = usePublicProfessionals(slug);

  const availabilityRequest = booking.professional && booking.date
    ? {
        professionalId: booking.professional.id,
        serviceId: booking.service?.id ?? '',
        date: booking.date,
      }
    : null;

  const { data: availableSlots = [], isLoading: slotsLoading } = useAvailableSlots(
    tenant?.id ?? '',
    availabilityRequest ?? { professionalId: '', serviceId: '', date: '' },
    { enabled: step === 'datetime' && !!booking.professional && !!booking.date && !!tenant?.id }
  );

  const createAppointment = useCreatePublicAppointment();

  const primaryColor = tenant?.primaryColor ?? '#6366f1';
  const secondaryColor = tenant?.secondaryColor ?? '#8b5cf6';
  const logoUrl = tenant?.logoUrl;
  const coverImageUrl = tenant?.coverImageUrl;
  const tenantName = tenant?.name ?? 'Agendamento Online';
  const tenantPhone = tenant?.phone ?? '';
  const tenantDescription = tenant?.description ?? 'Agende seu horário de forma rápida e fácil.';

  // Generate next 14 days for date picker
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const handleConfirm = async () => {
    if (!booking.service || !booking.professional || !booking.date || !booking.time) return;
    try {
      await createAppointment.mutateAsync({
        tenantId: tenant?.id ?? '',
        professionalId: booking.professional.id,
        serviceId: booking.service.id,
        scheduledDate: `${booking.date}T${booking.time}:00`,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone,
        clientEmail: booking.clientEmail || undefined,
        notes: booking.notes || undefined,
      });
      setStep('success');
    } catch {
      // error handled by mutation
    }
  };

  // ─── LANDING ─────────────────────────────────────────────────────────────────
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
        >
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt={tenantName}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
            />
          )}
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
            {logoUrl ? (
              <img src={logoUrl} alt={tenantName} className="h-20 w-auto mx-auto mb-6 rounded-2xl shadow-lg" />
            ) : (
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Scissors className="w-10 h-10 text-white" />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{tenantName}</h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">{tenantDescription}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setStep('service')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-2xl transition-all shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <Calendar className="w-5 h-5" />
                Agendar agora
                <ChevronRight className="w-5 h-5" />
              </button>
              {tenantPhone && (
                <a
                  href={`https://wa.me/${tenantPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-green-500 hover:bg-green-600 rounded-2xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Services preview */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Nossos Serviços</h2>
          <p className="text-gray-500 mb-8">Escolha o serviço ideal para você</p>
          {servicesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => { setBooking(s => ({ ...s, service })); setStep('professional'); }}
                  className="text-left bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.name} className="w-full h-32 object-cover rounded-xl mb-4" />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Scissors className="w-6 h-6" style={{ color: primaryColor }} />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
                  {service.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {service.duration}min
                    </div>
                    <span className="font-bold text-base" style={{ color: primaryColor }}>
                      R$ {Number(service.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team */}
        {professionals.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 pb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Nossa Equipe</h2>
            <p className="text-gray-500 mb-8">Profissionais qualificados para atendê-lo</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {professionals.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  {prof.avatarUrl ? (
                    <img src={prof.avatarUrl} alt={prof.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                    >
                      {prof.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                  )}
                  <p className="font-bold text-gray-900">{prof.name}</p>
                  {prof.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prof.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
          Powered by <span className="font-bold text-gray-600">AgFlow</span>
        </div>
      </div>
    );
  }

  // ─── BOOKING FLOW ─────────────────────────────────────────────────────────────
  const stepIndex = ['service', 'professional', 'datetime', 'confirm'].indexOf(step);
  const stepLabels = ['Serviço', 'Profissional', 'Data/Hora', 'Confirmar'];

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <CheckCircle className="w-10 h-10" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Agendado!</h2>
          <p className="text-gray-500 mb-2">
            Seu agendamento foi confirmado com sucesso.
          </p>
          {booking.service && booking.professional && (
            <div className="bg-gray-50 rounded-2xl p-4 my-6 text-left space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Serviço</span><span className="font-medium">{booking.service.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Profissional</span><span className="font-medium">{booking.professional.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Data</span><span className="font-medium">{booking.date && format(parseISO(booking.date), "dd/MM/yyyy")}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hora</span><span className="font-medium">{booking.time}</span></div>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {tenantPhone && (
              <a
                href={`https://wa.me/${tenantPhone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Contato via WhatsApp
              </a>
            )}
            <button
              onClick={() => { setBooking(INITIAL_STATE); setStep('landing'); }}
              className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div
        className="w-full px-6 py-4 flex items-center gap-4 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        <button onClick={() => setStep('landing')} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        {logoUrl ? (
          <img src={logoUrl} alt={tenantName} className="h-8 w-auto rounded-lg" />
        ) : (
          <span className="text-white font-bold text-lg">{tenantName}</span>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all"
                  style={i <= stepIndex
                    ? { backgroundColor: primaryColor, color: 'white' }
                    : { backgroundColor: '#f3f4f6', color: '#9ca3af' }}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= stepIndex ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className="flex-1 h-px bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* STEP: Service */}
        {step === 'service' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900">Escolha o serviço</h2>
            {servicesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => { setBooking(s => ({ ...s, service })); setStep('professional'); }}
                    className={`w-full text-left bg-white rounded-2xl border p-4 hover:shadow-md transition-all ${booking.service?.id === service.id ? 'border-2 shadow-md' : 'border-gray-100'}`}
                    style={booking.service?.id === service.id ? { borderColor: primaryColor } : {}}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                        <Scissors className="w-6 h-6" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900">{service.name}</p>
                        {service.description && <p className="text-sm text-gray-500 truncate">{service.description}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{service.duration}min</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base" style={{ color: primaryColor }}>R$ {Number(service.price).toFixed(2).replace('.', ',')}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP: Professional */}
        {step === 'professional' && (
          <div className="space-y-4">
            <button onClick={() => setStep('service')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-2xl font-black text-gray-900">Escolha o profissional</h2>
            {profLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>
            ) : (
              <div className="space-y-3">
                {professionals.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => { setBooking(s => ({ ...s, professional: prof })); setStep('datetime'); }}
                    className={`w-full text-left bg-white rounded-2xl border p-4 hover:shadow-md transition-all ${booking.professional?.id === prof.id ? 'border-2 shadow-md' : 'border-gray-100'}`}
                    style={booking.professional?.id === prof.id ? { borderColor: primaryColor } : {}}
                  >
                    <div className="flex items-center gap-4">
                      {prof.avatarUrl ? (
                        <img src={prof.avatarUrl} alt={prof.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                        >
                          {prof.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{prof.name}</p>
                        {prof.bio && <p className="text-sm text-gray-500">{prof.bio}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP: Date & Time */}
        {step === 'datetime' && (
          <div className="space-y-6">
            <button onClick={() => setStep('professional')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-2xl font-black text-gray-900">Escolha a data e hora</h2>

            {/* Date picker */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Data</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const isSelected = booking.date === dateStr;
                  return (
                    <button
                      key={dateStr}
                      onClick={() => setBooking(s => ({ ...s, date: dateStr, time: '' }))}
                      className="flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border transition-all min-w-[60px]"
                      style={isSelected ? { backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' } : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#374151' }}
                    >
                      <span className="text-xs font-medium capitalize">{format(date, 'EEE', { locale: ptBR })}</span>
                      <span className="text-lg font-bold leading-tight">{format(date, 'd')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {booking.date && (
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">Horário</p>
                {slotsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhum horário disponível para este dia.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => {
                      const time = typeof slot === 'string' ? slot : slot.time ?? slot.startTime ?? '';
                      const isSelected = booking.time === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setBooking(s => ({ ...s, time }))}
                          className="py-2.5 text-sm font-semibold rounded-xl border transition-all"
                          style={isSelected ? { backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' } : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#374151' }}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {booking.date && booking.time && (
              <button
                onClick={() => setStep('confirm')}
                className="w-full py-3.5 text-base font-bold text-white rounded-2xl transition-all shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                Continuar <ChevronRight className="inline w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* STEP: Confirm */}
        {step === 'confirm' && (
          <div className="space-y-6">
            <button onClick={() => setStep('datetime')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-2xl font-black text-gray-900">Seus dados</h2>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Serviço</span><span className="font-medium">{booking.service?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Profissional</span><span className="font-medium">{booking.professional?.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Data</span><span className="font-medium">{booking.date && format(parseISO(booking.date), "dd 'de' MMMM", { locale: ptBR })}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Hora</span><span className="font-medium">{booking.time}</span></div>
              <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-500">Valor</span>
                <span className="font-bold" style={{ color: primaryColor }}>R$ {booking.service && Number(booking.service.price).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            {/* Client form */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={booking.clientName}
                    onChange={(e) => setBooking(s => ({ ...s, clientName: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm"
                    style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone / WhatsApp *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={booking.clientPhone}
                    onChange={(e) => setBooking(s => ({ ...s, clientPhone: e.target.value }))}
                    placeholder="(11) 99999-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail (opcional)</label>
                <input
                  type="email"
                  value={booking.clientEmail}
                  onChange={(e) => setBooking(s => ({ ...s, clientEmail: e.target.value }))}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (opcional)</label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking(s => ({ ...s, notes: e.target.value }))}
                  placeholder="Alguma informação adicional..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none text-sm resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!booking.clientName || !booking.clientPhone || createAppointment.isPending}
              className="w-full py-3.5 text-base font-bold text-white rounded-2xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            >
              {createAppointment.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Confirmando...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Confirmar agendamento</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
