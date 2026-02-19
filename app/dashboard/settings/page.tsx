'use client';

import { useState } from 'react';
import {
  Settings,
  Building2,
  Bell,
  CreditCard,
  MessageSquare,
  Shield,
  Globe,
  Clock,
  Save,
  ChevronRight,
  Sparkles,
  Users,
  Link2,
  AlertCircle,
} from 'lucide-react';

type SettingsTab = 'company' | 'scheduling' | 'payments' | 'notifications' | 'whatsapp' | 'permissions' | 'domain';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'scheduling', label: 'Agendamento', icon: Clock },
  { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'whatsapp', label: 'WhatsApp & IA', icon: MessageSquare },
  { id: 'permissions', label: 'Usuários', icon: Users },
  { id: 'domain', label: 'Domínio', icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
          <p className="text-sm text-gray-500 mt-0.5">Gerencie as configurações do seu negócio</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
            saved
              ? 'bg-accent-500 text-white'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Salvo com sucesso!' : 'Salvar alterações'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 lg:sticky lg:top-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'scheduling' && <SchedulingSettings />}
          {activeTab === 'payments' && <PaymentSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'whatsapp' && <WhatsAppSettings />}
          {activeTab === 'permissions' && <PermissionSettings />}
          {activeTab === 'domain' && <DomainSettings />}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ToggleField({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [enabled, setEnabled] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-gray-200'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function InputField({ label, placeholder, defaultValue = '', type = 'text' }: { label: string; placeholder: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

function CompanySettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Informações da empresa" description="Dados exibidos na página pública">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Nome da empresa" placeholder="Ex: Barbearia Premium" defaultValue="Barbearia Premium" />
          <InputField label="Categoria" placeholder="Ex: Barbearia" defaultValue="Barbearia" />
          <InputField label="Telefone" placeholder="(11) 99999-9999" defaultValue="(11) 98765-4321" />
          <InputField label="WhatsApp" placeholder="(11) 99999-9999" defaultValue="(11) 98765-4321" />
          <div className="sm:col-span-2">
            <InputField label="Endereço" placeholder="Rua, número, bairro, cidade" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
          <textarea
            rows={3}
            defaultValue="A melhor barbearia da região, com profissionais qualificados e ambiente premium."
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
              BP
            </div>
            <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100">
              Alterar logo
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function SchedulingSettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Política de agendamento" description="Configure regras de agendamento">
        <ToggleField
          label="Permitir agendamento online"
          description="Clientes podem agendar pela página pública"
          defaultChecked={true}
        />
        <ToggleField
          label="Permitir cancelamento online"
          description="Clientes podem cancelar pelo link de confirmação"
          defaultChecked={true}
        />
        <ToggleField
          label="Confirmação por WhatsApp"
          description="Enviar mensagem de confirmação automática"
          defaultChecked={true}
        />
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <InputField label="Tempo mínimo de antecedência (horas)" placeholder="2" defaultValue="2" type="number" />
          <InputField label="Máximo de dias antecipados" placeholder="30" defaultValue="30" type="number" />
        </div>
      </SectionCard>

      <SectionCard title="Política de cancelamento" description="Defina termos para cancelamento">
        <div className="grid sm:grid-cols-2 gap-4">
          <InputField label="Horas mínimas para cancelar" placeholder="24" defaultValue="24" type="number" />
          <InputField label="Taxa de no-show (R$)" placeholder="0" defaultValue="0" type="number" />
        </div>
        <ToggleField
          label="Cobrar taxa de no-show"
          description="Cobrar automaticamente quando cliente não comparece"
          defaultChecked={false}
        />
      </SectionCard>

      <SectionCard title="Horário de funcionamento" description="Padrão para novos profissionais">
        <div className="space-y-3">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-24 text-sm font-medium text-gray-700">{day}</span>
              {i < 6 ? (
                <>
                  <input
                    type="time"
                    defaultValue={i === 5 ? '09:00' : '08:00'}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                  <span className="text-gray-400">até</span>
                  <input
                    type="time"
                    defaultValue={i === 5 ? '16:00' : '19:00'}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  />
                </>
              ) : (
                <span className="text-sm text-gray-400">Fechado</span>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function PaymentSettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Pagamento antecipado" description="Cobre um valor no ato do agendamento">
        <ToggleField
          label="Exigir pagamento antecipado"
          description="Cliente paga no momento do agendamento"
          defaultChecked={false}
        />
        <ToggleField
          label="Pagamento parcial"
          description="Cobrar apenas um percentual como sinal"
          defaultChecked={false}
        />
        <InputField label="Percentual do sinal (%)" placeholder="50" defaultValue="50" type="number" />
      </SectionCard>

      <SectionCard title="Métodos de pagamento" description="Integrações com gateways">
        <div className="space-y-3">
          {[
            { name: 'Stripe', desc: 'Cartão de crédito e débito', connected: false },
            { name: 'PIX (Mercado Pago)', desc: 'Pagamento instantâneo via PIX', connected: false },
            { name: 'Dinheiro', desc: 'Pagamento presencial', connected: true },
          ].map((method, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{method.name}</p>
                <p className="text-xs text-gray-500">{method.desc}</p>
              </div>
              <button
                className={`px-4 py-1.5 text-xs font-medium rounded-lg ${
                  method.connected
                    ? 'bg-accent-100 text-accent-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {method.connected ? 'Conectado' : 'Conectar'}
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Notificações para o cliente" description="Quando o cliente recebe mensagens">
        <ToggleField label="Confirmação de agendamento" description="Email e WhatsApp ao agendar" defaultChecked={true} />
        <ToggleField label="Lembrete 24h antes" description="Lembrete um dia antes do horário" defaultChecked={true} />
        <ToggleField label="Lembrete 1h antes" description="Lembrete uma hora antes" defaultChecked={false} />
        <ToggleField label="Pós-atendimento" description="Mensagem de agradecimento e avaliação" defaultChecked={true} />
        <ToggleField label="Recuperação de inativo" description="Mensagem para clientes que não voltaram" defaultChecked={false} />
      </SectionCard>

      <SectionCard title="Notificações para a empresa" description="Quando a equipe recebe alertas">
        <ToggleField label="Novo agendamento" description="Notificação a cada novo agendamento" defaultChecked={true} />
        <ToggleField label="Cancelamento" description="Notificação quando cliente cancela" defaultChecked={true} />
        <ToggleField label="No-show" description="Alerta quando cliente falta" defaultChecked={true} />
        <ToggleField label="Relatório diário" description="Resumo do dia por email" defaultChecked={false} />
      </SectionCard>
    </div>
  );
}

function WhatsAppSettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Integração WhatsApp" description="Conecte seu WhatsApp Business">
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
          <MessageSquare className="w-8 h-8 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900">WhatsApp Business API</p>
            <p className="text-xs text-green-700">Envie mensagens automatizadas e suporte via IA</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700">
            Conectar
          </button>
        </div>
        <InputField label="Número do WhatsApp" placeholder="+55 11 99999-9999" />
        <ToggleField
          label="Chatbot com IA"
          description="Responder automaticamente dúvidas e agendar via WhatsApp"
          defaultChecked={false}
        />
      </SectionCard>

      <SectionCard title="Assistente IA" description="Configure o agente inteligente">
        <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-secondary-50 to-primary-50 rounded-xl border border-secondary-100">
          <Sparkles className="w-5 h-5 text-secondary-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-secondary-900">Plano DIAMOND necessário</p>
            <p className="text-xs text-secondary-700 mt-0.5">O assistente com IA está disponível no plano Diamond. Faça upgrade para desbloquear.</p>
            <button className="mt-2 px-4 py-1.5 text-xs font-medium text-white bg-secondary-500 rounded-lg hover:bg-secondary-600">
              Fazer upgrade
            </button>
          </div>
        </div>
        <ToggleField label="Agendamento automático" description="IA agenda direto pelo WhatsApp" defaultChecked={false} />
        <ToggleField label="Resposta de dúvidas" description="IA responde perguntas sobre serviços e preços" defaultChecked={false} />
        <ToggleField label="Recuperação de clientes" description="IA envia mensagens para clientes inativos" defaultChecked={false} />
      </SectionCard>
    </div>
  );
}

function PermissionSettings() {
  const USERS = [
    { name: 'Você', email: 'admin@empresa.com', role: 'admin' },
    { name: 'Carlos Silva', email: 'carlos@empresa.com', role: 'professional' },
    { name: 'André Lima', email: 'andre@empresa.com', role: 'professional' },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Usuários e permissões" description="Gerencie quem acessa o painel">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100">
          <Users className="w-4 h-4" />
          Convidar usuário
        </button>
        <div className="space-y-3">
          {USERS.map((user, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  user.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {user.role === 'admin' ? 'Administrador' : 'Profissional'}
                </span>
                {user.role !== 'admin' && (
                  <button className="text-xs text-red-500 hover:text-red-700">Remover</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Papéis" description="Defina o que cada papel pode fazer">
        <div className="space-y-2">
          {[
            { role: 'Administrador', perms: 'Acesso total: configurações, relatórios, financeiro, agendamento' },
            { role: 'Profissional', perms: 'Ver própria agenda, gerenciar atendimentos, ver clientes atribuídos' },
            { role: 'Recepcionista', perms: 'Agendar por qualquer profissional, ver agenda geral, gerenciar clientes' },
          ].map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{r.role}</p>
                <p className="text-xs text-gray-500">{r.perms}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DomainSettings() {
  return (
    <div className="space-y-6">
      <SectionCard title="Link público" description="Endereço da sua página de agendamento">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
          <Link2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">barbeariapremium</span>
          <span className="text-sm text-gray-400">.agflow.com.br</span>
          <button className="ml-auto px-3 py-1 text-xs font-medium text-primary-600 bg-primary-100 rounded-lg hover:bg-primary-200">
            Copiar
          </button>
        </div>
        <InputField label="Alterar slug" placeholder="nomedaempresa" defaultValue="barbeariapremium" />
      </SectionCard>

      <SectionCard title="Domínio personalizado" description="Use seu próprio domínio">
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Plano GOLD ou superior</p>
            <p className="text-xs text-amber-700 mt-0.5">Domínio personalizado está disponível a partir do plano Gold.</p>
          </div>
        </div>
        <InputField label="Seu domínio" placeholder="agendamento.suaempresa.com.br" />
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
          <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Configuração DNS</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Aponte um CNAME do seu domínio para <code className="px-1 py-0.5 bg-white rounded text-xs">cname.agflow.com.br</code>
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
