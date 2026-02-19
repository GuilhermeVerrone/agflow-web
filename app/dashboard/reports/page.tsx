'use client';

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  CalendarDays,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';

// Mock data
const MONTHLY_REVENUE = [
  { month: 'Set', value: 8200 },
  { month: 'Out', value: 9500 },
  { month: 'Nov', value: 10200 },
  { month: 'Dez', value: 11800 },
  { month: 'Jan', value: 10500 },
  { month: 'Fev', value: 12450 },
];

const PROFESSIONAL_REVENUE = [
  { name: 'Carlos Silva', revenue: 5200, percentage: 42 },
  { name: 'André Lima', revenue: 4100, percentage: 33 },
  { name: 'Roberto Souza', revenue: 3150, percentage: 25 },
];

const TOP_SERVICES = [
  { name: 'Corte Masculino', count: 85, revenue: 3825 },
  { name: 'Corte + Barba', count: 52, revenue: 3380 },
  { name: 'Barba', count: 41, revenue: 1230 },
  { name: 'Hidratação', count: 28, revenue: 1400 },
  { name: 'Corte Infantil', count: 24, revenue: 840 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((m) => m.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-sm text-gray-500 mt-0.5">Visão geral do desempenho</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  period === p ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Receita total', value: 'R$ 12.450', change: '+18%', positive: true, icon: DollarSign, color: 'bg-accent-100 text-accent-600' },
          { label: 'Total agendamentos', value: '230', change: '+12%', positive: true, icon: CalendarDays, color: 'bg-primary-100 text-primary-600' },
          { label: 'Taxa de no-show', value: '3.2%', change: '-1.5%', positive: true, icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
          { label: 'Taxa de retenção', value: '87%', change: '+4%', positive: true, icon: Users, color: 'bg-secondary-100 text-secondary-600' },
        ].map((metric, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${metric.color} rounded-xl flex items-center justify-center`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${metric.positive ? 'text-accent-600' : 'text-red-500'}`}>
                {metric.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Receita por período</h3>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          {/* Simple bar chart */}
          <div className="flex items-end gap-3 h-48">
            {MONTHLY_REVENUE.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-900">
                  R${(m.value / 1000).toFixed(1)}k
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    i === MONTHLY_REVENUE.length - 1
                      ? 'bg-gradient-to-t from-primary-500 to-primary-400'
                      : 'bg-gray-100'
                  }`}
                  style={{ height: `${(m.value / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by professional */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900 mb-6">Receita por profissional</h3>
          <div className="space-y-4">
            {PROFESSIONAL_REVENUE.map((prof, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-900">{prof.name}</span>
                  <span className="text-gray-500">R${prof.revenue.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                    style={{ width: `${prof.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{prof.percentage}% do total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top services */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-900 mb-5">Serviços mais vendidos</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">#</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-3">Serviço</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase pb-3">Agendamentos</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-3">Receita</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-3">Share</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SERVICES.map((service, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{service.name}</td>
                  <td className="py-3 text-sm text-center text-gray-600">{service.count}</td>
                  <td className="py-3 text-sm text-right font-medium text-gray-900">R${service.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
                          style={{ width: `${(service.revenue / TOP_SERVICES[0].revenue) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">
                        {Math.round((service.revenue / TOP_SERVICES.reduce((s, t) => s + t.revenue, 0)) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
