/*
 * Users - Página de gestão de usuários
 * Lista de assinantes, créditos e atividade
 */

import { useState } from "react";
import CyberCard from "@/components/CyberCard";
import { Users as UsersIcon, TrendingUp, Activity, CreditCard, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Dados simulados de usuários
const initialUsers = [
  { id: 1, name: "João Silva", email: "joao@email.com", credits: 1850, analyses: 25, searches: 180, status: "active", joined: "15/01/2025" },
  { id: 2, name: "Maria Santos", email: "maria@email.com", credits: 450, analyses: 165, searches: 520, status: "active", joined: "08/01/2025" },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", credits: 2800, analyses: 12, searches: 95, status: "active", joined: "22/01/2025" },
  { id: 4, name: "Ana Oliveira", email: "ana@email.com", credits: 120, analyses: 198, searches: 640, status: "active", joined: "03/01/2025" },
  { id: 5, name: "Carlos Mendes", email: "carlos@email.com", credits: 3200, analyses: 8, searches: 42, status: "active", joined: "28/01/2025" },
  { id: 6, name: "Juliana Lima", email: "juliana@email.com", credits: 0, analyses: 210, searches: 780, status: "inactive", joined: "12/12/2024" },
  { id: 7, name: "Roberto Alves", email: "roberto@email.com", credits: 1450, analyses: 58, searches: 320, status: "active", joined: "18/01/2025" },
  { id: 8, name: "Fernanda Rocha", email: "fernanda@email.com", credits: 890, analyses: 102, searches: 445, status: "active", joined: "10/01/2025" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [creditsAmount, setCreditsAmount] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalCredits = users.reduce((acc, u) => acc + u.credits, 0);
  const avgCredits = Math.round(totalCredits / users.length);
  const totalAnalyses = users.reduce((acc, u) => acc + u.analyses, 0);
  const totalSearches = users.reduce((acc, u) => acc + u.searches, 0);

  const handleAddCredits = () => {
    if (!selectedUserId || !creditsAmount || isNaN(Number(creditsAmount))) {
      toast.error("Por favor, selecione um usuário e insira uma quantidade válida");
      return;
    }

    const credits = Number(creditsAmount);
    if (credits <= 0) {
      toast.error("A quantidade de créditos deve ser maior que zero");
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUserId) {
          return { ...user, credits: user.credits + credits };
        }
        return user;
      });

      setUsers(updatedUsers);
      const selectedUser = users.find(u => u.id === selectedUserId);
      toast.success(`${credits} créditos adicionados para ${selectedUser?.name}`, {
        description: `Novo saldo: ${(selectedUser?.credits || 0) + credits} créditos`,
      });

      setSelectedUserId(null);
      setCreditsAmount("");
      setIsAdding(false);
      setShowAddCredits(false);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CyberCard
          title="TOTAL DE USUÁRIOS"
          value={users.length.toLocaleString()}
          subtitle="ASSINANTES CRIPTO.ICO"
          icon={UsersIcon}
          variant="cyan"
        />
        
        <CyberCard
          title="USUÁRIOS ATIVOS"
          value={activeUsers.toLocaleString()}
          subtitle={`${((activeUsers / users.length) * 100).toFixed(1)}% do total`}
          icon={TrendingUp}
          trend="up"
          trendValue="+5.2% este mês"
          variant="green"
        />
        
        <CyberCard
          title="CRÉDITOS EM CIRCULAÇÃO"
          value={totalCredits.toLocaleString()}
          subtitle={`Média: ${avgCredits} por usuário`}
          icon={CreditCard}
          variant="magenta"
        />
        
        <CyberCard
          title="OPERAÇÕES TOTAIS"
          value={(totalAnalyses + totalSearches).toLocaleString()}
          subtitle={`${totalAnalyses} análises + ${totalSearches} buscas`}
          icon={Activity}
          variant="purple"
        />
      </div>

      {/* Botão para adicionar créditos */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddCredits(!showAddCredits)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Créditos
        </button>
      </div>

      {/* Formulário de adicionar créditos */}
      {showAddCredits && (
        <div className="bg-card rounded border border-border neon-border p-6">
          <h3 className="text-lg font-bold text-primary mb-6">Adicionar Créditos Avulsos</h3>
          
          <div className="space-y-4">
            {/* Seleção de usuário */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Selecione o Usuário</label>
              <select
                value={selectedUserId || ""}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">-- Escolha um usuário --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email}) - {user.credits} créditos
                  </option>
                ))}
              </select>
            </div>

            {/* Informações do usuário selecionado */}
            {selectedUserId && (
              <div className="bg-secondary/50 rounded p-4 border border-border text-sm">
                {(() => {
                  const user = users.find(u => u.id === selectedUserId);
                  return user ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nome:</span>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-semibold">{user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Créditos Atuais:</span>
                        <span className="font-bold text-accent">{user.credits.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Quantidade de créditos */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Quantidade de Créditos</label>
              <input
                type="number"
                min="1"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Ex: 500"
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Preview do novo saldo */}
            {selectedUserId && creditsAmount && !isNaN(Number(creditsAmount)) && Number(creditsAmount) > 0 && (
              <div className="bg-accent/10 rounded p-4 border border-accent/30 text-sm">
                {(() => {
                  const user = users.find(u => u.id === selectedUserId);
                  const newBalance = (user?.credits || 0) + Number(creditsAmount);
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saldo Atual:</span>
                        <span className="font-semibold">{user?.credits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">+ Créditos:</span>
                        <span className="font-semibold text-accent">{Number(creditsAmount).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-accent/30 pt-2 mt-2 flex justify-between">
                        <span className="font-bold">Novo Saldo:</span>
                        <span className="font-bold text-accent">{newBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddCredits}
                disabled={!selectedUserId || !creditsAmount || isAdding}
                className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-accent-foreground font-bold rounded transition-colors"
              >
                {isAdding ? "Processando..." : "Adicionar Créditos"}
              </button>
              <button
                onClick={() => {
                  setShowAddCredits(false);
                  setSelectedUserId(null);
                  setCreditsAmount("");
                }}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de usuários */}
      <div className="bg-card rounded border border-border neon-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-bold text-primary neon-text">Lista de Usuários</h3>
          <p className="text-sm text-muted-foreground mono mt-1">Assinantes ativos e inativos</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground mono">ID</TableHead>
                <TableHead className="text-muted-foreground mono">Nome</TableHead>
                <TableHead className="text-muted-foreground mono">Email</TableHead>
                <TableHead className="text-muted-foreground mono text-right">Créditos</TableHead>
                <TableHead className="text-muted-foreground mono text-right">Análises</TableHead>
                <TableHead className="text-muted-foreground mono text-right">Buscas</TableHead>
                <TableHead className="text-muted-foreground mono">Status</TableHead>
                <TableHead className="text-muted-foreground mono">Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-border hover:bg-secondary/50 transition-colors"
                >
                  <TableCell className="mono font-bold text-primary">#{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground mono text-sm">{user.email}</TableCell>
                  <TableCell className="text-right">
                    <span className={`mono font-bold ${user.credits === 0 ? 'text-destructive' : user.credits < 500 ? 'text-chart-5' : 'text-accent'}`}>
                      {user.credits.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right mono text-chart-3">{user.analyses}</TableCell>
                  <TableCell className="text-right mono text-chart-4">{user.searches}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "active" ? "default" : "destructive"}
                      className={user.status === "active" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="mono text-sm text-muted-foreground">{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Análise de créditos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded border border-border neon-border p-6">
          <h4 className="text-lg font-bold text-accent mb-4">Usuários com Créditos Baixos</h4>
          <div className="space-y-3">
            {users.filter(u => u.credits < 500 && u.status === "active").map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="mono font-bold text-destructive">{user.credits}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded border border-border neon-border p-6">
          <h4 className="text-lg font-bold text-chart-3 mb-4">Top Usuários (Análises)</h4>
          <div className="space-y-3">
            {users.sort((a, b) => b.analyses - a.analyses).slice(0, 5).map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs mono text-muted-foreground">#{idx + 1}</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <span className="mono font-bold text-chart-3">{user.analyses}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded border border-border neon-border p-6">
          <h4 className="text-lg font-bold text-chart-4 mb-4">Top Usuários (Buscas)</h4>
          <div className="space-y-3">
            {users.sort((a, b) => b.searches - a.searches).slice(0, 5).map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded">
                <div className="flex items-center gap-3">
                  <span className="text-xs mono text-muted-foreground">#{idx + 1}</span>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <span className="mono font-bold text-chart-4">{user.searches}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
