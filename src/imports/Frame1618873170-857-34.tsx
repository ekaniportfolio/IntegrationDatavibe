import React from 'react';
import { motion } from "motion/react";
import { Users, TrendingUp, Layers, LucideIcon } from 'lucide-react';
import { useTranslation } from "../app/components/language-provider";

export interface SocialStatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const DEFAULT_SOCIAL_STATS: SocialStatItem[] = [
  {
    label: "Abonnés",
    value: "8.3M",
    icon: Users,
    iconBgColor: "rgba(28,180,91,0.2)",
    iconColor: "#1CB45B"
  },
  {
    label: "Évolution",
    value: "115.5K",
    icon: TrendingUp,
    iconBgColor: "rgba(28,180,91,0.2)",
    iconColor: "#1CB45B"
  },
  {
    label: "Nombre de plateforme",
    value: "115.5K",
    icon: Layers,
    iconBgColor: "rgba(28,180,91,0.2)",
    iconColor: "#1CB45B"
  }
];

function StatRow({ label, value, Icon }: { label: string, value: string, Icon: LucideIcon }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[rgba(28,180,91,0.1)] relative rounded-[12px] shrink-0 w-full hover:bg-[rgba(28,180,91,0.2)] transition-colors"
    >
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[14px] py-[20px] relative w-full">
          <div className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 text-white">
            <p className="font-manrope font-normal relative shrink-0 text-[14px]">{label}</p>
            <p className="font-manrope font-bold relative shrink-0 text-[16px]">{value}</p>
          </div>
          <div className="bg-[rgba(28,180,91,0.2)] content-stretch flex h-[43px] items-center justify-center overflow-clip w-[43px] relative rounded-[8px] shrink-0">
             <Icon size={24} color="#1CB45B" />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[0.5px] border-transparent border-solid inset-0 pointer-events-none rounded-[12px]" />
    </motion.div>
  );
}

interface SocialPerformanceOverviewProps {
  stats?: {
    subscribers: string;
    growth: string;
    platforms: string;
  };
}

const DEFAULT_STATS = {
  subscribers: "8.3M",
  growth: "115.5K",
  platforms: "115.5K"
};

export default function Frame1({ stats = DEFAULT_STATS }: SocialPerformanceOverviewProps) {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[18px] w-full backdrop-blur-[5px]" 
      data-name="Overlay+Border+OverlayBlur" 
      style={{ backgroundImage: "linear-gradient(90.782deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)" }}
    >
      <div className="content-stretch flex flex-col gap-[12px] items-start justify-end overflow-clip px-[14px] py-[20px] relative rounded-[inherit] w-full">
        
        {/* Header */}
        <div className="content-stretch flex flex-col items-center relative shrink-0 w-full">
            <div className="content-stretch flex items-center relative shrink-0 w-full">
                <p className="font-manrope font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">{t('dashboard.subscriberAnalysis')}</p>
            </div>
        </div>

        {/* Rows */}
        <StatRow label={t('dashboard.subscribers')} value={stats.subscribers} Icon={Users} />
        <StatRow label={t('dashboard.evolution')} value={stats.growth} Icon={TrendingUp} />
        <StatRow label={t('dashboard.platformCount')} value={stats.platforms} Icon={Layers} />

      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(28,180,91,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </motion.div>
  );
}