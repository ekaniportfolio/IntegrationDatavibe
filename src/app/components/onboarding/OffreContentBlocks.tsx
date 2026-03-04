/**
 * ============================================================================
 * OFFRE CONTENT BLOCKS — Page "Nos offres"
 * ============================================================================
 *
 * Autonomous overlay page (same pattern as ConnexionsContentBlocks):
 * 1. Title block ("Nos offres" + subtitle)
 * 2. Role tabs (Artiste / Manager / Label / Coach) — brand purple
 * 3. Pricing cards (Découverte / Pro / Entreprise) per role
 *
 * This page does NOT use TAF tabs (Streaming/Réseaux/Médias).
 * Lateral Spatial Flow is handled by the parent AnimatePresence wrapper
 * in NewPlatform.tsx — no need to duplicate initial/animate/exit here.
 *
 * DYNAMIZED:
 * - All plan data imported from mock-backend.ts (§13)
 * - Plan selection triggers confirmation bottom sheet
 * - "Nous contacter" opens mailto link
 * - Cascade entrance animation (Nonchalant Cascade)
 *
 * @backend POST /api/v1/subscription/select
 * Body: { planId: string, roleId: string }
 * ============================================================================
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, LayoutGroup } from "motion/react";
import {
    Check, X, Sparkles, Crown, Building2,
    ChevronRight, Zap, Mail, UserPlus,
    Mic2, Briefcase, GraduationCap
} from "lucide-react";
import {
    MOCK_OFFRE_PLANS,
    type OffreRoleId,
    type OffreTierId,
    type OffrePlan,
    type OffreRole,
} from "../../data/mock-backend";
import { useTranslation } from "../language-provider";

/* ═══════════════════════════════════════════════════════════════════════════
 * NONCHALANT CASCADE — Same system as ConnexionsContentBlocks
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

/* ─── Billing period helpers ─── */
type BillingPeriod = 'monthly' | 'annual';
const ANNUAL_DISCOUNT = 0.20; // 20% off

/**
 * Parses a French price string like "9,99€" → 9.99
 * Returns null for non-numeric prices ("Sur mesure", "Custom", "0€")
 */
function parsePrice(price: string): number | null {
    if (price === '0€' || price === 'Sur mesure' || price === 'Custom') return null;
    const cleaned = price.replace('€', '').replace(',', '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

/**
 * Computes display price for a given billing period.
 * Annual = monthly × 12 × (1 - discount), displayed per month equivalent.
 * perMonthLabel: already-translated "/mois" or "/month" string
 */
function getDisplayPrice(plan: OffrePlan, period: BillingPeriod, perMonthLabel: string): { price: string; pricePeriod: string; originalMonthly?: string } {
    if (period === 'monthly') {
        // Translate mock pricePeriod from @backend data
        const translatedPeriod = plan.pricePeriod === '/mois' ? perMonthLabel : plan.pricePeriod;
        return { price: plan.price, pricePeriod: translatedPeriod };
    }
    const monthly = parsePrice(plan.price);
    if (monthly === null || monthly === 0) {
        return { price: plan.price, pricePeriod: plan.pricePeriod };
    }
    const annualTotal = monthly * 12 * (1 - ANNUAL_DISCOUNT);
    const monthlyEquiv = annualTotal / 12;
    const formatted = monthlyEquiv.toFixed(2).replace('.', ',') + '€';
    return {
        price: formatted,
        pricePeriod: perMonthLabel,
        originalMonthly: plan.price,
    };
}

/* ─── Tier visual config ─── */
const TIER_ICONS: Record<OffreTierId, typeof Sparkles> = {
    free: Zap,
    pro: Crown,
    enterprise: Building2,
};

const TIER_STYLES: Record<OffreTierId, {
    border: string;
    bg: string;
    iconBg: string;
    ctaBg: string;
    ctaHover: string;
    glow: string;
    badge?: string;
}> = {
    free: {
        border: "var(--border)",
        bg: "var(--dashboard-card-bg)",
        iconBg: "var(--muted)",
        ctaBg: "var(--muted)",
        ctaHover: "var(--accent)",
        glow: "none",
    },
    pro: {
        border: "rgba(112,56,255,0.4)",
        bg: "linear-gradient(180deg, rgba(112,56,255,0.08) 0%, rgba(45,30,255,0.04) 100%)",
        iconBg: "rgba(112,56,255,0.15)",
        ctaBg: "#7038FF",
        ctaHover: "#5c2dd6",
        glow: "0 0 40px rgba(112,56,255,0.15)",
        badge: "#7038FF",
    },
    enterprise: {
        border: "var(--border)",
        bg: "var(--dashboard-card-bg)",
        iconBg: "var(--muted)",
        ctaBg: "var(--muted)",
        ctaHover: "var(--accent)",
        glow: "none",
    },
};

/* ─── Role Tabs ─── */
const ROLE_ORDER: OffreRoleId[] = ['artiste', 'manager', 'label', 'coach'];

/* ─── Role icon + color mapping for bottom nav ─── */
const ROLE_NAV_META: Record<OffreRoleId, { icon: typeof Mic2; color: string }> = {
    artiste:  { icon: Mic2,            color: '#7038FF' },
    manager:  { icon: Briefcase,       color: '#9B6DFF' },
    label:    { icon: Building2,       color: '#A78BFA' },
    coach:    { icon: GraduationCap,   color: '#C4B5FD' },
};

/* ─── Billing Toggle ─── */

/**
 * Reactive Illumination Letter — reads the badge's x position via a
 * shared motion value and lights up when the badge passes behind it.
 */
function IlluminationLetter({
    letter,
    index,
    badgeProgress,
}: {
    letter: string;
    index: number;
    badgeProgress: ReturnType<typeof useMotionValue<number>>;
}) {
    /* Each letter occupies a fraction of the 0→1 travel.
     * 6 letters spread across the middle ~60% of the journey (0.15 – 0.75)
     * so illumination starts shortly after the badge leaves the toggle
     * and finishes just before the badge lands. */
    const LETTERS_COUNT = 6;
    const SPREAD_START = 0.12;
    const SPREAD_END = 0.72;
    const letterFraction = SPREAD_START + (index / (LETTERS_COUNT - 1)) * (SPREAD_END - SPREAD_START);
    const rampWidth = 0.10; // how quickly each letter goes from dim to bright

    const color = useTransform(
        badgeProgress,
        [letterFraction - rampWidth, letterFraction + rampWidth],
        [0.3, 1]
    );
    const textShadow = useTransform(
        badgeProgress,
        [letterFraction - rampWidth, letterFraction + rampWidth],
        ['0 0 0px rgba(112,56,255,0)', '0 0 10px rgba(112,56,255,0.35)']
    );

    return (
        <motion.span style={{ opacity: color, textShadow, color: 'var(--foreground)' }}>
            {letter}
        </motion.span>
    );
}

function BillingToggle({
    period,
    onToggle,
}: {
    period: BillingPeriod;
    onToggle: (p: BillingPeriod) => void;
}) {
    const { t } = useTranslation();
    const isAnnual = period === 'annual';
    const ANNUEL_LETTERS = ['A', 'n', 'n', 'u', 'e', 'l'];

    /*
     * Badge travel geometry (all relative to the right-side container):
     *   - Start: behind the toggle button, x ≈ -58px (center of toggle, hidden behind it)
     *   - End:   at rest position, x = 0 (its natural flex position)
     *
     * We drive everything from a single 0→1 spring "progress" value:
     *   progress 0 = badge hidden behind toggle
     *   progress 1 = badge at final position, all letters lit
     */
    const BADGE_HIDDEN_X = -100; // px — far enough to be fully behind toggle
    const BADGE_RESTING_X = 0;

    const progress = useMotionValue(isAnnual ? 1 : 0);
    const springProgress = useSpring(progress, {
        stiffness: 220,
        damping: 22,
        mass: 0.9,
    });

    // Drive the progress when isAnnual changes
    useEffect(() => {
        progress.set(isAnnual ? 1 : 0);
    }, [isAnnual, progress]);

    // Badge transforms derived from spring progress
    const badgeX = useTransform(springProgress, [0, 1], [BADGE_HIDDEN_X, BADGE_RESTING_X]);
    const badgeOpacity = useTransform(springProgress, [0, 0.18, 0.4], [0, 0.6, 1]);
    const badgeScale = useTransform(springProgress, [0, 0.3, 1], [0.3, 0.85, 1]);

    return (
        <motion.div
            className="flex items-center justify-center w-full"
            {...cascade(0.06)}
        >
            {/* Mensuel label */}
            <span
                className={`font-manrope font-medium text-[13px] cursor-pointer transition-colors duration-200 ${!isAnnual ? 'text-foreground' : 'text-muted-foreground/50'}`}
                onClick={() => onToggle('monthly')}
            >
                {t("offre.monthly")}
            </span>

            {/* Toggle + Annuel + Badge — single relative container, no layout shift */}
            <div className="flex items-center ml-3">
                {/* Toggle pill */}
                <button
                    onClick={() => onToggle(isAnnual ? 'monthly' : 'annual')}
                    className="relative w-[52px] h-[28px] rounded-full cursor-pointer transition-colors duration-300 shrink-0 z-[2]"
                    style={{
                        backgroundColor: isAnnual ? '#7038FF' : 'rgba(255,255,255,0.1)',
                        border: `1px solid ${isAnnual ? 'rgba(112,56,255,0.6)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                >
                    <motion.div
                        className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white"
                        animate={{ left: isAnnual ? 'calc(100% - 23px)' : '3px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                    />
                </button>

                {/* Right zone: Annuel letters + badge, positioned so badge can travel behind text */}
                <div className="relative flex items-center ml-3">
                    {/* Annuel — letters reactively illuminated by badge position */}
                    <span
                        className="font-manrope font-medium text-[13px] cursor-pointer select-none inline-flex relative z-[1]"
                        onClick={() => onToggle('annual')}
                    >
                        {ANNUEL_LETTERS.map((letter, i) => (
                            <IlluminationLetter
                                key={i}
                                letter={letter}
                                index={i}
                                badgeProgress={springProgress}
                            />
                        ))}
                    </span>

                    {/* Badge -20% — physically travels from behind the toggle through the letters */}
                    <motion.span
                        className="ml-2 font-manrope font-bold text-[10px] tracking-wider uppercase px-2 py-[3px] rounded-full whitespace-nowrap z-[0]"
                        style={{
                            backgroundColor: 'rgba(40,160,108,0.2)',
                            color: '#4ade80',
                            border: '1px solid rgba(40,160,108,0.3)',
                            x: badgeX,
                            opacity: badgeOpacity,
                            scale: badgeScale,
                        }}
                    >
                        -20%
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
}

function RoleTabs({
    activeRole,
    onRoleChange,
    roles,
    pillLayoutId = 'offre-role-pill',
    compact = false,
    enableSoulLabels = false,
}: {
    activeRole: OffreRoleId;
    onRoleChange: (role: OffreRoleId) => void;
    roles: OffreRole[];
    pillLayoutId?: string;
    compact?: boolean;
    enableSoulLabels?: boolean;
}) {
    return (
        <motion.div
            className={`flex w-full rounded-[14px] p-[3px] gap-[2px]`}
            style={{ backgroundColor: "rgba(112,56,255,0.08)", border: "1px solid rgba(112,56,255,0.15)" }}
            {...(!compact ? cascade(0.08) : {})}
        >
            {roles.map((role) => {
                const isActive = role.roleId === activeRole;
                return (
                    <button
                        key={role.roleId}
                        onClick={() => onRoleChange(role.roleId)}
                        className={`flex-1 relative ${compact ? 'py-[7px] px-[3px]' : 'py-[8px] px-[4px]'} rounded-[11px] font-manrope font-medium ${compact ? 'text-[11px]' : 'text-[12px]'} transition-colors duration-200 cursor-pointer whitespace-nowrap`}
                        style={{
                            color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                        }}
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-[11px]"
                                style={{ backgroundColor: "rgba(112,56,255,0.25)", border: "1px solid rgba(112,56,255,0.35)" }}
                                layoutId={pillLayoutId}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        {enableSoulLabels ? (
                            <motion.span
                                className="relative z-10"
                                layoutId={`offre-soul-${role.roleId}`}
                                transition={{ type: "spring", stiffness: 105, damping: 18, mass: 1 }}
                                style={{ display: 'inline-block' }}
                            >
                                {role.label}
                            </motion.span>
                        ) : (
                            <span className="relative z-10">{role.label}</span>
                        )}
                    </button>
                );
            })}
        </motion.div>
    );
}

/* ─── Plan Card ─── */
function PlanCard({
    plan,
    roleId,
    isSelected,
    onSelect,
    cascadeDelay,
    billingPeriod,
    spatialDirection,
    cardIndex,
}: {
    plan: OffrePlan;
    roleId: OffreRoleId;
    isSelected: boolean;
    onSelect: (plan: OffrePlan) => void;
    cascadeDelay: number;
    billingPeriod: BillingPeriod;
    spatialDirection: number;
    cardIndex: number;
}) {
    const { t } = useTranslation();
    const style = TIER_STYLES[plan.tierId];
    const Icon = TIER_ICONS[plan.tierId];
    const displayPrice = getDisplayPrice(plan, billingPeriod, t("offre.perMonth"));

    /* ── Spatial Flow lateral: stagger per card index ── */
    const SPATIAL_X = 70;
    const SPATIAL_STAGGER = 0.07;
    const SPATIAL_DURATION = 0.55;
    const SPATIAL_EXIT_DURATION = 0.3;
    const INTERNAL_STAGGER = 0.04; // nonchalance between internal elements
    const baseDelay = cardIndex * SPATIAL_STAGGER;

    const spatialCardVariants = {
        initial: {
            opacity: 0,
            x: spatialDirection * (SPATIAL_X + cardIndex * 12),
            filter: `blur(${CASCADE_BLUR}px)`,
        },
        animate: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
                duration: SPATIAL_DURATION,
                ease: REGAL_EASE,
                delay: baseDelay,
            },
        },
        exit: {
            opacity: 0,
            x: spatialDirection * -(SPATIAL_X + cardIndex * 8),
            filter: `blur(${EXIT_BLUR}px)`,
            transition: {
                duration: SPATIAL_EXIT_DURATION,
                ease: REGAL_EASE,
                delay: cardIndex * 0.04,
            },
        },
    };

    /* nonchalant internal elements — each child gets a progressive delay offset */
    const nonchalant = (internalIdx: number) => ({
        initial: { opacity: 0, y: 10, filter: "blur(3px)" },
        animate: {
            opacity: 1, y: 0, filter: "blur(0px)",
            transition: {
                duration: 0.45,
                ease: REGAL_EASE,
                delay: baseDelay + 0.12 + internalIdx * INTERNAL_STAGGER,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.15, delay: cardIndex * 0.03 },
        },
    });

    return (
        <motion.div
            className="relative w-full rounded-[18px] overflow-hidden"
            style={{
                background: style.bg,
                border: `1px solid ${isSelected ? '#7038FF' : style.border}`,
                boxShadow: plan.popular ? style.glow : "none",
            }}
            variants={spatialCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Popular badge */}
            {plan.popular && (
                <div className="absolute top-0 right-0">
                    <div
                        className="px-3 py-1 rounded-bl-[12px] rounded-tr-[17px] font-manrope font-bold text-[10px] tracking-wider text-white uppercase"
                        style={{ backgroundColor: "#7038FF" }}
                    >
                        {t("offre.recommended")}
                    </div>
                </div>
            )}

            <div className="p-5 flex flex-col gap-4">
                {/* Header — nonchalant 0 */}
                <motion.div className="flex items-start gap-3" {...nonchalant(0)}>
                    <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: style.iconBg }}
                    >
                        <Icon className="w-5 h-5" style={{ color: plan.popular ? "#7038FF" : "var(--muted-foreground)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-manrope font-bold text-[16px] text-foreground" translate="no">{plan.name}</p>
                        <p className="font-manrope font-normal text-[12px] text-muted-foreground">{plan.tagline}</p>
                    </div>
                </motion.div>

                {/* Price — nonchalant 1 */}
                <motion.div {...nonchalant(1)}>
                    <div className="flex items-baseline gap-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={`${displayPrice.price}-${billingPeriod}`}
                                className="font-manrope font-bold text-[32px] text-foreground leading-none"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.22 }}
                            >
                                {displayPrice.price}
                            </motion.span>
                        </AnimatePresence>
                        {displayPrice.pricePeriod && (
                            <span className="font-manrope font-normal text-[14px] text-muted-foreground">{displayPrice.pricePeriod}</span>
                        )}
                        {displayPrice.originalMonthly && (
                            <span className="font-manrope font-normal text-[12px] text-muted-foreground/50 line-through ml-1">{displayPrice.originalMonthly}</span>
                        )}
                    </div>
                    {/* Annual billing note */}
                    {billingPeriod === 'annual' && parsePrice(plan.price) !== null && parsePrice(plan.price) !== 0 && (
                        <p className="font-manrope font-normal text-[11px] text-[#4ade80]/60 mt-1">
                            {t("offre.billedAt")} {((parsePrice(plan.price)! * 12 * (1 - ANNUAL_DISCOUNT))).toFixed(2).replace('.', ',')}€{t("offre.perYear")}
                        </p>
                    )}
                </motion.div>

                {/* Separator — nonchalant 2 */}
                <motion.div
                    className="h-px w-full"
                    style={{ background: `linear-gradient(to right, transparent, ${plan.popular ? 'rgba(112,56,255,0.3)' : 'var(--border)'}, transparent)` }}
                    {...nonchalant(2)}
                />

                {/* Features — nonchalant 3 */}
                <motion.div className="flex flex-col gap-[10px]" {...nonchalant(3)}>
                    {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <div
                                className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: feature.included
                                        ? (plan.popular ? "rgba(112,56,255,0.2)" : "rgba(255,255,255,0.06)")
                                        : "transparent",
                                }}
                            >
                                {feature.included ? (
                                    <Check
                                        className="w-[11px] h-[11px]"
                                        style={{ color: plan.popular ? "#7038FF" : "var(--muted-foreground)" }}
                                        strokeWidth={3}
                                    />
                                ) : (
                                    <X className="w-[10px] h-[10px] text-muted-foreground/25" strokeWidth={2.5} />
                                )}
                            </div>
                            <span
                                className={`font-manrope text-[13px] ${
                                    !feature.included ? 'text-muted-foreground/30 line-through' :
                                    feature.highlight ? 'text-foreground font-medium' : 'text-foreground/70 font-normal'
                                }`}
                            >
                                {feature.label}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Button — nonchalant 4 */}
                <motion.div {...nonchalant(4)}>
                    <motion.button
                        onClick={() => onSelect(plan)}
                        className="relative w-full mt-2 py-[12px] px-4 rounded-[12px] font-manrope font-bold text-[14px] cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 overflow-hidden"
                        style={{
                            backgroundColor: isSelected ? "#28a06c" : style.ctaBg,
                            color: plan.popular || isSelected ? "#FFFFFF" : "var(--foreground)",
                            border: plan.popular && !isSelected ? "none" : `1px solid ${isSelected ? '#28a06c' : style.border}`,
                        }}
                        whileHover={!isSelected ? { scale: 1.01, backgroundColor: style.ctaHover } : undefined}
                        whileTap={!isSelected ? { scale: 0.98 } : undefined}
                    >
                        {/* Animated border beams for popular plan */}
                        {plan.popular && !isSelected && (
                            <>
                                <motion.span
                                    className="absolute top-0 left-0 w-full h-[1px]"
                                    style={{ background: "linear-gradient(to right, transparent, #7038FF, transparent)" }}
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                                <motion.span
                                    className="absolute bottom-0 left-0 w-full h-[1px]"
                                    style={{ background: "linear-gradient(to right, transparent, #7038FF, transparent)" }}
                                    animate={{ x: ["100%", "-100%"] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                            </>
                        )}
                        {isSelected ? (
                            <>
                                <Check className="w-4 h-4" strokeWidth={3} />
                                <span>{t("offre.planSelected")}</span>
                            </>
                        ) : (
                            <>
                                <span>{plan.ctaLabel}</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}

/* ─── Confirmation Bottom Sheet ─── */
function ConfirmSheet({
    isOpen,
    plan,
    roleLabel,
    billingPeriod,
    onClose,
    onConfirm,
}: {
    isOpen: boolean;
    plan: OffrePlan | null;
    roleLabel: string;
    billingPeriod: BillingPeriod;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsDone(true);
            setTimeout(() => {
                setIsDone(false);
                onConfirm();
            }, 1200);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && plan && (
                <>
                    {/* Frosted backdrop — blocks ALL interaction beneath */}
                    <motion.div
                        className="fixed inset-0 z-[300]"
                        style={{
                            backgroundColor: "rgba(0,0,0,0.55)",
                            backdropFilter: "blur(12px) saturate(0.6)",
                            WebkitBackdropFilter: "blur(12px) saturate(0.6)",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />
                    {/* Centered container — click-through except on the modal itself */}
                    <div
                        className="fixed inset-0 z-[301] flex items-center justify-center px-5"
                        style={{ pointerEvents: "none" }}
                    >
                        <motion.div
                            className="relative w-full max-w-[420px]"
                            initial={{ y: "60vh", scale: 0.92 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: "60vh", scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 260, damping: 28 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0.04, bottom: 0.5 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 120 || info.velocity.y > 500) onClose();
                            }}
                            style={{ touchAction: "none", pointerEvents: "auto" }}
                        >
                            <div
                                className="rounded-[24px] overflow-hidden"
                                style={{
                                    background: "linear-gradient(180deg, #141019 0%, #0d0a14 100%)",
                                    border: "1px solid rgba(112,56,255,0.3)",
                                    boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(112,56,255,0.08)",
                                }}
                            >
                                {/* Handle */}
                                <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                                    <div className="w-10 h-[4px] rounded-full bg-[rgba(112,56,255,0.3)]" />
                                </div>

                                <div className="px-5 pb-8 pt-3 flex flex-col gap-5">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-manrope font-bold text-[17px] text-white">
                                                {t("offre.confirmChoice")}
                                            </p>
                                            <p className="font-manrope font-normal text-[12px] text-white/40">
                                                {roleLabel} — <span translate="no">{plan.name}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                                        >
                                            <X className="w-4 h-4 text-white/60" />
                                        </button>
                                    </div>

                                    {/* Plan summary */}
                                    <div
                                        className="flex items-center gap-4 p-4 rounded-[14px]"
                                        style={{ backgroundColor: "rgba(112,56,255,0.06)", border: "1px solid rgba(112,56,255,0.15)" }}
                                    >
                                        <div className="w-12 h-12 rounded-[12px] bg-[rgba(112,56,255,0.15)] flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-[#7038FF]" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-manrope font-bold text-[15px] text-white" translate="no">{plan.name}</p>
                                            <p className="font-manrope font-normal text-[13px] text-white/50">
                                                {getDisplayPrice(plan, billingPeriod, t("offre.perMonth")).price}{getDisplayPrice(plan, billingPeriod, t("offre.perMonth")).pricePeriod}
                                                {billingPeriod === 'annual' && getDisplayPrice(plan, billingPeriod, t("offre.perMonth")).originalMonthly && (
                                                    <span className="text-white/25 line-through ml-1 text-[11px]">{getDisplayPrice(plan, billingPeriod, t("offre.perMonth")).originalMonthly}</span>
                                                )}
                                            </p>
                                            {billingPeriod === 'annual' && parsePrice(plan.price) !== null && parsePrice(plan.price) !== 0 && (
                                                <p className="font-manrope font-normal text-[11px] text-[#4ade80]/60">
                                                    {t("offre.billedAnnuallySaving")} {((parsePrice(plan.price)! * 12 * ANNUAL_DISCOUNT)).toFixed(2).replace('.', ',')}€
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Key features preview */}
                                    <div className="flex flex-col gap-2">
                                        {plan.features.filter(f => f.included && f.highlight).slice(0, 3).map((f, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Check className="w-3 h-3 text-[#7038FF]" strokeWidth={3} />
                                                <span className="font-manrope font-normal text-[12px] text-white/60">{f.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-col gap-3">
                                        <motion.button
                                            onClick={handleConfirm}
                                            disabled={isProcessing || isDone}
                                            className="w-full py-[14px] rounded-[12px] font-manrope font-bold text-[14px] text-white cursor-pointer flex items-center justify-center gap-2"
                                            style={{
                                                backgroundColor: isDone ? "#28a06c" : "#7038FF",
                                            }}
                                            whileHover={!isProcessing && !isDone ? { scale: 1.01 } : undefined}
                                            whileTap={!isProcessing && !isDone ? { scale: 0.98 } : undefined}
                                        >
                                            {isProcessing ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                                                        <path className="opacity-80" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                </motion.div>
                                            ) : isDone ? (
                                                <>
                                                    <Check className="w-5 h-5" strokeWidth={3} />
                                                    <span>{t("offre.activated")}</span>
                                                </>
                                            ) : plan.ctaAction === 'contact' ? (
                                                <>
                                                    <Mail className="w-4 h-4" />
                                                    <span>{t("offre.sendRequest")}</span>
                                                </>
                                            ) : plan.ctaAction === 'activate' ? (
                                                <>
                                                    <UserPlus className="w-4 h-4" />
                                                    <span>{t("offre.createAccountActivate")}</span>
                                                </>
                                            ) : (
                                                <span>{t("offre.confirmUpgrade")}</span>
                                            )}
                                        </motion.button>

                                        <button
                                            onClick={onClose}
                                            className="w-full py-[10px] font-manrope font-normal text-[13px] text-white/30 cursor-pointer hover:text-white/50 transition-colors"
                                        >
                                            {t("common.cancel")}
                                        </button>
                                    </div>

                                    <p className="font-manrope font-normal text-[11px] text-white/20 text-center">
                                        {t("share.swipeToClose")}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ─── Main Export ─── */
export function OffreContentBlocks() {
    const { t } = useTranslation();
    const [activeRole, setActiveRole] = useState<OffreRoleId>('artiste');
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
    const [selectedPlan, setSelectedPlan] = useState<{ roleId: OffreRoleId; tierId: OffreTierId } | null>(null);
    const [confirmPlan, setConfirmPlan] = useState<OffrePlan | null>(null);
    const [confirmRoleLabel, setConfirmRoleLabel] = useState("");
    const [roleDirection, setRoleDirection] = useState(0);
    const [showStickyNav, setShowStickyNav] = useState(false);
    const prevRoleRef = useRef(activeRole);
    const inlineTabsRef = useRef<HTMLDivElement>(null);
    const topAnchorRef = useRef<HTMLDivElement>(null);

    const activeRoleData = MOCK_OFFRE_PLANS.find(r => r.roleId === activeRole)!;

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

    const handleRoleChange = useCallback((role: OffreRoleId) => {
        const prevIdx = ROLE_ORDER.indexOf(prevRoleRef.current);
        const nextIdx = ROLE_ORDER.indexOf(role);
        setRoleDirection(nextIdx > prevIdx ? 1 : -1);
        prevRoleRef.current = role;
        setActiveRole(role);
    }, []);

    /** Sticky nav handler: change role + scroll to top */
    const handleStickyRoleChange = useCallback((role: OffreRoleId) => {
        const prevIdx = ROLE_ORDER.indexOf(prevRoleRef.current);
        const nextIdx = ROLE_ORDER.indexOf(role);
        setRoleDirection(nextIdx > prevIdx ? 1 : -1);
        prevRoleRef.current = role;
        setActiveRole(role);
        // Scroll to top — same pattern as BilanBottomNav / MainBottomNav
        const scrollContainer = document.getElementById('main-scroll-container');
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (scrollContainer) scrollContainer.scrollTop = 0;
    }, []);

    const handleSelectPlan = useCallback((plan: OffrePlan) => {
        if (selectedPlan?.roleId === activeRole && selectedPlan?.tierId === plan.tierId) {
            setSelectedPlan(null);
            return;
        }
        setConfirmPlan(plan);
        setConfirmRoleLabel(activeRoleData.label);
    }, [activeRole, selectedPlan, activeRoleData]);

    const handleConfirm = useCallback(() => {
        if (confirmPlan) {
            setSelectedPlan({ roleId: activeRole, tierId: confirmPlan.tierId });
        }
        setConfirmPlan(null);
    }, [confirmPlan, activeRole]);

    const handleCloseConfirm = useCallback(() => {
        setConfirmPlan(null);
    }, []);

    return (
        <LayoutGroup>
            {/* Scroll-to anchor */}
            <div ref={topAnchorRef} className="w-full h-0" />

            {/* T0: Title */}
            <motion.div className="flex flex-col gap-[2px] px-1 w-full relative items-center" {...cascade(0)}>
                <motion.h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight" {...cascade(0)}>
                    {t("offre.title")}
                </motion.h2>
                <motion.p className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight" {...cascade(0.04)}>
                    {t("offre.subtitle")}
                </motion.p>
            </motion.div>

            {/* T0.5: Billing toggle */}
            <BillingToggle period={billingPeriod} onToggle={setBillingPeriod} />

            {/* T1: Inline Role tabs — observed for sticky trigger */}
            {/* Wrapper always rendered for IntersectionObserver; soul labels only when sticky is hidden */}
            <div ref={inlineTabsRef} className="w-full">
                {!showStickyNav ? (
                    <RoleTabs
                        activeRole={activeRole}
                        onRoleChange={handleRoleChange}
                        roles={MOCK_OFFRE_PLANS}
                        pillLayoutId="offre-role-pill"
                        enableSoulLabels={true}
                    />
                ) : (
                    /* Ghost placeholder — same height as RoleTabs, keeps observer alive */
                    <div
                        className="flex w-full rounded-[14px] p-[3px] gap-[2px]"
                        style={{
                            backgroundColor: "rgba(112,56,255,0.08)",
                            border: "1px solid rgba(112,56,255,0.15)",
                        }}
                    >
                        {MOCK_OFFRE_PLANS.map((role) => {
                            const isActive = role.roleId === activeRole;
                            return (
                                <button
                                    key={role.roleId}
                                    onClick={() => handleRoleChange(role.roleId)}
                                    className="flex-1 relative py-[8px] px-[4px] rounded-[11px] font-manrope font-medium text-[12px] transition-colors duration-200 cursor-pointer whitespace-nowrap"
                                    style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.45)" }}
                                >
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-[11px]"
                                            style={{ backgroundColor: "rgba(112,56,255,0.25)", border: "1px solid rgba(112,56,255,0.35)" }}
                                            layoutId="offre-role-pill"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    {/* No soul label — souls have transmigrated to bottom nav */}
                                    <span className="relative z-10 opacity-0">{role.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* T2: Role description */}
            <motion.div
                className="w-full px-1"
                {...cascade(0.14)}
            >
                <AnimatePresence mode="wait">
                    <motion.p
                        key={activeRole}
                        className="font-manrope font-normal text-[13px] text-center text-muted-foreground/60"
                        initial={{ opacity: 0, x: roleDirection * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: roleDirection * -20 }}
                        transition={{ duration: 0.25 }}
                    >
                        {activeRoleData.description}
                    </motion.p>
                </AnimatePresence>
            </motion.div>

            {/* T3: Plan cards — Spatial Flow Latéral Premium */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={activeRole}
                    className="flex flex-col gap-4 w-full"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeRoleData.plans.map((plan, idx) => (
                        <PlanCard
                            key={plan.tierId}
                            plan={plan}
                            roleId={activeRole}
                            isSelected={selectedPlan?.roleId === activeRole && selectedPlan?.tierId === plan.tierId}
                            onSelect={handleSelectPlan}
                            cascadeDelay={0.22 + idx * 0.10}
                            billingPeriod={billingPeriod}
                            spatialDirection={roleDirection}
                            cardIndex={idx}
                        />
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* T4: Bottom note */}
            <motion.p
                className="font-manrope font-normal text-[11px] text-muted-foreground/30 text-center px-4 pb-6"
                {...cascade(0.60)}
            >
                {t("offre.priceNote")}
            </motion.p>

            {/* ═══ Sticky Bottom Role Nav — Portaled to document.body to escape transform stacking context ═══ */}
            {createPortal(
                <AnimatePresence>
                    {showStickyNav && (
                        <motion.div
                            key="navbar-offre-sticky"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0, transition: { type: "spring", stiffness: 82, damping: 24, mass: 1 } }}
                            transition={{ type: "spring", stiffness: 82, damping: 24, mass: 1 }}
                            className="fixed bottom-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-md border-t border-border pb-12 pt-4 px-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                            style={{ willChange: "transform" }}
                        >
                            {ROLE_ORDER.map((roleId) => {
                                const role = MOCK_OFFRE_PLANS.find(r => r.roleId === roleId)!;
                                const meta = ROLE_NAV_META[roleId];
                                const isActive = activeRole === roleId;
                                const RoleIcon = meta.icon;
                                const activeColor = meta.color;

                                return (
                                    <div
                                        key={roleId}
                                        onClick={() => handleStickyRoleChange(roleId)}
                                        className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer relative group transition-all duration-300"
                                    >
                                        {/* Soul Shadow / Glow — TAF */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="offre-bottom-nav-glow"
                                                className="absolute -inset-4 blur-xl rounded-full"
                                                style={{ backgroundColor: `${activeColor}26` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}

                                        {/* The Body Icon */}
                                        <RoleIcon
                                            className="relative z-10 w-6 h-6 transition-all duration-300"
                                            style={{
                                                color: isActive ? activeColor : "var(--muted-foreground)",
                                                opacity: isActive ? 1 : 0.5,
                                                strokeWidth: isActive ? 2.5 : 2
                                            }}
                                        />

                                        {/* The Soul Label */}
                                        <div className="h-[22px] flex items-center justify-center relative overflow-visible">
                                            <motion.span
                                                layoutId={`offre-soul-${roleId}`}
                                                className="text-[12px] font-bold font-manrope whitespace-nowrap"
                                                style={{
                                                    color: isActive ? activeColor : "var(--muted-foreground)",
                                                    zIndex: 9999
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0.3,
                                                    filter: "blur(0px)"
                                                }}
                                                exit={{ opacity: 1, transition: { duration: 0 } }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 105,
                                                    damping: 18,
                                                    mass: 1
                                                }}
                                            >
                                                {role.label}
                                            </motion.span>
                                        </div>

                                        {/* Active Underline dot — TAF */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="offre-active-underline"
                                                className="absolute -bottom-1 w-1 h-1 rounded-full"
                                                style={{ backgroundColor: activeColor }}
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

            {/* Confirmation sheet */}
            <ConfirmSheet
                isOpen={!!confirmPlan}
                plan={confirmPlan}
                roleLabel={confirmRoleLabel}
                billingPeriod={billingPeriod}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirm}
            />
        </LayoutGroup>
    );
}