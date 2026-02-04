/**
 * Dashboard - Página principal com visão geral
 * Métricas de receita, custos, usuários e operações
 */

import CyberCard from "@/components/CyberCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";
import { DollarSign, TrendingUp, Users, Zap, Activity, Database, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api.ts";
import { toast } from "sonner";

// Dados simulados
const revenueData = [
  { month: "Jan", receita: 85000, custos: 32000, lucro: 53000 },
  { month: "Fev", receita: 92000, custos: 35000, lucro: 57000 },
  { month: "Mar", receita: 108000, custos: 38000, lucro: 70000 },
  { month: "Abr", receita: 125000, custos: 42000, lucro: 83000 },
  { month: "Mai", receita: 142000, custos: 45000, lucro: 97000 },
  { month: "Jun", receita: 158000, custos: 48000, lucro: 110000 },
];

const operationsData = [
  { day: "Seg", analises: 450, buscas: 1200 },
  { day: "Ter", analises: 520, buscas: 1350 },
  { day: "Qua", analises: 480, buscas: 1280 },
  { day: "Qui", analises: 610, buscas: 1520 },
  { day: "Sex", analises: 580, buscas: 1450 },
  { day: "Sáb", analises: 320, buscas: 890 },
  { day: "Dom", analises: 280, buscas: 780 },
];

const systemInfo = [
  { label: "STATUS DO SISTEMA", value: "OPERACIONAL", status: "online", color: "text-green-500" },
  { label: "UPTIME", value: "99.8%", status: "excellent", color: "text-green-500" },
  { label: "LATÊNCIA API", value: "45ms", status: "good", color: "text-blue-400" },
  { label: "BANCO DE DADOS", value: "CONECTADO", status: "online", color: "text-green-500" },
  { label: "CACHE", value: "92% UTILIZADO", status: "good", color: "text-yellow-500" },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue:{
      this_month:0,
      last_month:0,
      variation_percent:0,
    },
    users: {
      active_this_month:0,
      active_last_month:0,
    },
    trades: {
      today:0,
      average_per_day:0,
      daily_chart:[],
    },
  });

  useEffect(() => {
    loadStats();
  }, []);
  console.log(stats);
  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data.data);
    } catch {
      toast.error("Erro ao carregar métricas");
    } finally {

    }
  };


  function getTrend(value: number) {
    if (value > 0) return 'up'
    if (value < 0) return 'down'
    return 'neutral'
  }

  function formatPercent(value: number) {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  function formatMoney(value: number) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const revenueThisMonth =
    stats.revenue.this_month

  const revenueSubtitle =
    `${formatPercent(stats.revenue.variation_percent)} vs mês anterior`

  const operationsData = useMemo(() => {
    if (!stats?.trades?.daily_chart) return [];

    return stats.trades.daily_chart.map(item => ({
      day: new Date(item.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
      }),
      analises: item.total, // se hoje você só tem total
    }));
  }, [stats]);

  return (
    <div className="space-y-4">
      {/* Informações do Sistema */}
      {/*
      <div className="bg-card border border-gray-800 rounded p-3 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {systemInfo.map((info) => (
            <div key={info.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-xs font-bold uppercase text-gray-600">{info.label}</span>
              <span className={`text-xs font-bold ${info.color}`}>{info.value}</span>
              <span className={`w-2 h-2 rounded-full ${info.status === "online" || info.status === "excellent" ? "bg-green-500" : "bg-yellow-500"}`}></span>
            </div>
          ))}
        </div>
      </div>
      */}

      {/* Live Data Feed Label */}
      <div className="text-xs font-bold uppercase text-gray-600 tracking-widest">
        • LIVE DATA FEED
      </div>

      {/* Cards de métricas principais - 5 colunas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
        <CyberCard
        title="RECEITA TOTAL"
        value={formatMoney(revenueThisMonth)}
        subtitle="ÚLTIMOS 30 DIAS"
        icon={DollarSign}
        trend={getTrend(stats.revenue.variation_percent)}
        trendValue={revenueSubtitle}
        variant="cyan"
        />

        <CyberCard
          title="USUÁRIOS ATIVOS"
          value={stats.users.active_this_month}
          subtitle="ASSINANTES ATIVOS"
          icon={Users}
          trend={getTrend(
            stats.users.active_this_month - stats.users.active_last_month
          )}
          trendValue={`${stats.users.active_this_month - stats.users.active_last_month} vs mês anterior`}
          variant="green"
        />

        <CyberCard
          title="ANÁLISES HOJE"
          value={stats.trades.today}
          subtitle={`Média: ${stats.trades.average_per_day}/dia`}
          icon={Activity}
          trend={getTrend(
            stats.trades.today - stats.trades.average_per_day
          )}
          trendValue={`vs média`}
          variant="magenta"
        />

        {/*
        <CyberCard
          title="MEMBROS ONLINE"
          value="847"
          subtitle="USUÁRIOS ATIVOS AGORA"
          icon={Users}
          trend="up"
          trendValue="+5.2%"
          variant="purple"
        />


        <CyberCard
          title="CUSTO GEMINI"
          value="$2.847"
          subtitle="API CALLS ESTE MÊS"
          icon={Zap}
          trend="up"
          trendValue="+8.2%"
          variant="cyan"
        />
        */}
      </div>

      {/* Grid com gráficos e cards - 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Gráfico de receita vs custos - 2 colunas */}
        {/*
        <div className="lg:col-span-2 bg-card rounded border border-gray-800 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase text-gray-600 tracking-widest">FLUXO DE CAIXA</h3>
            <p className="text-xs text-gray-700 mt-0.5">Receita vs Custos vs Lucro Líquido</p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.30 145)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(0.75 0.30 145)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
              <XAxis dataKey="month" stroke="oklch(0.60 0.10 195)" style={{ fontSize: '10px' }} />
              <YAxis stroke="oklch(0.60 0.10 195)" style={{ fontSize: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.10 0.02 240)',
                  border: '1px solid oklch(0.75 0.25 195)',
                  borderRadius: '4px',
                  fontSize: '10px'
                }}
              />
              <Area type="monotone" dataKey="receita" stroke="oklch(0.75 0.25 195)" fillOpacity={1} fill="url(#colorReceita)" strokeWidth={2} />
              <Area type="monotone" dataKey="lucro" stroke="oklch(0.75 0.30 145)" fillOpacity={1} fill="url(#colorLucro)" strokeWidth={2} />
              <Line type="monotone" dataKey="custos" stroke="oklch(0.65 0.30 25)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        */}

        {/* Card de media de analises por usuario */}
        {/*
        <div className="bg-card rounded border border-gray-800 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-gray-600 tracking-widest">MEDIA DE ANALISES</p>
            <p className="text-4xl font-bold text-cyan-400 mt-2">98</p>
            <p className="text-xs text-gray-700 mt-2">Por usuario este mes</p>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase text-gray-600 tracking-widest mt-4">BUSCAS POR USUARIO</p>
            <p className="text-3xl font-bold text-magenta-400 mt-2">152</p>
            <p className="text-xs text-gray-700 mt-2">Media mensal</p>
          </div>
        </div>
        */}
      </div>

      {/* Operações diárias - 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="bg-card rounded border border-gray-800 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase text-gray-600 tracking-widest">OPERAÇÕES DIÁRIAS</h3>
            <p className="text-xs text-gray-700 mt-0.5">Análises e Buscas por Dia</p>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={operationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
              <XAxis dataKey="day" stroke="oklch(0.60 0.10 195)" style={{ fontSize: '10px' }} />
              <YAxis stroke="oklch(0.60 0.10 195)" style={{ fontSize: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.10 0.02 240)',
                  border: '1px solid oklch(0.75 0.25 195)',
                  borderRadius: '4px',
                  fontSize: '10px'
                }}
              />
              <Bar dataKey="analises" fill="oklch(0.75 0.25 195)" radius={2} />
              <Bar dataKey="buscas" fill="oklch(0.75 0.30 145)" radius={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Custos operacionais */}
        {/*
        <div className="bg-card rounded border border-gray-800 p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold uppercase text-gray-600 tracking-widest">CUSTOS OPERACIONAIS</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700">GEMINI 3.0 API</span>
              <span className="text-sm font-bold text-pink-500">$2.847,32</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700">GOOGLE CLOUD DB</span>
              <span className="text-sm font-bold text-cyan-400">$1.234,56</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700">ASAAS TAXAS</span>
              <span className="text-sm font-bold text-yellow-500">$456,78</span>
            </div>
            <div className="border-t border-gray-800 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-gray-600">TOTAL MÊS</span>
                <span className="text-lg font-bold text-cyan-400">$4.538,66</span>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
