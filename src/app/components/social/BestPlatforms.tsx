import React from "react";
import { motion } from "motion/react";
import { useTranslation } from "../language-provider";

export interface BestPlatformData {
  id: string;
  name: string;
  subscribers: number;
  growth: number;
}

const DEFAULT_DATA: BestPlatformData[] = [
  { id: "spotify", name: "Spotify", subscribers: 372000, growth: 12.5 },
  { id: "apple", name: "Apple Music", subscribers: 250000, growth: 8.2 },
  { id: "amazon", name: "Amazon Music", subscribers: 180000, growth: -6.4 },
  { id: "youtube", name: "YouTube", subscribers: 120000, growth: 5.1 },
  { id: "tidal", name: "Tidal", subscribers: 80000, growth: 3.8 },
];

const getGrowthColor = (growth: number) => {
  if (growth < 0) return "text-[#ff2222]"; // Red for negative
  if (growth >= 10) return "text-[#30b77c]"; // Green for high growth
  return "text-white"; // White for moderate growth
};

interface BestPlatformsProps {
  data?: BestPlatformData[];
  advice?: string;
}

export default function BestPlatforms({ data = DEFAULT_DATA, advice }: BestPlatformsProps) {
  const { t, language } = useTranslation();
  const displayAdvice = advice || t('dashboard.socialAdvice');
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR').format(num);
  };
  return (
    <div 
      className="content-stretch flex flex-col gap-[18px] items-start justify-end overflow-hidden px-[16px] py-[20px] relative rounded-[8px] w-full" 
      data-name="Meilleures plateformes" 
      style={{ backgroundImage: "linear-gradient(90.782deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)" }}
    >
      {/* Border Overlay */}
      <div aria-hidden="true" className="absolute border border-[rgba(28,180,91,0.6)] border-solid inset-0 pointer-events-none rounded-[8px]" />

      {/* Header & Advice */}
      <div className="flex flex-col gap-[8px] items-center relative shrink-0 w-full z-10">
        <div className="flex items-center relative shrink-0 w-full">
          <p className="font-['Manrope'] font-bold text-[16px] text-white w-full">
            {t('dashboard.bestPlatforms')}
          </p>
        </div>
        <p className="font-['Manrope'] font-normal text-[14px] text-white/90 max-w-[260px] self-start leading-tight">
          {displayAdvice}
        </p>
      </div>

      {/* Table Header */}
      <div className="flex flex-col h-[19px] items-center justify-between relative shrink-0 w-full mt-2 z-10">
        <div className="flex items-center justify-between w-full text-[14px] text-white/70 font-['Manrope']">
          <p className="w-[30%] text-left">{t('dashboard.platform')}</p>
          <p className="w-[35%] text-center">{t('dashboard.subscribers')}</p>
          <p className="w-[35%] text-right">{t('dashboard.evolution')}</p>
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-[10px] w-full z-10">
        {data.map((platform, index) => (
          <motion.div 
            key={platform.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[rgba(28,180,91,0.1)] relative rounded-[8px] shrink-0 w-full overflow-hidden hover:bg-[rgba(28,180,91,0.2)] transition-colors"
          >
            <div className="flex flex-row items-center justify-between px-[14px] py-[12px] w-full">
              {/* Name */}
              <div className="w-[30%] flex items-start">
                <p className="font-['Manrope'] font-normal text-[14px] text-white truncate" translate="no">
                  {platform.name}
                </p>
              </div>

              {/* Subscribers */}
              <div className="w-[35%] flex justify-center">
                <p className="font-['Manrope'] font-normal text-[14px] text-white">
                  {formatNumber(platform.subscribers)}
                </p>
              </div>

              {/* Growth */}
              <div className="w-[35%] flex justify-end">
                <div className={`flex items-center gap-1 ${getGrowthColor(platform.growth)}`}>
                   <p className="font-['Manrope'] font-normal text-[14px]">
                    {Math.abs(platform.growth)}%
                  </p>
                  <span className="text-[10px]">{platform.growth > 0 ? '+' : '-'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}