/**
 * Metrics - Página de métricas operacionais
 * Análise detalhada de uso, performance e custos
 */

import CyberCard from "@/components/CyberCard";
import { Activity, Zap, TrendingUp, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Dados simulados
const hourlyData = [
  { hour: "00h", operations: 45 },
  { hour: "01h", operations: 32 },
  { hour: "02h", operations: 28 },
  { hour: "03h", operations: 22 },
  { hour: "04h", operations: 35 },
  { hour: "05h", operations: 58 },
  { hour: "06h", operations: 95 },
  { hour: "07h", operations: 142 },
  { hour: "08h", operations: 185 },
  { hour: "09h", operations: 220 },
  { hour: "10h", operations: 245 },
  { hour: "11h", operations: 238 },
  { hour: "12h", operations: 195 },
  { hour: "13h", operations: 210 },
  { hour: "14h", operations: 232 },
  { hour: "15h", operations: 248 },
  { hour: "16h", operations: 265 },
  { hour: "17h", operations: 242 },
  { hour: "18h", operations: 198 },
  { hour: "19h", operations: 165 },
  { hour: "20h", operations: 142 },
  { hour: "21h", operations: 118 },
  { hour: "22h", operations: 95 },
  { hour: "23h", operations: 68 },
];

const operationTypes = [
  { name: "Análises", value: 1523, color: "oklch(0.70 0.35 330)" },
  { name: "Buscas", value: 4280, color: "oklch(0.75 0.30 145)" },
];

const performanceData = [
  { day: "Seg", avgTime: 2.3, success: 98.5 },
  { day: "Ter", avgTime: 2.1, success: 99.2 },
  { day: "Qua", avgTime: 2.4, success: 98.8 },
  { day: "Qui", avgTime: 2.2, success: 99.1 },
  { day: "Sex", avgTime: 2.5, success: 98.3 },
  { day: "Sáb", avgTime: 2.0, success: 99.5 },
  { day: "Dom", avgTime: 1.9, success: 99.6 },
];

const topAssets = [
  { symbol: "BTC", analyses: 342, searches: 890 },
  { symbol: "ETH", analyses: 298, searches: 765 },
  { symbol: "SOL", analyses: 245, searches: 612 },
  { symbol: "BNB", analyses: 198, searches: 523 },
  { symbol: "XRP", analyses: 176, searches: 445 },
];

export default function Metrics() {
  const totalOps = operationTypes.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="space-y-8">
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CyberCard
          title="OPERAÇÕES HOJE"
          value="5.803"
          subtitle="ANÁLISES + BUSCAS"
          icon={Activity}
          trend="up"
          trendValue="+8.2% vs ontem"
          variant="cyan"
        />
        
        <CyberCard
          title="TEMPO MÉDIO"
          value="2.2s"
          subtitle="RESPOSTA DAS ANÁLISES"
          icon={Clock}
          trend="down"
          trendValue="-0.3s melhor"
          variant="green"
        />
        
        <CyberCard
          title="TAXA DE SUCESSO"
          value="98.9%"
          subtitle="OPERAÇÕES CONCLUÍDAS"
          icon={TrendingUp}
          trend="up"
          trendValue="+0.4%"
          variant="magenta"
        />
        
        <CyberCard
          title="PICO DE USO"
          value="16:00"
          subtitle="265 OPERAÇÕES/HORA"
          icon={Zap}
          variant="purple"
        />
      </div>

      {/* Gráfico de operações por hora */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-primary neon-text">Operações por Hora (Últimas 24h)</h3>
          <p className="text-sm text-muted-foreground mono">Distribuição temporal de uso</p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
            <XAxis 
              dataKey="hour" 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis 
              stroke="oklch(0.60 0.10 195)" 
              style={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }}
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
            <Line 
              type="monotone" 
              dataKey="operations" 
              stroke="oklch(0.75 0.25 195)" 
              strokeWidth={3}
              dot={{ fill: 'oklch(0.75 0.25 195)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid de análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de operações */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-accent neon-text">Distribuição de Operações</h3>
            <p className="text-sm text-muted-foreground mono">Análises vs Buscas</p>
          </div>
          
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={operationTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {operationTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.10 0.02 240)',
                    border: '1px solid oklch(0.75 0.30 145)',
                    borderRadius: '4px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {operationTypes.map((item) => (
              <div key={item.name} className="bg-secondary rounded p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="text-sm text-muted-foreground mono">{item.name}</p>
                </div>
                <p className="text-2xl font-bold mono">{item.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mono">
                  {((item.value / totalOps) * 100).toFixed(1)}% do total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance semanal */}
        <div className="bg-card rounded border border-border neon-border p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-chart-4 neon-text">Performance Semanal</h3>
            <p className="text-sm text-muted-foreground mono">Tempo de resposta e taxa de sucesso</p>
          </div>
          
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.95 0 0 / 0.1)" />
              <XAxis 
                dataKey="day" 
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
              <Bar dataKey="avgTime" fill="oklch(0.60 0.30 290)" radius={[4, 4, 0, 0]} name="Tempo Médio (s)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded p-4 text-center">
              <p className="text-sm text-muted-foreground mono mb-1">Tempo Médio</p>
              <p className="text-2xl font-bold mono text-chart-4">2.2s</p>
            </div>
            <div className="bg-secondary rounded p-4 text-center">
              <p className="text-sm text-muted-foreground mono mb-1">Taxa de Sucesso</p>
              <p className="text-2xl font-bold mono text-accent">98.9%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top ativos analisados */}
      <div className="bg-card rounded border border-border neon-border p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-chart-3 neon-text">Top 5 Criptoativos</h3>
          <p className="text-sm text-muted-foreground mono">Mais analisados e buscados</p>
        </div>

        <div className="space-y-4">
          {topAssets.map((asset, idx) => (
            <div key={asset.symbol} className="flex items-center gap-4 p-4 bg-secondary rounded hover:bg-secondary/70 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded neon-border">
                <span className="text-lg font-bold mono text-primary">#{idx + 1}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-lg font-bold mono text-primary">{asset.symbol}</p>
                <p className="text-xs text-muted-foreground mono">Criptoativo</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mono">Análises</p>
                <p className="text-xl font-bold mono text-chart-3">{asset.analyses}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mono">Buscas</p>
                <p className="text-xl font-bold mono text-accent">{asset.searches}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground mono">Total</p>
                <p className="text-xl font-bold mono text-primary">{asset.analyses + asset.searches}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
