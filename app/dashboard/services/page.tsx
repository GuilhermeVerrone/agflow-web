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
  Clock,
  DollarSign,
  Tag,
  AlertTriangle,
  Scissors,
} from 'lucide-react';
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/hooks';
import { ServiceCatalog } from '@/types';
import { CreateServiceRequest, UpdateServiceRequest } from '@/services';

// ─── Form ─────────────────────────────────────────────────────────────────────
interface ServiceFormProps {
  initial?: ServiceCatalog;
  onClose: () => void;
  onSave: (data: CreateServiceRequest | UpdateServiceRequest) => Promise<void>;
  loading: boolean;
}

function ServiceForm({ initial, onClose, onSave, loading }: ServiceFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    duration: initial?.duration ?? 30,
    price: initial?.price ?? 0,
    category: initial?.category ?? '',
    imageUrl: initial?.imageUrl ?? '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      duration: Number(form.duration),
      price: Number(form.price),
      category: form.category.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{initial ? 'Editar serviço' : 'Novo serviço'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="Ex: Corte Masculino"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
              placeholder="Breve descrição do serviço..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Clock className="w-3.5 h-3.5 inline mr-1" />Duração (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => setForm(f => ({ ...f, duration: +e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 inline mr-0.5" />Preço (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm(f => ({ ...f, price: +e.target.value }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <Tag className="w-3.5 h-3.5 inline mr-1" />Categoria
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="Ex: Cortes, Barba, Tratamentos..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">URL da imagem</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="https://..."
            />
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
              {initial ? 'Salvar' : 'Criar serviço'}
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">Remover serviço?</h3>
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
export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ServiceCatalog | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceCatalog | null>(null);

  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.category ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: CreateServiceRequest | UpdateServiceRequest) => {
    await createService.mutateAsync(data as CreateServiceRequest);
    setShowForm(false);
  };

  const handleUpdate = async (data: CreateServiceRequest | UpdateServiceRequest) => {
    if (!editingService) return;
    await updateService.mutateAsync({ id: editingService.id, data });
    setEditingService(null);
  };

  const handleToggleActive = (svc: ServiceCatalog) => {
    updateService.mutate({ id: svc.id, data: { isActive: !svc.isActive } });
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    await deleteService.mutateAsync(deletingService.id);
    setDeletingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Serviços</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLoading ? 'Carregando...' : `${services.filter(s => s.isActive).length} serviços ativos`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo serviço
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Buscar serviço ou categoria..."
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
            <Scissors className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Nenhum serviço encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Adicione serviços para começar a receber agendamentos</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar serviço
          </button>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((svc) => (
            <div
              key={svc.id}
              className={`bg-white rounded-2xl border p-5 transition-all ${
                svc.isActive ? 'border-gray-100 hover:shadow-md' : 'border-gray-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="font-bold text-gray-900 truncate">{svc.name}</h3>
                  {svc.category && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mt-1">
                      <Tag className="w-3 h-3" />{svc.category}
                    </span>
                  )}
                  {svc.description && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{svc.description}</p>}
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    svc.isActive ? 'bg-accent-50 text-accent-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {svc.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Clock className="w-4 h-4 text-primary-400" />
                  {svc.duration}min
                </div>
                <div className="flex items-center gap-1 font-bold text-accent-600">
                  <DollarSign className="w-4 h-4" />
                  R$ {Number(svc.price).toFixed(2).replace('.', ',')}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleToggleActive(svc)}
                  disabled={updateService.isPending}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                    svc.isActive ? 'text-accent-600 hover:bg-accent-50' : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {svc.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {svc.isActive ? 'Ativo' : 'Inativo'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setEditingService(svc)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingService(svc)}
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
        <ServiceForm
          onClose={() => setShowForm(false)}
          onSave={handleCreate}
          loading={createService.isPending}
        />
      )}

      {editingService && (
        <ServiceForm
          initial={editingService}
          onClose={() => setEditingService(null)}
          onSave={handleUpdate}
          loading={updateService.isPending}
        />
      )}

      {deletingService && (
        <DeleteConfirm
          name={deletingService.name}
          onClose={() => setDeletingService(null)}
          onConfirm={handleDelete}
          loading={deleteService.isPending}
        />
      )}
    </div>
  );
}
