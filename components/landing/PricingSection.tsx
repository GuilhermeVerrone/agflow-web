'use client';

import Link from 'next/link';
import { Check, X, Zap, Crown, Diamond, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Silver',
    icon: Zap,
    price: '97',
    priceAnnual: '77',
    description: 'Para profissionais autônomos que querem organizar a agenda.',
    color: 'from-gray-400 to-gray-500',
    borderColor: 'border-gray-200',
    popular: false,
    features: [
      { name: 'Agenda online 24/7', included: true },
      { name: 'Link exclusivo de agendamento', included: true },
      { name: 'Até 2 profissionais', included: true },
      { name: 'Confirmação por e-mail', included: true },
      { name: 'Dashboard básico', included: true },
      { name: 'Relatórios simples', included: true },
      { name: 'CRM inteligente', included: false },
      { name: 'Recuperação automática', included: false },
      { name: 'WhatsApp com IA', included: false },
      { name: 'Pagamento antecipado', included: false },
      { name: 'Multi-unidade', included: false },
    ],
  },
  {
    name: 'Gold',
    icon: Crown,
    price: '197',
    priceAnnual: '157',
    description: 'Para negócios em crescimento que querem automatizar e reter clientes.',
    color: 'from-yellow-500 to-amber-500',
    borderColor: 'border-yellow-400',
    popular: true,
    features: [
      { name: 'Agenda online 24/7', included: true },
      { name: 'Link exclusivo de agendamento', included: true },
      { name: 'Até 10 profissionais', included: true },
      { name: 'Confirmação por e-mail + SMS', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Relatórios avançados', included: true },
      { name: 'CRM inteligente', included: true },
      { name: 'Recuperação automática', included: true },
      { name: 'WhatsApp com IA', included: false },
      { name: 'Pagamento antecipado', included: true },
      { name: 'Multi-unidade', included: false },
    ],
  },
  {
    name: 'Diamond',
    icon: Diamond,
    price: '397',
    priceAnnual: '317',
    description: 'Para operações completas com IA, WhatsApp e múltiplas unidades.',
    color: 'from-primary-500 to-secondary-500',
    borderColor: 'border-primary-400',
    popular: false,
    features: [
      { name: 'Agenda online 24/7', included: true },
      { name: 'Link exclusivo de agendamento', included: true },
      { name: 'Profissionais ilimitados', included: true },
      { name: 'Confirmação omnichannel', included: true },
      { name: 'Dashboard completo', included: true },
      { name: 'Relatórios avançados + BI', included: true },
      { name: 'CRM inteligente', included: true },
      { name: 'Recuperação automática', included: true },
      { name: 'WhatsApp com IA', included: true },
      { name: 'Pagamento antecipado', included: true },
      { name: 'Multi-unidade', included: true },
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="planos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full text-sm text-secondary-600 font-medium mb-6">
            💎 Planos e preços
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Escolha o plano ideal para o{' '}
            <span className="text-gradient">seu negócio</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Todos os planos incluem 7 dias grátis. Cancele quando quiser, sem taxa.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl border-2 ${
                plan.popular ? plan.borderColor : 'border-gray-100'
              } p-8 ${
                plan.popular
                  ? 'shadow-2xl shadow-yellow-500/10 scale-105 lg:scale-110'
                  : 'shadow-sm hover:shadow-xl'
              } transition-all duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                  Mais popular
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl items-center justify-center mb-4 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-lg text-gray-400">R$</span>
                  <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-accent-600 mt-2">
                  ou R${plan.priceAnnual}/mês no plano anual
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={`/subscribe?plan=${plan.name.toLowerCase()}`}
                className={`group w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-base transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white hover:from-yellow-500 hover:to-amber-600 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Começar agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-gray-400 mt-12">
          Todos os planos incluem suporte por e-mail. Planos Gold e Diamond incluem suporte prioritário.
        </p>
      </div>
    </section>
  );
}
