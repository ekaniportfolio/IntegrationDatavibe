import React from 'react';
import { motion } from "motion/react";
import { Music } from "lucide-react";
import { useTranslation } from "../language-provider";

export interface SongPerformance {
  id: number | string;
  title: string;
  date: string;
  streams: number;
  growth: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const SongIcon = () => (
  <div className="relative shrink-0 size-[16px] flex items-center justify-center">
      <Music className="w-full h-full text-[#30B77C]" />
  </div>
);

interface LatestPerformanceCardProps {
  advice?: string;
  data?: SongPerformance[];
}

export function LatestPerformanceCard({ advice, data }: LatestPerformanceCardProps) {
  const { t } = useTranslation();
  const resolvedData = data || [
    { id: 1, title: t('songs.song1Title'), date: t('songs.song1Date'), streams: 36600, growth: -31.1 },
    { id: 2, title: t('songs.song2Title'), date: t('songs.song2Date'), streams: 20000, growth: -9.3 },
    { id: 3, title: t('songs.song3Title'), date: t('songs.song3Date'), streams: 1500, growth: -11.9 },
    { id: 4, title: t('songs.song4Title'), date: t('songs.song4Date'), streams: 4400000, growth: -99.0 },
  ];
  const displayAdvice = advice || t('dashboard.songAdvice');
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-start justify-end overflow-hidden px-[14px] py-[20px] relative rounded-[18px] size-full w-full" style={{ backgroundImage: "linear-gradient(90.7768deg, rgba(255, 82, 34, 0.1) 1.5047%, rgba(242, 142, 66, 0.2) 98.378%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(242,142,66,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />
      
      {/* Header & Advice */}
      <div className="flex flex-col gap-[8px] items-center relative shrink-0 w-full">
        <div className="flex items-center relative shrink-0 w-full">
           <p className="font-manrope font-bold leading-[normal] relative shrink-0 text-[16px] text-foreground w-full whitespace-pre-wrap">{t('dashboard.latestPerformance')}</p>
        </div>
        {/* Compact Text Logic: max-w-[260px] and self-start to keep it compact and aligned */}
        <p className="font-manrope font-normal text-[14px] text-foreground/90 max-w-[260px] self-start leading-tight">
          {displayAdvice}
        </p>
      </div>

      {/* Table Headers */}
      <div className="flex flex-col h-[19px] items-center justify-between relative shrink-0 w-full mt-2">
         <div className="flex font-manrope font-normal items-center justify-between leading-[normal] relative shrink-0 text-[14px] text-center text-foreground/70 w-full">
            <p className="relative shrink-0 w-[30%] text-left">{t('dashboard.song')}</p>
            <p className="relative shrink-0 w-[35%] text-center">{t('dashboard.date')}</p>
            <p className="relative shrink-0 w-[35%] text-right notranslate" translate="no">Streaming</p> 
         </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        {resolvedData.map((song, index) => (
            <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[rgba(242,142,66,0.1)] relative rounded-[12px] shrink-0 w-full overflow-hidden hover:bg-[rgba(242,142,66,0.2)] transition-colors"
            >
                <div className="flex flex-row items-center justify-between px-[14px] py-[12px] relative w-full">
                    {/* Song Name & Icon */}
                    <div className="flex gap-[8px] items-center justify-start relative shrink-0 w-[30%] overflow-hidden">
                        <SongIcon />
                        <div className="flex flex-col items-start relative shrink-0 overflow-hidden min-w-0">
                            <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[14px] text-foreground truncate w-full">{song.title}</p>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col items-center justify-center relative shrink-0 w-[35%]">
                        <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[12px] text-foreground whitespace-nowrap">{song.date}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-col font-manrope font-normal gap-[6px] items-end justify-center leading-[normal] relative shrink-0 w-[35%]">
                        <p className="relative shrink-0 text-[14px] text-foreground">{formatNumber(song.streams)}</p>
                        <p className={`relative shrink-0 text-[8px] ${song.growth >= 0 ? 'text-[#30b77c]' : 'text-[#f44336]'}`}>{song.growth}%</p>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>

    </div>
  );
}