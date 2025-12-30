/**
 * External APIs Service
 * Integra com APIs externas para dados de custos e câmbio em tempo real
 */

// Tipos
export interface ExchangeRateData {
  rate: number;
  timestamp: Date;
  source: string;
}

export interface GoogleCloudCostData {
  monthlyCost: number;
  currency: string;
  timestamp: Date;
  source: string;
}

/**
 * Obtém taxa de câmbio USD/BRL em tempo real
 * Usa a API do Banco Central do Brasil ou fallback para valor simulado
 */
export async function getExchangeRate(): Promise<ExchangeRateData> {
  try {
    // Tenta usar a API do Banco Central do Brasil
    const response = await fetch(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json'
    );
    
    if (response.ok) {
      const data = await response.json();
      const rate = parseFloat(data[0].valor);
      
      return {
        rate,
        timestamp: new Date(),
        source: 'Banco Central do Brasil'
      };
    }
  } catch (error) {
    console.warn('Erro ao buscar taxa de câmbio do BCB, usando fallback:', error);
  }

  // Fallback: retorna valor simulado
  return {
    rate: 5.53,
    timestamp: new Date(),
    source: 'Simulado'
  };
}

/**
 * Obtém custos do Google Cloud
 * Requer integração com Google Cloud Billing API
 * Por enquanto retorna valor simulado
 */
export async function getGoogleCloudCost(): Promise<GoogleCloudCostData> {
  try {
    // Aqui você integraria com a API do Google Cloud Billing
    // Exemplo: https://www.googleapis.com/cloudbilling/v1/billingAccounts/{billingAccountId}/costAnalysis
    
    // Por enquanto, retorna valor simulado
    return {
      monthlyCost: 847.15,
      currency: 'USD',
      timestamp: new Date(),
      source: 'Google Cloud Billing (Simulado)'
    };
  } catch (error) {
    console.error('Erro ao buscar custos do Google Cloud:', error);
    
    return {
      monthlyCost: 847.15,
      currency: 'USD',
      timestamp: new Date(),
      source: 'Simulado'
    };
  }
}

/**
 * Obtém dados de custos e câmbio consolidados
 */
export async function getCostAndExchangeData() {
  const [exchangeRate, googleCloudCost] = await Promise.all([
    getExchangeRate(),
    getGoogleCloudCost()
  ]);

  return {
    exchangeRate,
    googleCloudCost,
    googleCloudCostBRL: googleCloudCost.monthlyCost * exchangeRate.rate
  };
}
