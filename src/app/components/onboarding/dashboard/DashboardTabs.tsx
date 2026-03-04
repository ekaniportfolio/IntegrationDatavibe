import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../../language-provider";

// TABS constant - labels will be set dynamically via t()
const TAB_IDS = [{ id: "streaming", key: "onboarding.streaming" }, { id: "social", key: "onboarding.social" }, { id: "radio", key: "onboarding.radio" }];

// SEQUENCE constant (only tabs part needed here)
const SEQUENCE = {
    tabs: 0.6,
};

interface DashboardTabsProps {
    isFullDashboard: boolean;
    activeTab: string;
    onTabChange: (id: string) => void;
    isReturning?: boolean;
    isArrivingFromDashboard?: boolean;
}

export const DashboardTabs = ({ isFullDashboard, activeTab, onTabChange, isReturning, isArrivingFromDashboard }: DashboardTabsProps) => {
    const { t } = useTranslation();
    return (
        <AnimatePresence mode="popLayout" initial={true}> {/* Ensures animation runs on mount */}
            {!isFullDashboard ? (
                <motion.div 
                    key="standard-tabs-slot"
                    className="w-full flex px-4 gap-[8px]"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                        hidden: { 
                            gap: "8px"
                        },
                        visible: { 
                            gap: "8px",
                            transition: { 
                                delayChildren: SEQUENCE.tabs, 
                                staggerChildren: 0.1 // Cascade Left -> Right
                            } 
                        },
                        exit: { 
                            transition: { 
                                staggerChildren: 0.05, 
                                staggerDirection: -1 // Reverse order (Right -> Left)
                            } 
                        }
                    }}
                >
                    {TAB_IDS.map((tab, index) => {
                        const tokenMap: Record<string, string> = { streaming: "var(--dashboard-streaming)", social: "var(--dashboard-social)", radio: "var(--dashboard-radio)" };
                        const colorVar = tokenMap[tab.id] || "var(--dashboard-streaming)";
                        const isActive = activeTab === tab.id;
                        return (
                            <motion.div 
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)} 
                                className="relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] cursor-pointer"
                                style={{ backgroundColor: `color-mix(in srgb, ${colorVar}, transparent 90%)`, borderColor: colorVar, borderWidth: '0.5px', borderStyle: 'solid' }}
                                variants={{
                                    hidden: { y: 50, opacity: 0 }, // Always enter from bottom
                                    visible: { 
                                        x: 0, y: 0, opacity: 1, filter: "blur(0px)",
                                        transition: { type: "spring", stiffness: 200, damping: 20 }
                                    },
                                    exit: { 
                                        y: 50, opacity: 0, // Exit to Bottom
                                        filter: "blur(5px)", 
                                        transition: { duration: 0.3 } 
                                    }
                                }}
                            >
                                {isActive && <motion.div layoutId="active-tab-fill" className="absolute inset-0 rounded-[19px] z-0" style={{ backgroundColor: colorVar }} initial={{ filter: "blur(4px)", opacity: 0.8 }} animate={{ filter: "blur(0px)", opacity: 1 }} transition={{ type: "spring", stiffness: 280, damping: 30 }} />}
                                <span className="relative z-10 text-[12.6px] font-manrope font-bold leading-normal whitespace-nowrap text-white">{t(tab.key)}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>
            ) : (
                <motion.div
                    key="full-dashboard-slot"
                    className="w-full flex px-4 gap-[8px]"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={{
                        hidden: { gap: "60px" }, // Initial LARGE GAP
                        visible: { 
                            gap: "8px", // Animate to NORMAL GAP
                            transition: { 
                                gap: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }, 
                                staggerChildren: 0.1, // Enter one by one
                                delayChildren: 0.05
                            } 
                        },
                        exit: { opacity: 0, x: 200, filter: "blur(5px)", transition: { duration: 0.3 } } // Exit to Right on return
                    }}
                >
                    {/* Recreating Frame89 (Orange Buttons) manually to control gap/stagger animation */}
                    {[
                        { label: t('nav.dashboard'), filled: true },
                        { label: t('nav.activity'), filled: false },
                        { label: t('nav.songs'), filled: false }
                    ].map((btn, i) => (
                         <motion.div 
                            key={i}
                            className={`relative flex-1 flex items-center justify-center h-[26px] rounded-[19px] ${btn.filled ? 'bg-dashboard-tab-active-bg' : 'bg-dashboard-tab-inactive-bg'}`}
                            variants={{
                                hidden: { x: 300, opacity: 0, filter: "blur(8px)" }, // Enter from right
                                visible: { x: 0, opacity: 1, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 20 } }
                            }}
                        >
                            {/* Border for non-filled items */}
                            <div aria-hidden="true" className="absolute border-[#ff5222] border-[0.5px] border-solid inset-0 pointer-events-none rounded-[19px]" />
                            <span className="relative z-10 text-[12.6px] font-manrope font-bold leading-normal whitespace-nowrap text-white">{btn.label}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};