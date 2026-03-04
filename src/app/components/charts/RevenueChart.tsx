import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SmartCard } from "../common/SmartCard";
import { Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "../language-provider";

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const data = [
    { name: t("day.mon"), streams: 4000, revenue: 2400 },
    { name: t("day.tue"), streams: 3000, revenue: 1398 },
    { name: t("day.wed"), streams: 2000, revenue: 9800 },
    { name: t("day.thu"), streams: 2780, revenue: 3908 },
    { name: t("day.fri"), streams: 1890, revenue: 4800 },
    { name: t("day.sat"), streams: 2390, revenue: 3800 },
    { name: t("day.sun"), streams: 3490, revenue: 4300 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <SmartCard 
        title={t('dashboard.audienceEvolution')} 
        subtitle={t('dashboard.streamsRevenue7days')}
        icon={Activity}
        className="col-span-full lg:col-span-8 min-h-[400px]"
      >
        <div className="h-[300px] w-full mt-4 min-w-[100px] bg-muted/10 animate-pulse rounded-md" />
      </SmartCard>
    );
  }

  return (
    <SmartCard 
      title={t('dashboard.audienceEvolution')} 
      subtitle={t('dashboard.streamsRevenue7days')}
      icon={Activity}
      className="col-span-full lg:col-span-8 min-h-[400px]"
    >
      <div className="h-[300px] w-full mt-4 min-w-[100px]" style={{ height: 300, width: '100%', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#344BFD" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#344BFD" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F68D2B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F68D2B" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `${value / 1000}k`} 
            />
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Area 
              type="monotone" 
              dataKey="streams" 
              stroke="#344BFD" 
              fillOpacity={1} 
              fill="url(#colorStreams)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#F68D2B" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SmartCard>
  );
}