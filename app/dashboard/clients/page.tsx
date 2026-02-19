'use client';

import { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Loader2,
  X,
  User,
  Mail,
  Phone,
  Edit2,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';
import {
  useClients,
  useClientStats,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/hooks';
import { Client, ClientClassification } from '@/types';
import { CreateClientRequest, UpdateClientRequest } from '@/services';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Classification Badges ────────────────────────────────────────────────────
const CLASSIFICATION_BADGES: Record<ClientClassification, { label: string; color: string }> = {
  NEW: { label: 'Novo', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  RECURRING: { label: 'Frequente', color: 'bg-accent-50 text-accent-700 border-accent-200' },
  VIP: { label: 'VIP', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  AT_RISK: { label: 'Em risco', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  INACTIVE: { label: 'Inativo', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  LOST: { label: 'Perdido', color: 'bg-red-50 text-red-600 border-red-200' },
};

// ─── Form ─────────────────────────────────────────────────────────────────────
interface ClientFormProps {
  initial?: Client;
  onClose: () => void;
  onSave: (data: CreateClientRequest | UpdateClientRequest) => Promise<void>;
  loading: boolean;
}

function ClientForm({ initial, onClose, onSave, loading }: ClientFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{initial ? 'Editar cliente' : 'Novo cliente'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                placeholder="Ex: Maria Silva"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                placeholder="(11) 99999-0000"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initial ? 'Salvar' : 'Criar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ name, onClose, onConfirm, loading }: { name: string; onClose: () => void; onConfirm: () => Promise<void>; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Remover cliente?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Tem certeza que deseja remover <span className="font-medium text-gray-700">{name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<ClientClassification | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useClients({
    search: search || undefined,
    classification: classificationFilter !== 'all' ? classificationFilter : undefined,
  });
  const { data: stats } = useClientStats();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const handleCreate = async (data: CreateClientRequest | UpdateClientRequest) => {
    await createClient.mutateAsync(data as CreateClientRequest);
    setShowForm(false);
  };

  const handleUpdate = async (data: CreateClientRequest | UpdateClientRequest) => {
    if (!editingClient) return;
    await updateClient.mutateAsync({ id: editingClient.id, data });
    setEditingClient(null);
  };

  const handleDelete = async () => {
    if (!deletingClient) return;
    await deleteClient.mutateAsync(deletingClient.id);
    setDeletingClient(null);
  };

  const classificationOptions: Array<{ value: ClientClassification | 'all'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'VIP', label: 'VIP' },
    { value: 'RECURRING', label: 'Frequentes' },
    { value: 'NEW', label: 'Novos' },
    { value: 'AT_RISK', label: 'Em risco' },
    { value: 'INACTIVE', label: 'Inativos' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Carregando...' : `${clients.length} cliente${clients.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo cliente
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">Total</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(stats as Record<string, unknown>).total as number ?? clients.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <p className="text-sm text-gray-500">VIP</p>
            </div>
            <p className="text-2xl font-bold text-yellow-500">{(stats as Record<string, unknown>).vip as number ?? clients.filter(c => c.classification === 'VIP').length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent-400" />
              <p className="text-sm text-gray-500">Ticket médio</p>
            </div>
            <p className="text-2xl font-bold text-accent-600">
              R$ {clients.length > 0 ? (clients.reduce((sum, c) => sum + Number(c.averageTicket ?? 0), 0) / clients.length).toFixed(0) : '0'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary-400" />
              <p className="text-sm text-gray-500">LTV total</p>
            </div>
            <p className="text-2xl font-bold text-primary-600">
              R$ {clients.reduce((sum, c) => sum + Number(c.lifetimeValue ?? 0), 0).toFixed(0)}
            </p>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="Buscar por nome, e-mail ou telefone..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {classificationOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setClassificationFilter(opt.value as ClientClassification | 'all')}
              className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                classificationFilter === opt.value
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && clients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum cliente encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Adicione clientes ou aguarde o primeiro agendamento</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar cliente
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && clients.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden md:table-cell">Contato</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Classificação</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden lg:table-cell">Visitas</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">LTV</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden xl:table-cell">Última visita</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client) => {
                  const badge = CLASSIFICATION_BADGES[client.classification] ?? CLASSIFICATION_BADGES.NEW;
                  return (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{client.name}</p>
                            {client.email && <p className="text-xs text-gray-400 md:hidden truncate max-w-[140px]">{client.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <div className="space-y-0.5">
                          {client.email && <p className="text-sm text-gray-500 truncate max-w-[180px]">{client.email}</p>}
                          {client.phone && <p className="text-sm text-gray-400">{client.phone}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden lg:table-cell">
                        <span className="text-sm font-semibold text-gray-900">{client.totalVisits ?? 0}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                        <span className="text-sm font-bold text-accent-600">
                          R$ {Number(client.lifetimeValue ?? 0).toFixed(0)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-sm text-gray-400 hidden xl:table-cell">
                        {client.lastVisitAt ? format(parseISO(client.lastVisitAt), 'dd/MM/yyyy', { locale: ptBR }) : '–'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingClient(client)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingClient(client)}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {showForm && (
        <ClientForm
          onClose={() => setShowForm(false)}
          onSave={handleCreate}
          loading={createClient.isPending}
        />
      )}

      {editingClient && (
        <ClientForm
          initial={editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleUpdate}
          loading={updateClient.isPending}
        />
      )}

      {deletingClient && (
        <DeleteConfirm
          name={deletingClient.name}
          onClose={() => setDeletingClient(null)}
          onConfirm={handleDelete}
          loading={deleteClient.isPending}
        />
      )}
    </div>
  );
}
