import React from 'react';
import { Radio } from "lucide-react";
import { useTranslation } from "../language-provider";

interface MediaActionCardProps {
  text?: string;
}

export function MediaActionCard({ 
  text
}: MediaActionCardProps) {
  const { t } = useTranslation();
  const resolvedText = text || t("media.submitToRadio");
  return (
    <div className="bg-[#02080D]/50 flex flex-col items-start justify-center overflow-hidden px-[14px] py-[20px] relative rounded-[16px] w-full min-h-[60px]">
      {/* Background Effect */}
      <div className="absolute right-[-18px] w-[64px] h-[64px] top-[-16px] pointer-events-none">
        <div className="absolute inset-[-78.13%]">
          <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 164 164">
            <g filter="url(#filter0_f_844_705_action)">
              <circle cx="82" cy="82" fill="url(#paint0_linear_844_705_action)" r="32" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="164" id="filter0_f_844_705_action" width="164" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_844_705_action" stdDeviation="25" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_844_705_action" x1="110.149" x2="42.9122" y1="59.4494" y2="69.4355">
                <stop stopColor="#FF2D15" />
                <stop offset="0.653846" stopColor="#0157FC" />
                <stop offset="0.817308" stopColor="#0157FC" />
                <stop offset="0.980769" stopColor="#030923" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-[12px] items-center relative z-10 w-full">
        {/* Icon */}
        <div className="h-[20px] relative shrink-0 w-[18px] flex items-center justify-center">
          <Radio className="w-full h-full text-foreground/80" strokeWidth={1.6} />
        </div>
        
        {/* Text */}
        <p className="font-manrope font-normal leading-normal text-[14px] text-foreground/90 whitespace-pre-wrap">
          {resolvedText}
        </p>
      </div>
    </div>
  );
}