/**
 * Serviço de integração com Lastlink
 * Gerencia sincronização de assinantes Cripto.ico
 */

export interface LastlinkSubscription {
  id: string;
  userId: number;
  cryptoIcoId: string;
  status: 'active' | 'inactive' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  plan: string;
  lastSyncDate: string;
}

export interface LastlinkSyncResponse {
  success: boolean;
  message: string;
  syncedUsers: number;
  newSubscriptions: number;
  updatedSubscriptions: number;
  timestamp: string;
}

/**
 * Simula sincronização com Lastlink
 * Em produção, isso faria uma chamada real à API da Lastlink
 */
export async function syncWithLastlink(): Promise<LastlinkSyncResponse> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simular resposta bem-sucedida
  return {
    success: true,
    message: 'Sincronização com Lastlink concluída com sucesso',
    syncedUsers: 8,
    newSubscriptions: 2,
    updatedSubscriptions: 1,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Obtém dados de assinatura do Lastlink para um usuário
 */
export async function getLastlinkSubscription(userId: number): Promise<LastlinkSubscription | null> {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Dados simulados
  const subscriptions: Record<number, LastlinkSubscription> = {
    1: {
      id: 'sub_001',
      userId: 1,
      cryptoIcoId: 'cripto_ico_001',
      status: 'active',
      startDate: '2025-01-15',
      endDate: '2026-01-15',
      plan: 'Premium',
      lastSyncDate: '2025-12-19',
    },
    2: {
      id: 'sub_002',
      userId: 2,
      cryptoIcoId: 'cripto_ico_002',
      status: 'active',
      startDate: '2025-01-08',
      endDate: '2026-01-08',
      plan: 'Standard',
      lastSyncDate: '2025-12-19',
    },
    3: {
      id: 'sub_003',
      userId: 3,
      cryptoIcoId: 'cripto_ico_003',
      status: 'active',
      startDate: '2025-01-22',
      endDate: '2026-01-22',
      plan: 'Premium',
      lastSyncDate: '2025-12-19',
    },
    4: {
      id: 'sub_004',
      userId: 4,
      cryptoIcoId: 'cripto_ico_004',
      status: 'active',
      startDate: '2025-01-03',
      endDate: '2026-01-03',
      plan: 'Standard',
      lastSyncDate: '2025-12-19',
    },
    5: {
      id: 'sub_005',
      userId: 5,
      cryptoIcoId: 'cripto_ico_005',
      status: 'active',
      startDate: '2025-01-28',
      endDate: '2026-01-28',
      plan: 'Premium',
      lastSyncDate: '2025-12-19',
    },
    6: {
      id: 'sub_006',
      userId: 6,
      cryptoIcoId: 'cripto_ico_006',
      status: 'expired',
      startDate: '2024-12-12',
      endDate: '2025-12-12',
      plan: 'Standard',
      lastSyncDate: '2025-12-19',
    },
    7: {
      id: 'sub_007',
      userId: 7,
      cryptoIcoId: 'cripto_ico_007',
      status: 'active',
      startDate: '2025-01-18',
      endDate: '2026-01-18',
      plan: 'Premium',
      lastSyncDate: '2025-12-19',
    },
    8: {
      id: 'sub_008',
      userId: 8,
      cryptoIcoId: 'cripto_ico_008',
      status: 'active',
      startDate: '2025-01-10',
      endDate: '2026-01-10',
      plan: 'Standard',
      lastSyncDate: '2025-12-19',
    },
  };

  return subscriptions[userId] || null;
}

/**
 * Verifica status de assinatura no Lastlink
 */
export async function checkSubscriptionStatus(userId: number): Promise<'active' | 'inactive' | 'expired'> {
  const subscription = await getLastlinkSubscription(userId);
  
  if (!subscription) {
    return 'inactive';
  }

  if (subscription.status === 'expired') {
    return 'expired';
  }

  return subscription.status === 'active' ? 'active' : 'inactive';
}
