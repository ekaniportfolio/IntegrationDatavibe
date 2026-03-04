/**
 * ============================================================================
 * REFLEX I18N — Translation helpers for ReflexOpportunity
 * ============================================================================
 * 
 * This file provides hook-based translated default data for the Reflex Matrix.
 * All hardcoded French text from DEFAULT_PAGES/DEFAULT_DATA is replaced with
 * translation keys, resolving the encoding issue (U+2019 apostrophes, accented
 * multi-byte chars) that prevented edit_tool from modifying certain lines.
 * 
 * USAGE: Call useReflexDefaults() inside any component to get translated
 * default pages and data. The t() function from useTranslation is passed
 * through to generate strings at render time.
 * 
 * RULE: Never hardcode display text in ReflexOpportunity.tsx — always use
 * translation keys from this file or from the component's own t() calls.
 * ============================================================================
 */

import type { ReflexOpportunityData, ReflexOpportunityPage } from "./ReflexOpportunity";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1596131397999-bb01560efcae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwbXVzaWMlMjBjbHVifGVufDF8fHx8MTc3MjA4NDc5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/**
 * Returns translated DEFAULT_PAGES array.
 * Each page's text fields are resolved via the t() function.
 */
export function getTranslatedDefaultPages(t: (key: string) => string): ReflexOpportunityPage[] {
    return [
        {
            playlist: {
                title: t("reflex.page1.playlistTitle"),
                description: t("reflex.page1.playlistDesc"),
                videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBtdXNpYyUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzAxNzIwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            },
            insightTitle: t("reflex.page1.insightTitle"),
            insightText: t("reflex.page1.insightText"),
            socialProof: {
                videoSrc: "https://images.unsplash.com/photo-1731419741064-be6cbe9fa2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGdvc3BlbCUyMHNpbmdlciUyMHBlcmZvcm1hbmNlfGVufDF8fHx8MTc3MDE4MjAwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("reflex.page1.socialTitle"),
                author: "Leto",
                views: t("reflex.page1.socialViews"),
                initials: "L",
                descriptionTitle: t("reflex.page1.socialDescTitle"),
                description: t("reflex.page1.socialDesc")
            },
            badgeType: 'priorite'
        },
        {
            playlist: {
                title: t("reflex.page2.playlistTitle"),
                description: t("reflex.page2.playlistDesc"),
                videoSrc: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            },
            insightTitle: t("reflex.page2.insightTitle"),
            insightText: t("reflex.page2.insightText"),
            socialProof: {
                videoSrc: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2R8ZW58MXx8fHwxNzcwMTgyMTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("reflex.page2.socialTitle"),
                author: "Sarah M.",
                views: t("reflex.page2.socialViews"),
                initials: "S",
                descriptionTitle: t("reflex.page2.socialDescTitle"),
                description: t("reflex.page2.socialDesc")
            },
            badgeType: 'recommande'
        },
        {
            playlist: {
                title: t("reflex.page3.playlistTitle"),
                description: t("reflex.page3.playlistDesc"),
                videoSrc: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwc3R1ZGlvfGVufDF8fHx8MTc3MDE4MjE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            },
            insightTitle: t("reflex.page3.insightTitle"),
            insightText: t("reflex.page3.insightText"),
            socialProof: {
                videoSrc: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxka3xlbnwxfHx8fDE3NzAxODIxNDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                title: t("reflex.page3.socialTitle"),
                author: "DJ K.",
                views: t("reflex.page3.socialViews"),
                initials: "D",
                descriptionTitle: t("reflex.page3.socialDescTitle"),
                description: t("reflex.page3.socialDesc")
            },
            badgeType: 'bonus'
        }
    ];
}

/**
 * Returns translated DEFAULT_DATA object.
 * Uses getTranslatedDefaultPages(t) for the pages array.
 */
export function getTranslatedDefaultData(t: (key: string) => string): ReflexOpportunityData {
    return {
        title: t("reflex.defaultTitle"),
        subtitle: t("reflex.defaultSubtitle"),
        urgent: true,
        steps: [
            { id: "s1", text: t("reflex.step1") },
            { id: "s2", text: t("reflex.step2") },
            { id: "s3", text: t("reflex.step3") },
            { id: "s4", text: t("reflex.step4") }
        ],
        insightTitle: t("reflex.insightTitlePro"),
        insightText: t("reflex.insightTextConnect"),
        buttonText: t("reflex.howTo"),
        pages: getTranslatedDefaultPages(t),
        socialProof: {
            videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwZGFzaGJvYXJkJTIwbXVzaWMlMjBhcnRpc3QlMjBjb25jZXJ0fGVufDF8fHx8MTc3MDE2OTY1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
            title: t("reflex.page1.socialTitle"),
            author: "Leto",
            views: t("reflex.page1.socialViews"),
            initials: "L",
            descriptionTitle: t("reflex.page1.socialDescTitle"),
            description: t("reflex.page1.socialDesc")
        },
        playlist: {
            title: t("reflex.page1.playlistTitle"),
            description: t("reflex.page1.playlistDesc"),
            videoSrc: "https://images.unsplash.com/photo-1611329148712-620b7d39f3a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwcGxheWxpc3QlMjBtdXNpYyUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzAxNzIwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        }
    };
}

/**
 * Returns translated fallback pages for the inline dummy generation
 * (when data.pages is empty and pages are generated in useMemo).
 */
export function getTranslatedFallbackPages(
    t: (key: string) => string,
    basePage: ReflexOpportunityPage
): ReflexOpportunityPage[] {
    const page2: ReflexOpportunityPage = {
        playlist: { ...basePage.playlist, title: t("reflex.fallback.page2Title"), description: t("reflex.fallback.page2Desc") },
        socialProof: { ...basePage.socialProof, title: t("reflex.fallback.page2SocialTitle"), author: "Artist B" },
        insightTitle: t("reflex.fallback.page2InsightTitle"),
        insightText: t("reflex.fallback.page2InsightText"),
        badgeType: 'recommande'
    };
    const page3: ReflexOpportunityPage = {
        playlist: { ...basePage.playlist, title: t("reflex.fallback.page3Title"), description: t("reflex.fallback.page3Desc") },
        socialProof: { ...basePage.socialProof, title: t("reflex.fallback.page3SocialTitle"), author: "Label X" },
        insightTitle: t("reflex.fallback.page3InsightTitle"),
        insightText: t("reflex.fallback.page3InsightText"),
        badgeType: 'bonus'
    };
    return [basePage, page2, page3];
}
