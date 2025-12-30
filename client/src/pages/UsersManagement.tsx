/**
 * UsersManagement - Gestão completa de usuários com ativação manual e Lastlink
 * Sistema de ativação com dois modos: Lastlink (automático) e Manual (com controle de tempo)
 */

import { useState } from "react";
import CyberCard from "@/components/CyberCard";
import TermsModal from "@/components/TermsModal";
import { Users as UsersIcon, TrendingUp, Activity, CreditCard, Edit, Power, Plus, Download, Search, Filter, FileText, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Dados simulados de usuários com Lastlink e T&C
const initialUsers = [
  { id: 1, name: "João Silva", email: "joao@email.com", credits: 1850, analyses: 25, searches: 180, status: "active", joined: "15/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-15T10:30:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 2, name: "Maria Santos", email: "maria@email.com", credits: 450, analyses: 165, searches: 520, status: "active", joined: "08/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-08T14:20:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 3, name: "Pedro Costa", email: "pedro@email.com", credits: 2800, analyses: 12, searches: 95, status: "active", joined: "22/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-22T09:15:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 4, name: "Ana Oliveira", email: "ana@email.com", credits: 120, analyses: 198, searches: 640, status: "active", joined: "03/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-03T16:45:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 5, name: "Carlos Mendes", email: "carlos@email.com", credits: 3200, analyses: 8, searches: 42, status: "active", joined: "28/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-28T11:00:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 6, name: "Juliana Lima", email: "juliana@email.com", credits: 0, analyses: 210, searches: 780, status: "inactive", joined: "12/12/2024", lastlinkStatus: "expired", termsSignedDate: "2024-12-12T13:30:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 7, name: "Roberto Alves", email: "roberto@email.com", credits: 1450, analyses: 58, searches: 320, status: "active", joined: "18/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-18T10:00:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
  { id: 8, name: "Fernanda Rocha", email: "fernanda@email.com", credits: 890, analyses: 102, searches: 445, status: "active", joined: "10/01/2025", lastlinkStatus: "active", termsSignedDate: "2025-01-10T15:20:00Z", activationMode: "lastlink" as const, manualActivationStart: null, manualActivationEnd: null },
];

export default function UsersManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [creditsFilter, setCreditsFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", credits: 0 });
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [selectedUserForTerms, setSelectedUserForTerms] = useState<number | undefined>(undefined);
  const [addCreditsDialogOpen, setAddCreditsDialogOpen] = useState(false);
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<typeof initialUsers[0] | null>(null);
  const [creditsToAdd, setCreditsToAdd] = useState<string>("");
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);
  const [selectedUserForActivation, setSelectedUserForActivation] = useState<typeof initialUsers[0] | null>(null);
  const [activationMode, setActivationMode] = useState<"lastlink" | "manual">("lastlink");
  const [manualActivationDays, setManualActivationDays] = useState<string>("30");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    let matchesCredits = true;
    if (creditsFilter === "low") matchesCredits = user.credits < 500;
    else if (creditsFilter === "medium") matchesCredits = user.credits >= 500 && user.credits < 2000;
    else if (creditsFilter === "high") matchesCredits = user.credits >= 2000;
    
    return matchesSearch && matchesStatus && matchesCredits;
  });

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalCreditsDistributed = users.reduce((sum, u) => sum + u.credits, 0);
  const totalAnalyses = users.reduce((sum, u) => sum + u.analyses, 0);
  const lowCreditsUsers = users.filter(u => u.credits < 500 && u.status === "active").length;
  const manualActivationUsers = users.filter(u => u.activationMode === "manual").length;

  const openEditDialog = (user: typeof initialUsers[0]) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, credits: user.credits });
    setEditDialogOpen(true);
  };

  const saveUser = () => {
    if (selectedUser) {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, name: editForm.name, email: editForm.email, credits: editForm.credits }
          : u
      ));
      setEditDialogOpen(false);
      toast.success("Usuário atualizado com sucesso!");
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === "active" ? "inactive" : "active" }
        : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`Usuário ${user?.name} ${user?.status === "active" ? "desativado" : "ativado"}!`);
  };

  const addCredits = (userId: number, amount: number) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, credits: u.credits + amount }
        : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(`${amount} créditos adicionados a ${user?.name}!`);
  };

  const handleAddCreditsClick = (user: typeof initialUsers[0]) => {
    setSelectedUserForCredits(user);
    setCreditsToAdd("");
    setAddCreditsDialogOpen(true);
  };

  const saveAddCredits = () => {
    if (!selectedUserForCredits || !creditsToAdd || isNaN(Number(creditsToAdd))) {
      toast.error("Por favor, insira uma quantidade válida de créditos");
      return;
    }

    const amount = Number(creditsToAdd);
    if (amount <= 0) {
      toast.error("A quantidade deve ser maior que zero");
      return;
    }

    addCredits(selectedUserForCredits.id, amount);
    setAddCreditsDialogOpen(false);
    setSelectedUserForCredits(null);
    setCreditsToAdd("");
  };

   const handleActivationClick = (user: typeof initialUsers[0]) => {
    setSelectedUserForActivation(user);
    setActivationMode(user.activationMode);
    setManualActivationDays("30");
    setActivationDialogOpen(true);
  };

  const toggleActivationMode = (user: typeof initialUsers[0]) => {
    if (user.activationMode === "lastlink") {
      setSelectedUserForActivation(user);
      setActivationMode("manual");
      setManualActivationDays("30");
      setActivationDialogOpen(true);
    } else {
      setUsers(users.map(u =>
        u.id === user.id
          ? { ...u, activationMode: "lastlink", manualActivationStart: null, manualActivationEnd: null }
          : u
      ));
      toast.success(`Ativacao via Lastlink restaurada para ${user.name}!`);
    }
  };

  const saveActivationMode = () => {
    if (!selectedUserForActivation) return;

    if (activationMode === "manual") {
      if (!manualActivationDays || isNaN(Number(manualActivationDays)) || Number(manualActivationDays) <= 0) {
        toast.error("Por favor, insira uma quantidade válida de dias");
        return;
      }

      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + Number(manualActivationDays) * 24 * 60 * 60 * 1000);

      setUsers(users.map(u =>
        u.id === selectedUserForActivation.id
          ? {
              ...u,
              activationMode: "manual",
              manualActivationStart: startDate.toISOString(),
              manualActivationEnd: endDate.toISOString(),
            }
          : u
      ));
      toast.success(`Ativação manual configurada por ${manualActivationDays} dias para ${selectedUserForActivation.name}!`);
    } else {
      setUsers(users.map(u =>
        u.id === selectedUserForActivation.id
          ? {
              ...u,
              activationMode: "lastlink",
              manualActivationStart: null,
              manualActivationEnd: null,
            }
          : u
      ));
      toast.success(`Ativação via Lastlink restaurada para ${selectedUserForActivation.name}!`);
    }

    setActivationDialogOpen(false);
    setSelectedUserForActivation(null);
  };

  const isManualActivationExpired = (user: typeof initialUsers[0]) => {
    if (user.activationMode !== "manual" || !user.manualActivationEnd) return false;
    return new Date() > new Date(user.manualActivationEnd);
  };

  const getManualActivationRemainingDays = (user: typeof initialUsers[0]) => {
    if (user.activationMode !== "manual" || !user.manualActivationEnd) return 0;
    const now = new Date();
    const end = new Date(user.manualActivationEnd);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const exportToCSV = () => {
    const headers = ["ID", "Nome", "Email", "Créditos", "Análises", "Buscas", "Status", "Modo Ativação", "Lastlink", "T&C Assinado"];
    const rows = filteredUsers.map(u => [
      u.id,
      u.name,
      u.email,
      u.credits,
      u.analyses,
      u.searches,
      u.status,
      u.activationMode === "manual" ? `Manual (${getManualActivationRemainingDays(u)} dias)` : "Lastlink",
      u.lastlinkStatus,
      new Date(u.termsSignedDate).toLocaleDateString('pt-BR'),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_genesis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Dados exportados com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CyberCard
          title="USUÁRIOS ATIVOS"
          value={activeUsers.toLocaleString()}
          subtitle="ASSINANTES ATIVOS"
          icon={UsersIcon}
          variant="cyan"
        />
        <CyberCard
          title="CRÉDITOS DISTRIBUÍDOS"
          value={totalCreditsDistributed.toLocaleString()}
          subtitle="CRÉDITOS EM CIRCULAÇÃO"
          icon={CreditCard}
          variant="green"
        />
        <CyberCard
          title="TOTAL DE ANÁLISES"
          value={totalAnalyses.toLocaleString()}
          subtitle="OPERAÇÕES REALIZADAS"
          icon={Activity}
          variant="magenta"
        />
        <CyberCard
          title="ATIVAÇÃO MANUAL"
          value={manualActivationUsers.toLocaleString()}
          subtitle="USUÁRIOS SEM LASTLINK"
          icon={Zap}
          variant="yellow"
        />
      </div>

      {/* Tabela de usuários */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Gestão de Usuários</h3>
            <p className="text-sm text-muted-foreground mt-1">{filteredUsers.length} usuário(s) encontrado(s)</p>
          </div>
          <Button
            onClick={exportToCSV}
            className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Filtros Avançados */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-2">
              <span className="text-xs text-muted-foreground font-bold self-center">STATUS:</span>
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                onClick={() => setStatusFilter("active")}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                onClick={() => setStatusFilter("inactive")}
                size="sm"
              >
                Inativos
              </Button>
            </div>

            <div className="flex gap-2">
              <span className="text-xs text-muted-foreground font-bold self-center">CRÉDITOS:</span>
              <Button
                variant={creditsFilter === "all" ? "default" : "outline"}
                onClick={() => setCreditsFilter("all")}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={creditsFilter === "low" ? "default" : "outline"}
                onClick={() => setCreditsFilter("low")}
                size="sm"
              >
                Baixos
              </Button>
              <Button
                variant={creditsFilter === "medium" ? "default" : "outline"}
                onClick={() => setCreditsFilter("medium")}
                size="sm"
              >
                Médios
              </Button>
              <Button
                variant={creditsFilter === "high" ? "default" : "outline"}
                onClick={() => setCreditsFilter("high")}
                size="sm"
              >
                Altos
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela Otimizada */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Usuário</TableHead>
                <TableHead className="text-muted-foreground text-right">Créditos</TableHead>
                <TableHead className="text-muted-foreground text-right">Análises</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Ativação</TableHead>
                <TableHead className="text-muted-foreground">Lastlink</TableHead>
                <TableHead className="text-muted-foreground">T&C</TableHead>
                <TableHead className="text-muted-foreground text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-border hover:bg-secondary/30 transition-colors"
                >
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <p className="font-bold text-accent text-sm">{user.credits}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.credits < 500 ? "Baixo" : user.credits < 2000 ? "Médio" : "Alto"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{user.analyses}</p>
                      <p className="text-xs text-muted-foreground">{user.searches} buscas</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "default" : "secondary"}
                      className={user.status === "active" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}
                    >
                      {user.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Lastlink</span>
                        <Switch
                          checked={user.activationMode === "manual"}
                          onCheckedChange={() => toggleActivationMode(user)}
                        />
                        <span className="text-xs text-muted-foreground">Manual</span>
                      </div>
                      {user.activationMode === "manual" && (
                        <p className="text-xs font-semibold text-accent">
                          {isManualActivationExpired(user) ? "Expirado" : `${getManualActivationRemainingDays(user)} dias`}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {user.lastlinkStatus === "active" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Badge 
                        variant={user.lastlinkStatus === "active" ? "default" : "destructive"}
                        className={user.lastlinkStatus === "active" ? "bg-green-700 text-white" : ""}
                      >
                        {user.lastlinkStatus === "active" ? "Ativo" : "Expirado"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedUserForTerms(user.id);
                        setTermsModalOpen(true);
                      }}
                      className="h-8 px-2 text-xs"
                      title="Ver Termo e Condições"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(user)}
                        className="h-8 w-8 p-0"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleActivationClick(user)}
                        className="h-8 w-8 p-0"
                        title="Configurar ativação"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleUserStatus(user.id)}
                        className="h-8 w-8 p-0"
                        title={user.status === "active" ? "Desativar" : "Ativar"}
                      >
                        <Power className={`w-4 h-4 ${user.status === "active" ? "text-accent" : "text-muted-foreground"}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddCreditsClick(user)}
                        className="h-8 w-8 p-0"
                        title="Adicionar créditos"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-credits">Créditos</Label>
              <Input
                id="edit-credits"
                type="number"
                value={editForm.credits}
                onChange={(e) => setEditForm({ ...editForm, credits: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveUser} className="bg-accent hover:bg-accent/90">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Ativação */}
      <Dialog open={activationDialogOpen} onOpenChange={setActivationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Ativação</DialogTitle>
            <DialogDescription>
              Escolha o modo de ativação para {selectedUserForActivation?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Modo de Ativação</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50" onClick={() => setActivationMode("lastlink")}>
                  <input
                    type="radio"
                    id="lastlink-mode"
                    name="activation"
                    value="lastlink"
                    checked={activationMode === "lastlink"}
                    onChange={() => setActivationMode("lastlink")}
                  />
                  <label htmlFor="lastlink-mode" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-sm">Lastlink (Automático)</p>
                    <p className="text-xs text-muted-foreground">Usuário só pode usar quando Lastlink está ativo</p>
                  </label>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50" onClick={() => setActivationMode("manual")}>
                  <input
                    type="radio"
                    id="manual-mode"
                    name="activation"
                    value="manual"
                    checked={activationMode === "manual"}
                    onChange={() => setActivationMode("manual")}
                  />
                  <label htmlFor="manual-mode" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-sm">Manual (Tempo Limitado)</p>
                    <p className="text-xs text-muted-foreground">Usuário pode usar sem depender da Lastlink</p>
                  </label>
                </div>
              </div>
            </div>

            {activationMode === "manual" && (
              <div className="space-y-2">
                <Label htmlFor="manual-days">Duração (dias)</Label>
                <Input
                  id="manual-days"
                  type="number"
                  min="1"
                  placeholder="Ex: 30"
                  value={manualActivationDays}
                  onChange={(e) => setManualActivationDays(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  O usuário poderá usar o Genesis por {manualActivationDays || "0"} dias a partir de agora
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivationDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveActivationMode} className="bg-accent hover:bg-accent/90">
              Salvar Configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Termo e Condições */}
      <TermsModal 
        open={termsModalOpen} 
        onOpenChange={setTermsModalOpen}
        userId={selectedUserForTerms}
      />

      {/* Dialog para adicionar créditos */}
      <Dialog open={addCreditsDialogOpen} onOpenChange={setAddCreditsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Créditos Avulsos</DialogTitle>
            <DialogDescription>
              Adicione créditos manualmente para {selectedUserForCredits?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="credits-amount">Quantidade de Créditos</Label>
              <Input
                id="credits-amount"
                type="number"
                min="1"
                placeholder="Ex: 500"
                value={creditsToAdd}
                onChange={(e) => setCreditsToAdd(e.target.value)}
              />
            </div>
            {selectedUserForCredits && creditsToAdd && !isNaN(Number(creditsToAdd)) && Number(creditsToAdd) > 0 && (
              <div className="bg-secondary/50 rounded p-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo Atual:</span>
                  <span className="font-semibold">{selectedUserForCredits.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">+ Créditos:</span>
                  <span className="font-semibold text-accent">{Number(creditsToAdd)}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Novo Saldo:</span>
                  <span className="font-bold text-accent">{selectedUserForCredits.credits + Number(creditsToAdd)}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCreditsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAddCredits} className="bg-accent hover:bg-accent/90">
              Adicionar Créditos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
