'use client';

import { UserPlus, Settings, Share2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastre-se em menos de 1 minuto. Sem cartão de crédito, sem compromisso.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Settings,
    number: '02',
    title: 'Configure seus serviços',
    description: 'Adicione seus serviços, preços, profissionais e horários de funcionamento.',
    color: 'from-secondary-500 to-secondary-600',
  },
  {
    icon: Share2,
    number: '03',
    title: 'Compartilhe seu link',
    description: 'Divulgue seu link exclusivo no Instagram, WhatsApp e onde quiser.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Receba agendamentos',
    description: 'Agendamentos 24h por dia, confirmações automáticas e zero trabalho manual.',
    color: 'from-orange-500 to-orange-600',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full text-sm text-accent-600 font-medium mb-6">
            Simples assim
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Comece em <span className="text-accent-500">4 passos simples</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Configure tudo em menos de 5 minutos e comece a receber agendamentos hoje mesmo.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-200 via-secondary-200 to-accent-200" />

          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step number circle */}
              <div className="relative inline-flex mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-xl relative z-10`}>
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100 z-20">
                  <span className="text-xs font-bold text-gray-700">{step.number}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
