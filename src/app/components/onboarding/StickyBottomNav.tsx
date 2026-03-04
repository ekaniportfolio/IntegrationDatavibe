import { motion, AnimatePresence, animate } from "motion/react";
import svgPaths from "../../../imports/svg-fuzyf2f6co";
import streamSvgPaths from "../../../imports/svg-fpph63m29f";
import { useTranslation } from "../language-provider";

interface StickyBottomNavProps {
    activeTab: string;
    onTabChange: (id: string) => void;
    isVisible: boolean;
}

export const StickyBottomNav = ({ activeTab, onTabChange, isVisible }: StickyBottomNavProps) => {
    const { t } = useTranslation();
    const items = [
        { 
            id: "streaming", 
            label: t('onboarding.streaming'), 
            paths: [streamSvgPaths.p20e50b00],
            isMultiPath: false,
            viewBox: "0 0 24 24" 
        }, 
        { 
            id: "social", 
            label: t('onboarding.social'), 
            paths: [svgPaths.p263d4a80],
            isMultiPath: false,
            viewBox: "0 0 20 20"
        }, 
        { 
            id: "radio", 
            label: t('onboarding.radio'), 
            paths: [svgPaths.p19022800],
            isMultiPath: false,
            viewBox: "0 0 20 20"
        }, 
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="spacer"
                    initial={{ height: 0 }}
                    animate={{ height: 96 }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full shrink-0"
                />
            )}
            {isVisible && (
                <motion.div
                    key="navbar"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 w-full z-[100] bg-background border-t border-border pb-8 pt-4 px-12 flex justify-between items-center shadow-2xl"
                    style={{ willChange: "transform" }}
                >
                     {[
                        { 
                            id: "streaming", 
                            label: t('onboarding.streaming'), 
                            paths: [
                                "M3 4.75C3 3.7835 3.7835 3 4.75 3H6.5C7.4665 3 8.25 3.7835 8.25 4.75V6.5C8.25 7.4665 7.4665 8.25 6.5 8.25H4.75C3.7835 8.25 3 7.4665 3 6.5V4.75Z",
                                "M11.75 4.75C11.75 3.7835 12.5335 3 13.5 3H15.25C16.2165 3 17 3.7835 17 4.75V6.5C17 7.4665 16.2165 8.25 15.25 8.25H13.5C12.5335 8.25 11.75 7.4665 11.75 6.5V4.75Z",
                                "M3 13.5C3 12.5335 3.7835 11.75 4.75 11.75H6.5C7.4665 11.75 8.25 12.5335 8.25 13.5V15.25C8.25 16.2165 7.4665 17 6.5 17H4.75C3.7835 17 3 16.2165 3 15.25V13.5Z",
                                "M11.75 13.5C11.75 12.5335 12.5335 11.75 13.5 11.75H15.25C16.2165 11.75 17 12.5335 17 13.5V15.25C17 16.2165 16.2165 17 15.25 17H13.5C12.5335 17 11.75 16.2165 11.75 15.25V13.5Z"
                            ],
                            viewBox: "0 0 20 20",
                            type: "stroke",
                            strokeWidth: "1.67"
                        }, 
                        { 
                            id: "social", 
                            label: t('onboarding.social'), 
                            paths: ["M1 7.56412H5L8 14.1282L12 1.00001L15 7.56412H19"],
                            viewBox: "0 0 20 15.1282",
                            type: "stroke",
                            strokeWidth: "2"
                        }, 
                        { 
                            id: "radio", 
                            label: t('onboarding.radio'), 
                            paths: ["M0 2.50007V4.16679C0.456875 4.16679 1.12979 4.46413 1.73542 5.03348C2.34033 5.6035 2.65625 6.23685 2.65625 6.66686H4.42708C4.42708 6.23685 4.743 5.6035 5.34792 5.03348C5.95354 4.46413 6.62646 4.16679 7.08333 4.16679V2.50007C6.62646 2.50007 5.95354 2.20273 5.34792 1.63338C4.74371 1.0627 4.42708 0.429346 4.42708 0H2.65625C2.65625 0.430013 2.34033 1.06336 1.73542 1.63338C1.12979 2.20273 0.456875 2.50007 0 2.50007ZM9.5625 2.66674H11.1562C12.7061 2.66674 14.1925 3.24622 15.2884 4.2777C16.3843 5.30918 17 6.70817 17 8.16691H15.2292C15.2292 7.17902 14.8241 6.22924 14.0983 5.51565C13.3725 4.80205 12.3819 4.37975 11.3333 4.33679V12.8337C11.3332 13.5267 11.0916 14.2006 10.6455 14.7519C10.1994 15.3032 9.57344 15.7016 8.86366 15.8859C8.15389 16.0703 7.39946 16.0304 6.71609 15.7723C6.03273 15.5143 5.45815 15.0525 5.08048 14.4576C4.70281 13.8627 4.54291 13.1676 4.62529 12.4789C4.70768 11.7903 5.0278 11.146 5.53657 10.6451C6.04533 10.1441 6.71465 9.81408 7.44187 9.70555C8.16908 9.59703 8.91404 9.71603 9.5625 10.0443V2.66674ZM7.96875 11.3337C8.39144 11.3337 8.79682 11.4917 9.0957 11.773C9.39459 12.0543 9.5625 12.4359 9.5625 12.8337C9.5625 13.2315 9.39459 13.6131 9.0957 13.8944C8.79682 14.1757 8.39144 14.3338 7.96875 14.3338C7.54606 14.3338 7.14068 14.1757 6.8418 13.8944C6.54291 13.6131 6.375 13.2315 6.375 12.8337C6.375 12.4359 6.54291 12.0543 6.8418 11.773C7.14068 11.4917 7.54606 11.3337 7.96875 11.3337Z"],
                            viewBox: "0 0 17 16",
                            type: "fill",
                            strokeWidth: "0"
                        }
                     ].map((item) => {
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
                                className="flex flex-col items-center gap-1.5 cursor-pointer relative group"
                             >
                                 {isActive && (
                                     <motion.div 
                                        layoutId="bottom-nav-glow" 
                                        className="absolute -inset-4 bg-chart-5/10 blur-xl rounded-full" 
                                        transition={{ duration: 0.3 }} 
                                     />
                                 )}
                                 <svg width="24" height="24" viewBox={item.viewBox} fill="none" className={`relative z-10 ${isActive ? 'text-chart-5' : 'text-[#B5B5B5]'}`}>
                                     {item.paths.map((d, i) => (
                                         <path 
                                            key={i} 
                                            d={d} 
                                            fill={item.type === "fill" ? "currentColor" : "none"}
                                            stroke={item.type === "stroke" ? "currentColor" : "none"}
                                            strokeWidth={item.strokeWidth}
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            fillRule={item.type === "fill" ? "evenodd" : undefined}
                                            clipRule={item.type === "fill" ? "evenodd" : undefined}
                                         />
                                     ))}
                                 </svg>
                                 <span className={`text-[11px] font-medium font-manrope relative z-10 transition-all duration-300 ${isActive ? 'text-chart-5 opacity-100' : 'text-[#B5B5B5] opacity-50 hover:opacity-100'}`}>
                                     {item.label}
                                 </span>
                             </div>
                         )
                     })}
                </motion.div>
            )}
        </AnimatePresence>
    )
}