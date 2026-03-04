import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "../language-provider";

interface MetricCardProps {
  label: string;
  value: string;
  sentiment: 'positive' | 'negative';
}

function MetricCard({ label, value, sentiment }: MetricCardProps) {
  const isPositive = sentiment === 'positive';
  
  // Dynamic assets based on sentiment
  const iconColor = isPositive ? "#4CAF50" : "#F44336";
  
  return (
    <div className="bg-[rgba(2,13,6,0.5)] hover:bg-[rgba(2,13,6,0.7)] transition-colors content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[12px] relative rounded-[8px] flex-1 min-w-0">
      {/* Header: Value + Icon */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        {/* Value */}
        <div className="content-stretch flex items-center relative shrink-0">
          <p className="font-['Poppins',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[#7b8fa6] text-[24px]">
            {value}
          </p>
        </div>
        
        {/* Icon */}
        <div className="flex items-center justify-center relative shrink-0">
          <div className="flex-none">
            <div className="relative size-[20px] flex items-center justify-center">
               {isPositive ? (
                 <TrendingUp size={20} color={iconColor} strokeWidth={1.67} />
               ) : (
                 <TrendingDown size={20} color={iconColor} strokeWidth={1.67} />
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <p className="font-['Manrope',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-white whitespace-nowrap">
        {label}
      </p>

      {/* Background Glow - Conditional rendering based on sentiment */}
      {isPositive ? (
        <div className="absolute right-[-39.66px] size-[58.791px] top-[-44px]">
          <div className="absolute inset-[-85.05%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 158.791 158.791">
              <g filter="url(#filter_positive)">
                <circle cx="79.3955" cy="79.3955" fill="url(#gradient_positive)" r="29.3955" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="158.791" id="filter_positive" width="158.791" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="25" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="gradient_positive" x1="101.262" x2="65.2089" y1="56.7149" y2="93.2683">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#00FFE1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      ) : (
        <div className="absolute right-[-29.86px] size-[51.986px] top-[-29px]">
          <div className="absolute inset-[-96.18%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 151.986 151.986">
              <g filter="url(#filter_negative)">
                <circle cx="75.993" cy="75.993" fill="url(#gradient_negative)" r="25.993" />
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="151.986" id="filter_negative" width="151.986" x="0" y="0">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                  <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="25" />
                </filter>
                <linearGradient gradientUnits="userSpaceOnUse" id="gradient_negative" x1="95.3282" x2="63.4485" y1="55.9377" y2="88.2601">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#F44336" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export interface MetricData {
  label: string;
  value: string;
  sentiment: 'positive' | 'negative';
}

interface SubscriberAnalysisProps {
  data?: MetricData[];
}

export default function SubscriberAnalysis({ data }: SubscriberAnalysisProps) {
  const { t } = useTranslation();
  const resolvedData = data || [
    { label: t("dashboard.social.engagementRate"), value: "1.7%", sentiment: "positive" as const },
    { label: t("dashboard.social.avgPerLike"), value: "87 K", sentiment: "negative" as const }
  ];
  return (
    <div 
      className="relative rounded-[8px] size-full overflow-hidden" 
      data-name="Analyse des abonnés" 
      style={{ backgroundImage: "linear-gradient(90.782deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)" }}
    >
      <div aria-hidden="true" className="absolute border border-[rgba(28,180,91,0.6)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      
      <div className="content-stretch flex flex-col gap-[12px] items-stretch justify-end overflow-clip px-[14px] py-[20px] relative rounded-[inherit] size-full z-10">
        {/* Title */}
        <div className="content-stretch flex items-center relative w-full">
          <p className="font-['Manrope',sans-serif] font-bold leading-[normal] relative shrink-0 text-[16px] text-white whitespace-pre-wrap">{t('dashboard.social.followerAnalysis')}</p>
        </div>

        {/* Content */}
        <div className="content-stretch flex gap-[10px] items-start relative w-full">
          {resolvedData.map((metric, index) => (
            <MetricCard 
              key={index}
              label={metric.label}
              value={metric.value}
              sentiment={metric.sentiment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}