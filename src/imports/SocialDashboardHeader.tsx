import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../app/components/language-provider";

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        filter: "blur(12px)"
    }),
    center: {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        filter: "blur(12px)",
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    })
};

const TAB_TITLE_KEYS: Record<string, string> = {
    dashboard: "dashboard.tabDashboard",
    subscribers: "dashboard.tabSubscribers",
    demographics: "dashboard.tabDemographics",
    default: "dashboard.tabDashboard"
};

interface SocialDashboardHeaderProps {
  activeTab?: string;
  direction?: number;
}

export default function SocialDashboardHeader({ activeTab = "dashboard", direction = 0 }: SocialDashboardHeaderProps) {
  const { t } = useTranslation();
  const title = t(TAB_TITLE_KEYS[activeTab] || TAB_TITLE_KEYS.default);

  return (
    <div className="flex flex-col gap-[2px] px-1 w-full relative overflow-hidden items-center">
      <div className="w-full">
         <h2 className="font-manrope font-bold text-[22px] text-white text-center leading-tight">{t("dashboard.sectionSocial")}</h2>
      </div>
      
      <div className="relative h-[24px] w-full">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.p
                key={activeTab}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="font-manrope font-normal absolute w-full text-[14px] text-center text-white/80 leading-tight"
            >
                {title}
            </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}