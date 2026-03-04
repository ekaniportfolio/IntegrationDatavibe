/**
 * ============================================================================
 * MOCK BACKEND — Centralized Mock Data & Backend Contracts
 * ============================================================================
 *
 * This file is the SINGLE SOURCE OF TRUTH for all data that will eventually
 * come from the backend API. Every component that displays dynamic data
 * should import its mock data from here.
 *
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  @backend GUIDE FOR BACKEND TEAMS                                      ║
 * ║                                                                        ║
 * ║  1. Each section below has a TypeScript interface + mock data constant  ║
 * ║  2. Replace the mock constant with an API call returning the same type  ║
 * ║  3. The component will work identically — just swap the data source    ║
 * ║  4. All numbers use BASE MONTHLY values; the frontend applies period   ║
 * ║     multipliers (semaine ×0.23, mois ×1, trimestre ×3)                ║
 * ║  5. Growth rates are RELATIVE percentages — invariant to period        ║
 * ║  6. API should return pre-computed values when possible                ║
 * ║                                                                        ║
 * ║  SUGGESTED API STRUCTURE:                                              ║
 * ║  GET /api/v1/artist/:id/bilan/streaming?period=mois                   ║
 * ║  GET /api/v1/artist/:id/bilan/social?period=mois                      ║
 * ║  GET /api/v1/artist/:id/bilan/media?period=mois                       ║
 * ║  GET /api/v1/artist/:id/niveau/:universe                              ║
 * ║  GET /api/v1/artist/:id/connexions                                    ║
 * ║  GET /api/v1/artist/:id/dashboard/streaming                           ║
 * ║  GET /api/v1/config/plans                                             ║
 * ║  GET /api/v1/config/legal                                             ║
 * ║  GET /api/v1/config/about                                             ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * NAMING CONVENTION:
 *   Interface:  BilanStreamingData
 *   Mock:       MOCK_BILAN_STREAMING
 *   Endpoint:   @backend GET /api/v1/artist/:id/bilan/streaming
 */

// ============================================================================
// §1 — BILAN STREAMING
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/bilan/streaming?period=mois
 * Returns aggregated streaming metrics for the Bilan Streaming page.
 * The frontend applies PERIOD_MULTIPLIER to base values.
 * Growth rates are relative (%) and period-invariant.
 */
export interface BilanStreamingOverview {
    spotifyListeners: number;    // base monthly Spotify audience
    youtubeViews: number;        // base monthly YouTube views
    playlists: number;           // base monthly playlist count
    spotifyGrowth: number;       // absolute growth number (displayed as +X)
    youtubeGrowth: number;       // absolute growth number
    playlistsGrowth: number;     // absolute growth number
    trendLabel: string;          // "En croissance" | "Stable" | "En baisse"
    trendSentiment: 'positive' | 'negative' | 'neutral';
}

export interface BilanStreamingDashboard {
    uniqueListeners: number;     // base monthly unique listeners
    avgViews: number;            // base monthly average views
    weightedStreams: number;      // base monthly weighted streams
    listenersGrowth: number;     // growth % (relative, invariant)
    viewsGrowth: number;         // growth %
    streamsGrowth: number;       // growth %
    platformDistribution: { name: string; pct: number; color: string }[];
}

export interface BilanStreamingActivity {
    totalViews: number;          // base monthly total views
    growthRate: number;          // % growth (invariant)
    engagementRate: number;      // % engagement (invariant)
    activeSessions: number;      // base monthly active sessions
    sparkline: {
        semaine: number[];       // 7 values (one per day)
        mois: number[];          // 4 values (one per week)
        trimestre: number[];     // 3 values (one per month)
    };
}

export interface BilanStreamingSongs {
    weightedStreamsTotal: number;
    weightedStreamsGrowth: number; // % growth
    topSongs: { title: string; streams: number; growth: number }[];
    advice: string;
}

export interface BilanStreamingData {
    overview: BilanStreamingOverview;
    dashboard: BilanStreamingDashboard;
    activity: BilanStreamingActivity;
    songs: BilanStreamingSongs;
}

export const MOCK_BILAN_STREAMING: BilanStreamingData = {
    overview: {
        spotifyListeners: 113_900,
        youtubeViews: 367_900,
        playlists: 166,
        spotifyGrowth: 245,
        youtubeGrowth: 12_400,
        playlistsGrowth: 2,
        trendLabel: "En croissance",
        trendSentiment: "positive",
    },
    dashboard: {
        uniqueListeners: 113_100,
        avgViews: 792_400,
        weightedStreams: 165_800,
        listenersGrowth: 12.5,
        viewsGrowth: -5.2,
        streamsGrowth: 8.7,
        platformDistribution: [
            { name: "Youtube", pct: 55, color: "#344BFD" },
            { name: "Facebook", pct: 25, color: "#F68D2B" },
            { name: "Spotify", pct: 20, color: "#FFFFFF" },
        ],
    },
    activity: {
        totalViews: 792_400,
        growthRate: 12.5,
        engagementRate: 4.2,
        activeSessions: 28_400,
        sparkline: {
            semaine: [0.6, 0.8, 0.7, 1.0, 0.9, 0.75, 0.85],
            mois: [0.7, 0.85, 1.0, 0.9],
            trimestre: [0.8, 1.0, 0.92],
        },
    },
    songs: {
        weightedStreamsTotal: 165_781,
        weightedStreamsGrowth: 8.7,
        topSongs: [
            { title: "Pas de panique", streams: 4_400_000, growth: -99.0 },
            { title: "Réponds par le feu", streams: 36_600, growth: -31.1 },
            { title: "Pardonner", streams: 20_000, growth: -9.3 },
        ],
        advice: "Utilisez des accroches telles que \"Vous n'en reviendrez pas...\" ou \"3 choses que les artistes ne font pas...\" dans les 3 premières secondes.",
    },
};

// ============================================================================
// §2 — BILAN SOCIAL
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/bilan/social?period=mois
 * Returns aggregated social metrics for the Bilan Social page.
 */
export interface BilanSocialOverview {
    followers: number;           // base monthly total followers
    likesPerPost: number;        // base monthly likes per post
    engagementRate: string;      // "2%" — displayed as-is
    followersGrowth: number;     // absolute growth
    likesGrowth: number;         // absolute growth
    engagementGrowthLabel: string; // "+0,4"
    trendLabel: string;
    trendSentiment: 'positive' | 'negative' | 'neutral';
}

export interface BilanSocialEngagement {
    totalImpressions: number;
    organicReach: number;
    interactions: number;
    impressionsGrowth: number;   // %
    reachGrowth: number;         // %
    interactionsGrowth: number;  // %
    engagementByPlatform: { name: string; rate: string; color: string }[];
}

export interface BilanSocialSubscribers {
    totalFollowers: number;
    totalGrowth: number;         // %
    platforms: {
        name: string; pct: number; color: string;
        followers: number; growth: number;
    }[];
}

export interface BilanSocialDemographics {
    gender: { label: string; pct: number; color: string }[];
    age: { range: string; pct: number }[];
    insight: string;
}

export interface BilanSocialData {
    overview: BilanSocialOverview;
    engagement: BilanSocialEngagement;
    subscribers: BilanSocialSubscribers;
    demographics: BilanSocialDemographics;
}

export const MOCK_BILAN_SOCIAL: BilanSocialData = {
    overview: {
        followers: 1_100_000,
        likesPerPost: 17_100,
        engagementRate: "2%",
        followersGrowth: 890,
        likesGrowth: 1_800,
        engagementGrowthLabel: "+0,4",
        trendLabel: "En croissance",
        trendSentiment: "positive",
    },
    engagement: {
        totalImpressions: 2_450_000,
        organicReach: 890_000,
        interactions: 156_000,
        impressionsGrowth: 15.2,
        reachGrowth: 8.4,
        interactionsGrowth: -2.1,
        engagementByPlatform: [
            { name: "Instagram", rate: "3.2%", color: "#E4405F" },
            { name: "TikTok", rate: "4.8%", color: "#00F2EA" },
            { name: "YouTube", rate: "1.1%", color: "#FF0000" },
        ],
    },
    subscribers: {
        totalFollowers: 1_100_000,
        totalGrowth: 2.1,
        platforms: [
            { name: "Instagram", pct: 42, color: "#E4405F", followers: 462_000, growth: 2.3 },
            { name: "YouTube", pct: 28, color: "#FF0000", followers: 308_000, growth: 1.8 },
            { name: "TikTok", pct: 20, color: "#00F2EA", followers: 220_000, growth: 5.1 },
            { name: "X", pct: 10, color: "#FFFFFF", followers: 110_000, growth: -0.4 },
        ],
    },
    demographics: {
        gender: [
            { label: "Femmes", pct: 58, color: "#E4405F" },
            { label: "Hommes", pct: 39, color: "#3B82F6" },
            { label: "Autre", pct: 3, color: "#A855F7" },
        ],
        age: [
            { range: "18-24", pct: 35 },
            { range: "25-34", pct: 42 },
            { range: "35-44", pct: 15 },
            { range: "45+", pct: 8 },
        ],
        insight: "Votre audience principale se situe dans la tranche 25-34 ans (42%), majoritairement féminine (58%). Optimisez votre contenu pour ce segment.",
    },
};

// ============================================================================
// §3 — BILAN MEDIA
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/bilan/media?period=mois
 * Returns aggregated media/radio metrics for the Bilan Media page.
 */
export interface BilanMediaOverview {
    rotations: number;           // base monthly radio rotations
    countries: number;           // number of countries
    rotationsGrowth: number;     // absolute growth (can be negative)
    countriesGrowth: number;     // absolute growth
    statusLabel: string;         // "En diffusion"
}

export interface BilanMediaPerformance {
    totalBroadcasts: number;
    cumulativeAudience: number;
    visibilityScore: number;     // 0-100 score (invariant)
    broadcastsGrowth: number;    // %
    audienceGrowth: number;      // %
    sparkline: {
        semaine: number[];
        mois: number[];
        trimestre: number[];
    };
}

export interface BilanMediaCountries {
    activeStations: number;      // base monthly
    stationsGrowthLabel: string; // "+2"
    countries: {
        name: string; pct: number; color: string; stations: number;
    }[];
}

export interface BilanMediaStrategy {
    strategyScore: number;       // 0-100
    activeActions: number;
    activeCampaigns: number;
    actions: { title: string; status: string; priority: string }[];
    campaigns: { name: string; progress: number; status: string }[];
    advice: string;
}

export interface BilanMediaData {
    overview: BilanMediaOverview;
    performance: BilanMediaPerformance;
    countries: BilanMediaCountries;
    strategy: BilanMediaStrategy;
}

export const MOCK_BILAN_MEDIA: BilanMediaData = {
    overview: {
        rotations: 54,
        countries: 4,
        rotationsGrowth: -3,
        countriesGrowth: 1,
        statusLabel: "En diffusion",
    },
    performance: {
        totalBroadcasts: 54,
        cumulativeAudience: 245_000,
        visibilityScore: 72,
        broadcastsGrowth: -5.3,
        audienceGrowth: 3.8,
        sparkline: {
            semaine: [0.5, 0.7, 0.6, 0.9, 0.8, 0.65, 0.75],
            mois: [0.6, 0.8, 0.9, 0.7],
            trimestre: [0.7, 0.9, 0.85],
        },
    },
    countries: {
        activeStations: 12,
        stationsGrowthLabel: "+2",
        countries: [
            { name: "Côte d'Ivoire", pct: 45, color: "#FF8C00", stations: 5 },
            { name: "France", pct: 25, color: "#0055A4", stations: 3 },
            { name: "Sénégal", pct: 18, color: "#00853F", stations: 2 },
            { name: "Belgique", pct: 12, color: "#FFD700", stations: 2 },
        ],
    },
    strategy: {
        strategyScore: 68,
        activeActions: 3,
        activeCampaigns: 2,
        actions: [
            { title: "Relance stations francophones", status: "En cours", priority: "Haute" },
            { title: "Campagne playlist éditoriale", status: "En cours", priority: "Moyenne" },
            { title: "Partenariat radio Afrique", status: "Planifié", priority: "Haute" },
        ],
        campaigns: [
            { name: "Push Radio CI-SN", progress: 68, status: "Active" },
            { name: "Promo Europe Q1", progress: 42, status: "Active" },
        ],
        advice: "Concentrez vos efforts sur les radios en Côte d'Ivoire et au Sénégal où votre taux de rotation est le plus élevé. Renforcez la campagne Europe pour élargir votre audience.",
    },
};

// ============================================================================
// §4 — NIVEAU (Level Metrics)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/niveau/:universe
 * Returns the level/tier metrics per universe (streaming, social, radio).
 * Each metric has a baseValue (monthly) and a tier badge classification.
 *
 * TIER SYSTEM:
 * - "star":      Exceptional performance (green badge)
 * - "confirmed": Solid/confirmed level (purple badge)
 *
 * The frontend applies PERIOD_MULTIPLIER to baseValue for display.
 * isCount=true means the value is displayed as an integer (not abbreviated).
 * suffix adds a unit after the value (e.g., "%").
 */
export interface NiveauMetricData {
    label: string;
    baseValue: number;
    tier: 'star' | 'confirmed';
    isCount?: boolean;
    suffix?: string;
}

export interface NiveauHeaderData {
    title: string;               // "Streaming" | "Social" | "Radio"
    description: string;         // Subtitle under the title
    overallTier: 'star' | 'confirmed';
    alertMessage?: string;       // Alert overlay text (for Social & Radio)
}

export interface NiveauUniverseData {
    header: NiveauHeaderData;
    metrics: NiveauMetricData[];
}

export const MOCK_NIVEAU_STREAMING: NiveauUniverseData = {
    header: {
        title: "Streaming",
        description: "Classification globale basée sur les performances",
        overallTier: "confirmed",
    },
    metrics: [
        { label: "Auditeurs Spotify", baseValue: 115_500, tier: "star" },
        { label: "Vues Youtube", baseValue: 18_000_000, tier: "star" },
        { label: "Nombre de playlists", baseValue: 178, tier: "confirmed", isCount: true },
        { label: "Top 25% playlists", baseValue: 34, tier: "confirmed", isCount: true },
        { label: "Plateformes de playlist", baseValue: 3, tier: "confirmed", isCount: true },
        { label: "Tendance des streams", baseValue: 6.4, tier: "confirmed", isCount: true, suffix: "%" },
    ],
};

export const MOCK_NIVEAU_SOCIAL: NiveauUniverseData = {
    header: {
        title: "Social",
        description: "Classification globale basée sur les performances",
        overallTier: "confirmed",
        alertMessage: "Le bloc Social requiert une attention immédiate, car il présente le niveau de classification le plus bas. Concentrez vos efforts sur ce point pour un impact maximal sur vos performances globales.",
    },
    metrics: [
        { label: "Followers", baseValue: 10_200_000, tier: "star" },
        { label: "Évolution followers", baseValue: 1_900_000, tier: "star" },
        { label: "Nombre de plateformes", baseValue: 18, tier: "confirmed", isCount: true },
        { label: "Taux d'engagement", baseValue: 2.4, tier: "confirmed", isCount: true, suffix: "%" },
        { label: "Moy. likes par post", baseValue: 114_000, tier: "confirmed", isCount: true },
        { label: "Part d'impression", baseValue: 12.8, tier: "confirmed", isCount: true, suffix: "%" },
    ],
};

export const MOCK_NIVEAU_RADIO: NiveauUniverseData = {
    header: {
        title: "Radio",
        description: "Classification globale basée sur les performances",
        overallTier: "confirmed",
        alertMessage: "Le bloc Radio requiert une attention immédiate, car il présente le niveau de classification le plus bas. Concentrez vos efforts sur ce point pour un impact maximal sur vos performances globales.",
    },
    metrics: [
        { label: "Lectures totales", baseValue: 68, tier: "confirmed" },
        { label: "Pays", baseValue: 3, tier: "confirmed", isCount: true },
        { label: "Diffusions radio", baseValue: 342, tier: "star" },
        { label: "Stations diffusantes", baseValue: 12, tier: "confirmed", isCount: true },
        { label: "Part d'audience", baseValue: 0.8, tier: "confirmed", isCount: true, suffix: "%" },
        { label: "Score de développement", baseValue: 48, tier: "confirmed", isCount: true },
    ],
};

// ============================================================================
// §5 — CONNEXIONS (Platform Links)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/connexions
 * Returns the list of platforms and their connection status.
 * The frontend manages connection/verification state locally,
 * but initial state comes from the backend.
 *
 * @backend POST /api/v1/artist/:id/connexions/:platformId/link
 * Body: { profileUrl: string }
 * Links a platform account to the artist profile.
 *
 * @backend POST /api/v1/artist/:id/connexions/:platformId/verify
 * Verifies the linked platform account (token/URL validity).
 * Returns: { valid: boolean, error?: string }
 */
export interface ConnexionPlatformData {
    id: string;
    name: string;
    subtitle: string;            // Display identifier or "Pas connecté"
    connected: boolean;
    signupUrl: string;
    profileBaseUrl: string;
}

export const MOCK_CONNEXIONS: ConnexionPlatformData[] = [
    { id: "spotify", name: "Spotify", subtitle: "Sheylli", connected: true, signupUrl: "https://www.spotify.com/signup", profileBaseUrl: "https://open.spotify.com/artist/" },
    { id: "tiktok", name: "TikTok", subtitle: "Pas connecté", connected: false, signupUrl: "https://www.tiktok.com/signup", profileBaseUrl: "https://www.tiktok.com/@" },
    { id: "youtube", name: "Youtube", subtitle: "@sheylli_music", connected: true, signupUrl: "https://studio.youtube.com", profileBaseUrl: "https://www.youtube.com/" },
    { id: "instagram", name: "Instagram", subtitle: "@sheylley_", connected: true, signupUrl: "https://www.instagram.com/accounts/emailsignup/", profileBaseUrl: "https://www.instagram.com/" },
    { id: "apple-music", name: "Apple Music", subtitle: "Sheylli", connected: true, signupUrl: "https://artists.apple.com", profileBaseUrl: "https://music.apple.com/artist/" },
    { id: "deezer", name: "Deezer", subtitle: "Pas connecté", connected: false, signupUrl: "https://www.deezer.com/register", profileBaseUrl: "https://www.deezer.com/artist/" },
];

// ============================================================================
// §6 — DASHBOARD STREAMING (Main Page 4)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/dashboard/streaming
 * Returns the main dashboard streaming data (page 4).
 * These are used by StreamingPerformanceUnified and the DashboardBodySlot.
 *
 * The stats array maps to:
 *   [0] = Auditeurs uniques mensuels
 *   [1] = Vues mensuelles moyennes
 *   [2] = Flux pondérés totaux
 */
export interface DashboardStreamingStat {
    label: string;
    value: number;
    growth: number;
}

export interface DashboardStreamingData {
    stats: DashboardStreamingStat[];
    platformDistribution: { name: string; value: number; color: string; subValue: string }[];
    monthlyViewsChart: { x: number; uprate: number; abattement: number }[];
    weightedStreams: { label: string; value: number; subtext: string };
    topSongs: { id: number | string; title: string; date: string; streams: number; growth: number }[];
    songAdvice: string;
}

export const MOCK_DASHBOARD_STREAMING: DashboardStreamingData = {
    stats: [
        { label: "Auditeurs uniques mensuels", value: 113_100, growth: 12.5 },
        { label: "Vues mensuelles moyennes", value: 792_400, growth: -5.2 },
        { label: "Flux pondérés totaux", value: 165_800, growth: 8.7 },
    ],
    platformDistribution: [
        { name: "Youtube", value: 55, color: "#344BFD", subValue: "55%" },
        { name: "Facebook", value: 25, color: "#F68D2B", subValue: "25%" },
        { name: "Spotify", value: 20, color: "#FFFFFF", subValue: "20%" },
    ],
    monthlyViewsChart: [
        { x: 0, uprate: 60, abattement: 20 },
        { x: 1, uprate: 85, abattement: 35 },
        { x: 2, uprate: 70, abattement: 45 },
        { x: 3, uprate: 65, abattement: 25 },
        { x: 4, uprate: 75, abattement: 30 },
        { x: 5, uprate: 80, abattement: 28 },
        { x: 6, uprate: 90, abattement: 40 },
        { x: 7, uprate: 70, abattement: 45 },
        { x: 8, uprate: 72, abattement: 35 },
        { x: 9, uprate: 68, abattement: 48 },
        { x: 10, uprate: 85, abattement: 42 },
        { x: 11, uprate: 95, abattement: 45 },
        { x: 12, uprate: 80, abattement: 40 },
    ],
    weightedStreams: {
        label: "Total des flux pondérés",
        value: 165_781,
        subtext: "Index global de visibilité",
    },
    topSongs: [
        { id: 1, title: "Réponds par le feu", date: "22 et 25 août", streams: 36_600, growth: -31.1 },
        { id: 2, title: "Pardonner", date: "6 mai 25", streams: 20_000, growth: -9.3 },
        { id: 3, title: "Tu es bon", date: "12 mars 25", streams: 1_500, growth: -11.9 },
        { id: 4, title: "Pas de panique", date: "10 juillet 2025", streams: 4_400_000, growth: -99.0 },
    ],
    songAdvice: "Utilisez des accroches telles que \"Vous n'en reviendrez pas...\" ou \"3 choses que les artistes ne font pas...\" dans les 3 premières secondes. Les courts métrages créent rapidement une dynamique.",
};

// ============================================================================
// §7 — DASHBOARD SOCIAL (Main Page 4 — Social tab)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/dashboard/social
 * Returns the main dashboard social data.
 */
export interface DashboardSocialData {
    platformDistribution: { name: string; value: number; subscribers: string; color: string }[];
    subscribersByGender: { name: string; value: number; color: string; subValue: string }[];
    subscribersByAge: { name: string; value: number }[];
    bestPlatforms: { id: string; name: string; subscribers: number; growth: number }[];
    bestPlatformAdvice: string;
}

export const MOCK_DASHBOARD_SOCIAL: DashboardSocialData = {
    platformDistribution: [
        { name: "Youtube", value: 35, subscribers: "4.2M", color: "#344BFD" },
        { name: "Tiktok", value: 25, subscribers: "1.6M", color: "#F68D2B" },
        { name: "Instagram", value: 15, subscribers: "1.2M", color: "#F4A79D" },
        { name: "Spotify", value: 15, subscribers: "831K", color: "#30B77C" },
        { name: "Facebook", value: 10, subscribers: "831K", color: "#F44336" },
    ],
    subscribersByGender: [
        { name: "Homme", value: 40.8, color: "#344BFD", subValue: "40,8%" },
        { name: "Femme", value: 59.2, color: "#F68D2B", subValue: "59,2%" },
    ],
    subscribersByAge: [
        { name: "13-17", value: 4 },
        { name: "18-24", value: 54 },
        { name: "25-34", value: 35 },
        { name: "35-44", value: 2 },
        { name: "45-64", value: 1 },
        { name: "65+", value: 0 },
    ],
    bestPlatforms: [
        { id: "spotify", name: "Spotify", subscribers: 372_000, growth: 12.5 },
        { id: "apple", name: "Apple Music", subscribers: 250_000, growth: 8.2 },
        { id: "amazon", name: "Amazon Music", subscribers: 180_000, growth: -6.4 },
        { id: "youtube", name: "YouTube", subscribers: 120_000, growth: 5.1 },
        { id: "tidal", name: "Tidal", subscribers: 80_000, growth: 3.8 },
    ],
    bestPlatformAdvice: "Utilisez des accroches comme « Vous n'allez pas le croire… » ou « 3 choses que les artistes ne font pas… » dès les 3 premières secondes. Les courts métrages prennent rapidement de l'ampleur.",
};

// ============================================================================
// §8 — DASHBOARD RADIO (Main Page 4 — Radio tab)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/dashboard/radio
 * Returns the main dashboard radio/media data.
 */
export interface DashboardRadioData {
    totalPlays: number;
    countriesReached: number;
    countriesAnalysis: { name: string; value: number; color: string }[];
    stationDistribution: { name: string; plays: number; percentage: number; trend: 'neutral' | 'positive' | 'negative' }[];
    actionText: string;
    campaignTitle: string;
    campaignDescription: string;
    strategyTitle: string;
    strategyDescription: string;
    strategyFollowerGoal: string;
    strategyStations: string[];
}

export const MOCK_DASHBOARD_RADIO: DashboardRadioData = {
    totalPlays: 47,
    countriesReached: 5,
    countriesAnalysis: [
        { name: "Côte D'Ivoire", value: 50, color: "#344BFD" },
        { name: "France", value: 30, color: "#F68D2B" },
        { name: "Belgique", value: 20, color: "#FFFFFF" },
    ],
    stationDistribution: [
        { name: "Nostalgie FM", plays: 40, percentage: 85.1, trend: "neutral" },
        { name: "Radio Afrique", plays: 4, percentage: 8.5, trend: "positive" },
        { name: "Panique à la radio", plays: 1, percentage: 2.1, trend: "negative" },
        { name: "UFM (Ultima Radio)", plays: 1, percentage: 2.1, trend: "neutral" },
        { name: "Guadeloupe La 1ère", plays: 1, percentage: 2.1, trend: "neutral" },
    ],
    actionText: "Soumettre un titre à 3 émissions de radio indépendantes",
    campaignTitle: "Définir votre niche et votre style de contenu",
    campaignDescription: "Lancer une campagne ciblée sur 3 stations de radio internationales africaines afin d'obtenir 2 interviews avant la fin du mois de juillet.",
    strategyTitle: "Présenter son projet à une radio aujourd'hui",
    strategyDescription: "Choisissez une station de radio communautaire/en ligne. Envoyez un court courriel avec une brève biographie, un titre marquant et un remerciement personnel.",
    strategyFollowerGoal: "+1k",
    strategyStations: ["BBC Introducing", "Soulection Radio"],
};

// ============================================================================
// §9 — ACTIVITY FEED
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/activity?limit=10
 * Returns the latest activity feed items.
 */
export interface ActivityItemData {
    id: string;
    type: 'release' | 'milestone' | 'alert' | 'social';
    title: string;
    description: string;
    timestamp: string;           // Relative time: "Il y a 2h"
    meta?: string;               // Badge text: "+15% streams"
    image?: string;              // Optional cover art URL
}

export const MOCK_ACTIVITY_FEED: ActivityItemData[] = [
    { id: "1", type: "milestone", title: "Nouveau record mensuel !", description: "Vous avez dépassé 1M d'écoutes ce mois-ci.", timestamp: "Il y a 2h", meta: "1.02M" },
    { id: "2", type: "release", title: "Sortie de 'Midnight City'", description: "Votre nouveau single est en ligne sur toutes les plateformes.", timestamp: "Il y a 5h", image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop" },
    { id: "3", type: "alert", title: "Tendance TikTok détectée", description: "Le son 'Midnight City - Remix' est utilisé dans +500 vidéos.", timestamp: "Il y a 1j", meta: "+450%" },
    { id: "4", type: "social", title: "Mention par @SpotifyFrance", description: "Vous avez été ajouté à la playlist 'Fraîcheur Pop'.", timestamp: "Il y a 2j" },
];

// ============================================================================
// §10 — SLIDE MENU: Offre / Légal / À propos
// ============================================================================
/**
 * @backend GET /api/v1/config/plans
 * Returns pricing plans configuration.
 * The `active` field indicates the user's current plan.
 */
export interface PlanData {
    name: string;
    nameFr: string;
    price: string;
    period: string;
    periodFr: string;
    features: string[];
    featuresFr: string[];
    active: boolean;
    recommended?: boolean;
    tier: 'free' | 'pro' | 'label'; // Determines icon & color scheme
}

export const MOCK_PLANS: PlanData[] = [
    {
        name: "Free", nameFr: "Gratuit",
        price: "0€", period: "/month", periodFr: "/mois",
        features: ["3 platforms", "Weekly reports", "Basic analytics"],
        featuresFr: ["3 plateformes", "Rapports hebdomadaires", "Analyses basiques"],
        active: true, tier: "free",
    },
    {
        name: "Pro", nameFr: "Pro",
        price: "9,99€", period: "/month", periodFr: "/mois",
        features: ["6 platforms", "Real-time reports", "Advanced analytics", "Priority support"],
        featuresFr: ["6 plateformes", "Rapports temps réel", "Analyses avancées", "Support prioritaire"],
        active: false, recommended: true, tier: "pro",
    },
    {
        name: "Label", nameFr: "Label",
        price: "Custom", period: "", periodFr: "",
        features: ["Unlimited platforms", "Multi-artist", "API access", "Dedicated manager"],
        featuresFr: ["Plateformes illimitées", "Multi-artiste", "Accès API", "Manager dédié"],
        active: false, tier: "label",
    },
];

/**
 * @backend GET /api/v1/config/legal
 * Returns legal documents metadata. URLs point to actual document pages.
 */
export interface LegalSectionData {
    title: string;
    titleFr: string;
    description: string;
    descriptionFr: string;
    url: string;
}

export const MOCK_LEGAL_SECTIONS: LegalSectionData[] = [
    { title: "Terms of Service", titleFr: "Conditions générales d'utilisation", description: "Rules governing the use of DataVibe.", descriptionFr: "Règles régissant l'utilisation de DataVibe.", url: "#cgu" },
    { title: "Privacy Policy", titleFr: "Politique de confidentialité", description: "How we collect, use, and protect your data.", descriptionFr: "Comment nous collectons, utilisons et protégeons vos données.", url: "#privacy" },
    { title: "Cookie Policy", titleFr: "Politique de cookies", description: "Information about cookies and tracking.", descriptionFr: "Informations sur les cookies et le suivi.", url: "#cookies" },
    { title: "Licenses", titleFr: "Licences", description: "Third-party software licenses.", descriptionFr: "Licences des logiciels tiers.", url: "#licenses" },
];

/**
 * @backend GET /api/v1/config/legal-entity
 * Returns legal entity information for the footer.
 */
export interface LegalEntityData {
    companyName: string;
    country: string;
    countryFr: string;
    siret: string;
}

export const MOCK_LEGAL_ENTITY: LegalEntityData = {
    companyName: "DataVibe SAS",
    country: "Registered in France. All rights reserved.",
    countryFr: "Immatriculée en France. Tous droits réservés.",
    siret: "123 456 789 00012",
};

/**
 * @backend GET /api/v1/config/about
 * Returns app metadata for the About page.
 */
export interface AboutData {
    appName: string;
    tagline: string;
    taglineFr: string;
    version: string;
    buildDate: string;
    description: string;
    descriptionFr: string;
    websiteUrl: string;
    contactEmail: string;
    copyright: string;
}

export const MOCK_ABOUT: AboutData = {
    appName: "DataVibe",
    tagline: "Music Analytics Platform",
    taglineFr: "Plateforme d'analytics musicale",
    version: "v2.4.1",
    buildDate: "Build 2026.02.25",
    description: "DataVibe helps independent artists and labels track their performance across streaming, social media, and radio platforms — all in one place.",
    descriptionFr: "DataVibe aide les artistes indépendants et les labels à suivre leurs performances sur les plateformes de streaming, réseaux sociaux et radio — le tout en un seul endroit.",
    websiteUrl: "https://datavibe.app",
    contactEmail: "hello@datavibe.app",
    copyright: "© 2024-2026 DataVibe SAS",
};

// ============================================================================
// §11 — USER PROFILE
// ============================================================================
/**
 * @backend GET /api/v1/user/profile
 * Returns the current user's profile data.
 *
 * @backend PATCH /api/v1/user/profile
 * Body: { displayName?: string, email?: string, avatar?: File }
 * Updates user profile fields.
 */
export interface UserProfileData {
    displayName: string;
    email: string;
    avatarUrl: string;
    plan: 'free' | 'pro' | 'label';
    joinDate: string;
}

export const MOCK_USER_PROFILE: UserProfileData = {
    displayName: "Sheylli",
    email: "sheylli@datavibe.app",
    avatarUrl: "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzE1NjMxNjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    plan: "free",
    joinDate: "2025-01-15",
};

// ============================================================================
// §12 — SUBSCRIBER ANALYSIS (Social Dashboard)
// ============================================================================
/**
 * @backend GET /api/v1/artist/:id/dashboard/social/subscribers
 * Returns subscriber metric cards data.
 */
export interface SubscriberMetricData {
    label: string;
    value: string;
    sentiment: 'positive' | 'negative';
}

export const MOCK_SUBSCRIBER_METRICS: SubscriberMetricData[] = [
    { label: "Plateforme connecté", value: "4", sentiment: "positive" },
    { label: "Plateforme à connecter", value: "2", sentiment: "negative" },
];

// ============================================================================
// §13 — PRICING PLANS (Offre page)
// ============================================================================
/**
 * @backend GET /api/v1/config/plans
 * Returns all available subscription plans grouped by audience role.
 * Each role (artiste, manager, label, coach) has 3 tiers: free, pro, enterprise.
 *
 * @backend POST /api/v1/subscription/select
 * Body: { planId: string, roleId: string }
 * Selects/activates a plan for the current user.
 */
export type OffreRoleId = 'artiste' | 'manager' | 'label' | 'coach';
export type OffreTierId = 'free' | 'pro' | 'enterprise';

export interface OffrePlanFeature {
    label: string;
    included: boolean;
    highlight?: boolean; // visually emphasize this feature
}

export interface OffrePlan {
    tierId: OffreTierId;
    name: string;
    tagline: string;
    price: string;           // display price e.g. "0€", "14,99€"
    pricePeriod: string;     // e.g. "/mois", "/an", ""
    popular?: boolean;       // badge "Populaire" / recommended
    features: OffrePlanFeature[];
    ctaLabel: string;        // button label
    ctaAction: 'activate' | 'upgrade' | 'contact'; // what the CTA does
}

export interface OffreRole {
    roleId: OffreRoleId;
    label: string;
    description: string;
    plans: OffrePlan[];
}

export const MOCK_OFFRE_PLANS: OffreRole[] = [
    {
        roleId: 'artiste',
        label: 'Artiste',
        description: 'Pour les artistes indépendants et autoproductions',
        plans: [
            {
                tierId: 'free',
                name: 'Découverte',
                tagline: 'L\'essentiel pour démarrer',
                price: '0€',
                pricePeriod: '',
                features: [
                    { label: 'Tableau de bord basique', included: true },
                    { label: 'Suivi de 2 plateformes', included: true },
                    { label: 'Bilan mensuel simplifié', included: true },
                    { label: 'Historique 30 jours', included: true },
                    { label: 'Export PDF', included: false },
                    { label: 'Alertes personnalisées', included: false },
                    { label: 'Analyse concurrentielle', included: false },
                    { label: 'Support prioritaire', included: false },
                ],
                ctaLabel: 'Commencer gratuitement',
                ctaAction: 'activate',
            },
            {
                tierId: 'pro',
                name: 'Pro',
                tagline: 'Tout ce qu\'il faut pour percer',
                price: '9,99€',
                pricePeriod: '/mois',
                popular: true,
                features: [
                    { label: 'Tableau de bord avancé', included: true },
                    { label: 'Suivi illimité de plateformes', included: true, highlight: true },
                    { label: 'Bilan complet par période', included: true },
                    { label: 'Historique illimité', included: true, highlight: true },
                    { label: 'Export PDF & Excel', included: true },
                    { label: 'Alertes personnalisées', included: true },
                    { label: 'Analyse concurrentielle', included: false },
                    { label: 'Support prioritaire', included: false },
                ],
                ctaLabel: 'Passer à Pro',
                ctaAction: 'upgrade',
            },
            {
                tierId: 'enterprise',
                name: 'Entreprise',
                tagline: 'Pour les équipes et structures',
                price: '49,99€',
                pricePeriod: '/mois',
                features: [
                    { label: 'Tout de Pro inclus', included: true, highlight: true },
                    { label: 'Multi-artistes (jusqu\'à 25)', included: true, highlight: true },
                    { label: 'Rapports automatisés', included: true },
                    { label: 'API d\'intégration', included: true },
                    { label: 'Export tous formats', included: true },
                    { label: 'Alertes & notifications', included: true },
                    { label: 'Analyse concurrentielle', included: true },
                    { label: 'Support dédié 24/7', included: true, highlight: true },
                ],
                ctaLabel: 'Nous contacter',
                ctaAction: 'contact',
            },
        ],
    },
    {
        roleId: 'manager',
        label: 'Manager',
        description: 'Gérez plusieurs artistes efficacement',
        plans: [
            {
                tierId: 'free',
                name: 'Découverte',
                tagline: 'Testez la plateforme',
                price: '0€',
                pricePeriod: '',
                features: [
                    { label: 'Gestion de 1 artiste', included: true },
                    { label: 'Tableau de bord basique', included: true },
                    { label: 'Suivi de 2 plateformes', included: true },
                    { label: 'Bilan mensuel simplifié', included: true },
                    { label: 'Rapports multi-artistes', included: false },
                    { label: 'Alertes équipe', included: false },
                    { label: 'Comparatif artistes', included: false },
                    { label: 'Support dédié', included: false },
                ],
                ctaLabel: 'Commencer gratuitement',
                ctaAction: 'activate',
            },
            {
                tierId: 'pro',
                name: 'Pro',
                tagline: 'L\'outil du manager moderne',
                price: '19,99€',
                pricePeriod: '/mois',
                popular: true,
                features: [
                    { label: 'Gestion de 10 artistes', included: true, highlight: true },
                    { label: 'Tableau de bord avancé', included: true },
                    { label: 'Suivi illimité de plateformes', included: true },
                    { label: 'Bilan complet par période', included: true },
                    { label: 'Rapports multi-artistes', included: true, highlight: true },
                    { label: 'Alertes équipe', included: true },
                    { label: 'Comparatif artistes', included: false },
                    { label: 'Support dédié', included: false },
                ],
                ctaLabel: 'Passer à Pro',
                ctaAction: 'upgrade',
            },
            {
                tierId: 'enterprise',
                name: 'Entreprise',
                tagline: 'Gestion de roster complète',
                price: '89,99€',
                pricePeriod: '/mois',
                features: [
                    { label: 'Tout de Pro inclus', included: true, highlight: true },
                    { label: 'Artistes illimités', included: true, highlight: true },
                    { label: 'Rapports automatisés', included: true },
                    { label: 'Comparatif artistes', included: true },
                    { label: 'API d\'intégration', included: true },
                    { label: 'Export tous formats', included: true },
                    { label: 'Alertes & workflows', included: true },
                    { label: 'Account manager dédié', included: true, highlight: true },
                ],
                ctaLabel: 'Nous contacter',
                ctaAction: 'contact',
            },
        ],
    },
    {
        roleId: 'label',
        label: 'Label',
        description: 'Vision globale de votre catalogue',
        plans: [
            {
                tierId: 'free',
                name: 'Découverte',
                tagline: 'Explorez les possibilités',
                price: '0€',
                pricePeriod: '',
                features: [
                    { label: 'Vue catalogue (5 artistes)', included: true },
                    { label: 'Tableau de bord basique', included: true },
                    { label: 'Suivi de 2 plateformes', included: true },
                    { label: 'Bilan mensuel simplifié', included: true },
                    { label: 'Reporting avancé', included: false },
                    { label: 'Distribution insights', included: false },
                    { label: 'Données marché', included: false },
                    { label: 'Support premium', included: false },
                ],
                ctaLabel: 'Commencer gratuitement',
                ctaAction: 'activate',
            },
            {
                tierId: 'pro',
                name: 'Pro',
                tagline: 'Pilotez votre catalogue',
                price: '39,99€',
                pricePeriod: '/mois',
                popular: true,
                features: [
                    { label: 'Catalogue jusqu\'à 50 artistes', included: true, highlight: true },
                    { label: 'Tableau de bord avancé', included: true },
                    { label: 'Suivi illimité de plateformes', included: true },
                    { label: 'Bilan complet par période', included: true },
                    { label: 'Reporting avancé', included: true, highlight: true },
                    { label: 'Distribution insights', included: true },
                    { label: 'Données marché', included: false },
                    { label: 'Support premium', included: false },
                ],
                ctaLabel: 'Passer à Pro',
                ctaAction: 'upgrade',
            },
            {
                tierId: 'enterprise',
                name: 'Entreprise',
                tagline: 'Pour les grands catalogues',
                price: 'Sur mesure',
                pricePeriod: '',
                features: [
                    { label: 'Tout de Pro inclus', included: true, highlight: true },
                    { label: 'Artistes illimités', included: true, highlight: true },
                    { label: 'Rapports automatisés', included: true },
                    { label: 'Données marché complètes', included: true },
                    { label: 'API & webhooks', included: true },
                    { label: 'SSO & rôles équipe', included: true },
                    { label: 'SLA garanti', included: true },
                    { label: 'Account manager dédié', included: true, highlight: true },
                ],
                ctaLabel: 'Nous contacter',
                ctaAction: 'contact',
            },
        ],
    },
    {
        roleId: 'coach',
        label: 'Coach',
        description: 'Accompagnez vos talents avec des données',
        plans: [
            {
                tierId: 'free',
                name: 'Découverte',
                tagline: 'Premiers pas data-driven',
                price: '0€',
                pricePeriod: '',
                features: [
                    { label: 'Suivi de 1 talent', included: true },
                    { label: 'Tableau de bord basique', included: true },
                    { label: 'Suivi de 2 plateformes', included: true },
                    { label: 'Conseils génériques', included: true },
                    { label: 'Roadmap personnalisée', included: false },
                    { label: 'Benchmarks secteur', included: false },
                    { label: 'Coaching insights IA', included: false },
                    { label: 'Support prioritaire', included: false },
                ],
                ctaLabel: 'Commencer gratuitement',
                ctaAction: 'activate',
            },
            {
                tierId: 'pro',
                name: 'Pro',
                tagline: 'Le coaching augmenté par la data',
                price: '14,99€',
                pricePeriod: '/mois',
                popular: true,
                features: [
                    { label: 'Suivi de 5 talents', included: true, highlight: true },
                    { label: 'Tableau de bord avancé', included: true },
                    { label: 'Suivi illimité de plateformes', included: true },
                    { label: 'Roadmap personnalisée', included: true, highlight: true },
                    { label: 'Benchmarks secteur', included: true },
                    { label: 'Coaching insights IA', included: true },
                    { label: 'Templates de rapport', included: false },
                    { label: 'Support prioritaire', included: false },
                ],
                ctaLabel: 'Passer à Pro',
                ctaAction: 'upgrade',
            },
            {
                tierId: 'enterprise',
                name: 'Entreprise',
                tagline: 'Académie & programmes de coaching',
                price: '59,99€',
                pricePeriod: '/mois',
                features: [
                    { label: 'Tout de Pro inclus', included: true, highlight: true },
                    { label: 'Talents illimités', included: true, highlight: true },
                    { label: 'Coaching insights IA avancés', included: true },
                    { label: 'Templates de rapport', included: true },
                    { label: 'White-label rapports', included: true },
                    { label: 'API d\'intégration', included: true },
                    { label: 'Espace académie', included: true },
                    { label: 'Support dédié 24/7', included: true, highlight: true },
                ],
                ctaLabel: 'Nous contacter',
                ctaAction: 'contact',
            },
        ],
    },
];

// ============================================================================
// §14 — LEGAL DOCUMENTS (Page Légal — comprehensive legal corpus)
// ============================================================================
/**
 * @backend GET /api/v1/config/legal/full
 * Returns the full legal document corpus for the Legal overlay page.
 */
export type LegalDocumentId = 'cgu' | 'cgv' | 'privacy' | 'ip' | 'cookies' | 'mentions';
export interface LegalArticle { id: string; title: string; content: string; }
export interface LegalDocument { id: LegalDocumentId; title: string; subtitle: string; icon: string; lastUpdated: string; articles: LegalArticle[]; }
export const MOCK_LEGAL_DOCUMENTS: LegalDocument[] = [
    { id: 'cgu', title: 'Conditions Générales d\'Utilisation', subtitle: 'Cadre juridique régissant l\'accès et l\'utilisation de la plateforme DataVibe', icon: 'FileText', lastUpdated: '2026-01-15', articles: [
        { id: 'cgu-1', title: 'Article 1 — Objet et champ d\'application', content: 'Les présentes Conditions Générales d\'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles la société DataVibe SAS (ci-après « DataVibe », « nous » ou « la Société ») met à disposition sa plateforme d\'analyse de données musicales (ci-après « la Plateforme » ou « le Service »).\n\nLa Plateforme permet aux utilisateurs — artistes indépendants, managers, labels et coaches musicaux — d\'agréger, visualiser et analyser leurs données de performance issues de plateformes tierces de streaming, réseaux sociaux et diffusion radio.\n\nToute inscription ou utilisation de la Plateforme implique l\'acceptation sans réserve des présentes CGU. Si vous n\'acceptez pas ces conditions, vous devez vous abstenir d\'utiliser le Service.' },
        { id: 'cgu-2', title: 'Article 2 — Définitions', content: '« Utilisateur » : toute personne physique ou morale inscrite sur la Plateforme.\n\n« Compte » : l\'espace personnel créé par l\'Utilisateur lors de son inscription, lui permettant d\'accéder aux fonctionnalités du Service.\n\n« Données Utilisateur » : l\'ensemble des données personnelles et professionnelles fournies par l\'Utilisateur ou collectées via les API des plateformes tierces connectées.\n\n« Données Agrégées » : données statistiques anonymisées issues du traitement des Données Utilisateur, utilisées à des fins d\'amélioration du Service et d\'études sectorielles.\n\n« Plateforme Tierce » : tout service externe (Spotify, Apple Music, Deezer, YouTube, TikTok, Instagram, etc.) dont les données sont intégrées via API dans le Service.\n\n« Bilan » : rapport analytique généré par la Plateforme à partir des Données Utilisateur.' },
        { id: 'cgu-3', title: 'Article 3 — Inscription et gestion du Compte', content: 'L\'accès à la Plateforme est subordonné à la création d\'un Compte. L\'Utilisateur garantit l\'exactitude et l\'exhaustivité des informations fournies lors de son inscription et s\'engage à les maintenir à jour.\n\nL\'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du Service effectuée à partir de son Compte sera présumée avoir été effectuée par l\'Utilisateur lui-même.\n\nEn cas de suspicion d\'utilisation non autorisée de son Compte, l\'Utilisateur s\'engage à en informer DataVibe sans délai à l\'adresse security@datavibe.app.\n\nDataVibe se réserve le droit de suspendre ou de résilier tout Compte en cas de violation des présentes CGU, sans préavis ni indemnité.' },
        { id: 'cgu-4', title: 'Article 4 — Connexion aux Plateformes Tierces', content: 'La Plateforme intègre les données de Plateformes Tierces via leurs interfaces de programmation (API) officielles. L\'Utilisateur autorise DataVibe à accéder à ses données publiques et analytiques sur ces plateformes dans le cadre exclusif de la fourniture du Service.\n\nDataVibe agit en qualité de mandataire technique de l\'Utilisateur pour la collecte de ces données. En aucun cas DataVibe ne modifie, publie ou administre les comptes de l\'Utilisateur sur les Plateformes Tierces.\n\nLa disponibilité et la complétude des données dépendent des API des Plateformes Tierces. DataVibe ne saurait être tenue responsable des interruptions, limitations ou modifications unilatérales de ces API.\n\nL\'Utilisateur peut révoquer l\'accès de DataVibe à une Plateforme Tierce à tout moment depuis la section « Mes connexions » de son Compte.' },
        { id: 'cgu-5', title: 'Article 5 — Obligations de l\'Utilisateur', content: 'L\'Utilisateur s\'engage à :\n\n• Utiliser la Plateforme conformément à sa destination et aux présentes CGU\n• Ne pas tenter de contourner les mesures techniques de protection mises en place\n• Ne pas utiliser de robots, scrapers ou tout dispositif automatisé pour accéder au Service\n• Ne pas revendre, sous-licencier ou mettre à disposition de tiers l\'accès à son Compte\n• Respecter les droits de propriété intellectuelle de DataVibe et des Plateformes Tierces\n• Ne pas utiliser les données obtenues via la Plateforme à des fins illicites, discriminatoires ou contraires aux bonnes mœurs\n• Signaler toute faille de sécurité découverte (programme de divulgation responsable)' },
        { id: 'cgu-6', title: 'Article 6 — Disponibilité et maintenance', content: 'DataVibe s\'efforce d\'assurer une disponibilité continue de la Plateforme (objectif de 99,5% de temps de disponibilité mensuel pour les abonnements Pro et Entreprise).\n\nToutefois, DataVibe se réserve le droit d\'interrompre temporairement l\'accès au Service pour des opérations de maintenance préventive ou corrective. Les maintenances planifiées seront notifiées 48 heures à l\'avance par email ou notification in-app.\n\nDataVibe ne pourra être tenue responsable des interruptions résultant de cas de force majeure, d\'actes de cybermalveillance ou de défaillances des Plateformes Tierces.' },
        { id: 'cgu-7', title: 'Article 7 — Limitation de responsabilité', content: 'Les informations et analyses fournies par la Plateforme le sont à titre indicatif et ne constituent en aucun cas un conseil professionnel en matière de stratégie musicale, de marketing ou de gestion de carrière.\n\nDataVibe ne garantit pas l\'exactitude absolue des données agrégées, celles-ci étant dépendantes des informations transmises par les Plateformes Tierces.\n\nEn tout état de cause, la responsabilité totale de DataVibe au titre des présentes CGU ne pourra excéder le montant des sommes versées par l\'Utilisateur au cours des 12 mois précédant l\'événement dommageable.' },
        { id: 'cgu-8', title: 'Article 8 — Droit applicable et juridiction', content: 'Les présentes CGU sont régies par le droit français.\n\nEn cas de litige relatif à l\'interprétation ou à l\'exécution des présentes CGU, les parties s\'efforceront de trouver une solution amiable. À défaut, le litige sera porté devant les tribunaux compétents du ressort de Paris.\n\nConformément à l\'article L. 612-1 du Code de la consommation, l\'Utilisateur consommateur peut recourir gratuitement à un médiateur de la consommation. DataVibe adhère au service de médiation MEDICYS (www.medicys.fr).' },
    ]},
    { id: 'cgv', title: 'Conditions Générales de Vente', subtitle: 'Modalités commerciales des abonnements et services payants', icon: 'Receipt', lastUpdated: '2026-01-15', articles: [
        { id: 'cgv-1', title: 'Article 1 — Offres et tarification', content: 'DataVibe propose plusieurs formules d\'abonnement (Découverte, Pro, Entreprise) dont les caractéristiques et tarifs sont détaillés sur la page « Nos offres » de la Plateforme.\n\nLes prix sont indiqués en euros hors taxes (HT). La TVA applicable sera ajoutée au moment du paiement selon le taux en vigueur dans le pays de résidence de l\'Utilisateur.\n\nDataVibe se réserve le droit de modifier ses tarifs à tout moment. Toute modification sera notifiée à l\'Utilisateur 30 jours avant son entrée en vigueur.' },
        { id: 'cgv-2', title: 'Article 2 — Souscription et paiement', content: 'La souscription à un abonnement payant s\'effectue en ligne via la Plateforme. Le paiement est réalisé par carte bancaire via notre prestataire de paiement sécurisé Stripe.\n\nL\'abonnement prend effet immédiatement après confirmation du paiement. Les abonnements sont facturés de manière récurrente (mensuelle ou annuelle). L\'abonnement annuel bénéficie d\'une réduction de 20% par rapport au tarif mensuel.\n\nLes factures sont disponibles dans l\'espace Compte de l\'Utilisateur.' },
        { id: 'cgv-3', title: 'Article 3 — Droit de rétractation', content: 'Conformément à l\'article L. 221-18 du Code de la consommation, l\'Utilisateur consommateur dispose d\'un délai de 14 jours calendaires à compter de la souscription pour exercer son droit de rétractation, sans avoir à justifier de motif ni à supporter de frais.\n\nPour exercer ce droit : legal@datavibe.app ou formulaire dans l\'espace Compte.\n\nSi l\'Utilisateur a expressément demandé l\'exécution immédiate du Service, le remboursement sera proratisé en fonction de l\'utilisation effective. Le remboursement sera effectué dans un délai de 14 jours via le même moyen de paiement.' },
        { id: 'cgv-4', title: 'Article 4 — Résiliation', content: 'L\'Utilisateur peut résilier son abonnement à tout moment depuis son espace Compte. La résiliation prend effet à la fin de la période de facturation en cours.\n\nAprès résiliation, le Compte est automatiquement rétrogradé vers la formule Découverte (gratuite). Les données sont conservées 90 jours.\n\nDataVibe peut résilier en cas de défaut de paiement persistant (après deux relances espacées de 7 jours) ou de violation grave des CGU.' },
        { id: 'cgv-5', title: 'Article 5 — Garantie de niveau de service (SLA)', content: 'Pour les abonnements Entreprise, DataVibe s\'engage sur un SLA garantissant :\n\n• Disponibilité mensuelle >= 99,5%\n• Temps de réponse support < 4 heures ouvrées\n• Résolution des incidents critiques < 24 heures\n• Synchronisation des données < 1 heure de latence\n\nEn cas de non-respect, avoir proratisé plafonné à 30% du montant mensuel. Maintenances planifiées et cas de force majeure exclus du calcul.' },
    ]},
    { id: 'privacy', title: 'Politique de Confidentialité', subtitle: 'Protection des données personnelles — Conformité RGPD & ePrivacy', icon: 'Shield', lastUpdated: '2026-02-01', articles: [
        { id: 'priv-1', title: 'Article 1 — Responsable du traitement', content: 'Le responsable du traitement des données personnelles est :\n\nDataVibe SAS\nSIRET : 123 456 789 00012\nSiège social : 42 rue de la Musique, 75011 Paris, France\nEmail DPO : dpo@datavibe.app\n\nNotre Délégué à la Protection des Données (DPO) est joignable à l\'adresse ci-dessus pour toute question relative au traitement de vos données personnelles.' },
        { id: 'priv-2', title: 'Article 2 — Données collectées', content: 'Nous collectons les catégories de données suivantes :\n\n• Données d\'identification : nom, prénom, adresse email, photo de profil (si fournie via OAuth)\n• Données de connexion : identifiants des comptes Plateformes Tierces (tokens OAuth2), adresses IP, logs de connexion\n• Données analytiques : statistiques de performance musicale issues des API tierces (écoutes, vues, followers, engagement, playlists)\n• Données d\'utilisation : pages visitées, fonctionnalités utilisées, durée des sessions\n• Données de facturation : informations de carte bancaire (traitées exclusivement par Stripe)\n\nNous ne collectons aucune donnée sensible au sens de l\'article 9 du RGPD.' },
        { id: 'priv-3', title: 'Article 3 — Bases légales et finalités', content: 'Chaque traitement repose sur une base légale distincte (art. 6 RGPD) :\n\n• Exécution du contrat (art. 6.1.b) : fourniture du Service, génération des bilans, synchronisation des Plateformes Tierces, gestion du Compte\n• Consentement (art. 6.1.a) : newsletters, cookies non essentiels, recherche sectorielle\n• Intérêt légitime (art. 6.1.f) : amélioration du Service, détection de fraude, statistiques agrégées, support client\n• Obligation légale (art. 6.1.c) : conservation des factures (10 ans), réquisitions judiciaires\n\nRetrait du consentement possible à tout moment sans affecter la licéité antérieure.' },
        { id: 'priv-4', title: 'Article 4 — Destinataires et sous-traitants', content: 'Vos données sont susceptibles d\'être communiquées à :\n\n• Hébergement : Vercel Inc. (USA — CCT)\n• Base de données : Supabase Inc. (EU-West)\n• Paiement : Stripe Inc. (PCI-DSS Level 1, USA — BCR)\n• Analytics : Mixpanel Inc. (données pseudonymisées, USA — CCT)\n• Email : Resend Inc. (USA — CCT)\n• Support : Intercom Inc. (données minimisées, USA — CCT)\n\nTous nos sous-traitants sont liés par des DPA conformes à l\'article 28 du RGPD. Transferts hors UE encadrés par CCT ou BCR.\n\nNous ne vendons jamais vos données personnelles.' },
        { id: 'priv-5', title: 'Article 5 — Durées de conservation', content: '• Données du Compte : durée contractuelle + 3 ans\n• Données analytiques musicales : 36 mois glissants\n• Tokens OAuth2 : jusqu\'à révocation ou expiration\n• Logs de connexion : 12 mois (LCEN)\n• Données de facturation : 10 ans (obligation fiscale)\n• Cookies : 13 mois maximum (recommandation CNIL)\n\nÀ expiration, suppression ou anonymisation irréversible.' },
        { id: 'priv-6', title: 'Article 6 — Vos droits', content: 'Conformément au RGPD, vous disposez des droits suivants :\n\n• Droit d\'accès (art. 15)\n• Droit de rectification (art. 16)\n• Droit à l\'effacement (art. 17) — « droit à l\'oubli »\n• Droit à la limitation (art. 18)\n• Droit à la portabilité (art. 20) — export JSON/CSV\n• Droit d\'opposition (art. 21)\n• Retrait du consentement\n• Directives post-mortem\n\nContact : dpo@datavibe.app — Réponse sous 30 jours.\nRéclamation possible auprès de la CNIL (www.cnil.fr).' },
        { id: 'priv-7', title: 'Article 7 — Sécurité des données', content: 'Mesures techniques et organisationnelles :\n\n• Chiffrement en transit : TLS 1.3\n• Chiffrement au repos : AES-256\n• Authentification : OAuth 2.0 + PKCE, MFA optionnelle\n• Infrastructure : isolation réseau, WAF, protection DDoS\n• Contrôle d\'accès : moindre privilège, journalisation\n• Audits : pentests annuels, programme bug bounty\n• Continuité : sauvegardes quotidiennes chiffrées, réplication multi-zone\n\nNotification de violation sous 72h conformément à l\'article 33 du RGPD.' },
    ]},
    { id: 'ip', title: 'Propriété Intellectuelle', subtitle: 'Droits d\'auteur, marques, licences et contenus générés', icon: 'Copyright', lastUpdated: '2026-01-15', articles: [
        { id: 'ip-1', title: 'Article 1 — Titularité des droits', content: 'La Plateforme DataVibe — architecture logicielle, code source, interfaces graphiques, bases de données, algorithmes d\'analyse — constitue une oeuvre protégée par le droit d\'auteur (art. L. 111-1 et s. du CPI) et le droit sui generis des bases de données (art. L. 341-1 et s. du CPI).\n\nDataVibe SAS est titulaire de l\'ensemble des droits de propriété intellectuelle afférents.\n\nToute reproduction ou extraction non autorisée constitue une contrefaçon sanctionnée par les articles L. 335-2 et suivants du CPI.' },
        { id: 'ip-2', title: 'Article 2 — Marques et signes distinctifs', content: 'Les marques « DataVibe », « DATA VIBE », le logo et l\'ensemble des éléments graphiques associés sont des marques déposées auprès de l\'INPI et/ou de l\'EUIPO.\n\nLes marques des Plateformes Tierces (Spotify, Apple Music, YouTube, TikTok, Instagram, Deezer) sont la propriété de leurs détenteurs respectifs et sont utilisées à des fins d\'identification uniquement.' },
        { id: 'ip-3', title: 'Article 3 — Propriété des données et contenus générés', content: 'L\'Utilisateur conserve l\'intégralité de ses droits sur ses données.\n\nLes bilans et visualisations générés constituent des oeuvres dérivées. Licence non exclusive, mondiale et perpétuelle accordée à l\'Utilisateur pour ses besoins propres.\n\nDataVibe conserve un droit d\'utilisation non exclusif sur les méthodologies et formats de visualisation.\n\nLes Données Agrégées anonymisées sont la propriété exclusive de DataVibe SAS.' },
        { id: 'ip-4', title: 'Article 4 — API et intégrations', content: 'L\'API DataVibe (abonnements Entreprise) est soumise à :\n\n• Rate limiting : quotas définis dans la documentation\n• Attribution obligatoire : « Données fournies par DataVibe »\n• Interdiction de revente des données\n• Interdiction de rétro-ingénierie des algorithmes\n\nRévocation possible en cas de non-respect.' },
        { id: 'ip-5', title: 'Article 5 — Open source et crédits', content: 'Composants open source intégrés (MIT, Apache 2.0, BSD). Liste disponible sur demande à legal@datavibe.app.\n\nPolices :\n• Manrope — SIL Open Font License 1.1\n• Datavibe (logo) — propriétaire, tous droits réservés\n\nIcones : Lucide sous licence ISC.' },
    ]},
    { id: 'cookies', title: 'Politique de Cookies', subtitle: 'Gestion des traceurs — Directive ePrivacy & recommandations CNIL', icon: 'Cookie', lastUpdated: '2026-02-01', articles: [
        { id: 'cook-1', title: 'Article 1 — Qu\'est-ce qu\'un cookie ?', content: 'Un cookie est un petit fichier texte déposé sur votre terminal lors de votre visite. Il permet de stocker des informations et de vous reconnaître lors de visites ultérieures.\n\nLes technologies similaires (pixels, balises web, stockage local) sont couvertes par le terme « cookies » dans la présente politique.' },
        { id: 'cook-2', title: 'Article 2 — Cookies utilisés', content: 'Cookies strictement nécessaires (exemptés de consentement) :\n• auth_token (session) — préférence thème (12 mois) — langue (12 mois) — CSRF (session) — consentement cookies (13 mois)\n\nCookies analytiques (soumis à consentement) :\n• Mixpanel (_mp_*) : 13 mois — Amplitude (amp_*) : 12 mois\n\nCookies fonctionnels (soumis à consentement) :\n• Intercom (intercom-*) : 12 mois — Préférences d\'affichage (display_prefs) : 12 mois' },
        { id: 'cook-3', title: 'Article 3 — Gestion de vos préférences', content: 'Un bandeau de consentement vous permet de choisir les catégories acceptées. Modification possible à tout moment depuis Paramètres > Confidentialité.\n\nLe signal Global Privacy Control (GPC) est respecté conformément à l\'article 21 du RGPD.' },
    ]},
    { id: 'mentions', title: 'Mentions Légales', subtitle: 'Informations obligatoires — LCEN', icon: 'Building2', lastUpdated: '2026-01-15', articles: [
        { id: 'ment-1', title: 'Éditeur du site', content: 'DataVibe SAS au capital de 10 000 euros\nSIRET : 123 456 789 00012 — RCS Paris\nTVA : FR 12 345678900\n\n42 rue de la Musique, 75011 Paris\nDirecteur de la publication : Michel EKANI\n\nhello@datavibe.app — +33 1 23 45 67 89' },
        { id: 'ment-2', title: 'Hébergeur', content: 'Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, USA\nhttps://vercel.com — privacy@vercel.com\n\nBase de données : Supabase Inc. — Région EU-West (Francfort)\nhttps://supabase.com' },
        { id: 'ment-3', title: 'Crédits et attributions', content: 'Conception : DataVibe SAS\nPhotographies : Unsplash (licence gratuite)\nIcones : Lucide Icons (licence ISC)\nPolice : Manrope par Mikhail Sharanda (SIL OFL 1.1)\n\nDonnées musicales agrégées via les API officielles conformément aux CGU respectives.\nToutes les marques citées sont la propriété de leurs détenteurs respectifs.' },
        { id: 'ment-4', title: 'Médiation', content: 'DataVibe adhère au service de médiation MEDICYS.\n73 boulevard de Clichy, 75009 Paris — www.medicys.fr\n\nRéclamation préalable : legal@datavibe.app\n\nPlateforme européenne de règlement en ligne :\nhttps://ec.europa.eu/consumers/odr' },
    ]},
];

// ============================================================================
// §15 — ABOUT PAGE (Page À propos — 3 tabs)
// ============================================================================
/** @backend GET /api/v1/config/about/full */
export type AboutTabId = 'histoire' | 'pourvous' | 'horizon';
export interface AboutFeature { id: string; icon: string; title: string; description: string; highlight?: boolean; }
export interface AboutMilestone { id: string; date: string; title: string; description: string; }
export interface AboutRoadmapItem { id: string; icon: string; title: string; description: string; status: 'in-progress' | 'planned' | 'exploring'; eta?: string; isNew?: boolean; }
export interface AboutTabContent { id: AboutTabId; label: string; icon: string; content: { mission?: string; vision?: string; values?: { title: string; description: string }[]; milestones?: AboutMilestone[]; headline?: string; subheadline?: string; features?: AboutFeature[]; stats?: { label: string; value: string }[]; intro?: string; roadmap?: AboutRoadmapItem[]; communityNote?: string; }; }
export const MOCK_ABOUT_TABS: AboutTabContent[] = [
  { id: 'histoire', label: 'Notre histoire', icon: 'BookOpen', content: {
    mission: 'DataVibe est née d\'une conviction simple : chaque artiste mérite d\'avoir accès aux mêmes outils d\'analyse que les majors. Nous croyons que la data, loin de déshumaniser la musique, donne aux créateurs le pouvoir de comprendre leur audience et de construire une carrière durable.',
    vision: 'Devenir la plateforme de référence mondiale pour l\'intelligence musicale indépendante — un espace où la donnée rencontre la créativité, où chaque stream, chaque vue, chaque passage radio raconte une histoire que l\'artiste peut enfin lire et exploiter.',
    values: [
      { title: 'Transparence radicale', description: 'Vos données vous appartiennent. Nous ne vendons rien, nous éclairons tout. Chaque métrique est sourcée, chaque calcul est explicable.' },
      { title: 'Accessibilité', description: 'Du beatmaker débutant au label établi, notre interface s\'adapte à votre niveau. Pas de jargon inutile, pas de complexité artificielle.' },
      { title: 'Indépendance', description: 'Nous ne sommes affiliés à aucune plateforme de streaming ni aucun distributeur. Notre analyse est objective, nos recommandations sont neutres.' },
      { title: 'Innovation continue', description: 'L\'industrie musicale évolue chaque jour. Nous aussi. Nos algorithmes s\'affinent, nos sources s\'enrichissent, notre vision s\'élargit.' },
    ],
    milestones: [
      { id: 'ms-1', date: 'Septembre 2024', title: 'Naissance du projet', description: 'Première ligne de code. L\'idée germe lors d\'une conversation entre un producteur frustré par le manque de visibilité sur ses données et un développeur passionné de musique.' },
      { id: 'ms-2', date: 'Janvier 2025', title: 'Premiers utilisateurs beta', description: '50 artistes indépendants testent la plateforme. Les retours sont unanimes : enfin un outil qui parle leur langue.' },
      { id: 'ms-3', date: 'Juin 2025', title: 'Lancement public', description: 'DataVibe ouvre ses portes. Intégration Spotify, Apple Music et YouTube. Le bilan streaming est lancé.' },
      { id: 'ms-4', date: 'Octobre 2025', title: 'Réseaux sociaux & Radio', description: 'Ajout du suivi Instagram, TikTok et des passages radio. Le système de niveau fait son apparition.' },
      { id: 'ms-5', date: 'Février 2026', title: 'Aujourd\'hui', description: '6 plateformes connectées, des milliers d\'artistes accompagnés, et ce n\'est que le début de l\'aventure.' },
    ],
  }},
  { id: 'pourvous', label: 'Pour vous', icon: 'Sparkles', content: {
    headline: 'Transformez votre carrière musicale grâce à des informations basées sur les données',
    subheadline: 'DataVibe fournit des analyses complètes des plateformes de streaming, des réseaux sociaux et des diffusions radio pour vous aider à prendre des décisions éclairées et à développer votre audience.',
    features: [
      { id: 'feat-1', icon: 'Headphones', title: 'Analyse de streaming', description: 'Suivez vos performances sur Spotify, Apple Music, YouTube, Deezer et plus encore. Statistiques détaillées sur les auditeurs, les vues, le placement dans les playlists et l\'évolution de vos streams.', highlight: true },
      { id: 'feat-2', icon: 'Users', title: 'Analyses des réseaux sociaux', description: 'Analysez votre présence sur Instagram et TikTok : données démographiques, taux d\'engagement, tendances de croissance et contenus les plus performants.' },
      { id: 'feat-3', icon: 'Radio', title: 'Suivi des diffusions radio', description: 'Suivez vos passages radio par pays et par station. Identifiez les marchés clés, repérez les opportunités de croissance et mesurez l\'impact de vos campagnes.' },
      { id: 'feat-4', icon: 'Trophy', title: 'Évaluation du niveau de carrière', description: 'Comprenez votre positionnement grâce à notre analyse multi-dimensionnelle. Scoring personnalisé en streaming, réseaux sociaux et médias.' },
      { id: 'feat-5', icon: 'BarChart3', title: 'Bilans personnalisés', description: 'Générez des rapports complets par période. Partagez vos résultats avec votre équipe, votre manager ou vos partenaires en un clic.' },
      { id: 'feat-6', icon: 'Zap', title: 'Alertes intelligentes', description: 'Recevez des notifications lorsqu\'un titre performe exceptionnellement, qu\'un nouveau marché s\'ouvre ou qu\'une tendance émerge sur vos données.' },
    ],
    stats: [
      { label: 'Plateformes connectées', value: '6+' },
      { label: 'Métriques analysées', value: '120+' },
      { label: 'Mises à jour data', value: '24/7' },
      { label: 'Artistes accompagnés', value: '5 000+' },
    ],
  }},
  { id: 'horizon', label: 'Horizon', icon: 'Compass', content: {
    intro: 'DataVibe évolue en permanence. Voici un aperçu de ce qui se prépare dans nos ateliers. Certaines fonctionnalités sont déjà en développement, d\'autres sont à l\'étape de conception — vos retours guident nos priorités.',
    roadmap: [
      { id: 'road-1', icon: 'BrainCircuit', title: 'DataVibe Intelligence', description: 'Recommandations personnalisées alimentées par l\'IA. Analyse prédictive, suggestions de timing de sortie, identification automatique des opportunités de croissance.', status: 'in-progress', eta: 'Q2 2026', isNew: true },
      { id: 'road-2', icon: 'Globe', title: 'Carte mondiale interactive', description: 'Visualisez vos auditeurs sur une carte du monde en temps réel. Identifiez les villes et pays où votre musique résonne le plus.', status: 'in-progress', eta: 'Q2 2026', isNew: true },
      { id: 'road-3', icon: 'GitCompare', title: 'Benchmarks & comparatifs', description: 'Comparez vos performances avec des artistes de taille similaire dans votre genre. Benchmark anonymisé et éthique.', status: 'planned', eta: 'Q3 2026' },
      { id: 'road-4', icon: 'Megaphone', title: 'Hub promotion', description: 'Centralisez vos campagnes : pitching playlists, soumissions radio, stratégie réseaux sociaux. Suivez le ROI de chaque action.', status: 'planned', eta: 'Q3 2026' },
      { id: 'road-5', icon: 'Wallet', title: 'Suivi des revenus', description: 'Connectez vos distributeurs (DistroKid, TuneCore, CD Baby) pour suivre vos revenus en parallèle de vos streams.', status: 'planned', eta: 'Q4 2026' },
      { id: 'road-6', icon: 'Smartphone', title: 'Application mobile native', description: 'DataVibe dans votre poche. Consultez vos bilans, recevez des alertes push et partagez vos résultats depuis iOS et Android.', status: 'exploring' },
      { id: 'road-7', icon: 'Plug', title: 'API publique & intégrations', description: 'Connectez DataVibe à vos outils : Notion, Google Sheets, Zapier, Make. Exportez vos données et construisez vos workflows.', status: 'exploring' },
      { id: 'road-8', icon: 'MessageCircle', title: 'Communauté DataVibe', description: 'Espace d\'échange entre artistes. Partagez vos stratégies, apprenez des parcours des autres, participez à des challenges mensuels.', status: 'exploring' },
    ],
    communityNote: 'Vous avez une idée de fonctionnalité ? Envoyez-nous vos suggestions à feedback@datavibe.app — chaque retour compte dans la construction de l\'outil que vous méritez.',
  }},
];
/** @backend — Flag indicating new content in About page (triggers badge in menu) */
export const MOCK_ABOUT_HAS_NEW = true;

/**
 * @backend GET /api/v1/artist/:id/social/spotify-linked
 * Returns: { linked: boolean }
 *
 * Flag indicating whether the artist's social networks are linked to their Spotify.
 * When false, the Social tab on the main dashboard shows a locked/alert state
 * prompting the user to connect their social accounts.
 *
 * FRONTEND OVERRIDE MECHANISM (dual-mode):
 * ─────────────────────────────────────────
 * This mock value is used as the INITIAL state for `socialsConnected` in
 * `usePlatformController()` (NewPlatform.tsx). The user can also unlock the
 * Social tab directly from the UI by connecting all 4 platforms (TikTok,
 * YouTube, Instagram, Deezer) via `SocialPlatformConnect`. When all are
 * connected, `onAllConnected()` fires and sets `socialsConnected = true`
 * reactively — no page reload needed.
 *
 * BACKEND INTEGRATION:
 * When the real API is live:
 * 1. Replace this constant with an async fetch to GET /api/v1/artist/:id/social/spotify-linked
 * 2. Use the API response as the initial value for `socialsConnected` state
 * 3. The `onAllConnected` callback in SocialPlatformConnect should additionally
 *    POST to /api/v1/artist/:id/social/link-all to persist the connected state
 * 4. The frontend override (`setSocialsConnected(true)`) remains valid as
 *    optimistic UI — the state flips immediately while the POST resolves
 *
 * The reactive state architecture ensures zero refactoring: just swap the
 * initial value source from this constant to the API response.
 */
export const MOCK_SOCIALS_CONNECTED_TO_SPOTIFY = false;