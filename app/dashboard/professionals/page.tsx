'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  User,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  useProfessionals,
  useCreateProfessional,
  useUpdateProfessional,
  useDeleteProfessional,
} from '@/hooks';
import { Professional } from '@/types';
import { UpdateProfessionalRequest, CreateProfessionalRequest } from '@/services';

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
interface ProfessionalFormProps {
  initial?: Professional;
  onClose: () => void;
  onSave: (data: CreateProfessionalRequest | UpdateProfessionalRequest) => Promise<void>;
  loading: boolean;
}

function ProfessionalForm({ initial, onClose, onSave, loading }: ProfessionalFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    email: initial?.email ?? '',
    phone: initial?.phone ?? '',
    bio: initial?.bio ?? '',
    color: initial?.color ?? '#6366f1',
    slotDuration: initial?.slotDuration ?? 30,
    bufferBefore: initial?.bufferBefore ?? 0,
    bufferAfter: initial?.bufferAfter ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      bio: form.bio.trim() || undefined,
      color: form.color || undefined,
      slotDuration: Number(form.slotDuration) || undefined,
      bufferBefore: Number(form.bufferBefore) || undefined,
      bufferAfter: Number(form.bufferAfter) || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{initial ? 'Editar profissional' : 'Novo profissional'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
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
                placeholder="Ex: Carlos Silva"
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
                placeholder="profissional@email.com"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio / Especialidade</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
              placeholder="Ex: Especialista em cortes masculinos"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cor de identificação</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-sm text-gray-500 font-mono">{form.color}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                <Clock className="w-3 h-3 inline mr-1" />Slot (min)
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={form.slotDuration}
                onChange={(e) => setForm(f => ({ ...f, slotDuration: +e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Antes (min)</label>
              <input
                type="number"
                min={0}
                step={5}
                value={form.bufferBefore}
                onChange={(e) => setForm(f => ({ ...f, bufferBefore: +e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Depois (min)</label>
              <input
                type="number"
                min={0}
                step={5}
                value={form.bufferAfter}
                onChange={(e) => setForm(f => ({ ...f, bufferAfter: +e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-center outline-none focus:ring-2 focus:ring-primary-500"
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
              {initial ? 'Salvar' : 'Criar profissional'}
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Remover profissional?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Tem certeza que deseja remover <span className="font-medium text-gray-700">{name}</span>? Essa ação não pode ser desfeita.
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

export default function ProfessionalsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [deletingProfessional, setDeletingProfessional] = useState<Professional | null>(null);

  const { data: professionals = [], isLoading } = useProfessionals();
  const createProfessional = useCreateProfessional();
  const updateProfessional = useUpdateProfessional();
  const deleteProfessional = useDeleteProfessional();

  const filtered = professionals.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: CreateProfessionalRequest | UpdateProfessionalRequest) => {
    await createProfessional.mutateAsync(data as CreateProfessionalRequest);
    setShowForm(false);
  };

  const handleUpdate = async (data: CreateProfessionalRequest | UpdateProfessionalRequest) => {
    if (!editingProfessional) return;
    await updateProfessional.mutateAsync({ id: editingProfessional.id, data });
    setEditingProfessional(null);
  };

  const handleToggleActive = (prof: Professional) => {
    updateProfessional.mutate({ id: prof.id, data: { isActive: !prof.isActive } });
  };

  const handleDelete = async () => {
    if (!deletingProfessional) return;
    await deleteProfessional.mutateAsync(deletingProfessional.id);
    setDeletingProfessional(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profissionais</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Carregando...' : `${professionals.filter(p => p.isActive).length} profissionais ativos`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo profissional
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Buscar profissional..."
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum profissional encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Adicione profissionais para começar</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar profissional
          </button>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prof) => (
            <div
              key={prof.id}
              className={`bg-white rounded-2xl border p-5 transition-all ${
                prof.isActive ? 'border-gray-100 hover:shadow-md' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                {prof.avatarUrl ? (
                  <img src={prof.avatarUrl} alt={prof.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                    style={{ background: prof.color ? prof.color : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    {prof.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{prof.name}</h3>
                  {prof.bio && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{prof.bio}</p>}
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    prof.isActive ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {prof.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                {prof.email && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />{prof.email}
                  </p>
                )}
                {prof.phone && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />{prof.phone}
                  </p>
                )}
                {prof.slotDuration && (
                  <p className="text-xs text-gray-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />Slot: {prof.slotDuration}min
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleToggleActive(prof)}
                  disabled={updateProfessional.isPending}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    prof.isActive ? 'text-accent-600 hover:bg-accent-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {prof.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {prof.isActive ? 'Ativo' : 'Inativo'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setEditingProfessional(prof)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingProfessional(prof)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProfessionalForm
          onClose={() => setShowForm(false)}
          onSave={handleCreate}
          loading={createProfessional.isPending}
        />
      )}

      {editingProfessional && (
        <ProfessionalForm
          initial={editingProfessional}
          onClose={() => setEditingProfessional(null)}
          onSave={handleUpdate}
          loading={updateProfessional.isPending}
        />
      )}

      {deletingProfessional && (
        <DeleteConfirm
          name={deletingProfessional.name}
          onClose={() => setDeletingProfessional(null)}
          onConfirm={handleDelete}
          loading={deleteProfessional.isPending}
        />
      )}
    </div>
  );
}
