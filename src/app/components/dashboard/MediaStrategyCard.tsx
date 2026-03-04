import React from 'react';
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "../language-provider";

interface MediaStrategyCardProps {
  title?: string;
  description?: string;
  followerGoal?: string;
  stations?: string[];
}

export function MediaStrategyCard({
  title,
  description,
  followerGoal = "+1k",
  stations = ["BBC Introducing", "Soulection Radio"]
}: MediaStrategyCardProps) {
  const { t } = useTranslation();
  const displayTitle = title || t("media.strategy.title");
  const displayDescription = description || t("media.strategy.description");
  return (
    <div 
      className="flex flex-col gap-[18px] items-start justify-end overflow-hidden px-[14px] py-[20px] relative rounded-[18px] w-full"
      style={{ backgroundImage: "linear-gradient(90.7675deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)" }}
    >
      {/* Border Overlay */}
      <div aria-hidden="true" className="absolute border border-[rgba(18,134,243,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />

      {/* Top Section */}
      <div className="flex flex-col gap-[8px] items-center relative shrink-0 w-full z-10">
        {/* Title */}
        <div className="flex items-center relative shrink-0 w-full">
          <p className="font-manrope font-bold leading-[normal] relative shrink-0 text-[16px] text-foreground w-full whitespace-pre-wrap">
            {displayTitle}
          </p>
        </div>
        
        {/* Description */}
        <p className="font-manrope font-normal leading-tight relative shrink-0 text-[14px] text-foreground max-w-[260px] self-start whitespace-pre-wrap opacity-90">
          {displayDescription}
        </p>
        
        {/* Goals Section */}
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-2">
          <div className="flex gap-[12px] items-center relative shrink-0">
            <p className="font-manrope font-medium leading-[normal] not-italic relative shrink-0 text-[20px] text-foreground">
              {followerGoal}
            </p>
            <div className="relative shrink-0 size-[20px] flex items-center justify-center">
              <TrendingUp className="w-full h-full text-foreground" strokeWidth={1.67} />
            </div>
          </div>
          <p className="font-manrope font-normal leading-[normal] min-w-full relative shrink-0 text-[12px] uppercase text-foreground/80 w-[min-content] whitespace-pre-wrap">
            {t("media.strategy.followerGoals")}
          </p>
        </div>
      </div>

      {/* Bottom Section (Social Proof) */}
      <div className="flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 text-foreground w-full whitespace-pre-wrap mt-2 z-10">
        <p className="font-manrope font-bold relative shrink-0 text-[16px] w-full">
          {t("media.strategy.socialProof")}
        </p>
        <div className="flex flex-col font-manrope font-normal gap-[8px] items-start relative shrink-0 text-[14px] w-full text-foreground/80">
          {stations.map((station, index) => (
            <p key={index} className="relative shrink-0 w-full">
              {station}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}