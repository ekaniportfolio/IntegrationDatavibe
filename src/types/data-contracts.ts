// ce fichier sert de "Cahier des charges" pour l'équipe Backend.
// Il définit exactement quelles données sont attendues pour chaque section du VOCABULARY.md

// ============================================================================
// 1. DATA FOR: HOME_STREAMING (Aperçu Streaming)
// ============================================================================

export interface HomeStreamingData {
  // Les 3 cartes du haut
  kpiCards: {
    spotifyAudience: { value: string; trend: string; isPositive: boolean };
    youtubeViews: { value: string; trend: string; isPositive: boolean };
    playlistCount: { value: number; trend: string; isPositive: boolean };
  };
  // Le Bloc Opportunité (Vital pour cette vue)
  opportunity: {
    title: string;
    subtitle: string;
    isUrgent: boolean;
    bgImage: string; // URL
    actionLabel: string;
  };
}

// ============================================================================
// 2. DATA FOR: STREAM_MAIN (Tableau de bord complet Streaming)
// ============================================================================

export interface StreamMainData {
  // En-tête du dashboard
  header: {
    artistName: string;
    periodLabel: string; // ex: "Derniers 28 jours"
  };
  // Analyse de Playlist (Le composant complexe)
  playlistAnalysis: {
    totalReach: number;
    activePlaylists: number;
    topPlaylists: Array<{
      id: string;
      name: string;
      curator: string;
      reach: number;
      change: number; // +12%
    }>;
  };
}

// ============================================================================
// 3. DATA FOR: ONBOARDING (ONB_SEARCH)
// ============================================================================

export interface ArtistSearchResult {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  followers: number;
}
