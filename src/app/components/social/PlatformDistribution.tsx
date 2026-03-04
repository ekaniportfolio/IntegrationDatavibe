import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { cn } from "../../components/ui/utils";
import { useTranslation } from "../language-provider";

export interface PlatformData {
  name: string;
  value: number;
  subscribers: string;
  color: string;
  subValue?: string;
}

const DEFAULT_RAW_DATA: PlatformData[] = [
  { name: 'Youtube', value: 35, subscribers: '4.2M', color: '#344BFD' },
  { name: 'Tiktok', value: 25, subscribers: '1.6M', color: '#F68D2B' },
  { name: 'Instagram', value: 15, subscribers: '1.2M', color: '#F4A79D' },
  { name: 'Spotify', value: 15, subscribers: '831K', color: '#30B77C' },
  { name: 'Facebook', value: 10, subscribers: '831K', color: '#F44336' },
];

const PROCESS_DATA = (data: PlatformData[]) => data.map(item => ({
  ...item,
  subValue: item.subValue || item.subscribers
}));

interface PlatformDistributionProps {
  data?: PlatformData[];
}

export default function PlatformDistribution({ data = DEFAULT_RAW_DATA }: PlatformDistributionProps) {
  const { t } = useTranslation();
  const title = t('dashboard.platformDistribution');
  const processedData = PROCESS_DATA(data);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[rgba(2,13,6,0.5)] border border-[rgba(2,13,6,0.5)] rounded-[10px] w-full p-[16px] flex flex-col gap-[20px]"
    >
      <div className="flex items-center justify-center w-full">
         <h3 className="font-manrope font-bold text-[14px] text-white text-center leading-tight">{title}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Legend */}
        <div className="flex flex-col gap-[9px] min-w-[120px]">
          {processedData.map((item, index) => (
            <div key={item.name || index} className="flex items-center gap-[8px]">
              <div 
                className="w-[8px] h-[8px] rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-manrope font-medium text-white" translate="no">
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
                data={processedData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {processedData.map((entry, index) => (
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