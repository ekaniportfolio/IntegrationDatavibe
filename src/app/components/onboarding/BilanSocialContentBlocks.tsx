import { forwardRef, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Users, Heart, Share2, TrendingUp,
    CalendarDays, Calendar, CalendarRange,
    LayoutDashboard, Activity, UserCheck
} from "lucide-react";
import { ShareBilanButton } from "./ShareBilanButton";
import { MOCK_BILAN_SOCIAL, type BilanSocialData } from "../../data/mock-backend";
import { useI18nBilan } from "./useI18nBilan";

/**
 * ============================================================================
 * BILAN SOCIAL CONTENT BLOCKS — Réseaux Summary by Period
 * ============================================================================
 * 
 * @backend All data comes from MOCK_BILAN_SOCIAL (mock-backend.ts).
 * Replace with: GET /api/v1/artist/:id/bilan/social?period=mois
 * The frontend applies PERIOD_MULTIPLIER to base monthly values.
 * Growth rates are relative (%) and remain invariant across periods.
 * 
 * PERIOD MULTIPLIERS (applied to base monthly values):
 * - Semaine:   0.23  (~ 1/4.3 — one week is ~23% of a month)
 * - Mois:      1.0   (base monthly values — identical to full dashboard data)
 * - Trimestre: 3.0   (3 months aggregated)
 * 
 * DATA SOURCES (from full dashboard sub-tabs of Social):
 * 
 * 1. Bloc Vue d'ensemble:
 *    - Followers:     base = 1,100,000 (from DashboardBodySlot social stats)
 *    - Like / Post:   base = 17,100   (from DashboardBodySlot social stats)
 *    - Engagement:    2%              (invariant — relative rate)
 *    Growth rates remain constant (relative %) regardless of period.
 * 
 * 2. Bloc Engagement (summary of sub-tab "dashboard"):
 *    - Impressions totales: base = 2,450,000 (SocialPerformanceOverview)
 *    - Portée organique:    base = 890,000   (SocialPerformanceOverview)
 *    - Interactions:        base = 156,000   (SocialEngagementCard)
 *    Formula: stat.value x PERIOD_MULTIPLIER[period], growth % invariant
 * 
 * 3. Bloc Abonnés (summary of sub-tab "subscribers"):
 *    - Platform distribution: Instagram 42%, YouTube 28%, TikTok 20%, X 10%
 *    - Top platform growth: Instagram +2.3%, YouTube +1.8%
 *    Formula: follower counts x PERIOD_MULTIPLIER for growth numbers
 * 
 * 4. Bloc Démographie (summary of sub-tab "demographics"):
 *    - Gender split: Femmes 58%, Hommes 39%, Autre 3%
 *    - Age brackets: 18-24 (35%), 25-34 (42%), 35-44 (15%), 45+ (8%)
 *    Invariant to period (percentages)
 * ============================================================================
 */

type BilanPeriod = 'semaine' | 'mois' | 'trimestre';

const PERIOD_MULTIPLIER: Record<BilanPeriod, number> = {
    semaine: 0.23,
    mois: 1.0,
    trimestre: 3.0
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
};

// -- Date range generator based on period --
const getDateRangeForPeriod = (period: BilanPeriod): string => {
    const today = new Date();
    const past = new Date(today);
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
    
    if (period === 'semaine') past.setDate(today.getDate() - 7);
    else if (period === 'mois') past.setDate(today.getDate() - 30);
    else past.setDate(today.getDate() - 90);
    
    return `${past.getDate()} ${months[past.getMonth()]} - ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
};

// -- Period index map for Spatial Flow direction --
const PERIOD_INDEX: Record<BilanPeriod, number> = {
    semaine: 0,
    mois: 1,
    trimestre: 2
};

// -- Animation variants --
const blockVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "circOut" as const } }
};

const PERIOD_STAGGER = 0.06;
const getSpatialFlowVariants = (direction: number, staggerIndex: number = 0) => ({
    initial: { opacity: 0, x: direction > 0 ? -60 : 60, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" as const, delay: staggerIndex * PERIOD_STAGGER } },
    exit: { opacity: 0, x: direction > 0 ? 60 : -60, filter: "blur(4px)", transition: { duration: 0.2, delay: staggerIndex * PERIOD_STAGGER * 0.5 } }
});

// -- Social theme colors --
const SOCIAL_COLORS = {
    blockBg: "rgba(28, 180, 91, 0.1)",
    blockBorder: "rgba(28, 180, 91, 0.6)",
    gradient: "linear-gradient(90.7768deg, rgba(28, 180, 91, 0.1) 1.5047%, rgba(16, 185, 129, 0.2) 98.378%)",
    innerBg: "rgba(28, 180, 91, 0.1)",
    accent: "#1CB45B",
    accentRgba: "rgba(28, 180, 91, 0.2)",
    statBg: "rgba(28, 180, 91, 0.15)"
};

// ============================================================================
// SUB-COMPONENT: Period Tabs (Semaine / Mois / Trimestre) — Social themed
// ============================================================================
interface BilanPeriodTabsProps {
    activePeriod: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
}

const BilanSocialPeriodTabs = forwardRef<HTMLDivElement, BilanPeriodTabsProps>(
    ({ activePeriod, onPeriodChange }, ref) => {
    const { periodTabs: tabs } = useI18nBilan();

    return (
        <motion.div ref={ref} className="w-full" variants={blockVariants}>
            <div className="flex gap-2 w-full">
                {tabs.map((tab) => {
                    const isActive = activePeriod === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onPeriodChange(tab.id)}
                            className={`flex-1 relative rounded-[12px] py-3 px-2 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer border ${
                                isActive 
                                    ? 'border-transparent' 
                                    : 'bg-card/50 border-border hover:bg-card'
                            }`}
                            style={isActive ? { backgroundColor: SOCIAL_COLORS.blockBg, borderColor: SOCIAL_COLORS.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill-social"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: SOCIAL_COLORS.blockBg, border: `1px solid ${SOCIAL_COLORS.blockBorder}` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon 
                                className={`relative z-10 w-5 h-5 transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-muted-foreground'
                                }`} 
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                                className={`relative z-10 text-[12px] font-bold font-manrope whitespace-nowrap transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-muted-foreground'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
});

BilanSocialPeriodTabs.displayName = "BilanSocialPeriodTabs";

// ============================================================================
// SUB-COMPONENT: Period Tabs SMS (Samsara Spatial Flow) — Inline Bottom
// ============================================================================
const BilanSocialPeriodTabsSms = ({ activePeriod, onPeriodChange }: { activePeriod: BilanPeriod; onPeriodChange: (p: BilanPeriod) => void }) => {
    const { periodTabs: tabs, t } = useI18nBilan();

    return (
        <div className="flex flex-col gap-3 w-full pt-2 pb-4">
            <p className="text-[12px] font-manrope font-medium text-muted-foreground/70 text-center">{t("period.change")}</p>
            <div className="flex gap-2 w-full">
                {tabs.map((tab) => {
                    const isActive = activePeriod === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onPeriodChange(tab.id)}
                            className={`flex-1 relative rounded-[12px] py-3 px-2 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer border ${
                                isActive 
                                    ? 'border-transparent' 
                                    : 'bg-card/50 border-border hover:bg-card'
                            }`}
                            style={isActive ? { backgroundColor: SOCIAL_COLORS.blockBg, borderColor: SOCIAL_COLORS.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill-sms-social"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: SOCIAL_COLORS.blockBg, border: `1px solid ${SOCIAL_COLORS.blockBorder}` }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon 
                                className={`relative z-10 w-5 h-5 transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-muted-foreground'
                                }`} 
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span
                                className={`relative z-10 text-[12px] font-bold font-manrope whitespace-nowrap transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-muted-foreground'
                                }`}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENT: Overview Block — Vue d'ensemble Réseaux
// ============================================================================
const BilanSocialOverviewBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, getDateRange, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 0);
    const statsFlow = getSpatialFlowVariants(direction, 1);
    
    const d = MOCK_BILAN_SOCIAL.overview;
    const stats = [
        { val: formatNumber(d.followers * mult), label: "Followers", sub: `+${formatNumber(d.followersGrowth * mult)}`, sentiment: "positive" },
        { val: formatNumber(d.likesPerPost * mult), label: "Like / Post", sub: `+${formatNumber(d.likesGrowth * mult)}`, sentiment: "positive" },
        { val: d.engagementRate, label: "Engagement", sub: d.engagementGrowthLabel, sentiment: "positive" }
    ];

    return (
        <motion.div 
            className="backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-5 relative shadow-sm z-20"
            style={{ backgroundColor: SOCIAL_COLORS.blockBg }}
            variants={blockVariants}
        >
            <div aria-hidden="true" className="absolute inset-0 rounded-[16px] pointer-events-none z-0" style={{ border: `1px solid ${SOCIAL_COLORS.blockBorder}` }} />
            
            {/* Header: Date Range + Growth Badge */}
            <AnimatePresence mode="wait">
                <motion.div key={`soc-overview-header-${period}`} className="flex justify-between items-center w-full z-10 relative" {...headerFlow}>
                    <div className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }}>
                        <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                            {getDateRange(period)}
                        </p>
                    </div>
                    
                    <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 border" style={{ backgroundColor: "rgba(28,180,91,0.1)", borderColor: "rgba(28,180,91,0.2)" }}>
                        <TrendingUp className="w-4 h-4" style={{ color: SOCIAL_COLORS.accent }} />
                        <span className="text-[14px] font-bold leading-normal" style={{ color: SOCIAL_COLORS.accent }}>{t("common.growing")}</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Stats Grid */}
            <AnimatePresence mode="wait">
                <motion.div key={`soc-overview-stats-${period}`} className="flex gap-2 w-full z-10 relative" {...statsFlow}>
                    <div className="flex gap-2 w-full">
                        {stats.map((item, i) => (
                            <div key={i} className="flex-1 p-2 py-2.5 rounded-lg flex flex-col items-center justify-between min-h-[99px] shadow-sm" style={{ backgroundColor: SOCIAL_COLORS.statBg }}>
                                <div className="flex flex-col items-center">
                                    <p className="text-[20px] font-bold text-dashboard-stat-value">{item.val}</p>
                                    <p className="text-[12px] font-normal text-dashboard-stat-label text-center leading-tight">
                                        {item.label}
                                        {item.label === "Followers" && <><br/><span className="text-[11px]">({periodLabels[period]})</span></>}
                                    </p>
                                </div>
                                <p className={`text-[17px] font-bold ${item.sentiment === 'positive' ? 'text-[#4CAF50]' : 'text-[#F44336]'}`}>
                                    {item.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Engagement Block
// ============================================================================
const BilanEngagementBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 2);
    const contentFlow = getSpatialFlowVariants(direction, 3);

    const eng = MOCK_BILAN_SOCIAL.engagement;
    const kpis = [
        { label: t("bilan.social.totalImpressions"), value: eng.totalImpressions * mult, growth: eng.impressionsGrowth, icon: Heart, iconColor: SOCIAL_COLORS.accent, iconBg: SOCIAL_COLORS.accentRgba },
        { label: t("bilan.social.organicReach"), value: eng.organicReach * mult, growth: eng.reachGrowth, icon: Users, iconColor: SOCIAL_COLORS.accent, iconBg: SOCIAL_COLORS.accentRgba },
        { label: t("bilan.social.interactions"), value: eng.interactions * mult, growth: eng.interactionsGrowth, icon: Share2, iconColor: SOCIAL_COLORS.accent, iconBg: SOCIAL_COLORS.accentRgba }
    ];

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: SOCIAL_COLORS.gradient, border: `1px solid ${SOCIAL_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.social.engagement")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`soc-eng-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* KPIs */}
                <AnimatePresence mode="wait">
                    <motion.div key={`soc-eng-kpis-${period}`} className="flex flex-col gap-[10px]" {...contentFlow}>
                        {kpis.map((kpi, index) => (
                            <div 
                                key={index} 
                                className="rounded-[12px] w-full p-[14px] py-[14px] flex items-center justify-between"
                                style={{ backgroundColor: SOCIAL_COLORS.innerBg }}
                            >
                                <div className="flex flex-col gap-[2px]">
                                    <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{kpi.label}</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-[18px] font-manrope font-bold text-foreground leading-none">{formatNumber(kpi.value)}</p>
                                        <div className={`flex items-center text-[11px] font-bold mb-[2px] ${kpi.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>
                                            {kpi.growth > 0 ? '+' : ''}{kpi.growth}%
                                        </div>
                                    </div>
                                </div>
                                <div 
                                    className="h-[40px] w-[40px] rounded-[10px] flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: kpi.iconBg }}
                                >
                                    <kpi.icon size={20} color={kpi.iconColor} strokeWidth={2} />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Engagement Rate Visual */}
                <div className="flex flex-col gap-[8px]">
                    <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.social.engagementByPlatform")}</p>
                    <div className="flex gap-2 w-full">
                        {eng.engagementByPlatform.map((p, i) => (
                            <div key={i} className="flex-1 rounded-[10px] p-[10px] flex flex-col items-center gap-1" style={{ backgroundColor: SOCIAL_COLORS.innerBg }}>
                                <span className="text-[16px] font-manrope font-bold text-foreground">{p.rate}</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-[11px] font-manrope text-muted-foreground" translate="no">{p.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Abonnés Block
// ============================================================================
const BilanAbonnesBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 4);
    const contentFlow = getSpatialFlowVariants(direction, 5);

    const sub = MOCK_BILAN_SOCIAL.subscribers;
    const totalFollowers = sub.totalFollowers * mult;

    const platforms = sub.platforms.map(p => ({
        ...p, followers: p.followers * mult
    }));

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: SOCIAL_COLORS.gradient, border: `1px solid ${SOCIAL_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.social.subscribers")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`soc-abo-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Total Followers KPI */}
                <AnimatePresence mode="wait">
                    <motion.div key={`soc-abo-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        <div className="rounded-[12px] w-full p-[14px] flex items-center justify-between" style={{ backgroundColor: SOCIAL_COLORS.innerBg }}>
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{t("bilan.social.totalFollowers")}</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-[22px] font-manrope font-bold text-foreground leading-none">{formatNumber(totalFollowers)}</p>
                                    <div className="flex items-center text-[11px] font-bold mb-[2px] text-[#30b77c]">
                                        +{sub.totalGrowth}%
                                    </div>
                                </div>
                            </div>
                            <div className="h-[40px] w-[40px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: SOCIAL_COLORS.accentRgba }}>
                                <Users size={20} color={SOCIAL_COLORS.accent} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Platform Distribution Bar */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.social.platformDistribution")}</p>
                            <div className="flex h-[8px] rounded-full overflow-hidden w-full">
                                {platforms.map((p, i) => (
                                    <div key={i} className="h-full" style={{ width: `${p.pct}%`, backgroundColor: p.color, opacity: 0.8 }} />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                {platforms.map((p, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, opacity: 0.8 }} />
                                        <span className="text-[11px] font-manrope text-muted-foreground" translate="no">{p.name} {p.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Per-platform rows */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.social.growthByPlatform")}</p>
                            {platforms.map((p, i) => (
                                <div key={i} className="rounded-[10px] w-full px-[10px] py-[10px] flex items-center justify-between" style={{ backgroundColor: SOCIAL_COLORS.innerBg }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                                        <p className="text-[13px] font-manrope text-foreground" translate="no">{p.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[13px] font-manrope font-bold text-foreground">{formatNumber(p.followers)}</p>
                                        <p className={`text-[11px] font-manrope font-bold ${p.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>
                                            {p.growth > 0 ? '+' : ''}{p.growth}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Démographie Block
// ============================================================================
const BilanDemographieBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const headerFlow = getSpatialFlowVariants(direction, 6);
    const contentFlow = getSpatialFlowVariants(direction, 7);

    const demo = MOCK_BILAN_SOCIAL.demographics;
    const genderData = demo.gender;
    const ageData = demo.age;

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: SOCIAL_COLORS.gradient, border: `1px solid ${SOCIAL_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <UserCheck size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.social.demographics")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`soc-demo-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Content — invariant to period but still flows spatially for consistency */}
                <AnimatePresence mode="wait">
                    <motion.div key={`soc-demo-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        {/* Gender Distribution */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.social.genderDistribution")}</p>
                            <div className="flex h-[8px] rounded-full overflow-hidden w-full">
                                {genderData.map((g, i) => (
                                    <div key={i} className="h-full" style={{ width: `${g.pct}%`, backgroundColor: g.color, opacity: 0.8 }} />
                                ))}
                            </div>
                            <div className="flex gap-3">
                                {genderData.map((g, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: g.color, opacity: 0.8 }} />
                                        <span className="text-[11px] font-manrope text-muted-foreground">{g.label} {g.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Age Brackets */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.social.ageBrackets")}</p>
                            <div className="flex gap-2 w-full">
                                {ageData.map((a, i) => (
                                    <div key={i} className="flex-1 rounded-[10px] p-[10px] flex flex-col items-center gap-1" style={{ backgroundColor: SOCIAL_COLORS.innerBg }}>
                                        <span className="text-[16px] font-manrope font-bold text-foreground">{a.pct}%</span>
                                        <span className="text-[11px] font-manrope text-muted-foreground">{a.range}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top audience insight */}
                        <div className="rounded-[10px] p-[12px] border" style={{ backgroundColor: "rgba(28,180,91,0.08)", borderColor: "rgba(28,180,91,0.2)" }}>
                            <p className="text-[12px] font-manrope text-foreground/70 leading-relaxed">
                                <span className="text-foreground/90 font-bold">{t("bilan.social.insight")}</span>{" "}
                                {demo.insight}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// MAIN EXPORT: BilanSocialContentBlocks
// ============================================================================
interface BilanSocialContentBlocksProps {
    period: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
    periodTabsRef?: React.Ref<HTMLDivElement>;
    tabDirection?: number;
}

export function BilanSocialContentBlocks({ period, onPeriodChange, periodTabsRef, tabDirection = 0 }: BilanSocialContentBlocksProps) {
    const prevPeriodRef = useRef<BilanPeriod>(period);
    const directionRef = useRef<number>(1);
    
    if (prevPeriodRef.current !== period) {
        directionRef.current = PERIOD_INDEX[period] > PERIOD_INDEX[prevPeriodRef.current] ? 1 : -1;
        prevPeriodRef.current = period;
    }

    const handleSmsPeriodChange = (newPeriod: BilanPeriod) => {
        if (newPeriod === period) return;
        onPeriodChange(newPeriod);
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    // --- Stagger Cascade for Inter-Tab Spatial Flow ---
    const BLOCK_STAGGER = 0.09;
    const CONTENT_EXTRA_DELAY = 0.12;
    const BLOCK_X_OFFSET = 80;
    const BLOCK_DURATION = 0.5;
    const CONTENT_DURATION = 0.4;

    const getBlockMotionProps = (index: number) => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: index * BLOCK_STAGGER } }
    }) : {};

    const getContentMotionProps = (index: number) => tabDirection !== 0 ? ({
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: CONTENT_DURATION, ease: "easeOut" as const, delay: index * BLOCK_STAGGER + CONTENT_EXTRA_DELAY } }
    }) : {};

    return (
        <>
            <motion.div {...getBlockMotionProps(0)}>
                <BilanSocialPeriodTabs ref={periodTabsRef} activePeriod={period} onPeriodChange={onPeriodChange} />
            </motion.div>
            
            <div className="flex flex-col gap-4 w-full">
                <motion.div {...getBlockMotionProps(1)}>
                    <motion.div {...getContentMotionProps(1)}>
                        <BilanSocialOverviewBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(2)}>
                    <motion.div {...getContentMotionProps(2)}>
                        <BilanEngagementBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(3)}>
                    <motion.div {...getContentMotionProps(3)}>
                        <BilanAbonnesBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(4)}>
                    <motion.div {...getContentMotionProps(4)}>
                        <BilanDemographieBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(5)}>
                    <BilanSocialPeriodTabsSms activePeriod={period} onPeriodChange={handleSmsPeriodChange} />
                </motion.div>

                {/* Partager mon bilan — Social themed */}
                <motion.div {...getBlockMotionProps(6)}>
                    <ShareBilanButton theme="social" />
                </motion.div>
            </div>
        </>
    );
}

export type { BilanPeriod };