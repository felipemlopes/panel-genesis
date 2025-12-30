/**
 * LastlinkIntegration - Gerenciamento de integração com Lastlink
 * Sincronização de assinantes Cripto.ico e status de assinaturas
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, CheckCircle, AlertCircle, Clock, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { syncWithLastlink, getLastlinkSubscription } from "@/lib/lastlink-service";
import CyberCard from "@/components/CyberCard";

interface SyncLog {
  timestamp: string;
  status: 'success' | 'error';
  message: string;
  syncedUsers: number;
}

export default function LastlinkIntegration() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncDate, setLastSyncDate] = useState<string | null>("2025-12-19T09:30:00Z");
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
    {
      timestamp: "2025-12-19T09:30:00Z",
      status: "success",
      message: "Sincronização automática concluída",
      syncedUsers: 8,
    },
    {
      timestamp: "2025-12-18T09:30:00Z",
      status: "success",
      message: "Sincronização automática concluída",
      syncedUsers: 8,
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<any[]>([
    { userId: 1, name: "João Silva", status: "active", plan: "Premium", endDate: "2026-01-15" },
    { userId: 2, name: "Maria Santos", status: "active", plan: "Standard", endDate: "2026-01-08" },
    { userId: 3, name: "Pedro Costa", status: "active", plan: "Premium", endDate: "2026-01-22" },
    { userId: 4, name: "Ana Oliveira", status: "active", plan: "Standard", endDate: "2026-01-03" },
    { userId: 5, name: "Carlos Mendes", status: "active", plan: "Premium", endDate: "2026-01-28" },
    { userId: 6, name: "Juliana Lima", status: "expired", plan: "Standard", endDate: "2025-12-12" },
    { userId: 7, name: "Roberto Alves", status: "active", plan: "Premium", endDate: "2026-01-18" },
    { userId: 8, name: "Fernanda Rocha", status: "active", plan: "Standard", endDate: "2026-01-10" },
  ]);

  const activeSubscriptions = subscriptions.filter(s => s.status === "active").length;
  const expiredSubscriptions = subscriptions.filter(s => s.status === "expired").length;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await syncWithLastlink();
      
      if (response.success) {
        const newLog: SyncLog = {
          timestamp: new Date().toISOString(),
          status: "success",
          message: response.message,
          syncedUsers: response.syncedUsers,
        };
        setSyncLogs(prev => [newLog, ...prev]);
        setLastSyncDate(new Date().toISOString());
        
        toast.success("Sincronização com Lastlink concluída!", {
          description: `${response.syncedUsers} usuários sincronizados. ${response.newSubscriptions} novas assinaturas.`,
        });
      }
    } catch (error) {
      const errorLog: SyncLog = {
        timestamp: new Date().toISOString(),
        status: "error",
        message: "Erro ao sincronizar com Lastlink",
        syncedUsers: 0,
      };
      setSyncLogs(prev => [errorLog, ...prev]);
      
      toast.error("Erro na sincronização", {
        description: "Não foi possível sincronizar com Lastlink. Tente novamente.",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-accent text-accent-foreground";
      case "expired":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-chart-5 text-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "expired":
        return "Expirado";
      case "pending":
        return "Pendente";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CyberCard
          title="ASSINATURAS ATIVAS"
          value={activeSubscriptions.toLocaleString()}
          subtitle="CRIPTO.ICO VINCULADAS"
          icon={CheckCircle}
          variant="green"
        />
        
        <CyberCard
          title="ASSINATURAS EXPIRADAS"
          value={expiredSubscriptions.toLocaleString()}
          subtitle="REQUER RENOVAÇÃO"
          icon={AlertCircle}
          variant="red"
        />
        
        <CyberCard
          title="ÚLTIMA SINCRONIZAÇÃO"
          value={lastSyncDate ? new Date(lastSyncDate).toLocaleTimeString('pt-BR') : "Nunca"}
          subtitle={lastSyncDate ? new Date(lastSyncDate).toLocaleDateString('pt-BR') : ""}
          icon={Clock}
          variant="cyan"
        />
      </div>

      {/* Seção de Sincronização */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Integração Lastlink</h3>
          </div>
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>
        </div>

        <div className="bg-secondary/50 rounded p-4 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Status da Conexão</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-foreground">Conectado ao Lastlink</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Última sincronização: {lastSyncDate ? new Date(lastSyncDate).toLocaleString('pt-BR') : 'Nunca'}
          </p>
        </div>
      </div>

      {/* Tabela de Assinaturas */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Assinaturas Cripto.ico</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {subscriptions.length} assinatura{subscriptions.length !== 1 ? 's' : ''} vinculada{subscriptions.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Usuário</TableHead>
                <TableHead className="text-muted-foreground">Plano</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Data de Expiração</TableHead>
                <TableHead className="text-muted-foreground text-right">Dias Restantes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => {
                const endDate = new Date(sub.endDate);
                const today = new Date();
                const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <TableRow
                    key={sub.userId}
                    className="border-border hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.plan}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(sub.status)}>
                        {getStatusLabel(sub.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {endDate.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold ${daysLeft < 30 ? 'text-destructive' : 'text-accent'}`}>
                        {daysLeft > 0 ? `${daysLeft}d` : 'Expirado'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Log de Sincronizações */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Histórico de Sincronizações</h3>
          <p className="text-sm text-muted-foreground mt-1">Últimas operações de sincronização</p>
        </div>

        <div className="divide-y divide-border">
          {syncLogs.map((log, idx) => (
            <div key={idx} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                  {log.syncedUsers} usuários
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
