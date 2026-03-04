import React from 'react';
import { motion } from "motion/react";
import { Headphones, Eye, Music, LucideIcon } from "lucide-react";
import { useTranslation } from "../app/components/language-provider";

export interface PerformanceItem {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface PerformanceOverviewProps {
  data?: PerformanceItem[];
}

export default function PerformanceOverview({ data }: PerformanceOverviewProps) {
  const { t } = useTranslation();
  const resolvedData = data || [
    {
      label: t("dashboard.uniqueMonthlyListeners"),
      value: "113,1K",
      icon: Headphones,
      color: "#FF5222",
      bg: "rgba(255,82,34,0.2)"
    },
    {
      label: t("dashboard.avgMonthlyViews"),
      value: "792,4K",
      icon: Eye,
      color: "#FF5222",
      bg: "rgba(255,82,34,0.2)"
    },
    {
      label: t("dashboard.weightedStreamsTotal"),
      value: "165,8K",
      icon: Music,
      color: "#FF5222",
      bg: "rgba(255,82,34,0.2)"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[24px] w-full overflow-hidden"
      style={{ 
        backgroundImage: "linear-gradient(180.497deg, rgba(112, 56, 255, 0.4) 0.37955%, rgba(45, 30, 255, 0.4) 181.11%)",
        border: "0.5px solid rgba(25,19,200,0.1)"
      }}
    >
      <div className="flex flex-col gap-[12px] p-[20px] px-[14px]">
        <div className="flex items-center w-full">
          <h3 className="font-manrope font-bold text-[16px] text-white">{t('dashboard.performanceOverview')}</h3>
        </div>

        <div className="flex flex-col gap-[12px]">
          {resolvedData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(6,2,13,0.5)] rounded-[12px] p-[14px] py-[20px] flex items-center justify-between hover:bg-[rgba(6,2,13,0.7)] transition-colors"
            >
              <div className="flex flex-col gap-[6px] text-white">
                <p className="font-manrope font-normal text-[14px] opacity-90">{item.label}</p>
                <p className="font-manrope font-bold text-[16px]">{item.value}</p>
              </div>
              
              <div 
                className="h-[43px] w-[43px] flex items-center justify-center rounded-[8px] shrink-0"
                style={{ backgroundColor: item.bg }}
              >
                <item.icon size={24} color={item.color} strokeWidth={1.5} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}