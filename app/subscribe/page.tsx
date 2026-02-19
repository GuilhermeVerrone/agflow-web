'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap,
  Crown,
  Diamond,
  Check,
  Lock,
  CreditCard,
  Tag,
  ArrowLeft,
  ArrowRight,
  Shield,
} from 'lucide-react';

const plans = {
  silver: {
    name: 'Silver',
    icon: Zap,
    monthlyPrice: 97,
    annualPrice: 77,
    color: 'from-gray-400 to-gray-500',
    features: ['Agenda online 24/7', 'Até 2 profissionais', 'Dashboard básico', 'Relatórios simples'],
  },
  gold: {
    name: 'Gold',
    icon: Crown,
    monthlyPrice: 197,
    annualPrice: 157,
    color: 'from-yellow-500 to-amber-500',
    features: ['Tudo do Silver', 'Até 10 profissionais', 'CRM inteligente', 'Recuperação automática', 'Pagamento antecipado'],
  },
  diamond: {
    name: 'Diamond',
    icon: Diamond,
    monthlyPrice: 397,
    annualPrice: 317,
    color: 'from-primary-500 to-secondary-500',
    features: ['Tudo do Gold', 'Profissionais ilimitados', 'WhatsApp com IA', 'Multi-unidade', 'Relatórios BI'],
  },
};

type PlanKey = keyof typeof plans;

function SubscribeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = (searchParams.get('plan') || 'gold') as PlanKey;
  
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(
    plans[planParam] ? planParam : 'gold'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'plan' | 'checkout' | 'success'>('plan');

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cpf: '',
  });

  const plan = plans[selectedPlan];
  const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
  const totalAnnual = billingCycle === 'annual' ? plan.annualPrice * 12 : null;
  const discount = couponApplied ? 0.1 : 0; // 10% discount for coupon
  const finalPrice = price * (1 - discount);

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'agflow10') {
      setCouponApplied(true);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
  };

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pagamento confirmado!
          </h1>
          <p className="text-gray-500 mb-2">
            Plano <strong>{plan.name}</strong> ativado com sucesso.
          </p>
          <p className="text-gray-500 mb-8">
            Sua empresa está sendo criada. Vamos configurar tudo em menos de 5 minutos.
          </p>
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg"
          >
            Configurar minha empresa
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">AgFlow</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === 'plan' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'plan' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <span className="text-sm font-medium hidden sm:block">Escolher plano</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === 'checkout' ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'checkout' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <span className="text-sm font-medium hidden sm:block">Pagamento</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200" />
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-400">3</div>
            <span className="text-sm font-medium hidden sm:block">Configurar</span>
          </div>
        </div>

        {step === 'plan' && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Escolha seu plano
              </h1>
              <p className="text-gray-500">7 dias grátis em todos os planos. Cancele quando quiser.</p>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
                Mensal
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  billingCycle === 'annual' ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-400'}`}>
                Anual
              </span>
              {billingCycle === 'annual' && (
                <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-full">
                  Economize 20%
                </span>
              )}
            </div>

            {/* Plan cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {(Object.keys(plans) as PlanKey[]).map((key) => {
                const p = plans[key];
                const isSelected = selectedPlan === key;
                const displayPrice = billingCycle === 'annual' ? p.annualPrice : p.monthlyPrice;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPlan(key)}
                    className={`text-left p-6 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50/50 shadow-lg'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${p.color} rounded-xl flex items-center justify-center mb-4`}>
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2 mb-4">
                      <span className="text-3xl font-extrabold text-gray-900">R${displayPrice}</span>
                      <span className="text-gray-400">/mês</span>
                    </div>
                    <ul className="space-y-2">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-accent-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('checkout')}
                className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25"
              >
                Continuar para pagamento
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Checkout form */}
            <div className="lg:col-span-3">
              <button
                onClick={() => setStep('plan')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para planos
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados de pagamento</h2>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) => updateForm('cpf', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="000.000.000-00"
                  />
                </div>

                <hr className="border-gray-100" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Número do cartão
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => updateForm('cardNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                    <input
                      type="text"
                      value={form.cardExpiry}
                      onChange={(e) => updateForm('cardExpiry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      type="text"
                      value={form.cardCvc}
                      onChange={(e) => updateForm('cardCvc', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="123"
                    />
                  </div>
                </div>

                {/* Coupon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Cupom de desconto
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                      placeholder="Digite seu cupom"
                      disabled={couponApplied}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !coupon}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {couponApplied ? 'Aplicado ✓' : 'Aplicar'}
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-sm text-accent-600 mt-1">Cupom aplicado! -10% de desconto.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                Pagamento seguro com criptografia SSL
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h3>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Plano {plan.name}</p>
                    <p className="text-sm text-gray-500">{billingCycle === 'annual' ? 'Anual' : 'Mensal'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plano {plan.name} ({billingCycle === 'annual' ? 'anual' : 'mensal'})</span>
                    <span className="text-gray-900 font-medium">R${price}/mês</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-accent-600">Cupom AGFLOW10 (-10%)</span>
                      <span className="text-accent-600 font-medium">-R${(price * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  {billingCycle === 'annual' && totalAnnual && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total anual</span>
                      <span className="text-gray-900 font-medium">R${(totalAnnual * (1 - discount)).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100 mb-4" />

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-gray-900 font-bold">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-gray-900">R${finalPrice.toFixed(2)}</span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing || !form.name || !form.email || !form.cardNumber}
                  className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    'Confirmar pagamento'
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                  <Shield className="w-4 h-4" />
                  7 dias grátis. Cancele quando quiser.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Carregando...</div>
        </div>
      }
    >
      <SubscribeContent />
    </Suspense>
  );
}
