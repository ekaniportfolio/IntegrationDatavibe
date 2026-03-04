import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from "motion/react";
import { useTranslation } from "../language-provider";

export interface WeightedStreamsData {
  label: string;
  value: number;
  subtext: string;
}

interface WeightedStreamsCardProps {
  data?: WeightedStreamsData;
}

export function WeightedStreamsCard({ data }: WeightedStreamsCardProps) {
  const { t, language } = useTranslation();
  const label = data?.label || t("dashboard.totalWeightedStreams");
  const value = data?.value ?? 165781;
  const subtext = data?.subtext || t("dashboard.globalVisibilityIndex");
  const formattedValue = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR').format(value);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="content-stretch flex items-center justify-between overflow-hidden px-[14px] py-[20px] relative rounded-[12px] w-full" 
      style={{ 
        backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)" 
      }}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(242,142,66,0.6)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0">
        <p className="font-manrope font-normal relative shrink-0 text-[14px] text-foreground/90">{label}</p>
        <p className="font-manrope font-bold relative shrink-0 text-[24px] text-foreground tracking-tight">{formattedValue}</p>
        <p className="font-manrope font-medium relative shrink-0 text-[12px] text-muted-foreground">{subtext}</p>
      </div>
      
      <div className="bg-[rgba(28,180,91,0.24)] flex h-[48px] w-[48px] items-center justify-center rounded-[12px] shrink-0">
        <TrendingUp className="w-6 h-6 text-[#1CB45B]" />
      </div>
    </motion.div>
  );
}