'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Clock,
  DollarSign,
  Edit,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';

const MOCK_SERVICES = [
  { id: '1', name: 'Corte Masculino', price: 45, duration: 30, interval: 10, active: true, bookings: 142 },
  { id: '2', name: 'Corte + Barba', price: 65, duration: 45, interval: 10, active: true, bookings: 98 },
  { id: '3', name: 'Barba', price: 30, duration: 20, interval: 5, active: true, bookings: 76 },
  { id: '4', name: 'Corte Infantil', price: 35, duration: 25, interval: 10, active: true, bookings: 45 },
  { id: '5', name: 'Hidratação', price: 50, duration: 40, interval: 10, active: true, bookings: 34 },
  { id: '6', name: 'Coloração', price: 120, duration: 90, interval: 15, active: false, bookings: 12 },
  { id: '7', name: 'Progressiva', price: 180, duration: 120, interval: 15, active: false, bookings: 8 },
];

export default function ServicesPage() {
  const [services, setServices] = useState(MOCK_SERVICES);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = (id: string) => {
    setServices(services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Serviços</h2>
          <p className="text-sm text-gray-500 mt-0.5">{services.filter(s => s.active).length} serviços ativos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-4 h-4" />
          Novo serviço
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Buscar serviço..."
        />
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-2xl border p-5 transition-all ${
              service.active ? 'border-gray-100 hover:shadow-md' : 'border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{service.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{service.bookings} agendamentos</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(service.id)}
                  className={`p-1 rounded-lg transition-colors ${
                    service.active ? 'text-accent-500 hover:bg-accent-50' : 'text-gray-300 hover:bg-gray-50'
                  }`}
                  title={service.active ? 'Desativar' : 'Ativar'}
                >
                  {service.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
                <button className="p-1 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-500">
                <DollarSign className="w-4 h-4 text-accent-500" />
                <span className="font-semibold text-gray-900">R${service.price}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>{service.duration}min</span>
              </div>
              {service.interval > 0 && (
                <span className="text-xs text-gray-400">+{service.interval}min intervalo</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <Edit className="w-3.5 h-3.5" />
                Editar
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors min-h-[180px]"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Adicionar serviço</span>
        </button>
      </div>
    </div>
  );
}
