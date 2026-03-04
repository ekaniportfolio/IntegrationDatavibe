import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useTranslation } from "../language-provider";

export function AirplayChart() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const data = [
    { day: t('day.mon'), spins: 120 },
    { day: t('day.tue'), spins: 145 },
    { day: t('day.wed'), spins: 132 },
    { day: t('day.thu'), spins: 155 },
    { day: t('day.fri'), spins: 190 },
    { day: t('day.sat'), spins: 210 },
    { day: t('day.sun'), spins: 185 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[350px] w-full bg-dashboard-card-bg border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.airplayTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('chart.airplaySubtitle')}</p>
          </div>
        </div>
        <div className="h-[250px] w-full min-w-[100px] bg-foreground/[0.04] animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full bg-dashboard-card-bg border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.airplayTitle')}</h3>
          <p className="text-sm text-muted-foreground">{t('chart.airplaySubtitle')}</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full min-w-[100px]" style={{ height: 250, width: '100%', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="day" 
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
            />
            <Tooltip
              cursor={{fill: 'rgba(255,255,255,0.05)'}}
              contentStyle={{ backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ color: "#A1A1AA" }}
            />
            <Legend iconType="circle" />
            
            <Bar 
              dataKey="spins" 
              name={t('chart.airplayLegend')} 
              fill="#F68D2B" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}