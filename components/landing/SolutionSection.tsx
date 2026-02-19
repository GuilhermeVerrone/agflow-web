'use client';

import { 
  CalendarDays, 
  Brain, 
  RotateCcw, 
  MessageCircle, 
  CreditCard,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Agenda Online 24/7',
    description: 'Seus clientes agendam a qualquer hora, de qualquer lugar. Link exclusivo para sua empresa.',
    color: 'from-primary-500 to-primary-600',
    highlight: 'Agendamento automático',
  },
  {
    icon: Brain,
    title: 'CRM Inteligente',
    description: 'Histórico completo do cliente, ticket médio, frequência, preferências. Tudo em um lugar.',
    color: 'from-secondary-500 to-secondary-600',
    highlight: 'Conheça seu cliente',
  },
  {
    icon: RotateCcw,
    title: 'Recuperação Automática',
    description: 'Detecta clientes inativos e envia mensagens automáticas para trazê-los de volta.',
    color: 'from-accent-500 to-accent-600',
    highlight: 'Retenção +30%',
  },
  {
    icon: MessageCircle,
    title: 'IA no WhatsApp',
    description: 'Chatbot inteligente que agenda, confirma, lembra e faz follow-up automaticamente.',
    color: 'from-green-500 to-green-600',
    highlight: 'Atendimento 24h',
  },
  {
    icon: CreditCard,
    title: 'Pagamento Antecipado',
    description: 'Cobre sinal ou pagamento integral no momento do agendamento. Zero no-show.',
    color: 'from-orange-500 to-orange-600',
    highlight: 'Elimine faltas',
  },
  {
    icon: Sparkles,
    title: 'Relatórios em Tempo Real',
    description: 'Dashboard completo com receita, ocupação, serviços mais vendidos e muito mais.',
    color: 'from-pink-500 to-pink-600',
    highlight: 'Tome decisões melhores',
  },
];

export default function SolutionSection() {
  return (
    <section id="recursos" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-600 font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Tudo que você precisa
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Uma plataforma completa para{' '}
            <span className="text-gradient">automatizar seu negócio</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Do agendamento ao pagamento, do WhatsApp ao relatório. Tudo integrado.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Badge */}
              <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full mb-4">
                {feature.highlight}
              </span>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
