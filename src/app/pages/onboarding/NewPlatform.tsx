import { useState, useEffect, useRef, forwardRef, useMemo } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useLocation } from "react-router";
import { Logo } from "../../components/branding/Logo";
import { GlassAuthCard } from "../../components/auth/GlassAuthCard";
import { ForgotPasswordCard } from "../../components/auth/ForgotPasswordCard";
import { SignUpCard } from "../../components/auth/SignUpCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useScroll } from "motion/react";
import { OnboardingHeader, VisiomorphicHelpAvatar } from "../../components/onboarding/OnboardingHeader";
import { Search, Check, Loader2, Menu, TrendingUp, TrendingDown, Globe, User, BarChart2, X, ChevronLeft, Lock } from "lucide-react";
import { MOCK_SOCIALS_CONNECTED_TO_SPOTIFY } from "../../data/mock-backend";
import { SocialLockedAlert, SocialPlatformConnect } from "../../components/onboarding/SocialLockedOverlay";
import { ModeToggle } from "../../components/mode-toggle";
import { THEME_TOGGLE_ENABLED } from "../../components/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

import { UserPanel, PROFILE_IMAGE } from "../../components/onboarding/UserPanel";
import { SlideMenu } from "../../components/onboarding/SlideMenu";
import { WelcomeCarousel } from "../../components/onboarding/WelcomeCarousel";
import { StreamingBottomNav } from "../../components/onboarding/StreamingBottomNav";
import { SocialBottomNav } from "../../components/onboarding/SocialBottomNav";
import { RadioBottomNav } from "../../components/onboarding/RadioBottomNav";
import { MainBottomNav } from "../../components/onboarding/MainBottomNav";
import { SongsTable } from "../../components/tables/SongsTable";
import { TopStationsTable } from "../../components/tables/TopStationsTable";
import { ReflexOpportunity, ReflexOpportunityData } from "../../reflex-matrix/ReflexOpportunity";
import { WeightedStreamsCard } from "../../components/dashboard/WeightedStreamsCard";
import { LatestPerformanceCard } from "../../components/dashboard/LatestPerformanceCard";
import { getCurrentDateFormatted } from "../../utils/dateUtils";
import { generateOpportunityData } from "../../utils/dataSimulation";

// Imported Frames for Full Dashboard
import SocialDashboardHeader from "../../../imports/SocialDashboardHeader";
import PlatformDistribution from "../../components/social/PlatformDistribution";
import BestPlatforms from "../../components/social/BestPlatforms";
import StreamingDashboardHeader from "../../../imports/StreamingDashboardHeader";
import RadioDashboardHeader from "../../../imports/RadioDashboardHeader";
import PerformanceOverview from "../../../imports/Frame1618873170-180-388";
import SocialPerformanceOverview from "../../../imports/Frame1618873170-857-34";
import SubscriberAnalysis from "../../components/social/SubscriberAnalysis";
import SubscribersByGender from "../../components/social/SubscribersByGender";
import SubscribersByAge from "../../components/social/SubscribersByAge";
import StreamingPerformanceOverview from "../../../imports/StreamingPerformanceOverview";
import RadioPerformanceOverview from "../../../imports/RadioPerformanceOverview";
import { RadioCountriesAnalysis } from "../../components/dashboard/RadioCountriesAnalysis";
import { RadioStationDistribution } from "../../components/dashboard/RadioStationDistribution";
import { MediaPerformanceCards } from "../../components/dashboard/MediaPerformanceCards";
import { MediaStrategyCard } from "../../components/dashboard/MediaStrategyCard";
import { MediaActionCard } from "../../components/dashboard/MediaActionCard";
import { MediaCampaignCard } from "../../components/dashboard/MediaCampaignCard";
import { StreamingPerformanceUnified } from "../../components/onboarding/StreamingPerformanceUnified";
import { useLanguage, useTranslation } from "../../components/language-provider";
import PlaylistAnalysis from "../../../imports/PlaylistAnalysis";
import SocialEngagementCard from "../../../imports/SocialEngagementCard";
import RadioPlaylistAnalysis from "../../../imports/RadioPlaylistAnalysis";
import AnalyseDes5PrincipauxPays from "../../../imports/AnalyseDes5PrincipauxPays";
import { BilanContentBlocks } from "../../components/onboarding/BilanContentBlocks";
import { BilanSocialContentBlocks } from "../../components/onboarding/BilanSocialContentBlocks";
import { BilanMediaContentBlocks } from "../../components/onboarding/BilanMediaContentBlocks";
import { BilanBottomNav } from "../../components/onboarding/BilanBottomNav";
import { NiveauContentBlocks } from "../../components/onboarding/NiveauContentBlocks";
import { ConnexionsContentBlocks } from "../../components/onboarding/ConnexionsContentBlocks";
import { OffreContentBlocks } from "../../components/onboarding/OffreContentBlocks";
import { LegalContentBlocks } from "../../components/onboarding/LegalContentBlocks";
import { AboutContentBlocks } from "../../components/onboarding/AboutContentBlocks";
import { 
    type SpeedPreset, 
    getSpatialFlowSpeed, getSpeedScale, getFlowDuration, 
    updateSpatialFlowSpeed, setRebuildCallback, 
    scaleTransition, scaledSpring 
} from "../../reflex-matrix/spatial-speed";


// --- HELPERS & ICONS ---

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

// --- VISIOMORPHIC DATA ---
const SVG_PATHS = [
    "M0 28C0 43.464 12.536 56 28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28Z", // 1 (Circle)
    "M136.778 0H103C88.0883 0 76 12.0883 76 27V29C76 43.9117 88.0883 56 103 56H136.778C151.69 56 163.778 43.9117 163.778 29V27C163.778 12.0883 151.69 0 136.778 0Z", // 2
    "M278.234 0H208.878C195.016 0 183.778 11.2377 183.778 25.1V30.9C183.778 44.7623 195.016 56 208.878 56H278.234C292.096 56 303.334 44.7623 303.334 30.9V25.1C303.334 11.2377 292.096 0 278.234 0Z", // 3
    "M450.866 0H347.133C333.989 0 323.333 10.6556 323.333 23.8V32.2C323.333 45.3444 333.989 56 347.133 56H450.866C464.01 56 474.666 45.3444 474.666 32.2V23.8C474.666 10.6556 464.01 0 450.866 0Z", // 4
    "M655.278 0H517.167C504.741 0 494.667 10.0736 494.667 22.5V33.5C494.667 45.9264 504.741 56 517.167 56H655.278C667.704 56 677.778 45.9264 677.778 33.5V22.5C677.778 10.0736 667.704 0 655.278 0Z", // 5
    "M891.467 0H718.978C707.27 0 697.778 9.49156 697.778 21.2V34.8C697.778 46.5084 707.27 56 718.978 56H891.467C903.175 56 912.667 46.5084 912.667 34.8V21.2C912.667 9.49156 903.175 0 891.467 0Z", // 6
    "M1159.43 0H952.567C941.577 0 932.667 8.90954 932.667 19.9V36.1C932.667 47.0905 941.577 56 952.567 56H1159.43C1170.42 56 1179.33 47.0905 1179.33 36.1V19.9C1179.33 8.90953 1170.42 0 1159.43 0Z", // 7
    "M1459.18 0H1217.93C1207.66 0 1199.33 8.3275 1199.33 18.6V37.4C1199.33 47.6725 1207.66 56 1217.93 56H1459.18C1469.45 56 1477.78 47.6725 1477.78 37.4V18.6C1477.78 8.3275 1469.45 0 1459.18 0Z", // 8
    "M1790.7 0H1515.08C1505.52 0 1497.78 7.74547 1497.78 17.3V38.7C1497.78 48.2545 1505.52 56 1515.08 56H1790.7C1800.25 56 1808 48.2545 1808 38.7V17.3C1808 7.74547 1800.25 0 1790.7 0Z", // 9
    "M2154 0H1844C1835.16 0 1828 7.16344 1828 16V40C1828 48.8366 1835.16 56 1844 56H2154C2162.84 56 2170 48.8366 2170 40V16C2170 7.16344 2162.84 0 2154 0Z" // 10 (Rect)
];
const SVG_VIEWBOXES = [
    "0 0 56 56", "76 0 88 56", "183 0 120 56", "323 0 152 56", "494 0 184 56", "697 0 215 56", "932 0 247 56", "1199 0 279 56", "1497 0 311 56", "1828 0 342 56"
];

// Facteur de ralentissement pour le debogage — now delegated to spatial-speed module
// Helper pour appliquer le facteur de vitesse (local timing sequences only)
const t = (seconds: number) => seconds;

const ANIMATION_CARTOGRAPHY = {
    // 1. LE BOUTON AVATAR (Le Déclencheur)
    avatar: {
        trigger: { duration: t(0.4) }
    },
    // 2. L'OVERLAY (Le Fond qui s'étend)
    overlay: {
        open: { duration: t(0.50), type: "spring", stiffness: 80, damping: 15 },
        close: { duration: t(0.40) }
    },
    // 6. LE CONTENU DE LA CARTE (Texte, Input, Boutons)
    authContent: {
        open: {
             // DELAY: Synchronisé avec l'overlay (t)
             delay: t(0.50), 
             // Ajustement pour une entrée plus douce (0.1 -> 0.15, 0.6 -> 0.8)
             stagger: t(0.15), 
             duration: t(0.8)
        },
        close: {
             duration: t(0.6),
             stagger: t(0.1)
        }
    }
};

// Durée totale de sortie du contenu Sign-in (8 items) : dernier enfant termine à duration + 7*stagger
const CONTENT_CLOSE_TIME = ANIMATION_CARTOGRAPHY.authContent.close.duration
    + 7 * ANIMATION_CARTOGRAPHY.authContent.close.stagger;

// Durée totale de sortie ForgotPassword (4 items) : dernier enfant termine à duration + 3*stagger
const FORGOT_CLOSE_TIME = ANIMATION_CARTOGRAPHY.authContent.close.duration
    + 3 * ANIMATION_CARTOGRAPHY.authContent.close.stagger;

// Durée de l'animation de contraction/expansion de hauteur entre les deux vues
// RAW = unscaled (for scaleTransition), scaled = for setTimeout calculations
const HEIGHT_ANIM_DURATION_RAW = 0.4;
const HEIGHT_ANIM_DURATION = getFlowDuration(HEIGHT_ANIM_DURATION_RAW);

// Valeurs originales pour reset après retour forgot→signin
const ORIGINAL_OPEN_DELAY = t(0.50);
const ORIGINAL_OPEN_DURATION = t(0.8);
const ORIGINAL_OPEN_STAGGER = t(0.15);
// Valeurs accélérées pour l'entrée retour (petit→grand format)
const RETURN_OPEN_DELAY = t(0.15);
const RETURN_OPEN_DURATION = t(0.5);
const RETURN_OPEN_STAGGER = t(0.08);
// Valeurs accélérées pour l'entrée forgot (grand→petit format)
const FORGOT_OPEN_DELAY = t(0.25);
const FORGOT_OPEN_DURATION = t(0.55);
const FORGOT_OPEN_STAGGER = t(0.10);
// Valeurs accélérées pour l'entrée signup (signin→signup : expansion)
const SIGNUP_OPEN_DELAY = t(0.15);
const SIGNUP_OPEN_DURATION = t(0.50);
const SIGNUP_OPEN_STAGGER = t(0.07);
// Durée totale de sortie SignUp (10 items) : dernier enfant termine à duration + 9*stagger
const SIGNUP_CLOSE_TIME = ANIMATION_CARTOGRAPHY.authContent.close.duration
    + 9 * ANIMATION_CARTOGRAPHY.authContent.close.stagger;
// ── setTimeout-safe durations (scaled by getFlowDuration) ──
// RAW constants above are for scaleTransition() props (auto-scaled).
// These SCALED versions are for setTimeout/setInterval calculations.
const CONTENT_CLOSE_MS = () => getFlowDuration(CONTENT_CLOSE_TIME) * 1000;
const FORGOT_CLOSE_MS = () => getFlowDuration(FORGOT_CLOSE_TIME) * 1000;
const SIGNUP_CLOSE_MS = () => getFlowDuration(SIGNUP_CLOSE_TIME) * 1000;
const BUFFER_MS = () => getFlowDuration(0.2) * 1000;
const CARTOGRAPHY_RESET_MS = () => getFlowDuration(0.1) * 1000;

// Hauteurs cibles des trois vues (en px)
const SIGNIN_CARD_HEIGHT = 700;
const FORGOT_CARD_HEIGHT = 420;
const SIGNUP_CARD_HEIGHT = 850;

const VisiomorphicShape = ({ mode, duration = 1.0, delay = 0, className }: { mode: 'search' | 'circle', duration?: number, delay?: number, className?: string }) => {
    const motionProgress = useMotionValue(mode === 'search' ? 0 : 1);
    useEffect(() => {
        const target = mode === 'search' ? 1 : 0;
        const controls = animate(motionProgress, target, { duration, delay, ease: "linear" });
        return () => controls.stop();
    }, [mode, duration, delay, motionProgress]);

    const currentPath = useTransform(motionProgress, (latest) => SVG_PATHS[Math.min(Math.round(latest * 9), 9)]);
    const currentViewBox = useTransform(motionProgress, (latest) => SVG_VIEWBOXES[Math.min(Math.round(latest * 9), 9)]);

    return (
        <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
             <motion.svg className="w-full h-full block overflow-visible" preserveAspectRatio="none" style={{ viewBox: currentViewBox } as any}>
                <motion.path fill="var(--card)" stroke="var(--border)" strokeWidth="1" d={currentPath} />
            </motion.svg>
        </div>
    );
};

// --- DATA TYPES ---
interface Artist { id: string; name: string; listeners: string; genre: string; initial: string; }

/**
 * SPATIAL FLOW ORCHESTRATION
 * Centralized timing configuration to ensure scalable synchronization.
 * Flow: Header -> Tabs (0.8s) -> Container (1.1s) -> Body (1.3s) -> Footer (1.6s)
 */
const SEQUENCE = {
    tabs: t(0.4),
    container: t(0.7), // Correspond au délai du bloc principal
    body: t(0.8),      
    footer: t(1.0)     // Bloc opportunité/actions
};

// 2. Physique de l'Âme (RAU/TAF) : stiffness 105, damping 18, mass 1 (Plus dynamique et élastique)
const SOUL_PHYSICS_RAW = {
    type: "spring" as const,
    stiffness: 105,
    damping: 18,
    mass: 1
};
const SOUL_PHYSICS = SOUL_PHYSICS_RAW; // Alias for backward compat — scale at usage site

/**
 * SPATIAL_FLOW_SPEED is now managed by spatial-speed.ts module.
 * All speed logic (getFlowDuration, scaleTransition, updateSpatialFlowSpeed) is imported from there.
 */

const getTabStaggerVariants = (index: number) => ({
    enter: { 
        y: 100,          // Amplitude augmentee pour une entree plus dramatique
        x: 0,
        opacity: 0, 
        filter: "blur(12px)"
    },
    center: { 
        y: 0,            // Position nominale fixe (invariant)
        x: 0,
        opacity: 1, 
        filter: "blur(0px)",
        transition: scaleTransition({ 
            ...SOUL_PHYSICS,
            delay: index * 0.18
        })
    },
    exit: { 
        y: 80,           // Amplitude augmentee pour une sortie marquee
        x: 0,
        opacity: 0, 
        filter: "blur(15px)",
        transition: scaleTransition({ 
            duration: 0.4, 
            ease: "easeIn",
            delay: index * 0.12
        })
    }
});

const TAB_IDS = ["streaming", "social", "radio"] as const;
const TAB_LABEL_KEYS: Record<string, string> = { streaming: "onboarding.streaming", social: "onboarding.social", radio: "onboarding.radio" };
// Implements the "Follow Flow" philosophy: Content moves in the direction of the click.
// Direction 1: Standard -> Full (Standard exits Right, Full enters from Left)
// Direction -1: Full -> Standard (Full exits Left, Standard enters from Right)
// =================================================================================================
// THE TRANSITION VAULT (RIC SUPREME) - DO NOT MODIFY WITHOUT ARCHITECT APPROVAL
// Ces variantes gerent la physique sacree de l entree (3->4) et de la sortie (4->2).
// =================================================================================================
const getHorizontalSlideVariants = (delay = 0, isMorphingToSearch = false) => ({
    enter: (dir: number = 0) => {
        if (dir === 0) return { x: 0, y: 0, opacity: 0, filter: "blur(12px)" };
        return {
            x: dir > 0 ? -400 : 400, 
            y: 0,
            opacity: 0, 
            filter: "blur(12px)" 
        };
    },
    center: (dir: number = 0) => {
        const rawDelay = delay || 0;
        return { 
            x: 0, 
            y: 0,
            opacity: 1, 
            filter: "blur(0px)",
            transition: scaleTransition({ 
                x: { ...SOUL_PHYSICS, delay: rawDelay },
                y: { ...SOUL_PHYSICS, delay: rawDelay },
                opacity: { duration: 0.4, delay: rawDelay },
                filter: { duration: 0.3, delay: rawDelay }
            })
        };
    },
    exit: (dir: number = 0) => {
        if (isMorphingToSearch) return { y: 100, opacity: 0, filter: "blur(15px)", transition: scaleTransition({ duration: 0.6, ease: "easeIn" }) };
        return { 
            x: dir > 0 ? 400 : -400, 
            opacity: 0, 
            filter: "blur(12px)", 
            transition: scaleTransition({ 
                x: { duration: 0.5, ease: "easeIn" },
                opacity: { duration: 0.4 },
                filter: { duration: 0.3 }
            }) 
        };
    }
});

const buildContainerVariants = () => {
    return {
        enter: { 
            x: 0, opacity: 1,
            transition: scaleTransition({ staggerChildren: 0.08, delayChildren: 0.02 })
        },
        center: { 
            x: 0, opacity: 1,
            transition: scaleTransition({ staggerChildren: 0.08, delayChildren: 0.02 })
        },
        exit: { 
            x: 0, opacity: 1,
            transition: scaleTransition({ staggerChildren: 0.05, staggerDirection: 1 }) 
        }
    };
};

const buildChildSlideVariants = () => {
    return {
        enter: (dir: number) => ({ 
            x: dir > 0 ? -300 : 300, 
            y: 30, 
            opacity: 0, 
            filter: "blur(4px)" 
        }),
        center: { 
            x: 0, 
            y: 0, 
            opacity: 1, 
            filter: "blur(0px)",
            transition: scaleTransition({ 
                type: "spring", stiffness: 95, damping: 16, mass: 1
            }) 
        },
        exit: (dir: number) => ({ 
            x: dir > 0 ? 300 : -300, 
            y: 30, 
            opacity: 0, 
            filter: "blur(4px)",
            transition: scaleTransition({ duration: 0.35, ease: "easeInOut" }) 
        })
    };
};

let containerVariants = buildContainerVariants();
let childSlideVariants = buildChildSlideVariants();

// Register rebuild callback so spatial-speed module can trigger variant rebuilds
setRebuildCallback(() => {
    containerVariants = buildContainerVariants();
    childSlideVariants = buildChildSlideVariants();
});

// =================================================================================================


const getFollowFlowVariants = (delay = 0) => ({
    enter: (dir: number) => ({
        x: dir === 0 ? 0 : (dir > 0 ? -400 : 400),
        y: 0,
        opacity: 0,
        filter: "blur(12px)"
    }),
    center: {
        x: 0,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            ...scaledSpring(110, 16, 1),
            delay: getFlowDuration(delay)
        }
    },
    exit: (dir: number) => {
        if (dir === 0) return { y: 120, opacity: 0, filter: "blur(12px)", transition: scaleTransition({ duration: 0.3 }) };
        return {
            x: dir > 0 ? 400 : -400,
            opacity: 0,
            filter: "blur(12px)",
            transition: scaleTransition({ duration: 0.5, ease: "easeIn" })
        };
    }
});

function StepItem({ label, isCompleted }: { label: string, isCompleted: boolean }) {
    return (
        <motion.div 
            initial={{ opacity: 0.4 }}
            animate={{ opacity: isCompleted ? 1 : 0.4 }}
            className="flex items-center gap-3 text-sm font-medium text-foreground transition-all"
        >
            <div className={`
                w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300
                ${isCompleted ? "bg-datavibe-primary text-white" : "bg-muted text-muted-foreground"}
            `}>
                <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            {label}
        </motion.div>
    )
}

// --- SLOTS (Internal Components for "Container Sanctuary" Pattern) ---

/**
 * Slot: Handles the Dashboard Tabs Transition
 */
const DashboardTabsSlot = ({ isFullDashboard, activeTab, onTabChange, subTab, onSubTabChange, isReturning, isArrivingFromDashboard, showStickyNav, isMorphingToSearch, direction, socialTabRef, overlayPage, isBilanView }: any) => {
    const { t: slotT } = useTranslation();
    const TABS = TAB_IDS.map(id => ({ id, label: slotT(TAB_LABEL_KEYS[id]) }));
    const isSocial = activeTab === 'social';
    const isRadio = activeTab === 'radio';
    
    const tabsConfig = isSocial 
        ? [ { id: "dashboard", label: slotT("nav.dashboard") }, { id: "subscribers", label: slotT("nav.followers") }, { id: "demographics", label: slotT("nav.demographics") } ]
        : isRadio
            ? [ { id: "dashboard", label: slotT("nav.dashboard") }, { id: "countries", label: slotT("nav.country") }, { id: "strategy", label: slotT("nav.strategy") } ]
            : [ { id: "dashboard", label: slotT("nav.dashboard") }, { id: "performance", label: slotT("nav.activity") }, { id: "playlists", label: slotT("nav.songs") } ];

    const theme = isSocial
        ? { 
            activeBg: 'bg-dashboard-tab-social-active-bg', 
            inactiveBg: 'bg-dashboard-tab-social-inactive-bg', 
            border: 'border-dashboard-tab-social-border', 
            activeText: 'text-dashboard-tab-social-active-text', 
            inactiveText: 'text-dashboard-tab-social-inactive-text' 
          }
        : isRadio
            ? { 
                activeBg: 'bg-dashboard-tab-active-bg', 
                inactiveBg: 'bg-dashboard-tab-inactive-bg', 
                border: 'border-dashboard-tab-border', 
                activeText: 'text-dashboard-tab-active-text', 
                inactiveText: 'text-dashboard-tab-inactive-text' 
              }
            : { 
                activeBg: 'bg-dashboard-tab-active-bg', 
                inactiveBg: 'bg-dashboard-tab-inactive-bg', 
                border: 'border-dashboard-tab-border', 
                activeText: 'text-dashboard-tab-active-text', 
                inactiveText: 'text-dashboard-tab-inactive-text' 
              };

    return (
        <AnimatePresence mode="popLayout" custom={direction}>
            {!isFullDashboard ? (
                <motion.div 
                    key="standard-tabs-slot"
                    custom={direction}
                    className="w-full flex px-4 gap-[8px]"
                    initial="enter"
                    animate={((overlayPage === 'connexions' || overlayPage === 'offre' || overlayPage === 'legal' || overlayPage === 'apropos') && isBilanView) ? { x: "110%", opacity: 0, filter: "blur(6px)", transition: scaleTransition({ duration: 0.4, ease: "circOut" }) } : "center"}
                    exit="exit"
                    variants={getHorizontalSlideVariants(0.1, isMorphingToSearch)}
                >
                    {TABS.map((tab, index) => {
                        const tokenMap: Record<string, string> = { streaming: "var(--dashboard-streaming)", social: "var(--dashboard-social)", radio: "var(--dashboard-radio)" };
                        const colorVar = tokenMap[tab.id] || "var(--dashboard-streaming)";
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.div 
                                key={tab.id}
                                ref={tab.id === 'social' ? socialTabRef : undefined}
                                onClick={() => onTabChange(tab.id)} 
                                className="relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] cursor-pointer"
                                style={{ backgroundColor: `color-mix(in srgb, ${colorVar}, transparent 90%)`, borderColor: isActive && tab.id === 'streaming' ? 'var(--dashboard-action-streaming-border)' : (isActive && tab.id === 'social' ? 'var(--dashboard-action-social-border)' : colorVar), borderWidth: '0.5px', borderStyle: 'solid', overflow: 'visible' }}
                                custom={direction}
                                variants={direction === 0 || isMorphingToSearch || isArrivingFromDashboard ? getTabStaggerVariants(index) : {
                                    enter: (dir: number) => ({ x: dir > 0 ? -400 : 400, y: 0, opacity: 0, filter: "blur(12px)" }),
                                    center: { 
                                        x: 0, y: 0, opacity: 1, filter: "blur(0px)",
                                        transition: scaleTransition({ ...SOUL_PHYSICS, delay: index * 0.05 })
                                    },
                                    exit: (dir: number) => ({ 
                                        x: dir > 0 ? 400 : -400,
                                        y: 0, opacity: 0, filter: "blur(12px)", 
                                        transition: scaleTransition({ duration: 0.5, ease: "easeIn" }) 
                                    })
                                }}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-tab-fill" 
                                        className="absolute inset-0 rounded-[19px] z-0" 
                                        style={{ 
                                            backgroundColor: colorVar,
                                            border: tab.id === 'social' ? '1px solid var(--dashboard-action-social-border)' : (tab.id === 'radio' ? '1px solid var(--dashboard-action-radio-border)' : undefined)
                                        }} 
                                        initial={{ filter: "blur(4px)", opacity: 0.8, x: 0, y: 0 }} 
                                        animate={{ filter: "blur(0px)", opacity: 1, x: 0, y: 0 }} 
                                        exit={{ filter: "blur(4px)", opacity: 0, x: 0, y: 0 }}
                                        transition={SOUL_PHYSICS} 
                                    />
                                )}
                                {!showStickyNav && (
                                    <motion.span 
                                        key={`label-${tab.id}`}
                                        layoutId={`soul-top-${index}`}
                                        transition={scaleTransition({ ...SOUL_PHYSICS, layout: { duration: 0.3 } })}
                                        style={{ zIndex: 9999 }}
                                        animate={{ opacity: isActive ? 1 : 0.3 }}
                                        whileHover={{ opacity: 1 }}
                                        className="relative text-[12.6px] font-manrope font-bold leading-normal whitespace-nowrap text-white"
                                    >
                                        {tab.label}
                                    </motion.span>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div
                    key="full-dashboard-slot"
                    custom={direction}
                    className="w-full flex px-4 gap-[8px]"
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={{
                        enter: (dir: number) => ({ 
                            x: dir === 0 ? 0 : (dir > 0 ? -400 : 400), 
                            y: dir === 0 ? 120 : 0, 
                            opacity: 0, 
                            filter: "blur(0px)" 
                        }),
                        center: { 
                            x: 0, 
                            y: 0, 
                            opacity: 1, 
                            filter: "blur(0px)", 
                            transition: scaleTransition({ 
                                ...SOUL_PHYSICS,
                                delay: 0.1 
                            }) 
                        },
                        exit: (dir: number) => ({ 
                            x: dir > 0 ? 400 : -400, 
                            y: 0, 
                            opacity: 0, 
                            filter: "blur(0px)", 
                            transition: scaleTransition({ duration: 0.5, ease: "easeIn" }) 
                        })
                    }}
                >
                    {(activeTab === 'radio' ? [ { id: "dashboard", label: slotT("nav.dashboard") }, { id: "countries", label: slotT("nav.country") }, { id: "strategy", label: slotT("nav.strategy") } ] : tabsConfig).map((btn, i) => {
                         const isActive = subTab === btn.id;
                         const isRadio = activeTab === 'radio';
                         
                         return (
                            <motion.div 
                                key={btn.id}
                                onClick={() => onSubTabChange?.(btn.id)}
                                className={`relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] ${!isRadio ? theme.inactiveBg : ''}`}
                                style={{ 
                                    overflow: 'visible',
                                    backgroundColor: isRadio ? (isActive ? '#1286f3' : 'rgba(18,134,243,0.1)') : undefined,
                                }}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="active-dashboard-subtab-pill"
                                        className={`absolute inset-0 rounded-[19px] ${!isRadio ? theme.activeBg : ''}`}
                                        initial={{ filter: "blur(4px)", opacity: 0.8 }} 
                                        animate={{ filter: "blur(0px)", opacity: 1 }} 
                                        exit={{ filter: "blur(4px)", opacity: 0 }}
                                        transition={SOUL_PHYSICS} 
                                        style={{ zIndex: 0, backgroundColor: isRadio ? '#1286f3' : undefined }}
                                    />
                                )}
                                <div 
                                    aria-hidden="true" 
                                    className={`absolute border-[0.5px] border-solid inset-0 pointer-events-none rounded-[19px] ${!isRadio ? (isActive ? 'border-transparent' : theme.border) : ''} z-10`} 
                                    style={{ borderColor: isRadio ? '#1286f3' : undefined }}
                                />
                                {(!isFullDashboard || !showStickyNav) && (
                                    <motion.span 
                                        key={`label-${btn.id}`}
                                        layoutId={`soul-sub-${i}`}
                                        transition={SOUL_PHYSICS}
                                        style={{ zIndex: 20, color: isRadio ? '#ffffff' : undefined }}
                                        className={`relative text-[12.6px] font-manrope font-bold leading-normal whitespace-nowrap ${!isRadio ? (isActive ? theme.activeText : theme.inactiveText + ' opacity-50 hover:opacity-100') : ''}`}
                                    >
                                        {btn.label}
                                    </motion.span>
                                )}
                            </motion.div>
                         );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/**
 * Slot: Handles the Dashboard Content Body (Cards)
 * Implements strict "Enter" vs "Switch" logic to fix the "static blocks" bug.
 */
const DashboardBodySlot = ({ contentTab, direction, isEntry, isFullDashboard, isMorphingToSearch, reflexDividedStates, setReflexDividedStates, opportunityData, socialsConnected = true }: { contentTab: string, direction: number, isEntry: boolean, isFullDashboard?: boolean, isMorphingToSearch?: boolean, reflexDividedStates?: Record<string, boolean>, setReflexDividedStates?: any, opportunityData?: any, socialsConnected?: boolean }) => {
    const { t: bodyT } = useTranslation();
    // Determine delay: If it's the global entry, use SEQUENCE.body. If it's just a tab switch, be fast (0.1s).
    // Use ref to ensure we only use the long delay on first mount.
    const isFirstMount = useRef(true);
    useEffect(() => { isFirstMount.current = false; }, []);
    
    const startDelay = !isEntry ? 0.1 : (isFirstMount.current ? SEQUENCE.body : 0.1);
    
    const getSentimentColor = (sentiment: string) => sentiment === 'positive' ? 'text-[#4CAF50]' : 'text-[#F44336]';

    return (
        <AnimatePresence mode="popLayout" custom={direction}>
            {contentTab === 'streaming' ? (
                <motion.div 
                    key="streaming-body" 
                    className="flex flex-col gap-5 w-full" 
                    custom={direction} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    variants={getHorizontalSlideVariants(0.1, isMorphingToSearch)}
                >
                    <motion.div className="flex gap-2 w-full" custom={direction} variants={{ visible: { transition: scaleTransition({ staggerChildren: 0.1 }) }, exit: { transition: scaleTransition({ staggerChildren: 0.05, staggerDirection: 1 }) } }}>
                        {[ { val: "113.9K", label: bodyT("onboarding.spotify_aud"), sub: "+245", sentiment: "positive" }, { val: "367.9K", label: bodyT("onboarding.youtube_views"), sub: "+12.4K", sentiment: "positive", multi: true }, { val: "166", label: bodyT("onboarding.playlists"), sub: "+2", sentiment: "positive" } ].map((item, i) => (
                            <motion.div key={i} className="flex-1 p-2 py-2.5 bg-dashboard-block-streaming-bg rounded-lg flex flex-col items-center justify-between min-h-[99px] shadow-sm" custom={direction} variants={{ enter: (dir: number) => ({ x: dir === 0 ? (i % 2 === 0 ? -100 : 100) : (dir > 0 ? -100 : 100), y: 0, opacity: 0 }), center: { x: 0, y: 0, opacity: 1 }, exit: (dir: number) => ({ y: isMorphingToSearch ? 400 : 0, x: isMorphingToSearch ? 0 : (dir > 0 ? 400 : -400), opacity: 0 }) }}>
                                <div className="flex flex-col items-center"><p className="text-[20px] font-bold text-dashboard-stat-value">{item.val}</p><p className="text-[12px] font-normal text-dashboard-stat-label text-center leading-tight">{item.label}{item.multi && <><br/><span className="text-[11px]">{bodyT('onboarding.over1month')}</span></>}</p></div><p className={`text-[17px] font-bold ${getSentimentColor(item.sentiment)}`}>{item.sub}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ) : contentTab === 'social' ? (
                <motion.div 
                    key="social-body" 
                    className="flex flex-col gap-4 w-full" 
                    custom={direction} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    variants={getHorizontalSlideVariants(0.1, isMorphingToSearch)}
                >
                    <motion.div className="flex gap-2 w-full" custom={direction} variants={{ hidden: { gap: "100px" }, visible: { gap: ["100px", "4px", "8px"], transition: scaleTransition({ gap: { times: [0, 0.9, 1], duration: 1.2, ease: "circOut" }, staggerChildren: 0.1 }) } }}>
                        {(socialsConnected ? [ 
                            { v: "1.1M", l: "Followers", c: "+890", sentiment: "positive" }, 
                            { v: "17.1K", l: "Like / Post", c: "+1.8K", sentiment: "positive" }, 
                            { v: "2%", l: "Engagement", c: "+0,4", sentiment: "positive" } 
                        ] : [
                            { v: "\u2014", l: "Followers", c: "\u2014", sentiment: "neutral" },
                            { v: "\u2014", l: "Like / Post", c: "\u2014", sentiment: "neutral" },
                            { v: "\u2014", l: "Engagement", c: "\u2014", sentiment: "neutral" }
                        ]).map((s, i) => (
                            <motion.div key={i} className={`bg-dashboard-tab-social-inactive-bg flex-1 p-2 py-3 rounded-lg flex flex-col items-center justify-between min-h-[86px] ${!socialsConnected ? 'opacity-50' : ''}`} custom={direction} variants={{ enter: (dir: number) => ({ x: dir === 0 ? (i % 2 === 0 ? -100 : 100) : (dir > 0 ? -100 : 100), y: 0, opacity: 0 }), center: { x: 0, y: 0, opacity: 1 }, exit: (dir: number) => ({ y: isMorphingToSearch ? 400 : 0, x: isMorphingToSearch ? 0 : (dir > 0 ? 400 : -400), opacity: 0 }) }}>
                                <div className="flex flex-col items-center w-full"><p className="text-[20px] font-bold text-dashboard-stat-value font-manrope">{s.v}</p><p className="text-[12px] font-normal text-dashboard-stat-label font-manrope">{s.l}</p></div><div className="w-full flex justify-center"><p className={`text-[17px] font-bold font-manrope ${s.sentiment === 'positive' ? 'text-dashboard-stat-positive' : (s.sentiment === 'negative' ? 'text-dashboard-trend-down-text' : 'text-white/30')}`}>{s.c}</p></div>
                            </motion.div>
                        ))}
                    </motion.div>
                    {!socialsConnected && <SocialLockedAlert />}
                </motion.div>
            ) : contentTab === 'radio' ? (
                <motion.div 
                    key="radio-body" 
                    className="content-stretch flex flex-col items-start w-full" 
                    custom={direction} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    variants={getHorizontalSlideVariants(0.1, isMorphingToSearch)}
                >
                     <motion.div className="content-stretch flex gap-[8px] items-start justify-center relative shrink-0 w-full" variants={{ hidden: { gap: "100px" }, visible: { gap: ["100px", "4px", "8px"], transition: scaleTransition({ gap: { times: [0, 0.9, 1], duration: 1.2, ease: "circOut" }, staggerChildren: 0.15, delayChildren: 0.1 }) }, exit: { transition: scaleTransition({ staggerChildren: 0.05, staggerDirection: -1 }) } }} initial="hidden" animate="visible">
                        {[ { v: "54", l: "Rotations", c: "-3", sentiment: "negative" }, { v: "4", l: "Pays", c: "+1", sentiment: "positive" } ].map((r, i) => (
                             <motion.div key={i} custom={direction} variants={{ enter: (dir: number) => ({ x: dir === 0 ? (i % 2 === 0 ? -100 : 100) : (dir > 0 ? -100 : 100), y: 0, opacity: 0 }), center: { x: 0, y: 0, opacity: 1 }, exit: (dir: number) => ({ y: isMorphingToSearch ? 400 : 0, x: isMorphingToSearch ? 0 : (dir > 0 ? 400 : -400), opacity: 0 }) }} className="bg-[rgba(18,134,243,0.1)] content-stretch flex flex-col gap-[4px] h-[86px] items-start pb-[8px] pt-[9px] px-[8px] relative rounded-[8px] shrink-0 flex-1">
                                <div className="content-stretch flex flex-col items-center pb-px pt-0 px-0 relative shrink-0 w-full"><div className="flex flex-col font-roboto font-bold justify-center leading-[normal] relative shrink-0 text-[0px] text-center w-full"><p className="font-manrope font-bold mb-0 text-[20px] text-dashboard-stat-value">{r.v}</p><p className="font-manrope font-normal text-[12px] text-dashboard-stat-label">{r.l}</p></div></div>
                                <div className="content-stretch flex flex-col items-center pb-px pt-0 px-0 relative shrink-0 w-full"><div className={`flex flex-col font-manrope font-bold justify-center leading-[0] relative shrink-0 text-[17px] text-center w-full ${r.sentiment === 'positive' ? 'text-dashboard-stat-positive' : 'text-dashboard-trend-down-text'}`}><p className="leading-[normal]">{r.c}</p></div></div>
                            </motion.div>
                        ))}
                     </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}

/**
 * Slot: Handles the Footer Actions (Opportunity vs Social Button)
 */
const DashboardFooterSlot = ({ contentTab, direction, t, isEntry, onNavigate, setIsFullDashboard, onSubTabChange, isFullDashboard, isMorphingToSearch, setReflexDividedStates, opportunityData, reflexDividedStates, socialsConnected = true }: any) => {
    // Explicit timing based on Sequence
    const delay = isEntry ? SEQUENCE.footer : 0.05;
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <AnimatePresence mode="popLayout" custom={direction}>
            {contentTab === 'social' ? (!socialsConnected ? null : isFullDashboard !== undefined && (
                <motion.div 
                    key="social-actions-btn" 
                    custom={direction} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    variants={getHorizontalSlideVariants(delay, isMorphingToSearch)} 
                    className="w-full mt-2 relative"
                >
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="rounded-[8px] w-full py-[11px] px-[8px] flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer transition-all duration-300 min-h-[48px] bg-[rgba(28,180,91,0.05)] border border-[rgba(28,180,91,0.3)] hover:bg-[rgba(28,180,91,0.12)] hover:shadow-[0_0_15px_rgba(28,180,91,0.3)] backdrop-blur-sm"
                        onClick={() => { 
                            if (setReflexDividedStates) {
                                setReflexDividedStates((prev: any) => ({ ...prev, [contentTab]: false }));
                            }
                            const scrollContainer = document.getElementById('main-scroll-container');
                            
                            // Instant scroll
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            if (scrollContainer) scrollContainer.scrollTop = 0;

                            onSubTabChange?.("dashboard");
                            setIsFullDashboard?.(true); 
                        }}
                    >
                        <span className="relative z-10 text-[14px] font-bold tracking-wider text-dashboard-action-social-border font-manrope leading-normal text-center">{t('dashboard.viewFull')}</span>
                        <BarChart2 className="relative z-10 w-4 h-4 text-dashboard-action-social-border" />
                    </div>
                </motion.div>
            )) : contentTab === 'radio' ? (isFullDashboard !== undefined && (
                <motion.div 
                    key="radio-actions-btn" 
                    custom={direction} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    variants={getHorizontalSlideVariants(delay, isMorphingToSearch)} 
                    className="w-full mt-2 relative"
                >
                    <div
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="rounded-[8px] w-full py-[11px] px-[8px] flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer transition-all duration-300 min-h-[48px] bg-[rgba(18,134,243,0.05)] border border-[rgba(18,134,243,0.3)] hover:bg-[rgba(18,134,243,0.12)] hover:shadow-[0_0_15px_rgba(18,134,243,0.3)] backdrop-blur-sm"
                        onClick={() => { 
                            if (setReflexDividedStates) {
                                setReflexDividedStates((prev: any) => ({ ...prev, [contentTab]: false }));
                            }
                            const scrollContainer = document.getElementById('main-scroll-container');
                            
                            // Instant scroll
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            if (scrollContainer) scrollContainer.scrollTop = 0;

                            onSubTabChange?.("dashboard");
                            setIsFullDashboard?.(true); 
                        }}
                    >
                        <span className="relative z-10 text-[14px] font-bold tracking-wider text-[#4A8FFF] font-manrope leading-normal text-center">{t('dashboard.viewFull')}</span>
                        <BarChart2 className="relative z-10 w-4 h-4 text-[#4A8FFF]" />
                    </div>
                </motion.div>
            )) : (
                <motion.div key="opportunity-card" custom={direction} initial="enter" animate="center" exit="exit" variants={getHorizontalSlideVariants(delay, isMorphingToSearch)} className="w-full mt-2 relative">
                    {isFullDashboard !== undefined ? (
                        <div 
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`rounded-[8px] w-full py-[11px] px-[8px] flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer transition-all duration-300 min-h-[48px] backdrop-blur-sm ${contentTab === 'streaming' ? 'bg-[rgba(242,142,66,0.05)] border border-[rgba(242,142,66,0.3)] hover:bg-[rgba(242,142,66,0.12)] hover:shadow-[0_0_15px_rgba(242,142,66,0.3)]' : contentTab === 'social' ? 'bg-[rgba(28,180,91,0.05)] border border-[rgba(28,180,91,0.3)] hover:bg-[rgba(28,180,91,0.12)] hover:shadow-[0_0_15px_rgba(28,180,91,0.3)]' : 'bg-[rgba(18,134,243,0.05)] border border-[rgba(18,134,243,0.3)] hover:bg-[rgba(18,134,243,0.12)] hover:shadow-[0_0_15px_rgba(18,134,243,0.3)]'}`}
                            onClick={() => {  
                                if (setReflexDividedStates) {
                                    setReflexDividedStates((prev: any) => ({ ...prev, [contentTab]: false }));
                                }
                                const scrollContainer = document.getElementById('main-scroll-container');
                                
                                // Instant scroll
                                window.scrollTo(0, 0);
                                document.documentElement.scrollTop = 0;
                                document.body.scrollTop = 0;
                                if (scrollContainer) scrollContainer.scrollTop = 0;

                                onSubTabChange?.("dashboard");
                                setIsFullDashboard?.(true); 
                            }}
                        >
                            <span className={`relative z-10 text-[14px] font-bold tracking-wider font-manrope leading-normal text-center ${contentTab === 'streaming' ? 'text-dashboard-action-streaming-border' : contentTab === 'social' ? 'text-dashboard-action-social-border' : 'text-[#4A8FFF]'}`}>{t('dashboard.viewFull')}</span>
                            <BarChart2 className={`relative z-10 w-4 h-4 ${contentTab === 'streaming' ? 'text-dashboard-action-streaming-border' : contentTab === 'social' ? 'text-dashboard-action-social-border' : 'text-[#4A8FFF]'}`} />
                        </div>
                    ) : (
                        <div className="w-full relative mt-2">
                            <ReflexOpportunity 
                                namespace={contentTab} 
                                data={opportunityData?.[contentTab] || opportunityData?.streaming} 
                                isDivided={reflexDividedStates?.[contentTab]}
                                setIsDivided={(val) => {
                                    if (setReflexDividedStates) {
                                        setReflexDividedStates((prev: any) => ({ 
                                            ...prev, 
                                            [contentTab]: typeof val === 'function' ? val(prev[contentTab]) : val 
                                        }));
                                    }
                                }}
                                direction={direction}
                            />
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// --- MOBILE SPECIFIC CONSTANTS ---

const MOBILE_SMOOTH_FLOW_RAW = { duration: 0.8, ease: "circOut" } as const;
const getMobileSmoothFlow = () => scaleTransition({ ...MOBILE_SMOOTH_FLOW_RAW });

const getMobileFullDashboardVariants = () => ({
    hidden: { 
        x: "-100%", opacity: 0, scale: 1, filter: "blur(10px)",
        transition: getMobileSmoothFlow()
    },
    visible: { 
        x: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: getMobileSmoothFlow() 
    },
    exit: { x: "-100%", opacity: 0 }
});

const getMobileStdLateralChildVariants = () => ({
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }) },
    hidden: { opacity: 0, x: 50, filter: "blur(4px)", transition: scaleTransition({ duration: 0.35, ease: "easeIn" }) }
});
const getMobileFullLateralChildVariants = () => ({
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }) },
    hidden: { opacity: 0, x: -50, filter: "blur(4px)", transition: scaleTransition({ duration: 0.35, ease: "easeIn" }) }
});

// --- STICKY NAV COMPONENTS (Protocole de Montée des Âmes) ---

const StickyTabsHeader = ({ activeTab, onTabChange, isVisible, direction, isAuthFocused }: any) => {
    const { t: stickyT } = useTranslation();
    const TABS = TAB_IDS.map(id => ({ id, label: stickyT(TAB_LABEL_KEYS[id]) }));
    return (
        <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : { y: -10, opacity: 0 }}
            transition={SOUL_PHYSICS}
            className={`fixed top-16 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border py-2 px-4 hidden md:flex justify-between gap-2 shadow-sm ${isAuthFocused ? "pointer-events-none" : "pointer-events-auto"}`}
        >
            {TABS.map((tab, index) => {
                const isActive = activeTab === tab.id;
                const tokenMap: any = { streaming: "var(--dashboard-streaming)", social: "var(--dashboard-social)", radio: "var(--dashboard-radio)" };
                const colorVar = tokenMap[tab.id];
                
                return (
                    <motion.div 
                        key={tab.id}
                        onClick={() => {
                            // [FIX] Scroll to top logic replicated from Mobile MainBottomNav
                            const scrollContainer = document.getElementById('main-scroll-container');
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                            if (scrollContainer) scrollContainer.scrollTop = 0;

                            onTabChange(tab.id);
                        }}
                        className="relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] cursor-pointer overflow-visible"
                        style={{ backgroundColor: `color-mix(in srgb, ${colorVar}, transparent 90%)`, borderColor: isActive && tab.id === 'streaming' ? 'var(--dashboard-action-streaming-border)' : (isActive && tab.id === 'social' ? 'var(--dashboard-action-social-border)' : colorVar), borderWidth: '0.5px', borderStyle: 'solid' }}
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="active-tab-fill-sticky" 
                                className="absolute inset-0 rounded-[19px] z-0" 
                                style={{ backgroundColor: colorVar }} 
                                transition={SOUL_PHYSICS} 
                            />
                        )}
                        <motion.span 
                            layoutId={`soul-sticky-${index}`}
                            transition={SOUL_PHYSICS}
                            className="relative z-10 text-[12.6px] font-manrope font-bold leading-normal whitespace-nowrap text-white"
                            animate={{ opacity: isActive ? 1 : 0.5 }}
                            style={{ zIndex: 9999 }}
                        >
                            {tab.label}
                        </motion.span>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

// --- MOBILE SPECIFIC SLOTS ---






const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 768px) or (pointer: coarse)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
};

const MobileSearchSync = ({ 
    step, searchQuery, setSearchQuery, isSearching, searchResults, selectedArtist, setSelectedArtist, 
    isExitingSearch, syncProgress, syncSteps, isSyncCompleting, isArrivingFromDashboard, isMorphingToSearch, 
    isInputFocused, setIsInputFocused, focusedResultIndex, setFocusedResultIndex, handleStartSync, handleSpotifyLogin, t, inputRef 
}: any) => {
    const handleResultClick = (id: string) => {
        if (selectedArtist === id) {
            handleStartSync();
        } else {
            setSelectedArtist(id);
        }
    };

    useEffect(() => {
        if (isArrivingFromDashboard && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isArrivingFromDashboard, inputRef]);

    const containerAnimation = useMemo(() => {
        if (isSyncCompleting) {
            return { width: 56, height: 56, borderRadius: 28, y: 0, opacity: 1, transition: scaleTransition({ duration: 0.7, ease: "easeInOut" }) };
        }
        if (isExitingSearch || step === 'sync') {
            return { width: 80, height: 80, borderRadius: 40, y: 0, opacity: 1, transition: scaleTransition({ duration: 1.0, ease: "circInOut", delay: 0.2 }) };
        }
        if (isArrivingFromDashboard) {
            return { width: 56, height: 56, borderRadius: 28, opacity: 1 };
        }
        return { width: "100%", height: 56, borderRadius: 16, y: 0, opacity: 1, transition: scaleTransition({ y: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.5, ease: "easeOut" }, height: { duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }, borderRadius: { duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }, width: { duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] } }) };
    }, [isSyncCompleting, isExitingSearch, step, isArrivingFromDashboard]);

    return (
        <motion.div className="w-full max-w-sm mx-auto px-4 h-full flex flex-col items-center relative mobile-touch-view overflow-hidden">
            <motion.div 
                className="absolute top-[12vh] w-full flex flex-col items-center z-10"
                animate={isArrivingFromDashboard || isInputFocused || step === 'sync' || selectedArtist ? { y: -400, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={scaleTransition({ duration: 0.4, ease: "easeOut" })}
            >
                <AnimatePresence>
                    {!isExitingSearch && step === 'search' && !isArrivingFromDashboard && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.4 }) }} transition={scaleTransition({ duration: 0.4, ease: "easeOut", delay: 1.0 })} className="mb-8">
                                <motion.button onClick={handleSpotifyLogin} className="flex items-center gap-2 px-4 py-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-[#1DB954]/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <SpotifyIcon className="w-5 h-5 text-[#1DB954]" /><span className="text-[#1DB954] text-xs font-semibold">{t("onboarding.connect_spotify")}</span>
                                </motion.button>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.4, delay: 0.1 }) }} transition={scaleTransition({ duration: 0.4, ease: "easeOut", delay: 1.15 })} className="flex flex-col items-center w-full -mt-2">
                                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">{t("onboarding.search_title")}</h2><p className="text-muted-foreground text-sm text-center">{t("onboarding.search_subtitle")}</p>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div 
                className="w-full flex flex-col items-center mt-[30vh] relative z-20 flex-1 min-h-0"
                initial={isArrivingFromDashboard ? { y: -160 } : { y: 0 }}
                animate={(isArrivingFromDashboard || isInputFocused || step === 'sync' || selectedArtist) ? { y: -160 } : { y: 0 }}
                transition={scaleTransition({ type: "spring", stiffness: 180, damping: 24 })}
            >
                <motion.div 
                    layoutId="visiomorphic-container" 
                    className={`relative flex items-center justify-center overflow-hidden z-50 mx-auto transition-colors duration-0 shrink-0 ${isMorphingToSearch ? 'bg-transparent shadow-none border-none' : 'bg-card border border-border shadow-sm'}`} 
                    style={{ boxShadow: isMorphingToSearch ? "0 0 0 0 rgba(0,0,0,0)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
                    onLayoutAnimationComplete={() => { if (isArrivingFromDashboard) setTimeout(() => { if(typeof setIsArrivingFromDashboard === 'function') setIsArrivingFromDashboard(false); }, 50); }} 
                    initial={isArrivingFromDashboard ? { width: 56, height: 56, borderRadius: 28, opacity: 1, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" } : { width: 44, height: 44, borderRadius: 22, y: -120, opacity: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)" }} 
                    animate={containerAnimation}
                    transition={scaleTransition({ layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } })}
                >
                    <VisiomorphicShape mode='search' duration={1.0} delay={0} className={isMorphingToSearch ? "opacity-100" : "opacity-0"} />
                    <div className={`absolute inset-0 w-full h-full flex items-center px-4 transition-opacity duration-300 ${isExitingSearch || step === 'sync' || isSyncCompleting || isArrivingFromDashboard ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" /><Input ref={inputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsInputFocused(true)} className="flex-1 !bg-transparent !border-none !shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-full text-base font-medium text-foreground placeholder:text-muted-foreground/70 relative z-10" placeholder={isInputFocused ? "" : t("onboarding.search_placeholder")} /></div>
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 delay-300 ${(isExitingSearch || step === 'sync') && !isSyncCompleting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><span className="text-foreground text-xl font-bold font-manrope">{searchResults.find((a: any) => a.id === selectedArtist)?.initial || "K"}</span></div>
                </motion.div>
                <AnimatePresence>
                    {step === 'sync' && (
                        <motion.svg viewBox="0 0 100 100" className="absolute top-[40px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] -rotate-90 pointer-events-none z-10" initial={{ opacity: 0 }} animate={{ opacity: isSyncCompleting ? 0 : 1, scale: isSyncCompleting ? 0.8 : 1 }} exit={{ opacity: 0, transition: scaleTransition({ duration: 0.05 }) }} transition={scaleTransition({ duration: 0.5 })}>
                            <circle cx="50" cy="50" r="45" fill="none" className="stroke-muted/20" strokeWidth="4"></circle>
                            <motion.circle cx="50" cy="50" r="45" fill="none" className="stroke-datavibe-primary" strokeWidth="4" strokeDasharray="283" strokeLinecap="round" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (syncProgress / 100)) }} transition={scaleTransition({ duration: 0.5, ease: "linear" })} style={{ filter: "blur(8px)", opacity: 0.7 }} />
                            <motion.circle cx="50" cy="50" r="45" fill="none" className="stroke-datavibe-primary" strokeWidth="4" strokeDasharray="283" strokeLinecap="round" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (syncProgress / 100)) }} transition={scaleTransition({ duration: 0.5, ease: "linear" })} />
                        </motion.svg>
                    )}
                </AnimatePresence>

                <div className="w-full relative mt-6 flex-1 overflow-y-auto no-scrollbar min-h-0 pb-20">
                    <AnimatePresence mode="wait">
                        {step === 'search' && searchResults.length > 0 && !isSearching && (
                            <motion.div className="w-full flex flex-col gap-3 mb-3 relative z-[60]" key="results" exit={{ opacity: 0, transition: scaleTransition({ duration: 0.5 }) }}>
                                {searchResults.map((artist: any, i: number) => {
                                    const isSelected = selectedArtist === artist.id;
                                    const isFocused = focusedResultIndex === i;
                                    return (
                                        <motion.div key={artist.id} layout initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100, y: 0, filter: "blur(10px)" }} animate={isExitingSearch ? { opacity: 0, x: i % 2 === 0 ? -100 : 100, scale: 0.8, filter: "blur(20px)" } : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.9, transition: scaleTransition({ duration: 0.2 }) }} transition={isExitingSearch ? scaleTransition({ duration: 0.5, ease: "anticipate", delay: i * 0.03 }) : scaleTransition({ type: "spring", stiffness: 180, damping: 18, delay: i * 0.04 })} onClick={() => handleResultClick(artist.id)} onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setFocusedResultIndex(i)} className={`w-full p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors relative z-[60] ${isSelected ? "bg-datavibe-primary/10 border-datavibe-primary ring-1 ring-datavibe-primary/50" : isFocused ? "bg-accent border-accent-foreground/30" : "bg-card border-border hover:bg-accent hover:border-accent-foreground/30"}`}>
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0"><span className="text-sm font-bold text-foreground">{artist.initial}</span></div><div className="flex-1 min-w-0 text-left"><div className="text-sm font-semibold text-foreground truncate" translate="no">{artist.name}</div><div className="text-xs text-muted-foreground truncate">{artist.listeners} • {artist.genre}</div></div>
                                            {isSelected && (<motion.div className="w-12 h-12 rounded-full bg-gradient-to-r from-datavibe-primary to-datavibe-purple text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--effect-glow-primary-strong)] scale-110" style={{ backgroundSize: "200% 200%" }} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><motion.svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}><path d="M3 12H21M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></motion.svg></motion.div>)}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                        {step === 'sync' && (
                            <div className="flex flex-col items-center w-full absolute top-8">
                                <motion.h2 className="text-xl font-bold text-foreground mb-2" initial={{ y: 50, opacity: 0, filter: "blur(5px)" }} animate={isSyncCompleting ? { x: "-100vw", opacity: 0 } : { y: 0, opacity: 1, filter: "blur(0px)" }} transition={scaleTransition({ duration: 0.8, ease: "backIn", delay: isSyncCompleting ? 0 : 0.8 })}>{t("onboarding.sync_title")}</motion.h2>
                                <motion.p className="text-muted-foreground text-xs mb-8" initial={{ y: 50, opacity: 0 }} animate={isSyncCompleting ? { x: "100vw", opacity: 0 } : { y: 0, opacity: 1 }} transition={scaleTransition({ duration: 0.8, ease: "backIn", delay: isSyncCompleting ? 0.15 : 0.9 })}>{t("onboarding.sync_subtitle")}</motion.p>
                                <div className="flex flex-col gap-3 w-full max-w-[200px]">{[ { label: t("onboarding.sync_profile"), done: syncSteps.profile }, { label: t("onboarding.sync_stats"), done: syncSteps.stats }, { label: t("onboarding.sync_opps"), done: syncSteps.opportunities } ].map((item, idx) => ( <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={isSyncCompleting ? { x: idx % 2 === 0 ? "-150vw" : "150vw", opacity: 0 } : { opacity: 1, y: 0 }} transition={scaleTransition({ duration: 0.6, ease: "backIn", delay: isSyncCompleting ? 0.3 + (idx * 0.1) : 1.0 + (idx * 0.1) })}><StepItem label={item.label} isCompleted={item.done} /></motion.div> ))}</div>
                            </div>
                        )}
                    </AnimatePresence>
                 </div>
            </motion.div>
        </motion.div>
    );
};

const usePlatformController = () => {
    // ── Language: bridged to LanguageProvider context ──
    // The LanguageProvider uses 'fr'/'en', we expose 'FR'/'EN' for display
    const { language: ctxLang, setLanguage: ctxSetLanguage } = useLanguage();
    const { t: globalT } = useTranslation();
    const language = (ctxLang === 'en' ? 'EN' : 'FR') as 'FR' | 'EN';
    const setLanguage = (l: 'FR' | 'EN') => ctxSetLanguage(l === 'EN' ? 'en' : 'fr');
    const toggleLanguage = () => ctxSetLanguage(ctxLang === 'fr' ? 'en' : 'fr');
    
    // Menu & Speed Spatial Flow
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [spatialFlowSpeed, setSpatialFlowSpeedState] = useState<SpeedPreset>('normal');
    // speedVersion forces re-render of all animation-consuming children when speed changes
    const [, setSpeedVersion] = useState(0);
    const setSpatialFlowSpeed = (preset: SpeedPreset) => { 
        setSpatialFlowSpeedState(preset); 
        updateSpatialFlowSpeed(preset);
        setSpeedVersion(v => v + 1); // force re-render so inline variants pick up new speed
    };
    
    // ── Onboarding-specific translations (inline, for onboarding flow only) ──
    // All translations now centralized in translations.ts — t() is just globalT()
    const t = globalT;

    // --- PERSISTENCE HELPERS (getSavedState / saveState) ---
    const getSavedState = <T,>(key: string, fallback: T): T => {
        try {
            const saved = localStorage.getItem(`datavibe_${key}`);
            // Check if saved value is valid JSON, otherwise return it as string or fallback
            if (!saved) return fallback;
            try { return JSON.parse(saved); } catch { return saved as unknown as T; }
        } catch (e) { return fallback; }
    };
    const saveState = (key: string, value: any) => {
        try { localStorage.setItem(`datavibe_${key}`, JSON.stringify(value)); } catch (e) {}
    };

    // --- Restore cached state for step persistence ---
    const cachedArtist = getSavedState<string | null>("artist", null);
    const cachedLoggedIn = getSavedState<boolean>("isLoggedIn", false);
    const shouldStartAtDashboard = !!(cachedLoggedIn || cachedArtist);

    const [step, setStep] = useState<"welcome" | "search" | "sync" | "dashboard">(shouldStartAtDashboard ? "dashboard" : "welcome");
    const [isCarouselExiting, setIsCarouselExiting] = useState(false);
    const [socialsConnected, setSocialsConnected] = useState(MOCK_SOCIALS_CONNECTED_TO_SPOTIFY);
    
    // Persist Step
    useEffect(() => { saveState("step", step); if (step !== 'welcome') setIsCarouselExiting(false); }, [step]);

    const [searchQuery, setSearchQuery] = useState(shouldStartAtDashboard ? getSavedState<string>("searchQuery", "") : "");
    useEffect(() => { saveState("searchQuery", searchQuery); }, [searchQuery]);
    const skipInitialSearchRef = useRef(shouldStartAtDashboard);

    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<Artist[]>(shouldStartAtDashboard ? getSavedState<Artist[]>("searchResults", []) : []);
    useEffect(() => { saveState("searchResults", searchResults); }, [searchResults]);

    const [selectedArtist, setSelectedArtist] = useState<string | null>(shouldStartAtDashboard ? cachedArtist : null);
    
    // Persist Artist
    useEffect(() => { saveState("artist", selectedArtist); }, [selectedArtist]);

    const [isExitingSearch, setIsExitingSearch] = useState(false); 
    const [syncProgress, setSyncProgress] = useState(0);
    const [isSyncCompleting, setIsSyncCompleting] = useState(false);
    const [syncSteps, setSyncSteps] = useState({ profile: false, stats: false, opportunities: false });
    const [isArrivingFromDashboard, setIsArrivingFromDashboard] = useState(false);
    const [isMorphingToSearch, setIsMorphingToSearch] = useState(false);
    const [focusedResultIndex, setFocusedResultIndex] = useState<number | null>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const [isFullDashboard, setIsFullDashboard] = useState(false);
    const [hasEntered, setHasEntered] = useState(true);
    const [isDropWaterActive, setIsDropWaterActive] = useState(false);
    const [isAuthFocused, setIsAuthFocused] = useState(false);
    const [isBilanView, setIsBilanView] = useState(false);
    const [overlayPage, setOverlayPage] = useState<'bilan' | 'niveau' | 'connexions' | 'offre' | 'legal' | 'apropos'>('bilan'); // Which page is shown in the overlay
    const overlaySwapRef = useRef(false); // True during page swap (Bilan↔Niveau), controls spatial flow direction
    const bilanFromFullRef = useRef(false); // Track if bilan was entered from full dashboard (for conditional tabs exit)
    const bilanActiveTabRef = useRef('streaming'); // Bilan remembers its last active tab
    const standardActiveTabRef = useRef('streaming'); // Standard dashboard remembers its last active tab
    const [bilanPeriod, setBilanPeriod] = useState<'semaine' | 'mois' | 'trimestre'>('mois'); // Bilan period selector

    // Clear overlaySwapRef AFTER AnimatePresence mode="wait" exit→enter cycle completes (~250ms exit + ~400ms enter)
    useEffect(() => {
      if (overlaySwapRef.current) {
        const t = setTimeout(() => { overlaySwapRef.current = false; }, 800);
        return () => clearTimeout(t);
      }
    }, [overlayPage]);

    // Login state machine
    const [isLoggedIn, setIsLoggedIn] = useState(shouldStartAtDashboard ? cachedLoggedIn : false);
    useEffect(() => { saveState("isLoggedIn", isLoggedIn); }, [isLoggedIn]);
    const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
    const [displayName, setDisplayName] = useState(shouldStartAtDashboard ? getSavedState<string>("displayName", "") : "");
    useEffect(() => { saveState("displayName", displayName); }, [displayName]);

    // Debug Trigger for Drop Water Mitose (Disabled for Click Trigger)
    /*
    useEffect(() => {
        if (step === 'dashboard' && hasEntered) {
             const timer = setTimeout(() => setIsDropWaterActive(true), 2000);
             return () => clearTimeout(timer);
        }
    }, [step, hasEntered]);
    */

    useEffect(() => {
        if (step === 'dashboard' && !hasEntered) {
            setTimeout(() => setHasEntered(true), 1200);
        }
    }, [step, hasEntered]);

    useEffect(() => {
        if (isArrivingFromDashboard) {
            const timer = setTimeout(() => setIsArrivingFromDashboard(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isArrivingFromDashboard]);

    useEffect(() => {
        if (isArrivingFromDashboard && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isArrivingFromDashboard]);
    
    useEffect(() => {
        if (step === 'sync') {
            const timers = [
                setTimeout(() => { setSyncProgress(33); setSyncSteps(s => ({ ...s, profile: true })) }, 800),
                setTimeout(() => { setSyncProgress(66); setSyncSteps(s => ({ ...s, stats: true })) }, 2000),
                setTimeout(() => { setSyncProgress(100); setSyncSteps(s => ({ ...s, opportunities: true })) }, 3200),
                setTimeout(() => { setIsSyncCompleting(true); }, 3800),
                setTimeout(() => { setStep("dashboard"); }, 4500)
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [step]);

    const handleStartSync = () => { 
        if (inputRef.current) inputRef.current.blur();
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
        setIsExitingSearch(true); 
        setTimeout(() => { setStep('sync'); setIsExitingSearch(false); }, 1500); 
    };
    const handleSpotifyLogin = () => window.location.href = "https://accounts.spotify.com/login";

    useEffect(() => {
      if (step !== 'search' || isExitingSearch || searchResults.length === 0) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") { e.preventDefault(); setFocusedResultIndex(prev => prev === null ? 0 : Math.min(prev + 1, searchResults.length - 1)); } 
        else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedResultIndex(prev => prev === null ? searchResults.length - 1 : Math.max(prev - 1, 0)); } 
        else if (e.key === "Enter") { 
            e.preventDefault(); 
            if (focusedResultIndex !== null && !selectedArtist) setSelectedArtist(searchResults[focusedResultIndex].id); 
            else if (selectedArtist) handleStartSync();
        }
      };
      window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown);
    }, [step, isExitingSearch, searchResults, focusedResultIndex, selectedArtist]);

    useEffect(() => setFocusedResultIndex(null), [searchResults]);

    const [activeTab, setActiveTab] = useState("streaming");
    const [contentTab, setContentTab] = useState("streaming");
    
    // Persist Tabs
    useEffect(() => { saveState("activeTab", activeTab); }, [activeTab]);
    useEffect(() => { saveState("contentTab", contentTab); }, [contentTab]);

    const [subTab, setSubTab] = useState("dashboard");
    const [isReturning, setIsReturning] = useState(false);
    const [reflexDividedStates, setReflexDividedStates] = useState<Record<string, boolean>>({
        streaming: false,
        social: false,
        radio: false
    });
    const opportunityData = useMemo(() => generateOpportunityData(globalT, ctxLang), [globalT, ctxLang]);

    const prevTabRef = useRef("streaming");
    const tabOrder = ["streaming", "social", "radio"];
    const getTabIndex = (t: string) => tabOrder.indexOf(t);
    const prevFullDashboardRef = useRef(false);

    const prevSubTabRef = useRef("dashboard");
    const subTabOrder = {
        streaming: ["dashboard", "performance", "playlists"],
        social: ["dashboard", "subscribers", "demographics"],
        radio: ["dashboard", "countries", "strategy"]
    };
    const getSubTabIndex = (t: string, active: string) => subTabOrder[active as keyof typeof subTabOrder]?.indexOf(t) ?? 0;
    const subTabDirectionRef = useRef(0);
    const currentSubTabIndex = getSubTabIndex(subTab, activeTab);
    const prevSubTabIndex = getSubTabIndex(prevSubTabRef.current, activeTab);
    
    if (subTab !== prevSubTabRef.current) {
        subTabDirectionRef.current = currentSubTabIndex > prevSubTabIndex ? 1 : -1;
    }
    const subTabDirection = subTabDirectionRef.current;
    useEffect(() => { prevSubTabRef.current = subTab; }, [subTab]);

    if (step !== 'dashboard') {
        if (activeTab !== 'streaming') setActiveTab('streaming');
        if (contentTab !== 'streaming') setContentTab('streaming');
        if (subTab !== 'dashboard') setSubTab('dashboard');
    }

    useEffect(() => { 
      prevTabRef.current = contentTab; 
      prevFullDashboardRef.current = isFullDashboard;
    }, [contentTab, isFullDashboard]);

    useEffect(() => { 
      if (step === 'dashboard') { 
          // sw: Removed automatic tab reset to allow persistence logic to work
          setIsExitingSearch(false);
          setIsMorphingToSearch(false);
          setIsInputFocused(false);
      } 
    }, [step]);

    useEffect(() => {
      // Skip search effect on initial mount when restoring cached dashboard state
      if (skipInitialSearchRef.current) { skipInitialSearchRef.current = false; return; }
      if (!searchQuery.trim()) { setSearchResults([]); setIsSearching(false); setSelectedArtist(null); return; }
      setIsSearching(true); setSelectedArtist(null); 
      const timer = setTimeout(() => {
          const query = searchQuery.trim(); const initial = query.charAt(0).toUpperCase();
          setSearchResults([ { id: "1", name: query, listeners: globalT("search.listenersPerMonth").replace("{count}", "113.9K"), genre: globalT("search.mainArtist"), initial: initial }, { id: "2", name: `${query} Official`, listeners: globalT("search.listenersPerMonth").replace("{count}", "12.4K"), genre: globalT("search.secondaryAccount"), initial: initial } ]);
          setIsSearching(false);
      }, 600); return () => clearTimeout(timer);
    }, [searchQuery]);

    const direction = (isArrivingFromDashboard || !hasEntered || step !== 'dashboard') ? 0 : 
                      (isReturning ? -1 : 
                      (isFullDashboard !== prevFullDashboardRef.current ? (isFullDashboard ? 1 : -1) : 
                      (getTabIndex(contentTab) > getTabIndex(prevTabRef.current) ? 1 : -1)));

    return {
        language, setLanguage, toggleLanguage, t,
        step, setStep,
        searchQuery, setSearchQuery,
        isSearching, setIsSearching,
        searchResults, setSearchResults,
        selectedArtist, setSelectedArtist,
        isExitingSearch, setIsExitingSearch,
        syncProgress, setSyncProgress,
        isSyncCompleting, setIsSyncCompleting,
        syncSteps, setSyncSteps,
        isArrivingFromDashboard, setIsArrivingFromDashboard,
        isMorphingToSearch, setIsMorphingToSearch,
        focusedResultIndex, setFocusedResultIndex,
        isInputFocused, setIsInputFocused,
        inputRef,
        isFullDashboard, setIsFullDashboard,
        hasEntered, setHasEntered,
        activeTab, setActiveTab,
        contentTab, setContentTab,
        subTab, setSubTab,
        isReturning, setIsReturning,
        reflexDividedStates, setReflexDividedStates,
        opportunityData,
        prevTabRef, prevFullDashboardRef,
        subTabDirection,
        direction,
        handleStartSync, handleSpotifyLogin,
        isDropWaterActive, setIsDropWaterActive,
        isAuthFocused, setIsAuthFocused,
        isBilanView, setIsBilanView,
        overlayPage, setOverlayPage, overlaySwapRef,
        bilanFromFullRef,
        bilanActiveTabRef, standardActiveTabRef,
        bilanPeriod, setBilanPeriod,
        isLoggedIn, setIsLoggedIn,
        isUserPanelOpen, setIsUserPanelOpen,
        displayName, setDisplayName,
        isMenuOpen, setIsMenuOpen,
        spatialFlowSpeed, setSpatialFlowSpeed,
        isCarouselExiting, setIsCarouselExiting,
        socialsConnected, setSocialsConnected
    };
};

type PlatformState = ReturnType<typeof usePlatformController>;

function MobileExperience(props: PlatformState) {
    const {
        isDropWaterActive, setIsDropWaterActive,
        language, setLanguage, toggleLanguage, t,
        step, setStep,
        searchQuery, setSearchQuery,
        isSearching, setIsSearching,
        searchResults, setSearchResults,
        selectedArtist, setSelectedArtist,
        isExitingSearch, setIsExitingSearch,
        syncProgress, setSyncProgress,
        isSyncCompleting, setIsSyncCompleting,
        syncSteps, setSyncSteps,
        isArrivingFromDashboard, setIsArrivingFromDashboard,
        isMorphingToSearch, setIsMorphingToSearch,
        focusedResultIndex, setFocusedResultIndex,
        isInputFocused, setIsInputFocused,
        inputRef,
        isFullDashboard, setIsFullDashboard,
        hasEntered, setHasEntered,
        activeTab, setActiveTab,
        contentTab, setContentTab,
        subTab, setSubTab,
        isReturning, setIsReturning,
        reflexDividedStates, setReflexDividedStates,
        opportunityData,
        prevTabRef, prevFullDashboardRef,
        subTabDirection,
        direction,
        handleStartSync, handleSpotifyLogin,
        isAuthFocused, setIsAuthFocused,
        isBilanView, setIsBilanView,
        overlayPage, setOverlayPage, overlaySwapRef,
        bilanFromFullRef,
        bilanActiveTabRef, standardActiveTabRef,
        bilanPeriod, setBilanPeriod,
        isLoggedIn, setIsLoggedIn,
        isUserPanelOpen, setIsUserPanelOpen,
        displayName, setDisplayName,
        isMenuOpen, setIsMenuOpen,
        spatialFlowSpeed, setSpatialFlowSpeed,
        isCarouselExiting, setIsCarouselExiting,
        socialsConnected, setSocialsConnected
    } = props;

  // --- MITOSIS & AUTH LOGIC (Mobile) ---
  const [mitosisStage, setMitosisStage] = useState<'idle' | 'dropping' | 'expanding'>('idle');
  
  // Dynamic Coordinates for Drop Animation
  const avatarRef = useRef<HTMLButtonElement>(null);
  const socialTabRef = useRef<HTMLDivElement>(null);
  const [mitosisCoords, setMitosisCoords] = useState<{ startY: number, endY: number } | null>(null);
  // Store avatar rect to avoid measuring during animation movement
  const [storedAvatarRect, setStoredAvatarRect] = useState<DOMRect | null>(null);

  useEffect(() => {
      const updateAvatarRect = () => {
          if (avatarRef.current) {
              setStoredAvatarRect(avatarRef.current.getBoundingClientRect());
          }
      };
      
      // Initial measure
      updateAvatarRect();
      
      window.addEventListener('resize', updateAvatarRect);
      return () => window.removeEventListener('resize', updateAvatarRect);
  }, []);

  useEffect(() => {
    if (isDropWaterActive) {
        // Measure coordinates immediately when activation starts
        if (storedAvatarRect && socialTabRef.current) {
            const socialRect = socialTabRef.current.getBoundingClientRect();
            setMitosisCoords({
                startY: storedAvatarRect.top + 84 + storedAvatarRect.height / 2, // Add 84px drop offset
                endY: socialRect.top
            });
        }

        // Step 1: Wait for avatar to reach center (approx 0.6s)
        const dropTimer = setTimeout(() => {
            setMitosisStage('dropping');
        }, 600);
        
        // Step 2: Drop animation finishes, expand (approx 0.5s later)
        const expandTimer = setTimeout(() => {
            setMitosisStage('expanding');
        }, 1100);
        
        return () => { clearTimeout(dropTimer); clearTimeout(expandTimer); };
    } else {
        setMitosisStage('idle');
    }
  }, [isDropWaterActive]);

  const navigate = useNavigate();
  const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { return scrollY.on("change", (latest) => setIsScrolled(latest > 10)); }, [scrollY]);

  const [showStickyNav, setShowStickyNav] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showBilanStickyNav, setShowBilanStickyNav] = useState(false);
  const bilanPeriodTabsRef = useRef<HTMLDivElement>(null);

  // --- Bilan Inter-Tab Spatial Flow Direction Tracking (Mobile) ---
  const BILAN_TAB_INDEX_M: Record<string, number> = { streaming: 0, social: 1, radio: 2 };
  const bilanTabDirRef = useRef(0);
  const prevBilanTabRef = useRef(activeTab);
  if (isBilanView && activeTab !== prevBilanTabRef.current) {
      bilanTabDirRef.current = (BILAN_TAB_INDEX_M[activeTab] ?? 0) > (BILAN_TAB_INDEX_M[prevBilanTabRef.current] ?? 0) ? 1 : -1;
  }
  useEffect(() => { if (isBilanView) prevBilanTabRef.current = activeTab; }, [activeTab, isBilanView]);
  const bilanTabDirection = bilanTabDirRef.current;

  useEffect(() => {
    // Reset when tabs wrapper is unmounted (Connexions page removes TAF tabs from DOM)
    if (!tabsRef.current) {
      setShowStickyNav(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // TAF Protocol: Soul release as soon as the body touches the header zone (64px)
        // threshold: 0.1 means it triggers as soon as element is mostly hidden
        setShowStickyNav(!entry.isIntersecting);
      },
      { 
        threshold: 0.1, 
        rootMargin: "-64px 0px 1000% 0px" 
      }
    );

    observer.observe(tabsRef.current);

    return () => {
      if (tabsRef.current) observer.unobserve(tabsRef.current);
    };
  }, [step, isBilanView, overlayPage]); // overlayPage: re-run when tabs unmount/remount between Connexions ↔ Bilan/Niveau

  // Bilan Period Tabs IntersectionObserver — TAF for Semaine/Mois/Trimestre
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBilanStickyNav(!entry.isIntersecting);
      },
      { 
        threshold: 0.1, 
        rootMargin: "-64px 0px 1000% 0px" 
      }
    );

    if (bilanPeriodTabsRef.current) {
      observer.observe(bilanPeriodTabsRef.current);
    }

    return () => {
      if (bilanPeriodTabsRef.current) observer.unobserve(bilanPeriodTabsRef.current);
    };
  }, [step, isBilanView]);

  useEffect(() => {
    if (step === 'dashboard') {
        // One-Step Feel: Instant Scroll to Top on Tab Change
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) scrollContainer.scrollTop = 0;
    }
  }, [activeTab, contentTab, step]);

  const handleSwipe = (dir: number) => {
    if (step !== 'dashboard') return;

    // 1. Logic for Full Dashboard (Sub-Tabs)
    if (isFullDashboard) {
        let subTabOrder: string[] = [];
        
        // Define sub-tab order based on active parent tab
        if (activeTab === 'social') {
            subTabOrder = ['dashboard', 'subscribers', 'demographics'];
        } else if (activeTab === 'radio') {
            subTabOrder = ['dashboard', 'countries', 'strategy'];
        } else {
            // Streaming (default)
            subTabOrder = ['dashboard', 'performance', 'playlists'];
        }

        const currentIndex = subTabOrder.indexOf(subTab);
        const safeIndex = currentIndex === -1 ? 0 : currentIndex;
        const newIndex = safeIndex + dir;
        
        if (newIndex >= 0 && newIndex < subTabOrder.length) {
            setSubTab(subTabOrder[newIndex]);
        }
    } 
    // 2. Logic for Standard View (Main Tabs)
    else {
        const tabOrder = ['streaming', 'social', 'radio'];
        const currentIndex = tabOrder.indexOf(contentTab);
        const newIndex = currentIndex + dir;
        
        if (newIndex >= 0 && newIndex < tabOrder.length) {
            const newTabId = tabOrder[newIndex];
            if (isBilanView) { bilanActiveTabRef.current = newTabId; } else { standardActiveTabRef.current = newTabId; }
            setActiveTab(newTabId);
            setContentTab(newTabId);
            setSubTab("dashboard");
        }
    }
  };
  
  const letterVariants = { hidden: { opacity: 0, y: -20, rotateX: 90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: scaleTransition({ duration: 0.4 }) } };
  const monthKeys = ["month.jan","month.feb","month.mar","month.apr","month.may","month.jun","month.jul","month.aug","month.sep","month.oct","month.nov","month.dec"];
  const getDateRange = () => { const today = new Date(); const future = new Date(today); future.setDate(today.getDate() + 28); return `${today.getDate()} ${t(monthKeys[today.getMonth()])} - ${future.getDate()} ${t(monthKeys[future.getMonth()])} ${future.getFullYear()}`; };

  const mobileStandardVariants = {
      hidden: { 
          x: (isArrivingFromDashboard || !hasEntered) ? 0 : "100%", 
          y: (isArrivingFromDashboard || !hasEntered) ? 120 : 0, 
          opacity: 0, scale: 0.9, filter: "blur(15px)", zIndex: 0, 
          transition: scaleTransition({ ...MOBILE_SMOOTH_FLOW_RAW, duration: 0.6 }) 
      },
      visible: { x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)", zIndex: 1, transition: getMobileSmoothFlow() },
      exit: { x: "100%", opacity: 0, filter: "blur(10px)" }
  };



    const [isMerging, setIsMerging] = useState(false);
    const [isClosingAuth, setIsClosingAuth] = useState(false); // Close sequence state machine

    // Auth view state machine (sign-in ↔ forgot-password ↔ signup)
    const [authView, setAuthView] = useState<'signin' | 'forgot' | 'signup'>('signin');
    const [isViewSwitching, setIsViewSwitching] = useState(false);
    const [targetCardHeight, setTargetCardHeight] = useState(SIGNIN_CARD_HEIGHT);
    const [isHeightAnimating, setIsHeightAnimating] = useState(false);

    // Hook simple pour détecter le mobile (pour l'animation différenciée du header)
    const [isMobile, setIsMobile] = useState(false);
    
    // State for animation completion (Clip Content Logic)
    const [isMobileAnimationComplete, setIsMobileAnimationComplete] = useState(false);
    const [mobileViewportHeight, setMobileViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);
    const mobileAvatarWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setMobileViewportHeight(window.innerHeight);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll overlay only when viewport is physically too small for the card
    const mobileCardTop = mitosisCoords ? mitosisCoords.endY : 152;
    const needsMobileScroll = mobileViewportHeight < mobileCardTop + targetCardHeight + 32;
    const mobileScrollActive = isMobileAnimationComplete && !isClosingAuth && needsMobileScroll;

    // Reset avatar position when scroll deactivates
    useEffect(() => {
        if (!mobileScrollActive && mobileAvatarWrapperRef.current) {
            mobileAvatarWrapperRef.current.style.top = '';
        }
    }, [mobileScrollActive]);

    const executeTransitionToSearch = () => {
        flushSync(() => {
            setIsArrivingFromDashboard(true);
            setIsInputFocused(true); 
            setIsMorphingToSearch(true);
        });
        setTimeout(() => {
            setStep('search');
            setHasEntered(false); // Reset entry state
            setSearchQuery("");
            setSearchResults([]);
            setSelectedArtist(null);
            setIsSearching(false);
            setSyncProgress(0);
            setSyncSteps({ profile: false, stats: false, opportunities: false });
            setIsSyncCompleting(false);
            setIsExitingSearch(false);
            // Reset Drop Water state for next time
            setIsDropWaterActive(false); 
            setIsMerging(false);
            setTimeout(() => { inputRef.current?.focus(); }, 100);
        }, 300);
    };

    const handleTransitionToSearch = () => {
        if (isFullDashboard) return; 
        const sc = document.getElementById('main-scroll-container');
        const scrollTop = sc ? sc.scrollTop : window.scrollY;
        if (scrollTop > 5) {
            if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const safetyTimer = setTimeout(() => { executeTransitionToSearch(); }, 600);
            const waitForTop = () => {
                const cur = sc ? sc.scrollTop : window.scrollY;
                if (cur <= 5) {
                    clearTimeout(safetyTimer);
                    executeTransitionToSearch();
                } else {
                    requestAnimationFrame(waitForTop);
                }
            };
            requestAnimationFrame(waitForTop);
        } else {
            executeTransitionToSearch();
        }
    };

    // Logo Click → Reset to Streaming dashboard top
    const handleLogoClick = () => {
        if (step !== 'dashboard') return;
        // Close any overlay without flash
        if (isBilanView) setIsBilanView(false);
        // Reset to Streaming tab
        setActiveTab('streaming');
        setContentTab('streaming');
        standardActiveTabRef.current = 'streaming';
        setSubTab('dashboard');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const sc = document.getElementById('main-scroll-container');
        if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCloseAuth = () => {
        if (isClosingAuth) return; // Prevent double-trigger
        // Phases simultanées (même render batch React 18) :
        // - isClosingAuth=true  → enfants démarrent leur sortie latérale
        // - isDropWaterActive=false → conteneur démarre son exit AnimatePresence
        setIsClosingAuth(true);
        setIsDropWaterActive(false);
        setIsAuthFocused(false);
        // Cleanup après la fin de l'animation complète
        setTimeout(() => {
            setIsClosingAuth(false);
            setIsMerging(false);
            setIsMobileAnimationComplete(false);
            // Réinitialise la machine d'état de la vue auth
            setAuthView('signin');
            setIsViewSwitching(false);
            setTargetCardHeight(SIGNIN_CARD_HEIGHT);
            setIsHeightAnimating(false);
        }, CONTENT_CLOSE_MS() + BUFFER_MS());
    };

    // --- LOGIN SUCCESS HANDLER (Mobile) ---
    const handleLoginSuccess = (firstName?: string) => {
        if (isClosingAuth) return;
        // Set displayName: signup firstName > existing displayName > artist name
        if (firstName) {
            setDisplayName(firstName);
        } else if (!displayName) {
            setDisplayName(searchResults.find(a => a.id === selectedArtist)?.name || "");
        }
        setIsLoggedIn(true);
        setIsClosingAuth(true);
        setIsDropWaterActive(false);
        setIsAuthFocused(false);
        setTimeout(() => {
            setIsClosingAuth(false);
            setIsMerging(false);
            setIsMobileAnimationComplete(false);
            setAuthView('signin');
            setIsViewSwitching(false);
            setTargetCardHeight(SIGNIN_CARD_HEIGHT);
            setIsHeightAnimating(false);
        }, CONTENT_CLOSE_MS() + BUFFER_MS());
    };

    // --- SCROLL BLOCK when UserPanel is open (Mobile) ---
    useEffect(() => {
        if (isUserPanelOpen && scrollRef.current) {
            scrollRef.current.style.overflow = 'hidden';
        } else if (scrollRef.current) {
            scrollRef.current.style.overflow = '';
        }
    }, [isUserPanelOpen]);

    // --- LOGOUT HANDLER (Mobile) ---
    const handleLogout = () => {
        setIsMenuOpen(false);
        setIsUserPanelOpen(false);
        setTimeout(() => {
            setDisplayName("");
            setIsLoggedIn(false);
        }, getFlowDuration(0.5) * 1000);
    };

    // --- Unified burger/cross position calculation (Mobile) ---
    const _sw = typeof window !== 'undefined' ? window.innerWidth : 430;
    const _crossLeftPx = Math.min(_sw * 0.8 - 52, 268);
    const _wrapperBaseLeft = 16;
    const _wrapperLoginX = _sw - 68 - _wrapperBaseLeft;
    const _wrapperAbsoluteX = _wrapperBaseLeft + ((isDropWaterActive || isLoggedIn) ? _wrapperLoginX : 0);
    const _menuDelta = _crossLeftPx - _wrapperAbsoluteX;

    // --- HANDLERS VIEW-SWITCH (Mobile) ---

    const handleForgotPassword = () => {
        if (isViewSwitching || isClosingAuth) return;
        // Phase 1 : contenu Sign-in sort (isViewSwitching → isClosing=true dans GlassAuthCard)
        setIsViewSwitching(true);

        // Chevauchement des phases pour un mouvement continu :
        // Phase 2 démarre à 55% de la sortie contenu (la plupart des items ont déjà volé)
        const heightStart = CONTENT_CLOSE_MS() * 0.55;
        // Phase 3 démarre à 65% de l'animation de hauteur (hauteur presque atteinte)
        const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;

        setTimeout(() => {
            setIsHeightAnimating(true);
            setTargetCardHeight(FORGOT_CARD_HEIGHT);
        }, heightStart);

        setTimeout(() => {
            // Mutation temporaire des timings open pour entrée accélérée (grand→petit format)
            ANIMATION_CARTOGRAPHY.authContent.open.delay = FORGOT_OPEN_DELAY;
            ANIMATION_CARTOGRAPHY.authContent.open.duration = FORGOT_OPEN_DURATION;
            ANIMATION_CARTOGRAPHY.authContent.open.stagger = FORGOT_OPEN_STAGGER;
            setAuthView('forgot');
            setIsViewSwitching(false);
            setIsHeightAnimating(false);
            // Reset des timings originaux après que le render ait capté les valeurs rapides
            setTimeout(() => {
                ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
                ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
                ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
            }, CARTOGRAPHY_RESET_MS());
        }, contentSwitch);
    };

    const handleBackToSignIn = () => {
        if (isViewSwitching || isClosingAuth) return;
        // Phase 1 : contenu ForgotPassword sort
        setIsViewSwitching(true);

        // Chevauchement : hauteur démarre à 55% de la sortie contenu
        const heightStart = FORGOT_CLOSE_MS() * 0.55;
        // Nouveau contenu entre à 65% de l'animation de hauteur
        const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;

        setTimeout(() => {
            setIsHeightAnimating(true);
            setTargetCardHeight(SIGNIN_CARD_HEIGHT);
        }, heightStart);

        setTimeout(() => {
            // Mutation temporaire des timings open pour entrée accélérée (petit→grand format)
            ANIMATION_CARTOGRAPHY.authContent.open.delay = RETURN_OPEN_DELAY;
            ANIMATION_CARTOGRAPHY.authContent.open.duration = RETURN_OPEN_DURATION;
            ANIMATION_CARTOGRAPHY.authContent.open.stagger = RETURN_OPEN_STAGGER;
            setAuthView('signin');
            setIsViewSwitching(false);
            setIsHeightAnimating(false);
            // Reset des timings originaux après que le render ait capté les valeurs rapides
            setTimeout(() => {
                ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
                ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
                ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
            }, CARTOGRAPHY_RESET_MS());
        }, contentSwitch);
    };

    const handleSignUp = () => {
        if (isViewSwitching || isClosingAuth) return;
        setIsViewSwitching(true);
        const heightStart = CONTENT_CLOSE_MS() * 0.55;
        const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;
        setTimeout(() => {
            setIsHeightAnimating(true);
            setTargetCardHeight(SIGNUP_CARD_HEIGHT);
        }, heightStart);
        setTimeout(() => {
            ANIMATION_CARTOGRAPHY.authContent.open.delay = SIGNUP_OPEN_DELAY;
            ANIMATION_CARTOGRAPHY.authContent.open.duration = SIGNUP_OPEN_DURATION;
            ANIMATION_CARTOGRAPHY.authContent.open.stagger = SIGNUP_OPEN_STAGGER;
            setAuthView('signup');
            setIsViewSwitching(false);
            setIsHeightAnimating(false);
            setTimeout(() => {
                ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
                ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
                ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
            }, CARTOGRAPHY_RESET_MS());
        }, contentSwitch);
    };

    const handleBackFromSignUp = () => {
        if (isViewSwitching || isClosingAuth) return;
        setIsViewSwitching(true);
        const heightStart = SIGNUP_CLOSE_MS() * 0.55;
        const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;
        setTimeout(() => {
            setIsHeightAnimating(true);
            setTargetCardHeight(SIGNIN_CARD_HEIGHT);
        }, heightStart);
        setTimeout(() => {
            ANIMATION_CARTOGRAPHY.authContent.open.delay = RETURN_OPEN_DELAY;
            ANIMATION_CARTOGRAPHY.authContent.open.duration = RETURN_OPEN_DURATION;
            ANIMATION_CARTOGRAPHY.authContent.open.stagger = RETURN_OPEN_STAGGER;
            setAuthView('signin');
            setIsViewSwitching(false);
            setIsHeightAnimating(false);
            setTimeout(() => {
                ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
                ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
                ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
            }, CARTOGRAPHY_RESET_MS());
        }, contentSwitch);
    };

    useEffect(() => {
        if (isDropWaterActive) {
            // Force close the menu so it doesn't stay above the auth backdrop
            setIsMenuOpen(false);

            // Phase 1: Chute verticale (0s -> 1.5s)
            // Phase 2: Fusion horizontale (1.5s -> 3.0s)
            
            // On déclenche le merging state exactement à la fin de la chute
            const mergeTimer = setTimeout(() => {
                setIsMerging(true);
            }, 1500);
            
            return () => {
                clearTimeout(mergeTimer);
            };
        }
    }, [isDropWaterActive]);

  return (
    <motion.div id="main-scroll-container" ref={scrollRef}
        className={`flex flex-col w-full bg-background h-[100dvh] ${step === 'dashboard' ? 'overflow-y-scroll overflow-x-hidden no-scrollbar' : 'overflow-hidden'}`}>
       {/* Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-background">
          <motion.div className="absolute inset-0 w-full h-full" initial={{ opacity: step === 'dashboard' ? 1 : 0 }} animate={{ opacity: (step === 'dashboard' || isArrivingFromDashboard) ? 1 : 0 }} transition={scaleTransition({ duration: 1.2, ease: "easeInOut" })} style={{ backgroundImage: "linear-gradient(155deg, var(--app-background-gradient-start) 0%, var(--app-background-gradient-middle) 50%, var(--app-background-gradient-end) 100%)" }} />
          <motion.div className="absolute top-0 left-0 w-full h-full pointer-events-none" initial={{ opacity: step !== 'dashboard' ? 0.12 : 0 }} animate={{ opacity: (step === 'dashboard' || isArrivingFromDashboard) ? 0 : 0.12 }} transition={scaleTransition({ duration: 1.2, ease: "easeInOut" })} style={{ backgroundImage: "radial-gradient(ellipse 1300px 1100px at 50% -80px, var(--datavibe-primary) 10%, transparent 100%)" }} />
      </div>

      {/* Avatar (Outside Blurred Wrapper) */}
      {step === 'dashboard' && (
        <motion.div ref={mobileAvatarWrapperRef} className={`fixed top-2.5 right-4 ${isLoggedIn ? '' : 'perspective-[1000px]'} ${isMenuOpen ? 'z-[10]' : 'z-[55]'} ${isLoggedIn && !isDropWaterActive ? 'pointer-events-none' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1, x: (isLoggedIn && !isDropWaterActive) ? (isBilanView ? "110vw" : 0) : 0 }} transition={scaleTransition({ y: { duration: 0.7, ease: "circOut", delay: 0.4 }, opacity: { duration: 0.5, delay: 0.4 }, x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0 : 0.35 } })}>
            <motion.div
                layoutId={undefined} // [Mobile Fix] Disable layout to prevent conflict with manual x/y animation
                initial={{ opacity: 1, scale: 1, filter: "blur(0px)", x: 0, y: 0 }}
                animate={
                    isDropWaterActive 
                    ? { 
                        y: 84,
                        x: "calc(-50vw + 38px)", 
                        opacity: 1, 
                        scale: 1.2727, 
                        filter: "blur(0px)",
                        rotateY: 0
                    }
                    : isLoggedIn
                    ? {
                        y: 84,
                        x: "calc(-100vw + 82px)",
                        opacity: 1,
                        scale: 1.2727,
                        filter: "blur(0px)",
                        rotateY: 0
                    }
                    : (isArrivingFromDashboard ? { opacity: 0, scale: 0.5, filter: "blur(10px)", x: 0, y: 0, rotateY: 0 } : { opacity: 1, scale: 1, filter: "blur(0px)", x: 0, y: 0, rotateY: 0 })
                }
                transition={
                    isDropWaterActive
                    ? {
                        y: { duration: 0.15, ease: "circOut" },
                        x: { duration: 0.2, delay: 0.15, ease: "circOut" },
                        default: { duration: 0.35 }
                    }
                    : isLoggedIn
                    ? {
                        x: { duration: 0.5, ease: "circOut" },
                        opacity: { duration: 0.3 },
                        filter: { duration: 0.3 },
                        y: { duration: 0 },
                        scale: { duration: 0 },
                        default: { duration: 0.5 }
                    }
                    : {
                        x: { duration: 0.2, delay: 0.4, ease: "circIn" }, 
                        y: { duration: 0.15, delay: 0.6, ease: "circIn" }, 
                        scale: { duration: 0.15, delay: 0.6, ease: "circIn" },
                        default: { duration: 0.35 }
                    }
                }
                style={{ transformStyle: isLoggedIn ? undefined : "preserve-3d" }}
            >
                {isLoggedIn ? (
                    <div style={{ perspective: 1000 }}>
                        <motion.div style={{ transformStyle: "preserve-3d", position: "relative", width: 44, height: 44 }} animate={{ rotateY: isFullDashboard ? 180 : 0 }} transition={scaleTransition({ rotateY: { duration: 1.1, ease: "easeInOut" } })}>
                            <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer shadow-md border-2 border-datavibe-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.2)] pointer-events-auto" style={{ backfaceVisibility: "hidden" }} onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}>
                                <img src={PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 w-11 h-11 rounded-full flex items-center justify-center bg-dashboard-back-btn-bg cursor-pointer pointer-events-auto" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties} onClick={(e) => { e.stopPropagation(); setIsReturning(true); setTimeout(() => { setIsFullDashboard(false); }, 200); setTimeout(() => setIsReturning(false), 1400); }}>
                                <ChevronLeft size={24} strokeWidth={2} color="var(--stroke-0, white)" />
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <Button ref={avatarRef} onClick={() => !isMenuOpen && setIsDropWaterActive(true)} variant="secondary" size="icon" className={`rounded-full shadow-sm text-foreground hover:bg-secondary/80 w-11 h-11 p-0 transition-all duration-300 hover:shadow-[0_0_20px_var(--effect-glow-primary)] ${isMenuOpen ? 'pointer-events-none' : ''}`}>
                        <VisiomorphicHelpAvatar mode={isDropWaterActive ? "avatar" : "help"} duration={isDropWaterActive ? 1.5 : 0.6} />
                    </Button>
                )}
            </motion.div>
        </motion.div>
      )}

      {/* Unified Burger/Cross Mobile — OUTSIDE dashboard-ui stacking context for correct z-ordering */}
      {/* FIX: Drop z below backdrop when UserPanel is open OR DropWater auth is active */}
      {step === 'dashboard' && (() => { return (<motion.div className={`fixed top-3 left-4 ${(isUserPanelOpen || isDropWaterActive) ? 'z-[10]' : 'z-[72]'}`} initial={{ y: -200, opacity: 0 }} animate={isArrivingFromDashboard ? { y: -200, opacity: 0 } : { y: 0, opacity: 1, x: (isDropWaterActive || isLoggedIn) ? _wrapperLoginX : 0 }} transition={scaleTransition({ y: { duration: 0.8, ease: "circOut" }, opacity: { duration: 0.8, ease: "circOut" }, x: (isDropWaterActive || isLoggedIn) ? { duration: 0.8, ease: "easeInOut" } : { duration: 0.8, ease: "easeInOut", delay: 0.45 } })}><motion.button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground cursor-pointer" animate={{ x: isMenuOpen ? _menuDelta : 0 }} transition={scaleTransition({ x: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } })} onClick={() => setIsMenuOpen(!isMenuOpen)}><div className="flex flex-col items-start w-5 relative" style={{ height: 10 }}><motion.span className="h-[2px] bg-current rounded-full absolute left-0 origin-center" animate={isMenuOpen ? { rotate: 45, width: 20, top: 4 } : { rotate: 0, width: 20, top: 0 }} transition={scaleTransition({ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: isMenuOpen ? 0.1 : 0 })} /><motion.span className="h-[2px] bg-current rounded-full absolute left-0 origin-center" animate={isMenuOpen ? { rotate: -45, width: 20, top: 4 } : { rotate: 0, width: 12, top: 8 }} whileHover={!isMenuOpen ? { width: 20 } : undefined} transition={scaleTransition({ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: isMenuOpen ? 0.1 : 0 })} /></div></motion.button></motion.div>); })()}

      {/* SLIDE MENU (Mobile Dashboard) — OUTSIDE dashboard-ui stacking context for correct z-ordering */}
      {step === 'dashboard' && (
          <SlideMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onBilanClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'bilan') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('bilan'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('bilan'); setIsBilanView(true); }, 500); } }}
              onNiveauClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'niveau') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('niveau'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('niveau'); setIsBilanView(true); }, 500); } }}
              onConnexionsClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'connexions') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('connexions'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('connexions'); setIsBilanView(true); }, 500); } }}
              onOffreClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'offre') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('offre'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('offre'); setIsBilanView(true); }, 500); } }}
              onLegalClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'legal') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('legal'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('legal'); setIsBilanView(true); }, 500); } }}
              onAproposClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'apropos') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('apropos'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('apropos'); setIsBilanView(true); }, 500); } }}
              isMobile={true}
              isLoggedIn={isLoggedIn}
              language={language}
              toggleLanguage={toggleLanguage}
              spatialFlowSpeed={spatialFlowSpeed}
              onSpeedChange={setSpatialFlowSpeed}
          />
      )}

      {/* --- MITOSIS OVERLAY (Mobile) --- */}
      <AnimatePresence>
            {isDropWaterActive && (
                <div onScroll={(e) => { if (mobileAvatarWrapperRef.current) mobileAvatarWrapperRef.current.style.top = `calc(0.625rem - ${e.currentTarget.scrollTop}px)`; }} className={`fixed inset-0 z-40 ${mobileScrollActive ? 'overflow-y-auto' : 'overflow-hidden'} [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.4)_transparent]`}>
                    
                    {/* BACKDROP: sticky so it stays covering viewport during scroll */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseAuth}
                        className="sticky top-0 left-0 w-full h-screen -mb-[100vh] bg-black/20 backdrop-blur-[2px] cursor-pointer z-0"
                    />

                    {/* Scroll spacer — creates scroll area when card exceeds viewport */}
                    <div onClick={handleCloseAuth} className="relative w-full cursor-pointer" style={{ minHeight: mobileScrollActive ? `${mobileCardTop + targetCardHeight + 32}px` : '100vh' }}>
                    {/* The Seed -> Card Morphing Container (Mobile) */}
                    <motion.div
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        key="mobile-card-mitosis-v5"
                        initial={{ 
                            top: 28, 
                            left: "50%", 
                            x: "-50%", 
                            width: "0px", 
                            maxHeight: 0, 
                            borderRadius: "22px", 
                            opacity: 0
                        }}
                        animate={isMobileAnimationComplete ? {
                            // POST-OUVERTURE : maxHeight suit targetCardHeight (signup = 850, signin = 700, forgot = 420)
                            top: mitosisCoords ? mitosisCoords.endY : 152,
                            width: "calc(100% - 32px)",
                            maxHeight: targetCardHeight,
                            borderRadius: "24px",
                            opacity: 1,
                            transition: {
                                duration: 0,
                                maxHeight: { duration: HEIGHT_ANIM_DURATION, ease: [0.4, 0, 0.2, 1] }
                            }
                        } : {
                            // OUVERTURE INITIALE (keyframes Mitosis v5) :
                            // Phase 1 (0→25%): CHUTE — Cercle naît et descend
                            // Phase 2 (25→50%): ÉLARGISSEMENT — Pilule (hauteur FIXE à 44px = pas d'ovale)
                            // Phase 3 (50→100%): DÉROULEMENT — Pilule se déroule en hauteur
                            top: mitosisCoords 
                                ? [mitosisCoords.startY, mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.endY] 
                                : [28, 152, 152, 152],
                            width: ["0px", "44px", "calc(100% - 32px)", "calc(100% - 32px)"],
                            maxHeight: [0, 44, 44, 700],
                            borderRadius: ["22px", "22px", "22px", "24px"],
                            opacity: [0, 1, 1, 1],
                            transition: scaleTransition({
                                delay: 0.35,
                                duration: 0.4,
                                times: [0, 0.25, 0.5, 1],
                                ease: ["easeInOut", "easeIn", "circOut"]
                            })
                        }}
                        onAnimationComplete={() => setIsMobileAnimationComplete(true)}
                        exit={{ 
                            // FERMETURE INVERSE EXACTE :
                            // Phase 1 (0→50%): REPLI — Hauteur se contracte (éléments déjà sortis)
                            // Phase 2 (50→75%): CONTRACTION — Largeur se contracte en cercle
                            // Phase 3 (75→100%): REMONTÉE — Cercle remonte vers l'avatar et disparaît
                            maxHeight: [targetCardHeight, 44, 44, 0],
                            width: ["calc(100% - 32px)", "calc(100% - 32px)", "44px", "0px"], 
                            borderRadius: ["24px", "22px", "22px", "22px"], // FIX: valeurs pixel (cercle = 22px = 44/2)
                            top: mitosisCoords 
                                ? [mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.startY] 
                                : [152, 152, 152, 28],
                            opacity: [1, 1, 1, 0],
                            
                            transition: scaleTransition({ 
                                duration: CONTENT_CLOSE_TIME,
                                ease: ["circIn", "easeOut", "easeInOut"],
                                times: [0, 0.5, 0.75, 1]
                            })
                        }}
                        className={`absolute pointer-events-auto bg-black/60 border border-white/10 backdrop-blur-md z-[60] ${(isMobileAnimationComplete && !isClosingAuth) ? "overflow-hidden" : "overflow-visible"}`}
                    >
                         {/* Close Button - Animated Pop-In/Pop-Out, disappears immediately on close */}
                         <motion.button 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={isClosingAuth 
                                ? { scale: 0, opacity: 0, transition: scaleTransition({ duration: 0.15, ease: "backIn" }) }
                                : { scale: 1, opacity: 1, transition: scaleTransition({ delay: 0.45, type: "spring", stiffness: 260, damping: 20 }) }
                            }
                            exit={{ 
                                scale: 0, 
                                opacity: 0,
                                transition: scaleTransition({ 
                                    duration: 0.2,
                                    ease: "backIn" 
                                })
                            }}
                            onClick={handleCloseAuth} 
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 hover:text-white text-white/70 rounded-full transition-colors cursor-pointer backdrop-blur-md group"
                         >
                            <X size={20} className="group-hover:scale-110 transition-transform duration-300" />
                         </motion.button>

                         {/* View wrapper — 3 phases séquentielles :
                              Phase 1 overflow:visible  → contenu sort latéralement (vols non clippés)
                              Phase 2 overflow:hidden   → hauteur contracte/expande (contenu hors-écran → safe)
                              Phase 3 overflow:visible  → nouveau contenu entre latéralement (vols non clippés) */}
                         <motion.div
                             initial={false}
                             animate={{ maxHeight: targetCardHeight }}
                             transition={scaleTransition({ duration: HEIGHT_ANIM_DURATION_RAW, ease: [0.4, 0, 0.2, 1] })}
                             style={{ overflow: isHeightAnimating ? 'hidden' : 'visible' }}
                             className="w-full"
                         >
                             {authView === 'signin' ? (
                                 <GlassAuthCard
                                     isVisible={true}
                                     isExpanded={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onForgotPassword={handleForgotPassword}
                                     onSignUp={handleSignUp}
                                     onLoginSuccess={handleLoginSuccess}
                                 />
                             ) : authView === 'forgot' ? (
                                 <ForgotPasswordCard
                                     isVisible={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onBack={handleBackToSignIn}
                                 />
                             ) : (
                                 <SignUpCard
                                     isVisible={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onBack={handleBackFromSignUp}
                                     onSignUpSuccess={handleLoginSuccess}
                                 />
                             )}
                         </motion.div>
                    </motion.div>
                    </div>
                </div>
            )}
      </AnimatePresence>

      <div className={`relative z-10 w-full h-full flex flex-col transition-[filter] duration-300 ${isAuthFocused ? "blur-md pointer-events-none select-none" : ""}`}>
        {step !== 'dashboard' && (
             <div className="w-full absolute top-0 z-50">
                 <motion.div 
                    className="w-full" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={(isArrivingFromDashboard || isInputFocused || isSyncCompleting || isExitingSearch) ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }} 
                    transition={scaleTransition({ duration: 0.6, ease: "circOut" })}
                >
                     <OnboardingHeader 
                        showBack={step === 'search'} 
                        onBack={() => setStep("welcome")} 
                        showLogo={false} 
                        className="mb-2" 
                        rightAction={(isArrivingFromDashboard || isInputFocused) ? <div className="w-20" /> : (
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground rounded-full" onClick={toggleLanguage}>
                                    <Globe className="w-4 h-4" />
                                </Button>
                                <span className="text-xs font-bold uppercase text-foreground w-5 text-center">{language}</span>
                                <div className="scale-90 mr-3"><ModeToggle /></div>
                            </div>
                        )}
                    />
                 </motion.div>
            </div>
        )}

        <div className="flex-1 w-full relative">
            <AnimatePresence mode="popLayout">
                {step === 'welcome' && (
                    <motion.div key="welcome-step" className="w-full mx-auto px-4 h-full flex flex-col items-center" exit={{ opacity: 1, transition: scaleTransition({ duration: 1.4 }) }}>
                        <div className="pt-[12vh] flex flex-col items-center gap-4 w-full max-w-sm px-2 shrink-0">
                            <motion.div 
                                key="logo" 
                                initial={{ y: -60, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                transition={scaleTransition({ duration: 1.8, ease: "easeOut", delay: 0.5 })} 
                                exit={{ y: -600, opacity: 0, transition: scaleTransition({ duration: 1.2, ease: "easeInOut" }) }}
                                className="notranslate"
                                translate="no"
                            >
                                <Logo variant="splash" />
                            </motion.div>
                            <motion.p key="tagline" className="text-center text-muted-foreground text-sm font-medium tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 2.0, ease: "easeOut", delay: 1.0 })} exit={{ y: -500, opacity: 0, transition: scaleTransition({ duration: 1.2, ease: "easeInOut", delay: 0.1 }) }}>{t("onboarding.welcome_tagline")}</motion.p>
                        </div>
                        {/* Cinematic carousel zone — fills space between tagline and button */}
                        <motion.div className="flex-1 w-full flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 0.8, delay: 2.5 })} exit={{ opacity: 0, transition: scaleTransition({ duration: 0.3 }) }}>
                            <WelcomeCarousel isExiting={isCarouselExiting} onExitComplete={() => setStep('search')} startDelay={3.0} />
                        </motion.div>
                    </motion.div>
                )}

                {(step === 'search' || step === 'sync') && (
                    <div className="w-full h-full">
                        <MobileSearchSync 
                            step={step} searchQuery={searchQuery} setSearchQuery={setSearchQuery} isSearching={isSearching} 
                            searchResults={searchResults} selectedArtist={selectedArtist} setSelectedArtist={setSelectedArtist}
                            isExitingSearch={isExitingSearch} syncProgress={syncProgress} syncSteps={syncSteps} 
                            isSyncCompleting={isSyncCompleting} isArrivingFromDashboard={isArrivingFromDashboard} setIsArrivingFromDashboard={setIsArrivingFromDashboard}
                            isMorphingToSearch={isMorphingToSearch} isInputFocused={isInputFocused} setIsInputFocused={setIsInputFocused} 
                            focusedResultIndex={focusedResultIndex} setFocusedResultIndex={setFocusedResultIndex} 
                            handleStartSync={handleStartSync} handleSpotifyLogin={handleSpotifyLogin} t={t}
                            inputRef={inputRef}
                        />
                    </div>
                )}

                {step === 'dashboard' && (
                    <motion.div key="dashboard-container" className="w-full min-h-screen relative">
                         <motion.div key="dashboard-ui" className="w-full min-h-screen flex flex-col relative" initial="hidden" animate="visible" exit="exit" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: scaleTransition({ duration: 1.0, when: "beforeChildren" }) }, exit: { opacity: 0, transition: scaleTransition({ duration: 0.5, delay: 0.6, when: "afterChildren" }) } }}>
                            <motion.header 
                                className="h-16 flex items-center justify-between px-4 bg-header-background border-b border-header-border backdrop-blur-md z-20 fixed top-0 left-0 w-full" 
                                initial={{ y: -200, opacity: 0 }} 
                                animate={isArrivingFromDashboard ? { y: -200, opacity: 0 } : { y: 0, opacity: 1 }} 
                                exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.8, ease: "easeInOut", delay: 0.1 }) }}
                                transition={scaleTransition({ duration: 0.8, ease: "circOut" })}
                            >
                                {/* LEFT: Spacer for burger layout (unified burger/cross rendered after header) */}
                                <div className="w-10 h-10" />

                                {/* CENTER: Logo — Clickable: reset to Streaming dashboard top */}
                                <div className="absolute left-1/2 flex items-center justify-center cursor-pointer" onClick={handleLogoClick}>
                                    <motion.div 
                                        className="flex items-center text-logo-default font-logo notranslate" 
                                        translate="no" 
                                        // CRITICAL FIX: Gérer le centrage via Motion pour éviter conflit avec CSS transform
                                        initial={{ x: "-50%" }} 
                                        animate={
                                            (isDropWaterActive || isLoggedIn) 
                                            ? (isMobile 
                                                // Mobile: Va à gauche. 
                                                // Parent est à left: 50% (Milieu écran).
                                                // -50vw amène au bord gauche 0.
                                                // +32px amène au padding gauche (16px + marge sécurité).
                                                ? { x: "calc(-50vw + 32px)" } 
                                                // Desktop: Léger recentrage (-20px par rapport au centre)
                                                : { x: "calc(-50% - 20px)" } 
                                              )
                                            : { x: "-50%" }
                                        }
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={(isDropWaterActive || isLoggedIn) ? scaleTransition({ duration: 0.8, ease: "easeInOut" }) : scaleTransition({ duration: 0.8, ease: "easeInOut", delay: 0.45 })}
                                    >
                                        {['D','A','T','A'].map((l, i) => <motion.span key={`d-${i}`} className="text-logo-primary">{l}</motion.span>)}
                                        {['V','I','B','E'].map((l, i) => <motion.span key={`v-${i}`} className="text-logo-accent">{l}</motion.span>)}
                                    </motion.div>
                                </div>

                                {/* RIGHT: Actions (Langue, DarkMode, Spacer for Avatar) */}
                                <div className="flex items-center gap-2">
                                    {/* Desktop Only Elements: Langue & DarkMode */}
                                    {!isMobile && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 1, x: 0 }} // Visible par défaut
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: (isDropWaterActive || isLoggedIn) ? 48 : 0 // Glisse à droite
                                                }}
                                                transition={(isDropWaterActive || isLoggedIn) ? scaleTransition({ duration: 1.5, ease: "easeInOut" }) : scaleTransition({ duration: 1.0, ease: "easeInOut", delay: 0.45 })}
                                            >
                                                <Button variant="ghost" size="sm" className="font-bold text-xs h-9 w-9 p-0 rounded-full">FR</Button>
                                            </motion.div>
                                            
                                            <motion.div
                                                className="mr-3"
                                                initial={{ opacity: 1, x: 0 }} // Visible par défaut
                                                animate={{ 
                                                    opacity: 1, 
                                                    x: (isDropWaterActive || isLoggedIn) ? 48 : 0 // Glisse à droite
                                                }}
                                                transition={(isDropWaterActive || isLoggedIn) ? scaleTransition({ duration: 1.5, ease: "easeInOut" }) : scaleTransition({ duration: 1.0, ease: "easeInOut", delay: 0.45 })}
                                            >
                                                <ModeToggle />
                                            </motion.div>
                                        </>
                                    )}
                                    
                                    {/* Spacer for Fixed Avatar Button */}
                                    <motion.div className="h-11 overflow-hidden" animate={{ width: isLoggedIn ? 0 : 44, opacity: isLoggedIn ? 0 : 1 }} transition={isLoggedIn ? scaleTransition({ duration: 0.4, ease: "easeInOut", delay: 0.2 }) : scaleTransition({ duration: 0.4, ease: "easeInOut", delay: 0.5 })} />
                                </div>
                            </motion.header>

                            {/* Unified Burger/Cross Mobile — MOVED to outside dashboard-ui (see below SlideMenu sibling) */}

                            {/* Visiomorphic Search Circle — MOVED to outside dashboard-ui (sibling, like Desktop) */}

                            <StickyTabsHeader 
                                activeTab={activeTab} 
                                onTabChange={(id: string) => { 
                                    standardActiveTabRef.current = id;
                                    setActiveTab(id); 
                                    setContentTab(id); 
                                    setSubTab("dashboard");
                                    // [FIX] Desktop: Scroll to top on tab change to match Mobile behavior
                                    // The sticky menu click must reset the view to the top of the new content.
                                    window.scrollTo(0, 0);
                                    document.documentElement.scrollTop = 0;
                                    document.body.scrollTop = 0;
                                    const scrollContainer = document.getElementById('main-scroll-container');
                                    if (scrollContainer) scrollContainer.scrollTop = 0;
                                }}
                                isVisible={!isFullDashboard && !isBilanView && showStickyNav}
                                direction={direction}
                             />

                            <motion.div 
                                className="w-full px-4 mt-[88px] mb-2 flex justify-start"
                                animate={{ x: isBilanView ? "110%" : 0, opacity: isBilanView ? 0 : 1 }}
                                transition={scaleTransition({ x: { duration: 0.45, ease: "circOut", delay: isBilanView ? 0.08 : 0.45 }, opacity: { duration: 0.25, delay: isBilanView ? 0.08 : 0.45 } })}
                            >
                                <div className="w-14 h-14" />
                            </motion.div>

                            {!(isBilanView && (overlayPage === 'connexions' || overlayPage === 'offre' || overlayPage === 'legal' || overlayPage === 'apropos')) && (
                            <motion.div 
                                className="relative w-full mb-6 mt-2 z-10 h-[26px]" 
                                ref={tabsRef}
                            >
                                <motion.div 
                                    key="tabs-main-container" 
                                    className="absolute inset-0 w-full touch-pan-y" 
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit" 
                                    variants={{ 
                                        hidden: { opacity: 0 },
                                        visible: { 
                                            y: 0, 
                                            opacity: 1, 
                                            filter: "blur(0px)",
                                            transition: scaleTransition({
                                                staggerChildren: 0.1,
                                                delayChildren: !hasEntered ? SEQUENCE.tabs : 0
                                            })
                                        },
                                        exit: { 
                                            y: 400, 
                                            opacity: 0, 
                                            filter: "blur(12px)", 
                                            transition: scaleTransition({ 
                                                duration: 0.6, 
                                                ease: "easeIn",
                                                staggerChildren: 0.1, 
                                                staggerDirection: 1 
                                            }) 
                                        } 
                                    }}
                                >
                                    <DashboardTabsSlot 
                                        socialTabRef={socialTabRef}
                                        activeTab={activeTab} 
                                        onTabChange={(id: string) => { if (isBilanView) { bilanActiveTabRef.current = id; } else { standardActiveTabRef.current = id; } setActiveTab(id); setContentTab(id); setSubTab("dashboard"); }} 
                                        subTab={subTab}
                                        onSubTabChange={(id: string) => setSubTab(id)}
                                        isFullDashboard={isFullDashboard}
                                        isReturning={isReturning}
                                        isArrivingFromDashboard={isArrivingFromDashboard}
                                        showStickyNav={showStickyNav}
                                        isMorphingToSearch={isMorphingToSearch}
                                        direction={direction}
                                        overlayPage={overlayPage}
                                        isBilanView={isBilanView}
                                    />
                                </motion.div>
                            </motion.div>
                            )}

                            {/* USER PANEL removed from scroll flow �� now rendered as fixed overlay below */}

                            <motion.div 
                                className="w-full grid grid-cols-1 items-start gap-4 pb-20 z-10 p-[0px] touch-pan-y relative"
                                onPanEnd={(_e, info) => {
                                    // DISABLE SWIPE IF REFLEX OPPORTUNITY IS ACTIVE (JUST FOR ME)
                                    if (reflexDividedStates?.[contentTab]) return;

                                    const x = info.offset.x;
                                    const y = info.offset.y;
                                    // Robust check: Horizontal must be dominant and significant
                                    if (Math.abs(x) > Math.abs(y) * 1.5 && Math.abs(x) > 40) {
                                        if (x < 0) handleSwipe(-1); 
                                        else handleSwipe(1);
                                    }
                                }}
                            >
                                {/* World 1: Standard Dashboard (Glass Shell) */}
                                {/* HSI: wrapper div controls position — Motion ignores discrete CSS `position` property */}
                                <div style={{ gridColumn: 1, gridRow: 1, position: (!isFullDashboard && !isArrivingFromDashboard && !isBilanView) ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', overflow: (!isFullDashboard && !isArrivingFromDashboard && !isBilanView) ? 'visible' as const : 'hidden' as const, height: (!isFullDashboard && !isArrivingFromDashboard && !isBilanView) ? 'auto' : 0, pointerEvents: (!isFullDashboard && !isArrivingFromDashboard && !isBilanView) ? 'auto' as const : 'none' as const, zIndex: (!isFullDashboard && !isBilanView) ? 10 : 0 }}>
                                    <motion.div 
                                        key="standard-dashboard-view" 
                                        className="flex flex-col gap-6 w-full px-4 pb-20" 
                                        animate={(!isFullDashboard && !isArrivingFromDashboard && !isBilanView) ? "visible" : "hidden"} 
                                        variants={{
                                            hidden: { 
                                                x: isArrivingFromDashboard ? 0 : "100%", 
                                                y: isArrivingFromDashboard ? 120 : 0,    
                                                opacity: 0, scale: 1, filter: "blur(10px)",
                                                transition: scaleTransition({ duration: 0.6, ease: "circOut", staggerChildren: 0.12 })
                                            },
                                            visible: { 
                                                x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                                                transition: scaleTransition({ duration: 0.8, ease: "circOut", staggerChildren: 0.18, delayChildren: 0.08 })
                                            },
                                            exit: { x: "100%", opacity: 0, filter: "blur(10px)" }
                                        }}
                                    >


                                        {/* 3. MODIFIED: Dashboard Main Block (Bottom of Stack) */}
                                        <motion.div className="w-full" variants={getMobileStdLateralChildVariants()}>
                                        <motion.div 
                                            key="dashboard-main-block" 
                                            className={`${contentTab === 'streaming' ? 'bg-dashboard-block-streaming-bg' : (contentTab === 'social' ? 'bg-dashboard-action-social-bg' : 'bg-[rgba(18,134,243,0.1)]')} backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col ${contentTab === 'social' ? 'gap-4' : 'gap-5'} relative shadow-sm z-20`} 
                                            initial="hidden" animate="visible" exit="exit" 
                                            variants={{ 
                                                hidden: { 
                                                    opacity: 0, 
                                                    y: !hasEntered ? 100 : 0, 
                                                    x: !hasEntered ? 0 : (direction > 0 ? -100 : 100) 
                                                }, 
                                                visible: { 
                                                    opacity: 1, y: 0, x: 0,
                                                    transition: scaleTransition({ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: !hasEntered ? 0.4 : 0.1, staggerChildren: 0.1 })
                                                }, 
                                                exit: { 
                                                    y: (isReturning || isArrivingFromDashboard) ? 100 : 0, 
                                                    x: (isReturning || isArrivingFromDashboard) ? 0 : (direction > 0 ? 100 : -100), 
                                                    opacity: 0, 
                                                    transition: scaleTransition({ duration: 0.3, ease: "easeIn" }) 
                                                } 
                                            }}
                                        >
                                        <div aria-hidden="true" className={`absolute inset-0 border ${contentTab === 'streaming' ? 'border-dashboard-block-streaming-border' : (contentTab === 'social' ? 'border-dashboard-action-social-border' : 'border-[rgba(18,134,243,0.6)]')} rounded-[16px] pointer-events-none z-0`} />
                                        
                                        {/* Header: Date Only + Badge */}
                                        <div className="flex justify-between items-center w-full z-10 relative">
                                            <motion.div 
                                                className="flex items-center font-manrope text-foreground" 
                                                animate={{ color: 'var(--dashboard-welcome-text)' }} 
                                                transition={scaleTransition({ duration: 0.3 })}
                                            >
                                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">{getDateRange()}</p>
                                            </motion.div>
                                            <AnimatePresence mode="wait" custom={direction}>
                                                {(contentTab === 'social' && !socialsConnected) ? (
                                                    <motion.div key="badge-locked" custom={direction} initial="hidden" animate="visible" exit="exit" variants={{ 
                                                        hidden: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? -50 : 50), opacity: 0, scale: 0.8, filter: "blur(4px)" };
                                                        }, 
                                                        visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: scaleTransition({ type: "spring", stiffness: 320, damping: 22, mass: 0.8 }) }, 
                                                        exit: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? 50 : -50), opacity: 0, scale: 0.9, filter: "blur(4px)", transition: scaleTransition({ duration: 0.2 }) };
                                                        } 
                                                    }} className="px-3 py-1.5 rounded-xl flex items-center gap-2 border" style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.15)" }}>
                                                        <Lock className="w-4 h-4" style={{ color: "rgba(255, 255, 255, 0.4)" }} /><span className="text-[14px] font-bold leading-normal" style={{ color: "rgba(255, 255, 255, 0.4)" }}>{t('status.locked')}</span>
                                                    </motion.div>
                                                ) : (contentTab === 'streaming' || contentTab === 'social') ? (
                                                    <motion.div key="badge-growth" custom={direction} initial="hidden" animate="visible" exit="exit" variants={{ 
                                                        hidden: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? -50 : 50), opacity: 0, scale: 0.8, filter: "blur(4px)" };
                                                        }, 
                                                        visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: scaleTransition({ type: "spring", stiffness: 320, damping: 22, mass: 0.8 }) }, 
                                                        exit: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? 50 : -50), opacity: 0, scale: 0.9, filter: "blur(4px)", transition: scaleTransition({ duration: 0.2 }) };
                                                        } 
                                                    }} className="px-3 py-1.5 rounded-xl flex items-center gap-2 border" style={{ backgroundColor: "rgba(76, 175, 80, 0.1)", borderColor: "rgba(76, 175, 80, 0.1)" }}>
                                                        <TrendingUp className="w-4 h-4" style={{ color: "#4CAF50" }} /><span className="text-[14px] font-bold leading-normal" style={{ color: "#4CAF50" }}>{t("onboarding.growth")}</span>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div key="badge-radio" custom={direction} initial="hidden" animate="visible" exit="exit" variants={{ 
                                                        hidden: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? -50 : 50), opacity: 0, scale: 0.8, filter: "blur(4px)" };
                                                        }, 
                                                        visible: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: scaleTransition({ type: "spring", stiffness: 320, damping: 22, mass: 0.8 }) }, 
                                                        exit: (d: any) => {
                                                            const dir = typeof d === 'number' ? d : 0;
                                                            return { x: dir === 0 ? 0 : (dir > 0 ? 50 : -50), opacity: 0, scale: 0.9, filter: "blur(4px)", transition: scaleTransition({ duration: 0.2 }) };
                                                        } 
                                                    }} className="px-3 py-1.5 rounded-xl flex items-center gap-2 border" style={{ backgroundColor: "rgba(244, 67, 54, 0.1)", borderColor: "rgba(244, 67, 54, 0.1)" }}>
                                                        <TrendingDown className="w-4 h-4" style={{ color: "#F44336" }} /><span className="text-[14px] font-bold leading-normal" style={{ color: "#F44336" }}>{t('status.declining')}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="relative w-full z-10">
                                            <DashboardBodySlot 
                                                contentTab={contentTab} 
                                                direction={direction} 
                                                isEntry={!hasEntered && !isReturning} 
                                                isFullDashboard={isFullDashboard}
                                                isMorphingToSearch={isMorphingToSearch}
                                                reflexDividedStates={reflexDividedStates}
                                                setReflexDividedStates={setReflexDividedStates}
                                                opportunityData={opportunityData}
                                                socialsConnected={socialsConnected}
                                            />
                                        </div>

                                        <motion.div className="w-full z-10 relative mt-auto" exit={{ opacity: 0, transition: scaleTransition({ duration: 0.2 }) }}>
                                             <DashboardFooterSlot 
                                                contentTab={contentTab} 
                                                direction={direction} 
                                                t={t} 
                                                opportunityData={opportunityData}
                                                isEntry={!hasEntered && !isReturning} 
                                                onNavigate={navigate} 
                                                setIsFullDashboard={setIsFullDashboard}
                                                onSubTabChange={setSubTab}
                                                isFullDashboard={isFullDashboard}
                                                isMorphingToSearch={isMorphingToSearch}
                                                setReflexDividedStates={setReflexDividedStates}
                                                reflexDividedStates={reflexDividedStates}
                                                socialsConnected={socialsConnected}
                                             />
                                        </motion.div>
                                    </motion.div>
                                    </motion.div>

                                        {/* Platform connect rows when socials locked (desktop) */}
                                        {contentTab === 'social' && !socialsConnected && (
                                            <motion.div className="w-full" variants={getMobileStdLateralChildVariants()}>
                                                <SocialPlatformConnect onAllConnected={() => setSocialsConnected(true)} />
                                            </motion.div>
                                        )}

                                        {/* 2. NEW POSITION: Reflex Opportunity (Middle of Stack) — hidden when social locked */}
                                        {!(contentTab === 'social' && !socialsConnected) && (
                                        <motion.div className="w-full" variants={getMobileStdLateralChildVariants()}>
                                        <motion.div
                                            key="reflex-opportunity-block"
                                            className="w-full relative min-h-[200px]"
                                            initial="hidden" animate="visible" exit="exit"
                                            variants={{ 
                                                hidden: { opacity: 0, y: 30 }, 
                                                visible: { 
                                                    opacity: 1, y: 0, 
                                                    transition: scaleTransition({ duration: 0.7, ease: "easeOut", delay: !hasEntered ? SEQUENCE.container : 0.3 })
                                                }, 
                                                exit: { 
                                                    opacity: 0, y: 30, 
                                                    transition: scaleTransition({ duration: 0.3, ease: "easeIn", delay: 0.1 }) 
                                                } 
                                            }}
                                        >
                                            <AnimatePresence mode="popLayout" custom={direction}>
                                                <motion.div
                                                    key={`opportunity-${contentTab}`}
                                                    custom={direction}
                                                    variants={{
                                                        enter: (dir: number) => {
                                                            if (dir === 0) return { y: 30, opacity: 0, filter: "blur(12px)" };
                                                            return getHorizontalSlideVariants(0.2, isMorphingToSearch).enter(dir);
                                                        },
                                                        center: (dir: number) => {
                                                            return getHorizontalSlideVariants(0.2, isMorphingToSearch).center(dir);
                                                        },
                                                        exit: getHorizontalSlideVariants(0.2, isMorphingToSearch).exit
                                                    }}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    className="w-full"
                                                >
                                                    <ReflexOpportunity 
                                                        namespace={contentTab} 
                                                        data={opportunityData[contentTab] || opportunityData.streaming} 
                                                        isDivided={reflexDividedStates[contentTab]}
                                                        setIsDivided={(val) => {
                                                            const newValue = typeof val === 'function' ? val(reflexDividedStates[contentTab]) : val;
                                                            setReflexDividedStates(prev => ({ ...prev, [contentTab]: newValue }));
                                                        }}
                                                        direction={direction}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>
                                        </motion.div>
                                        </motion.div>
                                        )}
                                </motion.div>
                                </div>{/* /HSI wrapper World 1 */}

                        {/* Full Dashboard View */}
                        {/* HSI wrapper World 2 */}
                        <div style={{ gridColumn: 1, gridRow: 1, position: (isFullDashboard && !isBilanView) ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', overflow: (isFullDashboard && !isBilanView) ? 'visible' as const : 'hidden' as const, height: (isFullDashboard && !isBilanView) ? 'auto' : 0, pointerEvents: (isFullDashboard && !isBilanView) ? 'auto' as const : 'none' as const, zIndex: (isFullDashboard && !isBilanView) ? 10 : 0 }}>
                        <motion.div 
                            key="full-dashboard-view" 
                            className="flex flex-col gap-6 w-full px-4 pb-20" 
                            animate={(isFullDashboard && !isBilanView) ? "visible" : "hidden"} 
                            variants={(() => { const base = getMobileFullDashboardVariants(); return {
                                ...base,
                                hidden: {
                                    ...base.hidden,
                                    transition: scaleTransition({ ...MOBILE_SMOOTH_FLOW_RAW, staggerChildren: 0.12 })
                                },
                                visible: { 
                                    ...base.visible,
                                    transition: scaleTransition({ ...MOBILE_SMOOTH_FLOW_RAW, staggerChildren: 0.2, delayChildren: 0.1 })
                                }
                            }; })()}
                        >
                            {/* --- STREAMING FULL DASHBOARD --- */}
                            {activeTab === 'streaming' && (
                                <motion.div className="w-full flex flex-col gap-6" initial="enter" animate="center" exit="exit" variants={containerVariants}>
                                    <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full">
                                        <StreamingDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                    </motion.div>
                                    <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                        {subTab === 'dashboard' && (
                                            <motion.div key="streaming-dash" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <StreamingPerformanceUnified hideChart={true} direction={subTabDirection} />
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><PlaylistAnalysis /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'performance' && (
                                            <motion.div key="streaming-perf" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <StreamingPerformanceUnified hideStats={true} direction={subTabDirection} />
                                            </motion.div>
                                        )}
                                        {subTab === 'playlists' && (
                                            <motion.div key="streaming-play" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><WeightedStreamsCard /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><LatestPerformanceCard /></motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            {activeTab === 'social' && (
                                <motion.div className="w-full flex flex-col gap-6" initial="enter" animate="center" exit="exit" variants={containerVariants}>
                                    <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full">
                                        <SocialDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                    </motion.div>
                                    <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                        {subTab === 'dashboard' && (
                                            <motion.div key="social-dash-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SocialPerformanceOverview /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SocialEngagementCard /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'subscribers' && (
                                            <motion.div key="social-subs-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><PlatformDistribution /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><BestPlatforms /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'demographics' && (
                                            <motion.div key="social-demo-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscriberAnalysis /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscribersByGender /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscribersByAge /></motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                            {/* --- RADIO FULL DASHBOARD --- */}
                            {activeTab === 'radio' && (
                                <motion.div className="w-full flex flex-col gap-6" initial="enter" animate="center" exit="exit" variants={containerVariants}>
                                    <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full">
                                        <RadioDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                    </motion.div>
                                    <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                        {subTab === 'dashboard' && (
                                            <motion.div key="radio-dash" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioPerformanceOverview /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><AnalyseDes5PrincipauxPays /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'countries' && (
                                            <motion.div key="radio-countries" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioCountriesAnalysis /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioStationDistribution /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'strategy' && (
                                            <motion.div key="radio-strategy" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaPerformanceCards /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaStrategyCard /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaActionCard /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaCampaignCard /></motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </motion.div>
                        </div>{/* /HSI wrapper World 2 */}

                        {/* World 3: Bilan View — Cascade entry from LEFT, cascade exit to LEFT (Pendulum Return) */}
                        {/* HSI wrapper World 3 */}
                        <div style={{ gridColumn: 1, gridRow: 1, position: isBilanView ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', pointerEvents: isBilanView ? 'auto' as const : 'none' as const, zIndex: isBilanView ? 10 : 0 }}>
                        <motion.div 
                            key="bilan-view" 
                            className="flex flex-col gap-6 w-full px-4 pb-20" 
                            animate={isBilanView ? "visible" : "hidden"} 
                            variants={{
                                hidden: { 
                                    x: "-100%", 
                                    opacity: 0, scale: 1, filter: "blur(10px)",
                                    transition: scaleTransition({ duration: 0.5, ease: "circOut", staggerChildren: 0.08 })
                                },
                                visible: { 
                                    x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                                    transition: scaleTransition({ duration: 0.6, ease: "circOut", staggerChildren: 0.12, delayChildren: 0.55 })
                                }
                            }}
                        >
                            {/* Bilan Content: title + blocks wrapped in AnimatePresence for inter-tab Spatial Flow */}
                            {/* FIX: AnimatePresence always mounted — isBilanView controls child presence so exit animations play */}
                            <AnimatePresence mode="wait" initial={false}>
                            {isBilanView && (
                                <motion.div
                                    key={`${overlayPage}-mob-tab-${activeTab}`}
                                    className="w-full flex flex-col gap-6"
                                    variants={{ hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: scaleTransition({ duration: 0.5, ease: "circOut" }) } }}
                                    initial={overlaySwapRef.current ? { opacity: 0, x: -80, filter: "blur(6px)" } : (bilanTabDirection !== 0 ? { opacity: 0, x: bilanTabDirection > 0 ? -80 : 80, filter: "blur(6px)" } : false)}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.4, ease: "easeOut" }) }}
                                    exit={overlaySwapRef.current ? { opacity: 0, x: 80, filter: "blur(6px)", transition: scaleTransition({ duration: 0.48, opacity: { delay: 0.2, duration: 0.28 }, x: { duration: 0.42 }, filter: { duration: 0.38 } }) } : { opacity: 0, x: bilanTabDirection > 0 ? 80 : -80, filter: "blur(6px)", transition: scaleTransition({ duration: 0.48, opacity: { delay: 0.2, duration: 0.28 }, x: { duration: 0.42 }, filter: { duration: 0.38 } }) }}
                                >
                                    {overlayPage === 'connexions' ? (
                                        <ConnexionsContentBlocks />
                                    ) : overlayPage === 'offre' ? (
                                        <OffreContentBlocks />
                                    ) : overlayPage === 'legal' ? (
                                        <LegalContentBlocks />
                                    ) : overlayPage === 'apropos' ? (
                                        <AboutContentBlocks />
                                    ) : (
                                    <>
                                    <div className="flex flex-col gap-[2px] px-1 w-full relative items-center">
                                        <h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight">{overlayPage === 'niveau' ? `${t('bilan.level')} ${t(TAB_LABEL_KEYS[activeTab])}` : `${t('bilan.pageTitle')} ${t(TAB_LABEL_KEYS[activeTab])}`}</h2>
                                        <p className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight">{t('bilan.overview')}</p>
                                    </div>
                                    {overlayPage === 'bilan' ? (
                                        <>
                                            {activeTab === 'streaming' && (
                                                <BilanContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                            {activeTab === 'social' && (
                                                <BilanSocialContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                            {activeTab === 'radio' && (
                                                <BilanMediaContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <NiveauContentBlocks 
                                            activeTab={activeTab} 
                                            period={bilanPeriod} 
                                            onPeriodChange={(p) => setBilanPeriod(p)} 
                                            periodTabsRef={bilanPeriodTabsRef}
                                            tabDirection={bilanTabDirection}
                                        />
                                    )}
                                    </>
                                    )}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                        </div>{/* /HSI wrapper World 3 */}

                        {/* Navigation Sticky fixée au fond de l'écran - Hors du flux de scroll */}
                        <StickyTabsHeader 
                            activeTab={activeTab} 
                            onTabChange={(id: string) => { standardActiveTabRef.current = id; setActiveTab(id); setContentTab(id); setSubTab("dashboard"); }}
                            isVisible={!isFullDashboard && !isBilanView && showStickyNav}
                            direction={direction}
                        />

                        <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
                            <div className={`${(!isDropWaterActive && !isAuthFocused) ? "pointer-events-auto" : "pointer-events-none"}`}>
                                {activeTab === 'streaming' && <StreamingBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                                {activeTab === 'social' && <SocialBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                                {activeTab === 'radio' && <RadioBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                                
                                <MainBottomNav 
                                    activeTab={contentTab} 
                                    onTabChange={(id) => {
                                        standardActiveTabRef.current = id;
                                        setActiveTab(id);
                                        setContentTab(id);
                                        setSubTab("dashboard");
                                    }} 
                                    isVisible={!isFullDashboard && !isBilanView && showStickyNav} 
                                />
                                {/* Bilan Main Nav — TAF Transmigration des Âmes for Streaming/Réseaux/Médias */}
                                <BilanBottomNav 
                                    activeTab={contentTab} 
                                    onTabChange={(id) => {
                                        standardActiveTabRef.current = id;
                                        setActiveTab(id);
                                        setContentTab(id);
                                        setSubTab("dashboard");
                                    }} 
                                    isVisible={isBilanView && overlayPage !== 'connexions' && overlayPage !== 'offre' && overlayPage !== 'legal' && overlayPage !== 'apropos' && showStickyNav} 
                                />

                            </div>
                        </div>
                    </motion.div>

                    {/* SANCTUARY 2: Visiomorphic Circle — OUTSIDE dashboard-ui opacity wrapper (like Desktop) */}
                    <motion.div key="dashboard-circle-wrapper" className="fixed top-[88px] left-0 w-full z-40 perspective-[1000px] pointer-events-none" animate={{ x: isBilanView ? "110%" : 0 }} transition={scaleTransition({ x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0 : 0.35 } })}><div className="w-full px-4 relative"><motion.div layoutId={(isDropWaterActive || isClosingAuth) ? undefined : "visiomorphic-container"} className={`h-14 relative z-20 bg-card border border-border shadow-sm overflow-hidden ${(!isDropWaterActive && !isAuthFocused && !isLoggedIn) ? "pointer-events-auto" : "pointer-events-none"} ${isMobile ? 'w-14' : 'mx-auto'}`} style={{ borderRadius: 28, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }} initial={{ width: isMobile ? 56 : "100%", borderRadius: 28 }} animate={{ opacity: (isDropWaterActive || isLoggedIn) ? 0 : 1, scale: 1, width: isDropWaterActive ? 56 : (isMobile ? 56 : "100%"), borderRadius: 28, x: isDropWaterActive ? (isMobile ? "calc(50vw - 44px)" : 0) : 0 }} transition={isDropWaterActive ? scaleTransition({ width: { duration: 0.8, ease: "easeInOut" }, layout: { duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }, x: { duration: 0.6, ease: "circOut" }, opacity: { duration: 0.1, delay: 0.6 } }) : scaleTransition({ opacity: { duration: 0.1, delay: 0 }, x: { duration: 0.6, ease: "circIn" }, width: { duration: 0.8, ease: "easeInOut" }, layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } })} onClick={handleTransitionToSearch}><motion.div className="w-full h-full bg-card rounded-full shadow-sm border border-border cursor-pointer flex items-center justify-center relative" style={{ borderRadius: 28, transformStyle: "preserve-3d", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }} initial={isSyncCompleting ? { opacity: 1 } : { opacity: 0 }} animate={{ rotateY: isFullDashboard ? 180 : 0, opacity: 1 }} transition={scaleTransition({ rotateY: { duration: 1.1, ease: "easeInOut" }, opacity: { duration: 0.3, delay: isSyncCompleting ? 0 : 0.5 } })}><div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ backfaceVisibility: "hidden" }}><Search className="w-5 h-5 text-muted-foreground" /></div><div className="absolute inset-0 flex items-center justify-center rounded-full bg-dashboard-back-btn-bg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties} onClick={(e) => { e.stopPropagation(); setIsReturning(true); setTimeout(() => { setIsFullDashboard(false); }, 200); setTimeout(() => setIsReturning(false), 1400); }}><motion.div className="w-auto h-auto flex items-center justify-center" animate={{ rotateY: isReturning ? 180 : 0 }} transition={scaleTransition({ duration: 0.6, ease: "easeInOut" })}><ChevronLeft size={28} strokeWidth={2} color="var(--stroke-0, white)" /></motion.div></div></motion.div></motion.div></div></motion.div>

                    {/* HELLO BLOCK (Mobile) — Extracted outside circle wrapper for stable z-index above backdrop */}
                    {subTab === 'dashboard' && !isFullDashboard && (
                        <motion.div
                            key="mobile-hello-block"
                            className="fixed top-[88px] left-0 w-full h-14 z-[54] pointer-events-none"
                            animate={{ x: isBilanView ? "110%" : 0 }}
                            transition={scaleTransition({ x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0 : 0.35 } })}
                        >
                            <motion.div
                                className="absolute left-[88px] top-1/2 -translate-y-1/2 flex flex-col items-start gap-[2px] font-manrope text-foreground whitespace-nowrap pointer-events-none"
                                style={{ transformOrigin: "-60px 50%" }}
                                initial="visible"
                                animate={(subTab === 'dashboard' && isScrolled) ? "scrolled" : ((isMerging || isDropWaterActive) ? "eclipse" : "visible")}
                                variants={{
                                    visible: { opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)", x: 0, transition: scaleTransition({ duration: 0.4, ease: "easeOut", delay: 0.2 }) },
                                    scrolled: { opacity: 0, y: -50, rotateY: 180, filter: "blur(10px)", transition: scaleTransition({ duration: 0.3, ease: "easeOut" }) },
                                    eclipse: { opacity: 0, rotateY: 90, x: -20, filter: "blur(5px)", transition: scaleTransition({ duration: 0.4, ease: "easeIn" }) }
                                }}
                            >
                                <p className="text-[13.2px] font-normal leading-none opacity-90">{t("onboarding.hello")}</p>
                                <div className="text-[20.2px] leading-none flex items-center gap-2">
                                    <span className="font-bold" translate="no">{searchResults.find(a => a.id === selectedArtist)?.name || "KS Bloom"}</span>
                                    <span className="font-normal"> 👋</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* BILAN CLOSE CIRCLE (Mobile) — Enters from LEFT when isBilanView */}
                    <motion.div 
                        key="bilan-close-circle"
                        className="fixed top-[88px] left-4 z-40 pointer-events-auto"
                        animate={{ 
                            x: isBilanView ? 0 : -80, 
                            opacity: isBilanView ? 1 : 0,
                            scale: isBilanView ? 1 : 0.5
                        }}
                        transition={scaleTransition({ 
                            x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0.35 : 0 },
                            opacity: { duration: 0.3, delay: isBilanView ? 0.35 : 0 },
                            scale: { duration: 0.4, ease: "circOut", delay: isBilanView ? 0.35 : 0 }
                        })}
                        style={{ pointerEvents: isBilanView ? "auto" : "none" }}
                    >
                        <div 
                            className="w-14 h-14 rounded-full bg-dashboard-back-btn-bg flex items-center justify-center cursor-pointer shadow-sm"
                            style={{ "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties}
                            onClick={() => { bilanActiveTabRef.current = activeTab; setActiveTab(standardActiveTabRef.current); setContentTab(standardActiveTabRef.current); setIsFullDashboard(bilanFromFullRef.current); setIsBilanView(false); const sc = document.getElementById('main-scroll-container'); if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                            <X size={24} strokeWidth={2} color="var(--stroke-0, white)" />
                        </div>
                    </motion.div>

                </motion.div>
                </motion.div>
                )}
</AnimatePresence>
</div>

{step !== 'dashboard' && (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto z-20 pb-20 md:pb-12 px-6 mt-auto">
         <AnimatePresence mode="wait">
            {step === 'welcome' && (
                <motion.div key="main-button" className="w-full relative" layoutId="visiomorphic-button" initial={{ y: 50, opacity: 0 }} animate={isExitingSearch ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }} transition={scaleTransition({ duration: isExitingSearch ? 0.5 : 1.2, ease: isExitingSearch ? "backIn" : "easeOut", delay: isExitingSearch ? 0 : 1.5 })} exit={{ y: 200, opacity: 0, transition: scaleTransition({ duration: 0.5, ease: "easeInOut" }) }}>
                    <Button size="lg" disabled={step === 'search' && !selectedArtist} className={`w-full rounded-full font-semibold text-base h-12 transition-all duration-500 text-white border-none flex items-center justify-center gap-2 overflow-hidden ${step === 'search' && !selectedArtist ? "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0)]" : "bg-gradient-to-r from-datavibe-primary to-datavibe-purple shadow-[0_0_20px_var(--effect-glow-primary-strong)] hover:shadow-[0_0_25px_var(--effect-glow-primary)]"}`} onClick={step === 'welcome' ? () => { setIsCarouselExiting(true); } : handleStartSync}>
                        <AnimatePresence mode="wait" initial={false}>
                            {step === 'welcome' ? ( <motion.span key="btn-text-welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: scaleTransition({ duration: 0.2 }) }}>{t("onboarding.start")}</motion.span> ) : ( <div className="flex items-center"><motion.span key="btn-text-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ delay: 0.1 })}>{t("onboarding.its_me")}</motion.span><motion.div initial={{ width: 0, opacity: 0, x: 50 }} animate={{ width: "auto", opacity: 1, x: 0 }} transition={scaleTransition({ type: "spring", stiffness: 200, damping: 20, delay: 0.3 })} className="ml-2"><span className="text-lg leading-none block">🎤</span></motion.div></div> )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
            )}
         </AnimatePresence>
         <div className="relative h-6 w-full flex justify-center">
            <AnimatePresence mode="wait">
                {step === 'welcome' && ( <motion.p key="link-welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 1.5, delay: 1.8 })} exit={{ opacity: 0 }} className="absolute text-xs text-muted-foreground">{t('auth.alreadyRegistered')} <button className="text-transparent bg-clip-text bg-gradient-to-r from-datavibe-primary to-datavibe-purple font-bold hover:underline border-none p-0 cursor-pointer">{t('auth.signIn')}</button></motion.p> )}
                {step === 'search' && ( 
                    <motion.p 
                        key="link-search" 
                        initial={{ opacity: 0 }} 
                        animate={isExitingSearch || isArrivingFromDashboard || (isInputFocused && step === 'search') ? { y: 100, opacity: 0 } : { opacity: 1, y: 0 }} 
                        exit={{ opacity: 0 }} 
                        transition={scaleTransition({ duration: (isInputFocused || isArrivingFromDashboard) ? 0.2 : 0.4, ease: "easeIn" })} 
                        className="absolute text-xs text-muted-foreground whitespace-nowrap"
                    >
                        {t('auth.notOnSpotify')} <button className="text-transparent bg-clip-text bg-gradient-to-r from-datavibe-primary to-datavibe-purple hover:underline font-bold border-none p-0 cursor-pointer">{t('auth.manualSignup')}</button>
                    </motion.p> 
                )}
            </AnimatePresence>
         </div>
    </div>
)}

{/* BACKDROP OVERLAY (Mobile) — frost + scroll block when UserPanel is open */}
<div className={isUserPanelOpen ? '' : 'pointer-events-none'}>
<AnimatePresence>
    {isLoggedIn && isUserPanelOpen && (
        <motion.div
            key="mobile-user-panel-backdrop"
            className="fixed inset-0 z-[52] backdrop-blur-md bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={scaleTransition({ duration: 0.3 })}
            onClick={() => setIsUserPanelOpen(false)}
        />
    )}
</AnimatePresence>
</div>

{/* USER PANEL (Mobile) — fixed floating container for slide animation */}
{/* FIX: h-0 + overflow-visible allows exit animation to play while preventing invisible blocking layer */}
{isLoggedIn && (
    <div className={`fixed left-4 right-4 z-[53] no-scrollbar ${isUserPanelOpen ? 'top-[152px] bottom-4 overflow-y-auto pointer-events-auto' : 'top-[152px] h-0 overflow-visible pointer-events-none'}`}>
        <UserPanel isOpen={isUserPanelOpen} displayName={displayName || searchResults.find(a => a.id === selectedArtist)?.name || "KS Bloom"} onLogout={handleLogout} onDisplayNameChange={setDisplayName} />
    </div>
)}

</div>
</motion.div>
);
}

// --- MAIN COMPONENT ---

function DesktopExperience(props: PlatformState) {
    // Desktop Experience Logic

    // --- MITOSIS & AUTH LOGIC ---
    const [mitosisStage, setMitosisStage] = useState<'idle' | 'dropping' | 'expanding'>('idle');
    const [isDesktopAnimationComplete, setIsDesktopAnimationComplete] = useState(false);
    const [isClosingAuth, setIsClosingAuth] = useState(false); // Close sequence state machine
    const [desktopViewportHeight, setDesktopViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 900);
    const desktopAvatarWrapperRef = useRef<HTMLDivElement>(null);

    // Auth view state machine (sign-in ↔ forgot-password ↔ signup)
    const [authView, setAuthView] = useState<'signin' | 'forgot' | 'signup'>('signin');
    const [isViewSwitching, setIsViewSwitching] = useState(false);
    const [targetCardHeight, setTargetCardHeight] = useState(SIGNIN_CARD_HEIGHT);
    const [isHeightAnimating, setIsHeightAnimating] = useState(false);

    // Dynamic Coordinates for Drop Animation
    const avatarRef = useRef<HTMLButtonElement>(null);
    const socialTabRef = useRef<HTMLDivElement>(null);
    const [mitosisCoords, setMitosisCoords] = useState<{ startY: number, endY: number } | null>(null);
    // Store avatar rect to avoid measuring during animation movement
    const [storedAvatarRect, setStoredAvatarRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const updateAvatarRect = () => {
            if (avatarRef.current) {
                setStoredAvatarRect(avatarRef.current.getBoundingClientRect());
            }
            setDesktopViewportHeight(window.innerHeight);
        };
        
        // Initial measure
        updateAvatarRect();
        
        window.addEventListener('resize', updateAvatarRect);
        return () => window.removeEventListener('resize', updateAvatarRect);
    }, []);

    // Scroll overlay only when viewport is physically too small for the card
    const desktopCardTop = mitosisCoords ? mitosisCoords.endY : 152;
    const needsDesktopScroll = desktopViewportHeight < desktopCardTop + targetCardHeight + 32;
    const desktopScrollActive = isDesktopAnimationComplete && !isClosingAuth && needsDesktopScroll;

    // Reset avatar position when scroll deactivates
    useEffect(() => {
        if (!desktopScrollActive && desktopAvatarWrapperRef.current) {
            desktopAvatarWrapperRef.current.style.top = '';
        }
    }, [desktopScrollActive]);

    useEffect(() => {
        if (props.isDropWaterActive) {
            // Force close the menu so it doesn't stay above the auth backdrop
            setIsMenuOpen(false);

            // Measure coordinates using stored avatar rect (before movement)
            if (storedAvatarRect && socialTabRef.current) {
                const socialRect = socialTabRef.current.getBoundingClientRect();
                setMitosisCoords({
                    startY: storedAvatarRect.top + 84 + storedAvatarRect.height / 2, // Add 84px drop offset
                    endY: socialRect.top
                });
            }

            // Step 1: Wait for avatar to reach center (approx 0.6s)
            const dropTimer = setTimeout(() => {
                setMitosisStage('dropping');
            }, 600);
            
            // Step 2: Drop animation finishes, expand (approx 0.5s later)
            const expandTimer = setTimeout(() => {
                setMitosisStage('expanding');
            }, 1100);

            // Step 3: Trigger Background Blur EARLIER (at end of drop / start of morph)
            const blurTimer = setTimeout(() => {
                setIsAuthFocused(true);
            }, 350); // Matches the 0.35s total drop duration
            
            return () => { clearTimeout(dropTimer); clearTimeout(expandTimer); clearTimeout(blurTimer); };
        } else {
            setMitosisStage('idle');
        }
    }, [props.isDropWaterActive]);

    const {
        isDropWaterActive, setIsDropWaterActive,
        language, setLanguage, toggleLanguage, t,
        step, setStep,
        searchQuery, setSearchQuery,
        isSearching, setIsSearching,
        searchResults, setSearchResults,
        selectedArtist, setSelectedArtist,
        isExitingSearch, setIsExitingSearch,
        syncProgress, setSyncProgress,
        isSyncCompleting, setIsSyncCompleting,
        syncSteps, setSyncSteps,
        isArrivingFromDashboard, setIsArrivingFromDashboard,
        isMorphingToSearch, setIsMorphingToSearch,
        focusedResultIndex, setFocusedResultIndex,
        isInputFocused, setIsInputFocused,
        inputRef,
        isFullDashboard, setIsFullDashboard,
        hasEntered, setHasEntered,
        activeTab, setActiveTab,
        contentTab, setContentTab,
        subTab, setSubTab,
        isReturning, setIsReturning,
        reflexDividedStates, setReflexDividedStates,
        opportunityData,
        prevTabRef, prevFullDashboardRef,
        subTabDirection,
        direction,
        handleStartSync, handleSpotifyLogin,
        isAuthFocused, setIsAuthFocused,
        isBilanView, setIsBilanView,
        overlayPage, setOverlayPage, overlaySwapRef,
        bilanFromFullRef,
        bilanActiveTabRef, standardActiveTabRef,
        bilanPeriod, setBilanPeriod,
        isLoggedIn, setIsLoggedIn,
        isUserPanelOpen, setIsUserPanelOpen,
        displayName, setDisplayName,
        isMenuOpen, setIsMenuOpen,
        spatialFlowSpeed, setSpatialFlowSpeed,
        isCarouselExiting, setIsCarouselExiting,
        socialsConnected, setSocialsConnected
    } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { return scrollY.on("change", (latest) => setIsScrolled(latest > 10)); }, [scrollY]);

  const handleCloseAuth = () => {
      if (isClosingAuth) return; // Prevent double-trigger
      // Phases simultanées (même render batch React 18) :
      // - isClosingAuth=true  → enfants démarrent leur sortie latérale
      // - isDropWaterActive=false → conteneur démarre son exit AnimatePresence
      setIsClosingAuth(true);
      setIsDropWaterActive(false);
      setIsAuthFocused(false);
      // Cleanup après la fin de l'animation complète
      setTimeout(() => {
          setIsClosingAuth(false);
          setMitosisStage('idle');
          setIsDesktopAnimationComplete(false);
          // Réinitialise la machine d'état de la vue auth
          setAuthView('signin');
          setIsViewSwitching(false);
          setTargetCardHeight(SIGNIN_CARD_HEIGHT);
          setIsHeightAnimating(false);
      }, CONTENT_CLOSE_MS() + BUFFER_MS());
  };

  // --- LOGIN SUCCESS HANDLER (Desktop) ---
  const handleLoginSuccess = (firstName?: string) => {
      if (isClosingAuth) return;
      if (firstName) {
          setDisplayName(firstName);
      } else if (!displayName) {
          setDisplayName(searchResults.find(a => a.id === selectedArtist)?.name || "");
      }
      setIsLoggedIn(true);
      setIsClosingAuth(true);
      setIsDropWaterActive(false);
      setIsAuthFocused(false);
      setTimeout(() => {
          setIsClosingAuth(false);
          setMitosisStage('idle');
          setIsDesktopAnimationComplete(false);
          setAuthView('signin');
          setIsViewSwitching(false);
          setTargetCardHeight(SIGNIN_CARD_HEIGHT);
          setIsHeightAnimating(false);
      }, CONTENT_CLOSE_MS() + BUFFER_MS());
  };

  // Logo Click → Reset to Streaming dashboard top (Desktop)
  const handleLogoClick = () => {
      if (step !== 'dashboard') return;
      if (isBilanView) setIsBilanView(false);
      setActiveTab('streaming');
      setContentTab('streaming');
      standardActiveTabRef.current = 'streaming';
      setSubTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SCROLL BLOCK when UserPanel is open (Desktop) ---
  useEffect(() => {
      if (isUserPanelOpen && scrollRef.current) {
          scrollRef.current.style.overflow = 'hidden';
      } else if (scrollRef.current) {
          scrollRef.current.style.overflow = '';
      }
  }, [isUserPanelOpen]);

  // --- LOGOUT HANDLER (Desktop) ---
  const handleLogout = () => {
      setIsMenuOpen(false);
      setIsUserPanelOpen(false);
      setTimeout(() => {
          setDisplayName("");
          setIsLoggedIn(false);
      }, getFlowDuration(0.5) * 1000);
  };

  // --- Unified burger/cross position calculation (Desktop) ---
  const _dCrossLeftPx = 268;
  const _dWrapperBaseLeft = 16;
  const _dMenuDelta = _dCrossLeftPx - _dWrapperBaseLeft;

  // --- HANDLERS VIEW-SWITCH (Desktop) ---

  const handleForgotPassword = () => {
      if (isViewSwitching || isClosingAuth) return;
      setIsViewSwitching(true);

      // Chevauchement des phases pour un mouvement continu
      const heightStart = CONTENT_CLOSE_MS() * 0.55;
      const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;

      setTimeout(() => {
          setIsHeightAnimating(true);
          setTargetCardHeight(FORGOT_CARD_HEIGHT);
      }, heightStart);

      setTimeout(() => {
          // Mutation temporaire des timings open pour entrée accélérée (grand→petit format)
          ANIMATION_CARTOGRAPHY.authContent.open.delay = FORGOT_OPEN_DELAY;
          ANIMATION_CARTOGRAPHY.authContent.open.duration = FORGOT_OPEN_DURATION;
          ANIMATION_CARTOGRAPHY.authContent.open.stagger = FORGOT_OPEN_STAGGER;
          setAuthView('forgot');
          setIsViewSwitching(false);
          setIsHeightAnimating(false);
          // Reset des timings originaux après que le render ait capté les valeurs rapides
          setTimeout(() => {
              ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
              ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
              ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
          }, CARTOGRAPHY_RESET_MS());
      }, contentSwitch);
  };

  const handleBackToSignIn = () => {
      if (isViewSwitching || isClosingAuth) return;
      setIsViewSwitching(true);

      // Chevauchement des phases pour un mouvement continu
      const heightStart = FORGOT_CLOSE_MS() * 0.55;
      const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;

      setTimeout(() => {
          setIsHeightAnimating(true);
          setTargetCardHeight(SIGNIN_CARD_HEIGHT);
      }, heightStart);

      setTimeout(() => {
          // Mutation temporaire des timings open pour entrée accélérée (petit→grand format)
          ANIMATION_CARTOGRAPHY.authContent.open.delay = RETURN_OPEN_DELAY;
          ANIMATION_CARTOGRAPHY.authContent.open.duration = RETURN_OPEN_DURATION;
          ANIMATION_CARTOGRAPHY.authContent.open.stagger = RETURN_OPEN_STAGGER;
          setAuthView('signin');
          setIsViewSwitching(false);
          setIsHeightAnimating(false);
          // Reset des timings originaux après que le render ait capté les valeurs rapides
          setTimeout(() => {
              ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
              ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
              ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
          }, CARTOGRAPHY_RESET_MS());
      }, contentSwitch);
  };

  const handleSignUp = () => {
      if (isViewSwitching || isClosingAuth) return;
      setIsViewSwitching(true);
      const heightStart = CONTENT_CLOSE_MS() * 0.55;
      const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;
      setTimeout(() => {
          setIsHeightAnimating(true);
          setTargetCardHeight(SIGNUP_CARD_HEIGHT);
      }, heightStart);
      setTimeout(() => {
          ANIMATION_CARTOGRAPHY.authContent.open.delay = SIGNUP_OPEN_DELAY;
          ANIMATION_CARTOGRAPHY.authContent.open.duration = SIGNUP_OPEN_DURATION;
          ANIMATION_CARTOGRAPHY.authContent.open.stagger = SIGNUP_OPEN_STAGGER;
          setAuthView('signup');
          setIsViewSwitching(false);
          setIsHeightAnimating(false);
          setTimeout(() => {
              ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
              ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
              ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
          }, CARTOGRAPHY_RESET_MS());
      }, contentSwitch);
  };

  const handleBackFromSignUp = () => {
      if (isViewSwitching || isClosingAuth) return;
      setIsViewSwitching(true);
      const heightStart = SIGNUP_CLOSE_MS() * 0.55;
      const contentSwitch = heightStart + HEIGHT_ANIM_DURATION * 0.65 * 1000;
      setTimeout(() => {
          setIsHeightAnimating(true);
          setTargetCardHeight(SIGNIN_CARD_HEIGHT);
      }, heightStart);
      setTimeout(() => {
          ANIMATION_CARTOGRAPHY.authContent.open.delay = RETURN_OPEN_DELAY;
          ANIMATION_CARTOGRAPHY.authContent.open.duration = RETURN_OPEN_DURATION;
          ANIMATION_CARTOGRAPHY.authContent.open.stagger = RETURN_OPEN_STAGGER;
          setAuthView('signin');
          setIsViewSwitching(false);
          setIsHeightAnimating(false);
          setTimeout(() => {
              ANIMATION_CARTOGRAPHY.authContent.open.delay = ORIGINAL_OPEN_DELAY;
              ANIMATION_CARTOGRAPHY.authContent.open.duration = ORIGINAL_OPEN_DURATION;
              ANIMATION_CARTOGRAPHY.authContent.open.stagger = ORIGINAL_OPEN_STAGGER;
          }, CARTOGRAPHY_RESET_MS());
      }, contentSwitch);
  };

  // Fix: Define isDashboardEntry based on hasEntered state
  const isDashboardEntry = !hasEntered;

  const [showStickyNav, setShowStickyNav] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showBilanStickyNav, setShowBilanStickyNav] = useState(false);
  const bilanPeriodTabsRef = useRef<HTMLDivElement>(null);

  // --- Bilan Inter-Tab Spatial Flow Direction Tracking (Desktop) ---
  const BILAN_TAB_INDEX_D: Record<string, number> = { streaming: 0, social: 1, radio: 2 };
  const bilanTabDirRef = useRef(0);
  const prevBilanTabRef = useRef(activeTab);
  if (isBilanView && activeTab !== prevBilanTabRef.current) {
      bilanTabDirRef.current = (BILAN_TAB_INDEX_D[activeTab] ?? 0) > (BILAN_TAB_INDEX_D[prevBilanTabRef.current] ?? 0) ? 1 : -1;
  }
  useEffect(() => { if (isBilanView) prevBilanTabRef.current = activeTab; }, [activeTab, isBilanView]);
  const bilanTabDirection = bilanTabDirRef.current;

  useEffect(() => { if (step === 'dashboard' && !location.pathname.includes('dashboard')) window.history.replaceState(null, '', '/onboarding/dashboard'); }, [step, location]);

  useEffect(() => {
    // Reset when tabs wrapper is unmounted (Connexions page removes TAF tabs from DOM)
    if (!tabsRef.current) {
      setShowStickyNav(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // TAF Protocol: Soul release as soon as the body touches the header zone (64px)
        // threshold: 0.1 means it triggers as soon as element is mostly hidden
        setShowStickyNav(!entry.isIntersecting);
      },
      { 
        threshold: 0.1, 
        rootMargin: "-64px 0px 1000% 0px" 
      }
    );

    observer.observe(tabsRef.current);

    return () => {
      if (tabsRef.current) observer.unobserve(tabsRef.current);
    };
  }, [step, isBilanView, overlayPage]); // overlayPage: re-run when tabs unmount/remount between Connexions ↔ Bilan/Niveau

  // Bilan Period Tabs IntersectionObserver — TAF for Semaine/Mois/Trimestre (Desktop)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBilanStickyNav(!entry.isIntersecting);
      },
      { 
        threshold: 0.1, 
        rootMargin: "-64px 0px 1000% 0px" 
      }
    );

    if (bilanPeriodTabsRef.current) {
      observer.observe(bilanPeriodTabsRef.current);
    }

    return () => {
      if (bilanPeriodTabsRef.current) observer.unobserve(bilanPeriodTabsRef.current);
    };
  }, [step, isBilanView]);

  const tabOrder = ["streaming", "social", "radio"];

  const handleSwipe = (dir: number) => {
    if (step !== 'dashboard') return;
    const currentIndex = tabOrder.indexOf(contentTab);
    const newIndex = currentIndex + dir;
    if (newIndex >= 0 && newIndex < tabOrder.length) {
      const newTabId = tabOrder[newIndex];
      if (isBilanView) { bilanActiveTabRef.current = newTabId; } else { standardActiveTabRef.current = newTabId; }
      setActiveTab(newTabId);
      setContentTab(newTabId);
      setSubTab("dashboard");
    }
  };

  useEffect(() => {
    if (isArrivingFromDashboard && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isArrivingFromDashboard]);

  const letterVariants = { hidden: { opacity: 0, y: -20, rotateX: 90 }, visible: { opacity: 1, y: 0, rotateX: 0, transition: scaleTransition({ duration: 0.4 }) } };

  // SPATIAL FLOW VARIANTS - Fixed Positioning for "Follow Flow"
  // Standard Dashboard: Lies on the LEFT relative to Full Dashboard.
  // When hidden (Full is active), Standard moves to RIGHT (pushed by flow).
  // Balanced stiffness (70) and mass (1.2) for a cinematic but reactive transition.
  const slowSpring = scaledSpring(70, 20, 1.2);
  const smoothFlowRaw = { duration: 0.8, ease: "circOut" };
  const smoothFlow = scaleTransition({ ...smoothFlowRaw });

  const standardLateralChildVariants = {
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }) },
    hidden: { opacity: 0, x: 50, filter: "blur(4px)", transition: scaleTransition({ duration: 0.35, ease: "easeIn" }) }
  };
  const fullDashLateralChildVariants = {
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }) },
    hidden: { opacity: 0, x: -50, filter: "blur(4px)", transition: scaleTransition({ duration: 0.35, ease: "easeIn" }) }
  };

  /**
   * ⚓ ANCHOR PROTOCOL (PROTOCOL D'ANCRAGE)
   * 
   * CRITICAL ARCHITECTURAL DECISION:
   * To prevent "Layout Thrashing" (whitespace at bottom of page) when switching 
   * between full-page views (Standard <-> Full Dashboard), we MUST use the 
   * Anchor Protocol.
   * 
   * 1. HIDDEN STATE: position: "fixed"
   *    - The element is removed from the document flow.
   *    - It floats at top:0, width:100%.
   *    - It allows the *other* view to take up the full height immediately.
   * 
   * 2. VISIBLE STATE: position: "relative"
   *    - The element returns to the document flow.
   *    - It pushes content down naturally and enables scrolling.
   * 
   * DO NOT REMOVE 'position' PROPERTIES FROM THESE VARIANTS.
   */
  // HSI: position controlled via wrapper div, NOT variants. Motion ignores discrete CSS `position`.
  const standardVariants = {
    hidden: { 
        x: !hasEntered ? 0 : "100%", 
        y: !hasEntered ? 120 : 0, 
        opacity: 0, scale: 1, filter: "blur(10px)",
        transition: scaleTransition({ ...smoothFlowRaw, staggerChildren: 0.12 })
    },
    visible: { 
        x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: scaleTransition({ ...smoothFlowRaw, staggerChildren: 0.18, delayChildren: 0.08 })
    },
    exit: { x: "100%", opacity: 0, filter: "blur(10px)" }
  };

  const fullDashboardVariants = {
    hidden: { 
        x: "-100%", opacity: 0, scale: 1, filter: "blur(10px)",
        transition: scaleTransition({ ...smoothFlowRaw, staggerChildren: 0.12 })
    },
    visible: { 
        x: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: smoothFlow
    },
    exit: { x: "-100%", opacity: 0, filter: "blur(10px)" }
  };


  const monthKeys = ["month.jan","month.feb","month.mar","month.apr","month.may","month.jun","month.jul","month.aug","month.sep","month.oct","month.nov","month.dec"];
  const getDateRange = () => {
    const today = new Date(); const future = new Date(today); future.setDate(today.getDate() + 28);
    return `${today.getDate()} ${t(monthKeys[today.getMonth()])} - ${future.getDate()} ${t(monthKeys[future.getMonth()])} ${future.getFullYear()}`;
  };



  return (
    <div id="main-scroll-container" ref={scrollRef} className={`flex flex-col w-full bg-background ${step === 'dashboard' ? 'h-screen overflow-y-scroll overflow-x-hidden no-scrollbar' : 'h-[100dvh] overflow-hidden'}`}>
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-background">
          <motion.div className="absolute inset-0 w-full h-full" initial={{ opacity: step === 'dashboard' ? 1 : 0 }} animate={{ opacity: (step === 'dashboard' || isArrivingFromDashboard) ? 1 : 0 }} transition={scaleTransition({ duration: 1.2, ease: "easeInOut" })} style={{ backgroundImage: "linear-gradient(155deg, var(--app-background-gradient-start) 0%, var(--app-background-gradient-middle) 50%, var(--app-background-gradient-end) 100%)" }} />
          <motion.div className="absolute top-0 left-0 w-full h-full pointer-events-none" initial={{ opacity: step !== 'dashboard' ? 0.12 : 0 }} animate={{ opacity: (step === 'dashboard' || isArrivingFromDashboard) ? 0 : 0.12 }} transition={scaleTransition({ duration: 1.2, ease: "easeInOut" })} style={{ backgroundImage: "radial-gradient(ellipse 1300px 1100px at 50% -80px, var(--datavibe-primary) 10%, transparent 100%)" }} />
      </div>

      <div className={`relative z-10 w-full h-full flex flex-col transition-[filter] duration-300 ${isAuthFocused ? "blur-md pointer-events-none select-none" : ""}`}>
        {step !== 'dashboard' && (
             <div className="w-full absolute top-0 z-50">
                 <motion.div 
                    className="w-full" 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={(isArrivingFromDashboard || isInputFocused || isSyncCompleting || isExitingSearch) ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }} 
                    transition={scaleTransition({ duration: 1.0, ease: "easeOut" })}
                >
                     <OnboardingHeader 
                        showBack={step === 'search'} 
                        onBack={() => setStep("welcome")} 
                        showLogo={false} 
                        className="mb-2" 
                        rightAction={(isArrivingFromDashboard || isInputFocused) ? <div className="w-20" /> : (
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground rounded-full" onClick={toggleLanguage}>
                                    <Globe className="w-4 h-4" />
                                </Button>
                                <span className="text-xs font-bold uppercase text-foreground w-5 text-center">{language}</span>
                                <div className="scale-90 mr-3"><ModeToggle /></div>
                            </div>
                        )}
                    />
                 </motion.div>
            </div>
        )}

        <div className="flex-1 w-full relative">
            <AnimatePresence mode="popLayout">
                {step === 'welcome' && (
                    <motion.div key="welcome-step" className="w-full mx-auto px-4 h-full flex flex-col items-center" exit={{ opacity: 1, transition: scaleTransition({ duration: 1.4 }) }}>
                        <div className="pt-[12vh] flex flex-col items-center gap-6 w-full max-w-sm px-2 shrink-0">
                            <motion.div 
                                key="logo" 
                                initial={{ y: -60, opacity: 0 }} 
                                animate={{ y: 0, opacity: 1 }} 
                                transition={scaleTransition({ duration: 1.8, ease: "easeOut", delay: 0.5 })} 
                                exit={{ y: -600, opacity: 0, transition: scaleTransition({ duration: 1.2, ease: "easeInOut" }) }}
                                className="notranslate"
                                translate="no"
                            >
                                <Logo variant="splash" />
                            </motion.div>
                            <motion.p key="tagline" className="text-center text-muted-foreground text-sm font-medium tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 2.0, ease: "easeOut", delay: 1.0 })} exit={{ y: -500, opacity: 0, transition: scaleTransition({ duration: 1.2, ease: "easeInOut", delay: 0.1 }) }}>{t("onboarding.welcome_tagline")}</motion.p>
                        </div>
                        {/* Cinematic carousel zone — Desktop — fills space between tagline and button */}
                        <motion.div className="flex-1 w-full flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 0.8, delay: 2.5 })} exit={{ opacity: 0, transition: scaleTransition({ duration: 0.3 }) }}>
                            <WelcomeCarousel isExiting={isCarouselExiting} onExitComplete={() => setStep('search')} startDelay={3.0} />
                        </motion.div>
                    </motion.div>
                )}

                {(step === 'search' || step === 'sync') && (
                     <div className="w-full max-w-sm md:max-w-6xl mx-auto px-4 h-full flex flex-col items-center relative overflow-hidden">
                         <div className="absolute top-[12vh] w-full flex flex-col items-center">
                            <AnimatePresence>
                                {!isExitingSearch && step === 'search' && (
                                    <>
                                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.5 }) }} transition={scaleTransition({ duration: 0.6, ease: "easeOut", delay: 1.2 })} className="mb-8">
                                            <motion.button onClick={handleSpotifyLogin} className="flex items-center gap-2 px-4 py-2 bg-[#1DB954]/10 hover:bg-[#1DB954]/20 rounded-full transition-colors cursor-pointer border border-transparent hover:border-[#1DB954]/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <SpotifyIcon className="w-5 h-5 text-[#1DB954]" /><span className="text-[#1DB954] text-xs font-semibold">{t("onboarding.connect_spotify")}</span>
                                            </motion.button>
                                        </motion.div>
                                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.5, delay: 0.1 }) }} transition={scaleTransition({ duration: 0.6, ease: "easeOut", delay: 1.35 })} className="flex flex-col items-center w-full -mt-2">
                                            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">{t("onboarding.search_title")}</h2><p className="text-muted-foreground text-sm text-center">{t("onboarding.search_subtitle")}</p>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="w-full flex flex-col items-center mt-[30vh] relative z-20">
                            <motion.div 
                                layoutId="visiomorphic-container" 
                                className={`relative flex items-center justify-center overflow-hidden z-50 mx-auto transition-colors duration-0 shrink-0 ${isMorphingToSearch ? 'bg-transparent shadow-none border-none' : 'bg-card border border-border shadow-sm'}`} 
                                onLayoutAnimationComplete={() => { if (isArrivingFromDashboard) setTimeout(() => setIsArrivingFromDashboard(false), 200); }} 
                                initial={isArrivingFromDashboard ? { width: 56, height: 56, borderRadius: 28, y: 0, opacity: 1 } : { width: 352, height: 56, borderRadius: 16, y: 100, opacity: 0 }} 
                                animate={isSyncCompleting ? { width: 56, height: 56, borderRadius: 28, y: 0, opacity: 1, transition: scaleTransition({ duration: 0.7, ease: "easeInOut" }) } : isExitingSearch || step === 'sync' ? { width: 80, height: 80, borderRadius: 40, y: 0, opacity: 1, transition: scaleTransition({ type: "spring", stiffness: 180, damping: 22, delay: 0.1 }) } : isArrivingFromDashboard ? { width: 56, height: 56, borderRadius: 28, y: 0, opacity: 1, transition: scaleTransition({ layout: { type: "spring", stiffness: 200, damping: 24 }, width: { duration: 0 }, height: { duration: 0 }, borderRadius: { duration: 0 } }) } : { width: 352, height: 56, borderRadius: 16, y: 0, opacity: 1, transition: scaleTransition({ layout: { type: "spring", stiffness: 160, damping: 22 }, width: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, borderRadius: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, height: { duration: 0 } }) }}
                                style={{ maxWidth: "calc(100vw - 32px)" }}
                            >
                                <VisiomorphicShape mode='search' duration={1.0} delay={0} className={isMorphingToSearch ? "opacity-100" : "opacity-0"} />
                                <div className={`absolute inset-0 w-full h-full flex items-center px-4 transition-opacity duration-300 ${isExitingSearch || step === 'sync' || isArrivingFromDashboard ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}><Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" /><Input ref={inputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsInputFocused(true)} className="flex-1 !bg-transparent !border-none !shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-full text-base font-medium text-foreground placeholder:text-muted-foreground/70 relative z-10" placeholder={isInputFocused ? "" : t("onboarding.search_placeholder")} /></div>
                                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 delay-300 ${(isExitingSearch || step === 'sync') && !isSyncCompleting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}><span className="text-foreground text-xl font-bold font-manrope">{searchResults.find(a => a.id === selectedArtist)?.initial || "K"}</span></div>
                            </motion.div>
                            <AnimatePresence>
                                {step === 'sync' && (
                                    <motion.svg viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] -rotate-90 pointer-events-none z-10" initial={{ opacity: 0 }} animate={{ opacity: isSyncCompleting ? 0 : 1, scale: isSyncCompleting ? 0.8 : 1 }} exit={{ opacity: 0 }} transition={scaleTransition({ duration: 0.5 })}>
                                        <circle cx="50" cy="50" r="45" fill="none" className="stroke-muted/20" strokeWidth="4"></circle>
                                        <motion.circle cx="50" cy="50" r="45" fill="none" className="stroke-datavibe-primary" strokeWidth="4" strokeDasharray="283" strokeLinecap="round" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (syncProgress / 100)) }} transition={scaleTransition({ duration: 0.5, ease: "linear" })} style={{ filter: "blur(8px)", opacity: 0.7 }} />
                                        <motion.circle cx="50" cy="50" r="45" fill="none" className="stroke-datavibe-primary" strokeWidth="4" strokeDasharray="283" strokeLinecap="round" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 283 - (283 * (syncProgress / 100)) }} transition={scaleTransition({ duration: 0.5, ease: "linear" })} />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </div>
                         <div className="w-full relative mt-6 flex-1 overflow-y-auto no-scrollbar min-h-0 pb-8">
                            <AnimatePresence mode="wait">
                                {step === 'search' && searchResults.length > 0 && !isSearching && (
                                    <motion.div className="w-full max-w-[352px] mx-auto flex flex-col gap-3 mb-3 relative z-[60]" key="results" exit={{ opacity: 0, transition: scaleTransition({ duration: 0.5 }) }}>
                                        {searchResults.map((artist, i) => {
                                            const isSelected = selectedArtist === artist.id;
                                            const isFocused = focusedResultIndex === i;
                                            const itemDirection = i % 2 === 0 ? -1 : 1;
                                            return (
                                                <motion.div 
                                                    key={artist.id} 
                                                    layout 
                                                    initial={{ opacity: 0, x: itemDirection * 200, filter: "blur(10px)" }} 
                                                    animate={isExitingSearch 
                                                        ? { opacity: 0, x: itemDirection * 600, scale: 0.8, filter: "blur(20px)" } 
                                                        : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
                                                    } 
                                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: scaleTransition({ duration: 0.2 }) }} 
                                                    transition={isExitingSearch 
                                                        ? scaleTransition({ duration: 0.5, ease: "anticipate", delay: i * 0.03 }) 
                                                        : scaleTransition({ type: "spring", stiffness: 180, damping: 18, delay: i * 0.04 })
                                                    }
                                                    onClick={() => setSelectedArtist(artist.id)} 
                                                    onMouseEnter={() => setFocusedResultIndex(i)} 
                                                    className={`w-full p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors relative z-[60] ${isSelected ? "bg-datavibe-primary/10 border-datavibe-primary ring-1 ring-datavibe-primary/50" : isFocused ? "bg-accent border-accent-foreground/30" : "bg-card border-border hover:bg-accent hover:border-accent-foreground/30"}`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0"><span className="text-sm font-bold text-foreground">{artist.initial}</span></div><div className="flex-1 min-w-0 text-left"><div className="text-sm font-semibold text-foreground truncate" translate="no">{artist.name}</div><div className="text-xs text-muted-foreground truncate">{artist.listeners} • {artist.genre}</div></div>{isSelected && <div className="w-5 h-5 rounded-full bg-datavibe-primary text-white flex items-center justify-center shrink-0"><Check className="w-3 h-3 stroke-[3]" /></div>}
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                                {step === 'sync' && (
                                    <div className="flex flex-col items-center w-full absolute top-8">
                                        <motion.h2 className="text-xl font-bold text-foreground mb-2" initial={{ y: 50, opacity: 0, filter: "blur(5px)" }} animate={isSyncCompleting ? { x: "-100vw", opacity: 0, filter: "blur(10px)" } : { y: 0, opacity: 1, filter: "blur(0px)" }} transition={scaleTransition({ duration: 0.8, ease: "backIn", delay: isSyncCompleting ? 0 : 0.8 })}>{t("onboarding.sync_title")}</motion.h2>
                                        <motion.p className="text-muted-foreground text-xs mb-8" initial={{ y: 50, opacity: 0 }} animate={isSyncCompleting ? { x: "100vw", opacity: 0 } : { y: 0, opacity: 1 }} transition={scaleTransition({ duration: 0.8, ease: "backIn", delay: isSyncCompleting ? 0.15 : 0.9 })}>{t("onboarding.sync_subtitle")}</motion.p>
                                        <div className="flex flex-col gap-3 w-full max-w-[200px]">{[ { label: t("onboarding.sync_profile"), done: syncSteps.profile }, { label: t("onboarding.sync_stats"), done: syncSteps.stats }, { label: t("onboarding.sync_opps"), done: syncSteps.opportunities } ].map((item, idx) => ( <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={isSyncCompleting ? { x: idx % 2 === 0 ? "-150vw" : "150vw", opacity: 0 } : { opacity: 1, y: 0 }} transition={scaleTransition({ duration: 0.6, ease: "backIn", delay: isSyncCompleting ? 0.3 + (idx * 0.1) : 1.0 + (idx * 0.1) })}><StepItem label={item.label} isCompleted={item.done} /></motion.div> ))}</div>
                                    </div>
                                )}
                            </AnimatePresence>
                         </div>
                     </div>
                )}

                {/* --- STEP 4: DASHBOARD --- */}
                {step === 'dashboard' && (
                    <motion.div key="dashboard-container" className="w-full min-h-screen relative" exit={{ opacity: 1, transition: scaleTransition({ duration: 2.5 }) }}>
                        {/* SANCTUARY 1: UI WRAPPER */}
                        <motion.div 
                            key="dashboard-ui"
                            className="w-full min-h-screen flex flex-col relative"
                            initial="hidden" animate="visible" exit="exit"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: scaleTransition({ duration: 1.0, when: "beforeChildren" }) },
                                exit: { 
                                    opacity: 0, 
                                    transition: scaleTransition({ duration: 0.5, delay: 0.6, when: "afterChildren" }) 
                                }
                            }}
                        >
                            {/* Header */}
                            <motion.header 
                                className="h-16 flex items-center justify-between px-4 bg-header-background border-b border-header-border backdrop-blur-md z-20 fixed top-0 left-0 w-full"
                                initial={{ y: -200, opacity: 0 }} 
                                animate={isArrivingFromDashboard ? { y: -200, opacity: 0 } : { y: 0, opacity: 1 }} 
                                exit={{ y: -200, opacity: 0, transition: scaleTransition({ duration: 0.8, ease: "easeInOut", delay: 0.3 }) }} 
                                transition={scaleTransition({ duration: 0.8, ease: "circOut" })}
                            >
                                {/* Spacer for burger layout (unified burger/cross rendered after header) */}
                                <div className="w-10 h-10" />
                                <motion.div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer" onClick={handleLogoClick} animate={{ x: (isDropWaterActive || isLoggedIn) ? -20 : 0 }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} transition={(isDropWaterActive || isLoggedIn) ? scaleTransition({ duration: 0.8, ease: "easeInOut" }) : scaleTransition({ duration: 0.8, ease: "easeInOut", delay: 0.45 })}><motion.div className="flex items-center text-logo-default font-logo notranslate" translate="no" initial="hidden" animate="visible" variants={{ visible: { transition: scaleTransition({ staggerChildren: 0.05, delayChildren: 0.9 }) } }}>{['D','A','T','A'].map((l, i) => <motion.span key={`d-${i}`} variants={letterVariants} className="text-logo-primary">{l}</motion.span>)}{['V','I','B','E'].map((l, i) => <motion.span key={`v-${i}`} variants={letterVariants} className="text-logo-accent">{l}</motion.span>)}</motion.div></motion.div>
                                <motion.div className="flex items-center gap-3" initial="hidden" animate="visible" variants={{ visible: { transition: scaleTransition({ staggerChildren: 0.1, delayChildren: 1.2 }) } }}><motion.div className="hidden md:flex items-center gap-2 mr-4" animate={{ x: (isDropWaterActive || isLoggedIn) ? 40 : 0 }} transition={(isDropWaterActive || isLoggedIn) ? scaleTransition({ duration: 0.8, ease: "easeInOut" }) : scaleTransition({ duration: 0.8, ease: "easeInOut", delay: 0.45 })}><motion.div variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}><Button variant="ghost" size="icon" className="h-8 w-8 text-foreground rounded-full" onClick={toggleLanguage}><Globe className="w-4 h-4" /></Button></motion.div><motion.div variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }} className="w-6"><span className="text-xs font-bold uppercase text-foreground">{language}</span></motion.div><motion.div variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}><ModeToggle /></motion.div></motion.div><motion.div className="h-11 overflow-hidden" animate={{ width: isLoggedIn ? 0 : 44, opacity: isLoggedIn ? 0 : 1 }} transition={isLoggedIn ? scaleTransition({ duration: 0.4, ease: "easeInOut", delay: 0.2 }) : scaleTransition({ duration: 0.4, ease: "easeInOut", delay: 0.5 })} /> </motion.div>
                            </motion.header>

                            <motion.div 
                                className="w-full px-4 mt-[88px] mb-2 flex justify-start"
                                animate={{ x: isBilanView ? "110%" : 0, opacity: isBilanView ? 0 : 1 }}
                                transition={scaleTransition({ x: { duration: 0.45, ease: "circOut", delay: isBilanView ? 0.08 : 0.45 }, opacity: { duration: 0.25, delay: isBilanView ? 0.08 : 0.45 } })}
                            ><div className="w-14 h-14" /></motion.div>

                            {/* SANCTUARY 2: TABS WRAPPER */}
                            {!(isBilanView && (overlayPage === 'connexions' || overlayPage === 'offre' || overlayPage === 'legal' || overlayPage === 'apropos')) && (
                            <motion.div 
                                ref={tabsRef} 
                                className="relative w-full mb-6 mt-2 z-10 h-[26px]"
                            >
                                <motion.div 
                                    key="tabs-main-container" 
                                    className="absolute inset-0 w-full touch-pan-y"
                                    onPanEnd={(_e, info) => {
                                        // DISABLE SWIPE IF REFLEX OPPORTUNITY IS ACTIVE (JUST FOR ME)
                                        if (reflexDividedStates?.[contentTab]) return;

                                        // DISABLE SWIPE IF REFLEX OPPORTUNITY IS ACTIVE (JUST FOR ME)
                                        if (reflexDividedStates?.[contentTab]) return;

                                        const x = info.offset.x;
                                        const y = info.offset.y;
                                        if (Math.abs(x) > Math.abs(y) * 1.5 && Math.abs(x) > 40) {
                                            if (x < 0) handleSwipe(-1);
                                            else handleSwipe(1);
                                        }
                                    }}
                                    exit="exit"
                                    variants={{ 
                                        visible: { y: 0, opacity: 1, filter: "blur(0px)" },
                                        exit: { 
                                            y: 400, 
                                            opacity: 0, 
                                            filter: "blur(12px)", 
                                            transition: scaleTransition({ 
                                                duration: 0.6, 
                                                ease: "easeIn",
                                                staggerChildren: 0.1, 
                                                staggerDirection: 1 
                                            }) 
                                        } 
                                    }}
                                >
                                    {/* SLOT: TABS */}
                                    <DashboardTabsSlot 
                                        socialTabRef={socialTabRef}
                                        isFullDashboard={isFullDashboard} 
                                        activeTab={activeTab} 
                                        onTabChange={(id: string) => { if (isBilanView) { bilanActiveTabRef.current = id; } else { standardActiveTabRef.current = id; } setActiveTab(id); setContentTab(id); setSubTab("dashboard"); }} 
                                        subTab={subTab}
                                        onSubTabChange={(id: string) => setSubTab(id)}
                                        isReturning={isReturning}
                                        isArrivingFromDashboard={isArrivingFromDashboard}
                                        showStickyNav={showStickyNav}
                                        isMorphingToSearch={isMorphingToSearch}
                                        direction={direction}
                                        overlayPage={overlayPage}
                                        isBilanView={isBilanView}
                                    />
                                </motion.div>
                            </motion.div>
                            )}

                            {/* USER PANEL removed from scroll flow — now rendered as fixed overlay below */}

                            {/* SANCTUARY 3: CONTENT AREA */}
                            <motion.div 
                                className="w-full grid grid-cols-1 items-start gap-4 pb-4 z-10 p-[0px] touch-pan-y relative"
                                onPanEnd={(_e, info) => {
                                    // DISABLE SWIPE IF REFLEX OPPORTUNITY IS ACTIVE (JUST FOR ME)
                                    if (reflexDividedStates?.[contentTab]) return;

                                    const x = info.offset.x;
                                    const y = info.offset.y;
                                    // Robust check: Horizontal must be dominant and significant
                                    if (Math.abs(x) > Math.abs(y) * 1.5 && Math.abs(x) > 40) {
                                        if (x < 0) handleSwipe(-1); 
                                        else handleSwipe(1);
                                    }
                                }}
                            >
                                    {/* HSI wrapper World 1 Desktop */}
                                    <div style={{ gridColumn: 1, gridRow: 1, position: (!isFullDashboard && !isBilanView) ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', overflow: (!isFullDashboard && !isBilanView) ? 'visible' as const : 'hidden' as const, height: (!isFullDashboard && !isBilanView) ? 'auto' : 0, pointerEvents: (!isFullDashboard && !isBilanView) ? 'auto' as const : 'none' as const, zIndex: (!isFullDashboard && !isBilanView) ? 10 : 0 }}>
                                    <motion.div 
                                        key="standard-dashboard-view"
                                        className="flex flex-col gap-6 w-full px-4 pb-32"
                                        animate={(!isFullDashboard && !isBilanView) ? "visible" : "hidden"}
                                        variants={standardVariants}
                                    >
                                            {/* 1. NEW: Hello Block (Static, Top of Stack) */}




                                            {/* 3. MODIFIED: Dashboard Main Block (Top of Stack) */}
                                            <motion.div className="w-full" variants={standardLateralChildVariants}>
                                            <AnimatePresence mode="popLayout" custom={direction}>
                                                {/* --- STREAMING BLOCK --- */}
                                                {contentTab === 'streaming' && (
                                                    <motion.div 
                                                        key="streaming-main-block"
                                                        className="bg-dashboard-block-streaming-bg backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-5 relative shadow-sm z-20" 
                                                        initial="hidden" 
                                                        animate={isArrivingFromDashboard ? "exit" : "visible"} 
                                                        exit="exit"
                                                        variants={{ 
                                                            hidden: { opacity: 0, y: isDashboardEntry ? 100 : 0, x: isDashboardEntry ? 0 : (direction > 0 ? -100 : 100) }, 
                                                            visible: { 
                                                                opacity: 1, y: 0, x: 0,
                                                                transition: scaleTransition({ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: isDashboardEntry ? 0.4 : 0.1, staggerChildren: 0.1 })
                                                            }, 
                                                            exit: { 
                                                                y: (isReturning || isArrivingFromDashboard) ? 100 : 0, 
                                                                x: (isReturning || isArrivingFromDashboard) ? 0 : (direction > 0 ? 100 : -100), 
                                                                opacity: 0, 
                                                                transition: scaleTransition({ duration: 0.3, ease: "easeIn" }) 
                                                            } 
                                                        }}
                                                    >
                                                        <div aria-hidden="true" className="absolute inset-0 border border-dashboard-block-streaming-border rounded-[16px] pointer-events-none z-0" />
                                                        
                                                        {/* Header: Date + Positive Badge */}
                                                        <div className="flex justify-between items-center w-full z-10 relative">
                                                            <motion.div 
                                                                className="flex items-center font-manrope text-foreground" 
                                                                animate={{ color: 'var(--dashboard-welcome-text)' }} 
                                                            >
                                                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">{getDateRange()}</p>
                                                            </motion.div>
                                                            
                                                            <div 
                                                                className="px-3 py-1.5 rounded-xl flex items-center gap-2 border bg-[#4CAF50]/10 border-[#4CAF50]/20"
                                                            >
                                                                <TrendingUp className="w-4 h-4" style={{ color: "#4CAF50" }} />
                                                                <span className="text-[14px] font-bold leading-normal" style={{ color: "#4CAF50" }}>{t('status.growing')}</span>
                                                            </div>
                                                        </div>

                                                        {/* Body: Streaming Content */}
                                                        <div className="relative w-full z-10">
                                                            <DashboardBodySlot 
                                                                contentTab="streaming"
                                                                direction={direction} 
                                                                isEntry={!isReturning} 
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                reflexDividedStates={reflexDividedStates}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                opportunityData={opportunityData}
                                                            />
                                                        </div>

                                                        {/* Footer: Streaming Opportunity */}
                                                        <motion.div className="w-full z-10 relative mt-auto">
                                                             <DashboardFooterSlot 
                                                                contentTab="streaming"
                                                                direction={direction} 
                                                                t={t} 
                                                                opportunityData={opportunityData}
                                                                isEntry={!hasEntered && !isReturning} 
                                                                onNavigate={navigate} 
                                                                setIsFullDashboard={setIsFullDashboard}
                                                                onSubTabChange={setSubTab}
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                reflexDividedStates={reflexDividedStates}
                                                             />
                                                        </motion.div>
                                                    </motion.div>
                                                )}

                                                {/* --- SOCIAL BLOCK --- */}
                                                {contentTab === 'social' && (
                                                    <motion.div 
                                                        key="social-main-block"
                                                        className="bg-dashboard-action-social-bg backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-4 relative shadow-sm z-20" 
                                                        initial="hidden" 
                                                        animate={isArrivingFromDashboard ? "exit" : "visible"} 
                                                        exit="exit"
                                                        variants={{ 
                                                            hidden: { opacity: 0, y: isDashboardEntry ? 100 : 0, x: isDashboardEntry ? 0 : (direction > 0 ? -100 : 100) }, 
                                                            visible: { 
                                                                opacity: 1, y: 0, x: 0,
                                                                transition: scaleTransition({ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: isDashboardEntry ? 0.4 : 0.1, staggerChildren: 0.1 })
                                                            }, 
                                                            exit: { 
                                                                y: (isReturning || isArrivingFromDashboard) ? 100 : 0, 
                                                                x: (isReturning || isArrivingFromDashboard) ? 0 : (direction > 0 ? 100 : -100), 
                                                                opacity: 0, 
                                                                transition: scaleTransition({ duration: 0.3, ease: "easeIn" }) 
                                                            } 
                                                        }}
                                                    >
                                                        <div aria-hidden="true" className="absolute inset-0 border border-dashboard-action-social-border rounded-[16px] pointer-events-none z-0" />
                                                        
                                                        {/* Header: Date + Badge (Positive or Locked) */}
                                                        <div className="flex justify-between items-center w-full z-10 relative">
                                                            <motion.div 
                                                                className="flex items-center font-manrope text-foreground" 
                                                                animate={{ color: 'var(--dashboard-welcome-text)' }} 
                                                            >
                                                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">{getDateRange()}</p>
                                                            </motion.div>
                                                            
                                                            {socialsConnected ? (
                                                            <div 
                                                                className="px-3 py-1.5 rounded-xl flex items-center gap-2 border bg-[#4CAF50]/10 border-[#4CAF50]/20"
                                                            >
                                                                <TrendingUp className="w-4 h-4" style={{ color: "#4CAF50" }} />
                                                                <span className="text-[14px] font-bold leading-normal" style={{ color: "#4CAF50" }}>{t('status.growing')}</span>
                                                            </div>
                                                            ) : (
                                                            <div 
                                                                className="px-3 py-1.5 rounded-xl flex items-center gap-2 border bg-white/5 border-white/15"
                                                            >
                                                                <Lock className="w-4 h-4 text-white/40" />
                                                                <span className="text-[14px] font-bold leading-normal text-white/40">{t('status.locked')}</span>
                                                            </div>
                                                            )}
                                                        </div>

                                                        {/* Body: Social Content */}
                                                        <div className="relative w-full z-10">
                                                            <DashboardBodySlot 
                                                                contentTab="social"
                                                                direction={direction} 
                                                                isEntry={!isReturning} 
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                reflexDividedStates={reflexDividedStates}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                opportunityData={opportunityData}
                                                                socialsConnected={socialsConnected}
                                                            />
                                                        </div>

                                                        {/* Footer: Social Actions */}
                                                        <motion.div className="w-full z-10 relative mt-auto">
                                                             <DashboardFooterSlot 
                                                                contentTab="social"
                                                                direction={direction} 
                                                                t={t} 
                                                                opportunityData={opportunityData}
                                                                isEntry={!hasEntered && !isReturning} 
                                                                onNavigate={navigate} 
                                                                setIsFullDashboard={setIsFullDashboard}
                                                                onSubTabChange={setSubTab}
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                reflexDividedStates={reflexDividedStates}
                                                                socialsConnected={socialsConnected}
                                                             />
                                                        </motion.div>
                                                    </motion.div>
                                                )}

                                                {/* Platform connect rows when socials are not connected */}
                                                {contentTab === 'social' && !socialsConnected && (
                                                    <SocialPlatformConnect onAllConnected={() => setSocialsConnected(true)} />
                                                )}

                                                {/* --- RADIO BLOCK --- */}
                                                {contentTab === 'radio' && (
                                                    <motion.div 
                                                        key="radio-main-block"
                                                        className="bg-[rgba(18,134,243,0.1)] backdrop-blur-[5px] rounded-[16px] p-[17px] flex flex-col gap-5 relative shadow-sm z-20" 
                                                        initial="hidden" 
                                                        animate={isArrivingFromDashboard ? "exit" : "visible"} 
                                                        exit="exit"
                                                        variants={{ 
                                                            hidden: { opacity: 0, y: isDashboardEntry ? 100 : 0, x: isDashboardEntry ? 0 : (direction > 0 ? -100 : 100) }, 
                                                            visible: { 
                                                                opacity: 1, y: 0, x: 0,
                                                                transition: scaleTransition({ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: isDashboardEntry ? 0.4 : 0.1, staggerChildren: 0.1 })
                                                            }, 
                                                            exit: { 
                                                                y: (isReturning || isArrivingFromDashboard) ? 100 : 0, 
                                                                x: (isReturning || isArrivingFromDashboard) ? 0 : (direction > 0 ? 100 : -100), 
                                                                opacity: 0, 
                                                                transition: scaleTransition({ duration: 0.3, ease: "easeIn" }) 
                                                            } 
                                                        }}
                                                    >
                                                        <div aria-hidden="true" className="absolute inset-0 border border-[rgba(18,134,243,0.6)] rounded-[16px] pointer-events-none z-0" />
                                                        
                                                        {/* Header: Date + Negative Badge */}
                                                        <div className="flex justify-between items-center w-full z-10 relative">
                                                            <motion.div 
                                                                className="flex items-center font-manrope text-foreground" 
                                                                animate={{ color: 'var(--dashboard-welcome-text)' }} 
                                                            >
                                                                <p className="text-[13.2px] font-normal leading-normal whitespace-nowrap">{getDateRange()}</p>
                                                            </motion.div>
                                                            
                                                            <div 
                                                                className="px-3 py-1.5 rounded-xl flex items-center gap-2 border"
                                                                style={{ backgroundColor: "rgba(244, 67, 54, 0.1)", borderColor: "rgba(244, 67, 54, 0.1)" }}
                                                            >
                                                                <TrendingDown className="w-4 h-4" style={{ color: "#F44336" }} />
                                                                <span className="text-[14px] font-bold leading-normal" style={{ color: "#F44336" }}>{t('status.declining')}</span>
                                                            </div>
                                                        </div>

                                                        {/* Body: Radio Content */}
                                                        <div className="relative w-full z-10">
                                                            <DashboardBodySlot 
                                                                contentTab="radio"
                                                                direction={direction} 
                                                                isEntry={!isReturning} 
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                reflexDividedStates={reflexDividedStates}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                opportunityData={opportunityData}
                                                            />
                                                        </div>

                                                        {/* Footer: Radio Opportunity */}
                                                        <motion.div className="w-full z-10 relative mt-auto">
                                                             <DashboardFooterSlot 
                                                                contentTab="radio"
                                                                direction={direction} 
                                                                t={t} 
                                                                opportunityData={opportunityData}
                                                                isEntry={!hasEntered && !isReturning} 
                                                                onNavigate={navigate} 
                                                                setIsFullDashboard={setIsFullDashboard}
                                                                onSubTabChange={setSubTab}
                                                                isFullDashboard={isFullDashboard}
                                                                isMorphingToSearch={isMorphingToSearch}
                                                                setReflexDividedStates={setReflexDividedStates}
                                                                reflexDividedStates={reflexDividedStates}
                                                             />
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            </motion.div>

                                            {/* 2. NEW POSITION: Reflex Opportunity (Moved to Bottom) — hidden when social locked */}
                                            {!(contentTab === 'social' && !socialsConnected) && (
                                            <motion.div className="w-full" variants={standardLateralChildVariants}>
                                            <motion.div 
                                                key="reflex-opportunity-block"
                                                className="w-full relative" 
                                                initial="hidden" 
                                                animate={isArrivingFromDashboard ? "exit" : "visible"} 
                                                exit="exit"
                                                variants={{ 
                                                    hidden: { opacity: 0, y: 100 }, 
                                                    visible: { 
                                                        opacity: 1, y: 0, 
                                                        transition: scaleTransition({ duration: 0.7, ease: "easeOut", delay: isDashboardEntry ? 0.5 : 0.4 })
                                                    }, 
                                                    exit: { 
                                                        opacity: 0, y: 100, 
                                                        transition: scaleTransition({ duration: 0.3, ease: "easeIn", delay: 0.1 }) 
                                                    } 
                                                }}
                                            >
                                                <ReflexOpportunity 
                                                    namespace={contentTab} 
                                                    data={opportunityData[contentTab]} 
                                                    isDivided={reflexDividedStates[contentTab]}
                                                    setIsDivided={(val) => {
                                                        const newValue = typeof val === 'function' ? val(reflexDividedStates[contentTab]) : val;
                                                        setReflexDividedStates(prev => ({ ...prev, [contentTab]: newValue }));
                                                    }}
                                                    direction={direction}
                                                />
                                            </motion.div>
                                            </motion.div>
                                            )}

                                        </motion.div>
                                    </div>{/* /HSI wrapper World 1 Desktop */}
                        {/* Full Dashboard View — HSI wrapper World 2 Desktop */}
                        <div style={{ gridColumn: 1, gridRow: 1, position: (isFullDashboard && !isBilanView) ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', overflow: (isFullDashboard && !isBilanView) ? 'visible' as const : 'hidden' as const, height: (isFullDashboard && !isBilanView) ? 'auto' : 0, pointerEvents: (isFullDashboard && !isBilanView) ? 'auto' as const : 'none' as const, zIndex: (isFullDashboard && !isBilanView) ? 10 : 0 }}>
                        <motion.div 
                            key="full-dashboard-view"
                            className="flex flex-col gap-6 w-full px-4 pb-32"
                            animate={(isFullDashboard && !isBilanView) ? "visible" : "hidden"}
                            variants={{
                                ...fullDashboardVariants,
                                visible: {
                                    ...fullDashboardVariants.visible,
                                    transition: scaleTransition({
                                        ...smoothFlowRaw,
                                        staggerChildren: 0.2,
                                        delayChildren: 0.1
                                    })
                                }
                            }}
                        >
                            {/* --- STREAMING FULL DASHBOARD --- */}
                            {activeTab === 'streaming' && (
                                <motion.div className="w-full" variants={fullDashLateralChildVariants}>
                                <div className="w-full flex flex-col gap-6">
                                    <StreamingDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                </div>
                                </motion.div>
                            )}
                            {activeTab === 'streaming' && (
                                <motion.div className="w-full" variants={fullDashLateralChildVariants}>
                                <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                    {subTab === 'dashboard' && (
                                        <motion.div key="streaming-dash" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                            <StreamingPerformanceUnified hideChart={true} direction={subTabDirection} />
                                            <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><PlaylistAnalysis /></motion.div>
                                        </motion.div>
                                    )}
                                    {subTab === 'performance' && (
                                        <motion.div key="streaming-perf" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full">
                                            <StreamingPerformanceUnified hideStats={true} direction={subTabDirection} />
                                        </motion.div>
                                    )}
                                    {subTab === 'playlists' && (
                                        <motion.div key="streaming-play" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                            <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><WeightedStreamsCard /></motion.div>
                                            <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><LatestPerformanceCard /></motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                </motion.div>
                            )}

                            {/* --- SOCIAL FULL DASHBOARD --- */}
                            {activeTab === 'social' && (
                                <motion.div className="w-full" variants={fullDashLateralChildVariants}>
                                <motion.div className="w-full flex flex-col gap-6" initial="enter" animate="center" exit="exit" variants={containerVariants}>
                                    <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full">
                                        <SocialDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                    </motion.div>
                                    <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                        {subTab === 'dashboard' && (
                                            <motion.div key="social-dash-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SocialPerformanceOverview /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SocialEngagementCard /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'subscribers' && (
                                            <motion.div key="social-subs-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><PlatformDistribution /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><BestPlatforms /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'demographics' && (
                                            <motion.div key="social-demo-content" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscriberAnalysis /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscribersByGender /></motion.div>
                                                 <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><SubscribersByAge /></motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                </motion.div>
                            )}

                            {/* --- RADIO FULL DASHBOARD --- */}
                            {activeTab === 'radio' && (
                                <motion.div className="w-full" variants={fullDashLateralChildVariants}>
                                <motion.div key="radio-dash-container" initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-6">
                                     {/* Fixed Header Component */}
                                    <div className="w-full relative z-10">
                                        <RadioDashboardHeader activeTab={subTab} direction={subTabDirection} />
                                    </div>

                                    {/* Scrollable/Swipable Content */}
                                    <AnimatePresence mode="popLayout" custom={subTabDirection}>
                                        {subTab === 'dashboard' && (
                                            <motion.div key="radio-dash" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioPerformanceOverview /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><AnalyseDes5PrincipauxPays /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'countries' && (
                                            <motion.div key="radio-countries" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioCountriesAnalysis /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><RadioStationDistribution /></motion.div>
                                            </motion.div>
                                        )}
                                        {subTab === 'strategy' && (
                                            <motion.div key="radio-strategy" custom={subTabDirection} variants={containerVariants} initial="enter" animate="center" exit="exit" className="w-full flex flex-col gap-4">
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaPerformanceCards /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaStrategyCard /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaActionCard /></motion.div>
                                                <motion.div custom={subTabDirection} variants={childSlideVariants} className="w-full"><MediaCampaignCard /></motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                </motion.div>
                            )}
                        </motion.div>
                        </div>{/* /HSI wrapper World 2 Desktop */}

                        {/* World 3: Bilan View (Desktop) — HSI wrapper World 3 Desktop */}
                        <div style={{ gridColumn: 1, gridRow: 1, position: isBilanView ? 'relative' as const : 'absolute' as const, top: 0, left: 0, width: '100%', pointerEvents: isBilanView ? 'auto' as const : 'none' as const, zIndex: isBilanView ? 10 : 0 }}>
                        <motion.div 
                            key="bilan-view" 
                            className="flex flex-col gap-6 w-full px-4 pb-32" 
                            animate={isBilanView ? "visible" : "hidden"} 
                            variants={{
                                hidden: { 
                                    x: "-100%", 
                                    opacity: 0, scale: 1, filter: "blur(10px)",
                                    transition: scaleTransition({ duration: 0.5, ease: "circOut", staggerChildren: 0.08 })
                                },
                                visible: { 
                                    x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
                                    transition: scaleTransition({ duration: 0.6, ease: "circOut", staggerChildren: 0.12, delayChildren: 0.55 })
                                }
                            }}
                        >
                            {/* Bilan Content (Desktop): title + blocks wrapped in AnimatePresence for inter-tab Spatial Flow */}
                            {/* FIX: AnimatePresence always mounted — isBilanView controls child presence so exit animations play */}
                            <AnimatePresence mode="wait" initial={false}>
                            {isBilanView && (
                                <motion.div
                                    key={`${overlayPage}-desk-tab-${activeTab}`}
                                    className="w-full flex flex-col gap-6"
                                    variants={{ hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1, transition: scaleTransition({ duration: 0.5, ease: "circOut" }) } }}
                                    initial={overlaySwapRef.current ? { opacity: 0, x: -80, filter: "blur(6px)" } : (bilanTabDirection !== 0 ? { opacity: 0, x: bilanTabDirection > 0 ? -80 : 80, filter: "blur(6px)" } : false)}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)", transition: scaleTransition({ duration: 0.4, ease: "easeOut" }) }}
                                    exit={overlaySwapRef.current ? { opacity: 0, x: 80, filter: "blur(6px)", transition: scaleTransition({ duration: 0.48, opacity: { delay: 0.2, duration: 0.28 }, x: { duration: 0.42 }, filter: { duration: 0.38 } }) } : { opacity: 0, x: bilanTabDirection > 0 ? 80 : -80, filter: "blur(6px)", transition: scaleTransition({ duration: 0.48, opacity: { delay: 0.2, duration: 0.28 }, x: { duration: 0.42 }, filter: { duration: 0.38 } }) }}
                                >
                                    {overlayPage === 'connexions' ? (
                                        <ConnexionsContentBlocks />
                                    ) : overlayPage === 'offre' ? (
                                        <OffreContentBlocks />
                                    ) : overlayPage === 'legal' ? (
                                        <LegalContentBlocks />
                                    ) : overlayPage === 'apropos' ? (
                                        <AboutContentBlocks />
                                    ) : (
                                    <>
                                    <div className="flex flex-col gap-[2px] px-1 w-full relative items-center">
                                        <h2 className="font-manrope font-bold text-[22px] text-foreground text-center leading-tight">{overlayPage === 'niveau' ? `${t('bilan.level')} ${t(TAB_LABEL_KEYS[activeTab])}` : `${t('bilan.pageTitle')} ${t(TAB_LABEL_KEYS[activeTab])}`}</h2>
                                        <p className="font-manrope font-normal text-[14px] text-center text-muted-foreground leading-tight">{t('bilan.overview')}</p>
                                    </div>
                                    {overlayPage === 'bilan' ? (
                                        <>
                                            {activeTab === 'streaming' && (
                                                <BilanContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                            {activeTab === 'social' && (
                                                <BilanSocialContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                            {activeTab === 'radio' && (
                                                <BilanMediaContentBlocks 
                                                    period={bilanPeriod} 
                                                    onPeriodChange={(p) => setBilanPeriod(p)} 
                                                    periodTabsRef={bilanPeriodTabsRef}
                                                    tabDirection={bilanTabDirection}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <NiveauContentBlocks 
                                            activeTab={activeTab} 
                                            period={bilanPeriod} 
                                            onPeriodChange={(p) => setBilanPeriod(p)} 
                                            periodTabsRef={bilanPeriodTabsRef}
                                            tabDirection={bilanTabDirection}
                                        />
                                    )}
                                    </>
                                    )}
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </motion.div>
                        </div>{/* /HSI wrapper World 3 Desktop */}

                            </motion.div>
                        </motion.div>

                        {/* VISIOMORPHIC CIRCLE */}
                        <motion.div key="dashboard-circle-wrapper" className={`fixed top-[88px] left-4 z-40 perspective-[1000px] ${isLoggedIn ? 'pointer-events-none' : ''}`} animate={{ x: isBilanView ? "110vw" : 0 }} transition={scaleTransition({ x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0 : 0.35 } })}>
                            <motion.div 
                                layoutId={(isDropWaterActive || isClosingAuth) ? undefined : "visiomorphic-container"}
                                className={`w-14 h-14 bg-card rounded-full shadow-sm border border-border relative z-20 ${isLoggedIn ? 'pointer-events-none' : 'cursor-pointer'}`}
                                style={{ transformStyle: "preserve-3d" }} 
                                animate={{ 
                                    rotateY: isFullDashboard ? 180 : 0, 
                                    opacity: (isDropWaterActive || isLoggedIn) ? 0 : 1,
                                    scale: 1,
                                    x: isDropWaterActive ? "calc(50vw - 44px)" : 0 
                                }} 
                                transition={
                                    isDropWaterActive
                                    ? { 
                                        // ALLER (Vers Auth)
                                        layout: { duration: 2.0, ease: [0.2, 0.8, 0.2, 1] }, 
                                        rotateY: { duration: 1.1, ease: "easeInOut" },
                                        x: { duration: 0.6, ease: "circOut" },
                                        opacity: { duration: 0.1, delay: 0.6 }
                                    }
                                    : {
                                        // RETOUR (Vers Dashboard) - INVERSE EXACT
                                        layout: { duration: 2.0, ease: [0.2, 0.8, 0.2, 1] },
                                        rotateY: { duration: 1.1, ease: "easeInOut" },
                                        opacity: { duration: 0.1, delay: 0 },
                                        x: { duration: 0.6, ease: "circIn" }
                                    }
                                } 
                                initial={isSyncCompleting ? { borderRadius: 40 } : { borderRadius: 40, opacity: 0, scale: 0.8 }} 
                                exit={{ opacity: 0, scale: 0.8, transition: scaleTransition({ duration: 0.2 }) }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center rounded-full" style={{ backfaceVisibility: "hidden" }} onClick={() => { 
                                    flushSync(() => { 
                                        setIsArrivingFromDashboard(true); 
                                        setIsInputFocused(true); // Activer l'état focus immédiatement
                                    }); 
                                    setTimeout(() => {
                                        setStep('search'); 
                                        setSearchQuery(""); 
                                        setSearchResults([]); 
                                        setSelectedArtist(null); 
                                        setIsSearching(false); 
                                        setSyncProgress(0); 
                                        setSyncSteps({ profile: false, stats: false, opportunities: false }); 
                                        setIsSyncCompleting(false); 
                                        setIsExitingSearch(false);
                                        
                                        // Forcer le focus sur l'input après le changement de step
                                        setTimeout(() => {
                                            inputRef.current?.focus();
                                        }, 50);
                                    }, 200);
                                }}>
                                    <motion.span className="absolute text-xl font-bold text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 0 }} transition={scaleTransition({ duration: 0 })}><span className="sr-only">K</span></motion.span><motion.div className="absolute" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={scaleTransition({ duration: 0.4, delay: 0.3 })}><Search className="w-5 h-5 text-muted-foreground" /></motion.div>
                                </div>

                                {/* HELLO BLOCK MOVED HERE */}
                                {/* Hello block stays visible even when UserPanel is open */}
                                {subTab === 'dashboard' && !isFullDashboard && !isBilanView && (
                                    <motion.div 
                                        className="absolute left-[72px] top-1/2 -translate-y-1/2 flex flex-col items-start font-manrope text-foreground whitespace-nowrap pointer-events-none" 
                                        style={{ transformOrigin: "-44px 50%", display: (subTab === 'dashboard' && !isFullDashboard) ? 'flex' : 'none' }}
                                        initial="visible"
                                        animate={isDropWaterActive ? "eclipse" : ((subTab === 'dashboard' && isScrolled) ? "scrolled" : "visible")}
                                        variants={{ 
                                            visible: { 
                                                opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)",
                                                transition: scaleTransition({ duration: 0.6, ease: "easeOut", delay: !hasEntered ? 0.5 : 0.3 })
                                            }, 
                                            scrolled: {
                                                opacity: 0, y: -50, rotateY: 180, filter: "blur(10px)",
                                                transition: scaleTransition({ duration: 0.3, ease: "easeOut" })
                                            },
                                            eclipse: {
                                                opacity: 0, rotateY: 90, x: -20, filter: "blur(5px)",
                                                transition: scaleTransition({ duration: 0.4, ease: "easeIn" }) // [Desktop Fix] Disparition rapide (0.4s) avant fusion
                                            }
                                        }}
                                    >
                                        <p className="text-[13.2px] font-normal leading-normal">{t("onboarding.hello")}</p>
                                        <div className="text-[20.2px] leading-normal flex items-center gap-2">
                                            <span className="font-bold" translate="no">{searchResults.find(a => a.id === selectedArtist)?.name || "KS Bloom"}</span>
                                            <span className="font-normal"> 👋</span>
                                        </div>
                                    </motion.div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-dashboard-back-btn-bg" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties} onClick={(e) => { e.stopPropagation(); setIsReturning(true); setTimeout(() => { setIsFullDashboard(false); }, 200); setTimeout(() => setIsReturning(false), 1400); }}><motion.div className="w-auto h-auto flex items-center justify-center" animate={{ rotateY: isReturning ? 180 : 0 }} transition={scaleTransition({ duration: 0.6, ease: "easeInOut" })}><ChevronLeft size={28} strokeWidth={2} color="var(--stroke-0, white)" /></motion.div></div>
                            </motion.div>
                        </motion.div>

                        {/* BILAN CLOSE CIRCLE (Desktop) — Enters from LEFT when isBilanView */}
                        <motion.div 
                            key="bilan-close-circle-desktop"
                            className="fixed top-[88px] left-4 z-40 pointer-events-auto"
                            animate={{ 
                                x: isBilanView ? 0 : -80, 
                                opacity: isBilanView ? 1 : 0,
                                scale: isBilanView ? 1 : 0.5
                            }}
                            transition={scaleTransition({ 
                                x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0.35 : 0 },
                                opacity: { duration: 0.3, delay: isBilanView ? 0.35 : 0 },
                                scale: { duration: 0.4, ease: "circOut", delay: isBilanView ? 0.35 : 0 }
                            })}
                            style={{ pointerEvents: isBilanView ? "auto" : "none" }}
                        >
                            <div 
                                className="w-14 h-14 rounded-full bg-dashboard-back-btn-bg flex items-center justify-center cursor-pointer shadow-sm"
                                style={{ "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties}
                                onClick={() => { bilanActiveTabRef.current = activeTab; setActiveTab(standardActiveTabRef.current); setContentTab(standardActiveTabRef.current); setIsFullDashboard(bilanFromFullRef.current); setIsBilanView(false); const sc = document.getElementById('main-scroll-container'); if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            >
                                <X size={24} strokeWidth={2} color="var(--stroke-0, white)" />
                            </div>
                        </motion.div>

                        {activeTab === 'streaming' && <StreamingBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                        {activeTab === 'social' && <SocialBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                        {activeTab === 'radio' && <RadioBottomNav activeTab={subTab} onTabChange={(id) => setSubTab(id)} isVisible={isFullDashboard && showStickyNav} />}
                        
                        <MainBottomNav 
                            activeTab={contentTab} 
                            onTabChange={(id) => {
                                standardActiveTabRef.current = id;
                                setActiveTab(id);
                                setContentTab(id);
                                setSubTab("dashboard");
                            }} 
                            isVisible={!isFullDashboard && !isBilanView && showStickyNav} 
                        />
                        {/* Bilan Main Nav (Desktop) — TAF Transmigration des Âmes for Streaming/Réseaux/Médias */}
                        <BilanBottomNav 
                            activeTab={contentTab} 
                            onTabChange={(id) => {
                                standardActiveTabRef.current = id;
                                setActiveTab(id);
                                setContentTab(id);
                                setSubTab("dashboard");
                            }} 
                            isVisible={isBilanView && overlayPage !== 'connexions' && overlayPage !== 'offre' && overlayPage !== 'legal' && overlayPage !== 'apropos' && showStickyNav} 
                        />

                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {step !== 'dashboard' && (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto z-20 pb-20 md:pb-12 px-6 mt-auto">
                 <AnimatePresence mode="wait">
                    {step !== 'sync' && (
                        <motion.div key="main-button" className="w-full relative" layoutId="visiomorphic-button" initial={{ y: 50, opacity: 0 }} animate={isExitingSearch ? { y: 200, opacity: 0 } : { y: 0, opacity: 1 }} transition={scaleTransition({ duration: isExitingSearch ? 0.5 : 1.2, ease: isExitingSearch ? "backIn" : "easeOut", delay: isExitingSearch ? 0 : 1.5 })} exit={{ y: 200, opacity: 0, transition: scaleTransition({ duration: 0.5, ease: "easeInOut" }) }}>
                            <Button size="lg" disabled={step === 'search' && !selectedArtist} className={`w-full rounded-full font-semibold text-base h-12 transition-all duration-500 text-white border-none flex items-center justify-center gap-2 overflow-hidden ${step === 'search' && !selectedArtist ? "bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-[0_0_20px_rgba(0,0,0,0)]" : "bg-gradient-to-r from-datavibe-primary to-datavibe-purple shadow-[0_0_20px_var(--effect-glow-primary-strong)] hover:shadow-[0_0_25px_var(--effect-glow-primary)]"}`} onClick={step === 'welcome' ? () => { setIsCarouselExiting(true); } : handleStartSync}>
                                <AnimatePresence mode="wait" initial={false}>
                                    {step === 'welcome' ? ( <motion.span key="btn-text-welcome" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, transition: scaleTransition({ duration: 0.2 }) }}>{t("onboarding.start")}</motion.span> ) : ( <div className="flex items-center"><motion.span key="btn-text-search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ delay: 0.1 })}>{t("onboarding.its_me")}</motion.span><motion.div initial={{ width: 0, opacity: 0, x: 50 }} animate={{ width: "auto", opacity: 1, x: 0 }} transition={scaleTransition({ type: "spring", stiffness: 200, damping: 20, delay: 0.3 })} className="ml-2"><span className="text-lg leading-none block">🎤</span></motion.div></div> )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    )}
                 </AnimatePresence>
                 <div className="relative h-6 w-full flex justify-center">
                    <AnimatePresence mode="wait">
                        {step === 'welcome' && ( <motion.p key="link-welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={scaleTransition({ duration: 1.5, delay: 1.8 })} exit={{ opacity: 0 }} className="absolute text-xs text-muted-foreground">{t('auth.alreadyRegistered')} <button className="text-transparent bg-clip-text bg-gradient-to-r from-datavibe-primary to-datavibe-purple font-bold hover:underline border-none p-0 cursor-pointer">{t('auth.signIn')}</button></motion.p> )}
                        {step === 'search' && ( <motion.p key="link-search" initial={{ opacity: 0 }} animate={isExitingSearch ? { y: 100, opacity: 0 } : { opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute text-xs text-muted-foreground">{t('auth.notOnSpotify')} <button className="text-transparent bg-clip-text bg-gradient-to-r from-datavibe-primary to-datavibe-purple hover:underline font-bold border-none p-0 cursor-pointer">{t('auth.manualSignup')}</button></motion.p> )}
                    </AnimatePresence>
                 </div>
            </div>
        )}
      </div>


      {/* Avatar (Outside Blurred Wrapper) */}
      {step === 'dashboard' && (
        <motion.div ref={desktopAvatarWrapperRef} className={`fixed top-2.5 right-4 ${isLoggedIn ? '' : 'perspective-[1000px]'} ${isMenuOpen ? 'z-[10]' : isDropWaterActive ? 'z-[101]' : 'z-[55]'} ${isLoggedIn && !isDropWaterActive ? 'pointer-events-none' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1, x: (isLoggedIn && !isDropWaterActive) ? (isBilanView ? "110vw" : 0) : 0 }} transition={scaleTransition({ y: { duration: 0.7, ease: "circOut", delay: 0.5 }, opacity: { duration: 0.5, delay: 0.5 }, x: { duration: 0.5, ease: "circOut", delay: isBilanView ? 0 : 0.35 } })}>
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} >
            <motion.div 
                layoutId={undefined} 
                initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                animate={
                    isDropWaterActive 
                    ? { 
                        y: 84, 
                        x: "calc(-50vw + 38px)", 
                        opacity: 1, 
                        scale: 1.2727, 
                        filter: "blur(0px)",
                        rotateY: 0
                    }
                    : isLoggedIn
                    ? {
                        y: 84,
                        x: "calc(-100vw + 82px)",
                        opacity: 1,
                        scale: 1.2727,
                        filter: "blur(0px)",
                        rotateY: 0
                    }
                    : { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, x: 0, rotateY: 0 }
                }
                transition={
                    isDropWaterActive 
                    ? {
                        y: { duration: 0.15, ease: "circOut" }, 
                        x: { duration: 0.2, delay: 0.15, ease: "circOut" },
                        scale: { duration: 0.35, ease: "circOut" },
                        default: { duration: 0.35 } 
                    }
                    : isLoggedIn
                    ? {
                        x: { duration: 0.5, ease: "circOut" },
                        opacity: { duration: 0.3 },
                        filter: { duration: 0.3 },
                        y: { duration: 0 },
                        scale: { duration: 0 },
                        default: { duration: 0.5 }
                    }
                    : {
                        x: { duration: 0.2, delay: 0.35, ease: "circIn" }, 
                        y: { duration: 0.15, delay: 0.55, ease: "circIn" },
                        scale: { duration: 0.15, delay: 0.55, ease: "circIn" },
                        default: { duration: 0.35 }
                    }
                }
                style={{ transformStyle: isLoggedIn ? undefined : "preserve-3d" }}
            >
                {isLoggedIn ? (
                    <div style={{ perspective: 1000 }}>
                        <motion.div style={{ transformStyle: "preserve-3d", position: "relative", width: 44, height: 44 }} animate={{ rotateY: isFullDashboard ? 180 : 0 }} transition={scaleTransition({ rotateY: { duration: 1.1, ease: "easeInOut" } })}>
                            <div className="w-11 h-11 rounded-full overflow-hidden cursor-pointer shadow-md border-2 border-datavibe-primary/30 shadow-[0_0_15px_rgba(124,58,237,0.2)] pointer-events-auto" style={{ backfaceVisibility: "hidden" }} onClick={() => setIsUserPanelOpen(!isUserPanelOpen)}>
                                <img src={PROFILE_IMAGE} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 w-11 h-11 rounded-full flex items-center justify-center bg-dashboard-back-btn-bg cursor-pointer pointer-events-auto" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", "--stroke-0": "var(--dashboard-back-btn-icon)" } as React.CSSProperties} onClick={(e) => { e.stopPropagation(); setIsReturning(true); setTimeout(() => { setIsFullDashboard(false); }, 200); setTimeout(() => setIsReturning(false), 1400); }}>
                                <ChevronLeft size={24} strokeWidth={2} color="var(--stroke-0, white)" />
                            </div>
                            {/* Hello block stays visible even when UserPanel is open */}
                            {subTab === 'dashboard' && !isFullDashboard && !isBilanView && (
                                <motion.div className="absolute left-[56px] top-1/2 -translate-y-1/2 flex flex-col items-start font-manrope text-foreground whitespace-nowrap pointer-events-none" style={{ backfaceVisibility: "hidden", transform: "scale(0.786)", transformOrigin: "left center" }} initial={{ opacity: 0, x: -20 }} animate={isScrolled ? { opacity: 0, y: -50, filter: "blur(10px)" } : { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }} transition={scaleTransition({ duration: 0.4, ease: "easeOut", delay: 0.6 })}>
                                    <p className="text-[13.2px] font-normal leading-normal">{t("onboarding.hello")}</p>
                                    <div className="text-[20.2px] leading-normal flex items-center gap-2"><span className="font-bold" translate="no">{displayName || searchResults.find(a => a.id === selectedArtist)?.name || "KS Bloom"}</span><span className="font-normal"> 👋</span></div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                ) : (
                    <Button ref={avatarRef} onClick={() => !isMenuOpen && setIsDropWaterActive(true)} variant="secondary" size="icon" className={`rounded-full shadow-sm text-foreground hover:bg-secondary/80 w-11 h-11 p-0 transition-all duration-300 hover:shadow-[0_0_20px_var(--effect-glow-primary)] ${isMenuOpen ? 'pointer-events-none' : ''}`}>
                        <VisiomorphicHelpAvatar mode={isDropWaterActive ? "avatar" : "help"} duration={isDropWaterActive ? 1.5 : 0.6} />
                    </Button>
                )}
            </motion.div>
        </motion.div>
        </motion.div>
      )}

      {/* Unified Burger/Cross Desktop — OUTSIDE dashboard-ui stacking context for correct z-ordering */}
      {/* FIX: Drop z below backdrop when UserPanel is open OR DropWater auth is active */}
      {step === 'dashboard' && (() => { return (<motion.div className={`fixed top-3 left-4 ${(isUserPanelOpen || isDropWaterActive) ? 'z-[10]' : 'z-[72]'}`} initial={{ y: -200, opacity: 0 }} animate={isArrivingFromDashboard ? { y: -200, opacity: 0 } : { y: 0, opacity: 1 }} transition={scaleTransition({ y: { duration: 0.8, ease: "circOut" }, opacity: { duration: 0.8, ease: "circOut" } })}><motion.button className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground cursor-pointer" animate={{ x: isMenuOpen ? _dMenuDelta : 0 }} transition={scaleTransition({ x: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } })} onClick={() => setIsMenuOpen(!isMenuOpen)}><div className="flex flex-col items-start w-5 relative" style={{ height: 10 }}><motion.span className="h-[2px] bg-current rounded-full absolute left-0 origin-center" animate={isMenuOpen ? { rotate: 45, width: 20, top: 4 } : { rotate: 0, width: 20, top: 0 }} transition={scaleTransition({ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: isMenuOpen ? 0.1 : 0 })} /><motion.span className="h-[2px] bg-current rounded-full absolute left-0 origin-center" animate={isMenuOpen ? { rotate: -45, width: 20, top: 4 } : { rotate: 0, width: 12, top: 8 }} whileHover={!isMenuOpen ? { width: 20 } : undefined} transition={scaleTransition({ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay: isMenuOpen ? 0.1 : 0 })} /></div></motion.button></motion.div>); })()}

      {/* SLIDE MENU (Desktop Dashboard) — OUTSIDE dashboard-ui stacking context for correct z-ordering */}
      {step === 'dashboard' && (
          <SlideMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onBilanClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'bilan') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('bilan'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('bilan'); setIsBilanView(true); }, 500); } }}
              onNiveauClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'niveau') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('niveau'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('niveau'); setIsBilanView(true); }, 500); } }}
              onConnexionsClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'connexions') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('connexions'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('connexions'); setIsBilanView(true); }, 500); } }}
              onOffreClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'offre') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('offre'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('offre'); setIsBilanView(true); }, 500); } }}
              onLegalClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'legal') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('legal'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('legal'); setIsBilanView(true); }, 500); } }}
              onAproposClick={() => { setIsMenuOpen(false); if (isBilanView && overlayPage !== 'apropos') { setTimeout(() => { overlaySwapRef.current = true; setOverlayPage('apropos'); }, 500); } else if (!isBilanView) { setTimeout(() => { bilanFromFullRef.current = isFullDashboard; standardActiveTabRef.current = activeTab; setActiveTab(bilanActiveTabRef.current); setContentTab(bilanActiveTabRef.current); setIsFullDashboard(false); setOverlayPage('apropos'); setIsBilanView(true); }, 500); } }}
              isMobile={false}
              isLoggedIn={isLoggedIn}
              language={language}
              toggleLanguage={toggleLanguage}
              spatialFlowSpeed={spatialFlowSpeed}
              onSpeedChange={setSpatialFlowSpeed}
          />
      )}

      {/* --- MITOSIS OVERLAY --- */}
      <AnimatePresence>
            {isDropWaterActive && (
                <div onScroll={(e) => { if (desktopAvatarWrapperRef.current) desktopAvatarWrapperRef.current.style.top = `calc(0.625rem - ${e.currentTarget.scrollTop}px)`; }} className={`fixed inset-0 z-[100] ${desktopScrollActive ? 'overflow-y-auto' : 'overflow-hidden'} [scrollbar-width:thin] [scrollbar-color:rgba(124,58,237,0.4)_transparent]`}>
                    
                    {/* BACKDROP: sticky so it stays covering viewport during scroll */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseAuth}
                        className="sticky top-0 left-0 w-full h-screen -mb-[100vh] bg-black/20 backdrop-blur-[2px] cursor-pointer z-0"
                        transition={scaleTransition({ duration: 0.35 })} // Match Avatar flight
                    />

                    {/* Scroll spacer — creates scroll area when card exceeds viewport */}
                    <div onClick={handleCloseAuth} className="relative w-full cursor-pointer" style={{ minHeight: desktopScrollActive ? `${desktopCardTop + targetCardHeight + 32}px` : '100vh' }}>
                    {/* The Seed -> Card Morphing Container (Mitosis v5) */}
                    <motion.div
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        key="desktop-card-mitosis-v5"
                        initial={{ 
                            top: 94, 
                            left: "50%", 
                            x: "-50%", 
                            width: 0, 
                            maxHeight: 0, 
                            borderRadius: "22px", 
                            opacity: 0
                        }}
                        animate={isDesktopAnimationComplete ? {
                            // POST-OUVERTURE : maxHeight suit targetCardHeight (signup = 850, signin = 700, forgot = 420)
                            top: mitosisCoords ? mitosisCoords.endY : 152,
                            width: 448,
                            maxHeight: targetCardHeight,
                            borderRadius: "24px",
                            opacity: 1,
                            transition: {
                                duration: 0,
                                maxHeight: { duration: HEIGHT_ANIM_DURATION, ease: [0.4, 0, 0.2, 1] }
                            }
                        } : {
                            // OUVERTURE INITIALE (keyframes Mitosis v5) :
                            // Phase 1 (0→25%): CHUTE — Cercle naît et descend
                            // Phase 2 (25→50%): ÉLARGISSEMENT — Pilule (hauteur FIXE à 44px = pas d'ovale)
                            // Phase 3 (50→100%): DÉROULEMENT — Pilule se déroule en hauteur
                            top: mitosisCoords 
                                ? [mitosisCoords.startY, mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.endY] 
                                : [94, 152, 152, 152], 
                            width: [0, 44, 448, 448], 
                            maxHeight: [0, 44, 44, 700],
                            borderRadius: ["22px", "22px", "22px", "24px"],
                            opacity: [0, 1, 1, 1],
                            transition: scaleTransition({
                                delay: 0.35, 
                                duration: 0.4, 
                                times: [0, 0.25, 0.5, 1],
                                ease: ["circOut", "easeInOut", "circOut"]
                            })
                        }}
                        onAnimationComplete={() => {
                            setIsDesktopAnimationComplete(true);
                        }}
                        exit={{ 
                            // FERMETURE INVERSE EXACTE (éléments déjà sortis via isClosingAuth) :
                            // Phase 1 (0→50%): REPLI — Hauteur se contracte
                            // Phase 2 (50→75%): CONTRACTION — Largeur se contracte en cercle
                            // Phase 3 (75→100%): REMONTÉE — Cercle remonte et disparaît
                            maxHeight: [targetCardHeight, 44, 44, 0], 
                            width: ["448px", "448px", "44px", "0px"],
                            borderRadius: ["24px", "22px", "22px", "22px"], // FIX: valeurs pixel (cercle = 22px)
                            top: mitosisCoords 
                                ? [mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.endY, mitosisCoords.startY] 
                                : [152, 152, 152, 94],
                            opacity: [1, 1, 1, 0],
                            transition: scaleTransition({ 
                                duration: CONTENT_CLOSE_TIME, 
                                times: [0, 0.5, 0.75, 1], 
                                ease: ["circIn", "easeInOut", "circIn"] 
                            })
                        }}
                        style={{ overflow: "visible" }}
                        className="absolute bg-black/60 border border-white/10 pointer-events-auto z-[60] shadow-[0px_0px_50px_-10px_rgba(124,58,237,0.3)]"
                    >
                         {/* Close Button - Disappears immediately on close sequence */}
                         <motion.button 
                            onClick={handleCloseAuth} 
                            initial={{ x: 50, opacity: 0 }}
                            animate={isClosingAuth 
                                ? { x: 50, opacity: 0, transition: scaleTransition({ duration: 0.15, ease: "circIn" }) }
                                : { x: 0, opacity: 1, transition: scaleTransition({ delay: 0.6, duration: 0.3, ease: "circOut" }) }
                            }
                            exit={{ x: 50, opacity: 0, transition: scaleTransition({ duration: 0.2, ease: "circIn" }) }}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 hover:text-white text-white/70 rounded-full transition-colors cursor-pointer group"
                         >
                            <X size={20} className="group-hover:scale-110 transition-transform duration-300" />
                         </motion.button>

                         {/* Ambient Glow Effects */}
                         <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none opacity-50 rounded-t-[24px]" />
                         <div className="absolute -top-20 -right-20 w-40 h-40 bg-datavibe-primary/20 blur-[60px] rounded-full pointer-events-none" />

                         {/* View wrapper — 3 phases séquentielles :
                              Phase 1 overflow:visible  → contenu sort latéralement
                              Phase 2 overflow:hidden   → hauteur contracte/expande
                              Phase 3 overflow:visible  → nouveau contenu entre latéralement */}
                         <motion.div
                             initial={false}
                             animate={{ maxHeight: targetCardHeight }}
                             transition={scaleTransition({ duration: HEIGHT_ANIM_DURATION_RAW, ease: [0.4, 0, 0.2, 1] })}
                             style={{ overflow: isHeightAnimating ? 'hidden' : 'visible' }}
                             className="w-full"
                         >
                             {authView === 'signin' ? (
                                 <GlassAuthCard
                                     isVisible={true}
                                     isExpanded={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onForgotPassword={handleForgotPassword}
                                     onSignUp={handleSignUp}
                                     onLoginSuccess={handleLoginSuccess}
                                 />
                             ) : authView === 'forgot' ? (
                                 <ForgotPasswordCard
                                     isVisible={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onBack={handleBackToSignIn}
                                 />
                             ) : (
                                 <SignUpCard
                                     isVisible={true}
                                     isClosing={isClosingAuth || isViewSwitching}
                                     delay={ANIMATION_CARTOGRAPHY.authContent.open.delay}
                                     duration={ANIMATION_CARTOGRAPHY.authContent.open.duration}
                                     stagger={ANIMATION_CARTOGRAPHY.authContent.open.stagger}
                                     closeDuration={ANIMATION_CARTOGRAPHY.authContent.close.duration}
                                     closeStagger={ANIMATION_CARTOGRAPHY.authContent.close.stagger}
                                     onBack={handleBackFromSignUp}
                                     onSignUpSuccess={handleLoginSuccess}
                                 />
                             )}
                         </motion.div>
                    </motion.div>
                    </div>
                </div>
            )}
      </AnimatePresence>

      {/* BACKDROP OVERLAY (Desktop) — frost + scroll block when UserPanel is open */}
      <div className={isUserPanelOpen ? '' : 'pointer-events-none'}>
      <AnimatePresence>
          {isLoggedIn && isUserPanelOpen && (
              <motion.div
                  key="desktop-user-panel-backdrop"
                  className="fixed inset-0 z-[52] backdrop-blur-md bg-black/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={scaleTransition({ duration: 0.3 })}
                  onClick={() => setIsUserPanelOpen(false)}
              />
          )}
      </AnimatePresence>
      </div>

      {/* USER PANEL (Desktop) — fixed floating container for slide animation */}
      {/* FIX: When closed, collapse to h-0 + overflow-hidden to eliminate invisible blocking layer ("voile invisible") */}
      {isLoggedIn && (
          <div className={`fixed left-4 right-4 z-[53] no-scrollbar ${isUserPanelOpen ? 'top-[152px] bottom-4 overflow-y-auto pointer-events-auto' : 'top-[152px] h-0 overflow-visible pointer-events-none'}`}>
              <UserPanel isOpen={isUserPanelOpen} displayName={displayName || searchResults.find(a => a.id === selectedArtist)?.name || "KS Bloom"} onLogout={handleLogout} onDisplayNameChange={setDisplayName} />
          </div>
      )}

      {/* Main Platform hidden as requested */}
    </div>
  );
}

// =================================================================================================
// --- MAIN AIGUILLAGE ---
// =================================================================================================

export function NewPlatform() {
  const isMobile = useIsMobile();
  const state = usePlatformController();
  
  // Architecture Parallel Worlds: Rendu totalement séparé, mais état unifié (State Hoisting)
  // Cela empêche le redémarrage de l'application lors de la rotation de l'appareil (Tablette)
  return isMobile ? <MobileExperience {...state} /> : <DesktopExperience {...state} />;
}
