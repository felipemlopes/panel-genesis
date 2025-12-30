/**
 * DashboardLayout - Gênesis Labs Style (Minimalista)
 * Layout limpo com sidebar discreta, responsivo para mobile
 */

import { useState } from "react";
import { Activity, BarChart3, DollarSign, Settings, TrendingUp, Users, Zap, CreditCard, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Activity, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Métricas", path: "/metrics" },
  { icon: DollarSign, label: "Financeiro", path: "/financial" },
  { icon: Users, label: "Usuários", path: "/users" },
  { icon: TrendingUp, label: "Análises", path: "/analytics" },
  { icon: CreditCard, label: "Checkout", path: "/asaas" },
  { icon: Settings, label: "Parâmetros", path: "/parameters" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-56 bg-sidebar border-r border-accent z-50 hidden md:block">
        <div className="p-4 border-b border-accent/30">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <h1 className="text-sm font-bold text-accent">Gênesis <span className="text-xs text-muted-foreground font-normal">LABS</span></h1>
              <p className="text-xs text-muted-foreground">ADMIN PANEL</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded text-xs transition-all duration-150",
                  isActive
                    ? "bg-accent/10 border-l-2 border-accent text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-accent/30 space-y-2">
          <Link
            href="/checkout"
            className="block w-full px-3 py-2 rounded text-xs font-bold text-accent-foreground bg-accent hover:opacity-90 transition-all text-center"
          >
            Preview Checkout
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>TERMINAL ATIVO</span>
          </div>
          <p className="text-xs text-muted-foreground/60">v2.0.1 • Gemini 3.0</p>
        </div>
      </aside>

      {/* Mobile Menu - Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-56 bg-sidebar border-r border-accent z-50 md:hidden transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-accent/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <h1 className="text-sm font-bold text-accent">Gênesis <span className="text-xs text-muted-foreground font-normal">LABS</span></h1>
              <p className="text-xs text-muted-foreground">ADMIN PANEL</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 hover:bg-secondary rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded text-xs transition-all duration-150",
                  isActive
                    ? "bg-accent/10 border-l-2 border-accent text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-accent/30 space-y-2">
          <Link
            href="/checkout"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full px-3 py-2 rounded text-xs font-bold text-accent-foreground bg-accent hover:opacity-90 transition-all text-center"
          >
            Preview Checkout
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>TERMINAL ATIVO</span>
          </div>
          <p className="text-xs text-muted-foreground/60">v2.0.1 • Gemini 3.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-56">
        {/* Header - Responsivo */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-accent/30">
          <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-foreground truncate">
                  {navItems.find(item => item.path === location)?.label || "Dashboard"}
                </h2>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Sistema de Gestão • Cripto.ico
                </p>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <div className="px-2 md:px-3 py-1.5 bg-secondary rounded border border-accent/30 whitespace-nowrap">
                <p className="text-xs text-muted-foreground hidden sm:block">COTAÇÃO USD/BRL</p>
                <p className="text-xs md:text-sm font-bold text-accent">R$ 5.53</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Responsivo */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
