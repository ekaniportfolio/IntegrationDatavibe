import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useState, useEffect } from "react";
import { useTranslation } from "../language-provider";

const data = [
  { date: "01 Jan", instagram: 12000, tiktok: 8500, youtube: 5000 },
  { date: "08 Jan", instagram: 12500, tiktok: 9200, youtube: 5100 },
  { date: "15 Jan", instagram: 13200, tiktok: 10500, youtube: 5300 },
  { date: "22 Jan", instagram: 14100, tiktok: 12800, youtube: 5600 },
  { date: "29 Jan", instagram: 14800, tiktok: 14200, youtube: 5900 },
  { date: "05 Feb", instagram: 15500, tiktok: 16500, youtube: 6200 },
  { date: "12 Feb", instagram: 16100, tiktok: 18900, youtube: 6500 },
  { date: "19 Feb", instagram: 16900, tiktok: 21500, youtube: 6900 },
];

export function FollowerGrowthChart() {
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
            <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.followerGrowth')}</h3>
            <p className="text-sm text-muted-foreground">{t('chart.followerGrowthSubtitle')}</p>
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
          <h3 className="text-lg font-bold text-foreground font-manrope">{t('chart.followerGrowth')}</h3>
          <p className="text-sm text-muted-foreground">{t('chart.followerGrowthSubtitle')}</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full min-w-[100px]" style={{ height: 250, width: '100%', minWidth: '100px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
          <LineChart data={data}>
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
            <Legend iconType="circle" />
            
            <Line 
              type="monotone" 
              dataKey="instagram" 
              name="Instagram"
              stroke="#E1306C" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
            />
            <Line 
              type="monotone" 
              dataKey="tiktok" 
              name="TikTok"
              stroke="#00F2EA" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
            />
            <Line 
              type="monotone" 
              dataKey="youtube" 
              name="YouTube"
              stroke="#FF0000" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}