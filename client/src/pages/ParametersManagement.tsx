/**
 * ParametersManagement - Configuração de parâmetros do sistema com funcionalidades reais
 * Editar e salvar todos os parâmetros operacionais
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, DollarSign, Zap, CreditCard, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCostAndExchangeData } from "@/lib/external-apis";
import { api } from "@/services/api.ts";

type Plan = {
  id: number;
  name: string;
  price: number;
  price_per_credit: number;
  credits: number;
};

export default function ParametersManagement() {
  const [params, setParams] = useState({
    // Créditos iniciais
    initialCredits: 0,
    // Custos por operação (em créditos)
    analysisCredits: 0,
    searchCredits: 0,
    // Taxas Asaas
    asaasPercentage: 1.99,
    asaasFixed: 0.49,
    // Custos Gemini (USD)
    geminiAnalysisCost: 0.00,
    geminiSearchCost: 0.00,
    // Custo Google Cloud (USD/mês)
    googleCloudCost: 0.00,
    // Taxa de câmbio
    usdBrlRate: 5.53,
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoadingExternalData, setIsLoadingExternalData] = useState(false);

  // Carrega dados externos ao montar o componente
  useEffect(() => {
    loadExternalData();
    loadParams();
    loadPlans();
  }, []);

  const loadParams = async () => {
    try {
      const data = await api.getParameters();
      console.log(data.data);
      setParams(data.data);
    } catch {
      toast.error("Erro ao carregar parâmetros");
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      const data = await api.getPlans();
      console.log(data.data);
      setPlans(data.data);
    } catch {
      toast.error("Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  };

  const loadExternalData = async () => {
    setIsLoadingExternalData(true);
    try {
      const data = await getCostAndExchangeData();
      setParams(prev => ({
        ...prev,
        googleCloudCost: data.googleCloudCost.monthlyCost,
        usdBrlRate: data.exchangeRate.rate
      }));
      toast.success("Dados externos atualizados!", {
        description: `Taxa de câmbio: R$ ${data.exchangeRate.rate.toFixed(2)} | Google Cloud: $${data.googleCloudCost.monthlyCost.toFixed(2)}`
      });
    } catch (error) {
      console.error('Erro ao carregar dados externos:', error);
      toast.error("Erro ao carregar dados externos");
    } finally {
      setIsLoadingExternalData(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
    setHasChanges(true);
  };

  const handleUpdatePlan = async (planId: number, data: Partial<Plan>) => {
    try {
      await api.post(`/plans/${planId}`, data);
      toast.success("Plano atualizado com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar plano");
    }
  };

  const updatePlanField = (
    planId: number,
    field: keyof Plan,
    value: number
  ) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    );
  };

  const handleSave = async () => {
    try {
      await api.post(`/settings`, params);
      toast.success("Parâmetros salvos com sucesso!", {
        description: "As alterações foram aplicadas ao sistema.",
      });
    } catch (error) {
      toast.error("Erro ao atualizar parâmetros");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Configurações do Sistema</h2>
          <p className="text-sm text-muted-foreground mt-1">Parametrize créditos, custos e planos</p>
        </div>
        <div className="flex items-center gap-3">
          {/*
          <Button onClick={handleReset} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          */}
          <Button 
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="credits" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="credits">Créditos</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="costs">Custos</TabsTrigger>
          <TabsTrigger value="fees">Taxas</TabsTrigger>
        </TabsList>

        {/* Tab: Créditos e Operações */}
        <TabsContent value="credits" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">Créditos e Operações</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="initialCredits" className="text-sm text-muted-foreground">
                  Créditos Iniciais (Assinatura)
                </Label>
                <Input
                  id="initialCredits"
                  type="number"
                  value={params.initialCredits}
                  onChange={(e) => handleChange("initialCredits", e.target.value)}
                  className="bg-secondary border-border text-base font-semibold"
                />
                <p className="text-xs text-muted-foreground">Créditos ao assinar Cripto.ico</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysisCredits" className="text-sm text-muted-foreground">
                  Custo por Análise (Créditos)
                </Label>
                <Input
                  id="analysisCredits"
                  type="number"
                  value={params.analysisCredits}
                  onChange={(e) => handleChange("analysisCredits", e.target.value)}
                  className="bg-secondary border-border text-base font-semibold"
                />
                <p className="text-xs text-muted-foreground">Créditos debitados por análise</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="searchCredits" className="text-sm text-muted-foreground">
                  Custo por Busca (Créditos)
                </Label>
                <Input
                  id="searchCredits"
                  type="number"
                  value={params.searchCredits}
                  onChange={(e) => handleChange("searchCredits", e.target.value)}
                  className="bg-secondary border-border text-base font-semibold"
                />
                <p className="text-xs text-muted-foreground">Créditos debitados por busca</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded border border-border">
              <h4 className="text-sm font-medium mb-2">Simulação</h4>
              <p className="text-xs text-muted-foreground">
                Com {params.initialCredits} créditos iniciais, o usuário pode realizar:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center p-3 bg-card rounded">
                  <p className="text-2xl font-bold text-chart-3">{Math.floor(params.initialCredits / params.analysisCredits)}</p>
                  <p className="text-xs text-muted-foreground">Análises</p>
                </div>
                <div className="text-center p-3 bg-card rounded">
                  <p className="text-2xl font-bold text-accent">{Math.floor(params.initialCredits / params.searchCredits)}</p>
                  <p className="text-xs text-muted-foreground">Buscas</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Planos de Créditos */}
        <TabsContent value="plans" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-chart-3" />
              <h3 className="text-lg font-semibold text-foreground">
                Planos de Compra de Créditos
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-secondary/50 rounded-lg p-5 border border-border"
                >
                  <h4 className="text-base font-semibold text-primary mb-4">
                    {plan.name}
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Créditos
                      </Label>
                      <Input
                        type="number"
                        value={plan.credits}
                        className="bg-secondary border-border font-semibold"
                        onChange={(e) =>
                          updatePlanField(plan.id, "credits", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Preço (USD)
                      </Label>
                      <Input
                        type="number"
                        value={plan.price}
                        className="bg-secondary border-border font-semibold"
                        onChange={(e) =>
                          updatePlanField(plan.id, "price", Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="pt-3 border-t border-border space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Valor por crédito
                        </p>
                        <p className="text-base font-bold text-accent">
                          ${plan.price_per_credit.toFixed(4)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Em Reais (informativo)
                        </p>
                        <p className="text-sm text-gray-500">
                          R$ {(plan.price * params.usdBrlRate).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpdatePlan(plan.id, {
                          price: plan.price,
                          credits: plan.credits,
                        })
                      }
                    >
                      Atualizar plano
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Custos de Infraestrutura */}
        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-5 h-5 text-chart-4" />
                <h3 className="text-lg font-semibold text-foreground">Custos Gemini 3.0</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="geminiAnalysisCost" className="text-sm text-muted-foreground">
                    Custo por Análise (USD)
                  </Label>
                  <Input
                    id="geminiAnalysisCost"
                    type="number"
                    step="0.01"
                    value={params.geminiAnalysisCost}
                    onChange={(e) => handleChange("geminiAnalysisCost", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="geminiSearchCost" className="text-sm text-muted-foreground">
                    Custo por Busca (USD)
                  </Label>
                  <Input
                    id="geminiSearchCost"
                    type="number"
                    step="0.01"
                    value={params.geminiSearchCost}
                    onChange={(e) => handleChange("geminiSearchCost", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                  />
                </div>

                <div className="pt-4 border-t border-border bg-secondary/50 rounded p-4">
                  <p className="text-xs text-muted-foreground mb-2">Custo Real por Operação</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Análise:</span>
                      <span className="text-sm font-bold text-destructive">
                        {/*${params.geminiAnalysisCost.toFixed(2)} (R$ {(params.geminiAnalysisCost * params.usdBrlRate).toFixed(2)})*/}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Busca:</span>
                      <span className="text-sm font-bold text-destructive">
                        {/*${params.geminiSearchCost.toFixed(2)} (R$ {(params.geminiSearchCost * params.usdBrlRate).toFixed(2)})*/}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-5 h-5 text-chart-5" />
                <h3 className="text-lg font-semibold text-foreground">Outros Custos</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="googleCloudCost" className="text-sm text-muted-foreground">
                      Google Cloud DB (USD/mês)
                    </Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={loadExternalData}
                      disabled={isLoadingExternalData}
                      className="h-6 px-2 text-xs"
                    >
                      {isLoadingExternalData ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 mr-1" />
                      )}
                      Atualizar
                    </Button>
                  </div>
                  <Input
                    id="googleCloudCost"
                    type="number"
                    step="0.01"
                    value={params.googleCloudCost}
                    onChange={(e) => handleChange("googleCloudCost", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                    disabled={isLoadingExternalData}
                  />
                  <p className="text-xs text-gray-600 mt-1">Atualizado automaticamente da API do Google Cloud</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usdBrlRate" className="text-sm text-muted-foreground">
                    Taxa de Câmbio (USD/BRL)
                  </Label>
                  <Input
                    id="usdBrlRate"
                    type="number"
                    step="0.01"
                    value={params.usdBrlRate}
                    onChange={(e) => handleChange("usdBrlRate", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                    disabled={isLoadingExternalData}
                  />
                  <p className="text-xs text-gray-600 mt-1">Atualizado automaticamente do Banco Central do Brasil</p>
                </div>

                <div className="pt-4 border-t border-border bg-secondary/50 rounded p-4">
                  <p className="text-xs text-muted-foreground mb-2">Custo Mensal Google Cloud</p>
                  <p className="text-2xl font-bold text-destructive">
                    R$ {(params.googleCloudCost * params.usdBrlRate).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Taxas de Pagamento */}
        <TabsContent value="fees" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-chart-4" />
              <h3 className="text-lg font-semibold text-foreground">Taxas Asaas (Gateway)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="asaasPercentage" className="text-sm text-muted-foreground">
                    Taxa Percentual (%)
                  </Label>
                  <Input
                    id="asaasPercentage"
                    type="number"
                    step="0.01"
                    value={params.asaasPercentage}
                    onChange={(e) => handleChange("asaasPercentage", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="asaasFixed" className="text-sm text-muted-foreground">
                    Taxa Fixa (R$)
                  </Label>
                  <Input
                    id="asaasFixed"
                    type="number"
                    step="0.01"
                    value={params.asaasFixed}
                    onChange={(e) => handleChange("asaasFixed", e.target.value)}
                    className="bg-secondary border-border text-base font-semibold"
                  />
                </div>
              </div>

              <div className="bg-secondary/50 rounded p-6 border border-border">
                <h4 className="text-sm font-medium mb-4">Simulador de Taxas</h4>
                {[50, 100, 200, 500].map((amount) => {
                  const fee = amount * params.asaasPercentage / 100 + params.asaasFixed;
                  const net = amount - fee;
                  return (
                    <div key={amount} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">R$ {amount.toFixed(2)}</span>
                      <div className="text-right">
                        <p className="text-sm font-bold text-destructive">-R$ {fee.toFixed(2)}</p>
                        <p className="text-xs text-accent">Líquido: R$ {net.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
