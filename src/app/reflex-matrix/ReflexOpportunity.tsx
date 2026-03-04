/**
 * REFLEX MATRIX - DESIGN PROTOCOL & GUARDRAILS (MANIFESTO v3.0)
 * --------------------------------------------
 * 1. MITOSIS ANIMATION: All segments MUST morph from a "mother" color (Red/Orange 10% opacity) 
 *    to their target color over 4s with a 4px blur.
 * 2. LATERAL ENTRY (CRITICAL): Elements inside Segments 2, 3, and 4 MUST enter from the SIDES OF THE SCREEN.
 *    - Use X offsets of at least +/- 400px to ensure they travel from outside the visible area.
 *    - Do NOT reduce these values to small offsets (like 15px/60px).
 * 3. INVERSE TRAPDOOR: Uses the "Buffer Strategy" (pb-[100vh]) to allow scroll-locking at 10rem from top.
 * 4. SINGLE SOUL RULE (RAU): The `namespace` prop is MANDATORY to prevent layoutId collisions 
 *    between Streaming/Social/Radio dashboards.
 * 5. UX INTERACTIONS (HOVER): All interactive arrows (ChevronDown/Up) MUST feature:
 *    - A background circle expansion (bg-white/10, spring transition).
 *    - A soft scale-up (1.15x) of the icon itself.
 */

import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence, animate } from "motion/react";
import { useSwipeable } from "react-swipeable";
import { ChevronDown, ChevronUp, Play, ChevronRight, LockKeyholeOpen } from "lucide-react";
import { PlanHeader } from "./PlanHeader";
import { VideoPlayerOverlay } from "./VideoPlayerOverlay";
import { useTranslation } from "../components/language-provider"; // i18n hook for all components
import { getTranslatedDefaultPages, getTranslatedDefaultData, getTranslatedFallbackPages } from "./reflex-i18n";
import { scaledSpring, scaleTransition } from "./spatial-speed";

/**
 * REFLEX OPPORTUNITY - MANIFESTO v2.4.6 (NAMESPACE SUPPORT)
 * 
 * - FIX: Replaced "white" with hex "#ffffff" to resolve motion animation errors.
 * - FIX: Mother Opacity set to 10% (0.1) per Figma code snippet.
 * - FIX: Mother Border set to 30% (0.3) per Figma code snippet.
 * - FIX: Restored Border "Running Lights" animation on Social Proof block (Segment 4).
 * - FEAT: Segment 1 (Mother) remains intense (20%) at peak for impact, but skin is 10%.
 * - FEAT: Completed button hover effects (White transition for label, arrows, and stroke).
 * - FEAT: Finalized Lock icon hover opacity (Subtle 60% container / 70% icon).
 * - FEAT: Integrated PlanHeader with Lateral Glide physics on "Juste pour moi" action.
 * - FIX: Added 'namespace' prop to prevent layoutId conflicts during tab transitions.
 */

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1596131397999-bb01560efcae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwbXVzaWMlMjBjbHVifGVufDF8fHx8MTc3MjA4NDc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export interface ReflexActionItem { id: string; text: string; }
export interface ReflexSocialProof { videoSrc?: string; title: string; author: string; views: string; initials: string; descriptionTitle: string; description: string; }
export interface ReflexPlaylist { title: string; description: string; videoSrc?: string; }
export interface ReflexOpportunityPage { playlist: ReflexPlaylist; insightTitle?: string; insightText?: string; socialProof: ReflexSocialProof; badgeType?: 'priorite' | 'recommande' | 'bonus'; }
export interface ReflexOpportunityData { title: string; subtitle: string; urgent?: boolean; steps: ReflexActionItem[]; insightTitle?: string; insightText?: string; buttonText?: string; socialProof?: ReflexSocialProof; playlist?: ReflexPlaylist; pages?: ReflexOpportunityPage[]; }

const DEFAULT_PAGES: ReflexOpportunityPage[] = [
    {
        playlist: {
            title: "Comment créer une playlist sur Spotify",
            description: "Repère sur Spotify et YouTube les playlists où tes titres sont en bas ou au milieu du classement.",
            videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBtdXNpYyUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzAxNzIwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        insightTitle: "Astuce Pro :",
        insightText: "Connecte ton compte pour débloquer plus de fonctionnalités.",
        socialProof: {
            videoSrc: "https://images.unsplash.com/photo-1731419741064-be6cbe9fa2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdvc3BlbCUyMHNpbmdlciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MDE4MjAwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            title: "\"J'ai converti 50K viewers en fans Spotify\"",
            author: "Leto",
            views: "234K vues",
            initials: "L",
            descriptionTitle: "Pourquoi cette vidéo",
            description: "Leto a réussi exactement ce que tu dois faire. Il explique sa méthode étape par étape."
        },
        badgeType: 'priorite'
    },
    {
        playlist: {
            title: "Optimiser son profil Artiste",
            description: "Ton profil est ta vitrine. Apprends à choisir la bonne photo de profil et à rédiger une bio percutante.",
            videoSrc: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        insightTitle: "Le saviez-vous ?",
        insightText: "Une biographie mise à jour régulièrement augmente de 40% les chances d'être suivi par de nouveaux fans.",
        socialProof: {
            videoSrc: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2R8ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            title: "\"Mon profil a tout changé\"",
            author: "Sarah M.",
            views: "156K vues",
            initials: "S",
            descriptionTitle: "L'importance de l'image",
            description: "Sarah explique comment un simple changement de photo a boosté ses streams de 20% en une semaine."
        },
        badgeType: 'recommande'
    },
    {
        playlist: {
            title: "Comprendre l'algorithme",
            description: "Découvre comment fonctionne le système de recommandation et comment placer tes titres dans les radars.",
            videoSrc: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwc3R1ZGlvfGVufDF8fHx8MTc3MDE4MjE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        insightTitle: "Conseil Expert :",
        insightText: "La régularité est la clé. Publiez du contenu au moins une fois par mois pour garder l'algorithme actif.",
        socialProof: {
            videoSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxka3xlbnwxfHx8fDE3NzAxODIxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            title: "\"L'algorithme est mon allié\"",
            author: "DJ K.",
            views: "312K vues",
            initials: "D",
            descriptionTitle: "Hacker le système",
            description: "Une plongée technique mais accessible dans les coulisses des recommandations automatiques."
        },
        badgeType: 'bonus'
    }
];

// --- BADGE TYPE COLOR CONFIGURATIONS ---
const BADGE_CONFIGS = {
    priorite: {
        labelKey: "reflex.priorityHigh",
        glowShadows: [
            "0 0 3px 0px rgba(255, 87, 34, 0.3), 0 0 8px 2px rgba(255, 60, 10, 0.15)",
            "0 0 10px 2px rgba(255, 87, 34, 0.6), 0 0 20px 6px rgba(255, 60, 10, 0.3)",
            "0 0 5px 1px rgba(255, 130, 50, 0.5), 0 0 14px 4px rgba(255, 87, 34, 0.2)",
            "0 0 3px 0px rgba(255, 87, 34, 0.3), 0 0 8px 2px rgba(255, 60, 10, 0.15)"
        ],
        magmaPrimary: [
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(255, 87, 34) 0%, rgb(200, 40, 8) 50%, rgb(160, 30, 5) 100%)",
            "radial-gradient(ellipse 100% 120% at 80% 30%, rgb(255, 130, 50) 0%, rgb(230, 70, 15) 45%, rgb(180, 35, 8) 100%)",
            "radial-gradient(ellipse 140% 90% at 40% 70%, rgb(240, 60, 20) 0%, rgb(255, 100, 40) 55%, rgb(190, 40, 10) 100%)",
            "radial-gradient(ellipse 90% 130% at 60% 40%, rgb(255, 87, 34) 0%, rgb(210, 50, 12) 50%, rgb(170, 30, 5) 100%)",
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(255, 87, 34) 0%, rgb(200, 40, 8) 50%, rgb(160, 30, 5) 100%)"
        ],
        magmaSecondary: [
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(255, 160, 60, 0.7) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255, 120, 40, 0.6) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 90% at 60% 30%, rgba(255, 180, 80, 0.5) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(255, 160, 60, 0.7) 0%, transparent 70%)"
        ]
    },
    recommande: {
        labelKey: "reflex.recommended",
        glowShadows: [
            "0 0 3px 0px rgba(21, 167, 222, 0.3), 0 0 8px 2px rgba(0, 162, 191, 0.15)",
            "0 0 10px 2px rgba(21, 167, 222, 0.6), 0 0 20px 6px rgba(0, 162, 191, 0.3)",
            "0 0 5px 1px rgba(50, 200, 240, 0.5), 0 0 14px 4px rgba(21, 167, 222, 0.2)",
            "0 0 3px 0px rgba(21, 167, 222, 0.3), 0 0 8px 2px rgba(0, 162, 191, 0.15)"
        ],
        magmaPrimary: [
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(21, 167, 222) 0%, rgb(0, 140, 180) 50%, rgb(0, 100, 150) 100%)",
            "radial-gradient(ellipse 100% 120% at 80% 30%, rgb(50, 190, 240) 0%, rgb(0, 162, 191) 45%, rgb(0, 120, 160) 100%)",
            "radial-gradient(ellipse 140% 90% at 40% 70%, rgb(10, 150, 200) 0%, rgb(40, 180, 230) 55%, rgb(0, 130, 170) 100%)",
            "radial-gradient(ellipse 90% 130% at 60% 40%, rgb(21, 167, 222) 0%, rgb(0, 150, 190) 50%, rgb(0, 110, 155) 100%)",
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(21, 167, 222) 0%, rgb(0, 140, 180) 50%, rgb(0, 100, 150) 100%)"
        ],
        magmaSecondary: [
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(50, 200, 240, 0.7) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(30, 180, 220, 0.6) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 90% at 60% 30%, rgba(70, 210, 250, 0.5) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(50, 200, 240, 0.7) 0%, transparent 70%)"
        ]
    },
    bonus: {
        labelKey: "reflex.bonus",
        glowShadows: [
            "0 0 3px 0px rgba(139, 92, 246, 0.3), 0 0 8px 2px rgba(109, 40, 217, 0.15)",
            "0 0 10px 2px rgba(139, 92, 246, 0.6), 0 0 20px 6px rgba(109, 40, 217, 0.3)",
            "0 0 5px 1px rgba(167, 139, 250, 0.5), 0 0 14px 4px rgba(139, 92, 246, 0.2)",
            "0 0 3px 0px rgba(139, 92, 246, 0.3), 0 0 8px 2px rgba(109, 40, 217, 0.15)"
        ],
        magmaPrimary: [
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(139, 92, 246) 0%, rgb(109, 40, 217) 50%, rgb(88, 28, 135) 100%)",
            "radial-gradient(ellipse 100% 120% at 80% 30%, rgb(167, 139, 250) 0%, rgb(124, 58, 237) 45%, rgb(91, 33, 182) 100%)",
            "radial-gradient(ellipse 140% 90% at 40% 70%, rgb(120, 70, 230) 0%, rgb(150, 110, 245) 55%, rgb(100, 45, 200) 100%)",
            "radial-gradient(ellipse 90% 130% at 60% 40%, rgb(139, 92, 246) 0%, rgb(115, 50, 225) 50%, rgb(85, 30, 160) 100%)",
            "radial-gradient(ellipse 120% 80% at 20% 50%, rgb(139, 92, 246) 0%, rgb(109, 40, 217) 50%, rgb(88, 28, 135) 100%)"
        ],
        magmaSecondary: [
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(167, 139, 250, 0.7) 0%, transparent 70%)",
            "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(139, 92, 246, 0.6) 0%, transparent 65%)",
            "radial-gradient(ellipse 50% 90% at 60% 30%, rgba(196, 181, 253, 0.5) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 80% at 70% 60%, rgba(167, 139, 250, 0.7) 0%, transparent 70%)"
        ]
    }
} as const;

const DEFAULT_DATA: ReflexOpportunityData = {
    title: "Convertis tes viewers YouTube en fans Spotify",
    subtitle: "+12.4K vues mais seulement +245 auditeurs. Ton YouTube cartonne, ton Spotify peut suivre.",
    urgent: true,
    steps: [
        { id: "s1", text: "Ajoute ton lien Spotify en description YouTube" },
        { id: "s2", text: "Crée un call-to-action vocal dans tes vidéos" },
        { id: "s3", text: "Poste un extrait TikTok qui renvoie vers Spotify" },
        { id: "s4", text: "Contacte les curateurs avec tes stats YouTube" }
    ],
    insightTitle: "Astuce Pro :",
    insightText: "Connecte ton compte pour débloquer plus de fonctionnalités.",
    buttonText: "Comment faire",
    pages: DEFAULT_PAGES,
    socialProof: {
        videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwZGFzaGJvYXJkJTIwbXVzaWMlMjBhcnRpc3QlMjBjb25jZXJ0fGVufDF8fHx8MTc3MDE2OTY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        title: "\"J'ai converti 50K viewers en fans Spotify\"",
        author: "Leto",
        views: "234K vues",
        initials: "L",
        descriptionTitle: "Pourquoi cette vidéo",
        description: "Leto a réussi exactement ce que tu dois faire. Il explique sa méthode étape par étape."
    },
    playlist: {
        title: "Comment créer une playlist sur Spotify",
        description: "Repère sur Spotify et YouTube les playlists où tes titres sont en bas ou au milieu du classement.",
        videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBtdXNpYyUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzAxNzIwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
};

// --- NAVIGATION COMPONENT ---
const ReflexNavigation = ({ activePage, totalPages, onPageChange, className = "", isSoulShifted = false }: { activePage: number, totalPages: number, onPageChange: (page: number) => void, className?: string, isSoulShifted?: boolean }) => {
    // Define local color constants to avoid scope issues or NaN values in Motion
    const navColors = {
        active: "rgba(255, 255, 255, 0.08)",
        inactive: "rgba(255, 255, 255, 0.03)",
        borderActive: "rgba(255, 255, 255, 0.6)",
        borderInactive: "rgba(255, 255, 255, 0.1)"
    };
    
    return (
        <motion.div 
            layout 
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className={`flex items-center justify-center gap-4 h-[40px] z-50 relative pointer-events-auto ${className || "w-full mt-4 mb-8"}`}
        >
            {/* Mobile: Dots - Accordion Stagger Entry */}
            <div className="flex md:hidden items-center gap-6 py-4">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <motion.button 
                        layout
                        key={`${i}-${isSoulShifted ? 'bottom' : 'top'}`} // Force re-render on shift to trigger animation
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => { e.stopPropagation(); onPageChange(i); }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activePage === i ? 'bg-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/30'}`}
                        transition={{ 
                            type: "spring", stiffness: 200, damping: 20, 
                            delay: 0.1 + (i * 0.1) // 1 -> 2 -> 3 Stagger
                        }}
                    />
                ))}
            </div>
            
            {/* Desktop: Glass Circles - Accordion Stagger Entry */}
            <div className="hidden md:flex items-center gap-6">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <motion.button
                        layout
                        key={`${i}-${isSoulShifted ? 'bottom' : 'top'}`} // Force re-render on shift to trigger animation
                        initial={{ 
                            y: isSoulShifted ? -20 : 20, // Slight vertical offset based on direction
                            opacity: 0, 
                            scale: 0.5,
                            backgroundColor: activePage === i ? navColors.active : navColors.inactive,
                            borderColor: activePage === i ? navColors.borderActive : navColors.borderInactive
                        }}
                        animate={{ 
                            y: 0, 
                            opacity: 1, 
                            scale: 1,
                            backgroundColor: activePage === i ? navColors.active : navColors.inactive,
                            borderColor: activePage === i ? navColors.borderActive : navColors.borderInactive
                        }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 180, 
                            damping: 15, 
                            mass: 1,
                            delay: 0.2 + (i * 0.1), // Accordion Stagger: 1 -> 2 -> 3
                            backgroundColor: { duration: 0.3 },
                            borderColor: { duration: 0.3 }
                        }}
                        onClick={(e) => { e.stopPropagation(); onPageChange(i); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-bold backdrop-blur-md border border-white/10`}
                        style={{
                            color: 'white',
                            boxShadow: activePage === i ? '0 0 25px rgba(255,255,255,0.15)' : 'none'
                        }}
                        whileHover={{ scale: 1.15, backgroundColor: navColors.active, borderColor: 'rgba(255,255,255,0.8)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {i + 1}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

// --- STYLE CONFIGURATION ---
const USE_NEUTRAL_GLASS = true; // Mettre à 'false' pour retrouver le style Rouge/Orange original

// --- STRICT FIGMA SYNC (10% BG / 30% BORDER) ---
const ORIGINAL_COLORS = {
    MOTHER: { 
        start: "rgba(255, 78, 80, 0.1)", 
        end: "rgba(234, 88, 12, 0.1)", 
        border: "rgba(234, 88, 12, 0.3)" 
    },
    EMERALD: { 
        start: "rgba(16, 185, 129, 0.2)", 
        end: "rgba(20, 184, 166, 0.2)", 
        border: "rgba(16, 185, 129, 0.3)" 
    },
    AMBER: { 
        start: "rgba(185, 120, 16, 0.2)", 
        end: "rgba(184, 94, 20, 0.2)", 
        border: "rgba(184, 94, 20, 0.3)" 
    },
    STREAMING: {
        start: "rgba(242, 142, 66, 0.1)",
        end: "rgba(242, 142, 66, 0.1)",
        border: "rgba(242, 142, 66, 0.6)"
    },
    STREAMING_ASTUCE: {
        start: "rgba(13, 8, 2, 0.5)",
        end: "rgba(13, 8, 2, 0.5)",
        border: "rgba(13, 8, 2, 0.5)"
    },
    SOCIAL: {
        start: "rgba(28, 180, 91, 0.1)",
        end: "rgba(28, 180, 91, 0.1)",
        border: "rgba(28, 180, 91, 0.6)"
    },
    SOCIAL_ASTUCE: {
        start: "rgba(28, 180, 91, 0.1)",
        end: "rgba(16, 185, 129, 0.2)",
        border: "rgba(28, 180, 91, 0.6)"
    },
    RADIO: {
        start: "rgba(18, 134, 243, 0.1)",
        end: "rgba(18, 134, 243, 0.1)",
        border: "rgba(18, 134, 243, 0.6)"
    },
    RADIO_ASTUCE: {
        start: "rgba(5, 20, 50, 0.5)",
        end: "rgba(5, 20, 50, 0.5)",
        border: "rgba(5, 20, 50, 0.5)"
    }
};

const NEUTRAL_COLORS = {
    MOTHER: { 
        start: "rgba(255, 255, 255, 0.08)", // Verre dépoli plus subtil (moins blanc)
        end: "rgba(255, 255, 255, 0.02)",   // Dégradé très léger
        border: "rgba(255, 255, 255, 0.15)" // Bordure adoucie
    },
    EMERALD: ORIGINAL_COLORS.EMERALD, // On garde les enfants colorés pour la sémantique
    AMBER: ORIGINAL_COLORS.AMBER,
    STREAMING: {
        start: "rgba(242, 142, 66, 0.1)",
        end: "rgba(242, 142, 66, 0.1)",
        border: "rgba(242, 142, 66, 0.6)"
    },
    STREAMING_ASTUCE: {
        start: "rgba(13, 8, 2, 0.5)",
        end: "rgba(13, 8, 2, 0.5)",
        border: "rgba(13, 8, 2, 0.5)"
    },
    SOCIAL: {
        start: "rgba(28, 180, 91, 0.1)",
        end: "rgba(28, 180, 91, 0.1)",
        border: "rgba(28, 180, 91, 0.6)"
    },
    SOCIAL_ASTUCE: {
        start: "rgba(2, 13, 6, 0.5)",
        end: "rgba(2, 13, 6, 0.5)",
        border: "rgba(2, 13, 6, 0.5)"
    },
    RADIO: {
        start: "rgba(18, 134, 243, 0.1)",
        end: "rgba(18, 134, 243, 0.1)",
        border: "rgba(18, 134, 243, 0.6)"
    },
    RADIO_ASTUCE: {
        start: "rgba(2, 8, 13, 0.5)",
        end: "rgba(2, 8, 13, 0.5)",
        border: "rgba(2, 8, 13, 0.5)"
    }
};

const COLORS = USE_NEUTRAL_GLASS ? NEUTRAL_COLORS : ORIGINAL_COLORS;

// Helper to get theme colors based on namespace
const getThemeColors = (namespace: string = 'default') => {
    switch(namespace) {
        case 'streaming': return COLORS.STREAMING;
        case 'social': return COLORS.SOCIAL;
        case 'radio': return COLORS.RADIO;
        default: return COLORS.EMERALD;
    }
};

const getAstuceThemeColors = (namespace: string = 'default') => {
    switch(namespace) {
        case 'streaming': return COLORS.STREAMING_ASTUCE;
        case 'radio': return COLORS.RADIO_ASTUCE;
        case 'social': return COLORS.SOCIAL_ASTUCE;
        default: return COLORS.AMBER;
    }
};

const DynamicInsightBlock = ({ title, description, namespace = "default", useMainTheme = false, noBorder = false }: { title: string, description: string, namespace?: string, useMainTheme?: boolean, noBorder?: boolean }) => {
    const isCustomTheme = ['streaming', 'social', 'radio'].includes(namespace);
    const themeColors = useMainTheme ? getThemeColors(namespace) : getAstuceThemeColors(namespace);
    
    const getTitleColor = () => {
        if (!isCustomTheme) return undefined;
        if (useMainTheme) {
            // Match active button background (solid color from variable)
            if (namespace === 'social') return 'var(--dashboard-social)';
            if (namespace === 'streaming') return 'var(--dashboard-streaming)';
            if (namespace === 'radio') return 'var(--dashboard-radio)';
            return themeColors.border;
        }
        return 'var(--foreground)';
    };

    return (
    <div 
        className={`${isCustomTheme ? '' : 'bg-gradient-to-br from-dashboard-block-emerald-bg-start to-dashboard-block-emerald-bg-end'} flex flex-col gap-[8px] items-start px-[16px] py-[12px] relative rounded-[16px] w-full`}
        style={isCustomTheme ? { backgroundColor: themeColors.start, border: noBorder ? 'none' : `1px solid ${themeColors.border}` } : {}}
    >
      <div className="content-stretch flex items-center justify-start relative w-full">
        <p 
            className={`font-manrope font-bold leading-[18.667px] not-italic relative ${isCustomTheme ? '' : 'text-dashboard-block-emerald-title'} text-[14px] text-left tracking-[0.6px] w-full break-words`}
            style={isCustomTheme ? { color: getTitleColor() } : {}}
        >
            {title}
        </p>
      </div>
      <div className="content-stretch flex items-start relative shrink-0 w-full">
        <div className={`font-manrope font-medium leading-[19.5px] not-italic relative shrink-0 text-[13px] ${isCustomTheme ? 'text-foreground/90' : 'text-foreground/90'} w-full whitespace-pre-wrap`}><p>{description}</p></div>
      </div>
    </div>
  );
};

const SpatialContentWrapper = ({ children, direction, contentKey, className = "w-full h-full", disabled = false }: { children: React.ReactNode, direction?: number, contentKey?: string, className?: string, disabled?: boolean }) => {
    if (disabled || direction === undefined || !contentKey) return <div className={className}>{children}</div>;
    return (
        <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
                key={contentKey}
                custom={direction}
                variants={{
                    enter: (d: number) => ({ x: d > 0 ? -400 : 400, opacity: 0, filter: "blur(4px)" }),
                    center: { x: 0, opacity: 1, filter: "blur(0px)" },
                    exit: (d: number) => ({ x: d > 0 ? 400 : -400, opacity: 0, filter: "blur(4px)" }) 
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={scaledSpring(300, 30)}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export interface ReflexOpportunityProps { onTrigger?: () => void; isDivided?: boolean; setIsDivided?: (val: boolean) => void; data?: ReflexOpportunityData; namespace?: string; direction?: number; }

const Segment1Content = ({ data, isGhost = false, direction, contentKey }: { data: ReflexOpportunityData, isGhost?: boolean, direction?: number, contentKey?: string }) => {
    const { t } = useTranslation();
    return (
    <motion.div className={`flex flex-col gap-[22px] w-full group/top ${isGhost ? 'px-6 pt-[22px] pb-[22px]' : 'pt-[22px] relative'}`} whileHover="hover">
        <div className="flex justify-between items-center w-full min-h-[32px]">
            <div className="flex items-center gap-2">
                <motion.div className="flex items-center justify-center w-5 h-5 rounded-full text-dashboard-opportunity-title text-xs shrink-0 overflow-hidden" style={{ backgroundImage: "linear-gradient(180deg, color-mix(in srgb, var(--dashboard-opportunity-gradient-start), transparent 80%) 0%, color-mix(in srgb, var(--dashboard-opportunity-gradient-start), transparent 20%) 50%, color-mix(in srgb, var(--dashboard-opportunity-gradient-start), transparent 80%) 100%)", backgroundSize: "100% 200%" }} animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                    <motion.span style={{ backgroundImage: "linear-gradient(180deg, var(--dashboard-opportunity-gradient-start) 0%, var(--dashboard-opportunity-gradient-end) 50%, var(--dashboard-opportunity-gradient-start) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "100% 200%" }} animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>⚡</motion.span>
                </motion.div>
                <span className="text-sm font-bold text-dashboard-opportunity-title tracking-tight">{t('reflex.opportunity')}</span>
            </div>
            <div className="flex items-center gap-2 min-w-[50px] justify-end">
                <SpatialContentWrapper direction={direction} contentKey={contentKey} className="w-auto" disabled={isGhost}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm shrink-0 ${!isGhost && 'animate-pulse'} ${data.urgent ? 'bg-dashboard-opportunity-gradient-start' : 'bg-[var(--dashboard-radio)]'}`}>{data.urgent ? t('reflex.urgent') : t('reflex.info')}</span>
                </SpatialContentWrapper>
            </div>
        </div>
        <div className="flex flex-col gap-1 w-full text-left">
             <SpatialContentWrapper direction={direction} contentKey={contentKey} disabled={isGhost}>
                <h3 className="text-[16px] font-manrope font-bold text-foreground leading-tight">{data.title}</h3>
                <p className="text-xs text-dashboard-opportunity-text leading-relaxed">{data.subtitle}</p>
             </SpatialContentWrapper>
        </div>
        <div className="h-[48px] w-full shrink-0" /> 
    </motion.div>
); };

const Segment2Content = ({ data, isGhost = false, seqDuration, peakTime, startDelay, namespace }: { data: ReflexOpportunityData, isGhost?: boolean, seqDuration?: number, peakTime?: number, startDelay?: number, namespace?: string }) => {
    const { t } = useTranslation();
    const Wrapper = isGhost ? 'div' : motion.div;
    const ItemWrapper = isGhost ? 'div' : motion.div;
    const themeColors = getThemeColors(namespace);
    const isCustomTheme = ['streaming', 'social', 'radio'].includes(namespace || '');

    return (
        <div className="flex flex-col h-full" style={{ gap: 22 }}>
            <Wrapper className="flex items-center gap-2 text-sm font-manrope font-bold text-dashboard-welcome-text" {...(!isGhost && { initial: { opacity: 0, x: -800, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)" }, transition: scaleTransition({ delay: (seqDuration! * peakTime!) + (startDelay! * 0.5) + 0.1, type: "spring", stiffness: 100, damping: 20 }) })}>
                <span className="text-[18px]">📋</span> {data.buttonText || t("reflex.howTo")}
            </Wrapper>
            <div className="flex flex-col h-full" style={{ gap: 22 }}>
                {data.steps.map((step, i) => (
                    <ItemWrapper key={step.id} className="flex items-center" style={{ gap: 22 }} {...(!isGhost && { initial: { opacity: 0, x: i % 2 === 0 ? -1000 : 1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)" }, transition: scaleTransition({ delay: (seqDuration! * peakTime!) + (startDelay! * 0.5) + 0.15 + (i * 0.05), type: "spring", stiffness: 100, damping: 20 }) })}>
                        <div 
                            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${isCustomTheme ? 'bg-dashboard-block-streaming-bg' : 'bg-dashboard-opportunity-number-bg border border-dashboard-opportunity-number-border text-dashboard-opportunity-number-text'}`}
                            style={isCustomTheme ? { border: `1px solid ${themeColors.border}`, color: themeColors.border, backgroundColor: themeColors.start } : {}}
                        >
                            {i + 1}
                        </div>
                        <p className="text-[13px] font-manrope font-medium text-foreground/80 leading-snug">{step.text}</p>
                    </ItemWrapper>
                ))}
            </div>
        </div>
    );
};

const Segment3Content = ({ data, isGhost = false, seqDuration, peakTime, startDelay }: { data: ReflexOpportunityData, isGhost?: boolean, seqDuration?: number, peakTime?: number, startDelay?: number }) => {
    const { t } = useTranslation();
    const Wrapper = isGhost ? 'div' : motion.div;
    return (
        <div className="flex flex-col h-full" style={{ gap: 22 }}>
             <Wrapper className="flex items-center gap-2" {...(!isGhost && { initial: { opacity: 0, x: -800, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)" }, transition: scaleTransition({ delay: (seqDuration! * peakTime!) + (startDelay! * 0.5) + 0.25, type: "spring", stiffness: 100, damping: 20 }) })}>
                <span className="text-[18px] leading-none shrink-0">💡</span>
                <h4 className="font-manrope font-bold text-dashboard-welcome-text text-sm mb-0">{data.insightTitle || t("reflex.insightTip")}</h4>
            </Wrapper>
            <Wrapper className="text-[13px] font-manrope font-medium text-foreground/80 leading-snug" {...(!isGhost && { initial: { opacity: 0, x: 1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)" }, transition: scaleTransition({ delay: (seqDuration! * peakTime!) + (startDelay! * 0.5) + 0.3, type: "spring", stiffness: 100, damping: 20 }) })}>
                {data.insightText || t("reflex.insightFallbackText")}
            </Wrapper>
        </div>
    );
};

/* SEGMENT3_I18N_CLEANUP_START
                {data.insightText || "Utilise Spotify for Artists (gratuit) et regarde l’onglet \"Playlists\" pour voir où tes sons sont placés."}
            </Wrapper>
        </div>
    );
};

SEGMENT3_I18N_CLEANUP_END */

const Segment4Content = ({ data, isGhost = false, seqDuration, peakTime, startDelay, isExpanded, toggleExpanded, namespace = "default", direction, contentKey, skipAnimation, onPlay }: { data: ReflexOpportunityData, isGhost?: boolean, seqDuration?: number, peakTime?: number, startDelay?: number, isExpanded?: boolean, toggleExpanded?: () => void, namespace?: string, direction?: number, contentKey?: string, skipAnimation?: boolean, onPlay?: () => void }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const { t } = useTranslation();
    const Wrapper = isGhost ? 'div' : motion.div;
    const sqgTransition = { type: "spring", stiffness: 280, damping: 30 };
    const seq = seqDuration || 1.0; const peak = peakTime || 0.8; const start = startDelay || 0.05;
    const parentDelay = (seq * peak) + start + 0.7;
    const getEntryTransition = (index: number) => ({ delay: parentDelay + 0.1 + (index * 0.1), type: "spring", stiffness: 100, damping: 20 });
    const proof = data.socialProof || DEFAULT_DATA.socialProof!;
    const ns = namespace;
    const themeColors = getThemeColors(namespace);
    const isCustomTheme = ['streaming', 'social', 'radio'].includes(namespace || '');

    return (
        <motion.div className="flex flex-col relative p-2 overflow-visible" transition={sqgTransition} style={{ gap: 22 }}> 
             <Wrapper className="flex items-center gap-1.5 w-fit mb-2" {...(!isGhost ? { layoutId: `${ns}-seg4-header`, transition: sqgTransition } : {})} {...(!isGhost && { initial: { opacity: 0, x: -800, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(0) } })}>
                <span className="text-xs">🎬</span>
                <span className="text-sm font-bold text-dashboard-welcome-text tracking-tight">{t("reflex.socialProof")}</span>
            </Wrapper>
            <SpatialContentWrapper direction={direction} contentKey={contentKey} disabled={isGhost}>
                <motion.div className={`w-full ${isExpanded ? 'flex flex-col md:grid md:grid-cols-[1.5fr_1fr] gap-5 md:gap-6 items-start' : 'flex items-start gap-4'}`} layout={skipAnimation || isGhost ? undefined : true} transition={sqgTransition}>
                    <Wrapper 
                        className={`relative shrink-0 rounded-lg overflow-hidden group/thumb ${isExpanded ? 'w-full aspect-video cursor-pointer' : 'w-[120px] h-[72px]'}`} 
                        onClick={() => { if (!isVideoPlaying) { setIsVideoPlaying(true); onPlay?.(); } }}
                        {...(!isGhost ? { 
                            layoutId: `${ns}-seg4-video`, 
                            transition: sqgTransition,
                            initial: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                            style: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                            whileHover: !isVideoPlaying ? { boxShadow: `0 0 20px 0px ${themeColors.border}` } : undefined
                        } : {})} 
                        {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: -1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(1) } })}
                    >
                        <motion.img draggable={false} layout transition={sqgTransition} src={proof.videoSrc || PLACEHOLDER_IMG} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} alt="Video Proof" className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                            {/* Running Lights border — stops when video is playing */}
                            <div
                                className="absolute inset-0 rounded-lg pointer-events-none"
                                style={{
                                    padding: '1.5px',
                                    background: `conic-gradient(from var(--rl-angle), transparent 0%, ${ns === 'social' ? 'var(--dashboard-social)' : ns === 'radio' ? 'var(--dashboard-radio)' : 'var(--dashboard-streaming)'} 15%, transparent 30%, transparent 100%)`,
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    animation: (!isGhost && !isVideoPlaying) ? 'runningLightSpin 2.5s linear infinite' : 'none',
                                } as any}
                            />
                            {/* Static base border */}
                            <div className="absolute inset-0 rounded-lg" style={{ border: `1px solid ${themeColors.border.replace(/[\d.]+\)$/, '0.15)')}` }} />
                            {/* Play button — hidden when video player is active */}
                            <AnimatePresence>
                                {!isVideoPlaying && (
                                    <motion.div 
                                        layoutId={!isGhost ? `${ns}-seg4-play-btn` : undefined} 
                                        transition={sqgTransition} 
                                        className={`relative z-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center ${isExpanded ? 'w-14 h-14 md:w-16 md:h-16' : 'w-8 h-8'}`}
                                        exit={{ scale: 0, opacity: 0 }}
                                    >
                                        <Play size={isExpanded ? 24 : 14} className="fill-white text-white translate-x-0.5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Video Player Overlay */}
                        <AnimatePresence>
                            {isVideoPlaying && !isGhost && (
                                <VideoPlayerOverlay
                                    isPlaying={isVideoPlaying}
                                    onClose={() => setIsVideoPlaying(false)}
                                    namespace={namespace}
                                    thumbnailSrc={proof.videoSrc}
                                    isExpanded={isExpanded}
                                />
                            )}
                        </AnimatePresence>
                    </Wrapper>
                    <div className={`flex flex-col ${isExpanded ? 'w-full' : 'flex-1 min-w-0'}`}>
                        <div className="flex flex-col shrink-0">
                            <motion.h4 layoutId={!isGhost ? `${ns}-seg4-title` : undefined} transition={sqgTransition} className={`font-bold text-dashboard-welcome-text leading-tight text-[14px] ${isExpanded ? 'm-0 mb-4' : 'mb-1'}`} {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: 1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(2) } })}>
                                 {isExpanded ? proof.title.replace(/^"|"$/g, '') : `"${proof.title.replace(/^"|"$/g, '')}"`}
                            </motion.h4>
                            <motion.div layoutId={!isGhost ? `${ns}-seg4-meta` : undefined} transition={sqgTransition} className={`flex items-center gap-2.5 w-fit ${isExpanded ? 'mb-6' : 'mt-2'}`} {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: 1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(3) } })}>
                                <div className={`w-9 h-9 rounded-full ${isCustomTheme ? 'bg-dashboard-block-streaming-bg' : 'bg-dashboard-opportunity-number-bg'} flex items-center justify-center text-xs font-bold text-dashboard-welcome-text shrink-0`} style={isCustomTheme ? { backgroundColor: themeColors.start } : {}}>{proof.initials}</div>
                                <div className="flex flex-col min-w-[60px]">
                                    <span className="text-[12px] font-bold text-dashboard-welcome-text leading-none" translate="no">{proof.author}</span>
                                    <span className="text-[10px] font-medium text-dashboard-welcome-text/60 leading-tight">{proof.views}</span>
                                </div>
                            </motion.div>
                        </div>

                        <div className="w-full">
                            <AnimatePresence mode="wait">
                                {isExpanded && (
                                    <Wrapper 
                                        key="insight-lg"
                                        className="w-full"
                                        {...(!isGhost ? {
                                            initial: { x: 600, opacity: 0, filter: "blur(10px)" }, 
                                            animate: { x: 0, opacity: 1, filter: "blur(0px)" }, 
                                            exit: { x: 600, opacity: 0, filter: "blur(10px)" }, 
                                            transition: scaleTransition({ type: "spring", stiffness: 100, damping: 20, delay: 0.1 })
                                        } : {})}
                                    >
                                        <DynamicInsightBlock title={proof.descriptionTitle} description={proof.description} namespace={namespace} useMainTheme={true} noBorder={true} />
                                    </Wrapper>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </SpatialContentWrapper>
        </motion.div>
    );
};

const Segment4ContentGospel = ({ data, isGhost = false, seqDuration, peakTime, startDelay, isExpanded, toggleExpanded, namespace = "default", onPlay }: { data: ReflexOpportunityData, isGhost?: boolean, seqDuration?: number, peakTime?: number, startDelay?: number, isExpanded?: boolean, toggleExpanded?: () => void, namespace?: string, onPlay?: () => void }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const { t } = useTranslation();
    const Wrapper = isGhost ? 'div' : motion.div;
    const sqgTransition = { type: "spring", stiffness: 280, damping: 30 };
    const seq = seqDuration || 1.0; const peak = peakTime || 0.8; const start = startDelay || 0.05;
    // Reduced delay for immediate entry in side stage
    const parentDelay = (seq * peak) + start;
    const getEntryTransition = (index: number) => ({ delay: parentDelay + 0.1 + (index * 0.1), type: "spring", stiffness: 100, damping: 20 });
    const proof = data.socialProof || DEFAULT_DATA.socialProof!;
    const ns = namespace;
    const themeColors = getThemeColors(namespace);

    return (
        <motion.div className="flex flex-col relative p-2 overflow-visible" transition={sqgTransition} style={{ gap: 22 }}> 
             <Wrapper className="flex items-center gap-1.5 w-fit mb-2" {...(!isGhost ? { layoutId: `${ns}-seg4-gospel-header`, transition: sqgTransition } : {})} {...(!isGhost && { initial: { opacity: 0, x: -800, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(0) } })}>
                <span className="text-xs">🎬</span>
                <span className="text-sm font-bold text-dashboard-welcome-text tracking-tight">{t("reflex.socialProof")}</span>
            </Wrapper>
            <motion.div className={`w-full ${isExpanded ? 'flex flex-col md:grid md:grid-cols-[1.5fr_1fr] gap-5 md:gap-6 items-start' : 'flex items-start gap-4'}`} layout={!isGhost} transition={sqgTransition}>
                <Wrapper 
                    className={`relative shrink-0 rounded-lg overflow-hidden group/thumb ${isExpanded ? 'w-full aspect-video cursor-pointer' : 'w-[120px] h-[72px]'}`} 
                    onClick={() => { if (!isVideoPlaying) { setIsVideoPlaying(true); onPlay?.(); } }}
                    {...(!isGhost ? { 
                        layoutId: `${ns}-seg4-gospel-video`, 
                        transition: sqgTransition,
                        initial: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                        style: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                        whileHover: !isVideoPlaying ? { boxShadow: `0 0 20px ${themeColors.border}` } : undefined
                    } : {})} 
                    {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: -1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(1) } })}
                >
                    <motion.img draggable={false} layout transition={sqgTransition} src={proof.videoSrc || PLACEHOLDER_IMG} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} alt="Video Proof" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        {/* Running Lights border — stops when video is playing */}
                        <div
                            className="absolute inset-0 rounded-lg pointer-events-none"
                            style={{
                                padding: '1.5px',
                                background: `conic-gradient(from var(--rl-angle), transparent 0%, ${ns === 'social' ? 'var(--dashboard-social)' : ns === 'radio' ? 'var(--dashboard-radio)' : 'var(--dashboard-streaming)'} 15%, transparent 30%, transparent 100%)`,
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                animation: (!isGhost && !isVideoPlaying) ? 'runningLightSpin 2.5s linear infinite' : 'none',
                            } as any}
                        />
                        {/* Static base border */}
                        <div className="absolute inset-0 rounded-lg" style={{ border: `1px solid ${themeColors.border.replace(/[\d.]+\)$/, '0.15)')}` }} />
                        {/* Play button — hidden when video player is active */}
                        <AnimatePresence>
                            {!isVideoPlaying && (
                                <motion.div 
                                    layoutId={!isGhost ? `${ns}-seg4-gospel-play-btn` : undefined} 
                                    transition={sqgTransition} 
                                    className={`relative z-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center ${isExpanded ? 'w-14 h-14 md:w-16 md:h-16' : 'w-8 h-8'}`}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    <Play size={isExpanded ? 24 : 14} className="fill-white text-white translate-x-0.5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Video Player Overlay */}
                    <AnimatePresence>
                        {isVideoPlaying && !isGhost && (
                            <VideoPlayerOverlay
                                isPlaying={isVideoPlaying}
                                onClose={() => setIsVideoPlaying(false)}
                                namespace={namespace}
                                thumbnailSrc={proof.videoSrc}
                                isExpanded={isExpanded}
                            />
                        )}
                    </AnimatePresence>
                </Wrapper>
                <div className={`flex flex-col ${isExpanded ? 'w-full' : 'flex-1 min-w-0'}`}>
                    <div className="flex flex-col shrink-0">
                        <motion.h4 layoutId={!isGhost ? `${ns}-seg4-gospel-title` : undefined} transition={sqgTransition} className={`font-bold text-dashboard-welcome-text leading-tight text-[14px] ${isExpanded ? 'm-0 mb-4' : 'mb-1'}`} {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: 1000, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(2) } })}>
                             {proof.title}
                        </motion.h4>

                    </div>

                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            {isExpanded && (
                                <Wrapper 
                                    key="insight-lg"
                                    className="w-full"
                                    {...(!isGhost ? {
                                        initial: { x: 600, opacity: 0, filter: "blur(10px)" }, 
                                        animate: { x: 0, opacity: 1, filter: "blur(0px)" }, 
                                        exit: { x: 600, opacity: 0, filter: "blur(10px)" }, 
                                        transition: scaleTransition({ type: "spring", stiffness: 100, damping: 20, delay: 0.1 })
                                    } : {})}
                                >
                                    <DynamicInsightBlock title={proof.descriptionTitle || t("reflex.description")} description={proof.description || t("reflex.socialProofDetails")} namespace={namespace} useMainTheme={true} noBorder={true} />
                                </Wrapper>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Segment5Content = ({ data, isGhost = false, seqDuration, peakTime, startDelay, isExpanded, toggleExpanded, namespace = "default", onPlay, badgeType = 'priorite' }: { data: ReflexOpportunityData, isGhost?: boolean, seqDuration?: number, peakTime?: number, startDelay?: number, isExpanded?: boolean, toggleExpanded?: () => void, namespace?: string, onPlay?: () => void, badgeType?: 'priorite' | 'recommande' | 'bonus' }) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const { t } = useTranslation();
    const badgeConfig = BADGE_CONFIGS[badgeType];
    const Wrapper = isGhost ? 'div' : motion.div;
    const sqgTransition = { type: "spring", stiffness: 280, damping: 30 };
    const playlist = data.playlist || DEFAULT_DATA.playlist!;
    const ns = namespace;
    const themeColors = getThemeColors(namespace);
    
    // Animation d'entrée pour le bloc entier (quand isDivided devient true)
    // Lateral Glide (x: -400 -> 0) pour les éléments internes, en cascade avec le parent
    const seq = seqDuration || 1.0; const peak = peakTime || 0.8; const start = startDelay || 0.05;
    const parentDelay = (seq * peak) + start + 0.85; // Un peu après Segment 4
    
    // Fonction helper pour les entrées latérales
    // On ajoute un délai relatif au parent qui entre déjà à 0.1s
    const getEntryTransition = (index: number) => ({ delay: 0.15 + (index * 0.05), type: "spring", stiffness: 100, damping: 20 });

    return (
        <motion.div className="flex flex-col relative p-2 overflow-visible z-20 z-20" layout="position" transition={sqgTransition} style={{ gap: 22 }}>
             {/* Header Section - Clickable to toggle */}
             <Wrapper 
                className="flex items-center gap-1.5 w-fit cursor-pointer" 
                onClick={(e: any) => { if(!isExpanded) { e.stopPropagation(); toggleExpanded?.(); } }}
                {...(!isGhost ? { layoutId: `${ns}-seg5-header`, transition: sqgTransition } : {})} 
                {...(!isGhost && { initial: { opacity: 0, x: -50, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(0) } })}
            >
                <motion.div 
                    className="px-[8px] py-[4px] rounded-[4px] relative flex items-center justify-center overflow-hidden"
                    animate={{ 
                        boxShadow: badgeConfig.glowShadows
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {/* Magma base — slow morphing lava radial gradient */}
                    <motion.div 
                        className="absolute inset-0 rounded-[4px]"
                        animate={{ backgroundImage: badgeConfig.magmaPrimary }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* Secondary magma vein — offset cycle for viscous depth */}
                    <motion.div 
                        className="absolute inset-0 rounded-[4px]"
                        animate={{ backgroundImage: badgeConfig.magmaSecondary }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative z-10 text-sm font-bold text-white tracking-tight leading-none drop-shadow-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{t(badgeConfig.labelKey)}</span>
                </motion.div>
            </Wrapper>
            
            <motion.div className={`w-full ${isExpanded ? 'flex flex-col md:grid md:grid-cols-[1.5fr_1fr] gap-[22px] items-start' : 'grid grid-cols-[120px_1fr] gap-x-4 gap-y-[22px] items-start'}`} layout transition={sqgTransition}>
                {/* Thumbnail */}
                <Wrapper 
                    className={`relative shrink-0 rounded-lg overflow-hidden group/thumb ${isExpanded ? 'w-full aspect-video cursor-pointer' : 'w-[120px] h-[72px] order-2'}`} 
                    onClick={() => { if (!isVideoPlaying) { setIsVideoPlaying(true); onPlay?.(); } }}
                    {...(!isGhost ? { 
                        layoutId: `${ns}-seg5-video`, 
                        transition: sqgTransition,
                        initial: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                        style: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
                        whileHover: !isVideoPlaying ? { boxShadow: `0 0 20px ${themeColors.border}` } : undefined
                    } : {})} 
                    {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: -100, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(1) } })}
                >

                     <motion.img draggable={false} layout transition={sqgTransition} src={playlist.videoSrc || PLACEHOLDER_IMG} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} alt="Playlist Video" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                        {/* Running Lights border — stops when video is playing */}
                        <div
                            className="absolute inset-0 rounded-lg pointer-events-none"
                            style={{
                                padding: '1.5px',
                                background: `conic-gradient(from var(--rl-angle), transparent 0%, ${ns === 'social' ? 'var(--dashboard-social)' : ns === 'radio' ? 'var(--dashboard-radio)' : 'var(--dashboard-streaming)'} 15%, transparent 30%, transparent 100%)`,
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                                animation: (!isGhost && !isVideoPlaying) ? 'runningLightSpin 2.5s linear infinite' : 'none',
                            } as any}
                        />
                        {/* Static base border for subtle persistent visibility */}
                        <div className="absolute inset-0 rounded-lg" style={{ border: `1px solid ${themeColors.border.replace(/[\d.]+\)$/, '0.15)')}` }} />
                        {/* Play button — hidden when video player is active */}
                        <AnimatePresence>
                            {!isVideoPlaying && (
                                <motion.div 
                                    layoutId={!isGhost ? `${ns}-seg5-play-btn` : undefined} 
                                    transition={sqgTransition} 
                                    className={`relative z-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center ${isExpanded ? 'w-14 h-14 md:w-16 md:h-16' : 'w-8 h-8'}`}
                                    exit={{ scale: 0, opacity: 0 }}
                                >
                                    <Play size={isExpanded ? 24 : 14} className="fill-white text-white translate-x-0.5" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    {/* Video Player Overlay */}
                    <AnimatePresence>
                        {isVideoPlaying && !isGhost && (
                            <VideoPlayerOverlay
                                isPlaying={isVideoPlaying}
                                onClose={() => setIsVideoPlaying(false)}
                                namespace={namespace}
                                thumbnailSrc={playlist.videoSrc}
                                isExpanded={isExpanded}
                            />
                        )}
                    </AnimatePresence>
                </Wrapper>

                {/* Content Side */}
                <div className={`${isExpanded ? 'flex flex-col w-full' : 'contents'}`}>
                    <div className={`${isExpanded ? 'flex flex-col shrink-0 gap-2' : 'contents'}`}>
                        {/* Title - Match Segment 4 Size (text-[14px]) */}
                        <motion.h4 layoutId={!isGhost ? `${ns}-seg5-title` : undefined} transition={sqgTransition} className={`font-bold text-dashboard-welcome-text leading-tight text-[14px] ${isExpanded ? 'm-0' : 'mb-1 order-3 self-start'}`} {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: -100, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(2) } })}>
                             {playlist.title}
                        </motion.h4>
                        
                         {/* Description - Moves via SQG Layout, no Lateral Glide */}
                         <motion.div 
                            layout
                            className={`text-[13px] font-manrope font-medium text-foreground/80 leading-snug w-full ${!isExpanded ? 'col-span-2 order-1' : ''}`}
                             {...(!isGhost && !isExpanded && { initial: { opacity: 0, x: -100, filter: "blur(10px)" }, animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: getEntryTransition(3) } })}
                         >
                            {playlist.description}
                        </motion.div>
                    </div>
                </div>
            </motion.div>


        </motion.div>
    );
};

const MorphingSegment = ({ isDivided, delay, targetType, children, className, height, y, borderRadius = "16px", padding = 0, showStrokeAnimation = false, mitosisComplete = false, skipAnimation = false }: { isDivided: boolean, delay: number, targetType: "MOTHER" | "EMERALD" | "AMBER" | "STREAMING" | "STREAMING_ASTUCE" | "SOCIAL" | "SOCIAL_ASTUCE" | "RADIO" | "RADIO_ASTUCE", children?: React.ReactNode, className?: string, height: number, y: number, borderRadius?: string, padding?: number, showStrokeAnimation?: boolean, mitosisComplete?: boolean, skipAnimation?: boolean }) => {
    const targetColors = COLORS[targetType] || COLORS.EMERALD;
    const motherColors = COLORS.MOTHER;
    const elasticTransition = { type: "spring", stiffness: 100, damping: 25, mass: 1.5 };
    const expansionTransition = { type: "spring", stiffness: 280, damping: 30 };
    
    // On utilise la transition d'expansion sans délai si la mitose est terminée
    const activeTransition = mitosisComplete ? expansionTransition : elasticTransition;
    const activeDelay = mitosisComplete ? 0 : delay;
    
    const getBaseRGB = (type: string) => {
        if (type.includes('STREAMING')) return "242,142,66";
        if (type.includes('SOCIAL')) return "28,180,91";
        if (type.includes('RADIO')) return "18,134,243";
        if (type.includes('AMBER')) return "184,94,20"; 
        return "16,185,129"; // Default Emerald
    };
    const baseRGB = getBaseRGB(targetType);
    const lightColor = `rgba(${baseRGB},0.8)`;
    const hoverShadow = `0px 0px 20px 0px rgba(${baseRGB},0.4)`;
    const transparentShadow = `0px 0px 0px 0px rgba(${baseRGB},0)`;

    return (
        <motion.div 
            className={`absolute left-0 w-full ${className}`}
            animate={{ 
                y: isDivided ? y : 190, height: isDivided ? height : 190, opacity: isDivided ? 1 : 0,
                "--bg-s": isDivided ? (targetType === "MOTHER" ? motherColors.start : [motherColors.start, targetColors.start]) : motherColors.start,
                "--bg-e": isDivided ? (targetType === "MOTHER" ? motherColors.end : [motherColors.end, targetColors.end]) : motherColors.end,
                "--border": isDivided ? (targetType === "MOTHER" ? motherColors.border : [motherColors.border, targetColors.border]) : motherColors.border,
            } as any}
            transition={{ 
                y: skipAnimation ? { duration: 0 } : { ...activeTransition, delay: activeDelay }, 
                height: skipAnimation ? { duration: 0 } : { ...activeTransition, delay: activeDelay }, 
                opacity: { duration: 0.2, delay: activeDelay }, 
                "--bg-s": { duration: 4, ease: "easeInOut", delay: activeDelay + 0.1 }, 
                "--bg-e": { duration: 4, ease: "easeInOut", delay: activeDelay + 0.1 }, 
                "--border": { duration: 4, ease: "easeInOut", delay: activeDelay + 0.1 } 
            }}
            style={{ borderRadius, backgroundImage: `linear-gradient(to bottom right, var(--bg-s), var(--bg-e))`, borderColor: `var(--border)`, borderWidth: isDivided ? "1px" : "0px", borderStyle: "solid", backdropFilter: "blur(4px)", backgroundColor: "transparent", padding: padding, overflow: "visible", boxShadow: transparentShadow } as any}
            whileHover={{ boxShadow: showStrokeAnimation ? hoverShadow : transparentShadow }}
        >
            {showStrokeAnimation && isDivided && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: "inherit" }}>
                    <motion.span className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[${lightColor}] to-transparent`} animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                    <motion.span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[${lightColor}] to-transparent`} animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} />
                    <motion.span className={`absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[${lightColor}] to-transparent`} animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }} />
                    <motion.span className={`absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[${lightColor}] to-transparent`} animate={{ y: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: 1.5 }} />
                </div>
            )}
            <AnimatePresence>{isDivided && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={skipAnimation ? { duration: 0 } : { delay: (mitosisComplete ? 0 : delay) + 0.4 }}>{children}</motion.div>)}</AnimatePresence>
        </motion.div>
    );
};

const INSTANCE_STATE_CACHE: Record<string, boolean> = {};
const INSTANCE_CONTRACTED_CACHE: Record<string, boolean> = {};

export function ReflexOpportunity({ onTrigger, isDivided: externalIsDivided, setIsDivided: externalSetIsDivided, data: externalData, namespace = "default", direction }: ReflexOpportunityProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [lastNamespace, setLastNamespace] = useState(namespace);
    const { t } = useTranslation();
    
    // Use translated defaults when no external data is provided
    const data = useMemo(() => externalData ?? getTranslatedDefaultData(t), [externalData, t]);
    
    // Initial state from cache
    const [internalIsDivided, setInternalIsDivided] = useState(() => INSTANCE_STATE_CACHE[namespace] ?? false);
    
    // Update state when namespace changes
    useLayoutEffect(() => {
        setInternalIsDivided(INSTANCE_STATE_CACHE[namespace] ?? false);
        setIsContracted(INSTANCE_CONTRACTED_CACHE[namespace] ?? false);
        // Reset or restore other states if needed
    }, [namespace]);

    const themeColors = getThemeColors(namespace);
    const astuceColors = getAstuceThemeColors(namespace);
    const isCustomTheme = ['streaming', 'social', 'radio'].includes(namespace || '');
    
    const targetTheme = (namespace === 'streaming' ? "STREAMING" : namespace === 'social' ? "SOCIAL" : namespace === 'radio' ? "RADIO" : "EMERALD") as any;
    const targetAstuceTheme = (namespace === 'streaming' ? "STREAMING_ASTUCE" : namespace === 'social' ? "SOCIAL_ASTUCE" : namespace === 'radio' ? "RADIO_ASTUCE" : "AMBER") as any;

    // Initialize skipAnimation based on persisted state to prevent re-opening animation
    const [skipAnimation, setSkipAnimation] = useState(internalIsDivided);

    if (namespace !== lastNamespace) {
        setLastNamespace(namespace);
        setSkipAnimation(true);
    }

    useEffect(() => {
        if (skipAnimation) {
            const t = setTimeout(() => setSkipAnimation(false), 100);
            return () => clearTimeout(t);
        }
    }, [skipAnimation]);

    const [isContracted, setIsContracted] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const prevPageRef = useRef(activePage);
    const slideDirection = activePage > prevPageRef.current ? 1 : -1;
    useEffect(() => { prevPageRef.current = activePage; }, [activePage]);
    const priorityBlockRef = useRef<HTMLDivElement>(null);

    const pages = useMemo(() => {
        // Badge sequence: Page 1 = priorite, Page 2 = recommande, Page 3 = bonus (cycling)
        const BADGE_SEQUENCE: Array<'priorite' | 'recommande' | 'bonus'> = ['priorite', 'recommande', 'bonus'];
        
        let rawPages: ReflexOpportunityPage[];
        if (data.pages && data.pages.length > 0) {
            rawPages = data.pages;
        } else {
            // Generate dummy pages if not present, cloning Page 1 structure
            const page1: ReflexOpportunityPage = { 
                playlist: data.playlist || DEFAULT_DATA.playlist!, 
                socialProof: data.socialProof || DEFAULT_DATA.socialProof!, 
                insightTitle: data.insightTitle, 
                insightText: data.insightText,
                badgeType: 'priorite'
            };
            rawPages = getTranslatedFallbackPages(t, page1);
        }
        
        // DEFENSIVE: Always enforce correct badgeType per page index
        // Guarantees Page 1=priorite, Page 2=recommande, Page 3=bonus regardless of data source
        return rawPages.map((page, i) => ({
            ...page,
            badgeType: BADGE_SEQUENCE[i % BADGE_SEQUENCE.length]
        }));
    }, [data, t]);
    const [buttonLabel, setButtonLabel] = useState(internalIsDivided ? t("reflex.justForMe") : (data.buttonText || t("reflex.howTo")));
    
    // Resync buttonLabel when language (t) or data changes
    useEffect(() => {
        if (mitosisComplete || internalIsDivided) {
            setButtonLabel(t("reflex.justForMe"));
        } else {
            setButtonLabel(data.buttonText || t("reflex.howTo"));
        }
    }, [t, data.buttonText]);
    
    const [isSocialProofExpanded, setIsSocialProofExpanded] = useState(true);
    const [isSideSocialProofExpanded, setIsSideSocialProofExpanded] = useState(true);
    const [isPlaylistExpanded, setIsPlaylistExpanded] = useState(true);
    const [hasPlayedSocialProof, setHasPlayedSocialProof] = useState(false);
    const [hasPlayedPlaylist, setHasPlayedPlaylist] = useState(false);
    const [mitosisComplete, setMitosisComplete] = useState(internalIsDivided);
    const [isHovered, setIsHovered] = useState(false);
    // State to suppress initial positioning animations (prevents "jumping" on mount)
    const [animationsEnabled, setAnimationsEnabled] = useState(false);
    
    // Independent state logic with persistence
    const isDivided = internalIsDivided;
    const setIsDivided = (val: boolean) => {
        INSTANCE_STATE_CACHE[namespace] = val;
        setInternalIsDivided(val);
        if (externalSetIsDivided) externalSetIsDivided(val);
        
        // Reset contracted state when closing division
        if (!val) {
            setIsContracted(false);
            INSTANCE_CONTRACTED_CACHE[namespace] = false;
        }
    };

    // Sync parent on mount to match persisted state
    useEffect(() => {
        if (externalSetIsDivided) externalSetIsDivided(internalIsDivided);
    }, []);
    const ghostH1Ref = useRef<HTMLDivElement>(null); 
    const ghostH2Ref = useRef<HTMLDivElement>(null); 
    const ghostH3Ref = useRef<HTMLDivElement>(null); 
    const ghostH4CollapsedRef = useRef<HTMLDivElement>(null);
    const ghostH4ExpandedRef = useRef<HTMLDivElement>(null);
    const ghostH5CollapsedRef = useRef<HTMLDivElement>(null);
    const ghostH5ExpandedRef = useRef<HTMLDivElement>(null);
    
    // Ghost Measurement pour PlanHeader
    const scrollTargetRef = useRef<HTMLDivElement>(null);
    const ghostPlanHeaderRef = useRef<HTMLDivElement>(null);
    const [hPlanHeader, setHPlanHeader] = useState(60);

    const [h1, setH1] = useState(190); 
    const [h2, setH2] = useState(240); 
    const [h3, setH3] = useState(180); 
    const [h4Collapsed, setH4Collapsed] = useState(220);
    const [h4Expanded, setH4Expanded] = useState(500);
    const [h5Collapsed, setH5Collapsed] = useState(220);
    const [h5Expanded, setH5Expanded] = useState(500);
    
    const [h4GospelCollapsed, setH4GospelCollapsed] = useState(220);
    const [h4GospelExpanded, setH4GospelExpanded] = useState(500);
    
    // Mesure fantôme pour la version Gospel (Scène Latérale) / Ghost Measurement for Gospel Version (Side Stage)
    const ghostH4GospelCollapsedRef = useRef<HTMLDivElement>(null);
    const ghostH4GospelExpandedRef = useRef<HTMLDivElement>(null);

    // Mesure fantôme pour le Segment 3 de la scène latérale / Ghost Measurement for Side Stage Segment 3
    // FIX MOBILE: Le texte "Astuce" diffère entre la vue standard et "Juste pour moi".
    // [EN] The "Insight" text differs between standard view and "Just for me".
    // Sur mobile, le texte "Juste pour moi" est plus long et passe à la ligne, augmentant la hauteur.
    // [EN] On mobile, the "Just for me" text is longer and wraps, increasing height.
    // On doit donc mesurer spécifiquement cette version pour éviter que le bloc suivant (Preuve Sociale) ne chevauche celui-ci.
    // [EN] We must specifically measure this version to prevent the next block (Social Proof) from overlapping it.
    const ghostH3SideStageRef = useRef<HTMLDivElement>(null);
    const [h3SideStage, setH3SideStage] = useState(180);

    // Mesure réelle du contenu de la scène latérale pour ajuster la hauteur totale sans vide excessif
    // Utilisation d'une Callback Ref pour garantir la capture du nœud DOM à chaque montage/remontage
    // Use Callback Ref to ensure DOM node capture on every mount/remount
    const observerRef = useRef<ResizeObserver | null>(null);
    const [sideStageHeight, setSideStageHeight] = useState(0);

    // Note: onSideStageRefChange definition moved below swipeHandlers to avoid TDZ issues with dependency array.


    // Reset height when namespace OR data changes to prevent stale height persistence
    // This ensures that when switching tabs or data contexts, we don't carry over the previous height
    useLayoutEffect(() => {
        setSideStageHeight(0);
        setActivePage(0); // Force reset page on data change
    }, [namespace, data]);

    // Note: The previous useEffect for ResizeObserver is removed in favor of the Callback Ref pattern.

    // État pour l'espaceur de défilement temporaire / State for temporary scroll spacer
    const [showScrollSpacer, setShowScrollSpacer] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // FIX: Decouple Standard vs Gospel heights to prevent layout thrashing in Main Stack
    // Le bloc "Main Stack" (Segment 4) doit toujours utiliser la hauteur Standard, même si isContracted est actif.
    // The "Main Stack" (Segment 4) must always use Standard height, even if isContracted is active.
    const h4 = isSocialProofExpanded ? h4Expanded : h4Collapsed;
    const h4SideStage = isSideSocialProofExpanded ? h4GospelExpanded : h4GospelCollapsed;

    const h5 = isPlaylistExpanded ? h5Expanded : h5Collapsed;

    // Mesure instantanée pour éviter le décalage de layout / Instant measurement to avoid layout shift
    useLayoutEffect(() => {
        const measure = () => { 
            setIsMobile(window.innerWidth < 768);
            if (ghostH1Ref.current) setH1(ghostH1Ref.current.offsetHeight || 190);  
            if (ghostH2Ref.current) setH2(ghostH2Ref.current.offsetHeight || 240); 
            if (ghostH3Ref.current) setH3(ghostH3Ref.current.offsetHeight || 180); 
            if (ghostH3SideStageRef.current) setH3SideStage(ghostH3SideStageRef.current.offsetHeight || 180);
            if (ghostH4CollapsedRef.current) setH4Collapsed(ghostH4CollapsedRef.current.offsetHeight || 220); 
            if (ghostH4ExpandedRef.current) setH4Expanded(ghostH4ExpandedRef.current.offsetHeight || 500); 
            if (ghostH4GospelCollapsedRef.current) setH4GospelCollapsed(ghostH4GospelCollapsedRef.current.offsetHeight || 220);
            if (ghostH4GospelExpandedRef.current) setH4GospelExpanded(ghostH4GospelExpandedRef.current.offsetHeight || 500);
            if (ghostH5CollapsedRef.current) setH5Collapsed(ghostH5CollapsedRef.current.offsetHeight || 220); 
            if (ghostH5ExpandedRef.current) setH5Expanded(ghostH5ExpandedRef.current.offsetHeight || 500); 
            if (ghostPlanHeaderRef.current) setHPlanHeader(ghostPlanHeaderRef.current.offsetHeight || 60);
        };
        measure();
        // Plusieurs passes pour capturer la fin du rendu
        const timers = [10, 50, 150].map(t => setTimeout(measure, t));
        window.addEventListener('resize', measure); 
        return () => { 
            window.removeEventListener('resize', measure); 
            timers.forEach(clearTimeout);
        };
    }, [data, isPlaylistExpanded, isSideSocialProofExpanded, activePage, isContracted]); // Added dependencies to trigger remeasure on expansion/page change

    // SAMSARA SHIFT LOGIC (Visibility-based Transmigration)
    // We monitor the "Genesis" position (Top). If it scrolls out of view, the soul shifts to "Revelation" (Bottom).
    const { ref: genesisObserverRef, inView: isGenesisVisible } = useInView({
        threshold: 0,
        rootMargin: "-200px 0px 0px 0px", // Trigger when header is fully scrolled out (increased margin)
    });

    const isSoulShifted = !isGenesisVisible;

    const SEQ_DURATION = 1.0; 
    const PEAK_TIME = 0.8; 
    const sequenceTimes = [0, PEAK_TIME, 1]; 
    const START_DELAY = 0.05; 
    const GAP = 22; 
    const SPLIT_GAP = 50;
    const POS_1 = 0; 
    
    // REORDERED LAYOUT: Mother (Pos 1) -> Social Proof (Seg 4) -> Astuce (Seg 3) -> Comment Faire (Seg 2)
    // We calculate Y positions based on the new stack order.
    
    // Position for Segment 4 (Social Proof) - formerly Slot 2
    const Y_SEG_4 = isDivided ? h1 + SPLIT_GAP : h1; 
    
    // Position for Segment 3 (Astuce) - formerly Slot 3
    const Y_SEG_3 = isDivided ? Y_SEG_4 + h4 + GAP : h1; 
    
    // Position for Segment 2 (Comment Faire) - formerly Slot 4
    const Y_SEG_2 = isDivided ? Y_SEG_3 + h3 + GAP : h1;
    
    const TOTAL_HEIGHT_JOINED = h1; 
    // Total height ends with the last element in the stack (Segment 2)
    const TOTAL_HEIGHT_DIVIDED = Y_SEG_2 + h2; 
    const PEAK_EXTRA = 120; 
    const BUTTON_EJECTION = TOTAL_HEIGHT_DIVIDED + GAP;
    const PLAN_HEADER_Y = BUTTON_EJECTION;
    const SEGMENT5_Y = PLAN_HEADER_Y + 48 + GAP;
    const SEGMENT3_Y = SEGMENT5_Y + h5 + GAP;
    const SEGMENT4_Y = SEGMENT3_Y + h3SideStage + GAP;
    // Manual adjustment to tighten the bottom void
    // Visual stack: Top offset (100) + h5 + 32 + h3 + 32 + h4 + 20
    
    // [AI_GUIDELINES] CONTRAINTES DE GÉNÉRATION DE CONTENU
    // Pour garantir la stabilité de l'interface mobile (Samsara Shift) et éviter les redimensionnements brusques,
    // tout contenu généré par IA pour ces blocs doit respecter strictement ces limites :
    // ---------------------------------------------------------------------------
    // 1. TITRES (Insight, Playlist, Social Proof) : Max 40 caractères.
    //    -> Idéal : Court, percutant, sans retour à la ligne.
    //
    // 2. CORPS DE TEXTE (Description, Astuce, Citation) : Max 150 caractères.
    //    -> Idéal : 2 phrases simples. Résumé dense. Pas de remplissage.
    //    -> Si le texte dépasse, il sera tronqué ou causera des problèmes d'alignement.
    // ---------------------------------------------------------------------------

    // FIX DESKTOP: The content starts at PLAN_HEADER_Y.
    // The previous calculation added 100px arbitrarily. We should just use the measured height relative to the start.
    // [MODIFICATION] Decoupling Side Stage height from Main Page height.
    // Use measured height (sideStageHeight) or a neutral fallback (300px) to prevent inheriting the potentially large height of the Main Page matrix.
    const effectiveSideStageHeight = sideStageHeight > 0 ? sideStageHeight : 300;
    // [FIX] Align Desktop with Mobile: Use dynamic header height (hPlanHeader) and consistent padding
    // Previously, Desktop used a fixed CONTENT_OFFSET_DESKTOP which caused layout issues.
    // By using hPlanHeader, we ensure the content starts exactly where the header ends.
    const CONTENT_START_Y = PLAN_HEADER_Y + (hPlanHeader + 88);
    const TOTAL_HEIGHT_CONTRACTED = CONTENT_START_Y + effectiveSideStageHeight;
    
    // Position of the navigation dots when shifted to bottom
    const NAV_BOTTOM_OFFSET = -20; // Consistent for both mobile and desktop
    // Container height needs to include space for the bottom navigation so it doesn't get clipped or disappear
    // [FIX] Align Desktop padding with Mobile (40px) to prevent void
    const TOTAL_HEIGHT_WITH_NAV = TOTAL_HEIGHT_CONTRACTED + 40;

    // Transition pour l'expansion du bloc Preuve Sociale (Segment 4) 
    const H_PEAK = BUTTON_EJECTION + PEAK_EXTRA; 
    const BUTTON_REST_Y = h1 - 70; 
    const BOTTOM_MARGIN = TOTAL_HEIGHT_JOINED - BUTTON_REST_Y; 
    const BUTTON_PEAK_Y = H_PEAK - BOTTOM_MARGIN;

    // Transition pour l'expansion du bloc Preuve Sociale (Segment 4)
    const expansionTransition = { type: "spring", stiffness: 280, damping: 30 };

    useEffect(() => {
        // Enable animations after layout stabilization (slightly longer than slide transition)
        const timer = setTimeout(() => setAnimationsEnabled(true), 600);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isDivided) {
            if (!mitosisComplete) {
                const mitosisTimer = setTimeout(() => {
                    setMitosisComplete(true);
                    setButtonLabel(t("reflex.justForMe"));
                    // Ensure spacer is removed when animation phase completes
                    setShowScrollSpacer(false);
                }, (SEQ_DURATION * 1000) + (START_DELAY * 1000) + 100);
                return () => clearTimeout(mitosisTimer);
            }
        } else { 
            setButtonLabel(data.buttonText || t("reflex.howTo")); 
            setMitosisComplete(false); 
            setIsContracted(false);
        }
    }, [isDivided, data.buttonText, t]);

    const elasticTransition = { type: "spring", stiffness: 100, damping: 25, mass: 1.5 };
    const commonDelay = isDivided ? (SEQ_DURATION * PEAK_TIME) + START_DELAY : 0;

    const handleStart = (e: React.MouseEvent) => { 
        e.stopPropagation(); 
        if (!isDivided) { 
            // Activate spacer BEFORE setting divided state to ensure layout room
            setShowScrollSpacer(true);
            setIsDivided(true); 
            onTrigger?.();
            
            // Scroll explicite via ancre positionnée
            setTimeout(() => {
                // S'assurer que le scroll s'exécute même si h1 n'est pas encore stable
                scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            // Remove spacer after scroll animation completes
            setTimeout(() => {
                setShowScrollSpacer(false);
            }, 1200);
        }
    };

    const handlePageChange = (page: number) => {
        setActivePage(page);
        
        // [SCROLL LOGIC] Enforce scroll to top on page change for BOTH Desktop and Mobile
        // This ensures the user sees the start of the new content card immediately.
        setTimeout(() => {
            const scrollContainer = document.getElementById('main-scroll-container');
            
            if (priorityBlockRef.current) {
                // Determine offset based on device
                // Mobile (under 768px): 100px to clear header/tabs
                // Desktop: 150px for larger header
                const offset = window.innerWidth < 768 ? 100 : 150;
                
                if (scrollContainer) {
                     const containerRect = scrollContainer.getBoundingClientRect();
                     const elementRect = priorityBlockRef.current.getBoundingClientRect();
                     const relativeTop = elementRect.top - containerRect.top;
                     
                     scrollContainer.scrollTo({ 
                         top: scrollContainer.scrollTop + relativeTop - offset, 
                         behavior: 'smooth' 
                     });
                } else {
                     // Legacy/Fallback for window scrolling
                     const top = priorityBlockRef.current.getBoundingClientRect().top + window.scrollY - offset;
                     window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        }, 100);
    };

    // Custom Swipe Hook (Native & Lightweight)
    const swipeHandlers = useSwipeable({
        onSwipedLeft: (eventData) => {
            console.log("SWIPE LEFT DETECTED", eventData);
            if (activePage > 0) {
                handlePageChange(activePage - 1);
            }
        },
        onSwipedRight: (eventData) => {
             console.log("SWIPE RIGHT DETECTED", eventData);
             if (activePage < pages.length - 1) {
                handlePageChange(activePage + 1);
            }
        },
        preventScrollOnSwipe: false, // Let vertical scroll happen naturally
        trackMouse: true, // Enable mouse swiping for desktop testing
        trackTouch: true,
        delta: 10, // Low threshold for sensitivity
        swipeDuration: 500,
        touchEventOptions: { passive: false } // Crucial for reliable touch handling
    });

    
    // Legacy Handler for compatibility if needed
    const handleDragEnd = (event: any, info: any) => {};

    const handlePersonalAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Force cleanup of scroll spacer to prevent "void" bug
        setShowScrollSpacer(false);
        
        const nextState = !isContracted;
        setIsContracted(nextState);
        INSTANCE_CONTRACTED_CACHE[namespace] = nextState; // Persist state
        if (nextState) {
            setActivePage(0);
            setTimeout(() => {
                // [SCROLL LOGIC] Enforce scroll to top on toggle for BOTH Desktop and Mobile
                const scrollContainer = document.getElementById('main-scroll-container');
                
                if (priorityBlockRef.current) {
                    // Determine offset based on device
                    const offset = window.innerWidth < 768 ? 100 : 150;
                    
                    if (scrollContainer) {
                         const containerRect = scrollContainer.getBoundingClientRect();
                         const elementRect = priorityBlockRef.current.getBoundingClientRect();
                         const relativeTop = elementRect.top - containerRect.top;
                         
                         scrollContainer.scrollTo({ 
                             top: scrollContainer.scrollTop + relativeTop - offset, 
                             behavior: 'smooth' 
                         });
                    } else {
                         // Legacy/Fallback for window scrolling
                         const top = priorityBlockRef.current.getBoundingClientRect().top + window.scrollY - offset;
                         window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
                
                // FINAL SAFETY: Ensure spacer is strictly removed after scroll/deployment
                setShowScrollSpacer(false);
            }, 300);
        }
    };

    const onSideStageRefChange = useCallback((node: HTMLDivElement | null) => {
        // 1. Gérer la ref de React Swipeable / Handle React Swipeable ref
        if (swipeHandlers && swipeHandlers.ref) {
             swipeHandlers.ref(node);
        }
        
        // 2. Nettoyer l'ancien observer s'il existe / Cleanup old observer
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        // 3. Si le nœud existe, mesurer et observer / If node exists, measure and observe
        if (node) {
            // Mesure immédiate / Immediate measure
            setSideStageHeight(node.offsetHeight);
            
            // Créer un nouvel observer / Create new observer
            const observer = new ResizeObserver((entries) => {
                 for (const entry of entries) {
                     // Mise à jour robuste de la hauteur / Robust height update
                     setSideStageHeight((entry.target as HTMLElement).offsetHeight);
                 }
            });
            
            observer.observe(node);
            observerRef.current = observer;
        }
    }, [swipeHandlers]);
    
    return (
        <div ref={containerRef} className={`relative w-full font-manrope overflow-visible ${isDivided ? 'z-[25]' : ''}`}>
            <div className="absolute top-0 left-0 w-full opacity-0 pointer-events-none -z-50 overflow-hidden h-0">
                <div ref={ghostH1Ref} className="w-full"><Segment1Content data={data} isGhost={true} /></div>
                <div ref={ghostH2Ref} className="w-full p-[22px]"><Segment2Content namespace={namespace} data={data} isGhost={true} /></div>
                <div ref={ghostH3Ref} className="w-full p-[22px]"><Segment3Content data={data} isGhost={true} /></div>
                {/* Ghost for Segment 3 with override data (Side Stage) */}
                <div ref={ghostH3SideStageRef} className="w-full p-[22px]">
                    <Segment3Content 
                        data={{
                            ...data,
                            insightTitle: data.insightTitle || t("reflex.insightTitlePro"),
                            insightText: data.insightText || t("reflex.insightSideStageText")
                        }} 
                        isGhost={true} 
                    />
                </div>
                <div ref={ghostH4CollapsedRef} className="w-full p-[22px]"><Segment4Content namespace={namespace} data={data} isGhost={true} isExpanded={false} /></div>
                <div ref={ghostH4ExpandedRef} className="w-full p-[22px]"><Segment4Content namespace={namespace} data={data} isGhost={true} isExpanded={true} /></div>
                
                {/* Ghosts for Gospel Version (Side Stage) */}
                <div ref={ghostH4GospelCollapsedRef} className="w-full p-[22px]"><Segment4ContentGospel namespace={namespace} data={data} isGhost={true} isExpanded={false} /></div>
                <div ref={ghostH4GospelExpandedRef} className="w-full p-[22px]"><Segment4ContentGospel namespace={namespace} data={data} isGhost={true} isExpanded={true} /></div>
                
                <div ref={ghostH5CollapsedRef} className="w-full p-[22px]"><Segment5Content namespace={namespace} data={data} isGhost={true} isExpanded={false} /></div>
                <div ref={ghostH5ExpandedRef} className="w-full p-[22px]"><Segment5Content namespace={namespace} data={data} isGhost={true} isExpanded={true} /></div>
                <div ref={ghostPlanHeaderRef} className="w-full"><PlanHeader /></div>
            </div>

            {/* Scroll Target Anchor - Position calculated to force correct alignment */}
            <div 
                ref={scrollTargetRef} 
                className="absolute left-0 w-px h-px pointer-events-none opacity-0"
                style={{ top: Math.max(0, ((h1 || 190) + SPLIT_GAP) - 150) }} 
            />

            <motion.div 
                animate={{ height: isDivided ? (mitosisComplete ? (isContracted ? TOTAL_HEIGHT_WITH_NAV : BUTTON_EJECTION + 60) : [TOTAL_HEIGHT_JOINED, H_PEAK, BUTTON_EJECTION + 60]) : TOTAL_HEIGHT_JOINED }} 
                transition={skipAnimation ? { duration: 0 } : (mitosisComplete ? expansionTransition : { duration: isDivided ? SEQ_DURATION : 0.3, times: sequenceTimes, ease: isDivided ? ["easeIn", "easeOut"] : "easeOut", delay: isDivided ? START_DELAY : 0 })} 
                className="relative w-full"
            >
                <div className="absolute inset-0 z-10">
                    <motion.div className="absolute top-0 left-0 w-full overflow-hidden border border-solid" animate={{ y: POS_1, height: isDivided ? h1 : TOTAL_HEIGHT_JOINED, opacity: isDivided ? 1 : 0, "--bg-s": COLORS.MOTHER.start, "--bg-e": COLORS.MOTHER.end, "--border": COLORS.MOTHER.border } as any} transition={skipAnimation ? { duration: 0 } : { y: { ...elasticTransition, delay: commonDelay }, height: { ...elasticTransition, delay: commonDelay }, opacity: { duration: 0.1, delay: commonDelay } }} style={{ borderRadius: "16px", backgroundImage: `linear-gradient(to bottom right, var(--bg-s), var(--bg-e))`, borderColor: `var(--border)`, backdropFilter: "blur(4px)", backgroundColor: "transparent" } as any} />
                    
                    {/* SEGMENT 4 (Social Proof) - Now 2nd in visual order */}
                    <MorphingSegment 
                        isDivided={isDivided} 
                        delay={commonDelay} 
                        targetType={targetTheme} 
                        height={h4}  
                        y={Y_SEG_4} 
                        padding={22} 
                        showStrokeAnimation={true} 
                        className=""
                        mitosisComplete={mitosisComplete}
                        skipAnimation={skipAnimation}
                    >
                        <div>
                            <Segment4Content namespace={namespace} data={data} seqDuration={SEQ_DURATION} peakTime={PEAK_TIME} startDelay={START_DELAY} isExpanded={isSocialProofExpanded} toggleExpanded={undefined} direction={direction} contentKey={namespace} skipAnimation={skipAnimation} onPlay={() => setHasPlayedSocialProof(true)} />
                        </div>
                    </MorphingSegment>

                    {/* SEGMENT 3 (Astuce) - Now 3rd in visual order */}
                    <MorphingSegment isDivided={isDivided} delay={commonDelay} targetType={targetAstuceTheme} height={h3} y={Y_SEG_3} borderRadius="12px" padding={22} mitosisComplete={mitosisComplete} skipAnimation={skipAnimation}>
                        <SpatialContentWrapper direction={direction} contentKey={namespace}>
                            <Segment3Content data={data} seqDuration={SEQ_DURATION} peakTime={PEAK_TIME} startDelay={START_DELAY} />
                        </SpatialContentWrapper>
                    </MorphingSegment>
                    
                    {/* SEGMENT 2 (Comment Faire) - Now 4th (last) in visual order */}
                    <MorphingSegment isDivided={isDivided} delay={commonDelay} targetType={targetTheme} height={h2} y={Y_SEG_2} padding={22} mitosisComplete={mitosisComplete} skipAnimation={skipAnimation}>
                        <SpatialContentWrapper direction={direction} contentKey={namespace}>
                            <Segment2Content namespace={namespace} data={data} seqDuration={SEQ_DURATION} peakTime={PEAK_TIME} startDelay={START_DELAY} />
                        </SpatialContentWrapper>
                    </MorphingSegment>
                </div>
                {/* LA PEAU (Strict 10% Opacity Synchronized with Figma code snippet) */}
                <motion.div 
                    animate={{ opacity: isDivided ? 0 : 1, height: isDivided ? [TOTAL_HEIGHT_JOINED, H_PEAK, H_PEAK] : TOTAL_HEIGHT_JOINED, pointerEvents: isDivided ? "none" : "auto" }}
                    transition={skipAnimation ? { duration: 0 } : { opacity: { duration: 0.1, delay: commonDelay }, height: { duration: isDivided ? SEQ_DURATION : 0.3, times: sequenceTimes, ease: isDivided ? ["easeIn", "easeOut"] : "easeOut", delay: isDivided ? START_DELAY : 0 }}}
                    className="absolute inset-0 z-20 border border-solid overflow-hidden shadow-[0px_4px_20px_-10px_rgba(255,78,80,0.3)]"
                    style={{ 
                        backgroundImage: `linear-gradient(to bottom right, ${COLORS.MOTHER.start} 0%, ${COLORS.MOTHER.end} 100%)`, 
                        borderColor: COLORS.MOTHER.border,
                        backdropFilter: `blur(4px)`, 
                        borderRadius: "16px",
                        backgroundColor: "transparent"
                    }}
                />
                <div className="absolute inset-0 z-30 pointer-events-none px-6">
                    <motion.div animate={{ y: POS_1 }} transition={{ ...elasticTransition, delay: commonDelay }} className="flex flex-col w-full">
                        <Segment1Content data={data} isGhost={false} direction={direction} contentKey={namespace} />
                    </motion.div>
                    <motion.div className="absolute left-0 right-0 flex justify-center z-10" style={{ top: BUTTON_REST_Y }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: isDivided ? 0.6 : 0, scale: isDivided ? 1 : 0.8, pointerEvents: isDivided ? "auto" : "none" }} transition={scaleTransition({ opacity: { duration: 0.3, delay: 0.6 }, scale: { duration: 0.4, delay: 0.6 } })}>
                        <motion.div 
                            className="relative p-2 cursor-pointer group pointer-events-auto flex items-center justify-center" 
                            onClick={(e) => { e.stopPropagation(); setIsDivided(false); }}
                            whileHover="hover"
                        >
                            <motion.div 
                                className="absolute inset-0 bg-white/10 rounded-full"
                                initial={{ scale: 0, opacity: 0 }}
                                variants={{ hover: { scale: 1, opacity: 1 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            <motion.div
                                variants={{ hover: { scale: 1.15 } }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                                <ChevronUp className="w-6 h-6 text-dashboard-opportunity-text group-hover:text-foreground transition-colors relative z-10" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                    <div className="absolute top-0 left-0 w-full px-6 flex justify-end z-[70] pointer-events-none">
                        <motion.button 
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            initial={{ y: BUTTON_REST_Y, width: "100%" }}
                            animate={{ 
                                y: isDivided ? (mitosisComplete ? BUTTON_EJECTION : [BUTTON_REST_Y, BUTTON_PEAK_Y, BUTTON_EJECTION]) : BUTTON_REST_Y,
                                width: (mitosisComplete && isContracted) ? 48 : "100%",
                                scale: 1 
                            }} 
                            transition={{ 
                                y: skipAnimation ? { duration: 0 } : (mitosisComplete ? { type: "spring", stiffness: 280, damping: 30 } : { duration: isDivided ? SEQ_DURATION : (animationsEnabled ? 0.4 : 0), times: isDivided ? sequenceTimes : undefined, ease: isDivided ? ["easeIn", "easeOut"] : "anticipate", delay: isDivided ? START_DELAY : 0 }),
                                width: { type: "spring", stiffness: 150, damping: 22, mass: 1 }
                            }} 
                            onClick={!mitosisComplete ? handleStart : handlePersonalAction} 
                            onMouseUp={(e) => e.currentTarget.blur()}
                            onTouchEnd={(e) => e.currentTarget.blur()}
                            className={`relative group overflow-hidden flex items-center justify-center h-[48px] bg-dashboard-opportunity-button-bg text-dashboard-opportunity-button-text text-xs font-bold tracking-wider transition-all duration-300 backdrop-blur-sm ${mitosisComplete ? 'rounded-full' : 'rounded-[8px] hover:bg-dashboard-opportunity-button-bg/80 hover:shadow-[0_0_15px_var(--dashboard-opportunity-shadow)]'} pointer-events-auto`}
                            style={{ touchAction: "manipulation" }}
                        >
                            {!mitosisComplete ? (
                                <>
                                    <motion.span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-dashboard-opportunity-button-text group-hover:via-white to-transparent" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                    <motion.span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-dashboard-opportunity-button-text group-hover:via-white to-transparent" animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                    <motion.span className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-dashboard-opportunity-button-text group-hover:via-white to-transparent" animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                    <motion.span className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-dashboard-opportunity-button-text group-hover:via-white to-transparent" animate={{ y: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                    <span className="absolute inset-0 border border-dashboard-opportunity-button-border rounded-[8px]" />
                                    <span className="relative z-10 text-[14px] flex items-center justify-center gap-1.5 group-hover:text-foreground transition-colors duration-300">
                                        <SpatialContentWrapper direction={direction} contentKey={namespace} className="w-auto">
                                            <span>{buttonLabel}</span>
                                        </SpatialContentWrapper>
                                        <motion.span className="text-xl leading-none" style={{ backgroundImage: "linear-gradient(180deg, var(--dashboard-opportunity-gradient-start) 0%, var(--dashboard-opportunity-gradient-end) 50%, var(--dashboard-opportunity-gradient-start) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "100% 200%" }} animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>⚡</motion.span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="absolute inset-0 border border-dashboard-opportunity-button-border rounded-full" />
                                    <div className="relative z-10 flex items-center w-full pl-1.5 pr-1.5 h-full overflow-hidden">
                                        {/* CERCLE GAUCHE (MOBILE/COUVREUR) */}
                                        <motion.div 
                                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-lg relative bg-dashboard-opportunity-button-bg group-hover:bg-dashboard-opportunity-button-bg/80 group-hover:shadow-[0_0_15px_var(--dashboard-opportunity-shadow)] group-hover:scale-110 transition-all duration-300 z-20"
                                            animate={{ x: 0 }} 
                                        >
                                            <div className="absolute inset-0 rounded-full border border-dashboard-opportunity-button-border" />
                                            <motion.div 
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    padding: '1.5px',
                                                    background: `conic-gradient(from 0deg, transparent 0%, var(--stroke-color, #EA580C) 15%, transparent 30%, transparent 100%)`,
                                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                    WebkitMaskComposite: 'xor',
                                                    maskComposite: 'exclude',
                                                } as any}
                                                animate={{ 
                                                    rotate: 360,
                                                    "--stroke-color": isHovered ? "#ffffff" : "#EA580C" 
                                                } as any}
                                                transition={{ 
                                                    rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
                                                    "--stroke-color": { duration: 0.3 }
                                                }}
                                            />
                                            <motion.div
                                                animate={{ rotateY: isContracted ? 180 : 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className="relative z-10"
                                            >
                                                <ChevronRight size={18} className="text-dashboard-opportunity-button-text group-hover:text-white group-hover:scale-115 transition-all duration-300" />
                                            </motion.div>
                                        </motion.div>

                                        {/* ZONE CENTRALE (S'EFFACE) */}
                                        <motion.div 
                                            className="flex-1 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300 overflow-hidden"
                                            animate={{ 
                                                opacity: isContracted ? 0 : 1,
                                                scale: isContracted ? 0.8 : 1
                                            }}
                                            transition={scaleTransition({ duration: 0.3 })}
                                        >
                                            <span className="text-[14px] font-bold text-dashboard-opportunity-button-text tracking-widest whitespace-nowrap group-hover:text-white transition-colors duration-300">
                                                {t("reflex.justForMe")}
                                            </span>
                                            <div className="flex items-center text-dashboard-opportunity-button-text/50 group-hover:text-white/50">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.2,
                                                            ease: "easeInOut"
                                                        }}
                                                    >
                                                        <ChevronRight size={14} strokeWidth={3} className="transition-colors duration-300" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* CERCLE DROIT (FIXE/CIBLE) */}
                                        <motion.div 
                                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-dashboard-opportunity-button-bg transition-all duration-300 z-10"
                                            animate={{ opacity: isContracted ? 0 : 0.5 }}
                                        >
                                            <LockKeyholeOpen size={18} className="text-dashboard-opportunity-button-text opacity-50 group-hover:text-white group-hover:opacity-70 transition-all duration-300" />
                                        </motion.div>
                                    </div>
                                </>
                            )}
                        </motion.button>
                    </div>
                            {/* SIDE STAGE ELEMENTS (Left Flank Entry) */}
                    <AnimatePresence>
                        {isContracted && (
                            <>
                                <motion.div 
                                    initial={{ x: -400, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -400, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 150, damping: 22, mass: 1 }}
                                    style={{ position: "absolute", top: PLAN_HEADER_Y, left: 0, width: "100%", zIndex: 60, paddingRight: "56px", pointerEvents: "none" }}
                                >
                                    <div className="pointer-events-auto">
                                        <PlanHeader />
                                        {/* Invisible Sentinel for Samsara Shift Detection */}
                                        <div ref={genesisObserverRef} className="absolute top-0 w-full h-[100px] pointer-events-none opacity-0" />
                                    </div>
                                </motion.div>

                                {/* SAMSARA SHIFT NAVIGATION (Unified Body) */}
                                <motion.div
                                    animate={{ 
                                        opacity: 1, 
                                        x: 0,
                                        zIndex: 60, // Ensure visibility above content (which is 50)
                                        top: isSoulShifted
                                            ? (TOTAL_HEIGHT_CONTRACTED + NAV_BOTTOM_OFFSET) // Adjusted to use consistent offset variable
                                            : (isMobile ? (PLAN_HEADER_Y + hPlanHeader + 16) : (PLAN_HEADER_Y + 70)) // Genesis Position (Top)
                                    }}
                                    transition={{ 
                                        top: { type: "spring", stiffness: 50, damping: 15, mass: 1.5 }, // Slower, heavier Samsara physics
                                        opacity: { duration: 0.3 }
                                    }}
                                    className="absolute left-0 w-full z-[100] pointer-events-none"
                                >
                                    <motion.div 
                                        className="pointer-events-none w-full touch-pan-y flex justify-center"
                                    >
                                        <div 
                                            className="pointer-events-auto"
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onTouchStart={(e) => e.stopPropagation()}
                                        >
                                        <ReflexNavigation 
                                            activePage={activePage} 
                                            totalPages={pages.length} 
                                            onPageChange={handlePageChange} 
                                            className="w-fit"
                                            isSoulShifted={isSoulShifted}
                                        />
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <motion.div 
                                    initial={{ x: -400, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -400, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 150, damping: 22, mass: 1, delay: 0.1 }}
                                    className="w-full"
                                    style={{ 
                                        position: "absolute", 
                                        top: isMobile ? (PLAN_HEADER_Y + hPlanHeader + 88) : (PLAN_HEADER_Y + hPlanHeader + 88), // Increased top offset to prevent overlap with circles
                                        left: 0, 
                                        zIndex: 50,
                                        minHeight: effectiveSideStageHeight, // FIX DESKTOP: Give stacking context real bounds so hit-testing reaches children
                                    }}
                                >
                                <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                                    <motion.div 
                                        key={`${namespace}-${activePage}-${data.title}`} // Stronger key uniqueness to force remount on data change
                                        custom={slideDirection}
                                        variants={{
                                            enter: { transition: scaleTransition({ staggerChildren: 0.2, delayChildren: 0.1 }) }, // Slower stagger
                                            exit: { transition: scaleTransition({ staggerChildren: 0.1 }) }
                                        }}
                                        initial="initial"
                                        animate="enter"
                                        exit="exit"
                                        className="w-full absolute left-0"
                                        style={{ zIndex: 10 }}
                                        // Ref moved to inner div to avoid conflict with AnimatePresence
                                    >
                                        <div 
                                            ref={onSideStageRefChange}
                                            onMouseDown={swipeHandlers.onMouseDown}
                                            onTouchStart={swipeHandlers.onTouchStart}
                                            onTouchEnd={swipeHandlers.onTouchEnd}
                                            className="flex flex-col gap-[32px] pointer-events-auto touch-pan-y outline-none"
                                        >
                                            {/* Scroll Anchor */}
                                        <div ref={priorityBlockRef} className="absolute -top-[150px] w-full h-[1px]" />
                                        
                                        {(() => {
                                            const pageData = pages[activePage];
                                            
                                            // Compute hover shadow color based on namespace
                                            const getShadowColor = (ns: string) => {
                                                if (ns === 'streaming') return "242,142,66";
                                                if (ns === 'social') return "28,180,91";
                                                if (ns === 'radio') return "18,134,243";
                                                return "16,185,129";
                                            };
                                            const shadowRgb = getShadowColor(namespace);
                                            const hoverShadow = `0px 0px 20px 0px rgba(${shadowRgb},0.4)`;

                                            // Block Animation Variants (The "Cascade")
                                            const blockVariants = {
                                                initial: (direction: number = 0) => ({
                                                    x: direction > 0 ? -150 : 150, // Increased distance for more noticeable travel
                                                    opacity: 0,
                                                    filter: "blur(10px)"
                                                }),
                                                enter: {
                                                    x: 0,
                                                    opacity: 1,
                                                    filter: "blur(0px)",
                                                    transition: { type: "spring", stiffness: 60, damping: 20, mass: 1.2 } // Slower, heavier feel
                                                },
                                                exit: (direction: number = 0) => ({
                                                    x: direction > 0 ? 150 : -150, // Increased distance
                                                    opacity: 0,
                                                    filter: "blur(10px)",
                                                    transition: scaleTransition({ duration: 0.5, ease: "easeInOut" }) // Slower exit
                                                })
                                            };

                                            // Internal Content Nonchalance (The "Lag")
                                            const contentVariants = {
                                                initial: (direction: number) => ({ x: direction > 0 ? -30 : 30, opacity: 0 }),
                                                enter: { 
                                                    x: 0, 
                                                    opacity: 1,
                                                    transition: scaleTransition({ delay: 0.3, duration: 0.6, ease: "easeOut" }) // Significant delay for "lazy" content arrival
                                                },
                                                exit: { opacity: 0, transition: scaleTransition({ duration: 0.2 }) }
                                            };

                                            return (
                                                <>
                                                    {/* Block 1: Video (High Priority) */}
                                                    <motion.div 
                                                        custom={slideDirection}
                                                        variants={blockVariants}
                                                        whileHover={{ boxShadow: hoverShadow }}
                                                        className="relative p-[22px] rounded-[16px] border border-white/20 shadow-xl backdrop-blur-md overflow-hidden z-50" 
                                                        style={{
                                                            backgroundImage: `linear-gradient(to bottom right, ${themeColors.start}, ${themeColors.end})`,
                                                            borderColor: themeColors.border
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[16px] z-0">
                                                            <motion.span className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColors.border}, transparent)` }} animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                                            <motion.span className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColors.border}, transparent)` }} animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                                            <motion.span className="absolute top-0 right-0 h-full w-[1px]" style={{ background: `linear-gradient(180deg, transparent, ${themeColors.border}, transparent)` }} animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                                            <motion.span className="absolute top-0 left-0 h-full w-[1px]" style={{ background: `linear-gradient(180deg, transparent, ${themeColors.border}, transparent)` }} animate={{ y: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                                        </div>
                                                        <motion.div variants={contentVariants} custom={slideDirection} className="relative z-10">
                                                            <Segment5Content 
                                                                data={{ ...data, playlist: pageData.playlist }}
                                                                isExpanded={isPlaylistExpanded}
                                                                toggleExpanded={() => setIsPlaylistExpanded(!isPlaylistExpanded)}
                                                                namespace={namespace}
                                                                badgeType={pageData.badgeType || 'priorite'}
                                                            />
                                                        </motion.div>
                                                    </motion.div>

                                                    {/* Block 2: Tip */}
                                                    <motion.div 
                                                        custom={slideDirection}
                                                        variants={blockVariants}
                                                        className="relative p-[22px] rounded-[16px] border border-white/20 shadow-xl backdrop-blur-md overflow-hidden z-50"  
                                                        style={{
                                                            backgroundImage: `linear-gradient(to bottom right, ${astuceColors.start}, ${astuceColors.end})`,
                                                            borderColor: astuceColors.border
                                                        }}
                                                    >
                                                        <motion.div variants={contentVariants} custom={slideDirection} className="relative z-10">
                                                            <Segment3Content 
                                                                data={{ ...data, insightTitle: pageData.insightTitle, insightText: pageData.insightText }}
                                                                namespace={namespace}
                                                            />
                                                        </motion.div>
                                                    </motion.div>

                                                    {/* Block 3: Social Proof */}
                                                    <motion.div 
                                                        custom={slideDirection}
                                                        variants={blockVariants}
                                                        whileHover={{ boxShadow: hoverShadow }}
                                                        className="relative p-[22px] rounded-[16px] border border-white/20 shadow-xl backdrop-blur-md overflow-hidden z-50"  
                                                        style={{
                                                            backgroundImage: `linear-gradient(to bottom right, ${themeColors.start}, ${themeColors.end})`,
                                                            borderColor: themeColors.border
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[16px] z-0">
                                                            <motion.span className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColors.border}, transparent)` }} animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                                            <motion.span className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${themeColors.border}, transparent)` }} animate={{ x: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                                                            <motion.span className="absolute top-0 right-0 h-full w-[1px]" style={{ background: `linear-gradient(180deg, transparent, ${themeColors.border}, transparent)` }} animate={{ y: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                                            <motion.span className="absolute top-0 left-0 h-full w-[1px]" style={{ background: `linear-gradient(180deg, transparent, ${themeColors.border}, transparent)` }} animate={{ y: ["100%", "-100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.75 }} />
                                                        </div>
                                                        <motion.div variants={contentVariants} custom={slideDirection} className="relative z-10">
                                                            <Segment4ContentGospel 
                                                                data={{ ...data, socialProof: pageData.socialProof }}
                                                                isExpanded={isSideSocialProofExpanded}
                                                                toggleExpanded={() => setIsSideSocialProofExpanded(!isSideSocialProofExpanded)}
                                                                namespace={namespace}
                                                            />
                                                        </motion.div>
                                                    </motion.div>
                                                </>
                                            );
                                        })()}
                                        {/* Extra padding for scroll safety */}
                                        <div className="h-[20px]" />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                                </motion.div>

                            </>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            
            {/* Scroll Buffer: Only render if needed. On Desktop: Only during animation. On Mobile: Always present as padding. */}
            {(showScrollSpacer || isMobile) && (
                <div style={{ 
                    height: showScrollSpacer ? '120vh' : '120px',
                    width: '100%', 
                    pointerEvents: 'none',
                    transition: 'height 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }} />
            )}
        </div>
    );
}
