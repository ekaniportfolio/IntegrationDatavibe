import { motion, AnimatePresence } from "motion/react";
import { Music2, Share2, Radio } from "lucide-react";
import { useTranslation } from "../language-provider";

interface BilanBottomNavProps {
    activeTab: string;
    onTabChange: (id: string) => void;
    isVisible: boolean;
}

/**
 * TAF (Transmigrated Astral Flow) Protocol — BILAN MAIN NAV:
 * ─────────────────────────────────────────────────────────────
 * 1. Shows Streaming/Réseaux/Médias tabs (NOT period tabs).
 * 2. Uses layoutId="soul-top-${index}" for TAF sync with DashboardTabsSlot inline tabs.
 * 3. On click: scrolls to top + changes main tab (exits bilan view).
 * 4. Replaces MainBottomNav when isBilanView is active.
 * 5. Spring physics: 82/24 entrance, 105/18 souls — same as MainBottomNav.
 * 6. Colorimetry per-tab: streaming orange, social purple, radio blue.
 */
export const BilanBottomNav = ({ activeTab, onTabChange, isVisible }: BilanBottomNavProps) => {
    const { t } = useTranslation();
    const navItems = [
        { 
            id: "streaming", 
            label: t("bilannav.streaming"), 
            icon: Music2
        }, 
        { 
            id: "social", 
            label: t("bilannav.social"), 
            icon: Share2
        }, 
        { 
            id: "radio", 
            label: t("bilannav.media"), 
            icon: Radio
        }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="navbar-bilan-main"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0, transition: { type: "spring", stiffness: 82, damping: 24, mass: 1 } }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 82, 
                        damping: 24, 
                        mass: 1
                    }}
                    className="fixed bottom-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-md border-t border-border pb-12 pt-4 px-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                    style={{ willChange: "transform" }}
                >
                     {navItems.map((item, index) => {
                          const isActive = activeTab === item.id;
                          
                          // Mapping colors based on Tab ID — same as MainBottomNav
                          const colorMap: Record<string, string> = {
                              streaming: "var(--dashboard-streaming)",
                              social: "var(--dashboard-social)",
                              radio: "var(--dashboard-radio)"
                          };
                          const activeColor = colorMap[item.id];

                          return (
                              <div 
                                key={item.id} 
                                onClick={() => {
                                    // Scroll to top — same pattern as MainBottomNav/StickyTabsHeader
                                    const scrollContainer = document.getElementById('main-scroll-container');
                                    window.scrollTo(0, 0);
                                    document.documentElement.scrollTop = 0;
                                    document.body.scrollTop = 0;
                                    if (scrollContainer) scrollContainer.scrollTop = 0;
                                    
                                    onTabChange(item.id);
                                }} 
                                className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer relative group transition-all duration-300"
                              >
                                  {/* Soul Shadow / Glow — TAF */}
                                  {isActive && (
                                      <motion.div 
                                         layoutId="bottom-nav-glow-main" 
                                         className="absolute -inset-4 blur-xl rounded-full" 
                                         style={{ backgroundColor: `${activeColor}26` }}
                                         transition={{ duration: 0.3 }} 
                                      />
                                  )}

                                  {/* The Body Icon */}
                                  <item.icon 
                                     className="relative z-10 w-6 h-6 transition-all duration-300" 
                                     style={{ 
                                         color: isActive ? activeColor : "var(--muted-foreground)",
                                         opacity: isActive ? 1 : 0.5,
                                         strokeWidth: isActive ? 2.5 : 2
                                     }}
                                  />

                                  {/* The Soul Label: Transmigrates from DashboardTabsSlot via layoutId */}
                                  <div className="h-[22px] flex items-center justify-center relative overflow-visible">
                                      <motion.span
                                        layoutId={`soul-top-${index}`}
                                        className="text-[12px] font-bold font-manrope whitespace-nowrap"
                                        style={{ 
                                            color: isActive ? activeColor : "var(--muted-foreground)",
                                            zIndex: 9999 
                                        }}
                                        animate={{ 
                                            opacity: isActive ? 1 : 0.3, 
                                            filter: "blur(0px)" 
                                        }}
                                        exit={{ opacity: 1, transition: { duration: 0 } }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 105, 
                                            damping: 18, 
                                            mass: 1
                                        }}
                                      >
                                        {item.label}
                                      </motion.span>
                                  </div>
                                  
                                  {/* Active Underline — TAF */}
                                  {isActive && (
                                      <motion.div 
                                        layoutId="active-underline-main"
                                        className="absolute -bottom-1 w-1 h-1 rounded-full"
                                        style={{ backgroundColor: activeColor }}
                                      />
                                  )}
                              </div>
                          )
                      })}
                </motion.div>
            )}
        </AnimatePresence>
    );
};