import React from 'react';
import { motion } from "motion/react";
import { useTranslation } from "../language-provider";

export interface StationData {
  name: string;
  plays: number;
  percentage: number;
  trend: 'neutral' | 'positive' | 'negative';
}

const DEFAULT_STATIONS_DATA: StationData[] = [
  { 
    name: "Nostalgie FM", 
    plays: 40, 
    percentage: 85.1, 
    trend: "neutral" 
  },
  { 
    name: "Radio Afrique", 
    plays: 4, 
    percentage: 8.5, 
    trend: "positive"
  },
  { 
    name: "Panique à la radio", 
    plays: 1, 
    percentage: 2.1, 
    trend: "negative"
  },
  { 
    name: "UFM (Ultima Radio)", 
    plays: 1, 
    percentage: 2.1, 
    trend: "neutral"
  },
  { 
    name: "Guadeloupe La 1ère", 
    plays: 1, 
    percentage: 2.1, 
    trend: "neutral"
  },
];

interface RadioStationDistributionProps {
  data?: StationData[];
}

export function RadioStationDistribution({ data = DEFAULT_STATIONS_DATA }: RadioStationDistributionProps) {
  const { t } = useTranslation();
  const getTrendColor = (trend: StationData['trend']) => {
    switch (trend) {
      case 'positive': return 'text-[#30b77c]';
      case 'negative': return 'text-[#ff2222]';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="w-full bg-[rgba(2,8,13,0.5)] border-[0.5px] border-[rgba(2,8,13,0.5)] backdrop-blur-sm rounded-[10px] p-5 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="font-manrope font-normal text-[14px] text-foreground/90">
          {t('dashboard.radioDistributionDesc')}
        </h3>
      </div>

      {/* Table Content */}
      <div className="flex flex-col gap-2 w-full">
        {/* Header Row - Aligned with Cards */}
        <div className="flex items-center justify-between px-[14px] text-[14px] text-foreground/80 font-manrope mb-1">
          <div className="text-left">{t('dashboard.station')}</div>
          <div className="flex items-center gap-6">
            <div className="w-[40px] text-center">{t('dashboard.plays')}</div>
            <div className="w-[50px] text-right">{t('dashboard.share')}</div>
          </div>
        </div>

        {/* Data Rows - Card Style */}
        <div className="flex flex-col gap-3 w-full">
          {data.map((station, index) => (
            <motion.div 
              key={station.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(2,8,13,0.5)] border-[0.5px] border-[rgba(2,8,13,0.5)] rounded-[12px] w-full p-[14px] hover:bg-[rgba(2,8,13,0.7)] transition-colors"
            >
              <div className="flex items-center justify-between gap-4 w-full">
                 {/* Name */}
                 <div className="flex-1 min-w-0 flex flex-col items-start">
                   <span className="font-manrope font-normal text-[14px] text-foreground truncate w-full" title={station.name} translate="no">
                     {station.name}
                   </span>
                 </div>

                 {/* Stats Group */}
                 <div className="flex items-center gap-6 shrink-0">
                   <div className={`w-[40px] text-center font-bold font-manrope text-[14px] ${getTrendColor(station.trend)}`}>
                     {station.plays}
                   </div>
                   <div className={`w-[50px] text-right font-medium font-manrope text-[14px] ${getTrendColor(station.trend)}`}>
                     {station.percentage}%
                   </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}