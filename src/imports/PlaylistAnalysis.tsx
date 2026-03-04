import React from 'react';
import { motion } from "motion/react";

export interface PlaylistBreakdownItem {
  label: string;
  mainValue: string;
  subValue: string;
  isPercentMain: boolean;
}

export interface PlaylistGlobalStat {
  label: string;
  value: string;
}

const DEFAULT_BREAKDOWN_DATA: PlaylistBreakdownItem[] = [
  { 
    label: "Top 25%", 
    mainValue: "37%", 
    subValue: "60 playlists",
    isPercentMain: true
  },
  { 
    label: "Milieu", 
    mainValue: "69", 
    subValue: "42%",
    isPercentMain: false
  },
  { 
    label: "Bas", 
    mainValue: "21%", 
    subValue: "35 playlists",
    isPercentMain: true
  }
];

const DEFAULT_GLOBAL_STATS: PlaylistGlobalStat[] = [
  { label: "Nombre de playlists", value: "195" },
  { label: "Plateforme", value: "2/6" }
];

interface PlaylistAnalysisProps {
  breakdownData?: PlaylistBreakdownItem[];
  globalStats?: PlaylistGlobalStat[];
}

export default function PlaylistAnalysis({ breakdownData = DEFAULT_BREAKDOWN_DATA, globalStats = DEFAULT_GLOBAL_STATS }: PlaylistAnalysisProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[18px] w-full"
      style={{ backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)" }}
    >
      <div className="flex flex-col gap-[12px] p-[20px] px-[14px] w-full h-full relative z-10">
        
        {/* Header */}
        <div className="flex items-center w-full">
          <h3 className="font-manrope font-bold text-[16px] text-white">Analyse des playlists</h3>
        </div>

        {/* Distribution Row */}
        <div className="flex gap-[12px] w-full">
          {breakdownData.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.1) }}
              className="bg-[rgba(242,142,66,0.1)] flex-1 rounded-[12px] p-[14px] py-[20px] flex flex-col items-center justify-center gap-[6px] hover:bg-[rgba(242,142,66,0.2)] transition-colors"
            >
              <p className="font-manrope font-normal text-[14px] text-white/90">{item.label}</p>
              <p className="font-manrope font-bold text-[18px] text-white">{item.mainValue}</p>
              <p className="font-manrope font-medium text-[#1cb45b] text-[10px] bg-[#1cb45b]/10 px-2 py-0.5 rounded-full">
                {item.subValue}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Row */}
        <div className="flex gap-[12px] w-full">
          {globalStats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="bg-[rgba(242,142,66,0.1)] flex-1 rounded-[12px] p-[14px] py-[20px] flex flex-col items-center justify-center gap-[6px] hover:bg-[rgba(242,142,66,0.2)] transition-colors"
            >
              <p className="font-manrope font-normal text-[14px] text-white/90">{stat.label}</p>
              <p className="font-manrope font-bold text-[18px] text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* Border overlay */}
      <div aria-hidden="true" className="absolute border border-[rgba(242,142,66,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </motion.div>
  );
}
