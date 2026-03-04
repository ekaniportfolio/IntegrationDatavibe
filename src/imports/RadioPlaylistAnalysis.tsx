import React from 'react';
import { motion } from "motion/react";
import { useTranslation } from "../app/components/language-provider";

export interface RotationItem {
  label: string;
  value: string;
  subValue: string;
  color: string;
}

interface RadioPlaylistAnalysisProps {
  data?: RotationItem[];
}

export default function RadioPlaylistAnalysis({ data }: RadioPlaylistAnalysisProps) {
  const { t } = useTranslation();
  const resolvedData = data || [
    { label: t("dashboard.radio.highRotation"), value: "12", subValue: t("dashboard.sectionMedia"), color: "#4CAF50" },
    { label: t("dashboard.radio.mediumRotation"), value: "8", subValue: t("dashboard.sectionMedia"), color: "#FFC107" },
    { label: t("dashboard.radio.lowRotation"), value: "34", subValue: t("dashboard.sectionMedia"), color: "#F44336" }
  ];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-[rgba(255,61,61,0.4)] relative rounded-[18px] w-full to-[rgba(203,12,12,0.4)]"
    >
      {/* Content removed */}
      
      {/* Border overlay */}
      <div aria-hidden="true" className="absolute border-[0.5px] border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[18px]" />
    </motion.div>
  );
}