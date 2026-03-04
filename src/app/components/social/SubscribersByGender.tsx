import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { useTranslation } from "../language-provider";

export interface GenderData {
  name: string;
  value: number;
  color: string;
  subValue: string;
}

interface SubscribersByGenderProps {
  data?: GenderData[];
}

export default function SubscribersByGender({ data }: SubscribersByGenderProps) {
  const { t } = useTranslation();
  const resolvedData = data || [
    { name: t("dashboard.social.male"), value: 40.8, color: "#344BFD", subValue: "40,8%" },
    { name: t("dashboard.social.female"), value: 59.2, color: "#F68D2B", subValue: "59,2%" }
  ];
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[rgba(2,13,6,0.5)] border border-[rgba(2,13,6,0.5)] rounded-[10px] w-full p-[16px] flex flex-col gap-[20px]"
    >
      <div className="flex items-center justify-center w-full">
         <h3 className="font-manrope font-bold text-[14px] text-white text-center leading-tight">{t('dashboard.social.subscribersByGender')}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Legend */}
        <div className="flex flex-col gap-[9px] min-w-[120px]">
          {resolvedData.map((item, index) => (
            <div key={item.name || index} className="flex items-center gap-[8px]">
              <div 
                className="w-[8px] h-[8px] rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-manrope font-medium text-white">
                  {item.name}
                </span>
                <span className="text-[10px] font-manrope font-normal text-white/60">
                  {item.subValue}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="w-[140px] h-[140px] relative shrink-0">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resolvedData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {resolvedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}