import { motion, AnimatePresence, animate } from "motion/react";
import { LayoutDashboard, Activity, Music } from "lucide-react";
import { useTranslation } from "../language-provider";

interface StickyBottomNavProps {
    activeTab: string;
    onTabChange: (id: string) => void;
    isVisible: boolean;
}

/**
 * TAF (Transmigrated Astral Flow) Protocol:
 * 1. Souls (labels) must be strictly identical in layoutId to match the header "bodies".
 * 2. Color transformation: Souls take the color of their destination body (Purple when active).
 * 3. Rectilinear motion: No arbitrary offsets, only spring-based transmigration.
 * 4. Ethereal state: Opacity 0.4 and Blur 12px during the jump (managed by Framer Motion).
 */
export const StreamingBottomNav = ({ activeTab, onTabChange, isVisible }: StickyBottomNavProps) => {
    const { t } = useTranslation();
    const navItems = [
        { 
            id: "dashboard", 
            label: t('nav.dashboard'), 
            icon: LayoutDashboard
        }, 
        { 
            id: "performance", 
            label: t('nav.activity'), 
            icon: Activity
        }, 
        { 
            id: "playlists", 
            label: t('nav.songs'), 
            icon: Music
        }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="navbar-streaming"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
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
                          
                          return (
                              <div 
                                key={item.id} 
                                onClick={() => {
                                    const scrollContainer = document.getElementById('main-scroll-container');
                                    
                                    // Instant scroll
                                    window.scrollTo(0, 0);
                                    document.documentElement.scrollTop = 0;
                                    document.body.scrollTop = 0;
                                    if (scrollContainer) scrollContainer.scrollTop = 0;
                                    
                                    onTabChange(item.id);
                                }} 
                                className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer relative group transition-all duration-300"
                              >
                                  {/* Soul Shadow / Glow */}
                                  {isActive && (
                                      <motion.div 
                                         layoutId="bottom-nav-glow-streaming" 
                                         className="absolute -inset-4 bg-dashboard-streaming/15 blur-xl rounded-full" 
                                         transition={{ duration: 0.3 }} 
                                      />
                                  )}

                                  {/* The Body Icon: Changes color and opacity based on state */}
                                  <item.icon 
                                     className={`relative z-10 w-6 h-6 transition-all duration-300 ${isActive ? 'text-dashboard-streaming opacity-100' : 'text-muted-foreground opacity-50 hover:opacity-100'}`} 
                                     strokeWidth={isActive ? 2.5 : 2}
                                  />

                                  {/* The Soul Label: Transmigrates from Header */}
                                  <div className="h-[22px] flex items-center justify-center relative overflow-visible">
                                      <motion.span
                                        layoutId={`soul-sub-${index}`}
                                        className={`text-[12px] font-bold font-manrope whitespace-nowrap ${isActive ? 'text-dashboard-streaming' : 'text-muted-foreground hover:text-foreground'}`}
                                        animate={{ 
                                            opacity: isActive ? 1 : 0.3, 
                                            filter: "blur(0px)" 
                                        }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 105, 
                                            damping: 18, 
                                            mass: 1
                                        }}
                                        style={{ zIndex: 9999 }}
                                      >
                                        {item.label}
                                      </motion.span>
                                  </div>
                                  
                                  {/* Active Underline (Optional but helps clarity) */}
                                  {isActive && (
                                      <motion.div 
                                        layoutId="active-underline-streaming"
                                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-dashboard-streaming"
                                      />
                                  )}
                              </div>
                          )
                      })}
                </motion.div>
            )}
        </AnimatePresence>
    )
}