import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";
import { useTranslation } from "../language-provider";

const DATA = [
  { name: "Mobile", value: 40, color: '#344BFD', subValue: "40%" },
  { name: "Desktop", value: 30, color: '#30B77C', subValue: "30%" },
  { name: "Tablet", value: 20, color: '#F68D2B', subValue: "20%" },
  { name: "Smart TV", value: 10, color: '#FF2222', subValue: "10%" },
];

export function PlatformUsageChart() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[rgba(6,2,13,0.5)] border border-[rgba(6,2,13,0.5)] rounded-[10px] w-full p-[16px] flex flex-col gap-[20px]"
    >
      <div className="flex items-center justify-center w-full">
         <h3 className="font-manrope font-bold text-[14px] text-foreground text-center leading-tight">{t('dashboard.devices')}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Legend */}
        <div className="flex flex-col gap-[9px] min-w-[120px]">
          {DATA.map((item, index) => (
            <div key={item.name || index} className="flex items-center gap-[8px]">
              <div 
                className="w-[8px] h-[8px] rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-manrope font-medium text-foreground" translate="no">
                  {item.name}
                </span>
                <span className="text-[10px] font-manrope font-normal text-muted-foreground">
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
                data={DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {DATA.map((entry, index) => (
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