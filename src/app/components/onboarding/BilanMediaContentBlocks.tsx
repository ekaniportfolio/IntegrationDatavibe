import { forwardRef, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Radio, Globe, TrendingUp, Antenna,
    CalendarDays, Calendar, CalendarRange,
    LayoutDashboard, Activity, Target
} from "lucide-react";
import { ShareBilanButton } from "./ShareBilanButton";
import { MOCK_BILAN_MEDIA, type BilanMediaData } from "../../data/mock-backend";
import { useI18nBilan } from "./useI18nBilan";

/**
 * ============================================================================
 * BILAN MEDIA CONTENT BLOCKS — Médias Summary by Period
 * ============================================================================
 * 
 * @backend All data comes from MOCK_BILAN_MEDIA (mock-backend.ts).
 * Replace with: GET /api/v1/artist/:id/bilan/media?period=mois
 * The frontend applies PERIOD_MULTIPLIER to base monthly values.
 * Growth rates are relative (%) and remain invariant across periods.
 * 
 * PERIOD MULTIPLIERS (applied to base monthly values):
 * - Semaine:   0.23  (~ 1/4.3 — one week is ~23% of a month)
 * - Mois:      1.0   (base monthly values — identical to full dashboard data)
 * - Trimestre: 3.0   (3 months aggregated)
 * 
 * DATA SOURCES (from full dashboard sub-tabs of Radio/Médias):
 * 
 * 1. Bloc Vue d'ensemble:
 *    - Rotations:  base = 54  (from DashboardBodySlot radio stats)
 *    - Pays:       base = 4   (from DashboardBodySlot radio stats)
 *    Growth rates remain constant (relative %) regardless of period.
 * 
 * 2. Bloc Performance (summary of sub-tab "dashboard"):
 *    - Diffusions totales:  base = 54    (RadioPerformanceOverview)
 *    - Audience cumulée:    base = 245,000 (derived from rotations x avg listeners)
 *    - Score de visibilité: 72/100 (invariant — index)
 *    Formula: stat.value x PERIOD_MULTIPLIER[period], score invariant
 * 
 * 3. Bloc Pays & Stations (summary of sub-tab "countries"):
 *    - Top pays: Côte d'Ivoire (45%), France (25%), Sénégal (18%), Belgique (12%)
 *    - Stations actives: base = 12 (RadioStationDistribution)
 *    Formula: station count x PERIOD_MULTIPLIER for volume, % invariant
 * 
 * 4. Bloc Stratégie (summary of sub-tab "strategy"):
 *    - Actions en cours: 3 (MediaActionCard)
 *    - Campagnes actives: 2 (MediaCampaignCard)
 *    - Score stratégique: 68/100 (invariant — index)
 *    Invariant to period (counts/scores)
 * ============================================================================
 */

type BilanPeriod = 'semaine' | 'mois' | 'trimestre';

const PERIOD_MULTIPLIER: Record<BilanPeriod, number> = {
    semaine: 0.23,
    mois: 1.0,
    trimestre: 3.0
};

const PERIOD_INDEX: Record<BilanPeriod, number> = {
    semaine: 0,
    mois: 1,
    trimestre: 2
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

// -- Media theme colors --
const MEDIA_COLORS = {
    blockBg: "rgba(18, 134, 243, 0.1)",
    blockBorder: "rgba(18, 134, 243, 0.6)",
    gradient: "linear-gradient(90.7768deg, rgba(18, 134, 243, 0.1) 1.5047%, rgba(52, 75, 253, 0.2) 98.378%)",
    innerBg: "rgba(18, 134, 243, 0.1)",
    accent: "#1286F3",
    accentRgba: "rgba(18, 134, 243, 0.2)",
    statBg: "rgba(18, 134, 243, 0.15)"
};

// ============================================================================
// SUB-COMPONENT: Period Tabs (Semaine / Mois / Trimestre) — Media themed
// ============================================================================
interface BilanPeriodTabsProps {
    activePeriod: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
}

const BilanMediaPeriodTabs = forwardRef<HTMLDivElement, BilanPeriodTabsProps>(
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
                            style={isActive ? { backgroundColor: MEDIA_COLORS.blockBg, borderColor: MEDIA_COLORS.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill-media"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: MEDIA_COLORS.blockBg, border: `1px solid ${MEDIA_COLORS.blockBorder}` }}
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

BilanMediaPeriodTabs.displayName = "BilanMediaPeriodTabs";

// ============================================================================
// SUB-COMPONENT: Period Tabs SMS (Samsara Spatial Flow) — Inline Bottom
// ============================================================================
const BilanMediaPeriodTabsSms = ({ activePeriod, onPeriodChange }: { activePeriod: BilanPeriod; onPeriodChange: (p: BilanPeriod) => void }) => {
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
                            style={isActive ? { backgroundColor: MEDIA_COLORS.blockBg, borderColor: MEDIA_COLORS.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill-sms-media"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: MEDIA_COLORS.blockBg, border: `1px solid ${MEDIA_COLORS.blockBorder}` }}
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
// SUB-COMPONENT: Overview Block — Vue d'ensemble Médias
// ============================================================================
const BilanMediaOverviewBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, getDateRange } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 0);
    const statsFlow = getSpatialFlowVariants(direction, 1);
    
    const d = MOCK_BILAN_MEDIA.overview;
    const stats = [
        { val: formatNumber(d.rotations * mult), label: "Rotations", sub: `${Math.round(d.rotationsGrowth * mult)}`, sentiment: "negative" as const },
        { val: formatNumber(d.countries * mult), label: "Pays", sub: `+${Math.round(d.countriesGrowth * mult)}`, sentiment: "positive" as const }
    ];

    return (
        <motion.div 
            className="backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-5 relative shadow-sm z-20"
            style={{ backgroundColor: MEDIA_COLORS.blockBg }}
            variants={blockVariants}
        >
            <div aria-hidden="true" className="absolute inset-0 rounded-[16px] pointer-events-none z-0" style={{ border: `1px solid ${MEDIA_COLORS.blockBorder}` }} />
            
            {/* Header: Date Range + Status Badge */}
            <AnimatePresence mode="wait">
                <motion.div key={`med-overview-header-${period}`} className="flex justify-between items-center w-full z-10 relative" {...headerFlow}>
                    <div className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }}>
                        <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                            {getDateRange(period)}
                        </p>
                    </div>
                    
                    <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 border" style={{ backgroundColor: "rgba(18,134,243,0.1)", borderColor: "rgba(18,134,243,0.2)" }}>
                        <Radio className="w-4 h-4" style={{ color: MEDIA_COLORS.accent }} />
                        <span className="text-[14px] font-bold leading-normal" style={{ color: MEDIA_COLORS.accent }}>{d.statusLabel}</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Stats Grid */}
            <AnimatePresence mode="wait">
                <motion.div key={`med-overview-stats-${period}`} className="flex gap-2 w-full z-10 relative" {...statsFlow}>
                    <div className="flex gap-2 w-full">
                        {stats.map((item, i) => (
                            <div key={i} className="flex-1 p-2 py-2.5 rounded-lg flex flex-col items-center justify-between min-h-[99px] shadow-sm" style={{ backgroundColor: MEDIA_COLORS.statBg }}>
                                <div className="flex flex-col items-center">
                                    <p className="text-[20px] font-bold text-dashboard-stat-value">{item.val}</p>
                                    <p className="text-[12px] font-normal text-dashboard-stat-label text-center leading-tight">
                                        {item.label}
                                        <br/><span className="text-[11px]">({periodLabels[period]})</span>
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
// SUB-COMPONENT: Performance Block
// ============================================================================
const BilanPerformanceBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 2);
    const contentFlow = getSpatialFlowVariants(direction, 3);

    const perf = MOCK_BILAN_MEDIA.performance;
    const kpis = [
        { label: t("bilan.media.totalBroadcasts"), value: perf.totalBroadcasts * mult, growth: perf.broadcastsGrowth, icon: Antenna, iconColor: MEDIA_COLORS.accent, iconBg: MEDIA_COLORS.accentRgba },
        { label: t("bilan.media.cumulativeAudience"), value: perf.cumulativeAudience * mult, growth: perf.audienceGrowth, icon: Globe, iconColor: MEDIA_COLORS.accent, iconBg: MEDIA_COLORS.accentRgba },
        { label: t("bilan.media.visibilityScore"), value: perf.visibilityScore, growth: 0, isScore: true, icon: TrendingUp, iconColor: MEDIA_COLORS.accent, iconBg: MEDIA_COLORS.accentRgba }
    ];

    const sparklineData = perf.sparkline;

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: MEDIA_COLORS.gradient, border: `1px solid ${MEDIA_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.media.performance")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`med-perf-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* KPIs */}
                <AnimatePresence mode="wait">
                    <motion.div key={`med-perf-kpis-${period}`} className="flex flex-col gap-[10px]" {...contentFlow}>
                        {kpis.map((kpi, index) => (
                            <div 
                                key={index} 
                                className="rounded-[12px] w-full p-[14px] py-[14px] flex items-center justify-between"
                                style={{ backgroundColor: MEDIA_COLORS.innerBg }}
                            >
                                <div className="flex flex-col gap-[2px]">
                                    <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{kpi.label}</p>
                                    <div className="flex items-end gap-2">
                                        <p className="text-[18px] font-manrope font-bold text-foreground leading-none">
                                            {'isScore' in kpi && kpi.isScore ? `${kpi.value}/100` : formatNumber(kpi.value)}
                                        </p>
                                        {kpi.growth !== 0 && (
                                            <div className={`flex items-center text-[11px] font-bold mb-[2px] ${kpi.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>
                                                {kpi.growth > 0 ? '+' : ''}{kpi.growth}%
                                            </div>
                                        )}
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

                {/* Sparkline mini chart */}
                <div className="flex flex-col gap-[8px]">
                    <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.media.broadcastDistribution")}</p>
                    <div className="flex items-end gap-[3px] h-[40px] w-full">
                        {sparklineData[period].map((val, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 rounded-t-[4px]"
                                style={{ 
                                    height: `${val * 100}%`,
                                    backgroundColor: "rgba(18,134,243,0.5)",
                                    border: "1px solid rgba(18,134,243,0.4)"
                                }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.3 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Pays & Stations Block
// ============================================================================
const BilanPaysStationsBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 4);
    const contentFlow = getSpatialFlowVariants(direction, 5);

    const ctr = MOCK_BILAN_MEDIA.countries;
    const stationsActives = Math.round(ctr.activeStations * mult);

    const countries = ctr.countries.map(c => ({
        ...c, stations: Math.round(c.stations * mult)
    }));

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: MEDIA_COLORS.gradient, border: `1px solid ${MEDIA_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.media.countriesStations")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`med-pays-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div key={`med-pays-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        {/* Stations actives KPI */}
                        <div className="rounded-[12px] w-full p-[14px] flex items-center justify-between" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{t("bilan.media.activeStations")}</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-[22px] font-manrope font-bold text-foreground leading-none">{stationsActives}</p>
                                    <div className="flex items-center text-[11px] font-bold mb-[2px] text-[#30b77c]">
                                        {ctr.stationsGrowthLabel}
                                    </div>
                                </div>
                            </div>
                            <div className="h-[40px] w-[40px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: MEDIA_COLORS.accentRgba }}>
                                <Antenna size={20} color={MEDIA_COLORS.accent} strokeWidth={2} />
                            </div>
                        </div>

                        {/* Country Distribution Bar */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.media.countryDistribution")}</p>
                            <div className="flex h-[8px] rounded-full overflow-hidden w-full">
                                {countries.map((c, i) => (
                                    <div key={i} className="h-full" style={{ width: `${c.pct}%`, backgroundColor: c.color, opacity: 0.8 }} />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                                {countries.map((c, i) => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color, opacity: 0.8 }} />
                                        <span className="text-[11px] font-manrope text-muted-foreground" translate="no">{c.name} {c.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Per-country rows */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.media.countryDetail")}</p>
                            {countries.map((c, i) => (
                                <div key={i} className="rounded-[10px] w-full px-[10px] py-[10px] flex items-center justify-between" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                                        <p className="text-[13px] font-manrope text-foreground" translate="no">{c.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[13px] font-manrope font-bold text-foreground">{c.stations} {t("bilan.media.stations")}</p>
                                        <p className="text-[11px] font-manrope font-bold text-muted-foreground">{c.pct}%</p>
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
// SUB-COMPONENT: Stratégie Block
// ============================================================================
const BilanStrategieBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const headerFlow = getSpatialFlowVariants(direction, 6);
    const contentFlow = getSpatialFlowVariants(direction, 7);

    const strat = MOCK_BILAN_MEDIA.strategy;
    const actions = strat.actions;
    const campaigns = strat.campaigns;

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ backgroundImage: MEDIA_COLORS.gradient, border: `1px solid ${MEDIA_COLORS.blockBorder}` }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.media.strategy")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`med-strat-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Content — mostly invariant to period */}
                <AnimatePresence mode="wait">
                    <motion.div key={`med-strat-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        {/* Score stratégique */}
                        <div className="flex gap-2 w-full">
                            <div className="flex-1 rounded-[12px] p-[12px] flex flex-col items-center gap-1" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                <p className="text-[11px] font-manrope text-muted-foreground text-center">{t("bilan.media.strategyScore")}</p>
                                <p className="text-[22px] font-manrope font-bold text-foreground">{strat.strategyScore}<span className="text-[14px] text-muted-foreground">/100</span></p>
                            </div>
                            <div className="flex-1 rounded-[12px] p-[12px] flex flex-col items-center gap-1" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                <p className="text-[11px] font-manrope text-muted-foreground text-center">{t("bilan.media.activeActions")}</p>
                                <p className="text-[22px] font-manrope font-bold text-foreground">{strat.activeActions}</p>
                            </div>
                            <div className="flex-1 rounded-[12px] p-[12px] flex flex-col items-center gap-1" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                <p className="text-[11px] font-manrope text-muted-foreground text-center">{t("bilan.media.campaigns")}</p>
                                <p className="text-[22px] font-manrope font-bold text-foreground">{strat.activeCampaigns}</p>
                            </div>
                        </div>

                        {/* Actions table */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.media.priorityActions")}</p>
                            {actions.map((action, i) => (
                                <div key={i} className="rounded-[10px] w-full px-[10px] py-[10px] flex items-center justify-between" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                    <p className="text-[13px] font-manrope text-foreground truncate flex-1 mr-2">{action.title}</p>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] font-manrope font-bold px-2 py-0.5 rounded-full ${
                                            action.status === 'En cours' ? 'bg-[rgba(28,180,91,0.2)] text-[#30b77c]' : 'bg-[rgba(18,134,243,0.2)] text-[#1286F3]'
                                        }`}>{action.status}</span>
                                        <span className={`text-[10px] font-manrope font-bold ${
                                            action.priority === 'Haute' ? 'text-[#F44336]' : 'text-[#FF9800]'
                                        }`}>{action.priority}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Campaigns progress */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.media.activeCampaigns")}</p>
                            {campaigns.map((camp, i) => (
                                <div key={i} className="rounded-[10px] w-full px-[10px] py-[10px] flex flex-col gap-2" style={{ backgroundColor: MEDIA_COLORS.innerBg }}>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[13px] font-manrope text-foreground" translate="no">{camp.name}</p>
                                        <span className="text-[11px] font-manrope font-bold text-[#30b77c]">{camp.progress}%</span>
                                    </div>
                                    <div className="h-[4px] rounded-full overflow-hidden w-full" style={{ backgroundColor: "rgba(18,134,243,0.15)" }}>
                                        <div className="h-full rounded-full" style={{ width: `${camp.progress}%`, backgroundColor: MEDIA_COLORS.accent }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Strategy advice */}
                        <div className="rounded-[10px] p-[12px] border" style={{ backgroundColor: "rgba(18,134,243,0.08)", borderColor: "rgba(18,134,243,0.2)" }}>
                            <p className="text-[12px] font-manrope text-foreground/70 leading-relaxed">
                                <span className="text-foreground/90 font-bold">{t("bilan.advice")}</span>{" "}
                                {strat.advice}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// MAIN EXPORT: BilanMediaContentBlocks
// ============================================================================
interface BilanMediaContentBlocksProps {
    period: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
    periodTabsRef?: React.Ref<HTMLDivElement>;
    tabDirection?: number;
}

export function BilanMediaContentBlocks({ period, onPeriodChange, periodTabsRef, tabDirection = 0 }: BilanMediaContentBlocksProps) {
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
                <BilanMediaPeriodTabs ref={periodTabsRef} activePeriod={period} onPeriodChange={onPeriodChange} />
            </motion.div>
            
            <div className="flex flex-col gap-4 w-full">
                <motion.div {...getBlockMotionProps(1)}>
                    <motion.div {...getContentMotionProps(1)}>
                        <BilanMediaOverviewBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(2)}>
                    <motion.div {...getContentMotionProps(2)}>
                        <BilanPerformanceBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(3)}>
                    <motion.div {...getContentMotionProps(3)}>
                        <BilanPaysStationsBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(4)}>
                    <motion.div {...getContentMotionProps(4)}>
                        <BilanStrategieBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                <motion.div {...getBlockMotionProps(5)}>
                    <BilanMediaPeriodTabsSms activePeriod={period} onPeriodChange={handleSmsPeriodChange} />
                </motion.div>

                {/* Partager mon bilan — Media themed */}
                <motion.div {...getBlockMotionProps(6)}>
                    <ShareBilanButton theme="media" />
                </motion.div>
            </div>
        </>
    );
}

export type { BilanPeriod };