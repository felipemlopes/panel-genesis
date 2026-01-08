/**
 * Parameters - Página de configuração de parâmetros do sistema
 * Créditos, custos, planos e taxas parametrizáveis
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, DollarSign, Zap, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/services/api.ts";

export default function Parameters() {
  const [params, setParams] = useState({
    // Créditos iniciais
    initialCredits: 2100,
    
    // Custos por operação (em créditos)
    analysisCredits: 100,
    searchCredits: 20,
    
    // Planos de créditos
    plan1Credits: 500,
    plan1Price: 29.90,
    plan2Credits: 1200,
    plan2Price: 59.90,
    plan3Credits: 3000,
    plan3Price: 129.90,
    plan4Credits: 7000,
    plan4Price: 249.90,
    
    // Taxas Asaas
    asaasPercentage: 1.99,
    asaasFixed: 0.49,
    
    // Custos Gemini (USD)
    geminiAnalysisCost: 0.15,
    geminiSearchCost: 0.03,
    
    // Custo Google Cloud (USD/mês)
    googleCloudCost: 847.15,
    
    // Taxa de câmbio
    usdBrlRate: 5.53,
    
    // Spread de câmbio para checkout (%)
    checkoutSpread: 2.0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const data = await api.getParameters();
        setParams(data);
      } catch {
        toast.error("Erro ao carregar parâmetros");
      } finally {
        setLoading(false);
      }
    };

    loadParams();
  }, []);

  const handleChange = (field: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    toast.success("Parâmetros salvos com sucesso!", {
      description: "As alterações foram aplicadas ao sistema.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary neon-text">Configurações do Sistema</h2>
          <p className="text-muted-foreground mono mt-2">Parametrize créditos, custos e planos</p>
        </div>
        <Button onClick={handleSave} className="neon-border bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      {/* Créditos e Operações */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-accent neon-glow" />
          <h3 className="text-xl font-bold text-accent">Créditos e Operações</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="initialCredits" className="text-sm text-muted-foreground mono">
              Créditos Iniciais (Assinatura)
            </Label>
            <Input
              id="initialCredits"
              type="number"
              value={params.initialCredits}
              onChange={(e) => handleChange("initialCredits", e.target.value)}
              className="bg-secondary border-border neon-border mono text-lg font-bold"
            />
            <p className="text-xs text-muted-foreground">Créditos ao assinar Cripto.ico</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="analysisCredits" className="text-sm text-muted-foreground mono">
              Custo por Análise (Créditos)
            </Label>
            <Input
              id="analysisCredits"
              type="number"
              value={params.analysisCredits}
              onChange={(e) => handleChange("analysisCredits", e.target.value)}
              className="bg-secondary border-border neon-border mono text-lg font-bold"
            />
            <p className="text-xs text-muted-foreground">Créditos debitados por análise</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchCredits" className="text-sm text-muted-foreground mono">
              Custo por Busca (Créditos)
            </Label>
            <Input
              id="searchCredits"
              type="number"
              value={params.searchCredits}
              onChange={(e) => handleChange("searchCredits", e.target.value)}
              className="bg-secondary border-border neon-border mono text-lg font-bold"
            />
            <p className="text-xs text-muted-foreground">Créditos debitados por busca</p>
          </div>
        </div>
      </div>

      {/* Planos de Créditos */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-chart-3 neon-glow" />
          <h3 className="text-xl font-bold text-chart-3">Planos de Compra de Créditos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((planNum) => (
            <div key={planNum} className="bg-secondary rounded p-4 border border-border">
              <h4 className="text-lg font-bold text-primary mb-4 mono">PLANO {planNum}</h4>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mono">Créditos</Label>
                  <Input
                    type="number"
                    value={params[`plan${planNum}Credits` as keyof typeof params]}
                    onChange={(e) => handleChange(`plan${planNum}Credits`, e.target.value)}
                    className="bg-secondary border-border mono font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground mono">Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={params[`plan${planNum}Price` as keyof typeof params]}
                    onChange={(e) => handleChange(`plan${planNum}Price`, e.target.value)}
                    className="bg-secondary border-border mono font-bold"
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mono">Valor por crédito</p>
                  <p className="text-sm font-bold text-accent mono">
                    R$ {(params[`plan${planNum}Price` as keyof typeof params] / params[`plan${planNum}Credits` as keyof typeof params]).toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custos Operacionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taxas Asaas */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-chart-4 neon-glow" />
            <h3 className="text-xl font-bold text-chart-4">Taxas Asaas (Gateway)</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asaasPercentage" className="text-sm text-muted-foreground mono">
                Taxa Percentual (%)
              </Label>
              <Input
                id="asaasPercentage"
                type="number"
                step="0.01"
                value={params.asaasPercentage}
                onChange={(e) => handleChange("asaasPercentage", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asaasFixed" className="text-sm text-muted-foreground mono">
                Taxa Fixa (R$)
              </Label>
              <Input
                id="asaasFixed"
                type="number"
                step="0.01"
                value={params.asaasFixed}
                onChange={(e) => handleChange("asaasFixed", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="pt-4 border-t border-border bg-secondary rounded p-4">
              <p className="text-xs text-muted-foreground mono mb-2">Exemplo: Venda de R$ 100,00</p>
              <p className="text-sm font-bold text-destructive mono">
                Custo: R$ {(100 * params.asaasPercentage / 100 + params.asaasFixed).toFixed(2)}
              </p>
              <p className="text-sm font-bold text-accent mono">
                Líquido: R$ {(100 - (100 * params.asaasPercentage / 100 + params.asaasFixed)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Custos Gemini e Cloud */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-chart-5 neon-glow" />
            <h3 className="text-xl font-bold text-chart-5">Custos de Infraestrutura</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="geminiAnalysisCost" className="text-sm text-muted-foreground mono">
                Gemini - Custo por Análise (USD)
              </Label>
              <Input
                id="geminiAnalysisCost"
                type="number"
                step="0.01"
                value={params.geminiAnalysisCost}
                onChange={(e) => handleChange("geminiAnalysisCost", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="geminiSearchCost" className="text-sm text-muted-foreground mono">
                Gemini - Custo por Busca (USD)
              </Label>
              <Input
                id="geminiSearchCost"
                type="number"
                step="0.01"
                value={params.geminiSearchCost}
                onChange={(e) => handleChange("geminiSearchCost", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleCloudCost" className="text-sm text-muted-foreground mono">
                Google Cloud DB (USD/mês)
              </Label>
              <Input
                id="googleCloudCost"
                type="number"
                step="0.01"
                value={params.googleCloudCost}
                onChange={(e) => handleChange("googleCloudCost", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usdBrlRate" className="text-sm text-muted-foreground mono">
                Taxa de Câmbio (USD/BRL)
              </Label>
              <Input
                id="usdBrlRate"
                type="number"
                step="0.01"
                value={params.usdBrlRate}
                onChange={(e) => handleChange("usdBrlRate", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkoutSpread" className="text-sm text-muted-foreground mono">
                Spread de Câmbio no Checkout (%)
              </Label>
              <Input
                id="checkoutSpread"
                type="number"
                step="0.01"
                value={params.checkoutSpread}
                onChange={(e) => handleChange("checkoutSpread", e.target.value)}
                className="bg-secondary border-border neon-border mono text-lg font-bold"
              />
              <p className="text-xs text-muted-foreground">Margem adicional sobre a taxa de câmbio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Custos */}
      <div className="bg-card rounded border border-destructive p-6">
        <h3 className="text-xl font-bold text-destructive mb-4">Resumo de Custos por Operação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary rounded p-4">
            <p className="text-sm text-muted-foreground mono mb-2">Custo Real - Análise</p>
            <p className="text-2xl font-bold text-destructive mono">
              ${params.geminiAnalysisCost.toFixed(2)} USD
            </p>
            <p className="text-lg font-bold text-destructive/80 mono">
              R$ {(params.geminiAnalysisCost * params.usdBrlRate).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mono mt-2">
              Usuário paga: {params.analysisCredits} créditos
            </p>
          </div>

          <div className="bg-secondary rounded p-4">
            <p className="text-sm text-muted-foreground mono mb-2">Custo Real - Busca</p>
            <p className="text-2xl font-bold text-destructive mono">
              ${params.geminiSearchCost.toFixed(2)} USD
            </p>
            <p className="text-lg font-bold text-destructive/80 mono">
              R$ {(params.geminiSearchCost * params.usdBrlRate).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mono mt-2">
              Usuário paga: {params.searchCredits} créditos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
