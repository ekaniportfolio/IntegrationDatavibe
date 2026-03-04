import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BarChart3, Trophy, Link2, Sparkles, Scale, Info, Settings, Sun, Moon, Monitor, Globe, Gauge, ChevronDown, ChevronLeft } from "lucide-react";
import { useTheme, THEME_TOGGLE_ENABLED } from "../theme-provider";
import { MOCK_ABOUT_HAS_NEW } from "../../data/mock-backend";
import { useTranslation } from "../language-provider";

// --- TYPES ---
type SpeedPreset = 'zen' | 'normal' | 'rapide' | 'ultra';

interface SlideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onBilanClick?: () => void;
    onNiveauClick?: () => void;
    onConnexionsClick?: () => void;
    /**
     * @todo Overlay pages — ces callbacks seront connectés quand les overlays
     * Offre/Légal/À propos seront codés (même pattern que Bilan/Niveau/Connexions).
     */
    onOffreClick?: () => void;
    onLegalClick?: () => void;
    onAproposClick?: () => void;
    isMobile: boolean;
    isLoggedIn: boolean;
    language: 'FR' | 'EN';
    toggleLanguage: () => void;
    spatialFlowSpeed: SpeedPreset;
    onSpeedChange: (preset: SpeedPreset) => void;
}

// --- SPEED PRESETS ---
// remove the SPEED_PRESETS const — we'll compute it inside the component with t()

// Premium signal bars component
function SpeedBars({ count, active }: { count: number; active: boolean }) {
    const heights = [6, 9, 12, 15];
    return (
        <div className="flex items-end gap-[2px] h-[15px]">
            {heights.map((h, i) => (
                <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{
                        height: h,
                        backgroundColor: i < count
                            ? (active ? 'var(--datavibe-primary)' : 'currentColor')
                            : (active ? 'var(--datavibe-primary)' : 'currentColor'),
                        opacity: i < count ? (active ? 1 : 0.7) : 0.2,
                    }}
                    animate={{ opacity: i < count ? (active ? 1 : 0.7) : 0.2 }}
                    transition={{ duration: 0.2 }}
                />
            ))}
        </div>
    );
}

// --- MENU SECTIONS ---
// move MAIN_ITEMS and INFO_ITEMS inside the component to use t()

// --- ANIMATION VARIANTS ---
const itemVariants = {
    closed: { x: -24, opacity: 0 },
    open: { x: 0, opacity: 1 },
};

const staggerContainer = {
    open: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

// Settings sub-items: STORE DE BOUTIQUE — one single fluid motion, content pinned to bottom (justify-end)
// As height grows 0 → auto, Ultra (bottom) is revealed first, header (top) last
// Like a real shop blind descending: one movement, no stagger, no per-item delays
const STORE_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1]; // smooth deceleration
const STORE_DURATION = 0.55;

// Panel easing — mirrors UserPanel premium feel
const PANEL_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const PANEL_DURATION = 0.45;

// --- COMPONENT ---
export function SlideMenu({ isOpen, onClose, onBilanClick, onNiveauClick, onConnexionsClick, onOffreClick, onLegalClick, onAproposClick, isMobile, isLoggedIn, language, toggleLanguage, spatialFlowSpeed, onSpeedChange }: SlideMenuProps) {
    const { theme, setTheme } = useTheme();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useTranslation();
    const isEn = language === 'EN';

    const panelWidth = isMobile ? 'w-[80vw] max-w-[320px]' : 'w-[320px]';

    const handleClose = () => {
        setIsSettingsOpen(false);
        onClose();
    };

    // Map INFO_ITEMS action to overlay callbacks
    const infoActionMap: Record<string, (() => void) | undefined> = {
        offre: onOffreClick,
        legal: onLegalClick,
        apropos: onAproposClick,
    };

    const MAIN_ITEMS = [
        { icon: BarChart3, label: t('menu.myBilan'), key: 'bilan' },
        { icon: Trophy, label: t('menu.myLevel'), key: 'niveau' },
        { icon: Link2, label: t('menu.myConnections'), key: 'connexions' },
    ];

    const INFO_ITEMS: { icon: typeof Sparkles; label: string; action: 'offre' | 'legal' | 'apropos' }[] = [
        { icon: Sparkles, label: t('menu.offer'), action: 'offre' },
        { icon: Scale, label: t('menu.legal'), action: 'legal' },
        { icon: Info, label: t('menu.about'), action: 'apropos' },
    ];

    const SPEED_PRESETS: { key: SpeedPreset; label: string; description: string; bars: number }[] = [
        { key: 'zen', label: t('menu.speed.zen'), description: t('menu.speed.zenDesc'), bars: 1 },
        { key: 'normal', label: t('menu.speed.normal'), description: t('menu.speed.normalDesc'), bars: 2 },
        { key: 'rapide', label: t('menu.speed.fast'), description: t('menu.speed.fastDesc'), bars: 3 },
        { key: 'ultra', label: t('menu.speed.ultra'), description: t('menu.speed.ultraDesc'), bars: 4 },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop — frost effect like UserPanel */}
                    <motion.div
                        key="menu-backdrop"
                        className="fixed inset-0 z-[70] backdrop-blur-md bg-black/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose}
                    />

                    {/* Panel — premium glass like UserPanel */}
                    <motion.div
                        key="menu-panel"
                        className={`fixed top-0 left-0 h-full bg-card/95 backdrop-blur-xl border-r border-border shadow-xl z-[71] flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar ${panelWidth}`}
                        style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }}
                        initial={{ x: "-110%", opacity: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-110%", opacity: 0.8 }}
                        transition={{ duration: PANEL_DURATION, ease: PANEL_EASE }}
                    >
                        {/* Premium gradient overlay — full panel (like UserPanel profile header) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-datavibe-primary/10 via-transparent to-datavibe-purple/5 pointer-events-none" style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20 }} />

                        {/* Header spacer */}
                        <div className="h-16 shrink-0" />

                        {/* Menu content — single nav, no sub-pages (sub-pages will be overlays) */}
                        <motion.nav
                            key="main-menu"
                            className="relative flex-1 flex flex-col px-3 pb-6 gap-1"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={staggerContainer}
                        >
                            {/* Main Section */}
                            <div className="mb-2">
                                {MAIN_ITEMS.map((item) => (
                                    <motion.button
                                        key={item.key}
                                        variants={itemVariants}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer group"
                                        onClick={item.key === 'bilan' ? (onBilanClick || onClose) : item.key === 'niveau' ? (onNiveauClick || onClose) : item.key === 'connexions' ? (onConnexionsClick || onClose) : undefined}
                                    >
                                        <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Separator */}
                            <motion.div variants={itemVariants} transition={{ duration: 0.2 }} className="h-px bg-border mx-3 mb-2" />

                            {/* Info Section — buttons trigger overlay callbacks (à coder) */}
                            <div className="mb-2">
                                {INFO_ITEMS.map((item) => (
                                    <motion.button
                                        key={item.label}
                                        variants={itemVariants}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer group"
                                        onClick={() => {
                                            const handler = infoActionMap[item.action];
                                            if (handler) handler();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                                                {/* Notification badge — animated glow dot for "À propos" when new content */}
                                                {item.action === 'apropos' && MOCK_ABOUT_HAS_NEW && (
                                                    <motion.div
                                                        className="absolute -top-1 -right-1 w-[7px] h-[7px] rounded-full"
                                                        style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }}
                                                        animate={{
                                                            opacity: [0.5, 1, 0.5],
                                                            scale: [0.85, 1.15, 0.85],
                                                            filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
                                                        }}
                                                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                                                    />
                                                )}
                                            </div>
                                            <span className="text-sm">{item.label}</span>
                                        </div>
                                        <ChevronLeft className="w-3.5 h-3.5 rotate-180 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Separator */}
                            <motion.div variants={itemVariants} transition={{ duration: 0.2 }} className="h-px bg-border mx-3 mb-2" />

                            {/* Settings Section */}
                            <motion.div variants={itemVariants} transition={{ duration: 0.3, ease: "easeOut" }}>
                                <button
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-foreground hover:bg-muted transition-colors cursor-pointer group"
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-medium">{t('menu.settings')}</span>
                                    </div>
                                    <motion.span
                                        className="text-muted-foreground"
                                        animate={{ rotate: isSettingsOpen ? 180 : 0 }}
                                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.span>
                                </button>

                                {/* Settings Sub-panel — STORE DE BOUTIQUE : content pinned to bottom, height reveals Ultra first */}
                                <AnimatePresence>
                                    {isSettingsOpen && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            transition={{ duration: STORE_DURATION, ease: STORE_EASE }}
                                            className="overflow-hidden flex flex-col justify-end"
                                        >
                                            <div className="px-3 pt-2 pb-3">
                                                {/* Speed Spatial Flow — Header (top = last to appear, first to disappear) */}
                                                <div className="mb-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Gauge className="w-4 h-4 text-primary" />
                                                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                            Spatial Flow
                                                        </span>
                                                    </div>

                                                    {/* Preset items — static layout, the store reveal does all the work */}
                                                    <div className="flex flex-col gap-1">
                                                        {SPEED_PRESETS.map((preset) => {
                                                            const isActive = spatialFlowSpeed === preset.key;
                                                            return (
                                                                <button
                                                                    key={preset.key}
                                                                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${isActive ? 'bg-datavibe-primary/10 border border-datavibe-primary/20' : 'hover:bg-muted border border-transparent'}`}
                                                                    onClick={() => onSpeedChange(preset.key)}
                                                                >
                                                                    <SpeedBars count={preset.bars} active={isActive} />
                                                                    <div className="flex flex-col items-start gap-0.5 flex-1">
                                                                        <span className={`text-xs font-semibold leading-none ${isActive ? 'text-datavibe-primary' : 'text-foreground'}`}>
                                                                            {preset.label}
                                                                        </span>
                                                                        <span className="text-[10px] text-muted-foreground leading-none">
                                                                            {preset.description}
                                                                        </span>
                                                                    </div>
                                                                    {isActive && (
                                                                        <motion.div
                                                                            layoutId="speed-active-dot"
                                                                            className="w-1.5 h-1.5 rounded-full bg-datavibe-primary"
                                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                        />
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Mobile Only: Language & Theme */}
                            {isMobile && (
                                <>
                                    <motion.div variants={itemVariants} transition={{ duration: 0.2 }} className="h-px bg-border mx-3 mb-2 mt-1" />

                                    {/* Language Toggle */}
                                    <motion.div
                                        variants={itemVariants}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="flex items-center justify-between px-3 py-3 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground">{t('menu.language')}</span>
                                        </div>
                                        <div className="relative bg-muted rounded-full p-0.5 flex">
                                            <motion.div
                                                className="absolute top-0.5 bottom-0.5 bg-card rounded-full shadow-sm border border-border"
                                                animate={{
                                                    left: language === 'FR' ? 2 : '50%',
                                                }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                style={{
                                                    width: 'calc(50% - 2px)',
                                                }}
                                            />
                                            <button
                                                className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${language === 'FR' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => language !== 'FR' && toggleLanguage()}
                                            >
                                                FR
                                            </button>
                                            <button
                                                className={`relative z-10 px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${language === 'EN' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => language !== 'EN' && toggleLanguage()}
                                            >
                                                EN
                                            </button>
                                        </div>
                                    </motion.div>

                                    {/* Theme Toggle — hidden when THEME_TOGGLE_ENABLED is false */}
                                    {THEME_TOGGLE_ENABLED && (
                                    <motion.div
                                        variants={itemVariants}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className="flex items-center justify-between px-3 py-3 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Sun className="w-5 h-5 text-muted-foreground" />
                                            <span className="text-sm font-medium text-foreground">{t('menu.theme')}</span>
                                        </div>
                                        <div className="relative bg-muted rounded-full p-0.5 flex">
                                            <motion.div
                                                className="absolute top-0.5 bottom-0.5 bg-card rounded-full shadow-sm border border-border"
                                                animate={{
                                                    left: theme === 'light' ? 2 : theme === 'dark' ? '33.33%' : '66.66%',
                                                }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                style={{
                                                    width: 'calc(33.33% - 2px)',
                                                }}
                                            />
                                            <button
                                                className={`relative z-10 p-1.5 rounded-full transition-colors cursor-pointer ${theme === 'light' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => setTheme('light')}
                                            >
                                                <Sun className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                className={`relative z-10 p-1.5 rounded-full transition-colors cursor-pointer ${theme === 'dark' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => setTheme('dark')}
                                            >
                                                <Moon className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                className={`relative z-10 p-1.5 rounded-full transition-colors cursor-pointer ${theme === 'system' ? 'text-foreground' : 'text-muted-foreground'}`}
                                                onClick={() => setTheme('system')}
                                            >
                                                <Monitor className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                    )}
                                </>
                            )}
                        </motion.nav>
                    </motion.div>

                    {/* Cross button removed — unified burger/cross element in NewPlatform.tsx */}
                </>
            )}
        </AnimatePresence>
    );
}