'use client';

import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Camila Santos',
    role: 'Proprietária, Studio Camila',
    avatar: 'CS',
    rating: 5,
    text: 'Antes eu perdia pelo menos 5 clientes por semana porque não conseguia responder a tempo. Com o AgFlow, minha agenda lotou em 2 semanas. Receita subiu 40%.',
    color: 'bg-primary-500',
  },
  {
    name: 'Ricardo Almeida',
    role: 'Barbearia Premium',
    avatar: 'RA',
    rating: 5,
    text: 'O WhatsApp com IA mudou meu negócio. Agora o bot responde, agenda e confirma. Eu só preciso atender o cliente que chega. Melhor investimento que fiz.',
    color: 'bg-secondary-500',
  },
  {
    name: 'Fernanda Lima',
    role: 'Clínica de Estética',
    avatar: 'FL',
    rating: 5,
    text: 'A recuperação automática trouxe de volta 23 clientes que estavam inativos no primeiro mês. Isso representou mais de R$8.000 em receita recuperada.',
    color: 'bg-accent-500',
  },
  {
    name: 'Marcos Oliveira',
    role: 'Personal Trainer',
    avatar: 'MO',
    rating: 5,
    text: 'Parei de perder tempo com agenda em papel e WhatsApp. Agora tenho um link profissional, meus alunos agendam sozinhos e eu foco no treino.',
    color: 'bg-orange-500',
  },
  {
    name: 'Ana Paula Costa',
    role: 'Nail Designer',
    avatar: 'AC',
    rating: 5,
    text: 'O pagamento antecipado acabou com as faltas. Antes eu tinha 30% de no-show, agora é praticamente zero. O sinal obrigatório é genial.',
    color: 'bg-pink-500',
  },
  {
    name: 'Dr. Roberto Souza',
    role: 'Consultório Odontológico',
    avatar: 'RS',
    rating: 5,
    text: 'Gerencio 3 unidades com facilidade. Os relatórios consolidados me dão visão total do negócio. O plano Diamond vale muito a pena.',
    color: 'bg-indigo-500',
  },
];

const stats = [
  { value: '50k+', label: 'Agendamentos realizados' },
  { value: '2.500+', label: 'Profissionais ativos' },
  { value: '98%', label: 'Taxa de satisfação' },
  { value: '-85%', label: 'Redução de no-show' },
];

export default function SocialProofSection() {
  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full text-sm text-yellow-700 font-medium mb-6">
            ⭐ Prova Social
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Quem usa, <span className="text-gradient">recomenda</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Veja o que profissionais como você estão dizendo sobre o AgFlow.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl">
              <p className="text-3xl sm:text-4xl font-extrabold text-gradient">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
