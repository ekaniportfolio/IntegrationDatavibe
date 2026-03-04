import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Check, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import Dashboard from "../Dashboard";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { OnboardingHeader } from "../../components/onboarding/OnboardingHeader";
import { useDevice } from "@/context/DeviceContext";
import { useTranslation } from "../../components/language-provider";

export function SyncingPage() {
  const navigate = useNavigate();
  const { isTouch, isMobile, isSmallScreen } = useDevice();
  const isCompactView = isTouch || isMobile || isSmallScreen;
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  
  // Simulation of steps completion
  const [steps, setSteps] = useState({
    profile: false,
    stats: false,
    opportunities: false
  });

  useEffect(() => {
    // Animation timeline
    const timers = [
      setTimeout(() => { setProgress(33); setSteps(s => ({ ...s, profile: true })) }, 800),
      setTimeout(() => { setProgress(66); setSteps(s => ({ ...s, stats: true })) }, 2000),
      setTimeout(() => { setProgress(100); setSteps(s => ({ ...s, opportunities: true })) }, 3200),
      // Trigger visual transition before navigation
      setTimeout(() => { setIsCompleting(true); }, 3800),
      // Navigate to dashboard
      setTimeout(() => { navigate("/onboarding/dashboard"); }, 4800)
    ];

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="flex flex-col w-full bg-background min-h-dvh">
      {/* 1. ONBOARDING SCREEN (SYNC) */}
      <div className="relative z-10 w-full bg-background border-b-4 border-zinc-900">
        <div className="relative h-[800px] w-full bg-background overflow-hidden flex flex-col">
            
            {/* Header - Fades out on completion */}
            <motion.div 
                animate={{ 
                    x: isCompleting ? -100 : 0,
                    opacity: isCompleting ? 0 : 1 
                }}
                transition={{ duration: 0.5 }}
                className="relative z-20"
            >
                <OnboardingHeader showBack={true} showLogo={false} className="mb-2" />
            </motion.div>

            {/* Main Content */}
            <motion.div 
                className="flex-1 flex flex-col px-4 pt-24 justify-start md:pt-0 md:justify-center md:items-center md:-mt-20"
                animate={{ 
                    x: isCompleting ? 100 : 0,
                    opacity: isCompleting ? 0 : 1 
                }}
                transition={{ duration: 0.5 }}
            >
                
                <div className="flex flex-col items-center w-full">
                    {/* Progress Circle Wrapper */}
                    <div className="relative w-24 h-24 mb-6">
                        {/* SVG Progress Ring - Fades out */}
                        <motion.svg 
                            animate={{ opacity: isCompleting ? 0 : 1, scale: isCompleting ? 0.9 : 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full -rotate-90" viewBox="0 0 100 100"
                        >
                            {/* Background Track */}
                            <circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                className="stroke-muted" 
                                strokeWidth="4" 
                            />
                            {/* Progress Indicator */}
                            <motion.circle 
                                cx="50" cy="50" r="45" 
                                fill="none" 
                                className="stroke-datavibe-primary" 
                                strokeWidth="4"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: progress / 100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </motion.svg>
                        
                        {/* 
                        STATIC AVATAR (Initial State)
                        Centered inside the ring. Exits when isCompleting starts.
                        Uses layoutId to seamlessly transform into the Hero element.
                        */}
                        {!isCompleting && (
                            <motion.div 
                                layoutId="hero-k"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65px] h-[65px] bg-card rounded-full flex items-center justify-center border border-border z-10"
                            >
                                <span className="text-2xl font-bold text-foreground">K</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Text Content - Fades out */}
                    <motion.div 
                        className="flex flex-col items-center w-full"
                    >
                        <h2 className="text-xl font-bold text-foreground mb-2">{t('onboarding.sync_title')}</h2>
                        <p className="text-muted-foreground text-xs mb-8">{t('onboarding.sync_subtitle')}</p>

                        {/* Checklist */}
                        <div className="flex flex-col gap-3 w-full max-w-[200px]">
                            <StepItem label={t('onboarding.sync_profile')} isCompleted={steps.profile} />
                            <StepItem label={t('onboarding.sync_stats')} isCompleted={steps.stats} />
                            <StepItem label={t('onboarding.sync_opps')} isCompleted={steps.opportunities} />
                        </div>
                    </motion.div>
                </div>

            </motion.div>

            {/* 
                THE HERO ANIMATION ELEMENT 
                Mounts when isCompleting is true.
                Inherits position from "hero-k" layoutId and animates to target styles.
            */}
            {isCompleting && (
                <motion.div
                    layoutId="hero-k"
                    initial={{ borderRadius: 9999 }} 
                    className="absolute z-50 flex items-center justify-center border border-border overflow-hidden shadow-sm pointer-events-none transition-colors duration-500 bg-card"
                    style={{ 
                        // Target Styles (Motion animates to these from source layout)
                        // Updated to match Header Search position (top: 12px for vertical center in 64px header, left: ~60px after trigger)
                        top: 12, 
                        left: 56, 
                        x: 0,
                        width: 40, // w-10 matches Header
                        height: 40, // h-10 matches Header
                    }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                >
                    {/* Content Switching: Starts with K (to match source), fades to Search */}
                     <AnimatePresence mode="wait">
                         {/* We don't render K here because layoutId handles the container. 
                             But if we want the "K" to fade out inside the moving container, we need to render it.
                             Since the StaticK unmounted, we render a matching K here that exits immediately.
                         */}
                         <motion.div
                            key="search-content"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="flex items-center justify-center w-full h-full"
                        >
                             <Search className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                     </AnimatePresence>
                </motion.div>
            )}

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

function StepItem({ label, isCompleted }: { label: string, isCompleted: boolean }) {
    return (
        <motion.div 
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
