import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Mic, Check, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Dashboard from "../Dashboard";
import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { OnboardingHeader } from "../../components/onboarding/OnboardingHeader";
import { useDevice } from "@/context/DeviceContext";
import { useTranslation } from "../../components/language-provider";

// Spotify Icon SVG
const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

interface Artist {
  id: string;
  name: string;
  listeners: string;
  genre: string;
  initial: string;
}

const MOCK_ARTISTS: Artist[] = [
  { id: "1", name: "KS Bloom", listeners: "113.9K", genre: "Gospel Afro", initial: "K" },
  { id: "2", name: "KS Official", listeners: "12.4K", genre: "Hip-Hop", initial: "K" },
];

export function ArtistSearchPage() {
  const navigate = useNavigate();
  const { isTouch, isMobile, isSmallScreen } = useDevice();
  
  // Combine all "mobile-like" triggers
  const isCompactView = isTouch || isMobile || isSmallScreen;
  
  // SIMULATION: Default query and results shown instantly
  const [searchQuery, setSearchQuery] = useState("KS Bloom");
  const [selectedArtist, setSelectedArtist] = useState<string | null>("1");
  const { t } = useTranslation();

  // NOTE: We now use CSS 'group-has-[input:focus]' for robust mobile focus handling
  // instead of relying solely on JS state which can be flaky on some devices.

  const handleResultClick = (artistId: string) => {
    if (selectedArtist === artistId) {
        // Validation on second click (always allowed if selected)
        navigate("/onboarding/sync");
    } else {
        setSelectedArtist(artistId);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-dvh">
      {/* 1. ONBOARDING SCREEN (SEARCH) */}
      <div className="relative z-10 w-full bg-background border-b-4 border-zinc-900">
        <div className="relative h-[800px] w-full bg-background overflow-hidden flex flex-col pb-8">
            {/* Background Glow */}
            <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200px] pointer-events-none"
                style={{
                backgroundImage: "radial-gradient(ellipse at top, var(--datavibe-primary) 0%, transparent 60%)",
                opacity: 0.1
                }}
            />

            {/* Header: Fade In */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <OnboardingHeader showBack={true} showLogo={false} className="mb-2" />
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center z-10 w-full max-w-sm mx-auto px-4 mt-8 transition-all duration-500 group/search-context group-has-[input:focus]/search-context:mt-2">
                
                {/* 1. Spotify Button: Drops from TOP (Delayed) - Disappears on Touch Focus via CSS */}
                <div
                    className="w-full mb-6 transition-all duration-300 ease-in-out overflow-hidden md:opacity-100 md:max-h-20 md:mb-6 group-has-[input:focus]/search-context:opacity-0 group-has-[input:focus]/search-context:max-h-0 group-has-[input:focus]/search-context:mb-0 group-has-[input:focus]/search-context:invisible md:group-has-[input:focus]/search-context:visible md:group-has-[input:focus]/search-context:max-h-20 md:group-has-[input:focus]/search-context:opacity-100"
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Button 
                            variant="outline" 
                            className="w-full rounded-full h-10 border-datavibe-green/30 hover:bg-datavibe-green/5 text-foreground flex items-center justify-center gap-2 font-medium text-sm"
                        >
                            <SpotifyIcon className="w-4 h-4 text-brand-spotify" />
                            <span className="text-brand-spotify">{t('onboarding.connect_spotify')}</span>
                        </Button>
                    </motion.div>
                </div>

                 {/* 2. Title - Disappears on Touch Focus via CSS */}
                 <div
                    className="overflow-hidden transition-all duration-300 ease-in-out md:opacity-100 md:max-h-20 md:mb-1 group-has-[input:focus]/search-context:opacity-0 group-has-[input:focus]/search-context:max-h-0 group-has-[input:focus]/search-context:mb-0 group-has-[input:focus]/search-context:invisible md:group-has-[input:focus]/search-context:visible md:group-has-[input:focus]/search-context:max-h-20 md:group-has-[input:focus]/search-context:opacity-100"
                 >
                    <motion.div
                        initial={{ opacity: 1, height: "auto" }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.4 }}
                    >
                        <h1 className="text-xl font-bold text-center mb-1 text-foreground">
                        {t('onboarding.search_title')}
                        </h1>
                    </motion.div>
                 </div>
                
                {/* 3. Search Input: Drops from TOP */}
                {/* On touch focus, this moves up naturally because elements above are removed */}
                <motion.div 
                    layoutId="search-input-container"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", layout: { duration: 0.4 } }}
                    className="w-full relative my-4 bg-card border border-border rounded-xl flex items-center h-12 overflow-hidden shadow-sm shrink-0 transition-all duration-300 group-has-[input:focus]/search-context:my-2 md:group-has-[input:focus]/search-context:my-4"
                >
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                        <Search className="w-4 h-4" />
                    </div>
                    <Input 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 bg-transparent border-none h-full text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                        placeholder={t('onboarding.search_placeholder')}
                    />
                </motion.div>


                {/* 4. Results List: INSTANT (No Animation) */}
                <div className="w-full flex flex-col gap-3 mt-0">
                {MOCK_ARTISTS.map((artist) => {
                    const isSelected = selectedArtist === artist.id;
                    return (
                    <motion.div
                        layout
                        key={artist.id}
                        onClick={() => handleResultClick(artist.id)}
                        className={`
                        w-full p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-colors
                        ${isSelected 
                            ? "bg-datavibe-primary/10 border-datavibe-primary" 
                            : "bg-card border-border hover:border-datavibe-primary/30"
                        }
                        `}
                    >
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                            <span className="text-sm font-bold text-foreground">{artist.initial}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate" translate="no">{artist.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{artist.genre}</div>
                        </div>
                        {isSelected && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="rounded-full bg-datavibe-primary text-white flex items-center justify-center shrink-0 w-8 h-8 md:w-5 md:h-5"
                            >
                                <ChevronRight className="w-5 h-5 md:hidden" />
                                <Check className="w-3 h-3 stroke-[3] hidden md:block" />
                            </motion.div>
                        )}
                    </motion.div>
                    );
                })}
                </div>
            </div>

            {/* Footer Actions */}
            <div 
                className="w-full max-w-sm mx-auto mt-6 z-10 flex flex-col items-center gap-3 px-4 transition-all duration-300 ease-in-out md:opacity-100 md:max-h-40 group-has-[input:focus]/search-context:opacity-0 group-has-[input:focus]/search-context:max-h-0 group-has-[input:focus]/search-context:mt-0 group-has-[input:focus]/search-context:invisible md:group-has-[input:focus]/search-context:visible md:group-has-[input:focus]/search-context:max-h-40 md:group-has-[input:focus]/search-context:mt-6 md:group-has-[input:focus]/search-context:opacity-100"
            >
                <motion.div 
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex flex-col items-center gap-3"
                >
                    {/* 5. VISIOMORPHIC BUTTON: Transforms from "Commencer" */}
                    {/* Only show on Desktop (Non-Compact) via CSS media query logic */}
                    <div className="w-full hidden md:block">
                        <motion.div
                            className="w-full relative z-50"
                            layoutId="shared-main-action-button"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <Button 
                            size="lg"
                            className="w-full rounded-full font-semibold text-base h-12 bg-gradient-to-r from-datavibe-primary to-datavibe-purple text-white shadow-lg border-none flex items-center gap-2 justify-center"
                            onClick={() => navigate("/onboarding/sync")} 
                            >
                                {t('onboarding.its_me')}
                                
                                {/* 6. MICROPHONE: Slides in from RIGHT */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <Mic className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>

                    {/* 7. Footer Link: Fades In */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-xs text-muted-foreground"
                    >
                    {t('auth.notOnSpotify')} <button className="text-transparent bg-clip-text bg-gradient-to-r from-datavibe-primary to-datavibe-purple hover:underline font-bold border-none p-0 cursor-pointer">{t('auth.manualSignup')}</button>
                    </motion.p>
                </motion.div>
            </div>
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="py-4 bg-zinc-950 flex flex-col items-center justify-center gap-2 border-y border-zinc-800 text-center sticky top-0 z-50 shadow-2xl">
        <div className="text-zinc-400 font-mono text-sm font-bold uppercase tracking-widest">⬇️ Plateforme Principale (Source - Desktop) ⬇️</div>
      </div>

      {/* 2. MAIN PLATFORM */}
      <div className="relative z-0 w-full h-[800px] border-t border-zinc-800 overflow-hidden isolate transform-gpu">
        <SidebarProvider defaultOpen={true} className="h-full w-full">
            <div className="flex h-full w-full bg-background dark:bg-[linear-gradient(155.015deg,var(--app-bg-gradient-start)_3.5121%,var(--app-bg-gradient-mid)_51.814%,var(--app-bg-gradient-end)_94.962%)] text-foreground font-manrope transition-colors duration-300">
                <AppSidebar className="border-r border-border" />
                <main className="flex-1 flex flex-col min-w-0 overflow-auto relative h-full">
                  <Header />
                  <div className="flex-1 p-4 md:p-6">
                    <Dashboard />
                  </div>
                </main>
            </div>
        </SidebarProvider>
      </div>
    </div>
  );
}