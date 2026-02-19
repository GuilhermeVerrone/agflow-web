'use client';

import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="inline-flex w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-3xl items-center justify-center mb-8 shadow-2xl">
          <Zap className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight">
          Pare de perder clientes{' '}
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            hoje.
          </span>
        </h2>

        <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
          Junte-se a mais de 2.500 profissionais que já automatizaram seus agendamentos e aumentaram sua receita.
        </p>

        {/* Benefits list */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-gray-300">
          {['7 dias grátis', 'Sem cartão de crédito', 'Cancele quando quiser'].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent-400" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 text-xl font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/25 hover:-translate-y-1"
          >
            Começar agora
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Configuração em menos de 5 minutos
        </p>
      </div>
    </section>
  );
}
