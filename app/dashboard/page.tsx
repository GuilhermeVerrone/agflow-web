'use client';

import { useAuth } from '@/store/auth-context';
import { useAppointments } from '@/hooks';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  const { user } = useAuth();
  const today = new Date();
  
  const { data: appointments, isLoading } = useAppointments({
    startDate: format(startOfMonth(today), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(today), 'yyyy-MM-dd'),
  });

  const todayAppointments = appointments?.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate.toDateString() === today.toDateString();
  }) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.name}!
        </h2>
        <p className="text-gray-600 mt-2">
          {format(today, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Agendamentos Hoje
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {isLoading ? '-' : todayAppointments.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Total Este Mês
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {isLoading ? '-' : appointments?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase">
            Plano Atual
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {user?.tenant.plan}
          </p>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Agendamentos de Hoje
          </h3>
        </div>
        <div className="p-6">
          {isLoading ? (
            <p className="text-gray-500">Carregando...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-gray-500">Nenhum agendamento para hoje</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {appointment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(appointment.startTime), 'HH:mm')} -{' '}
                      {format(new Date(appointment.endTime), 'HH:mm')}
                    </p>
                    {appointment.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'SCHEDULED'
                        ? 'bg-blue-100 text-blue-800'
                        : appointment.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/appointments/new"
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Novo Agendamento
          </a>
          <a
            href={`/book/${user?.tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Ver Página Pública
          </a>
        </div>
      </div>
    </div>
  );
}
