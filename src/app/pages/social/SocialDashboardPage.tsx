import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "../../components/layout/Header";
import { OnboardingHeader, VisiomorphicHelpAvatar } from "../../components/onboarding/OnboardingHeader";
import { StickyBottomNav } from "../../components/onboarding/StickyBottomNav";
import { useTranslation } from "../../components/language-provider";
import { Search, Loader2, Menu, TrendingUp, Globe, User } from "lucide-react";
import socialSvgPaths from "../../../imports/svg-sutxa7f33a";

// Helper for follow flow variants (same as WelcomePage)
const getFollowFlowVariants = (delay = 0) => ({
    hidden: { 
        x: -150, // Enter from Left
        opacity: 0, 
        scale: 0.95, 
        filter: "blur(8px)" 
    },
    visible: { 
        x: 0, opacity: 1, scale: 1, filter: "blur(0px)",
        transition: { type: "spring", stiffness: 95, damping: 20, mass: 1, delay }
    },
    exit: { 
        opacity: 0, x: -400, filter: "blur(8px)", 
        transition: { duration: 0.45, ease: "easeIn" }
    }
});

export default function SocialDashboardPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Animation state
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleBack = () => {
        navigate(-1); // Go back to WelcomePage
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-x-hidden font-manrope">
            {/* --- HEADER --- */}
            <Header />

            <main className="flex-1 flex flex-col pb-32 relative z-10">
                <OnboardingHeader 
                    title={
                        <div className="flex flex-col items-center">
                            <span className="text-[32px] font-bold text-center leading-tight tracking-tight text-foreground">
                                {t('dashboard.tabDashboard')}
                            </span>
                        </div>
                    }
                    subtitle={
                        <span className="text-[15px] font-medium text-muted-foreground text-center max-w-[280px] leading-relaxed block mt-2">
                           {t('dashboard.socialDetailedAnalysis')}
                        </span>
                    }
                />

                {/* --- CONTAINER SANCTUARY (Glass Effect) --- */}
                <div className="px-5 w-full max-w-md mx-auto relative z-20 mt-[-10px]">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full bg-dashboard-card-bg/60 backdrop-blur-xl rounded-[32px] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-2 pb-6 overflow-hidden relative"
                    >
                        {/* --- TABS (SOCIAL CONTEXT - GREEN) --- */}
                        <motion.div
                            key="social-dashboard-tabs"
                            className="w-full flex px-4 mb-6 mt-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { gap: "60px" },
                                visible: { 
                                    gap: "8px", 
                                    transition: { gap: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }, staggerChildren: 0.1 } 
                                }
                            }}
                        >
                            {[
                                { label: t('dashboard.tabDashboard'), filled: true },
                                { label: t('dashboard.tabFollowers'), filled: false },
                                { label: t('dashboard.tabDemographics'), filled: false }
                            ].map((btn, i) => (
                                 <motion.div 
                                    key={i}
                                    className={`relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] transition-colors duration-300 ${btn.filled ? 'bg-dashboard-tab-social-active-bg' : 'bg-dashboard-tab-social-inactive-bg'}`}
                                    variants={{
                                        hidden: { x: -50, opacity: 0, filter: "blur(8px)" },
                                        visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 20 } }
                                    }}
                                >
                                    {/* Border for non-filled items */}
                                    <div aria-hidden="true" className={`absolute border-[0.5px] border-solid inset-0 pointer-events-none rounded-[19px] ${btn.filled ? 'border-transparent' : 'border-dashboard-tab-social-border'}`} />
                                    <span className={`relative z-10 text-[12.6px] font-bold leading-normal whitespace-nowrap transition-colors duration-300 ${btn.filled ? 'text-dashboard-tab-social-active-text' : 'text-dashboard-tab-social-inactive-text'}`}>{btn.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* --- BODY (SOCIAL CARDS) --- */}
                        <div className="flex flex-col gap-5 w-full px-2">
                             {/* Social Cards Row */}
                            <motion.div 
                                className="flex gap-2 w-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {[ 
                                    { v: "24.5K", l: t('dashboard.socialFollowersInsta'), c: "+1.2K" }, 
                                    { v: "12.8K", l: t('dashboard.socialFollowersTikTok'), c: "+650" } 
                                ].map((s, i) => (
                                    <div key={i} className="bg-dashboard-card-bg flex-1 p-2 py-3 rounded-lg flex flex-col items-center justify-between min-h-[86px] shadow-sm border border-border/50">
                                        <div className="flex flex-col items-center w-full">
                                            <p className="text-[20px] font-bold text-dashboard-stat-value font-manrope">{s.v}</p>
                                            <p className="text-[12px] font-normal text-dashboard-stat-label font-manrope">{s.l}</p>
                                        </div>
                                        <div className="w-full flex justify-center">
                                            <p className="text-[17px] font-bold font-manrope text-dashboard-stat-positive">{s.c}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Additional Social Content Mock (e.g. Engagement Graph placeholder) */}
                            <motion.div 
                                className="w-full bg-dashboard-card-bg rounded-xl p-4 border border-border/50 min-h-[120px] flex items-center justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-sm text-muted-foreground">{t('dashboard.engagementChart')}</p>
                            </motion.div>
                        </div>
                        
                        {/* --- BACK BUTTON (Contextual) --- */}
                         <motion.div 
                            className="mt-6 flex justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button 
                                onClick={handleBack}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {'\u2190'} {t('dashboard.backToSummary')}
                            </button>
                        </motion.div>

                    </motion.div>
                </div>
            </main>
            
            <StickyBottomNav />
        </div>
    );
}