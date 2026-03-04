import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useTranslation } from "../language-provider";

const data = [
  { age: "13-17", male: 15, female: 25 },
  { age: "18-24", male: 35, female: 45 },
  { age: "25-34", male: 30, female: 20 },
  { age: "35-44", male: 15, female: 8 },
  { age: "45+", male: 5, female: 2 },
];

export function DemographicsChart() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

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
            <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.demographics')}</h3>
            <p className="text-sm text-muted-foreground">{t('chart.demographicsSubtitle')}</p>
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
          <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.demographics')}</h3>
          <p className="text-sm text-muted-foreground">{t('chart.demographicsSubtitle')}</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full min-w-[100px]" style={{ height: 250, width: '100%', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
            <XAxis 
              type="number"
              stroke="#A1A1AA" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="age" 
              type="category"
              stroke="#fff" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: "#141414", border: "1px solid #27272a", borderRadius: "8px" }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ color: "#A1A1AA" }}
            />
            <Legend iconType="circle" />
            
            <Bar 
              dataKey="female" 
              name={t('chart.women')} 
              fill="#F68D2B" 
              radius={[0, 4, 4, 0]} 
              barSize={12}
            />
            <Bar 
              dataKey="male" 
              name={t('chart.men')} 
              fill="#344BFD" 
              radius={[0, 4, 4, 0]} 
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}