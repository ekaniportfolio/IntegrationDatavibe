import React from 'react';
import { Megaphone } from "lucide-react";
import { useTranslation } from "../language-provider";

interface MediaCampaignCardProps {
  title?: string;
  description?: string;
}

export function MediaCampaignCard({
  title,
  description
}: MediaCampaignCardProps) {
  const { t } = useTranslation();
  const resolvedTitle = title || t("media.campaignTitle");
  const resolvedDescription = description || t("media.campaignDescription");
  return (
    <div 
      className="flex flex-col gap-[18px] items-start justify-end overflow-hidden px-[14px] py-[20px] relative rounded-[18px] w-full shrink-0"
      style={{ backgroundImage: "linear-gradient(90.7675deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)" }}
    >
      {/* Border Overlay */}
      <div aria-hidden="true" className="absolute border border-[rgba(18,134,243,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />

      {/* Title Row */}
      <div className="flex gap-[8px] items-start relative shrink-0 w-full z-10">
        {/* Icon */}
        <div className="relative shrink-0 size-[18px] flex items-center justify-center">
          <Megaphone className="w-full h-full text-foreground/80" strokeWidth={1.6} />
        </div>
        
        {/* Title Text */}
        <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[14px] text-foreground">
          {resolvedTitle}
        </p>
      </div>

      {/* Description */}
      <p className="font-manrope font-normal leading-tight relative shrink-0 text-[14px] text-foreground max-w-[260px] self-start whitespace-pre-wrap opacity-90 z-10">
        {resolvedDescription}
      </p>
    </div>
  );
}