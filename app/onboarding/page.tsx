'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Building2,
  Scissors,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

// =============================================
// Types
// =============================================

interface CompanyData {
  name: string;
  category: string;
  address: string;
  phone: string;
  whatsapp: string;
  description: string;
  logo: string | null;
}

interface ServiceData {
  id: string;
  name: string;
  price: string;
  duration: string;
  interval: string;
  professional: string;
}

interface ProfessionalData {
  id: string;
  name: string;
  specialty: string;
  photo: string | null;
}

interface ScheduleDay {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
}

const CATEGORIES = [
  'Barbearia',
  'Salão de Beleza',
  'Clínica de Estética',
  'Consultório',
  'Academia / Personal',
  'Pet Shop',
  'Tatuagem / Piercing',
  'Consultoria',
  'Outro',
];

const DEFAULT_SCHEDULE: ScheduleDay[] = [
  { day: 'Segunda', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Terça', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quarta', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Quinta', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sexta', enabled: true, start: '08:00', end: '18:00' },
  { day: 'Sábado', enabled: true, start: '08:00', end: '13:00' },
  { day: 'Domingo', enabled: false, start: '08:00', end: '12:00' },
];

const steps = [
  { label: 'Empresa', icon: Building2 },
  { label: 'Serviços', icon: Scissors },
  { label: 'Profissionais', icon: Users },
  { label: 'Horários', icon: Clock },
  { label: 'Confirmação', icon: CheckCircle },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  // Step 1: Company data
  const [company, setCompany] = useState<CompanyData>({
    name: '',
    category: '',
    address: '',
    phone: '',
    whatsapp: '',
    description: '',
    logo: null,
  });

  // Step 2: Services
  const [services, setServices] = useState<ServiceData[]>([
    { id: generateId(), name: '', price: '', duration: '30', interval: '10', professional: '' },
  ]);

  // Step 3: Professionals
  const [professionals, setProfessionals] = useState<ProfessionalData[]>([
    { id: generateId(), name: '', specialty: '', photo: null },
  ]);

  // Step 4: Schedule
  const [schedule, setSchedule] = useState<ScheduleDay[]>(DEFAULT_SCHEDULE);

  const slug = slugify(company.name || 'sua-empresa');
  const companyUrl = `${slug}.algoritmi.com.br`;

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return company.name && company.category && company.phone;
      case 1:
        return services.length > 0 && services.every((s) => s.name && s.price && s.duration);
      case 2:
        return professionals.length > 0 && professionals.every((p) => p.name);
      case 3:
        return schedule.some((s) => s.enabled);
      default:
        return true;
    }
  };

  const handleFinish = async () => {
    // TODO: Send data to API to create tenant + services + professionals + schedule
    // For now, mock success
    router.push('/dashboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${companyUrl}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // =============================================
  // Service helpers
  // =============================================
  const addService = () => {
    setServices([...services, { id: generateId(), name: '', price: '', duration: '30', interval: '10', professional: '' }]);
  };
  const removeService = (id: string) => {
    if (services.length > 1) setServices(services.filter((s) => s.id !== id));
  };
  const updateService = (id: string, field: keyof ServiceData, value: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // =============================================
  // Professional helpers
  // =============================================
  const addProfessional = () => {
    setProfessionals([...professionals, { id: generateId(), name: '', specialty: '', photo: null }]);
  };
  const removeProfessional = (id: string) => {
    if (professionals.length > 1) setProfessionals(professionals.filter((p) => p.id !== id));
  };
  const updateProfessional = (id: string, field: keyof ProfessionalData, value: string | null) => {
    setProfessionals(professionals.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // =============================================
  // Schedule helpers
  // =============================================
  const updateScheduleDay = (index: number, field: keyof ScheduleDay, value: string | boolean) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">AgFlow</span>
            </Link>
            <span className="text-sm text-gray-500">Configuração da empresa</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index < currentStep
                      ? 'bg-accent-500 text-white'
                      : index === currentStep
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mx-2 ${
                    index < currentStep ? 'bg-accent-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 max-w-3xl mx-auto">
          {/* =============================================
              STEP 0: COMPANY DATA
              ============================================= */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dados da Empresa</h2>
                <p className="text-gray-500 mt-1">Informações básicas sobre seu negócio</p>
              </div>

              {/* Logo upload placeholder */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Logo da empresa</p>
                  <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da empresa *</label>
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Ex: Studio Camila"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                  <select
                    value={company.category}
                    onChange={(e) => setCompany({ ...company, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Selecione...</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={company.description}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="Descreva seu negócio em poucas palavras..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={company.whatsapp}
                    onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =============================================
              STEP 1: SERVICES
              ============================================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Serviços</h2>
                <p className="text-gray-500 mt-1">Adicione os serviços que você oferece</p>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">Serviço {index + 1}</span>
                      {services.length > 1 && (
                        <button
                          onClick={() => removeService(service.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                          placeholder="Ex: Corte masculino"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => updateService(service.id, 'price', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                          placeholder="50.00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duração (min) *</label>
                        <select
                          value={service.duration}
                          onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                        >
                          {[15, 30, 45, 60, 90, 120].map((d) => (
                            <option key={d} value={d}>{d} minutos</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intervalo (min)</label>
                        <select
                          value={service.interval}
                          onChange={(e) => updateService(service.id, 'interval', e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                        >
                          {[0, 5, 10, 15, 30].map((d) => (
                            <option key={d} value={d}>{d === 0 ? 'Sem intervalo' : `${d} minutos`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addService}
                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar serviço
              </button>
            </div>
          )}

          {/* =============================================
              STEP 2: PROFESSIONALS
              ============================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profissionais</h2>
                <p className="text-gray-500 mt-1">Adicione quem vai realizar os atendimentos</p>
              </div>

              <div className="space-y-4">
                {professionals.map((prof, index) => (
                  <div key={prof.id} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-500">Profissional {index + 1}</span>
                      {professionals.length > 1 && (
                        <button
                          onClick={() => removeProfessional(prof.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-start gap-4">
                      {/* Photo placeholder */}
                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-primary-100 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="flex-1 grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                          <input
                            type="text"
                            value={prof.name}
                            onChange={(e) => updateProfessional(prof.id, 'name', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                            placeholder="Nome do profissional"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                          <input
                            type="text"
                            value={prof.specialty}
                            onChange={(e) => updateProfessional(prof.id, 'specialty', e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                            placeholder="Ex: Barbeiro, Esteticista..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addProfessional}
                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar profissional
              </button>
            </div>
          )}

          {/* =============================================
              STEP 3: SCHEDULE
              ============================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Horários de Funcionamento</h2>
                <p className="text-gray-500 mt-1">Defina os dias e horários que você atende</p>
              </div>

              <div className="space-y-3">
                {schedule.map((day, index) => (
                  <div
                    key={day.day}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      day.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    {/* Toggle */}
                    <button
                      onClick={() => updateScheduleDay(index, 'enabled', !day.enabled)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        day.enabled ? 'bg-primary-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          day.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>

                    {/* Day name */}
                    <span className={`w-24 text-sm font-medium ${day.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                      {day.day}
                    </span>

                    {/* Time inputs */}
                    {day.enabled ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={day.start}
                          onChange={(e) => updateScheduleDay(index, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <span className="text-gray-400">até</span>
                        <input
                          type="time"
                          value={day.end}
                          onChange={(e) => updateScheduleDay(index, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =============================================
              STEP 4: CONFIRMATION
              ============================================= */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-accent-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tudo pronto!</h2>
                <p className="text-gray-500 mt-1">Confira um resumo da sua configuração</p>
              </div>

              {/* Company link */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">Seu link de agendamento:</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xl font-bold text-gradient">{companyUrl}</span>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg bg-white shadow-sm hover:shadow transition-all"
                    title="Copiar link"
                  >
                    {linkCopied ? <Check className="w-4 h-4 text-accent-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </button>
                </div>
                <a
                  href={`https://${companyUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  Visitar página <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Summary */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Empresa</h4>
                  <p className="font-medium text-gray-900">{company.name || 'Não informado'}</p>
                  <p className="text-sm text-gray-500">{company.category}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Serviços</h4>
                  <p className="font-medium text-gray-900">{services.filter((s) => s.name).length} serviço(s)</p>
                  <p className="text-sm text-gray-500">
                    {services.filter((s) => s.name).map((s) => s.name).join(', ')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Profissionais</h4>
                  <p className="font-medium text-gray-900">{professionals.filter((p) => p.name).length} profissional(is)</p>
                  <p className="text-sm text-gray-500">
                    {professionals.filter((p) => p.name).map((p) => p.name).join(', ')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Horários</h4>
                  <p className="font-medium text-gray-900">{schedule.filter((s) => s.enabled).length} dias ativos</p>
                  <p className="text-sm text-gray-500">
                    {schedule.filter((s) => s.enabled).map((s) => s.day).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* =============================================
              NAVIGATION BUTTONS
              ============================================= */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canGoNext()}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold rounded-xl hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg shadow-accent-500/25"
              >
                Ir para o Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
