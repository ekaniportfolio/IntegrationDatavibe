/**
 * VIDEO PLAYER OVERLAY — Cinematic Controls with Frosted Glass Aesthetic
 * 
 * Reusable video player overlay for ReflexOpportunity video blocks.
 * Controls enter from the flanks with spring physics and auto-hide after 3s of inactivity.
 * Progress bar color is namespace-aware (streaming=orange, social=green, radio=blue).
 * 
 * FULLSCREEN SPATIAL FLOW:
 * Desktop: The video smoothly grows from its card position to fill the entire viewport.
 * Mobile: The video grows AND rotates 90° to landscape orientation simultaneously,
 *   using the math: container(width=vh, height=vw) centered via top=(vh-vw)/2, left=(vw-vh)/2
 *   so after the 90° rotation the visual result fills the viewport perfectly.
 * Both use createPortal to escape overflow:hidden and transform ancestors.
 * Clicking Minimize (or Escape) reverses the animation back to the original card rect.
 * 
 * @backend — videoSrc will come from real video URLs when backend is connected.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
    Play, Pause, Square, SkipForward, SkipBack,
    Volume2, VolumeX, Maximize, Minimize,
    Subtitles, Settings
} from "lucide-react";
import { useTranslation } from "../components/language-provider";

// --- NAMESPACE COLOR MAP ---
const getAccentColor = (namespace: string) => {
    switch (namespace) {
        case 'streaming': return { solid: '#F28E42', rgb: '242,142,66', css: 'var(--dashboard-streaming)' };
        case 'social': return { solid: '#1CB45B', rgb: '28,180,91', css: 'var(--dashboard-social)' };
        case 'radio': return { solid: '#1286F3', rgb: '18,134,243', css: 'var(--dashboard-radio)' };
        default: return { solid: '#10B981', rgb: '16,185,129', css: '#10B981' };
    }
};

// --- GLASS BUTTON ---
const GlassButton = ({ children, onClick, size = 'md', className = '', title = '' }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    title?: string;
}) => {
    const sizeClasses = {
        sm: 'w-7 h-7',
        md: 'w-9 h-9',
        lg: 'w-12 h-12 md:w-14 md:h-14'
    };
    return (
        <motion.button
            type="button"
            title={title}
            className={`relative rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center cursor-pointer select-none ${sizeClasses[size]} ${className}`}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={onClick}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.35)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
            {children}
        </motion.button>
    );
};

// --- QUALITY / SUBTITLES MENU ---
// --- Subtitle/Quality i18n mapping ---
const SUBTITLE_KEYS: Record<string, string> = {
    off: 'video.subtitlesOff',
    fr: 'video.subtitlesFr',
    en: 'video.subtitlesEn',
    auto: 'video.subtitlesAuto',
};
const SUBTITLE_IDS = ['off', 'fr', 'en', 'auto'];

const SettingsMenu = ({ items, onSelect, selected, onClose, labelMap }: {
    items: string[];
    onSelect: (item: string) => void;
    selected: string;
    onClose: () => void;
    labelMap?: Record<string, string>;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full mb-2 right-0 bg-black/80 backdrop-blur-md rounded-lg border border-white/20 overflow-hidden min-w-[120px] z-50"
        onClick={(e) => e.stopPropagation()}
    >
        {items.map((item) => (
            <button
                key={item}
                type="button"
                className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                    selected === item ? 'text-white bg-white/15' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => { onSelect(item); onClose(); }}
            >
                {labelMap?.[item] ?? item}
                {selected === item && <span className="ml-2 text-[10px]">✓</span>}
            </button>
        ))}
    </motion.div>
);

// --- Fullscreen spatial flow spring config ---
const FULLSCREEN_SPRING = { type: "spring" as const, stiffness: 180, damping: 28, mass: 1 };

// --- Detect desktop (≥768px) ---
const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isDesktop;
};

// --- Source rect type ---
interface SourceRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

// --- CONTROLS LAYER (shared between inline and fullscreen) ---
interface ControlsLayerProps {
    showControls: boolean;
    isFullscreen: boolean;
    isPaused: boolean;
    progress: number;
    isMuted: boolean;
    volume: number;
    isDraggingProgress: boolean;
    showQuality: boolean;
    showSubtitles: boolean;
    quality: string;
    subtitle: string;
    accent: ReturnType<typeof getAccentColor>;
    formatTime: (pct: number) => string;
    progressBarRef: React.RefObject<HTMLDivElement | null>;
    onPlayPause: (e: React.MouseEvent) => void;
    onStop: (e: React.MouseEvent) => void;
    onSkipForward: (e: React.MouseEvent) => void;
    onSkipBack: (e: React.MouseEvent) => void;
    onVolumeToggle: (e: React.MouseEvent) => void;
    onVolumeChange: (val: number) => void;
    onProgressClick: (e: React.MouseEvent) => void;
    onProgressDragStart: () => void;
    onProgressDrag: (e: React.MouseEvent | React.TouchEvent) => void;
    onProgressDragEnd: () => void;
    onToggleFullscreen: (e: React.MouseEvent) => void;
    onToggleQuality: (e: React.MouseEvent) => void;
    onToggleSubtitles: (e: React.MouseEvent) => void;
    onSetQuality: (q: string) => void;
    onSetSubtitle: (s: string) => void;
    resetHideTimer: () => void;
}

const ControlsLayer: React.FC<ControlsLayerProps> = ({
    showControls, isFullscreen, isPaused, progress, isMuted, volume,
    isDraggingProgress, showQuality, showSubtitles, quality, subtitle,
    accent, formatTime, progressBarRef,
    onPlayPause, onStop, onSkipForward, onSkipBack, onVolumeToggle, onVolumeChange,
    onProgressClick, onProgressDragStart, onProgressDrag, onProgressDragEnd,
    onToggleFullscreen, onToggleQuality, onToggleSubtitles, onSetQuality, onSetSubtitle,
    resetHideTimer,
}) => {
    const controlSpring = { type: "spring" as const, stiffness: 200, damping: 25 };
    const { t } = useTranslation();

    // Build translated subtitle label map
    const subtitleLabelMap: Record<string, string> = {};
    for (const id of SUBTITLE_IDS) {
        subtitleLabelMap[id] = t(SUBTITLE_KEYS[id]);
    }

    return (
        <AnimatePresence>
            {showControls && (
                <>
                    {/* TOP BAR — Expand/Minimize button (top-right) */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 flex items-center justify-end p-2 md:p-3 z-50 pointer-events-none"
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={controlSpring}
                        key="top-bar"
                    >
                        <div className="pointer-events-auto">
                            <GlassButton
                                size="sm"
                                title={isFullscreen ? t('video.minimize') : t('video.maximize')}
                                onClick={onToggleFullscreen}
                            >
                                {isFullscreen
                                    ? <Minimize size={14} className="text-white" />
                                    : <Maximize size={14} className="text-white" />
                                }
                            </GlassButton>
                        </div>
                    </motion.div>

                    {/* CENTER CONTROLS — Play/Pause + Skip */}
                    <motion.div
                        className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none ${isFullscreen ? 'gap-8' : 'gap-4'}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={controlSpring}
                        key="center-controls"
                    >
                        <motion.div
                            className="pointer-events-auto"
                            initial={{ x: -60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -60, opacity: 0 }}
                            transition={{ ...controlSpring, delay: 0.05 }}
                        >
                            <GlassButton size={isFullscreen ? "lg" : "md"} title={t('video.skipBack')} onClick={onSkipBack}>
                                <SkipBack size={isFullscreen ? 20 : 16} className="fill-white text-white" />
                            </GlassButton>
                        </motion.div>

                        <motion.div
                            className="pointer-events-auto"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ ...controlSpring, delay: 0 }}
                        >
                            <GlassButton size="lg" title={isPaused ? t('video.resume') : t('video.pause')} onClick={onPlayPause}>
                                {isPaused
                                    ? <Play size={isFullscreen ? 28 : 22} className="fill-white text-white translate-x-0.5" />
                                    : <Pause size={isFullscreen ? 28 : 22} className="fill-white text-white" />
                                }
                            </GlassButton>
                        </motion.div>

                        <motion.div
                            className="pointer-events-auto"
                            initial={{ x: 60, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 60, opacity: 0 }}
                            transition={{ ...controlSpring, delay: 0.05 }}
                        >
                            <GlassButton size={isFullscreen ? "lg" : "md"} title={t('video.skipForward')} onClick={onSkipForward}>
                                <SkipForward size={isFullscreen ? 20 : 16} className="fill-white text-white" />
                            </GlassButton>
                        </motion.div>
                    </motion.div>

                    {/* BOTTOM BAR — Progress + Volume + Settings */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={controlSpring}
                        key="bottom-bar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none ${isFullscreen ? '' : 'rounded-b-lg'}`} />

                        <div className={`relative flex flex-col gap-1.5 pointer-events-auto ${isFullscreen ? 'px-6 pb-5 pt-10' : 'px-3 pb-2.5 pt-6'}`}>
                            {/* Progress bar */}
                            <div className="flex items-center gap-2">
                                <span className={`font-mono text-white/70 text-right select-none ${isFullscreen ? 'text-[12px] min-w-[40px]' : 'text-[10px] min-w-[32px]'}`}>{formatTime(progress)}</span>
                                <div
                                    ref={progressBarRef}
                                    className={`flex-1 rounded-full bg-white/20 cursor-pointer relative group ${isFullscreen ? 'h-[8px]' : 'h-[6px]'}`}
                                    onClick={onProgressClick}
                                    onMouseDown={(e) => { e.stopPropagation(); onProgressDragStart(); }}
                                    onMouseMove={onProgressDrag}
                                    onMouseUp={onProgressDragEnd}
                                    onMouseLeave={onProgressDragEnd}
                                    onTouchStart={(e) => { e.stopPropagation(); onProgressDragStart(); }}
                                    onTouchMove={onProgressDrag}
                                    onTouchEnd={onProgressDragEnd}
                                >
                                    <div
                                        className="absolute top-0 left-0 h-full rounded-full bg-white/15 pointer-events-none"
                                        style={{ width: `${Math.min(100, progress + 15)}%` }}
                                    />
                                    <motion.div
                                        className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
                                        style={{
                                            width: `${progress}%`,
                                            backgroundColor: accent.solid,
                                            boxShadow: `0 0 8px ${accent.solid}40`
                                        }}
                                    />
                                    <motion.div
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-md pointer-events-none"
                                        style={{
                                            left: `${progress}%`,
                                            marginLeft: -6,
                                            backgroundColor: accent.solid,
                                            boxShadow: `0 0 6px ${accent.solid}60`,
                                            opacity: isDraggingProgress ? 1 : 0,
                                            scale: isDraggingProgress ? 1 : 0.5,
                                        }}
                                    />
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                        style={{
                                            left: `${progress}%`,
                                            marginLeft: -5,
                                            backgroundColor: accent.solid,
                                        }}
                                    />
                                </div>
                                <span className={`font-mono text-white/70 select-none ${isFullscreen ? 'text-[12px] min-w-[40px]' : 'text-[10px] min-w-[32px]'}`}>11:00</span>
                            </div>

                            {/* Controls row */}
                            <div className="flex items-center justify-between">
                                <motion.div
                                    className="flex items-center gap-1.5"
                                    initial={{ x: -40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -40, opacity: 0 }}
                                    transition={{ ...controlSpring, delay: 0.1 }}
                                >
                                    <GlassButton size="sm" title={t('video.stop')} onClick={onStop}>
                                        <Square size={10} className="fill-white text-white" />
                                    </GlassButton>
                                    <GlassButton size="sm" title={isMuted ? t('video.unmute') : t('video.mute')} onClick={onVolumeToggle}>
                                        {isMuted
                                            ? <VolumeX size={13} className="text-white" />
                                            : <Volume2 size={13} className="text-white" />
                                        }
                                    </GlassButton>
                                    <div className={`hidden sm:flex items-center ml-0.5 ${isFullscreen ? 'w-[80px]' : 'w-[50px]'}`}>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                const val = Number(e.target.value);
                                                onVolumeChange(val);
                                                resetHideTimer();
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full h-[3px] appearance-none rounded-full cursor-pointer video-volume-slider"
                                            style={{
                                                background: `linear-gradient(to right, ${accent.solid} ${isMuted ? 0 : volume}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume}%)`,
                                                accentColor: accent.solid,
                                            }}
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-1.5"
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 40, opacity: 0 }}
                                    transition={{ ...controlSpring, delay: 0.1 }}
                                >
                                    {/* Subtitles */}
                                    <div className="relative">
                                        <GlassButton
                                            size="sm"
                                            title={t('video.subtitles')}
                                            className={subtitle !== 'off' ? 'ring-1' : ''}
                                            onClick={onToggleSubtitles}
                                        >
                                            <Subtitles size={13} className="text-white" />
                                        </GlassButton>
                                        <AnimatePresence>
                                            {showSubtitles && (
                                                <SettingsMenu
                                                    items={SUBTITLE_IDS}
                                                    selected={subtitle}
                                                    onSelect={onSetSubtitle}
                                                    onClose={() => onToggleSubtitles({} as React.MouseEvent)}
                                                    labelMap={subtitleLabelMap}
                                                />
                                            )}
                                        </AnimatePresence>
                                        {subtitle !== 'off' && (
                                            <div
                                                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: accent.solid }}
                                            />
                                        )}
                                    </div>

                                    {/* Quality */}
                                    <div className="relative">
                                        <GlassButton
                                            size="sm"
                                            title={t('video.quality')}
                                            onClick={onToggleQuality}
                                        >
                                            <Settings size={13} className="text-white" />
                                        </GlassButton>
                                        <AnimatePresence>
                                            {showQuality && (
                                                <SettingsMenu
                                                    items={['Auto', '1080p', '720p', '480p', '360p']}
                                                    selected={quality}
                                                    onSelect={onSetQuality}
                                                    onClose={() => onToggleQuality({} as React.MouseEvent)}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


// --- FULLSCREEN PORTAL OVERLAY ---
// Renders via createPortal to escape overflow:hidden and transform ancestors.
// Animates from captured source rect to fullscreen viewport.
// MOBILE: adds 90° rotation to landscape orientation for cinematic viewing.
interface FullscreenOverlayProps {
    sourceRect: SourceRect;
    thumbnailSrc?: string;
    accent: ReturnType<typeof getAccentColor>;
    isPaused: boolean;
    isDesktop: boolean;
    onMinimize: () => void;
    controlsProps: Omit<ControlsLayerProps, 'isFullscreen'>;
    resetHideTimer: () => void;
}

const FullscreenOverlay: React.FC<FullscreenOverlayProps> = ({
    sourceRect, thumbnailSrc, accent, isPaused, isDesktop,
    onMinimize, controlsProps, resetHideTimer,
}) => {
    // Escape key to minimize
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onMinimize();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onMinimize]);

    // Compute animation targets based on device
    const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Desktop: simple expand to viewport
    // Mobile: expand + rotate 90° to landscape
    // When rotated 90°, a container of size (vh × vw) appears as (vw × vh) visually
    const desktopAnimate = {
        top: 0,
        left: 0,
        width: vw,
        height: vh,
        borderRadius: 0,
        rotate: 0,
    };

    const mobileAnimate = {
        top: (vh - vw) / 2,
        left: (vw - vh) / 2,
        width: vh,
        height: vw,
        borderRadius: 0,
        rotate: 90,
    };

    const animateTarget = isDesktop ? desktopAnimate : mobileAnimate;

    return createPortal(
        <>
            {/* Backdrop — fades in simultaneously */}
            <motion.div
                className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Expanding video container */}
            <motion.div
                className="fixed z-[9999] overflow-hidden cursor-default"
                initial={{
                    top: sourceRect.top,
                    left: sourceRect.left,
                    width: sourceRect.width,
                    height: sourceRect.height,
                    borderRadius: 8,
                    rotate: 0,
                }}
                animate={animateTarget}
                exit={{
                    top: sourceRect.top,
                    left: sourceRect.left,
                    width: sourceRect.width,
                    height: sourceRect.height,
                    borderRadius: 8,
                    rotate: 0,
                }}
                transition={FULLSCREEN_SPRING}
                onMouseMove={resetHideTimer}
                onMouseDown={() => { resetHideTimer(); }}
                onTouchStart={resetHideTimer}
                onClick={(e) => { e.stopPropagation(); controlsProps.onPlayPause(e); }}
            >
                {/* Thumbnail as background */}
                {thumbnailSrc && (
                    <motion.img
                        src={thumbnailSrc}
                        alt="Video fullscreen"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.02 }}
                        exit={{ scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                {/* Playing pulse */}
                {!isPaused && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at center, rgba(${accent.rgb}, 0.04) 0%, transparent 70%)` }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                )}

                {/* Namespace accent vignette for cinematic feel */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        boxShadow: `inset 0 0 120px 40px rgba(${accent.rgb}, 0.06)`,
                    }}
                />

                {/* Controls */}
                <ControlsLayer {...controlsProps} isFullscreen={true} />
            </motion.div>
        </>,
        document.body
    );
};


// --- MAIN COMPONENT ---
interface VideoPlayerOverlayProps {
    isPlaying: boolean;
    onClose: () => void;
    namespace?: string;
    thumbnailSrc?: string;
    isExpanded?: boolean;
}

export const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({
    isPlaying,
    onClose,
    namespace = 'default',
    thumbnailSrc,
    isExpanded = true,
}) => {
    const accent = getAccentColor(namespace);
    const isDesktop = useIsDesktop();
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(80);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showQuality, setShowQuality] = useState(false);
    const [showSubtitles, setShowSubtitles] = useState(false);
    const [quality, setQuality] = useState('720p');
    const [subtitle, setSubtitle] = useState('off');
    const [isDraggingProgress, setIsDraggingProgress] = useState(false);
    const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const fullscreenProgressBarRef = useRef<HTMLDivElement>(null);

    // Source rect for fullscreen animation origin
    const [sourceRect, setSourceRect] = useState<SourceRect>({ top: 0, left: 0, width: 400, height: 225 });

    // Auto-hide controls after 3s of inactivity
    const resetHideTimer = useCallback(() => {
        setShowControls(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        if (!isPaused && isPlaying) {
            hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [isPaused, isPlaying]);

    // Progress simulation
    useEffect(() => {
        if (isPlaying && !isPaused) {
            progressIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) return 100;
                    return prev + 0.15;
                });
            }, 100);
        } else {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        }
        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [isPlaying, isPaused]);

    // Auto-hide timer management
    useEffect(() => {
        if (isPlaying && !isPaused) {
            resetHideTimer();
        } else {
            setShowControls(true);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        }
        return () => {
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, [isPlaying, isPaused, resetHideTimer]);

    // Close menus on click outside
    useEffect(() => {
        const handleClick = () => {
            setShowQuality(false);
            setShowSubtitles(false);
        };
        if (showQuality || showSubtitles) {
            const timer = setTimeout(() => {
                document.addEventListener('click', handleClick, { once: true });
            }, 100);
            return () => { clearTimeout(timer); document.removeEventListener('click', handleClick); };
        }
    }, [showQuality, showSubtitles]);

    // Reset fullscreen on close
    useEffect(() => {
        if (!isPlaying) setIsFullscreen(false);
    }, [isPlaying]);

    const handlePlayPause = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaused(!isPaused);
        resetHideTimer();
    }, [isPaused, resetHideTimer]);

    const handleStop = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setProgress(0);
        setIsPaused(false);
        setIsFullscreen(false);
        onClose();
    }, [onClose]);

    const handleSkipForward = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setProgress(prev => Math.min(100, prev + 5));
        resetHideTimer();
    }, [resetHideTimer]);

    const handleSkipBack = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setProgress(prev => Math.max(0, prev - 5));
        resetHideTimer();
    }, [resetHideTimer]);

    const handleVolumeToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMuted(!isMuted);
        resetHideTimer();
    }, [isMuted, resetHideTimer]);

    const handleVolumeChange = useCallback((val: number) => {
        setVolume(val);
        if (val > 0) setIsMuted(false);
    }, []);

    const makeProgressHandler = (ref: React.RefObject<HTMLDivElement | null>) => (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        setProgress(pct);
        resetHideTimer();
    };

    const handleProgressDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDraggingProgress) return;
        const ref = isFullscreen ? fullscreenProgressBarRef : progressBarRef;
        if (!ref.current) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const rect = ref.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setProgress(pct);
    }, [isDraggingProgress, isFullscreen]);

    const handleToggleFullscreen = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isFullscreen) {
            // Capture source rect before entering fullscreen
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setSourceRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
            }
            setIsFullscreen(true);
        } else {
            setIsFullscreen(false);
        }
        resetHideTimer();
    }, [isFullscreen, resetHideTimer]);

    const handleToggleQuality = useCallback((e: React.MouseEvent) => {
        e?.stopPropagation?.();
        setShowQuality(prev => !prev);
        setShowSubtitles(false);
        resetHideTimer();
    }, [resetHideTimer]);

    const handleToggleSubtitles = useCallback((e: React.MouseEvent) => {
        e?.stopPropagation?.();
        setShowSubtitles(prev => !prev);
        setShowQuality(false);
        resetHideTimer();
    }, [resetHideTimer]);

    const handleSetQuality = useCallback((q: string) => {
        setQuality(q);
        setShowQuality(false);
    }, []);

    const handleSetSubtitle = useCallback((s: string) => {
        setSubtitle(s);
        setShowSubtitles(false);
    }, []);

    const formatTime = useCallback((pct: number) => {
        const totalSeconds = Math.floor((pct / 100) * 660);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    const handleMinimize = useCallback(() => {
        setIsFullscreen(false);
        resetHideTimer();
    }, [resetHideTimer]);

    if (!isPlaying) return null;

    // Shared controls props
    const controlsProps: Omit<ControlsLayerProps, 'isFullscreen'> = {
        showControls,
        isPaused,
        progress,
        isMuted,
        volume,
        isDraggingProgress,
        showQuality,
        showSubtitles,
        quality,
        subtitle,
        accent,
        formatTime,
        progressBarRef: isFullscreen ? fullscreenProgressBarRef : progressBarRef,
        onPlayPause: handlePlayPause,
        onStop: handleStop,
        onSkipForward: handleSkipForward,
        onSkipBack: handleSkipBack,
        onVolumeToggle: handleVolumeToggle,
        onVolumeChange: handleVolumeChange,
        onProgressClick: makeProgressHandler(isFullscreen ? fullscreenProgressBarRef : progressBarRef),
        onProgressDragStart: () => setIsDraggingProgress(true),
        onProgressDrag: handleProgressDrag,
        onProgressDragEnd: () => setIsDraggingProgress(false),
        onToggleFullscreen: handleToggleFullscreen,
        onToggleQuality: handleToggleQuality,
        onToggleSubtitles: handleToggleSubtitles,
        onSetQuality: handleSetQuality,
        onSetSubtitle: handleSetSubtitle,
        resetHideTimer,
    };

    return (
        <>
            {/* Inline overlay (inside the card) — hidden when fullscreen */}
            {!isFullscreen && (
                <motion.div
                    ref={containerRef}
                    className="absolute inset-0 z-40 rounded-lg overflow-hidden cursor-default"
                    onMouseMove={resetHideTimer}
                    onMouseDown={() => { resetHideTimer(); setShowQuality(false); setShowSubtitles(false); }}
                    onTouchStart={resetHideTimer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => { e.stopPropagation(); handlePlayPause(e); }}
                >
                    <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none" />
                    {!isPaused && (
                        <motion.div
                            className="absolute inset-0 rounded-lg pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at center, rgba(${accent.rgb}, 0.03) 0%, transparent 70%)` }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    )}
                    <ControlsLayer {...controlsProps} isFullscreen={false} />
                </motion.div>
            )}

            {/* Fullscreen portal overlay — desktop & mobile */}
            <AnimatePresence>
                {isFullscreen && (
                    <FullscreenOverlay
                        sourceRect={sourceRect}
                        thumbnailSrc={thumbnailSrc}
                        accent={accent}
                        isPaused={isPaused}
                        isDesktop={isDesktop}
                        onMinimize={handleMinimize}
                        controlsProps={controlsProps}
                        resetHideTimer={resetHideTimer}
                    />
                )}
            </AnimatePresence>
        </>
    );
};