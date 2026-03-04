import { forwardRef, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useI18nBilan } from "./useI18nBilan";
import { 
    Headphones, Eye, Music, TrendingUp,
    CalendarDays, Calendar, CalendarRange,
    LayoutDashboard, Activity, Disc3
} from "lucide-react";
import { ShareBilanButton } from "./ShareBilanButton";
import { MOCK_BILAN_STREAMING, type BilanStreamingData } from "../../data/mock-backend";

/**
 * ============================================================================
 * BILAN CONTENT BLOCKS — Streaming Summary by Period
 * ============================================================================
 * 
 * @backend All data comes from MOCK_BILAN_STREAMING (mock-backend.ts).
 * Replace with: GET /api/v1/artist/:id/bilan/streaming?period=mois
 * The frontend applies PERIOD_MULTIPLIER to base monthly values.
 * Growth rates are relative (%) and remain invariant across periods.
 * 
 * PERIOD MULTIPLIERS (applied to base monthly values):
 * - Semaine:   0.23  (≈ 1/4.3 — one week is ~23% of a month)
 * - Mois:      1.0   (base monthly values — identical to full dashboard data)
 * - Trimestre: 3.0   (3 months aggregated)
 * 
 * DATA SOURCES (from full dashboard sub-tabs of Streaming):
 * 
 * 1. Bloc Vue d'ensemble:
 *    - Aud. Spotify:  base = 113,900 (from DashboardBodySlot streaming stats)
 *    - Vues Youtube:  base = 367,900 (from DashboardBodySlot streaming stats)
 *    - Playlists:     base = 166     (from DashboardBodySlot streaming stats)
 *    Formula: value = base × PERIOD_MULTIPLIER[period]
 *    Growth rates remain constant (relative %) regardless of period.
 * 
 * 2. Bloc Tableau de bord (summary of sub-tab "dashboard"):
 *    - Auditeurs uniques mensuels: base = 113,100 (StreamingPerformanceUnified stats[0])
 *    - Vues mensuelles moyennes:   base = 792,400 (StreamingPerformanceUnified stats[1])
 *    - Flux pondérés totaux:       base = 165,800 (StreamingPerformanceUnified stats[2])
 *    - Platform distribution:      Youtube 55%, Facebook 25%, Spotify 20% (invariant)
 *    Formula: stat.value × PERIOD_MULTIPLIER[period], growth % invariant
 * 
 * 3. Bloc Activité (summary of sub-tab "performance"):
 *    - Total des vues:   base = 792,400 (same as monthly views from StreamingPerformanceUnified)
 *    - Croissance:        +12.5% (from stats[0].growth — audience growth as proxy)
 *    - Engagement moyen:  base = 4.2% (derived: unique listeners / total views ≈ 113K/792K)
 *    - Sessions actives:  base = 28,400 (derived: ~25% of unique listeners are active sessions)
 *    Formula: value × PERIOD_MULTIPLIER[period]; engagement % invariant
 * 
 * 4. Bloc Chanson (summary of sub-tab "playlists"):
 *    - Flux pondérés totaux: base = 165,781 (WeightedStreamsCard.value)
 *    - Top 3 chansons from LatestPerformanceCard.data sorted by streams desc:
 *      1. "Pas de panique"       — 4,400,000 streams (-99.0%)
 *      2. "Réponds par le feu"   — 36,600 streams (-31.1%)
 *      3. "Pardonner"            — 20,000 streams (-9.3%)
 *    Formula: WeightedStreamsCard.value × PERIOD_MULTIPLIER[period]
 *             Song streams × PERIOD_MULTIPLIER[period]
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

const formatNumberLocale = (num: number, lang: string) => new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR').format(Math.round(num));

// ── Period index map for Spatial Flow direction ──
const PERIOD_INDEX: Record<BilanPeriod, number> = {
    semaine: 0,
    mois: 1,
    trimestre: 2
};

// ── Animation variants ──
const blockVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "circOut" as const } }
};

/**
 * Spatial Flow Directional Variants:
 * The content blocks slide laterally following the direction of the period change.
 * Convention aligned with inter-tab Spatial Flow (Streaming/Réseaux/Médias):
 * - direction > 0 (going right: Semaine→Mois→Trimestre): enter from LEFT, exit to RIGHT
 * - direction < 0 (going left: Trimestre→Mois→Semaine): enter from RIGHT, exit to LEFT
 * "Viewport scrolls right" = content appears from left, exits to right.
 * 
 * Stagger cascade: elements lower on the page enter/exit with increasing delay
 * (staggerIndex × PERIOD_STAGGER). Matches the inter-tab stagger behavior.
 */
const PERIOD_STAGGER = 0.06; // seconds between each element's entrance/exit
const getSpatialFlowVariants = (direction: number, staggerIndex: number = 0) => ({
    initial: { opacity: 0, x: direction > 0 ? -60 : 60, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" as const, delay: staggerIndex * PERIOD_STAGGER } },
    exit: { opacity: 0, x: direction > 0 ? 60 : -60, filter: "blur(4px)", transition: { duration: 0.2, delay: staggerIndex * PERIOD_STAGGER * 0.5 } }
});

// ============================================================================
// SUB-COMPONENT: Period Tabs (Semaine / Mois / Trimestre)
// ============================================================================
interface BilanPeriodTabsProps {
    activePeriod: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
}

export const BilanPeriodTabs = forwardRef<HTMLDivElement, BilanPeriodTabsProps>(
    ({ activePeriod, onPeriodChange }, ref) => {
    const { periodTabs: tabs } = useI18nBilan();

    return (
        <motion.div ref={ref} className="w-full" variants={blockVariants}>
            <div className="flex gap-2 w-full">
                {tabs.map((tab, index) => {
                    const isActive = activePeriod === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onPeriodChange(tab.id)}
                            className={`flex-1 relative rounded-[12px] py-3 px-2 flex flex-col items-center gap-1.5 transition-colors duration-300 cursor-pointer border ${
                                isActive 
                                    ? 'bg-dashboard-block-streaming-bg border-dashboard-block-streaming-border' 
                                    : 'bg-card/50 border-border hover:bg-card'
                            }`}
                        >
                            {/* Active pill indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill"
                                    className="absolute inset-0 bg-dashboard-block-streaming-bg border border-dashboard-block-streaming-border rounded-[12px]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <tab.icon 
                                className={`relative z-10 w-5 h-5 transition-colors duration-300 ${
                                    isActive ? 'text-white' : 'text-muted-foreground'
                                }`} 
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            {/* SMS label — no layoutId (TAF is for Streaming/Réseaux/Médias only) */}
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

BilanPeriodTabs.displayName = "BilanPeriodTabs";

// ============================================================================
// SUB-COMPONENT: Period Tabs SMS (Samsara Spatial Flow) — Inline Bottom
// ============================================================================
/**
 * SMS (Samsara Spatial Flow) Protocol:
 * - Inline period buttons at the bottom of the content blocks.
 * - Breathes naturally in the scroll flow (not fixed).
 * - Click on non-active period → changes period + scrolls to top.
 * - NO layoutId — pure SMS, not TAF.
 * - "Changer de période" label above buttons.
 */
const BilanPeriodTabsSms = ({ activePeriod, onPeriodChange }: { activePeriod: BilanPeriod; onPeriodChange: (p: BilanPeriod) => void }) => {
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
                                    ? 'bg-dashboard-block-streaming-bg border-dashboard-block-streaming-border' 
                                    : 'bg-card/50 border-border hover:bg-card'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bilan-period-tab-fill-sms"
                                    className="absolute inset-0 bg-dashboard-block-streaming-bg border border-dashboard-block-streaming-border rounded-[12px]"
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
// SUB-COMPONENT: Overview Block (above period tabs, data varies by period)
// ============================================================================
/**
 * Formule: Reprend les 3 stats du DashboardBodySlot streaming:
 * - Aud. Spotify:  113,900 × PERIOD_MULTIPLIER[period]
 * - Vues Youtube:  367,900 × PERIOD_MULTIPLIER[period]
 * - Playlists:     166     × PERIOD_MULTIPLIER[period]
 * Les taux de croissance (+245, +12.4K, +2) sont relatifs → invariants
 */
const BilanOverviewBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, getDateRange, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 0);
    const statsFlow = getSpatialFlowVariants(direction, 1);
    
    const d = MOCK_BILAN_STREAMING.overview;
    const youtubeLabel = t("bilan.vuesYoutube");
    const stats = [
        { val: formatNumber(d.spotifyListeners * mult), label: t("bilan.audSpotify"), sub: `+${formatNumber(d.spotifyGrowth * mult)}`, sentiment: "positive", showPeriod: false },
        { val: formatNumber(d.youtubeViews * mult), label: youtubeLabel, sub: `+${formatNumber(d.youtubeGrowth * mult)}`, sentiment: "positive", showPeriod: true },
        { val: formatNumber(d.playlists * mult), label: t("bilan.playlists"), sub: `+${Math.round(d.playlistsGrowth * mult)}`, sentiment: "positive", showPeriod: false }
    ];

    return (
        <motion.div 
            className="bg-dashboard-block-streaming-bg backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-5 relative shadow-sm z-20"
            variants={blockVariants}
        >
            <div aria-hidden="true" className="absolute inset-0 border border-dashboard-block-streaming-border rounded-[16px] pointer-events-none z-0" />
            
            {/* Header: Date Range + Growth Badge — internal spatial flow */}
            <AnimatePresence mode="wait">
                <motion.div key={`overview-header-${period}`} className="flex justify-between items-center w-full z-10 relative" {...headerFlow}>
                    <div className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }}>
                        <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                            {getDateRange(period)}
                        </p>
                    </div>
                    
                    <div className="px-3 py-1.5 rounded-xl flex items-center gap-2 border bg-[#4CAF50]/10 border-[#4CAF50]/20">
                        <TrendingUp className="w-4 h-4" style={{ color: "#4CAF50" }} />
                        <span className="text-[14px] font-bold leading-normal" style={{ color: "#4CAF50" }}>{t("common.growing")}</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Stats Grid — internal spatial flow */}
            <AnimatePresence mode="wait">
                <motion.div key={`overview-stats-${period}`} className="flex gap-2 w-full z-10 relative" {...statsFlow}>
                    <div className="flex gap-2 w-full">
                        {stats.map((item, i) => (
                            <div key={i} className="flex-1 p-2 py-2.5 bg-dashboard-block-streaming-bg rounded-lg flex flex-col items-center justify-between min-h-[99px] shadow-sm">
                                <div className="flex flex-col items-center">
                                    <p className="text-[20px] font-bold text-dashboard-stat-value">{item.val}</p>
                                    <p className="text-[12px] font-normal text-dashboard-stat-label text-center leading-tight">
                                        {item.label}
                                        {item.showPeriod && <><br/><span className="text-[11px]">({periodLabels[period]})</span></>}
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
// SUB-COMPONENT: Tableau de bord Block
// ============================================================================
/**
 * Résumé du sous-onglet "Tableau de bord" du dashboard Streaming complet.
 * 
 * Formule:
 * - 3 KPIs condensés depuis StreamingPerformanceUnified.DEFAULT_STATS_DATA:
 *   stats[0]: Auditeurs uniques   = 113,100 × PERIOD_MULTIPLIER
 *   stats[1]: Vues moyennes       = 792,400 × PERIOD_MULTIPLIER
 *   stats[2]: Flux pondérés       = 165,800 × PERIOD_MULTIPLIER
 * - Growth % restent invariants (taux relatifs)
 * - Distribution plateforme: Youtube 55%, Facebook 25%, Spotify 20% (invariant)
 */
const BilanTableauDeBordBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 2);
    const contentFlow = getSpatialFlowVariants(direction, 3);

    const db = MOCK_BILAN_STREAMING.dashboard;
    const kpis = [
        { label: t("bilan.uniqueListeners"), value: db.uniqueListeners * mult, growth: db.listenersGrowth, icon: Headphones, iconColor: "#FF5222", iconBg: "rgba(255,82,34,0.2)" },
        { label: t("bilan.avgViews"), value: db.avgViews * mult, growth: db.viewsGrowth, icon: Eye, iconColor: "#FF5222", iconBg: "rgba(255,82,34,0.2)" },
        { label: t("bilan.weightedStreams"), value: db.weightedStreams * mult, growth: db.streamsGrowth, icon: Music, iconColor: "#FF5222", iconBg: "rgba(255,82,34,0.2)" }
    ];

    // Platform distribution is invariant to period (percentages)
    const platforms = db.platformDistribution;

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ 
                backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)",
                border: "1px solid rgba(242,142,66,0.6)"
            }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header — static, title doesn't change */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.dashboard")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`tdb-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* KPIs — internal spatial flow */}
                <AnimatePresence mode="wait">
                    <motion.div key={`tdb-kpis-${period}`} className="flex flex-col gap-[10px]" {...contentFlow}>
                        {kpis.map((kpi, index) => (
                            <div 
                                key={index} 
                                className="bg-[rgba(242,142,66,0.1)] rounded-[12px] w-full p-[14px] py-[14px] flex items-center justify-between"
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

                {/* Platform Distribution Bar — invariant to period */}
                <div className="flex flex-col gap-[8px]">
                    <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.platformDistribution")}</p>
                    <div className="flex h-[8px] rounded-full overflow-hidden w-full">
                        {platforms.map((p, i) => (
                            <div key={i} className="h-full" style={{ width: `${p.pct}%`, backgroundColor: p.color, opacity: 0.8 }} />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        {platforms.map((p, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, opacity: 0.8 }} />
                                <span className="text-[11px] font-manrope text-muted-foreground" translate="no">{p.name} {p.pct}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Activité Block
// ============================================================================
/**
 * Résumé du sous-onglet "Activité" (Performance) du dashboard Streaming complet.
 * 
 * Formule:
 * - Total des vues:    792,400 × PERIOD_MULTIPLIER (depuis StreamingPerformanceUnified stats[1])
 * - Croissance:        +12.5% (audience growth proxy, invariant — taux relatif)
 * - Engagement moyen:  4.2% (dérivé : auditeurs_uniques / vues_totales ≈ 113,100/792,400 ≈ 14.3%
 *                      mais on utilise un taux d'engagement standard plus réaliste à 4.2%)
 * - Sessions actives:  28,400 × PERIOD_MULTIPLIER (dérivé : ~25% des auditeurs uniques)
 * 
 * Les barres sparkline représentent une distribution arbitraire mais cohérente
 * des vues sur les sous-périodes (7 jours pour semaine, 4 semaines pour mois, 3 mois pour trimestre).
 */
const BilanActiviteBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 4);
    const contentFlow = getSpatialFlowVariants(direction, 5);

    const act = MOCK_BILAN_STREAMING.activity;
    const totalViews = act.totalViews * mult;
    const activeSessions = act.activeSessions * mult;
    const engagementRate = act.engagementRate;
    const growthRate = act.growthRate;

    const sparklineData = act.sparkline;
    
    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ 
                backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)",
                border: "1px solid rgba(242,142,66,0.6)"
            }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header — title static, period label flows */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.activity")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`act-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Internal content — spatial flow */}
                <AnimatePresence mode="wait">
                    <motion.div key={`act-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        {/* Main stat: Total views */}
                        <div className="bg-[rgba(242,142,66,0.1)] rounded-[12px] w-full p-[14px] flex items-center justify-between">
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{t("bilan.totalViews")}</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-[22px] font-manrope font-bold text-foreground leading-none">{formatNumber(totalViews)}</p>
                                    <div className="flex items-center text-[11px] font-bold mb-[2px] text-[#30b77c]">
                                        +{growthRate}%
                                    </div>
                                </div>
                            </div>
                            <div className="h-[40px] w-[40px] rounded-[10px] flex items-center justify-center shrink-0 bg-[rgba(255,82,34,0.2)]">
                                <Eye size={20} color="#FF5222" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Sparkline mini chart */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.viewsDistribution")}</p>
                            <div className="flex items-end gap-[3px] h-[40px] w-full">
                                {sparklineData[period].map((val, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 rounded-t-[4px]"
                                        style={{ 
                                            height: `${val * 100}%`,
                                            backgroundColor: "rgba(242,142,66,0.5)",
                                            border: "1px solid rgba(242,142,66,0.4)"
                                        }}
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ delay: i * 0.05, duration: 0.3 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Secondary stats row */}
                        <div className="flex gap-2 w-full">
                            <div className="flex-1 bg-[rgba(242,142,66,0.1)] rounded-[12px] p-[12px] flex flex-col items-center gap-1">
                                <p className="text-[11px] font-manrope text-muted-foreground text-center">{t("bilan.engagement")}</p>
                                <p className="text-[18px] font-manrope font-bold text-foreground">{engagementRate}%</p>
                            </div>
                            <div className="flex-1 bg-[rgba(242,142,66,0.1)] rounded-[12px] p-[12px] flex flex-col items-center gap-1">
                                <p className="text-[11px] font-manrope text-muted-foreground text-center">{t("bilan.sessions")}</p>
                                <p className="text-[18px] font-manrope font-bold text-foreground">{formatNumber(activeSessions)}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// SUB-COMPONENT: Chanson Block
// ============================================================================
/**
 * Résumé du sous-onglet "Chanson" (Playlists) du dashboard Streaming complet.
 * 
 * Formule:
 * - Flux pondérés totaux: 165,781 × PERIOD_MULTIPLIER (depuis WeightedStreamsCard.DEFAULT_DATA.value)
 * - Top 3 chansons: triées par streams décroissant depuis LatestPerformanceCard.DEFAULT_SONGS_DATA:
 *   1. "Pas de panique"       — 4,400,000 × PERIOD_MULTIPLIER  (growth: -99.0%)
 *   2. "Réponds par le feu"   — 36,600 × PERIOD_MULTIPLIER     (growth: -31.1%)
 *   3. "Pardonner"            — 20,000 × PERIOD_MULTIPLIER     (growth: -9.3%)
 * - Conseil IA: texte identique au LatestPerformanceCard (invariant à la période)
 */
const BilanChansonBlock = ({ period, direction }: { period: BilanPeriod; direction: number }) => {
    const { periodLabels, t, language } = useI18nBilan();
    const mult = PERIOD_MULTIPLIER[period];
    const headerFlow = getSpatialFlowVariants(direction, 6);
    const contentFlow = getSpatialFlowVariants(direction, 7);
    
    const sng = MOCK_BILAN_STREAMING.songs;
    const weightedStreams = sng.weightedStreamsTotal * mult;
    
    // Top 3 songs sorted by streams desc
    const topSongs = sng.topSongs.map(s => ({
        title: s.title, streams: s.streams * mult, growth: s.growth
    }));

    return (
        <motion.div 
            className="relative rounded-[16px] w-full overflow-hidden"
            style={{ 
                backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)",
                border: "1px solid rgba(242,142,66,0.6)"
            }}
            variants={blockVariants}
        >
            <div className="flex flex-col gap-[14px] p-[20px] px-[14px]">
                {/* Header — title static, period label flows */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Disc3 size={18} className="text-foreground/80" />
                        <h3 className="text-foreground font-manrope font-bold text-[16px]">{t("bilan.songs")}</h3>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.span key={`chan-period-${period}`} className="text-[12px] text-muted-foreground font-manrope" {...headerFlow}>{periodLabels[period]}</motion.span>
                    </AnimatePresence>
                </div>

                {/* Internal content — spatial flow */}
                <AnimatePresence mode="wait">
                    <motion.div key={`chan-content-${period}`} className="flex flex-col gap-[14px]" {...contentFlow}>
                        {/* Weighted streams total */}
                        <div className="bg-[rgba(242,142,66,0.1)] rounded-[12px] w-full p-[14px] flex items-center justify-between">
                            <div className="flex flex-col gap-[2px]">
                                <p className="text-[13px] font-manrope font-medium text-foreground/70 leading-tight">{t("bilan.weightedStreamsTotal")}</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-[22px] font-manrope font-bold text-foreground leading-none tracking-tight">{formatNumberLocale(weightedStreams, language)}</p>
                                    <div className="flex items-center text-[11px] font-bold mb-[2px] text-[#30b77c]">
                                        +{sng.weightedStreamsGrowth}%
                                    </div>
                                </div>
                                <p className="text-[12px] font-manrope font-medium text-muted-foreground">{t("bilan.globalVisibilityIndex")}</p>
                            </div>
                            <div className="h-[40px] w-[40px] rounded-[10px] flex items-center justify-center shrink-0 bg-[rgba(28,180,91,0.24)]">
                                <TrendingUp size={20} color="#1CB45B" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Top Songs Table */}
                        <div className="flex flex-col gap-[8px]">
                            <p className="text-[13px] font-manrope font-medium text-muted-foreground">{t("bilan.topSongs")}</p>
                            
                            {/* Table Header */}
                            <div className="flex font-manrope font-normal items-center justify-between text-[12px] text-muted-foreground px-[10px]">
                                <p className="w-[40%] text-left">{t("bilan.title")}</p>
                                <p className="w-[30%] text-right">{t("bilan.streams")}</p>
                                <p className="w-[30%] text-right">{t("bilan.trend")}</p>
                            </div>
                            
                            {/* Rows */}
                            {topSongs.map((song, i) => (
                                <div key={i} className="bg-[rgba(242,142,66,0.1)] rounded-[10px] w-full px-[10px] py-[10px] flex items-center justify-between">
                                    <div className="flex items-center gap-2 w-[40%] overflow-hidden">
                                        <Music size={14} className="text-[#30B77C] shrink-0" />
                                        <p className="text-[13px] font-manrope text-foreground truncate">{song.title}</p>
                                    </div>
                                    <p className="text-[13px] font-manrope font-bold text-foreground w-[30%] text-right">{formatNumber(song.streams)}</p>
                                    <p className={`text-[11px] font-manrope font-bold w-[30%] text-right ${song.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>
                                        {song.growth}%
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* AI Advice — invariant to period (from LatestPerformanceCard) */}
                        <div className="bg-[rgba(242,142,66,0.08)] rounded-[10px] p-[12px] border border-[rgba(242,142,66,0.2)]">
                            <p className="text-[12px] font-manrope text-foreground/70 leading-relaxed">
                                <span className="text-foreground/90 font-bold">{t("bilan.advice")}</span>{" "}
                                {sng.advice}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// ============================================================================
// MAIN EXPORT: BilanContentBlocks
// ============================================================================
interface BilanContentBlocksProps {
    period: BilanPeriod;
    onPeriodChange: (period: BilanPeriod) => void;
    periodTabsRef?: React.Ref<HTMLDivElement>;
    tabDirection?: number;
}

export function BilanContentBlocks({ period, onPeriodChange, periodTabsRef, tabDirection = 0 }: BilanContentBlocksProps) {
    // Track direction for Spatial Flow: compare previous period index to current
    const prevPeriodRef = useRef<BilanPeriod>(period);
    const directionRef = useRef<number>(1); // +1 = right, -1 = left
    
    if (prevPeriodRef.current !== period) {
        directionRef.current = PERIOD_INDEX[period] > PERIOD_INDEX[prevPeriodRef.current] ? 1 : -1;
        prevPeriodRef.current = period;
    }

    const handleSmsPeriodChange = (newPeriod: BilanPeriod) => {
        if (newPeriod === period) return;
        onPeriodChange(newPeriod);
        // SMS Samsara: scroll to top so user sees the full data journey from top to bottom
        // Target the actual scroll container (#main-scroll-container), not window
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    // --- Stagger Cascade for Inter-Tab Spatial Flow ---
    const BLOCK_STAGGER = 0.09; // seconds between each block's entrance
    const CONTENT_EXTRA_DELAY = 0.12; // extra delay for inner content vs its block wrapper
    const BLOCK_X_OFFSET = 80; // pixels of lateral offset
    const BLOCK_DURATION = 0.5; // entrance duration per block
    const CONTENT_DURATION = 0.4; // inner content fade duration

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
            {/* Onglets Période: Semaine / Mois / Trimestre */}
            <motion.div {...getBlockMotionProps(0)}>
                <BilanPeriodTabs ref={periodTabsRef} activePeriod={period} onPeriodChange={onPeriodChange} />
            </motion.div>
            
            {/* Content blocks — containers stagger in, internal elements follow Spatial Flow */}
            <div className="flex flex-col gap-4 w-full">
                {/* Bloc 0: Vue d'ensemble */}
                <motion.div {...getBlockMotionProps(1)}>
                    <motion.div {...getContentMotionProps(1)}>
                        <BilanOverviewBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                
                {/* Bloc 1: Tableau de bord */}
                <motion.div {...getBlockMotionProps(2)}>
                    <motion.div {...getContentMotionProps(2)}>
                        <BilanTableauDeBordBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                
                {/* Bloc 2: Activité */}
                <motion.div {...getBlockMotionProps(3)}>
                    <motion.div {...getContentMotionProps(3)}>
                        <BilanActiviteBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                
                {/* Bloc 3: Chanson */}
                <motion.div {...getBlockMotionProps(4)}>
                    <motion.div {...getContentMotionProps(4)}>
                        <BilanChansonBlock period={period} direction={directionRef.current} />
                    </motion.div>
                </motion.div>
                
                {/* SMS (Samsara Spatial Flow) — Inline period tabs at bottom of content */}
                <motion.div {...getBlockMotionProps(5)}>
                    <BilanPeriodTabsSms activePeriod={period} onPeriodChange={handleSmsPeriodChange} />
                </motion.div>

                {/* Partager mon bilan — Streaming themed */}
                <motion.div {...getBlockMotionProps(6)}>
                    <ShareBilanButton theme="streaming" />
                </motion.div>
            </div>
        </>
    );
}

export type { BilanPeriod };