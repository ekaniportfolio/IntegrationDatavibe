import React from 'react';
import { motion } from "motion/react";
import { Share2, Heart, MessageCircle, LucideIcon } from "lucide-react";
import { useTranslation } from "../app/components/language-provider";

export interface EngagementItem {
  labelKey: string;
  value: string;
  icon: LucideIcon;
  delay: number;
}

const DEFAULT_ENGAGEMENT_DATA: EngagementItem[] = [
  {
    labelKey: "figma.social.engagementRate",
    value: "1.7%",
    icon: Share2,
    delay: 0.1
  },
  {
    labelKey: "figma.social.avgLikesPerPost",
    value: "114,3 K",
    icon: Heart,
    delay: 0.2
  },
  {
    labelKey: "figma.social.avgCommentsPerPost",
    value: "1,3 K",
    icon: MessageCircle,
    delay: 0.3
  }
];

interface SocialEngagementCardProps {
  data?: EngagementItem[];
}

export default function SocialEngagementCard({ data = DEFAULT_ENGAGEMENT_DATA }: SocialEngagementCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[24px] w-full overflow-hidden backdrop-blur-[5px] border border-[rgba(28,180,91,0.6)]"
      style={{ backgroundImage: "linear-gradient(90.782deg, rgba(28, 180, 91, 0.1) 1.8236%, rgba(16, 185, 129, 0.2) 98.176%)" }}
    >
      <div className="flex flex-col gap-[12px] p-[20px] px-[14px]">
        <div className="flex items-center w-full">
          <h3 className="font-manrope font-bold text-[16px] text-white">{t('figma.social.engagementDemographics')}</h3>
        </div>

        <div className="flex flex-col gap-[12px]">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="bg-[rgba(28,180,91,0.1)] border-transparent border-[0.5px] rounded-[12px] p-[14px] py-[20px] flex items-center justify-between hover:bg-[rgba(28,180,91,0.2)] transition-colors"
            >
              <div className="flex flex-col gap-[6px] text-dashboard-social-card-text">
                <p className="font-manrope font-normal text-[14px] opacity-90">{t(item.labelKey)}</p>
                <p className="font-manrope font-bold text-[16px]">{item.value}</p>
              </div>
              
              <div className="bg-dashboard-icon-bg-social h-[43px] w-[43px] flex items-center justify-center rounded-[8px] shrink-0 text-dashboard-social">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}