/**
 * CyberCard - Card minimalista Gênesis Labs
 * Bordas cinza discretas, sem cores chamativas, responsivo para mobile
 */

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CyberCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "cyan" | "green" | "magenta" | "yellow" | "red" | "purple";
  className?: string;
}

const variantStyles = {
  cyan: {
    text: "text-cyan-500",
  },
  green: {
    text: "text-gray-600",
  },
  magenta: {
    text: "text-pink-500",
  },
  yellow: {
    text: "text-yellow-500",
  },
  red: {
    text: "text-red-500",
  },
  purple: {
    text: "text-purple-500",
  },
};

export default function CyberCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = "cyan",
  className,
}: CyberCardProps) {
  const style = variantStyles[variant];
  const trendColor = trend === "up" ? "text-gray-600" : trend === "down" ? "text-red-500" : "text-gray-500";

  return (
    <div
      className={cn(
        "relative bg-card border border-gray-800 rounded-md transition-all duration-150",
        "hover:opacity-90",
        className
      )}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-xs font-bold uppercase tracking-widest text-gray-600 mono-label truncate">{title}</p>
            {subtitle && (
              <p className="text-xs sm:text-xs text-gray-700 mt-0.5 mono truncate">{subtitle}</p>
            )}
          </div>
          {Icon && <Icon className={cn("w-3 h-3 sm:w-4 sm:h-4 opacity-70 flex-shrink-0", style.text)} />}
        </div>

        <div className="space-y-0.5">
          <p className={cn("text-xl sm:text-2xl font-bold break-words", style.text)} style={{fontFamily: 'Inter, sans-serif'}}>{value}</p>
        
          {trendValue && (
            <p className={cn("text-xs font-semibold", trendColor)}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {trendValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
