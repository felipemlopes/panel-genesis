/**
 * CheckoutPreview - Pré-visualização do checkout para compra de créditos
 * Design profissional igual ao Manus
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Zap, Check, Lock, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { calculatePaymentFee, createPaymentTransaction, getCheckoutConfig, getExchangeRateWithSpread } from "@/lib/asaas-service";

interface Plan {
  id: string;
  name: string;
  credits: number;
  priceUsd: number;
  popular?: boolean;
}

const PLANS: Plan[] = [
  { id: "plan_1", name: "Bronze", credits: 500, priceUsd: 5.99 },
  { id: "plan_2", name: "Prata", credits: 1200, priceUsd: 11.99 },
  { id: "plan_3", name: "Ouro", credits: 3000, priceUsd: 25.99, popular: true },
  { id: "plan_4", name: "Platina", credits: 7000, priceUsd: 49.99 },
];

interface CheckoutPreviewProps {
  userId?: number;
}

export default function CheckoutPreview({ userId = 1 }: CheckoutPreviewProps) {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>("plan_3");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "boleto">("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [exchangeData, setExchangeData] = useState<any>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const config = getCheckoutConfig();

  // Buscar taxa de câmbio ao carregar
  useEffect(() => {
    loadExchangeRate();
  }, []);

  const loadExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      const data = await getExchangeRateWithSpread();
      setExchangeData(data);
    } catch (error) {
      console.error('Erro ao buscar taxa de câmbio:', error);
      toast.error('Erro ao buscar taxa de câmbio');
    } finally {
      setIsLoadingRate(false);
    }
  };

  const plan = PLANS.find(p => p.id === selectedPlan);
  if (!plan) return null;

  // Usar taxa do API se disponível, senão usar configuração padrão
  const usdToBrlRate = exchangeData?.rate || config.usdToBrlRate;
  const priceInBrl = plan.priceUsd * usdToBrlRate;
  const { fee, total } = calculatePaymentFee(priceInBrl, paymentMethod);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const transaction = await createPaymentTransaction(
        userId,
        selectedPlan,
        total,
        paymentMethod
      );

      toast.success("Transação criada com sucesso!", {
        description: `ID: ${transaction.id}`,
      });
    } catch (error) {
      toast.error("Erro ao processar pagamento");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            VOLTAR
          </button>
          <h1 className="text-3xl font-bold text-foreground mono-label mb-2">COMPRAR CRÉDITOS</h1>
          <p className="text-xs text-gray-700">Escolha o plano ideal para suas análises</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Planos - 2 colunas */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mono-label">SELECIONE UM PLANO</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {PLANS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative p-4 rounded border cursor-pointer transition-all ${
                    selectedPlan === p.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-800 bg-card hover:border-gray-700"
                  } ${p.popular ? "ring-2 ring-blue-500/50" : ""}`}
                >
                  {p.popular && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      POPULAR
                    </div>
                  )}
                  
                    <div className="flex items-start gap-3 mb-3">
                    <RadioGroup value={selectedPlan}>
                      <RadioGroupItem value={p.id} id={p.id} className="mt-1" />
                    </RadioGroup>
                    <div className="flex-1">
                      <Label htmlFor={p.id} className="text-sm font-bold text-foreground cursor-pointer mono">
                        {p.name.toUpperCase()}
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">{p.credits.toLocaleString()} créditos</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <p className="text-lg font-bold text-foreground">
                      ${p.priceUsd.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ${(p.priceUsd / (p.credits / 100)).toFixed(4)} por análise
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo do pedido - 1 coluna */}
          <div className="bg-card border border-gray-800 rounded p-6 h-fit">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mono-label mb-4">RESUMO DO PEDIDO</p>
              

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Plano</span>
                  <span className="text-sm font-bold text-foreground">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-700">Créditos</span>
                  <span className="text-sm font-bold text-cyan-400">{plan.credits.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Subtotal (USD)</span>
                    <span className="text-sm font-bold text-foreground">${plan.priceUsd.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-700">Taxa de câmbio</span>
                    <span className="text-sm font-bold text-gray-400">R$ {usdToBrlRate.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-gray-600">Total em Reais</span>
                    <span className="text-xl font-bold text-cyan-400">R$ {priceInBrl.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Método de pagamento */}
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 mono-label mb-3">MÉTODO DE PAGAMENTO</p>
              
              <div className="space-y-2">
                {[
                  { id: "pix", name: "PIX", icon: "⚡" },
                  { id: "credit_card", name: "Cartão de Crédito", icon: "💳" },
                  { id: "boleto", name: "Boleto", icon: "📄" },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3 rounded border cursor-pointer transition-all flex items-center gap-2 ${
                      paymentMethod === method.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <RadioGroup value={paymentMethod}>
                      <RadioGroupItem value={method.id} id={`method_${method.id}`} />
                    </RadioGroup>
                    <Label htmlFor={`method_${method.id}`} className="text-xs font-semibold text-foreground cursor-pointer flex-1">
                      {method.icon} {method.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de checkout */}
            <Button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mb-3"
            >
              {isProcessing ? "Processando..." : "PROSSEGUIR PARA PAGAMENTO"}
            </Button>

            {/* Segurança */}
            <div className="flex items-center justify-center gap-1 text-xs text-gray-700">
              <Lock className="w-3 h-3" />
              <span>Pagamento seguro com Asaas</span>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-card border border-gray-800 rounded p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase text-gray-600 mono-label">Ativação Imediata</p>
                <p className="text-xs text-gray-700 mt-1">Seus créditos estarão disponíveis em segundos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-gray-800 rounded p-4">
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase text-gray-600 mono-label">Sem Compromisso</p>
                <p className="text-xs text-gray-700 mt-1">Use seus créditos quando quiser, sem prazo</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-gray-800 rounded p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase text-gray-600 mono-label">Múltiplos Métodos</p>
                <p className="text-xs text-gray-700 mt-1">PIX, Cartão ou Boleto - escolha o seu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
