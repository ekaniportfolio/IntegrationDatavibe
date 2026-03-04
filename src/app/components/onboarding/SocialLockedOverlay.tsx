/**
 * SocialLockedOverlay — Components for the "Social not connected to Spotify" state
 * 
 * Two exports:
 * 1. SocialLockedAlert: Animated glow block with warning text (goes INSIDE the green social block)
 * 2. SocialPlatformConnect: Platform rows to connect (goes BELOW the green social block)
 * 
 * @backend — The locked state is driven by MOCK_SOCIALS_CONNECTED_TO_SPOTIFY flag.
 * When the backend is live, this flag will come from GET /api/v1/artist/:id/social/spotify-linked
 *
 * PROPS CONTRACT:
 * ───────────────
 * SocialPlatformConnect accepts:
 *   - onAllConnected?: () => void — Called when ALL platforms in PLATFORMS_TO_CONNECT
 *     have been connected via the UI modal. The parent (NewPlatform.tsx) uses this
 *     to set `socialsConnected = true`, which reactively unlocks the Social tab.
 *
 * BACKEND INTEGRATION NOTES:
 * ──────────────────────────
 * - Each "Connecter" button opens a modal where the user pastes a profile URL.
 * - Currently the URL is only stored in local component state (connectedIds Set).
 * - When backend is live, the `handleConnect` callback should POST the URL to:
 *     POST /api/v1/artist/:id/connexions/:platformId/link { profileUrl: string }
 * - The `onAllConnected` callback should additionally POST to:
 *     POST /api/v1/artist/:id/social/link-all
 *   to persist the "all connected" state server-side.
 * - The component uses forwardRef for compatibility with Motion's AnimatePresence.
 */

import { useState, useCallback, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../../../imports/svg-t8mlfzh5zr";
import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { useTranslation } from "../language-provider";

// ── Keyframes for the social alert glow (reuses NiveauContentBlocks pattern) ──
const SOCIAL_LOCKED_KEYFRAMES = `
@keyframes social-locked-glow {
  0%, 100% { box-shadow: 0 0 0px 0px rgba(28, 180, 91, 0.0), inset 0 0 0px rgba(28, 180, 91, 0.0); border-color: rgba(28, 180, 91, 0.2); }
  50% { box-shadow: 0 0 8px 1px rgba(28, 180, 91, 0.3), inset 0 0 6px rgba(28, 180, 91, 0.15); border-color: rgba(28, 180, 91, 0.7); }
}
@keyframes social-locked-text-pulse {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
`;

// ── Platform data (mirrors ConnexionsContentBlocks but only non-Spotify platforms) ──
interface Platform {
    id: string;
    name: string;
    connected: boolean;
    iconPath: string;
    iconClipId?: string;
    signupUrl: string;
    profileBaseUrl: string;
}

const PLATFORMS_TO_CONNECT: Platform[] = [
    {
        id: "tiktok", name: "TikTok",
        connected: false, iconPath: "p8eabb80", iconClipId: "clip_tiktok_locked",
        signupUrl: "https://www.tiktok.com/signup",
        profileBaseUrl: "https://www.tiktok.com/@"
    },
    {
        id: "youtube", name: "Youtube",
        connected: false, iconPath: "p16bc3a00",
        signupUrl: "https://studio.youtube.com",
        profileBaseUrl: "https://www.youtube.com/"
    },
    {
        id: "instagram", name: "Instagram",
        connected: false, iconPath: "p3d377200",
        signupUrl: "https://www.instagram.com/accounts/emailsignup/",
        profileBaseUrl: "https://www.instagram.com/"
    },
    {
        id: "deezer", name: "Deezer",
        connected: false, iconPath: "p3a925700", iconClipId: "clip_deezer_locked",
        signupUrl: "https://www.deezer.com/register",
        profileBaseUrl: "https://www.deezer.com/artist/"
    },
];

// ── Connect Modal (simplified from ConnexionsContentBlocks) ──
function ConnectModal({ platform, onClose, onConnect }: {
    platform: Platform;
    onClose: () => void;
    onConnect: (profileUrl: string) => void;
}) {
    const { t } = useTranslation();
    const [urlInput, setUrlInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 200);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = () => {
        if (urlInput.trim()) {
            onConnect(urlInput.trim());
            onClose();
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                className="relative bg-[#1a1a2e] rounded-t-[24px] w-full max-w-[420px] p-6 pb-8 z-10"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />
                <h3 className="font-manrope font-bold text-[18px] text-white mb-1">
                    {t("cx.connectPlatform")} <span translate="no">{platform.name}</span>
                </h3>
                <p className="font-manrope font-normal text-[13px] text-white/60 mb-5">
                    {t("cx.pasteLink")} <span translate="no">{platform.name}</span>
                </p>
                <input
                    ref={inputRef}
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder={`${platform.profileBaseUrl}${t("social.profilePlaceholder")}`}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-[14px] font-manrope placeholder:text-white/30 focus:outline-none focus:border-[#7038FF] transition-colors mb-4"
                />
                <div className="flex gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#7038FF] hover:bg-[#5c2dd6] text-white font-manrope font-bold text-[14px] py-3 rounded-xl transition-colors"
                    >
                        {t("cx.connect")}
                    </button>
                    <a
                        href={platform.signupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-white font-manrope text-[13px] transition-colors"
                    >
                        {t("cx.createAccount")} <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ── Spinner ──
function Spinner() {
    return (
        <motion.div
            className="w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
    );
}

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

const BTN_CLASSES = "cursor-pointer flex items-center justify-center min-w-[80px] px-[10px] py-[6px] rounded-[8px] transition-colors duration-200";

// ── Platform Row ──
function PlatformRow({ platform, onOpenModal, index }: {
    platform: Platform;
    onOpenModal: (p: Platform) => void;
    index: number;
}) {
    const { t } = useTranslation();
    const { name, iconPath, iconClipId } = platform;
    const clipId = iconClipId ? `${iconClipId}_locked` : undefined;
    const delay = 0.08 + index * 0.06;

    return (
        <motion.div
            className="bg-[rgba(6,2,13,0.5)] content-stretch flex items-center justify-between p-[12px] relative rounded-[12px] shrink-0 w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1], delay }}
        >
            <div aria-hidden="true" className="absolute border border-[rgba(6,2,13,0.12)] border-solid inset-0 pointer-events-none rounded-[12px]" />
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[30px]">
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
                </div>
                <div className="content-stretch flex flex-col font-manrope font-normal gap-[2px] items-start leading-[20px] relative shrink-0 w-[152px]">
                    <p className="relative shrink-0 text-[14px] w-full text-white" translate="no">{name}</p>
                    <p className="relative shrink-0 text-[12px] w-full text-[#d22301]">{t("cx.notConnected")}</p>
                </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[10px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
                        <circle cx="5" cy="5" fill="var(--fill-0, #DF2500)" r="5" />
                    </svg>
                </div>
                <motion.div
                    className={`${BTN_CLASSES} bg-[#7038FF] hover:bg-[#5c2dd6]`}
                    animate={{
                        boxShadow: [
                            "0 0 0px 0px rgba(112, 56, 255, 0)",
                            "0 0 12px 4px rgba(112, 56, 255, 0.5)",
                            "0 0 0px 0px rgba(112, 56, 255, 0)",
                        ],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    onClick={() => onOpenModal(platform)}
                >
                    <p className="font-manrope font-normal leading-normal relative shrink-0 text-[12px] text-white text-center">{t("cx.connect")}</p>
                </motion.div>
            </div>
        </motion.div>
    );
}


/**
 * SocialLockedAlert — The animated glow block with Figma warning text
 * Goes INSIDE the green social block, replacing the body content
 */
export function SocialLockedAlert() {
    const { t } = useTranslation();
    return (
        <div className="w-full z-10 relative">
            <div
                className="rounded-[8px] w-full relative overflow-hidden"
                style={{
                    backgroundColor: "rgba(28, 180, 91, 0.08)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "rgba(28, 180, 91, 0.2)",
                    animation: "social-locked-glow 3s ease-in-out infinite",
                }}
            >
                <style dangerouslySetInnerHTML={{ __html: SOCIAL_LOCKED_KEYFRAMES }} />
                <div className="flex flex-col gap-[5px] items-start p-[10px]">
                    <div className="flex flex-col font-manrope font-bold justify-center leading-[0] relative shrink-0 text-[#f44336] text-[14px] whitespace-nowrap">
                        <p className="leading-[normal]">{"\u26A0\uFE0F"} {t("social.fansNotFinding")}</p>
                    </div>
                    <div className="flex flex-col items-start pb-px relative shrink-0 w-full">
                        <p
                            className="font-manrope font-normal leading-[normal] text-[14px] text-white w-full"
                            style={{ animation: "social-locked-text-pulse 3s ease-in-out infinite" }}
                        >
                            {t("social.notLinkedWarning")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * SocialPlatformConnect — Platform rows to connect (goes BELOW the green social block)
 * Shows only the platforms that are not yet connected.
 */
interface SocialPlatformConnectProps {
    onAllConnected?: () => void;
}

export const SocialPlatformConnect = forwardRef<HTMLDivElement, SocialPlatformConnectProps>(function SocialPlatformConnect({ onAllConnected }, ref) {
    const { t } = useTranslation();
    const [connectModalPlatform, setConnectModalPlatform] = useState<Platform | null>(null);
    const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

    const handleOpenModal = useCallback((platform: Platform) => {
        setConnectModalPlatform(platform);
    }, []);

    const handleConnect = useCallback((profileUrl: string) => {
        if (connectModalPlatform) {
            const newSet = new Set(connectedIds).add(connectModalPlatform.id);
            setConnectedIds(newSet);
            // Check if all platforms are now connected
            if (newSet.size >= PLATFORMS_TO_CONNECT.length && onAllConnected) {
                // Small delay so the user sees the last row disappear before the view switches
                setTimeout(() => onAllConnected(), 600);
            }
        }
    }, [connectModalPlatform, connectedIds, onAllConnected]);

    const visiblePlatforms = PLATFORMS_TO_CONNECT.filter(p => !connectedIds.has(p.id));

    if (visiblePlatforms.length === 0) return null;

    return (
        <div className="w-full" ref={ref}>
            <motion.div
                className="flex flex-col gap-[12px] items-start w-full mt-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 }}
            >
                <p className="font-manrope font-bold text-[14px] text-white/70 px-1">{t("social.locked.connectPlatforms")}</p>
                {visiblePlatforms.map((platform, index) => (
                    <PlatformRow
                        key={platform.id}
                        platform={platform}
                        onOpenModal={handleOpenModal}
                        index={index}
                    />
                ))}
            </motion.div>

            <AnimatePresence>
                {connectModalPlatform && (
                    <ConnectModal
                        platform={connectModalPlatform}
                        onClose={() => setConnectModalPlatform(null)}
                        onConnect={handleConnect}
                    />
                )}
            </AnimatePresence>
        </div>
    );
});