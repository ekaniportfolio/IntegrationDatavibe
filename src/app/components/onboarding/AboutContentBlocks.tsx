/**
 * ============================================================================
 * ABOUT CONTENT BLOCKS — Page "À propos"
 * ============================================================================
 *
 * Autonomous overlay page (same pattern as Connexions/Offre/Légal):
 * 1. Title block + app version badge
 * 2. Three-tab navigation: Notre histoire / Pour vous / Horizon
 * 3. Tab-specific content with Nonchalant Cascade animations
 *
 * This page does NOT use TAF tabs (Streaming/Réseaux/Médias).
 * This page does NOT have a BilanBottomNav.
 *
 * TAB MECHANICS:
 * - Notre histoire: Mission/Vision cards, values grid, timeline milestones
 * - Pour vous: Feature cards with icons, stats row
 * - Horizon: Roadmap items with status badges, "isNew" glow effect
 *
 * @backend GET /api/v1/config/about/full
 * ============================================================================
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
    Info, BookOpen, Sparkles, Compass, Heart, Eye, Shield, Lightbulb,
    Headphones, Users, Radio, Trophy, BarChart3, Zap,
    BrainCircuit, Globe, GitCompare, Megaphone, Wallet, Smartphone, Plug, MessageCircle,
    ChevronRight, Rocket, Clock, Search, Mail, ExternalLink,
} from "lucide-react";
import {
    MOCK_ABOUT,
    MOCK_ABOUT_TABS,
    type AboutTabId,
    type AboutFeature,
    type AboutMilestone,
    type AboutRoadmapItem,
} from "../../data/mock-backend";
import { useTranslation } from "../language-provider";

/* ═══════════════════════════════════════════════════════════════════════════
 * NONCHALANT CASCADE — Same system as all overlay pages
 * ═══════════════════════════════════════════════════════════════════════════ */
const REGAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CASCADE_Y = 28;
const CASCADE_BLUR = 6;
const CASCADE_DURATION = 0.7;

const EXIT_DURATION = 0.28;
const EXIT_Y = 24;
const EXIT_BLUR = 5;
const EXIT_SPREAD = 0.18;
const MAX_ENTRANCE_DELAY = 0.72;

const exitDelay = (entranceDelay: number) =>
    Math.max(0, ((MAX_ENTRANCE_DELAY - entranceDelay) / MAX_ENTRANCE_DELAY) * EXIT_SPREAD);

const cascade = (delay: number) => ({
    initial: { opacity: 0, y: CASCADE_Y, filter: `blur(${CASCADE_BLUR}px)` },
    animate: {
        opacity: 1, y: 0, filter: "blur(0px)",
        transition: { duration: CASCADE_DURATION, ease: REGAL_EASE, delay }
    },
    exit: {
        opacity: 0, y: EXIT_Y, filter: `blur(${EXIT_BLUR}px)`,
        transition: { duration: EXIT_DURATION, ease: REGAL_EASE, delay: exitDelay(delay) }
    },
});

/* ─── Icon mapping ─── */
const ICON_MAP: Record<string, typeof Info> = {
    BookOpen, Sparkles, Compass, Headphones, Users, Radio, Trophy, BarChart3, Zap,
    BrainCircuit, Globe, GitCompare, Megaphone, Wallet, Smartphone, Plug, MessageCircle,
    Heart, Eye, Shield, Lightbulb, Rocket, Clock, Search,
};

const getIcon = (name: string) => ICON_MAP[name] || Info;

/* ─── Tab config ─── */
const TAB_ORDER: AboutTabId[] = ['histoire', 'pourvous', 'horizon'];
const TAB_LABEL_KEYS: Record<AboutTabId, string> = {
    histoire: 'about.ourStory',
    pourvous: 'about.forYou',
    horizon: 'about.horizon',
};
const TAB_COLORS: Record<AboutTabId, string> = {
    histoire: '#60a5fa',
    pourvous: '#7038FF',
    horizon: '#f59e0b',
};
const TAB_ICONS: Record<AboutTabId, typeof Info> = {
    histoire: BookOpen,
    pourvous: Sparkles,
    horizon: Compass,
};

/* ─── Status badge config ─── */
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    'in-progress': { label: 'in-progress', color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
    'planned': { label: 'planned', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
    'exploring': { label: 'exploring', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
};

const STATUS_KEYS: Record<string, string> = {
    'in-progress': 'about.inProgress',
    'planned': 'about.planned',
    'exploring': 'about.exploring',
};

/* ═══════════════════════════════════════════════════════════════════════════
 * TAB: NOTRE HISTOIRE
 * ═══════════════════════════════════════════════════════════════════════════ */
function HistoireTab() {
    const { t } = useTranslation();
    const tab = MOCK_ABOUT_TABS.find(t => t.id === 'histoire')!;
    const { mission, vision, values, milestones } = tab.content;
    const VALUE_ICONS = [Heart, Eye, Shield, Lightbulb];

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Mission */}
            <motion.div
                className="w-full rounded-[16px] p-4"
                style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.08) 0%, rgba(96,165,250,0.02) 100%)', border: '1px solid rgba(96,165,250,0.15)' }}
                {...cascade(0.08)}
            >
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{ backgroundColor: 'rgba(96,165,250,0.15)' }}>
                        <Rocket className="w-3.5 h-3.5 text-[#60a5fa]" />
                    </div>
                    <span className="font-manrope font-bold text-[13px] text-foreground/80">{t("about.ourMission")}</span>
                </div>
                <p className="font-manrope font-normal text-[13px] text-muted-foreground leading-[1.7]">{mission}</p>
            </motion.div>

            {/* Vision */}
            <motion.div
                className="w-full rounded-[16px] p-4"
                style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.02) 100%)', border: '1px solid rgba(167,139,250,0.15)' }}
                {...cascade(0.16)}
            >
                <div className="flex items-center gap-2 mb-2.5">
                    <div className="w-6 h-6 rounded-[7px] flex items-center justify-center" style={{ backgroundColor: 'rgba(167,139,250,0.15)' }}>
                        <Eye className="w-3.5 h-3.5 text-[#a78bfa]" />
                    </div>
                    <span className="font-manrope font-bold text-[13px] text-foreground/80">{t("about.ourVision")}</span>
                </div>
                <p className="font-manrope font-normal text-[13px] text-muted-foreground leading-[1.7]">{vision}</p>
            </motion.div>

            {/* Values grid */}
            <motion.div className="w-full" {...cascade(0.24)}>
                <span className="font-manrope font-bold text-[13px] text-muted-foreground mb-3 block px-1">{t("about.ourValues")}</span>
                <div className="grid grid-cols-2 gap-2">
                    {values?.map((v, i) => {
                        const ValIcon = VALUE_ICONS[i] || Heart;
                        return (
                            <motion.div
                                key={v.title}
                                className="rounded-[12px] p-3 flex flex-col gap-2"
                                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                {...cascade(0.28 + i * 0.06)}
                            >
                                <ValIcon className="w-4 h-4 text-[#60a5fa]/60" />
                                <span className="font-manrope font-bold text-[11.5px] text-foreground/70 leading-tight">{v.title}</span>
                                <p className="font-manrope font-normal text-[11px] text-muted-foreground/60 leading-[1.6]">{v.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Timeline milestones */}
            <motion.div className="w-full" {...cascade(0.48)}>
                <span className="font-manrope font-bold text-[13px] text-muted-foreground mb-3 block px-1">{t("about.ourJourney")}</span>
                <div className="relative flex flex-col gap-0 pl-4">
                    {/* Vertical line */}
                    <div
                        className="absolute left-[7px] top-2 bottom-2 w-px"
                        style={{ background: 'linear-gradient(to bottom, rgba(96,165,250,0.3), rgba(112,56,255,0.3), rgba(245,158,11,0.2))' }}
                    />
                    {milestones?.map((ms, i) => {
                        const isLast = i === (milestones?.length || 0) - 1;
                        return (
                            <motion.div
                                key={ms.id}
                                className="relative flex gap-3 pb-4"
                                {...cascade(0.52 + i * 0.06)}
                            >
                                {/* Dot */}
                                <div className="relative z-10 -ml-4 mt-1">
                                    <div
                                        className="w-[14px] h-[14px] rounded-full border-2 flex items-center justify-center"
                                        style={{
                                            borderColor: isLast ? '#7038FF' : 'rgba(96,165,250,0.4)',
                                            backgroundColor: isLast ? 'rgba(112,56,255,0.2)' : 'rgba(96,165,250,0.08)',
                                        }}
                                    >
                                        {isLast && <div className="w-[5px] h-[5px] rounded-full bg-[#7038FF]" />}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="font-manrope font-bold text-[10px] text-muted-foreground/50 uppercase tracking-wider">{ms.date}</span>
                                    <h4 className="font-manrope font-bold text-[13px] text-foreground/80 leading-tight mt-0.5">{ms.title}</h4>
                                    <p className="font-manrope font-normal text-[11.5px] text-muted-foreground/60 leading-[1.6] mt-1">{ms.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * TAB: POUR VOUS
 * ═══════════════════════════════════════════════════════════════════════════ */
function PourVousTab() {
    const tab = MOCK_ABOUT_TABS.find(t => t.id === 'pourvous')!;
    const { headline, subheadline, features, stats } = tab.content;

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Headline */}
            <motion.div className="w-full text-center px-2" {...cascade(0.06)}>
                <h3 className="font-manrope font-bold text-[16px] text-foreground/80 leading-tight">{headline}</h3>
                <p className="font-manrope font-normal text-[12.5px] text-muted-foreground/60 leading-[1.6] mt-2">{subheadline}</p>
            </motion.div>

            {/* Stats row */}
            <motion.div
                className="w-full grid grid-cols-4 gap-1 rounded-[14px] p-2"
                style={{ backgroundColor: 'rgba(112,56,255,0.06)', border: '1px solid rgba(112,56,255,0.12)' }}
                {...cascade(0.14)}
            >
                {stats?.map((s, i) => (
                    <div key={s.label} className="flex flex-col items-center gap-0.5 py-1.5">
                        <span className="font-manrope font-bold text-[16px] text-[#7038FF]">{s.value}</span>
                        <span className="font-manrope font-normal text-[9px] text-muted-foreground/50 text-center leading-tight">{s.label}</span>
                    </div>
                ))}
            </motion.div>

            {/* Features */}
            <div className="flex flex-col gap-2 w-full">
                {features?.map((feat, i) => {
                    const FeatIcon = getIcon(feat.icon);
                    return (
                        <motion.div
                            key={feat.id}
                            className="w-full rounded-[14px] p-3.5 flex gap-3"
                            style={{
                                backgroundColor: feat.highlight ? 'rgba(112,56,255,0.06)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${feat.highlight ? 'rgba(112,56,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                            }}
                            {...cascade(0.22 + i * 0.06)}
                        >
                            <div
                                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                                style={{ backgroundColor: feat.highlight ? 'rgba(112,56,255,0.15)' : 'rgba(255,255,255,0.05)' }}
                            >
                                <FeatIcon className="w-4.5 h-4.5" style={{ color: feat.highlight ? '#7038FF' : 'rgba(255,255,255,0.4)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-manrope font-bold text-[13px] text-foreground/80 leading-tight">{feat.title}</h4>
                                <p className="font-manrope font-normal text-[11.5px] text-muted-foreground/60 leading-[1.6] mt-1">{feat.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * TAB: HORIZON
 * ═══════════════════════════════════════════════════════════════════════════ */
function HorizonTab() {
    const { t } = useTranslation();
    const tab = MOCK_ABOUT_TABS.find(t => t.id === 'horizon')!;
    const { intro, roadmap, communityNote } = tab.content;

    // Group roadmap items by status
    const inProgress = roadmap?.filter(r => r.status === 'in-progress') || [];
    const planned = roadmap?.filter(r => r.status === 'planned') || [];
    const exploring = roadmap?.filter(r => r.status === 'exploring') || [];

    const renderItem = (item: AboutRoadmapItem, baseDelay: number, idx: number) => {
        const ItemIcon = getIcon(item.icon);
        const statusCfg = STATUS_CONFIG[item.status];
        return (
            <motion.div
                key={item.id}
                className="w-full rounded-[14px] p-3.5 flex gap-3 relative overflow-hidden"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.isNew ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
                {...cascade(baseDelay + idx * 0.06)}
            >
                {/* New glow */}
                {item.isNew && (
                    <motion.div
                        className="absolute top-0 right-0 w-20 h-20 rounded-full"
                        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                )}
                <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${statusCfg.bg}` }}
                >
                    <ItemIcon className="w-4.5 h-4.5" style={{ color: statusCfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-manrope font-bold text-[13px] text-foreground/80 leading-tight">{item.title}</h4>
                        {item.isNew && (
                            <span className="px-1.5 py-0.5 rounded-full font-manrope font-bold text-[8px] uppercase tracking-wider" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                                {t("about.new")}
                            </span>
                        )}
                    </div>
                    <p className="font-manrope font-normal text-[11.5px] text-muted-foreground/60 leading-[1.6] mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-full font-manrope font-medium text-[9px]" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                            {t(STATUS_KEYS[item.status])}
                        </span>
                        {item.eta && (
                            <span className="font-manrope font-normal text-[10px] text-muted-foreground/40 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> {item.eta}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Intro */}
            <motion.p className="font-manrope font-normal text-[12.5px] text-muted-foreground/70 leading-[1.7] px-1" {...cascade(0.06)}>
                {intro}
            </motion.p>

            {/* In progress section */}
            {inProgress.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    <motion.div className="flex items-center gap-2 px-1" {...cascade(0.12)}>
                        <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                        <span className="font-manrope font-bold text-[11px] text-muted-foreground/60 uppercase tracking-wider">{t("about.inDevelopment")}</span>
                    </motion.div>
                    {inProgress.map((item, i) => renderItem(item, 0.16, i))}
                </div>
            )}

            {/* Planned section */}
            {planned.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    <motion.div className="flex items-center gap-2 px-1" {...cascade(0.32)}>
                        <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                        <span className="font-manrope font-bold text-[11px] text-muted-foreground/60 uppercase tracking-wider">{t("about.planned")}</span>
                    </motion.div>
                    {planned.map((item, i) => renderItem(item, 0.36, i))}
                </div>
            )}

            {/* Exploring section */}
            {exploring.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    <motion.div className="flex items-center gap-2 px-1" {...cascade(0.52)}>
                        <div className="w-2 h-2 rounded-full bg-[#a78bfa]/60" />
                        <span className="font-manrope font-bold text-[11px] text-muted-foreground/60 uppercase tracking-wider">{t("about.exploring")}</span>
                    </motion.div>
                    {exploring.map((item, i) => renderItem(item, 0.56, i))}
                </div>
            )}

            {/* Community note */}
            {communityNote && (
                <motion.div
                    className="w-full rounded-[14px] p-4 flex items-start gap-3"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.02) 100%)', border: '1px solid rgba(245,158,11,0.15)' }}
                    {...cascade(0.68)}
                >
                    <MessageCircle className="w-4 h-4 text-[#f59e0b]/50 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="font-manrope font-normal text-[12px] text-muted-foreground/70 leading-[1.7]">{communityNote}</p>
                        <a
                            href="mailto:feedback@datavibe.app"
                            className="inline-flex items-center gap-1.5 mt-2 font-manrope font-medium text-[11px] text-[#f59e0b]/60 hover:text-[#f59e0b] transition-colors duration-200"
                        >
                            <Mail className="w-3 h-3" />
                            feedback@datavibe.app
                            <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ═══════════════════════════════════════════════════════════════════════════ */
export function AboutContentBlocks() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<AboutTabId>('histoire');
    const [tabDirection, setTabDirection] = useState(0);
    const [showStickyNav, setShowStickyNav] = useState(false);
    const prevTabRef = useRef(activeTab);
    const inlineTabsRef = useRef<HTMLDivElement>(null);

    const activeColor = TAB_COLORS[activeTab];

    /* ── IntersectionObserver: show sticky nav when inline tabs scroll out ── */
    useEffect(() => {
        const el = inlineTabsRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyNav(!entry.isIntersecting);
            },
            { threshold: 0, rootMargin: '-20px 0px 0px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const handleTabChange = useCallback((tabId: AboutTabId) => {
        const prevIdx = TAB_ORDER.indexOf(prevTabRef.current);
        const nextIdx = TAB_ORDER.indexOf(tabId);
        setTabDirection(nextIdx > prevIdx ? 1 : -1);
        prevTabRef.current = tabId;
        setActiveTab(tabId);
    }, []);

    const handleStickyTabChange = useCallback((tabId: AboutTabId) => {
        const prevIdx = TAB_ORDER.indexOf(prevTabRef.current);
        const nextIdx = TAB_ORDER.indexOf(tabId);
        setTabDirection(nextIdx > prevIdx ? 1 : -1);
        prevTabRef.current = tabId;
        setActiveTab(tabId);
        // Scroll to top — same pattern as BilanBottomNav / LegalContentBlocks
        const scrollContainer = document.getElementById('main-scroll-container');
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (scrollContainer) scrollContainer.scrollTop = 0;
    }, []);

    return (
        <LayoutGroup>
            {/* T0: Title */}
            <motion.div className="flex flex-col gap-[2px] px-1 w-full relative items-center" {...cascade(0)}>
                <motion.div className="flex items-center gap-2.5 justify-center" {...cascade(0)}>
                    <div
                        className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                        style={{ backgroundColor: "rgba(112,56,255,0.12)", border: "1px solid rgba(112,56,255,0.2)" }}
                    >
                        <Info className="w-4 h-4 text-[#7038FF]" />
                    </div>
                    <h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight">
                        {t("about.title")}
                    </h2>
                </motion.div>
                <motion.div className="flex items-center gap-2 mt-1 justify-center" {...cascade(0.04)}>
                    <span className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight">
                        {t("about.tagline")}
                    </span>
                    <span
                        className="px-2 py-0.5 rounded-full font-manrope font-bold text-[9px] tracking-wider"
                        style={{ backgroundColor: 'rgba(112,56,255,0.12)', color: '#7038FF' }}
                    >
                        {MOCK_ABOUT.version}
                    </span>
                </motion.div>
            </motion.div>

            {/* T1: Inline Tab navigation — observed for sticky trigger */}
            <div ref={inlineTabsRef} className="w-full">
                {!showStickyNav ? (
                    <motion.div className="flex w-full gap-1" {...cascade(0.08)}>
                        {TAB_ORDER.map((tabId) => {
                            const isActive = tabId === activeTab;
                            const TabIcon = TAB_ICONS[tabId];
                            const color = TAB_COLORS[tabId];
                            const tabData = MOCK_ABOUT_TABS.find(t => t.id === tabId)!;

                            return (
                                <button
                                    key={tabId}
                                    onClick={() => handleTabChange(tabId)}
                                    className="relative flex-1 flex items-center justify-center gap-1.5 py-[9px] px-[8px] rounded-[12px] font-manrope font-medium text-[11.5px] transition-colors duration-200 cursor-pointer"
                                    style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-[12px]"
                                            style={{
                                                backgroundColor: `${color}15`,
                                                border: `1px solid ${color}30`,
                                            }}
                                            layoutId="about-tab-pill"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <TabIcon
                                        className="relative z-10 w-3.5 h-3.5 transition-colors duration-200"
                                        style={{ color: isActive ? color : "var(--muted-foreground)" }}
                                    />
                                    {/* Soul label — transmigrates to sticky nav */}
                                    <motion.span
                                        className="relative z-10"
                                        layoutId={`about-soul-${tabId}`}
                                        transition={{ type: "spring", stiffness: 105, damping: 18, mass: 1 }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        {t(TAB_LABEL_KEYS[tabId])}
                                    </motion.span>

                                    {/* Horizon badge for new items */}
                                    {tabId === 'horizon' && (
                                        <motion.div
                                            className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#f59e0b]"
                                            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                ) : (
                    /* Ghost placeholder — keeps layout stable, soul labels are in sticky nav */
                    <div className="flex w-full gap-1">
                        {TAB_ORDER.map((tabId) => {
                            const isActive = tabId === activeTab;
                            const TabIcon = TAB_ICONS[tabId];
                            const color = TAB_COLORS[tabId];
                            const tabData = MOCK_ABOUT_TABS.find(t => t.id === tabId)!;
                            return (
                                <button
                                    key={tabId}
                                    onClick={() => handleTabChange(tabId)}
                                    className="relative flex-1 flex items-center justify-center gap-1.5 py-[9px] px-[8px] rounded-[12px] font-manrope font-medium text-[11.5px] cursor-pointer"
                                    style={{ color: isActive ? "var(--foreground)" : "var(--muted-foreground)" }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-[12px]"
                                            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                                            layoutId="about-tab-pill"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <TabIcon
                                        className="relative z-10 w-3.5 h-3.5"
                                        style={{ color: isActive ? color : "var(--muted-foreground)" }}
                                    />
                                    <span className="relative z-10 opacity-0">{t(TAB_LABEL_KEYS[tabId])}</span>
                                    {tabId === 'horizon' && (
                                        <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#f59e0b] opacity-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* T2: Tab content — lateral spatial flow */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeTab}
                    className="w-full"
                    initial={{ opacity: 0, x: tabDirection * 60, filter: `blur(${CASCADE_BLUR}px)` }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: REGAL_EASE } }}
                    exit={{ opacity: 0, x: tabDirection * -60, filter: `blur(${EXIT_BLUR}px)`, transition: { duration: 0.25, ease: REGAL_EASE } }}
                >
                    {activeTab === 'histoire' && <HistoireTab />}
                    {activeTab === 'pourvous' && <PourVousTab />}
                    {activeTab === 'horizon' && <HorizonTab />}
                </motion.div>
            </AnimatePresence>

            {/* T3: Footer */}
            <motion.div
                className="w-full flex flex-col items-center gap-1.5 pb-6 pt-2"
                {...cascade(0.6)}
            >
                <p className="font-manrope font-normal text-[11px] text-muted-foreground/40 text-center">
                    {MOCK_ABOUT.copyright}
                </p>
                <p className="font-manrope font-normal text-[10px] text-muted-foreground/25 text-center">
                    {MOCK_ABOUT.buildDate}
                </p>
            </motion.div>

            {/* ═══ Sticky Bottom Tab Nav — Portaled to document.body ═══ */}
            {createPortal(
                <AnimatePresence>
                    {showStickyNav && (
                        <motion.div
                            key="navbar-about-sticky"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0, transition: { type: "spring", stiffness: 82, damping: 24, mass: 1 } }}
                            transition={{ type: "spring", stiffness: 82, damping: 24, mass: 1 }}
                            className="fixed bottom-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-md border-t border-border pb-12 pt-3 px-2 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                            style={{ willChange: "transform" }}
                        >
                            {TAB_ORDER.map((tabId) => {
                                const TabIcon = TAB_ICONS[tabId];
                                const isActive = activeTab === tabId;
                                const color = TAB_COLORS[tabId];
                                const tabData = MOCK_ABOUT_TABS.find(t => t.id === tabId)!;

                                return (
                                    <div
                                        key={tabId}
                                        onClick={() => handleStickyTabChange(tabId)}
                                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer relative group transition-all duration-300"
                                    >
                                        {/* Glow */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="about-bottom-nav-glow"
                                                className="absolute -inset-3 blur-xl rounded-full"
                                                style={{ backgroundColor: `${color}20` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* Icon */}
                                        <TabIcon
                                            className="relative z-10 w-5 h-5 transition-all duration-300"
                                            style={{
                                                color: isActive ? color : "var(--muted-foreground)",
                                                opacity: isActive ? 1 : 0.4,
                                                strokeWidth: isActive ? 2.5 : 2
                                            }}
                                        />

                                        {/* Soul Label — transmigrates from inline tabs */}
                                        <div className="h-[18px] flex items-center justify-center relative overflow-visible">
                                            <motion.span
                                                layoutId={`about-soul-${tabId}`}
                                                className="text-[10px] font-bold font-manrope whitespace-nowrap"
                                                style={{
                                                    color: isActive ? color : "var(--muted-foreground)",
                                                    zIndex: 9999,
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.3,
                                                }}
                                                exit={{ opacity: 1, transition: { duration: 0 } }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 105,
                                                    damping: 18,
                                                    mass: 1,
                                                }}
                                            >
                                                {t(TAB_LABEL_KEYS[tabId])}
                                            </motion.span>
                                        </div>

                                        {/* Active dot */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="about-active-dot"
                                                className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                        )}

                                        {/* Horizon new badge in sticky */}
                                        {tabId === 'horizon' && !isActive && (
                                            <motion.div
                                                className="absolute top-0 right-1/4 w-[5px] h-[5px] rounded-full bg-[#f59e0b]"
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </LayoutGroup>
    );
}