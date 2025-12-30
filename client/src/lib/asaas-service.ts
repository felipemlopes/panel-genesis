/**
 * Serviço de integração com Asaas
 * Gerencia pagamentos e configurações de checkout
 */

export interface AsaasConfig {
  apiKey: string;
  webhookUrl: string;
  environment: 'sandbox' | 'production';
  cpfCnpj: string;
  accountName: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
  fee: number; // percentual
}

export interface CheckoutConfig {
  asaasApiKey: string;
  pixEnabled: boolean;
  creditCardEnabled: boolean;
  boletoEnabled: boolean;
  creditCardFee: number; // percentual
  pixFee: number; // percentual
  boletoFee: number; // percentual
  fixedFee: number; // valor fixo em reais
  usdToBrlRate: number;
  webhookSecret: string;
  checkoutSpread: number; // spread de câmbio em %
}

export interface PaymentTransaction {
  id: string;
  userId: number;
  planId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  createdAt: string;
  completedAt?: string;
  asaasPaymentId?: string;
}

// Configuração padrão do Asaas
export const DEFAULT_ASAAS_CONFIG: AsaasConfig = {
  apiKey: '',
  webhookUrl: '',
  environment: 'sandbox',
  cpfCnpj: '',
  accountName: 'Gênesis',
};

// Configuração padrão de checkout
export const DEFAULT_CHECKOUT_CONFIG: CheckoutConfig = {
  asaasApiKey: '',
  pixEnabled: true,
  creditCardEnabled: true,
  boletoEnabled: true,
  creditCardFee: 2.99, // 2.99%
  pixFee: 1.99, // 1.99%
  boletoFee: 1.99, // 1.99%
  fixedFee: 0.49, // R$ 0.49
  usdToBrlRate: 5.53,
  webhookSecret: '',
  checkoutSpread: 2.0, // 2% de spread
};

// Dados simulados
let asaasConfig = { ...DEFAULT_ASAAS_CONFIG };
let checkoutConfig = { ...DEFAULT_CHECKOUT_CONFIG };
let transactions: PaymentTransaction[] = [];
let checkoutSpreadValue = 2.0; // spread padrao

/**
 * Obtém configuração do Asaas
 */
export function getAsaasConfig(): AsaasConfig {
  return asaasConfig;
}

/**
 * Atualiza configuração do Asaas
 */
export function updateAsaasConfig(config: Partial<AsaasConfig>): AsaasConfig {
  asaasConfig = { ...asaasConfig, ...config };
  return asaasConfig;
}

/**
 * Obtém configuração de checkout
 */
export function getCheckoutConfig(): CheckoutConfig {
  return checkoutConfig;
}

/**
 * Atualiza configuração de checkout
 */
export function updateCheckoutConfig(config: Partial<CheckoutConfig>): CheckoutConfig {
  checkoutConfig = { ...checkoutConfig, ...config };
  if (config.checkoutSpread !== undefined) {
    checkoutSpreadValue = config.checkoutSpread;
  }
  return checkoutConfig;
}

/**
 * Obtém o spread de câmbio do checkout
 */
export function getCheckoutSpread(): number {
  return checkoutSpreadValue;
}

/**
 * Define o spread de câmbio do checkout
 */
export function setCheckoutSpread(spread: number): void {
  checkoutSpreadValue = spread;
  checkoutConfig.checkoutSpread = spread;
}

/**
 * Calcula taxa de pagamento
 */
export function calculatePaymentFee(amount: number, method: 'pix' | 'credit_card' | 'boleto'): { fee: number; total: number } {
  const config = getCheckoutConfig();
  let feePercentage = 0;

  switch (method) {
    case 'pix':
      feePercentage = config.pixFee;
      break;
    case 'credit_card':
      feePercentage = config.creditCardFee;
      break;
    case 'boleto':
      feePercentage = config.boletoFee;
      break;
  }

  const percentageFee = (amount * feePercentage) / 100;
  const totalFee = percentageFee + config.fixedFee;
  const total = amount + totalFee;

  return { fee: totalFee, total };
}

/**
 * Cria transação de pagamento simulada
 */
export async function createPaymentTransaction(
  userId: number,
  planId: string,
  amount: number,
  method: 'pix' | 'credit_card' | 'boleto'
): Promise<PaymentTransaction> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const transaction: PaymentTransaction = {
    id: `txn_${Date.now()}`,
    userId,
    planId,
    amount,
    currency: 'BRL',
    status: 'pending',
    paymentMethod: method,
    createdAt: new Date().toISOString(),
    asaasPaymentId: `asaas_${Math.random().toString(36).substr(2, 9)}`,
  };

  transactions.push(transaction);
  return transaction;
}

/**
 * Obtém transações de um usuário
 */
export function getUserTransactions(userId: number): PaymentTransaction[] {
  return transactions.filter(t => t.userId === userId);
}

/**
 * Obtém todas as transações
 */
export function getAllTransactions(): PaymentTransaction[] {
  return transactions;
}

/**
 * Atualiza status de transação
 */
export function updateTransactionStatus(
  transactionId: string,
  status: PaymentTransaction['status']
): PaymentTransaction | null {
  const transaction = transactions.find(t => t.id === transactionId);
  if (!transaction) return null;

  transaction.status = status;
  if (status === 'completed') {
    transaction.completedAt = new Date().toISOString();
  }

  return transaction;
}

/**
 * Testa conexão com Asaas
 */
export async function testAsaasConnection(): Promise<{ success: boolean; message: string }> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!asaasConfig.apiKey) {
    return {
      success: false,
      message: 'API Key não configurada',
    };
  }

  // Simular resposta bem-sucedida
  return {
    success: true,
    message: 'Conexão com Asaas estabelecida com sucesso',
  };
}

/**
 * Valida webhook do Asaas
 */
export function validateAsaasWebhook(signature: string, payload: string): boolean {
  // Implementação simplificada
  // Em produção, usar HMAC-SHA256 com webhookSecret
  return !!signature && !!payload;
}

/**
 * Obtém taxa de câmbio USD/BRL com spread do checkout
 * Se spread não for fornecido, usa o valor padrão do checkout
 */
export async function getExchangeRateWithSpread(spread?: number): Promise<{ rate: number; baseRate: number; spread: number; timestamp: string }> {
  const spreadToUse = spread !== undefined ? spread : checkoutSpreadValue;
  
  try {
    // Busca taxa em tempo real do Banco Central do Brasil
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json'
    );
    
    if (response.ok) {
      const data = await response.json();
      const baseRate = parseFloat(data[0].valor);
      const rateWithSpread = baseRate * (1 + spreadToUse / 100);
      
      return {
        rate: rateWithSpread,
        baseRate,
        spread: spreadToUse,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar taxa de câmbio do BCB:', error);
  }

  // Fallback: retorna valor simulado com spread
  const baseRate = 5.53;
  const rateWithSpread = baseRate * (1 + spreadToUse / 100);
  
  return {
    rate: rateWithSpread,
    baseRate,
    spread: spreadToUse,
    timestamp: new Date().toISOString()
  };
}
