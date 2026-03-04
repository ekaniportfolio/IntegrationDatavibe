import { motion } from "motion/react";
import { Headphones, Eye, Music, LucideIcon } from "lucide-react";
import { MonthlyViewsChart } from "./MonthlyViewsChart";
import { StreamingPlatformDistribution } from "../streaming/StreamingPlatformDistribution";
import { useTranslation } from "../language-provider";

export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  subValue: string;
}

export interface StreamingStat {
  label: string;
  value: number;
  growth: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

const DEFAULT_CHART_DATA: ChartDataPoint[] = [
    { name: 'Youtube', value: 55, color: '#344BFD', subValue: '55%' },
    { name: 'Facebook', value: 25, color: '#F68D2B', subValue: '25%' },
    { name: 'Spotify', value: 20, color: '#FFFFFF', subValue: '20%' },
];

const childSlideVariants = {
    enter: (dir: number) => ({ 
        x: dir > 0 ? -300 : 300, 
        y: 30, 
        opacity: 0, 
        filter: "blur(4px)" 
    }),
    center: { 
        x: 0, 
        y: 0, 
        opacity: 1, 
        filter: "blur(0px)",
        transition: { 
            type: "spring", stiffness: 95, damping: 16, mass: 1 
        } 
    },
    exit: (dir: number) => ({ 
        x: dir > 0 ? 300 : -300, 
        y: 30, 
        opacity: 0, 
        filter: "blur(4px)",
        transition: { duration: 0.35, ease: "easeInOut" } 
    })
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

interface StreamingPerformanceUnifiedProps {
    hideChart?: boolean;
    hideStats?: boolean;
    direction?: number;
    chartData?: ChartDataPoint[];
    statsData?: StreamingStat[];
}

export function StreamingPerformanceUnified({ 
    hideChart = false, 
    hideStats = false, 
    direction = 0,
    chartData = DEFAULT_CHART_DATA,
    statsData
}: StreamingPerformanceUnifiedProps) {
    const { t } = useTranslation();
    
    // Translate default stats labels reactively
    const resolvedStats = statsData || [
        { 
            label: t("dashboard.uniqueMonthlyListeners"), 
            value: 113100, 
            growth: 12.5,
            icon: Headphones, 
            iconColor: "#FF5222", 
            iconBg: "rgba(255,82,34,0.2)" 
        },
        { 
            label: t("dashboard.avgMonthlyViews"), 
            value: 792400, 
            growth: -5.2,
            icon: Eye, 
            iconColor: "#FF5222", 
            iconBg: "rgba(255,82,34,0.2)" 
        },
        { 
            label: t("dashboard.weightedStreamsTotal"), 
            value: 165800, 
            growth: 8.7,
            icon: Music, 
            iconColor: "#FF5222", 
            iconBg: "rgba(255,82,34,0.2)" 
        },
    ];

    return (
        <motion.div 
            className="flex flex-col gap-4 w-full"
            variants={{
                enter: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
                center: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
                exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
        >
            {/* Stats Block */}
            {!hideStats && (
                <motion.div 
                    custom={direction}
                    variants={childSlideVariants}
                    className="relative rounded-[24px] w-full overflow-hidden"
                    style={{ 
                        backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)",
                        border: "1px solid rgba(242,142,66,0.6)"
                    }}
                >
                    <div className="flex flex-col gap-[12px] p-[20px] px-[14px]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-foreground font-manrope font-bold text-[16px]">{t('dashboard.performanceOverview')}</h3>
                            <span className="text-[12px] text-muted-foreground font-manrope">{t('period.last30days')}</span>
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            {resolvedStats.map((stat, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.15 }}
                                    className="bg-[rgba(242,142,66,0.1)] rounded-[12px] w-full p-[14px] py-[16px] flex items-center justify-between hover:bg-[rgba(242,142,66,0.2)] transition-colors group cursor-default"
                                >
                                    <div className="flex flex-col gap-[4px]">
                                        <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">
                                            {stat.label}
                                        </p>
                                        <div className="flex items-end gap-2">
                                            <p className="text-[20px] font-manrope font-bold text-foreground leading-none">
                                                {formatNumber(stat.value)}
                                            </p>
                                            <div className={`flex items-center text-[11px] font-bold mb-[2px] ${stat.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>
                                                {stat.growth > 0 ? '+' : ''}{stat.growth}%
                                            </div>
                                        </div>
                                    </div>
                                    <div 
                                        className="h-[44px] w-[44px] rounded-[10px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                        style={{ backgroundColor: stat.iconBg }}
                                    >
                                        <stat.icon size={22} color={stat.iconColor} strokeWidth={2} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Platform Distribution Chart & Monthly Views Chart */}
            {!hideChart && (
                <>
                    <motion.div custom={direction} variants={childSlideVariants}>
                        <StreamingPlatformDistribution 
                            title={t('dashboard.platformDistribution')} 
                            data={chartData} 
                        />
                    </motion.div>

                    <motion.div custom={direction} variants={childSlideVariants} className="w-full">
                        <MonthlyViewsChart />
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}