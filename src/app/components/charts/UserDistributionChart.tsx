import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts";
import { SmartCard } from "../common/SmartCard";
import { Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "../language-provider";

const data = [
  { name: "18-24", value: 4000 },
  { name: "25-34", value: 3000 },
  { name: "35-44", value: 2000 },
  { name: "45-54", value: 2780 },
  { name: "55+", value: 1890 },
];

const COLORS = ['#344BFD', '#F68D2B', '#30B77C', '#F4A79D', '#6670FF'];

export function UserDistributionChart() {
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
      <SmartCard 
        title={t('dashboard.demographics')} 
        subtitle={t('dashboard.ageDistribution')}
        icon={Users}
        className="col-span-full md:col-span-6 lg:col-span-4 min-h-[400px]"
      >
        <div className="h-[300px] w-full mt-4 min-w-[100px] bg-muted/10 animate-pulse rounded-md" />
      </SmartCard>
    );
  }

  return (
    <SmartCard 
      title={t('dashboard.demographics')} 
      subtitle={t('dashboard.ageDistribution')}
      icon={Users}
      className="col-span-full md:col-span-6 lg:col-span-4 min-h-[400px]"
    >
      <div className="h-[300px] w-full mt-4 min-w-[100px]" style={{ height: 300, width: '100%', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: "hsl(var(--popover))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--popover-foreground))" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry,yb) => (
                <Cell key={`cell-${yb}`} fill={COLORS[yb % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SmartCard>
  );
}