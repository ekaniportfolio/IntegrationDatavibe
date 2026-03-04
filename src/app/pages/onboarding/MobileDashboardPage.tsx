import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, TrendingUp, Globe, Search, User } from "lucide-react";
import { Logo } from "../../components/branding/Logo";
import { ModeToggle } from "../../components/mode-toggle";
import { Button } from "../../components/ui/button";
import { useLanguage, useTranslation } from "../../components/language-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ReflexOpportunity, ReflexOpportunityData } from "../../reflex-matrix/ReflexOpportunity";
import { generateOpportunityData } from "../../utils/dataSimulation";

export function MobileDashboardPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  // Translated opportunity data - recomputes when language changes
  const OPPORTUNITY_DATA = useMemo(() => generateOpportunityData(t, language), [t, language]);

  // STATE: Active Tab (Home Streaming vs Social vs Radio)
  const [activeTab, setActiveTab] = useState("streaming");

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr");
  };

  const TABS = [
    { id: "streaming", label: t("onboarding.streaming") },
    { id: "social", label: t("onboarding.social") },
    { id: "radio", label: t("onboarding.radio") },
  ];

  // DYNAMIC METRICS BASED ON ACTIVE TAB
  const getMetrics = () => {
      switch(activeTab) {
          case 'social':
              return [
                { id: 1, label: "Insta " + t("social.subscribers"), value: "45.2K", change: "+1.2K" },
                { id: 2, label: "TikTok", value: "890K", change: "+15%" },
                { id: 3, label: t("bilan.social.engagement"), value: "4.8%", change: "-0.2%" },
              ];
          case 'radio':
              return [
                { id: 1, label: "Rotations", value: "24", change: "+4" },
                { id: 2, label: "Audience", value: "1.2M", change: "+50K" },
                { id: 3, label: t("bilan.media.stations"), value: "8", change: "+1" },
              ];
          case 'streaming':
          default:
              return [
                { id: 1, label: t("onboarding.spotify_aud"), value: "113.9K", change: "+245" },
                { id: 2, label: t("onboarding.youtube_views"), value: "367.9K", change: "+12.4K" },
                { id: 3, label: t("onboarding.playlists"), value: "166", change: "+2" },
              ];
      }
  };

  const METRICS = getMetrics();

  // LOGO ANIMATION VARIANTS
  const letterVariants = {
    hidden: { opacity: 0, y: -20, rotateX: 90 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* 1. ONBOARDING SCREEN (MOBILE DASHBOARD) */}
      <div className="relative z-10 w-full bg-background border-b-4 border-border">
        {/* BACKGROUND CONTAINER - SHARED ID FOR SPATIAL PERSISTENCE */}
        <motion.div 
            layoutId="app-background"
            className="relative h-[800px] w-full bg-background overflow-hidden flex flex-col"
            transition={{ duration: 0.8, ease: "easeInOut" }} // Smooth morphing duration
        >
             <motion.div 
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(155deg, var(--app-bg-gradient-start) 0%, var(--app-bg-gradient-mid) 50%, var(--app-bg-gradient-end) 100%)",
                    opacity: 1 
                }}
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} // Fade in the new gradient smoothly
                transition={{ duration: 0.8 }}
            />
            
            {/* Header - Custom for Mobile Dashboard (with Menu) */}
            {/* DELAYED START: 1.8s delay to allow Screen 3 elements to exit Left/Right completely */}
            <motion.header 
                className="h-16 flex items-center justify-between px-4 bg-header-background border-b border-header-border backdrop-blur-md overflow-hidden z-20 relative"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "circOut", delay: 1.8 }}
            >
                {/* MENU BURGER (Accordéon Ligne par Ligne) */}
                <motion.div 
                    initial="hidden" animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 2.0 } }
                    }}
                >
                    <Button variant="ghost" size="icon" className="text-foreground relative">
                        <div className="flex flex-col gap-[5px] w-5">
                            {[1, 2, 3].map(i => (
                                <motion.span 
                                    key={i}
                                    className="h-[2px] w-full bg-current rounded-full"
                                    variants={{
                                        hidden: { scaleX: 0, opacity: 0 },
                                        visible: { scaleX: 1, opacity: 1, transition: { duration: 0.3 } }
                                    }}
                                />
                            ))}
                        </div>
                    </Button>
                </motion.div>
                
                {/* LOGO DATAVIBE (Lettre par lettre, Accordéon) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                     <motion.div 
                        className="flex items-center text-logo-default font-logo"
                        initial="hidden" animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.05, delayChildren: 2.2 } }
                        }}
                     >
                        {/* DATA */}
                        {['D','A','T','A'].map((l, i) => (
                            <motion.span key={`d-${i}`} variants={letterVariants} className="text-logo-primary">{l}</motion.span>
                        ))}
                        {/* VIBE */}
                        {['V','I','B','E'].map((l, i) => (
                            <motion.span key={`v-${i}`} variants={letterVariants} className="text-logo-accent">{l}</motion.span>
                        ))}
                     </motion.div>
                </div>

                {/* ACTIONS (Planète -> Langue -> Mode -> Avatar) */}
                <motion.div 
                    className="flex items-center gap-2"
                    initial="hidden" animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 2.5 } }
                    }}
                >
                    <motion.div variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground rounded-full" onClick={toggleLanguage}>
                            <Globe className="w-4 h-4" />
                        </Button>
                    </motion.div>

                    <motion.div variants={{ hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
                        <span className="text-xs font-bold uppercase text-foreground">{language}</span>
                    </motion.div>

                    <motion.div variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}>
                        <ModeToggle />
                    </motion.div>

                    {/* AVATAR (Remplace le 'K') */}
                    <motion.div variants={{ hidden: { scale: 0, rotate: 180 }, visible: { scale: 1, rotate: 0 } }}>
                        <Avatar className="w-9 h-9 border border-border">
                            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="@shadcn" />
                            <AvatarFallback>KS</AvatarFallback>
                        </Avatar>
                    </motion.div>
                </motion.div>
            </motion.header>

            {/* Visiomorphic Search Circle (Transition Target) */}
            {/* 
               CRITICAL: 
               1. layoutId matches the Input from previous screen.
               2. Starts visible immediately.
               3. Movement duration (0.8s) synced to occur AFTER screen 3 exits but BEFORE content loads.
               4. Initial delay on layout transition to wait for Screen 3 cleanup? No, it usually happens simultaneously.
                  But user said "seulement après ça... on a le déplacement".
                  We add a small delay to the transition prop if possible, or we trust the natural timing.
                  Here I use a spring with mass/damping that feels "heavy" at start, simulating a wait.
            */}
            <div className="px-4 mt-6 mb-2 flex justify-start z-30 relative">
                <motion.div 
                    layoutId="visiomorphic-container"
                    className="w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-sm border border-border cursor-pointer relative overflow-hidden"
                    onClick={() => navigate("/")}
                    // FIX: Ajustement de la physique pour rendre le déplacement visible et fluide
                    transition={{ 
                        type: "spring", 
                        stiffness: 180, // Moins raide pour un mouvement plus majestueux
                        damping: 25,    // Pas trop de rebond
                        mass: 1,
                        layout: { 
                            duration: 0.8, 
                            delay: 0.6 // Délai réduit juste assez pour laisser les textes sortir (spatial flow), puis on bouge
                        } 
                    }} 
                >
                    {/* INITIALE 'K' (Fades Out) */}
                    <motion.span
                         className="absolute text-xl font-bold text-foreground"
                         initial={{ opacity: 1, scale: 1 }}
                         animate={{ opacity: 0, scale: 0.5 }}
                         transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        K
                    </motion.span>

                    {/* LOUPE (Fades In) */}
                    <motion.div
                        className="absolute"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <Search className="w-6 h-6 text-foreground" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 px-4 mb-6 mt-2 z-10">
                {TABS.map((tab, index) => (
                <motion.div
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    flex-1 py-2.5 px-2 rounded-2xl text-[11px] font-semibold text-center transition-all cursor-pointer
                    ${activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }
                    `}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.5, 
                        delay: 2.8 + (index * 0.1), 
                        ease: "backOut" 
                    }}
                >
                    <span className={`transition-opacity duration-300 ${activeTab === tab.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}>
                        {tab.label}
                    </span>
                </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 px-4 flex flex-col gap-4 overflow-y-auto pb-8 z-10">
                
                {/* METRICS CARD */}
                <motion.div 
                    className="bg-card border border-border/50 rounded-[20px] p-5 shadow-sm"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 3.2, ease: "easeOut" }}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-muted-foreground text-xs font-medium mb-1">{t("onboarding.hello")}</p>
                            <h2 className="text-xl font-bold text-foreground">KS Bloom 👋</h2>
                        </div>
                        <div className="px-2.5 py-1.5 bg-green-500/10 rounded-xl flex items-center gap-1.5 border border-green-500/20">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] font-semibold text-green-500">{t("onboarding.growth")}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {METRICS.map((metric, i) => (
                        <motion.div 
                            key={metric.id}
                            className="flex-1 p-3 bg-muted/50 rounded-2xl flex flex-col items-center justify-center gap-1 border border-transparent hover:border-border transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 3.4 + (i * 0.1) }}
                        >
                            <span className="text-base font-bold text-foreground">{metric.value}</span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wide text-center">{metric.label}</span>
                        </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* DYNAMIC CONTENT AREA */}
                <AnimatePresence mode="wait">
                    {/* HOME_STREAMING: Shows Opportunity */}
                    {activeTab === 'streaming' && (
                        <motion.div
                            key="streaming-opportunity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <ReflexOpportunity 
                                data={OPPORTUNITY_DATA['streaming']} 
                                onOpen={() => console.log("Open full dashboard logic on mobile if needed")} 
                            />
                        </motion.div>
                    )}

                    {/* HOME_SOCIAL: Shows "View Dashboard" Call to Action */}
                    {activeTab === 'social' && (
                        <motion.div
                            key="social-cta"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                        >
                            <h3 className="text-lg font-bold mb-2">{t('onboarding.socialAnalysis')}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.socialAnalysisDesc')}</p>
                            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                                {t('onboarding.viewSocialDashboard')}
                            </Button>
                        </motion.div>
                    )}

                    {/* HOME_RADIO: Shows "View Dashboard" Call to Action */}
                    {activeTab === 'radio' && (
                        <motion.div
                            key="radio-cta"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                        >
                            <h3 className="text-lg font-bold mb-2">{t('onboarding.radioTracking')}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.radioTrackingDesc')}</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                {t('onboarding.viewRadioDashboard')}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                
            </div>
        </motion.div>
      </div>
    </div>
  );
}