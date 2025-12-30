/**
 * Serviço de gerenciamento de Termo e Condições
 * Rastreia assinatura de T&C por usuário
 */

export interface TermsOfService {
  id: string;
  version: string;
  content: string;
  createdDate: string;
  lastUpdated: string;
}

export interface UserTermsSignature {
  userId: number;
  termsVersion: string;
  signedDate: string;
  ipAddress: string;
  userAgent: string;
}

// Termo e Condições padrão
export const DEFAULT_TERMS: TermsOfService = {
  id: 'terms_v1',
  version: '1.0',
  content: `TERMO E CONDIÇÕES DE USO - PLATAFORMA GÊNESIS

1. ACEITAÇÃO DOS TERMOS
Ao acessar e usar a plataforma Gênesis, você concorda em estar vinculado por estes Termos e Condições. Se você não concordar com qualquer parte destes termos, não use a plataforma.

2. DESCRIÇÃO DO SERVIÇO
A plataforma Gênesis fornece análises de criptoativos e buscas de oportunidades de mercado utilizando inteligência artificial (Gemini 3.0) para melhorar a assertividade de traders.

3. LICENÇA E ACESSO
A assinatura do Cripto.ico concede ao usuário acesso à plataforma por 1 (um) ano, com 2.100 créditos iniciais para operações.

4. CRÉDITOS E OPERAÇÕES
- Análise de ativo: 100 créditos
- Busca de oportunidade: 20 créditos
- Créditos adicionais podem ser adquiridos através dos planos disponíveis

5. RESPONSABILIDADES DO USUÁRIO
O usuário é responsável por:
- Manter a confidencialidade de suas credenciais
- Usar a plataforma de forma legal e ética
- Não compartilhar sua conta com terceiros

6. LIMITAÇÕES DE RESPONSABILIDADE
A plataforma é fornecida "como está". Gênesis não se responsabiliza por perdas financeiras resultantes do uso das análises fornecidas.

7. CANCELAMENTO
O usuário pode cancelar sua assinatura a qualquer momento, perdendo acesso imediato à plataforma.

8. MODIFICAÇÕES DOS TERMOS
Gênesis se reserva o direito de modificar estes termos. Notificações de mudanças serão enviadas aos usuários.

9. LEGISLAÇÃO
Estes termos são regidos pelas leis brasileiras.

10. CONTATO
Para dúvidas, entre em contato através de support@genesis.app`,
  createdDate: '2025-01-01',
  lastUpdated: '2025-01-01',
};

// Dados simulados de assinaturas
const userSignatures: Record<number, UserTermsSignature> = {
  1: { userId: 1, termsVersion: '1.0', signedDate: '2025-01-15T10:30:00Z', ipAddress: '192.168.1.1', userAgent: 'Mozilla/5.0' },
  2: { userId: 2, termsVersion: '1.0', signedDate: '2025-01-08T14:20:00Z', ipAddress: '192.168.1.2', userAgent: 'Mozilla/5.0' },
  3: { userId: 3, termsVersion: '1.0', signedDate: '2025-01-22T09:15:00Z', ipAddress: '192.168.1.3', userAgent: 'Mozilla/5.0' },
  4: { userId: 4, termsVersion: '1.0', signedDate: '2025-01-03T16:45:00Z', ipAddress: '192.168.1.4', userAgent: 'Mozilla/5.0' },
  5: { userId: 5, termsVersion: '1.0', signedDate: '2025-01-28T11:00:00Z', ipAddress: '192.168.1.5', userAgent: 'Mozilla/5.0' },
  6: { userId: 6, termsVersion: '1.0', signedDate: '2024-12-12T13:30:00Z', ipAddress: '192.168.1.6', userAgent: 'Mozilla/5.0' },
  7: { userId: 7, termsVersion: '1.0', signedDate: '2025-01-18T10:00:00Z', ipAddress: '192.168.1.7', userAgent: 'Mozilla/5.0' },
  8: { userId: 8, termsVersion: '1.0', signedDate: '2025-01-10T15:20:00Z', ipAddress: '192.168.1.8', userAgent: 'Mozilla/5.0' },
};

/**
 * Obtém o termo e condição atual
 */
export function getCurrentTerms(): TermsOfService {
  return DEFAULT_TERMS;
}

/**
 * Obtém assinatura de T&C de um usuário
 */
export function getUserTermsSignature(userId: number): UserTermsSignature | null {
  return userSignatures[userId] || null;
}

/**
 * Registra assinatura de T&C de um usuário
 */
export function signTerms(userId: number, ipAddress: string, userAgent: string): UserTermsSignature {
  const signature: UserTermsSignature = {
    userId,
    termsVersion: DEFAULT_TERMS.version,
    signedDate: new Date().toISOString(),
    ipAddress,
    userAgent,
  };

  userSignatures[userId] = signature;
  return signature;
}

/**
 * Verifica se um usuário assinou os T&C
 */
export function hasUserSignedTerms(userId: number): boolean {
  return !!userSignatures[userId];
}

/**
 * Obtém data de assinatura formatada
 */
export function getFormattedSignatureDate(userId: number): string | null {
  const signature = userSignatures[userId];
  if (!signature) return null;

  const date = new Date(signature.signedDate);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
