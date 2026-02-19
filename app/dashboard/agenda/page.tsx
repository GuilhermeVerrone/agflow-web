'use client';

import { useState } from 'react';
import { useAppointments } from '@/hooks';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Clock,
  X,
} from 'lucide-react';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-accent-100 border-accent-300 text-accent-800',
  SCHEDULED: 'bg-primary-100 border-primary-300 text-primary-800',
  CANCELLED: 'bg-red-100 border-red-300 text-red-800',
  COMPLETED: 'bg-gray-100 border-gray-300 text-gray-800',
};

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'day'>('week');
  const [showNewModal, setShowNewModal] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: appointments, isLoading } = useAppointments({
    startDate: format(weekStart, 'yyyy-MM-dd'),
    endDate: format(weekEnd, 'yyyy-MM-dd'),
  });

  const days = view === 'week'
    ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    : [currentDate];

  const navigatePrev = () => {
    setCurrentDate(addDays(currentDate, view === 'week' ? -7 : -1));
  };

  const navigateNext = () => {
    setCurrentDate(addDays(currentDate, view === 'week' ? 7 : 1));
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={navigatePrev}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={navigateNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            {view === 'week'
              ? `${format(weekStart, "d 'de' MMM", { locale: ptBR })} - ${format(weekEnd, "d 'de' MMM yyyy", { locale: ptBR })}`
              : format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
            }
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                view === 'day' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dia
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                view === 'week' ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Semana
            </button>
          </div>

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
          >
            <Plus className="w-4 h-4" />
            Novo
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Day headers */}
        <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)` }}>
          <div className="p-3 text-center border-r border-gray-100" />
          {days.map((day) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={day.toISOString()} className="p-3 text-center border-r border-gray-100 last:border-r-0">
                <p className={`text-xs font-medium uppercase ${isToday ? 'text-primary-600' : 'text-gray-400'}`}>
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p className={`text-lg font-bold mt-0.5 ${
                  isToday 
                    ? 'w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto'
                    : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </p>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-gray-50"
              style={{ gridTemplateColumns: `80px repeat(${days.length}, 1fr)`, minHeight: '60px' }}
            >
              <div className="p-2 text-right pr-3 border-r border-gray-100">
                <span className="text-xs font-medium text-gray-400">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>
              {days.map((day) => {
                const dayAppointments = appointments?.filter((apt) => {
                  const aptDate = new Date(apt.startTime);
                  return aptDate.toDateString() === day.toDateString() &&
                    aptDate.getHours() === hour;
                }) || [];

                return (
                  <div
                    key={day.toISOString()}
                    className="p-1 border-r border-gray-50 last:border-r-0 hover:bg-gray-50 transition-colors cursor-pointer relative"
                  >
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`text-xs p-1.5 rounded-lg border mb-0.5 truncate ${
                          STATUS_COLORS[apt.status] || STATUS_COLORS.SCHEDULED
                        }`}
                      >
                        <p className="font-medium truncate">{apt.title}</p>
                        <p className="opacity-70">
                          {format(new Date(apt.startTime), 'HH:mm')} - {format(new Date(apt.endTime), 'HH:mm')}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* New Appointment Modal */}
      {showNewModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowNewModal(false)} />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Novo agendamento</h3>
                <button onClick={() => setShowNewModal(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white">
                    <option>Selecione...</option>
                    <option>Corte Masculino</option>
                    <option>Corte + Barba</option>
                    <option>Barba</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input
                      type="time"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white">
                    <option>Selecione...</option>
                    <option>Carlos Silva</option>
                    <option>André Lima</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    placeholder="Notas..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
                >
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
