import { motion, AnimatePresence } from "motion/react";
import { forwardRef, useRef } from "react";
import { CalendarDays, Calendar, CalendarRange } from "lucide-react";
import svgStreamingPaths from "../../../imports/svg-cjtdiup6tt";
import svgSocialPaths from "../../../imports/svg-5l7mwq3svc";
import svgRadioPaths from "../../../imports/svg-ng0n0xwse";
import {
    MOCK_NIVEAU_STREAMING, MOCK_NIVEAU_SOCIAL, MOCK_NIVEAU_RADIO,
    type NiveauMetricData, type NiveauUniverseData,
} from "../../data/mock-backend";
import { useI18nBilan } from "./useI18nBilan";
import { useTranslation } from "../language-provider";

/**
 * ============================================================================
 * NIVEAU CONTENT BLOCKS — Level Overview by Universe
 * ============================================================================
 * 
 * @backend All metrics come from MOCK_NIVEAU_* (mock-backend.ts).
 * Replace with: GET /api/v1/artist/:id/niveau/:universe
 * Each metric has a baseValue and tier badge.
 * The frontend applies PERIOD_MULTIPLIER for display values.
 * 
 * Page "Mon niveau" content blocks for each tab (Streaming / Réseaux / Médias).
 * First block: Period tabs (Semaine/Mois/Trimestre) — themed per universe.
 * Following blocks: Header card + metric cards with tier badges.
 * 
 * Tier System:
 * - Star (green): Exceptional metric performance
 * - Confirmé (purple): Solid/confirmed metric level
 * 
 * Uses SVG icons from Figma imports:
 * - svg-cjtdiup6tt (Streaming icons)
 * - svg-5l7mwq3svc (Social icons)
 * - svg-ng0n0xwse (Radio icons)
 */

type NiveauPeriod = 'semaine' | 'mois' | 'trimestre';

// ============================================================================
// UNIVERSE THEME COLORS — same values as Bilan*ContentBlocks
// ============================================================================
const UNIVERSE_COLORS: Record<string, { blockBg: string; blockBorder: string }> = {
    streaming: {
        blockBg: "rgba(242, 142, 66, 0.1)",
        blockBorder: "rgba(242, 142, 66, 0.6)",
    },
    social: {
        blockBg: "rgba(28, 180, 91, 0.1)",
        blockBorder: "rgba(28, 180, 91, 0.6)",
    },
    radio: {
        blockBg: "rgba(18, 134, 243, 0.1)",
        blockBorder: "rgba(18, 134, 243, 0.6)",
    },
};

// ============================================================================
// PERIOD MULTIPLIERS
// ============================================================================
const PERIOD_MULTIPLIER: Record<NiveauPeriod, number> = {
    semaine: 0.23,
    mois: 1,
    trimestre: 2.8,
};

// ============================================================================
// TIER BADGE TYPES
// ============================================================================
type BadgeTier = 'star' | 'confirmed';

const BADGE_CONFIG: Record<BadgeTier, { labelKey: string; iconType: 'star' | 'shield'; bgColor: string; borderColor: string; textColor: string }> = {
    star: {
        labelKey: "niveau.star",
        iconType: "star",
        bgColor: "var(--niveau-badge-star-bg)",
        borderColor: "var(--niveau-badge-star-border)",
        textColor: "var(--niveau-badge-star-text)",
    },
    confirmed: {
        labelKey: "niveau.confirmed",
        iconType: "shield",
        bgColor: "var(--niveau-badge-confirmed-bg)",
        borderColor: "var(--niveau-badge-confirmed-border)",
        textColor: "var(--niveau-badge-confirmed-text)",
    },
};

// ============================================================================
// Framer Motion block-level variants
// ============================================================================
const blockVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// --- Stagger Cascade for Inter-Tab Spatial Flow ---
const BLOCK_STAGGER = 0.09;
const BLOCK_X_OFFSET = 80;
const BLOCK_DURATION = 0.5;

// ── Period index map for SMS Spatial Flow direction ──
const PERIOD_INDEX: Record<NiveauPeriod, number> = {
    semaine: 0,
    mois: 1,
    trimestre: 2
};

// ── SMS (Samsara Spatial Flow) variants for period transitions ──
// Convention "viewport scroll" aligned with TAF tabs:
// direction > 0 → content enters from LEFT (x: -60), exits to RIGHT (x: 60)
const PERIOD_STAGGER = 0.06;
const getSmsVariants = (direction: number, staggerIndex: number = 0) => ({
    initial: { opacity: 0, x: direction > 0 ? -60 : 60, filter: "blur(4px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" as const, delay: staggerIndex * PERIOD_STAGGER } },
    exit: { opacity: 0, x: direction > 0 ? 60 : -60, filter: "blur(4px)", transition: { duration: 0.2, delay: staggerIndex * PERIOD_STAGGER * 0.5 } }
});

// ── CSS keyframes for alert overlay animations (always restart on mount) ──
const ALERT_KEYFRAMES_STYLE = `
@keyframes niveau-alert-glow-social {
  0%, 100% { box-shadow: 0 0 0px 0px rgba(28, 180, 91, 0.0), inset 0 0 0px rgba(28, 180, 91, 0.0); border-color: rgba(28, 180, 91, 0.2); }
  50% { box-shadow: 0 0 8px 1px rgba(28, 180, 91, 0.3), inset 0 0 6px rgba(28, 180, 91, 0.15); border-color: rgba(28, 180, 91, 0.7); }
}
@keyframes niveau-alert-glow-radio {
  0%, 100% { box-shadow: 0 0 0px 0px rgba(18, 134, 243, 0.0), inset 0 0 0px rgba(18, 134, 243, 0.0); border-color: rgba(18, 134, 243, 0.2); }
  50% { box-shadow: 0 0 8px 1px rgba(18, 134, 243, 0.3), inset 0 0 6px rgba(18, 134, 243, 0.15); border-color: rgba(18, 134, 243, 0.7); }
}
@keyframes niveau-alert-text-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
`;



// ============================================================================
// SVG ICON COMPONENTS — Streaming (from svg-cjtdiup6tt)
// ============================================================================

function IconPlay({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgStreamingPaths.p9ad9680} stroke={color} strokeWidth="1.5" transform="translate(1.25, 1.25)" />
            <path d={svgStreamingPaths.p3fa03300} stroke={color} strokeWidth="1.5" transform="translate(1.25, 1.25)" />
        </svg>
    );
}

function IconYoutube({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgStreamingPaths.pb6a5300} stroke={color} strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" />
        </svg>
    );
}

function IconPlaylist({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(2, 5)">
                <path d={svgStreamingPaths.p211c1058} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
                <path d={svgStreamingPaths.p32012d00} stroke={color} strokeWidth="1.5" />
                <path d={svgStreamingPaths.p1f5c8200} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconMedal({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(4, 1)">
                <path d={svgStreamingPaths.p30ddac70} stroke={color} strokeWidth="1.5" />
                <path d={svgStreamingPaths.p80a4b80} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconShareStreaming({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(3, 2)">
                <path d={svgStreamingPaths.p387b1080} stroke={color} strokeWidth="1.5" />
                <path d={svgStreamingPaths.p3841ef00} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
                <path d={svgStreamingPaths.p63c2700} stroke={color} strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconCourseDown({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgStreamingPaths.p260c1800} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
    );
}

// ============================================================================
// SVG ICON COMPONENTS — Social (from svg-5l7mwq3svc)
// ============================================================================

function IconShare({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(3, 2)">
                <path d={svgSocialPaths.p387b1080} stroke={color} strokeWidth="1.5" />
                <path d={svgSocialPaths.p3841ef00} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
                <path d={svgSocialPaths.p63c2700} stroke={color} strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconUsersGroup({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(2, 2)">
                <path d={svgSocialPaths.p298d380} stroke={color} strokeWidth="1.5" />
                <path d={svgSocialPaths.p3fa170c0} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
                <path d={svgSocialPaths.p16a17f00} stroke={color} strokeWidth="1.5" />
                <path d={svgSocialPaths.p24097a00} stroke={color} strokeLinecap="round" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconCourseUp({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgSocialPaths.p28f50000} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </svg>
    );
}

function IconChart({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(1, 1)">
                <path d="M20.75 20.75H0.75" stroke={color} strokeLinecap="round" strokeWidth="1.5" />
                <path d={svgSocialPaths.p7713b00} stroke={color} strokeWidth="1.5" />
            </g>
        </svg>
    );
}

function IconHeart({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgSocialPaths.p29260e00} fill={color} />
        </svg>
    );
}

function IconChatSquare({ color = "#1CB45B" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <path d={svgSocialPaths.p10df8dc0} fill={color} />
        </svg>
    );
}

// ============================================================================
// SVG ICON COMPONENTS — Radio (from svg-ng0n0xwse)
// ============================================================================

/** Radio broadcast icon — waves + play (Figma exact) */
function IconRadioBroadcast({ color = "#1286F3" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(1, 4)">
                <path d={svgRadioPaths.p2ac204d2} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgRadioPaths.p3c376780} stroke={color} strokeWidth="1.5" />
            </g>
        </svg>
    );
}

/** Globe icon — world/countries (Figma exact) */
function IconGlobe({ color = "#1286F3" }: { color?: string }) {
    return (
        <svg className="w-[24px] h-[24px]" fill="none" viewBox="0 0 24 24">
            <g transform="translate(1, 1)">
                <path d={svgRadioPaths.p1409ec00} stroke={color} strokeWidth="1.5" />
                <path d={svgRadioPaths.p1e37c100} stroke={color} strokeWidth="1.5" />
                <path d="M0.750977 10.75H20.751" stroke={color} strokeLinecap="round" strokeWidth="1.5" />
            </g>
        </svg>
    );
}

/** Bolt icon — développement badge (Figma exact) */
function IconBolt({ color = "#FF5222" }: { color?: string }) {
    return (
        <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 15 15">
            <path d={svgRadioPaths.p1c569600} fill={color} />
        </svg>
    );
}

/** Reuse streaming icons with blue color default for extra Radio metrics */
function IconRadioChart({ color = "#1286F3" }: { color?: string }) {
    return <IconChart color={color} />;
}

function IconRadioCourseUp({ color = "#1286F3" }: { color?: string }) {
    return <IconCourseUp color={color} />;
}

function IconRadioShare({ color = "#1286F3" }: { color?: string }) {
    return <IconShare color={color} />;
}

function IconRadioMedal({ color = "#1286F3" }: { color?: string }) {
    return <IconMedal color={color} />;
}

// ============================================================================
// SHARED SVG: Star badge + Shield badge (shared paths in both SVG files)
// ============================================================================

function IconStarBadge({ color = "#4CAF50" }: { color?: string }) {
    return (
        <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 15 15">
            <path d={svgSocialPaths.p112032c0} fill={color} />
        </svg>
    );
}

function IconShieldBadge({ color = "#8B5CF6" }: { color?: string }) {
    return (
        <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 15 15">
            <path d={svgSocialPaths.p3b7b1840} fill={color} />
        </svg>
    );
}

// ============================================================================
// SUB-COMPONENT: Tier Badge
// ============================================================================
function TierBadge({ tier }: { tier: BadgeTier }) {
    const { t } = useTranslation();
    const config = BADGE_CONFIG[tier];
    return (
        <div
            className="relative flex items-center justify-center gap-[5px] px-[10px] py-[4px] rounded-[50px] shrink-0"
            style={{ backgroundColor: config.bgColor }}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-[50px]"
                style={{ border: `0.2px solid ${config.borderColor}` }}
            />
            {config.iconType === 'star'
                ? <IconStarBadge color={config.textColor} />
                : <IconShieldBadge color={config.textColor} />
            }
            <span
                className="font-poppins not-italic relative text-[10px]"
                style={{ color: config.textColor }}
            >
                {t(config.labelKey)}
            </span>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENT: Metric Card (Generic — works for all universes)
// ============================================================================
interface MetricCardProps {
    icon: React.ReactNode;
    labelKey: string;
    value: string;
    tier: BadgeTier;
    staggerIndex: number;
    tabDirection: number;
    cardBgVar: string;
    cardBorderVar: string;
    iconBgVar: string;
}

function MetricCard({ icon, labelKey, value, tier, staggerIndex, tabDirection, cardBgVar, cardBorderVar, iconBgVar }: MetricCardProps) {
    const { t } = useTranslation();
    const getProps = () => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: {
            opacity: 1, x: 0, filter: "blur(0px)",
            transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: staggerIndex * BLOCK_STAGGER }
        }
    }) : {};

    return (
        <motion.div {...getProps()}>
            <div
                className="relative rounded-[12px] shrink-0 w-full"
                style={{ backgroundColor: cardBgVar }}
            >
                <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                    <div className="flex items-center justify-between px-[14px] py-[20px] w-full">
                        <div className="flex gap-[15px] items-center shrink-0">
                            <div
                                className="flex h-[43px] items-center overflow-clip px-[11px] py-px rounded-[8px] shrink-0"
                                style={{ backgroundColor: iconBgVar }}
                            >
                                {icon}
                            </div>
                            <div className="flex flex-col gap-[6px] items-start leading-[normal] shrink-0 text-foreground">
                                <p className="font-manrope font-normal text-[14px]">{t(labelKey)}</p>
                                <p className="font-manrope font-bold text-[16px]">{value}</p>
                            </div>
                        </div>
                        <TierBadge tier={tier} />
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{ border: `0.5px solid ${cardBorderVar}` }}
                />
            </div>
        </motion.div>
    );
}

// ============================================================================
// SUB-COMPONENT: Streaming Header Card
// ============================================================================
function StreamingHeaderCard({ tabDirection, period, periodDirection }: { tabDirection: number; period: NiveauPeriod; periodDirection: number }) {
    const { getDateRange, t } = useI18nBilan();
    const getProps = () => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: {
            opacity: 1, x: 0, filter: "blur(0px)",
            transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: 1 * BLOCK_STAGGER }
        }
    }) : {};

    return (
        <motion.div {...getProps()}>
            <div
                className="relative rounded-[12px] shrink-0 w-full"
                style={{ backgroundImage: "var(--niveau-header-streaming-gradient)" }}
            >
                <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="flex flex-col gap-[10px] px-[14px] py-[20px] w-full">
                        {/* Dynamic date range — first element, Bilan format, internal Spatial Flow */}
                        <AnimatePresence mode="wait">
                            <motion.div key={`stream-hdr-date-${period}`} className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }} {...getSmsVariants(periodDirection, 0)}>
                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                                    {getDateRange(period)}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[15px] items-center shrink-0">
                                <div
                                    className="flex h-[43px] items-center overflow-clip px-[11px] py-px rounded-[8px] shrink-0"
                                    style={{ backgroundImage: "linear-gradient(90.8363deg, rgba(255, 82, 34, 0.9) 1.5047%, rgba(242, 142, 66, 0.8) 98.378%)" }}
                                >
                                    <IconPlay color="white" />
                                </div>
                                <div className="flex flex-col gap-[6px] items-start leading-[normal] shrink-0 text-foreground">
                                    <p className="font-manrope font-bold text-[16px]" translate="no">Streaming</p>
                                    <p className="font-manrope font-normal text-[11px] max-w-[156px]">{t("niveau.classificationDesc")}</p>
                                </div>
                            </div>
                            <div
                                className="flex gap-[5px] items-center justify-center px-[10px] py-[4px] rounded-[50px] shrink-0"
                                style={{ backgroundColor: "var(--niveau-badge-confirmed-bg)" }}
                            >
                                <IconShieldBadge color="white" />
                                <span className="font-poppins not-italic leading-[normal] text-[10px] text-foreground">{t("niveau.confirmed")}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{ border: "0.5px solid var(--niveau-header-streaming-border)" }}
                />
            </div>
        </motion.div>
    );
}

// ============================================================================
// SUB-COMPONENT: Social Header Card (with description overlay)
// ============================================================================
function SocialHeaderCard({ tabDirection, period, periodDirection }: { tabDirection: number; period: NiveauPeriod; periodDirection: number }) {
    const { getDateRange, t } = useI18nBilan();
    const getProps = () => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: {
            opacity: 1, x: 0, filter: "blur(0px)",
            transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: 1 * BLOCK_STAGGER }
        }
    }) : {};

    return (
        <motion.div {...getProps()}>
            <div
                className="relative rounded-[12px] shrink-0 w-full"
                style={{ backgroundImage: "var(--niveau-header-social-gradient)" }}
            >
                <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="flex flex-col gap-[12px] items-start px-[14px] py-[20px] w-full">
                        {/* Dynamic date range — first element, Bilan format, internal Spatial Flow */}
                        <AnimatePresence mode="wait">
                            <motion.div key={`social-hdr-date-${period}`} className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }} {...getSmsVariants(periodDirection, 0)}>
                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                                    {getDateRange(period)}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        {/* Top row: icon + title + badge */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[15px] items-center shrink-0">
                                <div
                                    className="flex h-[43px] items-center overflow-clip px-[11px] py-px rounded-[8px] shrink-0"
                                    style={{ backgroundImage: "var(--niveau-header-social-icon-gradient)" }}
                                >
                                    <IconShare color="white" />
                                </div>
                                <div className="flex flex-col gap-[6px] items-start leading-[normal] shrink-0 text-foreground">
                                    <p className="font-manrope font-bold text-[16px]" translate="no">Social</p>
                                    <p className="font-manrope font-normal text-[11px] max-w-[157px]">{t("niveau.classificationDesc")}</p>
                                </div>
                            </div>
                            <div
                                className="flex gap-[5px] items-center justify-center px-[10px] py-[4px] rounded-[50px] shrink-0"
                                style={{ backgroundColor: "#8B5CF6" }}
                            >
                                <IconShieldBadge color="white" />
                                <span className="font-poppins not-italic leading-[normal] text-[10px] text-foreground">{t("niveau.confirmed")}</span>
                            </div>
                        </div>
                        {/* Description overlay */}
                        <div
                            className="rounded-[8px] shrink-0 w-full md:w-fit md:max-w-[35%] relative overflow-hidden"
                            style={{
                                backgroundColor: "var(--niveau-overlay-social-bg)",
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "rgba(28, 180, 91, 0.2)",
                                animation: "niveau-alert-glow-social 3s ease-in-out infinite",
                            }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: ALERT_KEYFRAMES_STYLE }} />
                            <div className="flex flex-col items-start pb-[8px] pt-[9px] px-[8px]">
                                <p
                                    className="font-manrope font-normal leading-[normal] text-[14px] text-foreground"
                                    style={{ animation: "niveau-alert-text-pulse 3s ease-in-out infinite" }}
                                >
                                    {t("niveau.alertSocial")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{ border: "0.5px solid var(--niveau-header-social-border)" }}
                />
            </div>
        </motion.div>
    );
}

// ============================================================================
// SUB-COMPONENT: Radio Header Card (with description overlay)
// ============================================================================
function RadioHeaderCard({ tabDirection, period, periodDirection }: { tabDirection: number; period: NiveauPeriod; periodDirection: number }) {
    const { getDateRange, t } = useI18nBilan();
    const getProps = () => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: {
            opacity: 1, x: 0, filter: "blur(0px)",
            transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: 1 * BLOCK_STAGGER }
        }
    }) : {};

    return (
        <motion.div {...getProps()}>
            <div
                className="relative rounded-[12px] shrink-0 w-full"
                style={{ backgroundImage: "var(--niveau-header-radio-gradient)" }}
            >
                <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="flex flex-col gap-[12px] items-start px-[14px] py-[20px] w-full">
                        {/* Dynamic date range — first element, Bilan format, internal Spatial Flow */}
                        <AnimatePresence mode="wait">
                            <motion.div key={`radio-hdr-date-${period}`} className="flex items-center font-manrope" style={{ color: 'var(--dashboard-welcome-text)' }} {...getSmsVariants(periodDirection, 0)}>
                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">
                                    {getDateRange(period)}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        {/* Top row: icon + title + badge */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex gap-[15px] items-center shrink-0">
                                <div
                                    className="flex h-[43px] items-center overflow-clip px-[11px] py-px rounded-[8px] shrink-0"
                                    style={{ backgroundImage: "var(--niveau-header-radio-icon-gradient)" }}
                                >
                                    <IconRadioBroadcast color="white" />
                                </div>
                                <div className="flex flex-col gap-[6px] items-start leading-[normal] shrink-0 text-foreground">
                                    <p className="font-manrope font-bold text-[16px]" translate="no">Radio</p>
                                    <p className="font-manrope font-normal text-[11px] max-w-[157px]">{t("niveau.classificationDesc")}</p>
                                </div>
                            </div>
                            <div
                                className="flex gap-[5px] items-center justify-center px-[10px] py-[4px] rounded-[50px] shrink-0"
                                style={{ backgroundColor: "#8B5CF6" }}
                            >
                                <IconShieldBadge color="white" />
                                <span className="font-poppins not-italic leading-[normal] text-[10px] text-foreground">{t("niveau.confirmed")}</span>
                            </div>
                        </div>
                        {/* Description overlay */}
                        <div
                            className="rounded-[8px] shrink-0 w-full md:w-fit md:max-w-[35%] relative overflow-hidden"
                            style={{
                                backgroundColor: "var(--niveau-overlay-radio-bg)",
                                borderWidth: "1px",
                                borderStyle: "solid",
                                borderColor: "rgba(18, 134, 243, 0.2)",
                                animation: "niveau-alert-glow-radio 3s ease-in-out infinite",
                            }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: ALERT_KEYFRAMES_STYLE }} />
                            <div className="flex flex-col items-start pb-[8px] pt-[9px] px-[8px]">
                                <p
                                    className="font-manrope font-normal leading-[normal] text-[14px] text-foreground"
                                    style={{ animation: "niveau-alert-text-pulse 3s ease-in-out infinite" }}
                                >
                                    {t("niveau.alertRadio")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none rounded-[12px]"
                    style={{ border: "0.5px solid var(--niveau-header-radio-border)" }}
                />
            </div>
        </motion.div>
    );
}

// ============================================================================
// SUB-COMPONENT: Niveau Period Tabs — themed by universe
// ============================================================================
interface NiveauPeriodTabsProps {
    activePeriod: NiveauPeriod;
    onPeriodChange: (period: NiveauPeriod) => void;
    activeTab: string;
}

const NiveauPeriodTabs = forwardRef<HTMLDivElement, NiveauPeriodTabsProps>(
    ({ activePeriod, onPeriodChange, activeTab }, ref) => {
    const { periodTabs: tabs } = useI18nBilan();
    const colors = UNIVERSE_COLORS[activeTab] || UNIVERSE_COLORS.streaming;

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
                            style={isActive ? { backgroundColor: colors.blockBg, borderColor: colors.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="niveau-period-tab-fill"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: colors.blockBg, border: `1px solid ${colors.blockBorder}` }}
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

NiveauPeriodTabs.displayName = "NiveauPeriodTabs";

// ============================================================================
// SUB-COMPONENT: Niveau Period Tabs SMS (Samsara Spatial Flow) — Inline Bottom
// ============================================================================
/**
 * SMS (Samsara Spatial Flow) Protocol for Niveau:
 * - Inline period buttons at the bottom of the content blocks.
 * - Breathes naturally in the scroll flow (not fixed).
 * - Click on non-active period → changes period + scrolls to top.
 * - NO layoutId — pure SMS, not TAF.
 * - "Changer de période" label above buttons.
 * - Themed per active universe (orange/green/blue).
 */
const NiveauPeriodTabsSms = ({ activePeriod, onPeriodChange, activeTab }: { activePeriod: NiveauPeriod; onPeriodChange: (p: NiveauPeriod) => void; activeTab: string }) => {
    const { periodTabs: tabs, t } = useI18nBilan();
    const colors = UNIVERSE_COLORS[activeTab] || UNIVERSE_COLORS.streaming;

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
                            style={isActive ? { backgroundColor: colors.blockBg, borderColor: colors.blockBorder } : undefined}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="niveau-period-tab-fill-sms"
                                    className="absolute inset-0 rounded-[12px]"
                                    style={{ backgroundColor: colors.blockBg, border: `1px solid ${colors.blockBorder}` }}
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
// DATA: Formatting helper
// ============================================================================
function formatNumber(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return Math.round(n).toString();
}

// ============================================================================
// DATA: Streaming metrics
// ============================================================================
interface NiveauMetric {
    icon: (props: { color?: string }) => React.ReactNode;
    labelKey: string;
    baseValue: number;
    tier: BadgeTier;
    isCount?: boolean;
    suffix?: string;
}

const STREAMING_METRICS: NiveauMetric[] = [
    { icon: IconPlay, labelKey: "niveau.streaming.auditeurs_spotify", baseValue: 115_500, tier: "star" },
    { icon: IconYoutube, labelKey: "niveau.streaming.vues_youtube", baseValue: 18_000_000, tier: "star" },
    { icon: IconPlaylist, labelKey: "niveau.streaming.nombre_de_playlists", baseValue: 178, tier: "confirmed", isCount: true },
    { icon: IconMedal, labelKey: "niveau.streaming.top_25_percent_playlists", baseValue: 34, tier: "confirmed", isCount: true },
    { icon: IconShareStreaming, labelKey: "niveau.streaming.plateformes_de_playlist", baseValue: 3, tier: "confirmed", isCount: true },
    { icon: IconCourseDown, labelKey: "niveau.streaming.playlists_bottom_25_percent", baseValue: 8, tier: "star", isCount: true },
];

// ============================================================================
// DATA: Social metrics
// ============================================================================
const SOCIAL_METRICS: NiveauMetric[] = [
    { icon: IconUsersGroup, labelKey: "niveau.social.followers", baseValue: 10_200_000, tier: "star" },
    { icon: IconCourseUp, labelKey: "niveau.social.evolution_followers", baseValue: 1_900_000, tier: "star" },
    { icon: IconShare, labelKey: "niveau.social.nombre_de_plateformes", baseValue: 18, tier: "confirmed", isCount: true },
    { icon: IconChart, labelKey: "niveau.social.taux_dengagement", baseValue: 2.4, tier: "confirmed", isCount: true, suffix: "%" },
    { icon: IconHeart, labelKey: "niveau.social.moy_likes_par_post", baseValue: 114_000, tier: "confirmed", isCount: true },
    { icon: IconChatSquare, labelKey: "niveau.social.moy_commentaires_par_post", baseValue: 1_400, tier: "star", isCount: true },
];

// ============================================================================
// DATA: Radio metrics
// ============================================================================
const RADIO_METRICS: NiveauMetric[] = [
    { icon: IconRadioBroadcast, labelKey: "niveau.radio.lectures_totales", baseValue: 68, tier: "confirmed" },
    { icon: IconGlobe, labelKey: "niveau.radio.pays", baseValue: 3, tier: "confirmed", isCount: true },
    { icon: IconRadioChart, labelKey: "niveau.radio.diffusions_radio", baseValue: 342, tier: "star" },
    { icon: IconRadioShare, labelKey: "niveau.radio.stations_diffusantes", baseValue: 12, tier: "confirmed", isCount: true },
    { icon: IconRadioCourseUp, labelKey: "niveau.radio.part_daudience", baseValue: 0.8, tier: "confirmed", isCount: true, suffix: "%" },
    { icon: IconRadioMedal, labelKey: "niveau.radio.mentions_presse", baseValue: 24, tier: "star" },
];

// ============================================================================
// MAIN EXPORT: NiveauContentBlocks
// ============================================================================
interface NiveauContentBlocksProps {
    activeTab: string;
    period: NiveauPeriod;
    onPeriodChange: (period: NiveauPeriod) => void;
    periodTabsRef?: React.Ref<HTMLDivElement>;
    tabDirection?: number;
}

export function NiveauContentBlocks({ activeTab, period, onPeriodChange, periodTabsRef, tabDirection = 0 }: NiveauContentBlocksProps) {
    const { t } = useTranslation();
    const mult = PERIOD_MULTIPLIER[period];

    // ── SMS Period Direction Tracking ──
    const prevPeriodRef = useRef<NiveauPeriod>(period);
    const periodDirRef = useRef<number>(1); // +1 = right, -1 = left

    if (prevPeriodRef.current !== period) {
        periodDirRef.current = PERIOD_INDEX[period] > PERIOD_INDEX[prevPeriodRef.current] ? 1 : -1;
        prevPeriodRef.current = period;
    }

    // ── SMS handler: change period + scroll to top ──
    const handleSmsPeriodChange = (newPeriod: NiveauPeriod) => {
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

    const getBlockMotionProps = (index: number) => tabDirection !== 0 ? ({
        initial: { opacity: 0, x: tabDirection > 0 ? -BLOCK_X_OFFSET : BLOCK_X_OFFSET, filter: "blur(6px)" },
        animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: BLOCK_DURATION, ease: "easeOut" as const, delay: index * BLOCK_STAGGER } }
    }) : {};

    const renderMetrics = (
        metrics: NiveauMetric[],
        cardBgVar: string,
        cardBorderVar: string,
        iconBgVar: string
    ) => (
        metrics.map((metric, index) => {
            const rawValue = metric.isCount ? metric.baseValue : Math.round(metric.baseValue * mult);
            const displayValue = metric.suffix
                ? `${metric.baseValue}${metric.suffix}`
                : formatNumber(rawValue);
            return (
                <MetricCard
                    key={metric.labelKey}
                    icon={<metric.icon />}
                    labelKey={metric.labelKey}
                    value={displayValue}
                    tier={metric.tier}
                    staggerIndex={index + 2}
                    tabDirection={tabDirection}
                    cardBgVar={cardBgVar}
                    cardBorderVar={cardBorderVar}
                    iconBgVar={iconBgVar}
                />
            );
        })
    );

    // ── SMS-wrapped tab content — Bilan-pattern Spatial Flow:
    // Each block is a persistent container. Only the period-dependent content
    // inside each block transitions via its own AnimatePresence mode="wait",
    // keyed by period, with stagger cascade (staggerIndex × PERIOD_STAGGER).
    // Header card date: stagger 0 (handled internally by header card).
    // Metric cards: stagger 1→6 (one per metric).
    // ──
    const renderTabContent = (
        headerCard: React.ReactNode,
        metrics: NiveauMetric[],
        cardBgVar: string,
        cardBorderVar: string,
        iconBgVar: string,
        tabKey: string
    ) => (
        <div className="flex flex-col gap-[12px] w-full">
            {headerCard}
            {metrics.map((metric, index) => {
                const rawValue = metric.isCount ? metric.baseValue : Math.round(metric.baseValue * mult);
                const displayValue = metric.suffix
                    ? `${metric.baseValue}${metric.suffix}`
                    : formatNumber(rawValue);
                const staggerIdx = index + 1;
                return (
                    <div
                        key={metric.labelKey}
                        className="relative rounded-[12px] shrink-0 w-full overflow-hidden"
                        style={{ backgroundColor: cardBgVar }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${tabKey}-${metric.labelKey}-${period}`}
                                className="flex flex-row items-center overflow-clip rounded-[inherit] size-full"
                                {...getSmsVariants(periodDirRef.current, staggerIdx)}
                            >
                                <div className="flex items-center justify-between px-[14px] py-[20px] w-full">
                                    <div className="flex gap-[15px] items-center shrink-0">
                                        <div
                                            className="flex h-[43px] items-center overflow-clip px-[11px] py-px rounded-[8px] shrink-0"
                                            style={{ backgroundColor: iconBgVar }}
                                        >
                                            <metric.icon />
                                        </div>
                                        <div className="flex flex-col gap-[6px] items-start leading-[normal] shrink-0 text-foreground">
                                            <p className="font-manrope font-normal text-[14px]">{t(metric.labelKey)}</p>
                                            <p className="font-manrope font-bold text-[16px]">{displayValue}</p>
                                        </div>
                                    </div>
                                    <TierBadge tier={metric.tier} />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none rounded-[12px]"
                            style={{ border: `0.5px solid ${cardBorderVar}` }}
                        />
                    </div>
                );
            })}

            {/* SMS (Samsara Spatial Flow) — Inline period tabs at bottom */}
            <NiveauPeriodTabsSms activePeriod={period} onPeriodChange={handleSmsPeriodChange} activeTab={activeTab} />
        </div>
    );

    return (
        <>
            {/* Onglets Période */}
            <motion.div {...getBlockMotionProps(0)}>
                <NiveauPeriodTabs ref={periodTabsRef} activePeriod={period} onPeriodChange={onPeriodChange} activeTab={activeTab} />
            </motion.div>

            {/* ============ STREAMING TAB ============ */}
            {activeTab === 'streaming' && renderTabContent(
                <StreamingHeaderCard tabDirection={tabDirection} period={period} periodDirection={periodDirRef.current} />,
                STREAMING_METRICS,
                "var(--niveau-metric-card-bg)",
                "var(--niveau-metric-card-border)",
                "var(--niveau-icon-bg-streaming)",
                "streaming"
            )}

            {/* ============ SOCIAL TAB ============ */}
            {activeTab === 'social' && renderTabContent(
                <SocialHeaderCard tabDirection={tabDirection} period={period} periodDirection={periodDirRef.current} />,
                SOCIAL_METRICS,
                "var(--niveau-metric-card-social-bg)",
                "var(--niveau-metric-card-social-border)",
                "var(--niveau-icon-bg-social)",
                "social"
            )}

            {/* ============ RADIO TAB ============ */}
            {activeTab === 'radio' && renderTabContent(
                <RadioHeaderCard tabDirection={tabDirection} period={period} periodDirection={periodDirRef.current} />,
                RADIO_METRICS,
                "var(--niveau-metric-card-radio-bg)",
                "var(--niveau-metric-card-radio-border)",
                "var(--niveau-icon-bg-radio)",
                "radio"
            )}
        </>
    );
}