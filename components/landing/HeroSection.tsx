'use client';

import Link from 'next/link';
import { ArrowRight, Play, CalendarCheck, MessageCircle, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4aDJ2MmgtMnpNMjIgMThoMnYyaC0yek0zNiAzMmgydjJoLTJ6TTIyIDMyaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-200 mb-8 border border-white/10">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              Plataforma #1 para profissionais de serviço
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
              Transforme sua agenda em{' '}
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 bg-clip-text text-transparent">
                máquina de receita.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
              Agendamento online, retenção automática e atendimento inteligente via WhatsApp.
              Tudo em uma plataforma que trabalha por você, 24 horas por dia.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-lg font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
              >
                Testar grátis por 7 dias
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#planos"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                Ver planos
              </a>
            </div>

            {/* Secondary CTA */}
            <a
              href="#como-funciona"
              className="inline-flex items-center gap-2 mt-6 text-gray-400 hover:text-white transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <span className="text-sm font-medium">Ver como funciona</span>
            </a>

            {/* Trust badges */}
            <div className="mt-12 flex items-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-accent-400" />
                <span className="text-sm">+50k agendamentos</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary-400" />
                <span className="text-sm">WhatsApp integrado</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary-400" />
                <span className="text-sm">+30% retenção</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="hidden lg:block animate-slide-in-right">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl" />
              
              {/* Mock Dashboard */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="text-xs text-gray-400">AgFlow Dashboard</div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Hoje</p>
                    <p className="text-2xl font-bold text-white mt-1">12</p>
                    <p className="text-xs text-accent-400 mt-1">+23%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Receita</p>
                    <p className="text-2xl font-bold text-white mt-1">R$4.8k</p>
                    <p className="text-xs text-accent-400 mt-1">+18%</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Clientes</p>
                    <p className="text-2xl font-bold text-white mt-1">287</p>
                    <p className="text-xs text-accent-400 mt-1">+12%</p>
                  </div>
                </div>

                {/* Appointment list mock */}
                <div className="space-y-3">
                  {[
                    { time: '09:00', name: 'Maria S.', service: 'Corte + Escova', status: 'confirmed' },
                    { time: '10:30', name: 'Ana P.', service: 'Coloração', status: 'confirmed' },
                    { time: '14:00', name: 'Juliana R.', service: 'Manicure', status: 'pending' },
                  ].map((apt, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-primary-300">{apt.time}</div>
                        <div>
                          <p className="text-sm text-white font-medium">{apt.name}</p>
                          <p className="text-xs text-gray-400">{apt.service}</p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${apt.status === 'confirmed' ? 'bg-accent-400' : 'bg-yellow-400'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
