/**
 * AsaasIntegration - Gerenciamento de integração com Asaas
 * Configuração de credenciais, webhooks e checkout
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { CreditCard, Link as LinkIcon, Settings, CheckCircle, AlertCircle, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getAsaasConfig,
  updateAsaasConfig,
  getCheckoutConfig,
  updateCheckoutConfig,
  testAsaasConnection,
  getAllTransactions,
} from "@/lib/asaas-service";
import CyberCard from "@/components/CyberCard";

export default function AsaasIntegration() {
  const [asaasConfig, setAsaasConfig] = useState(getAsaasConfig());
  const [checkoutConfig, setCheckoutConfig] = useState(getCheckoutConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connected" | "error">("idle");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [checkoutSpread, setCheckoutSpread] = useState(checkoutConfig.checkoutSpread || 2.0);
  const transactions = getAllTransactions();

  useEffect(() => {
    loadExchangeRate();
  }, []);

  const loadExchangeRate = async () => {
    setIsLoadingRate(true);
    try {
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json');
      const data = await response.json();
      if (data && data.length > 0) {
        const rate = parseFloat(data[0].valor);
        setExchangeRate(rate);
      }
    } catch (error) {
      console.error('Erro ao buscar cotacao:', error);
      toast.error('Erro ao buscar cotacao do dolar');
    } finally {
      setIsLoadingRate(false);
    }
  };

  const handleAsaasConfigChange = (field: string, value: string) => {
    const updated = { ...asaasConfig, [field]: value };
    setAsaasConfig(updated);
    updateAsaasConfig(updated);
  };

  const handleCheckoutConfigChange = (field: string, value: any) => {
    const updated = { ...checkoutConfig, [field]: value };
    setCheckoutConfig(updated);
    updateCheckoutConfig(updated);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testAsaasConnection();
      if (result.success) {
        setConnectionStatus("connected");
        toast.success("Conexão com Asaas estabelecida!", {
          description: result.message,
        });
      } else {
        setConnectionStatus("error");
        toast.error("Erro na conexão", {
          description: result.message,
        });
      }
    } catch (error) {
      setConnectionStatus("error");
      toast.error("Erro ao testar conexão");
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado para clipboard!");
  };

  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === "completed").length;
  const totalRevenue = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard
          title="TRANSAÇÕES TOTAIS"
          value={totalTransactions.toLocaleString()}
          subtitle="PAGAMENTOS PROCESSADOS"
          icon={CreditCard}
          variant="cyan"
        />
        
        <CyberCard
          title="TRANSAÇÕES CONCLUÍDAS"
          value={completedTransactions.toLocaleString()}
          subtitle="PAGAMENTOS CONFIRMADOS"
          icon={CheckCircle}
          variant="green"
        />
        
        <CyberCard
          title="RECEITA TOTAL"
          value={`R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          subtitle="EM REAIS"
          icon={CreditCard}
          variant="magenta"
        />
      </div>

      {/* Tabs de configuração */}
      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/50">
          <TabsTrigger value="credentials">Credenciais</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        {/* Tab: Credenciais */}
        <TabsContent value="credentials" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Configuração Asaas</h3>
              </div>
              <div className="flex items-center gap-2">
                {connectionStatus === "connected" && (
                  <Badge className="bg-accent text-accent-foreground">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Conectado
                  </Badge>
                )}
                {connectionStatus === "error" && (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Erro
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="environment">Ambiente</Label>
                <select
                  id="environment"
                  value={asaasConfig.environment}
                  onChange={(e) => handleAsaasConfigChange("environment", e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                >
                  <option value="sandbox">Sandbox (Testes)</option>
                  <option value="production">Production (Real)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    value={asaasConfig.apiKey}
                    onChange={(e) => handleAsaasConfigChange("apiKey", e.target.value)}
                    placeholder="sk_live_..."
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(asaasConfig.apiKey)}
                    className="px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input
                  id="webhookUrl"
                  value={asaasConfig.webhookUrl}
                  onChange={(e) => handleAsaasConfigChange("webhookUrl", e.target.value)}
                  placeholder="https://seu-dominio.com/webhook/asaas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input
                    id="cpfCnpj"
                    value={asaasConfig.cpfCnpj}
                    onChange={(e) => handleAsaasConfigChange("cpfCnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Nome da Conta</Label>
                  <Input
                    id="accountName"
                    value={asaasConfig.accountName}
                    onChange={(e) => handleAsaasConfigChange("accountName", e.target.value)}
                    placeholder="Gênesis"
                  />
                </div>
              </div>

              <Button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isTesting ? "Testando..." : "Testar Conexão"}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Checkout */}
        <TabsContent value="checkout" className="space-y-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Configuração de Checkout</h3>
            </div>

            <div className="space-y-6">
              {/* Métodos de Pagamento */}
              <div className="border-b border-border pb-6">
                <h4 className="font-semibold text-foreground mb-4">Métodos de Pagamento</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">PIX</p>
                      <p className="text-sm text-muted-foreground">Transferência instantânea</p>
                    </div>
                    <Switch
                      checked={checkoutConfig.pixEnabled}
                      onCheckedChange={(checked) =>
                        handleCheckoutConfigChange("pixEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Cartão de Crédito</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Elo</p>
                    </div>
                    <Switch
                      checked={checkoutConfig.creditCardEnabled}
                      onCheckedChange={(checked) =>
                        handleCheckoutConfigChange("creditCardEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Boleto Bancário</p>
                      <p className="text-sm text-muted-foreground">Até 3 dias úteis</p>
                    </div>
                    <Switch
                      checked={checkoutConfig.boletoEnabled}
                      onCheckedChange={(checked) =>
                        handleCheckoutConfigChange("boletoEnabled", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Taxas */}
              <div className="border-b border-border pb-6">
                <h4 className="font-semibold text-foreground mb-4">Taxas de Processamento</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pixFee">Taxa PIX (%)</Label>
                    <Input
                      id="pixFee"
                      type="number"
                      step="0.01"
                      value={checkoutConfig.pixFee}
                      onChange={(e) =>
                        handleCheckoutConfigChange("pixFee", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="creditCardFee">Taxa Cartão (%)</Label>
                    <Input
                      id="creditCardFee"
                      type="number"
                      step="0.01"
                      value={checkoutConfig.creditCardFee}
                      onChange={(e) =>
                        handleCheckoutConfigChange("creditCardFee", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="boletoFee">Taxa Boleto (%)</Label>
                    <Input
                      id="boletoFee"
                      type="number"
                      step="0.01"
                      value={checkoutConfig.boletoFee}
                      onChange={(e) =>
                        handleCheckoutConfigChange("boletoFee", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="fixedFee">Taxa Fixa (R$)</Label>
                    <Input
                      id="fixedFee"
                      type="number"
                      step="0.01"
                      value={checkoutConfig.fixedFee}
                      onChange={(e) =>
                        handleCheckoutConfigChange("fixedFee", parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Configurações Gerais */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Configurações Gerais</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="usdToBrlRate">Cotação USD/BRL (API)</Label>
                      <button
                        onClick={loadExchangeRate}
                        disabled={isLoadingRate}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingRate ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <Input
                      id="usdToBrlRate"
                      type="text"
                      disabled
                      value={isLoadingRate ? 'Carregando...' : exchangeRate ? `R$ ${exchangeRate.toFixed(4)}` : 'Erro ao carregar'}
                      className="bg-secondary/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Obtido em tempo real do Banco Central do Brasil</p>
                  </div>

                  <div>
                    <Label htmlFor="webhookSecret">Webhook Secret</Label>
                    <Input
                      id="webhookSecret"
                      type="password"
                      value={checkoutConfig.webhookSecret}
                      onChange={(e) =>
                        handleCheckoutConfigChange("webhookSecret", e.target.value)
                      }
                      placeholder="whk_..."
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Salvar Configurações
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Transações */}
        <TabsContent value="transactions">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Histórico de Transações</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {transactions.length} transação{transactions.length !== 1 ? "s" : ""}
              </p>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Nenhuma transação registrada ainda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">ID</TableHead>
                      <TableHead className="text-muted-foreground">Usuário</TableHead>
                      <TableHead className="text-muted-foreground">Plano</TableHead>
                      <TableHead className="text-muted-foreground text-right">Valor</TableHead>
                      <TableHead className="text-muted-foreground">Método</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow
                        key={txn.id}
                        className="border-border hover:bg-secondary/30 transition-colors"
                      >
                        <TableCell className="font-mono text-xs">{txn.id.slice(0, 12)}...</TableCell>
                        <TableCell className="text-sm">Usuário #{txn.userId}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{txn.planId}</TableCell>
                        <TableCell className="text-right font-semibold text-accent">
                          R$ {txn.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-sm capitalize">{txn.paymentMethod}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              txn.status === "completed"
                                ? "default"
                                : txn.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className={
                              txn.status === "completed" ? "bg-accent text-accent-foreground" : ""
                            }
                          >
                            {txn.status === "completed"
                              ? "Concluído"
                              : txn.status === "pending"
                                ? "Pendente"
                                : txn.status === "processing"
                                  ? "Processando"
                                  : txn.status === "failed"
                                    ? "Falhou"
                                    : "Cancelado"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(txn.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
