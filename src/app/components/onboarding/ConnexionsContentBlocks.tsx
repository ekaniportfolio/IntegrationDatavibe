/**
 * ============================================================================
 * CONNEXIONS CONTENT BLOCKS — Page "Mes connexions"
 * ============================================================================
 * 
 * Autonomous page with:
 * 1. Title block (titre "Audit Connexions" + sous-titre "Vue d'ensemble")
 * 2. Summary card (Plateformes connectées / à connecter)
 * 3. Platform connection list (Spotify, TikTok, YouTube, Instagram, Apple Music, Deezer)
 * 
 * This page does NOT use TAF tabs (Streaming/Réseaux/Médias).
 * Lateral Spatial Flow is handled by the parent AnimatePresence wrapper
 * in NewPlatform.tsx — no need to duplicate initial/animate/exit here.
 * The gap-6 from the parent flex-col ensures consistent spacing with
 * Bilan and Niveau pages.
 * 
 * Button semantics:
 * - Connected platforms → green "Vérifier" (audit token/link validity)
 * - Not connected platforms → brand purple "Connecter" (invite to link)
 * 
 * DYNAMIZED:
 * - "Connecter" opens a bottom sheet modal with two options:
 *   1. Paste your profile URL → saves locally
 *   2. "Create account" → opens platform signup in new tab
 * - "Vérifier" shows spinner then result (✓ Vérifié / ✗ Erreur) for 2.5s
 * - Connected platform subtitles are clickable (open profile)
 * ============================================================================
 */

import svgPaths from "../../../imports/svg-t8mlfzh5zr";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, X, CheckCircle2, XCircle, Link2, UserPlus } from "lucide-react";
import { useTranslation } from "../language-provider";

/* ═══════════════════════════════════════════════════════════════════════════
 * NONCHALANT CASCADE — Majestic accordion entrance system
 * ═══════════════════════════════════════════════════════════════════════════
 * Each vertical tier enters with increasing delay (the lower, the later).
 * Within each block, sub-elements follow with micro-latency ("nonchalant drag").
 * Movement: Y-axis rise + opacity + subtle blur lift.
 * Ease: [0.16, 1, 0.3, 1] — aggressive attack, lazy deceleration (regal feel).
 * 
 * Tier structure:
 *   T0: Title "Audit Connexions"     (delay 0)
 *   T1: Subtitle "Vue d'ensemble"    (delay +0.06)  — internal drag from T0
 *   T2: SummaryCard shell            (delay +0.14)
 *   T2a: Connected box               (delay +0.20)  — internal drag
 *   T2b: To-connect box              (delay +0.26)  — internal drag
 *   T3: Platform row 0               (delay +0.32)
 *   T3+n: Platform row n             (delay +0.32 + n*0.08)
 *     Ri: icon                       (row delay + 0)
 *     Rt: text                       (row delay + 0.04)
 *     Rd: dot                        (row delay + 0.06)
 *     Rb: button                     (row delay + 0.09)
 * ═══════════════════════════════════════════════════════════════════════════
 */
const REGAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const CASCADE_Y = 28;       // px — vertical rise distance
const CASCADE_BLUR = 6;     // px — entrance blur
const CASCADE_DURATION = 0.7; // seconds — generous, majestic

/* ─── EXIT CASCADE (reverse accordion) ───
 * Bottom elements exit first, cascade collapses upward.
 * Exit must complete its visible phase within ~0.2s (parent opacity delay).
 * The parent lateral slide (x:80) runs simultaneously — compound effect:
 * elements cascade-drop while the container slides out.
 * EXIT_SPREAD controls stagger span; kept tight so bottom rows exit
 * immediately and top tiers catch up fast.
 */
const EXIT_DURATION = 0.28;
const EXIT_Y = 24;           // px — drops down on exit (dramatic)
const EXIT_BLUR = 5;
const EXIT_SPREAD = 0.18;    // stagger spread — tight for visibility window
const MAX_ENTRANCE_DELAY = 0.72; // highest entrance delay (last platform row)

// Reverse stagger: high entrance delay → low exit delay (bottom exits first)
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

// Internal micro-latency for sub-elements within a row
const rowInner = (rowDelay: number, offset: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { 
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: REGAL_EASE, delay: rowDelay + offset }
    },
    exit: {
        opacity: 0, y: 14,
        transition: { duration: EXIT_DURATION * 0.75, ease: REGAL_EASE, delay: exitDelay(rowDelay + offset) }
    },
});

// Platform list base delay
const PLATFORM_BASE_DELAY = 0.32;
const PLATFORM_ROW_STAGGER = 0.08;

/* ─── Platform data ─── */
interface Platform {
    id: string;
    name: string;
    subtitle: string;
    connected: boolean;
    iconPath: string;
    iconClipId?: string;
    signupUrl: string;       // Platform signup/registration page
    profileBaseUrl: string;  // Base URL for user profiles
}

const PLATFORMS: Platform[] = [
    {
        id: "spotify", name: "Spotify",
        subtitle: "@sheylli",
        connected: true, iconPath: "p39564480",
        signupUrl: "https://www.spotify.com/signup",
        profileBaseUrl: "https://open.spotify.com/artist/"
    },
    {
        id: "tiktok", name: "TikTok",
        subtitle: "",
        connected: false, iconPath: "p8eabb80", iconClipId: "clip_tiktok_cx",
        signupUrl: "https://www.tiktok.com/signup",
        profileBaseUrl: "https://www.tiktok.com/@"
    },
    {
        id: "youtube", name: "Youtube",
        subtitle: "@sheylli_music",
        connected: true, iconPath: "p16bc3a00",
        signupUrl: "https://studio.youtube.com",
        profileBaseUrl: "https://www.youtube.com/"
    },
    {
        id: "instagram", name: "Instagram",
        subtitle: "@sheylley_",
        connected: true, iconPath: "p3d377200",
        signupUrl: "https://www.instagram.com/accounts/emailsignup/",
        profileBaseUrl: "https://www.instagram.com/"
    },
    {
        id: "apple-music", name: "Apple Music",
        subtitle: "Sheylli",
        connected: true, iconPath: "p103b9080", iconClipId: "clip_apple_cx",
        signupUrl: "https://artists.apple.com",
        profileBaseUrl: "https://music.apple.com/artist/"
    },
    {
        id: "deezer", name: "Deezer",
        subtitle: "",
        connected: false, iconPath: "p3a925700", iconClipId: "clip_deezer_cx",
        signupUrl: "https://www.deezer.com/register",
        profileBaseUrl: "https://www.deezer.com/artist/"
    },
]; // Updated subtitles — realistic platform usernames

/* ─── Dynamic state for platform connections ─── */
interface PlatformState {
    connected: boolean;
    subtitle: string;
    profileUrl?: string;
}

/* ─── Summary Card ─── */
function SummaryCard({ platforms }: { platforms: Record<string, PlatformState> }) {
    const { t } = useTranslation();
    const connectedCount = PLATFORMS.filter(p => platforms[p.id]?.connected ?? p.connected).length;
    const toConnectCount = PLATFORMS.filter(p => !(platforms[p.id]?.connected ?? p.connected)).length;

    return (
        <motion.div className="bg-gradient-to-b from-[rgba(112,56,255,0.1)] relative rounded-[18px] shrink-0 to-[rgba(45,30,255,0.1)] w-full" {...cascade(0.14)}>
            <div className="flex flex-col items-center size-full">
                <div className="content-stretch flex flex-col items-center p-[14px] relative w-full">
                    <div className="content-stretch flex gap-[10px] items-start relative w-full">
                        {/* Connected box */}
                        <motion.div className="bg-dashboard-card-bg content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[12px] relative rounded-[10px] flex-1 min-w-0" {...cascade(0.20)}>
                            {/* Glow */}
                            <div className="absolute right-[-39.66px] size-[58.791px] top-[-44px]">
                                <div className="absolute inset-[-85.05%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 158.791 158.791">
                                        <g filter="url(#filter_glow_green_cx)" opacity="0.5">
                                            <circle cx="79.3955" cy="79.3955" fill="url(#paint_glow_green_cx)" r="29.3955" />
                                        </g>
                                        <defs>
                                            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158.791" id="filter_glow_green_cx" width="158.791" x="0" y="0">
                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                                <feGaussianBlur result="effect1" stdDeviation="25" />
                                            </filter>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint_glow_green_cx" x1="101.262" x2="65.2089" y1="56.7149" y2="93.2683">
                                                <stop stopColor="white" />
                                                <stop offset="1" stopColor="#00FFE1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                <div className="content-stretch flex items-center relative shrink-0">
                                    <p className="font-['Poppins',sans-serif] font-[800] leading-normal not-italic relative shrink-0 text-[#7b8fa6] text-[24px]">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={connectedCount}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                {connectedCount}
                                            </motion.span>
                                        </AnimatePresence>
                                    </p>
                                </div>
                                <div className="relative shrink-0 size-[20px]">
                                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                        <path d={svgPaths.p103d3000} stroke="var(--stroke-0, #4CAF50)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                                    </svg>
                                </div>
                            </div>
                            <p className="font-manrope font-normal leading-[20px] relative shrink-0 text-[14px] text-foreground whitespace-pre-wrap">{t("cx.platformConnected")}</p>
                        </motion.div>

                        {/* To connect box */}
                        <motion.div className="bg-dashboard-card-bg content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[12px] relative rounded-[10px] flex-1 min-w-0" {...cascade(0.26)}>
                            {/* Glow */}
                            <div className="absolute right-[-29.86px] size-[51.986px] top-[-29px]">
                                <div className="absolute inset-[-96.18%]">
                                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 151.986 151.986">
                                        <g filter="url(#filter_glow_red_cx)" opacity="0.5">
                                            <circle cx="75.993" cy="75.993" fill="url(#paint_glow_red_cx)" r="25.993" />
                                        </g>
                                        <defs>
                                            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="151.986" id="filter_glow_red_cx" width="151.986" x="0" y="0">
                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                                                <feGaussianBlur result="effect1" stdDeviation="25" />
                                            </filter>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="paint_glow_red_cx" x1="95.3282" x2="63.4485" y1="55.9377" y2="88.2601">
                                                <stop stopColor="white" />
                                                <stop offset="1" stopColor="#F44336" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                <div className="content-stretch flex items-center relative shrink-0">
                                    <p className="font-['Poppins',sans-serif] font-[800] leading-normal not-italic relative shrink-0 text-[#7b8fa6] text-[24px]">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={toConnectCount}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -10, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                {toConnectCount}
                                            </motion.span>
                                        </AnimatePresence>
                                    </p>
                                </div>
                                <div className="flex items-center justify-center relative shrink-0">
                                    <div className="-scale-y-100 flex-none">
                                        <div className="relative size-[20px]">
                                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                                <path d={svgPaths.p29c0a180} stroke="var(--stroke-0, #F44336)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="font-manrope font-normal leading-[20px] relative shrink-0 text-[14px] text-foreground whitespace-pre-wrap">{t("cx.platformToConnect")}</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Spinner Icon ─── */
function Spinner() {
    return (
        <svg className="animate-spin size-[14px]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
            <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );
}

/*
 * ─── Button min-width strategy ───
 * Both "Vérifier" and "Connecter" (FR) / "Verify" and "Connect" (EN)
 * must share the same visual width. "Connecter" is the longest label,
 * so we use min-w-[86px] + text-center to guarantee equal sizing
 * regardless of language.
 */
const BTN_SHARED_CLASSES = "content-stretch flex items-center justify-center min-w-[86px] px-[12px] py-[6px] relative rounded-[50px] shrink-0 cursor-pointer transition-all duration-200";

/* ─── Verify Status Types ─── */
type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

/* ─── Connect Modal (Bottom Sheet) ─── */
function ConnectModal({ 
    platform, 
    isOpen, 
    onClose, 
    onConnect 
}: { 
    platform: Platform; 
    isOpen: boolean; 
    onClose: () => void; 
    onConnect: (profileUrl: string) => void;
}) {
    const { t } = useTranslation();
    const [profileInput, setProfileInput] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmitLink = () => {
        if (profileInput.trim()) {
            onConnect(profileInput.trim());
            setProfileInput("");
            onClose();
        }
    };

    const handleCreateAccount = () => {
        window.open(platform.signupUrl, '_blank', 'noopener,noreferrer');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSubmitLink();
        if (e.key === 'Escape') onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* Bottom Sheet */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[201] bg-[#0d0a14] rounded-t-[24px] border-t border-[rgba(112,56,255,0.3)] max-w-[500px] mx-auto"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Handle bar */}
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-white/20" />
                        </div>

                        <div className="px-5 pb-8 pt-2 flex flex-col gap-5">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0 size-[28px]">
                                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                                            <path d={svgPaths[platform.iconPath as keyof typeof svgPaths]} fill="white" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-manrope font-bold text-[16px] text-white">{t("cx.connectPlatform")} <span translate="no">{platform.name}</span></p>
                                        <p className="font-manrope font-normal text-[12px] text-white/50">{t("cx.linkAccount")}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-4 h-4 text-white/70" />
                                </button>
                            </div>

                            {/* Option 1: Paste profile link */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <Link2 className="w-4 h-4 text-[#7038FF]" />
                                    <p className="font-manrope font-medium text-[13px] text-white/80">{t("cx.pasteLink")}</p>
                                </div>
                                <div className={`flex items-center gap-2 bg-[rgba(112,56,255,0.08)] rounded-[12px] border transition-colors duration-200 ${inputFocused ? 'border-[#7038FF]' : 'border-[rgba(112,56,255,0.2)]'}`}>
                                    <input
                                        ref={inputRef}
                                        type="url"
                                        placeholder={`${platform.profileBaseUrl}votre-id`}
                                        value={profileInput}
                                        onChange={(e) => setProfileInput(e.target.value)}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        onKeyDown={handleKeyDown}
                                        className="flex-1 bg-transparent px-4 py-3 text-[13px] font-manrope text-white placeholder:text-white/30 outline-none"
                                    />
                                    <button
                                        onClick={handleSubmitLink}
                                        disabled={!profileInput.trim()}
                                        className={`mr-2 px-4 py-2 rounded-[8px] font-manrope font-medium text-[12px] transition-all duration-200 cursor-pointer ${
                                            profileInput.trim()
                                                ? 'bg-[#7038FF] text-white hover:bg-[#5c2dd6]'
                                                : 'bg-white/5 text-white/30 cursor-not-allowed'
                                        }`}
                                    >
                                        {t("cx.link")}
                                    </button>
                                </div>
                            </div>

                            {/* Separator */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="font-manrope text-[11px] text-white/30">{t("common.or")}</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            {/* Option 2: Create account */}
                            <button
                                onClick={handleCreateAccount}
                                className="flex items-center justify-between w-full bg-[rgba(112,56,255,0.08)] rounded-[14px] border border-[rgba(112,56,255,0.15)] p-4 cursor-pointer hover:bg-[rgba(112,56,255,0.15)] transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-[10px] bg-[rgba(112,56,255,0.2)] flex items-center justify-center">
                                        <UserPlus className="w-5 h-5 text-[#7038FF]" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-manrope font-medium text-[14px] text-white">{t("cx.createAccount")} <span translate="no">{platform.name}</span></p>
                                        <p className="font-manrope font-normal text-[12px] text-white/40">{t("cx.openNewTab")} <span translate="no">{platform.name}</span></p>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#7038FF] transition-colors" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ─── Platform Row ─── */
function PlatformRow({ 
    platform, 
    platformState, 
    onOpenConnectModal, 
    onVerify,
    rowIndex
}: { 
    platform: Platform; 
    platformState: PlatformState;
    onOpenConnectModal: (platform: Platform) => void;
    onVerify: (platformId: string) => void;
    rowIndex: number;
}) {
    const { t } = useTranslation();
    const { name, iconPath, iconClipId } = platform;
    const { connected, subtitle } = platformState;
    const clipId = iconClipId ? `${iconClipId}_row` : undefined;

    const rowDelay = PLATFORM_BASE_DELAY + rowIndex * PLATFORM_ROW_STAGGER;

    const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleVerify = useCallback(() => {
        if (verifyStatus !== 'idle') return;
        setVerifyStatus('loading');
        onVerify(platform.id);
        timerRef.current = setTimeout(() => {
            // Simulate: 85% chance success, 15% chance error
            const success = Math.random() > 0.15;
            setVerifyStatus(success ? 'success' : 'error');
            timerRef.current = setTimeout(() => {
                setVerifyStatus('idle');
                timerRef.current = null;
            }, 2500);
        }, 1800);
    }, [verifyStatus, platform.id, onVerify]);

    const handleOpenProfile = () => {
        if (connected && subtitle) {
            const url = platform.profileBaseUrl + subtitle.replace('@', '');
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    const getVerifyButtonContent = () => {
        switch (verifyStatus) {
            case 'loading':
                return <Spinner />;
            case 'success':
                return (
                    <motion.div 
                        className="flex items-center gap-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        <CheckCircle2 className="w-[12px] h-[12px] text-white" />
                        <p className="font-manrope font-normal leading-normal relative shrink-0 text-[11px] text-white text-center">OK</p>
                    </motion.div>
                );
            case 'error':
                return (
                    <motion.div 
                        className="flex items-center gap-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        <XCircle className="w-[12px] h-[12px] text-white" />
                        <p className="font-manrope font-normal leading-normal relative shrink-0 text-[11px] text-white text-center">{t("common.error")}</p>
                    </motion.div>
                );
            default:
                return <p className="font-manrope font-normal leading-normal relative shrink-0 text-[12px] text-white text-center">{t("cx.verify")}</p>;
        }
    };

    const getVerifyBgColor = () => {
        switch (verifyStatus) {
            case 'success': return 'bg-[#28a06c]';
            case 'error': return 'bg-[#d32f2f]';
            case 'loading': return 'bg-[#28a06c]';
            default: return 'bg-[#30b77c] hover:bg-[#28a06c]';
        }
    };

    return (
        <motion.div className="bg-dashboard-card-bg content-stretch flex items-center justify-between p-[12px] relative rounded-[12px] shrink-0 w-full" {...cascade(rowDelay)}>
            <div aria-hidden="true" className="absolute border border-border border-solid inset-0 pointer-events-none rounded-[12px]" />
            {/* Left: icon + text */}
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                {/* Platform icon — follows row with micro-latency */}
                <motion.div className="relative shrink-0 size-[30px]" {...rowInner(rowDelay, 0)}>
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                        {clipId ? (
                            <>
                                <g clipPath={`url(#${clipId})`}>
                                    <path
                                        clipRule={iconPath === "p8eabb80" ? "evenodd" : undefined}
                                        d={svgPaths[iconPath as keyof typeof svgPaths]}
                                        fill="var(--fill-0, white)"
                                        fillRule={iconPath === "p8eabb80" ? "evenodd" : undefined}
                                    />
                                </g>
                                <defs>
                                    <clipPath id={clipId}>
                                        <rect fill="white" height="30" width="30" />
                                    </clipPath>
                                </defs>
                            </>
                        ) : (
                            <path d={svgPaths[iconPath as keyof typeof svgPaths]} fill="var(--fill-0, white)" />
                        )}
                    </svg>
                </motion.div>
                {/* Name + subtitle — follows icon with micro-latency */}
                <motion.div className="content-stretch flex flex-col font-manrope font-normal gap-[2px] items-start leading-[20px] relative shrink-0 w-[152px] whitespace-pre-wrap" {...rowInner(rowDelay, 0.04)}>
                    <p className="relative shrink-0 text-[14px] w-full text-foreground" translate="no">{name}</p>
                    {connected && subtitle ? (
                        <button 
                            onClick={handleOpenProfile}
                            className="relative shrink-0 text-[12px] w-full text-foreground/70 hover:text-[#7038FF] transition-colors cursor-pointer text-left flex items-center gap-1 group"
                        >
                            <span className="truncate" translate="no">{subtitle}</span>
                            <ExternalLink className="w-[10px] h-[10px] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                    ) : (
                        <p className={`relative shrink-0 text-[12px] w-full ${connected ? 'text-foreground' : 'text-[#d22301]'}`}>{subtitle || t('cx.notConnected')}</p>
                    )}
                </motion.div>
            </div>
            {/* Right: dot + action button — follows text with micro-latency */}
            <motion.div className="content-stretch flex gap-[12px] items-center relative shrink-0" {...rowInner(rowDelay, 0.07)}>
                {/* Status dot */}
                <div className="relative shrink-0 size-[10px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                        <circle cx="5" cy="5" fill={connected ? "var(--fill-0, #07DF00)" : "var(--fill-0, #DF2500)"} r="5" />
                    </svg>
                </div>
                {/* Action button — same min-width for visual consistency */}
                {connected ? (
                    <div
                        className={`${BTN_SHARED_CLASSES} ${getVerifyBgColor()}`}
                        onClick={handleVerify}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div key={verifyStatus} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                                {getVerifyButtonContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        className={`${BTN_SHARED_CLASSES} bg-[#7038FF] hover:bg-[#5c2dd6]`}
                        animate={{
                            boxShadow: [
                                "0 0 0px 0px rgba(112, 56, 255, 0)",
                                "0 0 12px 4px rgba(112, 56, 255, 0.5)",
                                "0 0 0px 0px rgba(112, 56, 255, 0)",
                            ],
                        }}
                        transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        onClick={() => onOpenConnectModal(platform)}
                    >
                        <p className="font-manrope font-normal leading-normal relative shrink-0 text-[12px] text-white text-center">{t("cx.connect")}</p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

/* ─── Main Export ─── */
export function ConnexionsContentBlocks() {
    const { t } = useTranslation();
    // Dynamic state: track connections per platform
    const [platformStates, setPlatformStates] = useState<Record<string, PlatformState>>(() => {
        const initial: Record<string, PlatformState> = {};
        PLATFORMS.forEach(p => {
            initial[p.id] = { connected: p.connected, subtitle: p.subtitle };
        });
        return initial;
    });

    const [connectModalPlatform, setConnectModalPlatform] = useState<Platform | null>(null);

    const handleOpenConnectModal = useCallback((platform: Platform) => {
        setConnectModalPlatform(platform);
    }, []);

    const handleCloseConnectModal = useCallback(() => {
        setConnectModalPlatform(null);
    }, []);

    const handleConnect = useCallback((platformId: string, profileUrl: string) => {
        // Extract a display identifier from the URL
        let displayId = profileUrl;
        try {
            const url = new URL(profileUrl);
            const parts = url.pathname.split('/').filter(Boolean);
            displayId = parts[parts.length - 1] || profileUrl;
            if (displayId.startsWith('@')) displayId = displayId;
            else if (displayId.length > 22) displayId = displayId.substring(0, 19) + '...';
        } catch {
            if (displayId.length > 22) displayId = displayId.substring(0, 19) + '...';
        }

        setPlatformStates(prev => ({
            ...prev,
            [platformId]: {
                connected: true,
                subtitle: displayId,
                profileUrl
            }
        }));
    }, []);

    const handleVerify = useCallback((_platformId: string) => {
        // Verification logic — currently simulated in PlatformRow
    }, []);

    return (
        <>
            {/* Element 1: Title block — cascading entrance */}
            <motion.div className="flex flex-col gap-[2px] px-1 w-full relative items-center" {...cascade(0)}>
                <motion.h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight" {...cascade(0)}>
                    {t("cx.auditTitle")}
                </motion.h2>
                <motion.p className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight" {...cascade(0.06)}>
                    {t("cx.auditSubtitle")}
                </motion.p>
            </motion.div>

            {/* Element 2: Summary card — now reactive to state changes */}
            <SummaryCard platforms={platformStates} />

            {/* Element 3: Platform list */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                {PLATFORMS.map((platform, index) => (
                    <PlatformRow 
                        key={platform.id} 
                        platform={platform} 
                        platformState={platformStates[platform.id]}
                        onOpenConnectModal={handleOpenConnectModal}
                        onVerify={handleVerify}
                        rowIndex={index}
                    />
                ))}
            </div>

            {/* Connect Modal — portal-like, rendered at this level */}
            {connectModalPlatform && (
                <ConnectModal
                    platform={connectModalPlatform}
                    isOpen={!!connectModalPlatform}
                    onClose={handleCloseConnectModal}
                    onConnect={(profileUrl) => handleConnect(connectModalPlatform.id, profileUrl)}
                />
            )}
        </>
    );
}