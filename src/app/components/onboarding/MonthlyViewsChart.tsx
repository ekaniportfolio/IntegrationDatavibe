import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from "motion/react";
import { getDynamicDateRange } from "../../utils/dateUtils";
import { MOCK_DASHBOARD_STREAMING } from "../../data/mock-backend";
import { useTranslation } from "../language-provider";

/**
 * @backend Data comes from MOCK_DASHBOARD_STREAMING.monthlyViewsChart (mock-backend.ts).
 * Replace with: GET /api/v1/artist/:id/dashboard/streaming → monthlyViewsChart
 */

interface MonthlyViewsChartProps {
    data?: { x: number; uprate: number; abattement: number }[];
}

export function MonthlyViewsChart({ data = MOCK_DASHBOARD_STREAMING.monthlyViewsChart }: MonthlyViewsChartProps) {
    const { t } = useTranslation();
    return (
        <div className="w-full h-[340px] bg-dashboard-card-bg border border-border rounded-[12px] p-[20px] relative overflow-hidden flex flex-col justify-between">
            {/* Header */}
            <div className="flex flex-col items-center justify-center w-full z-10 mb-4">
                <h3 className="text-foreground font-manrope font-bold text-[14px]">{t('dashboard.chartTitle')}</h3>
                <p className="text-foreground font-manrope font-normal text-[10px] opacity-80">{getDynamicDateRange(30)}</p>
            </div>

            {/* Chart */}
            <div className="absolute inset-0 w-full h-full pt-[60px] pb-[40px] px-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUprate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#30B77C" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#30B77C" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAbattement" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF2222" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FF2222" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={true} horizontal={false} stroke="var(--border)" strokeOpacity={0.5} />
                        <Area 
                            type="monotone" 
                            dataKey="uprate" 
                            stroke="#30B77C" 
                            fillOpacity={1} 
                            fill="url(#colorUprate)" 
                            strokeWidth={2}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="abattement" 
                            stroke="#FF2222" 
                            fillOpacity={1} 
                            fill="url(#colorAbattement)" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 w-full z-10 mt-auto">
                <div className="flex items-center gap-2">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#30B77C]"></div>
                    <span className="text-foreground text-[12px] font-bold">{t('dashboard.chartUprate')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#FF2222]"></div>
                    <span className="text-foreground text-[12px] font-bold">{t('dashboard.chartAbattement')}</span>
                </div>
            </div>
        </div>
    );
}