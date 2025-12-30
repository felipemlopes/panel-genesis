/**
 * Financial - Página de análise financeira
 * Receitas, custos, margens e projeções
 */

import CyberCard from "@/components/CyberCard";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

// Dados simulados
const monthlyRevenue = [
  { month: "Jan", assinaturas: 45000, creditos: 40000, total: 85000 },
  { month: "Fev", assinaturas: 48000, creditos: 44000, total: 92000 },
  { month: "Mar", assinaturas: 52000, creditos: 56000, total: 108000 },
  { month: "Abr", assinaturas: 58000, creditos: 67000, total: 125000 },
  { month: "Mai", assinaturas: 62000, creditos: 80000, total: 142000 },
  { month: "Jun", assinaturas: 68000, creditos: 90000, total: 158000 },
];

const costBreakdown = [
  { category: "Gemini API", value: 15784, percentage: 35.2 },
  { category: "Google Cloud", value: 4689, percentage: 10.5 },
  { category: "Asaas Gateway", value: 14287, percentage: 31.9 },
  { category: "Infraestrutura", value: 6842, percentage: 15.3 },
  { category: "Outros", value: 3198, percentage: 7.1 },
];

const projectionData = [
  { month: "Jul", conservador: 165000, realista: 178000, otimista: 195000 },
  { month: "Ago", conservador: 172000, realista: 192000, otimista: 218000 },
  { month: "Set", conservador: 180000, realista: 208000, otimista: 245000 },
  { month: "Out", conservador: 188000, realista: 225000, otimista: 278000 },
  { month: "Nov", conservador: 195000, realista: 245000, otimista: 315000 },
  { month: "Dez", conservador: 205000, realista: 268000, otimista: 358000 },
];

export default function Financial() {
  const totalRevenue = 1299312;
  const totalCosts = 44800;
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Cards de métricas financeiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CyberCard
          title="RECEITA TOTAL"
          value={`R$ ${(totalRevenue / 1000).toFixed(0)}k`}
          subtitle="ÚLTIMOS 30 DIAS"
          icon={DollarSign}
          trend="up"
          trendValue="+18.5%"
          variant="cyan"
        />
        
        <CyberCard
          title="CUSTOS TOTAIS"
          value={`R$ ${(totalCosts / 1000).toFixed(0)}k`}
          subtitle="OPERACIONAIS + INFRAESTRUTURA"
          icon={TrendingDown}
          trend="up"
          trendValue="+8.2%"
          variant="red"
        />
        
        <CyberCard
          title="LUCRO LÍQUIDO"
          value={`R$ ${(netProfit / 1000).toFixed(0)}k`}
          subtitle="APÓS TODOS OS CUSTOS"
          icon={TrendingUp}
          trend="up"
          trendValue="+21.3%"
          variant="green"
        />
        
        <CyberCard
          title="MARGEM LÍQUIDA"
          value={`${profitMargin}%`}
          subtitle="RENTABILIDADE"
          icon={PieChart}
          trend="up"
          trendValue="+2.1%"
          variant="magenta"
        />
      </div>

      {/* Gráfico de receita mensal */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary neon-text">Evolução de Receita</h3>
          <p className="text-sm text-muted-foreground mono">Assinaturas vs Venda de Créditos</p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="colorAssinaturas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="oklch(0.75 0.25 195)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCreditos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.75 0.30 145)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="oklch(0.75 0.30 145)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.10 0.02 240)',
                border: '1px solid oklch(0.75 0.25 195)',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="assinaturas" 
              stackId="1"
              stroke="oklch(0.75 0.25 195)" 
              fill="url(#colorAssinaturas)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="creditos" 
              stackId="1"
              stroke="oklch(0.75 0.30 145)" 
              fill="url(#colorCreditos)" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="oklch(0.85 0.30 100)" 
              strokeWidth={3}
              dot={{ fill: 'oklch(0.85 0.30 100)', r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-secondary rounded p-4 text-center">
            <p className="text-sm text-muted-foreground mono mb-1">Assinaturas</p>
            <p className="text-2xl font-bold mono text-primary">R$ 68k</p>
            <p className="text-xs text-muted-foreground mono">43% do total</p>
          </div>
          <div className="bg-secondary rounded p-4 text-center">
            <p className="text-sm text-muted-foreground mono mb-1">Créditos</p>
            <p className="text-2xl font-bold mono text-accent">R$ 90k</p>
            <p className="text-xs text-muted-foreground mono">57% do total</p>
          </div>
          <div className="bg-secondary rounded p-4 text-center">
            <p className="text-sm text-muted-foreground mono mb-1">Total</p>
            <p className="text-2xl font-bold mono text-chart-5">R$ 158k</p>
            <p className="text-xs text-accent mono">+26.8% vs mês anterior</p>
          </div>
        </div>
      </div>

      {/* Grid de análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown de custos */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-destructive neon-text">Breakdown de Custos</h3>
            <p className="text-sm text-muted-foreground mono">Distribuição por categoria</p>
          </div>

          <div className="space-y-3">
            {costBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm mono font-bold text-destructive">
                    R$ {item.value.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-secondary rounded border border-destructive/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium mono">TOTAL DE CUSTOS</span>
              <span className="text-2xl font-bold mono text-destructive">
                R$ {costBreakdown.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Análise de margem */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-accent neon-text">Análise de Margem</h3>
            <p className="text-sm text-muted-foreground mono">Receita vs Custo vs Lucro</p>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary rounded p-6">
              <p className="text-sm text-muted-foreground mono mb-2">Receita Bruta</p>
              <p className="text-4xl font-bold mono text-primary">R$ 1.299.312</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-destructive rounded" />
              <span className="text-sm mono text-muted-foreground">menos</span>
            </div>

            <div className="bg-secondary rounded p-6">
              <p className="text-sm text-muted-foreground mono mb-2">Custos Totais</p>
              <p className="text-4xl font-bold mono text-destructive">R$ 44.800</p>
              <p className="text-xs text-muted-foreground mono mt-2">3.4% da receita</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-accent rounded" />
              <span className="text-sm mono text-muted-foreground">igual</span>
            </div>

            <div className="bg-accent/10 rounded p-6 border border-accent">
              <p className="text-sm text-muted-foreground mono mb-2">Lucro Líquido</p>
              <p className="text-4xl font-bold mono text-accent">R$ 1.254.512</p>
              <p className="text-xs text-accent mono mt-2">Margem de {profitMargin}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projeção financeira */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-chart-4 neon-text">Projeção de Receita (6 meses)</h3>
          <p className="text-sm text-muted-foreground mono">Cenários: Conservador, Realista e Otimista</p>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(0.10 0.02 240)',
                border: '1px solid oklch(0.60 0.30 290)',
                borderRadius: '4px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="conservador" 
              stroke="oklch(0.65 0.30 25)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="realista" 
              stroke="oklch(0.75 0.25 195)" 
              strokeWidth={3}
            />
            <Line 
              type="monotone" 
              dataKey="otimista" 
              stroke="oklch(0.75 0.30 145)" 
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-secondary rounded p-4 text-center">
            <p className="text-sm text-muted-foreground mono mb-1">Conservador</p>
            <p className="text-2xl font-bold mono text-destructive">R$ 205k</p>
            <p className="text-xs text-muted-foreground mono">+29.7% em 6 meses</p>
          </div>
          <div className="bg-secondary rounded p-4 text-center border border-primary">
            <p className="text-sm text-muted-foreground mono mb-1">Realista</p>
            <p className="text-2xl font-bold mono text-primary">R$ 268k</p>
            <p className="text-xs text-accent mono">+69.6% em 6 meses</p>
          </div>
          <div className="bg-secondary rounded p-4 text-center">
            <p className="text-sm text-muted-foreground mono mb-1">Otimista</p>
            <p className="text-2xl font-bold mono text-accent">R$ 358k</p>
            <p className="text-xs text-muted-foreground mono">+126.6% em 6 meses</p>
          </div>
        </div>
      </div>
    </div>
  );
}
