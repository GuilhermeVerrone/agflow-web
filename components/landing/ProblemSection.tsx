'use client';

import { 
  UserX, 
  MessageSquare, 
  Clock, 
  XCircle, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

const problems = [
  {
    icon: UserX,
    title: 'Perde clientes',
    description: 'Clientes não conseguem agendar fora do horário comercial e vão para a concorrência.',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: MessageSquare,
    title: 'Responde WhatsApp o dia todo',
    description: 'Passa mais tempo respondendo mensagens do que atendendo. Zero produtividade.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Clock,
    title: 'Esquece horários',
    description: 'Agenda bagunçada, conflitos de horário, clientes esperando sem necessidade.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  {
    icon: XCircle,
    title: 'Tem cancelamentos',
    description: 'Clientes cancelam em cima da hora e você fica com buraco na agenda.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  {
    icon: HelpCircle,
    title: 'Não sabe quanto está ganhando',
    description: 'Zero controle financeiro. Não sabe o faturamento real nem o ticket médio.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-sm text-red-600 font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Você se identifica?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Se você vive algum desses{' '}
            <span className="text-red-500">problemas</span>, precisa do AgFlow
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            A maioria dos profissionais perde dinheiro todos os dias por falta de automação.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${problem.bg} rounded-xl flex items-center justify-center mb-5`}>
                <problem.icon className={`w-7 h-7 ${problem.color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}

          {/* Empty card with CTA */}
          <div className="group relative p-6 rounded-2xl border-2 border-dashed border-primary-200 bg-primary-50/50 flex flex-col items-center justify-center text-center hover:border-primary-400 transition-colors">
            <p className="text-2xl font-bold text-primary-600 mb-2">
              Chega.
            </p>
            <p className="text-primary-500">
              Existe uma solução completa para tudo isso.
            </p>
            <a
              href="#recursos"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Ver solução →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
