'use client';

import { useAuth } from '@/store/auth-context';
import { useAppointments } from '@/hooks';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import {
  CalendarDays,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  UserX,
  BarChart3,
  ExternalLink,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const today = new Date();
  
  const { data: appointments, isLoading } = useAppointments({
    dateFrom: format(startOfMonth(today), 'yyyy-MM-dd'),
    dateTo: format(endOfMonth(today), 'yyyy-MM-dd'),
  });

  const todayAppointments = appointments?.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate.toDateString() === today.toDateString();
  }) || [];

  const futureAppointments = appointments?.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate > today;
  }) || [];

  // Mock stats for illustration
  const stats = [
    {
      label: 'Receita do mês',
      value: 'R$ 12.450',
      change: '+18%',
      positive: true,
      icon: DollarSign,
      color: 'bg-accent-50 text-accent-600',
      iconBg: 'bg-accent-100',
    },
    {
      label: 'Agendamentos hoje',
      value: isLoading ? '-' : String(todayAppointments.length),
      change: '+5',
      positive: true,
      icon: CalendarDays,
      color: 'bg-primary-50 text-primary-600',
      iconBg: 'bg-primary-100',
    },
    {
      label: 'Agendamentos futuros',
      value: isLoading ? '-' : String(futureAppointments.length),
      change: '+12%',
      positive: true,
      icon: Clock,
      color: 'bg-secondary-50 text-secondary-600',
      iconBg: 'bg-secondary-100',
    },
    {
      label: 'Clientes novos',
      value: '23',
      change: '+8%',
      positive: true,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Clientes inativos',
      value: '7',
      change: '-3',
      positive: false,
      icon: UserX,
      color: 'bg-orange-50 text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      label: 'Taxa de ocupação',
      value: '78%',
      change: '+6%',
      positive: true,
      icon: BarChart3,
      color: 'bg-pink-50 text-pink-600',
      iconBg: 'bg-pink-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-500 mt-0.5">
            {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/book/${user?.tenant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver página pública
          </Link>
          <Link
            href="/dashboard/agenda"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
          >
            <Plus className="w-4 h-4" />
            Novo agendamento
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color.split(' ')[1]}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-accent-600' : 'text-orange-600'}`}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Agendamentos de hoje</h3>
            <Link href="/dashboard/agenda" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todos
            </Link>
          </div>
          <div className="p-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Nenhum agendamento para hoje</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-14 text-center">
                      <p className="text-sm font-bold text-primary-600">
                        {format(new Date(appointment.startTime), 'HH:mm')}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(appointment.endTime), 'HH:mm')}
                      </p>
                    </div>
                    <div className="w-0.5 h-10 bg-primary-200 rounded-full" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{appointment.title}</p>
                      {appointment.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{appointment.description}</p>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                        appointment.status === 'CONFIRMED'
                          ? 'bg-accent-50 text-accent-700'
                          : appointment.status === 'SCHEDULED'
                          ? 'bg-primary-50 text-primary-700'
                          : appointment.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {appointment.status === 'CONFIRMED'
                        ? 'Confirmado'
                        : appointment.status === 'SCHEDULED'
                        ? 'Agendado'
                        : appointment.status === 'CANCELLED'
                        ? 'Cancelado'
                        : appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Info */}
        <div className="space-y-6">
          {/* Plan info */}
          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-5 text-white">
            <p className="text-sm opacity-80">Plano atual</p>
            <p className="text-2xl font-bold mt-1">{user?.tenant.plan}</p>
            <p className="text-sm opacity-70 mt-2">Agendamentos ilimitados</p>
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-white/90 hover:text-white"
            >
              Gerenciar plano <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Ações rápidas</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/agenda"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
              >
                <CalendarDays className="w-5 h-5 text-primary-500" />
                Abrir agenda
              </Link>
              <Link
                href="/dashboard/clients"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
              >
                <Users className="w-5 h-5 text-secondary-500" />
                Ver clientes
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-accent-500" />
                Ver relatórios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
