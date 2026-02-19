'use client';

import { useState } from 'react';
import {
  Plus,
  Clock,
  DollarSign,
  Target,
  Star,
  MoreHorizontal,
  Edit,
  Calendar,
} from 'lucide-react';

const MOCK_PROFESSIONALS = [
  {
    id: '1',
    name: 'Carlos Silva',
    specialty: 'Barbeiro Senior',
    initials: 'CS',
    commission: 40,
    revenueGoal: 15000,
    currentRevenue: 12450,
    appointments: 142,
    rating: 4.9,
    schedule: { seg: '08:00-18:00', ter: '08:00-18:00', qua: '08:00-18:00', qui: '08:00-18:00', sex: '08:00-18:00', sab: '08:00-13:00' },
    color: 'from-primary-400 to-primary-600',
  },
  {
    id: '2',
    name: 'André Lima',
    specialty: 'Barbeiro',
    initials: 'AL',
    commission: 35,
    revenueGoal: 10000,
    currentRevenue: 8200,
    appointments: 98,
    rating: 4.7,
    schedule: { seg: '09:00-18:00', ter: '09:00-18:00', qua: '09:00-18:00', qui: '09:00-18:00', sex: '09:00-18:00', sab: '09:00-13:00' },
    color: 'from-secondary-400 to-secondary-600',
  },
  {
    id: '3',
    name: 'Roberto Souza',
    specialty: 'Barbeiro',
    initials: 'RS',
    commission: 35,
    revenueGoal: 10000,
    currentRevenue: 7650,
    appointments: 86,
    rating: 4.8,
    schedule: { seg: '10:00-19:00', ter: '10:00-19:00', qua: '10:00-19:00', qui: '10:00-19:00', sex: '10:00-19:00' },
    color: 'from-accent-400 to-accent-600',
  },
];

export default function ProfessionalsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profissionais</h2>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_PROFESSIONALS.length} profissionais cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25">
          <Plus className="w-4 h-4" />
          Novo profissional
        </button>
      </div>

      {/* Professional Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROFESSIONALS.map((prof) => {
          const goalPercent = Math.round((prof.currentRevenue / prof.revenueGoal) * 100);
          return (
            <div key={prof.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Card header */}
              <div className={`bg-gradient-to-r ${prof.color} p-5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-lg font-bold">
                      {prof.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{prof.name}</h3>
                      <p className="text-white/80 text-sm">{prof.specialty}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="p-5 space-y-4">
                {/* Revenue goal */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Meta de receita</span>
                    <span className="font-bold text-gray-900">{goalPercent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${prof.color} rounded-full transition-all`}
                      style={{ width: `${Math.min(goalPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    R${prof.currentRevenue.toLocaleString()} / R${prof.revenueGoal.toLocaleString()}
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <Calendar className="w-4 h-4 text-primary-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{prof.appointments}</p>
                    <p className="text-xs text-gray-400">Agendam.</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <DollarSign className="w-4 h-4 text-accent-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{prof.commission}%</p>
                    <p className="text-xs text-gray-400">Comissão</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900">{prof.rating}</p>
                    <p className="text-xs text-gray-400">Avaliação</p>
                  </div>
                </div>

                {/* Schedule summary */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Horários</p>
                  <div className="flex gap-1">
                    {Object.entries(prof.schedule).map(([day, hours]) => (
                      <div key={day} className="flex-1 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase">{day}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{hours.split('-')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <Clock className="w-4 h-4" />
                    Horários
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
