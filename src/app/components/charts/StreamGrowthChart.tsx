import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "../language-provider";

export interface StreamDataPoint {
  date: string;
  streams: number;
}

const DEFAULT_DATA: StreamDataPoint[] = [
  { date: "01 Jan", streams: 45000 },
  { date: "05 Jan", streams: 52000 },
  { date: "10 Jan", streams: 49000 },
  { date: "15 Jan", streams: 62000 },
  { date: "20 Jan", streams: 58000 },
  { date: "25 Jan", streams: 71000 },
  { date: "30 Jan", streams: 68000 },
  { date: "05 Feb", streams: 85000 },
  { date: "10 Feb", streams: 92000 },
  { date: "15 Feb", streams: 88000 },
  { date: "20 Feb", streams: 105000 },
  { date: "25 Feb", streams: 120000 },
];

interface StreamGrowthChartProps {
  data?: StreamDataPoint[];
  loading?: boolean;
}

export function StreamGrowthChart({ data = DEFAULT_DATA, loading = false }: StreamGrowthChartProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate initial loading if no loading prop provided
    if (!loading) {
        const timer = setTimeout(() => {
            setMounted(true);
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [loading]);

  const isLoading = loading || (!mounted && loading === undefined);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-[350px] w-full bg-dashboard-card-bg border border-border rounded-xl p-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.streamGrowth')}</h3>
          <p className="text-sm text-muted-foreground">{t('chart.streamGrowthSubtitle')}</p>
        </div>
        <div className="flex gap-1 bg-foreground/[0.04] p-1 rounded-lg">
            <button className="text-xs font-medium px-3 py-1 bg-datavibe-primary text-white rounded-md shadow-sm">30J</button>
            <button className="text-xs font-medium px-3 py-1 hover:bg-foreground/[0.06] text-muted-foreground rounded-md transition-colors">90J</button>
            <button className="text-xs font-medium px-3 py-1 hover:bg-foreground/[0.06] text-muted-foreground rounded-md transition-colors">12M</button>
        </div>
      </div>
      
      <div className="h-[250px] w-full min-w-[100px] relative">
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div 
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                >
                     <Skeleton className="h-full w-full rounded-md bg-foreground/[0.04]" />
                </motion.div>
            ) : (
                <motion.div
                    key="chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full w-full"
                >
                    <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                    <AreaChart data={data}>
                        <defs>
                        <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#344BFD" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#344BFD" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                        dataKey="date" 
                        stroke="#A1A1AA" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={15}
                        />
                        <YAxis 
                        stroke="#A1A1AA" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                        contentStyle={{ backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        labelStyle={{ color: "#A1A1AA" }}
                        />
                        <Area 
                        type="monotone" 
                        dataKey="streams" 
                        stroke="#344BFD" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorStreams)" 
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}