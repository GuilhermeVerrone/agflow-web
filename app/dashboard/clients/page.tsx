'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Filter,
  ChevronDown,
  Eye,
} from 'lucide-react';

// Mock clients data
const MOCK_CLIENTS = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1111', visits: 12, lastVisit: '2026-02-15', totalSpent: 1560, rating: 'VIP', status: 'active' },
  { id: '2', name: 'Ana Paula Costa', email: 'ana@email.com', phone: '(11) 99999-2222', visits: 8, lastVisit: '2026-02-10', totalSpent: 980, rating: 'frequent', status: 'active' },
  { id: '3', name: 'Juliana Rodrigues', email: 'juliana@email.com', phone: '(11) 99999-3333', visits: 5, lastVisit: '2026-01-28', totalSpent: 650, rating: 'regular', status: 'active' },
  { id: '4', name: 'Fernanda Lima', email: 'fernanda@email.com', phone: '(11) 99999-4444', visits: 15, lastVisit: '2026-02-17', totalSpent: 2100, rating: 'VIP', status: 'active' },
  { id: '5', name: 'Camila Santos', email: 'camila@email.com', phone: '(11) 99999-5555', visits: 3, lastVisit: '2025-12-20', totalSpent: 270, rating: 'inactive', status: 'inactive' },
  { id: '6', name: 'Roberto Almeida', email: 'roberto@email.com', phone: '(11) 99999-6666', visits: 20, lastVisit: '2026-02-16', totalSpent: 2800, rating: 'VIP', status: 'active' },
  { id: '7', name: 'Lucas Mendes', email: 'lucas@email.com', phone: '(11) 99999-7777', visits: 2, lastVisit: '2025-11-15', totalSpent: 130, rating: 'inactive', status: 'inactive' },
  { id: '8', name: 'Patricia Oliveira', email: 'patricia@email.com', phone: '(11) 99999-8888', visits: 7, lastVisit: '2026-02-12', totalSpent: 875, rating: 'frequent', status: 'active' },
];

const RATING_BADGES: Record<string, { label: string; color: string }> = {
  VIP: { label: 'VIP', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  frequent: { label: 'Frequente', color: 'bg-accent-50 text-accent-700 border-accent-200' },
  regular: { label: 'Regular', color: 'bg-primary-50 text-primary-700 border-primary-200' },
  inactive: { label: 'Inativo', color: 'bg-red-50 text-red-600 border-red-200' },
};

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filteredClients = MOCK_CLIENTS.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.rating === filter || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_CLIENTS.length} clientes cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25">
          <Plus className="w-4 h-4" />
          Novo cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{MOCK_CLIENTS.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Ativos</p>
          <p className="text-2xl font-bold text-accent-600 mt-1">{MOCK_CLIENTS.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Inativos</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{MOCK_CLIENTS.filter(c => c.status === 'inactive').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Ticket médio</p>
          <p className="text-2xl font-bold text-primary-600 mt-1">
            R${(MOCK_CLIENTS.reduce((sum, c) => sum + c.totalSpent / c.visits, 0) / MOCK_CLIENTS.length).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Buscar por nome ou e-mail..."
          />
        </div>
        <div className="flex gap-2">
          {['all', 'VIP', 'frequent', 'inactive'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                filter === f
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'VIP' ? 'VIP' : f === 'frequent' ? 'Frequentes' : 'Inativos'}
            </button>
          ))}
        </div>
      </div>

      {/* Clients table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-5 py-3">Contato</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-5 py-3">Visitas</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-5 py-3">Total gasto</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-5 py-3">Classificação</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => {
                const badge = RATING_BADGES[client.rating];
                return (
                  <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{client.name}</p>
                          <p className="text-xs text-gray-400">Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <p className="text-xs text-gray-400">{client.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900">{client.visits}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-bold text-gray-900">R${client.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-lg border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="WhatsApp">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition-colors" title="Ver detalhes">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Mais opções">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
