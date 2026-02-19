'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Precisa instalar algo?',
    answer: 'Não! O AgFlow é 100% online (SaaS). Basta criar sua conta e acessar pelo navegador do celular, tablet ou computador. Nenhuma instalação necessária.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim, sem multa e sem burocracia. Você pode cancelar diretamente pelo painel a qualquer momento. Se cancelar durante o período de teste, não será cobrado.',
  },
  {
    question: 'Funciona no celular?',
    answer: 'Sim! A plataforma é totalmente responsiva. Seus clientes agendam pelo celular e você gerencia tudo do seu smartphone. Funciona em qualquer dispositivo.',
  },
  {
    question: 'Integra com WhatsApp?',
    answer: 'Sim! No plano Diamond, você tem acesso à IA no WhatsApp que responde automaticamente, agenda, confirma e faz follow-up. Nos outros planos, os lembretes são via e-mail e SMS.',
  },
  {
    question: 'Quanto tempo leva para configurar?',
    answer: 'Menos de 5 minutos! Nosso assistente de configuração guia você passo a passo: adicionar serviços, profissionais, horários e pronto. Seu link de agendamento fica pronto na hora.',
  },
  {
    question: 'Posso migrar de plano depois?',
    answer: 'Claro! Você pode fazer upgrade ou downgrade a qualquer momento. A diferença é calculada proporcionalmente ao período restante.',
  },
  {
    question: 'Meus dados estão seguros?',
    answer: 'Sim! Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos todas as normas da LGPD. Seus dados e dos seus clientes estão protegidos.',
  },
  {
    question: 'Existe limite de agendamentos?',
    answer: 'Não! Em todos os planos, os agendamentos são ilimitados. Não cobramos por agendamento, apenas pelo plano mensal ou anual.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-sm text-primary-600 font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Perguntas frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Tire suas <span className="text-gradient">dúvidas</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
