import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

export interface CountryData {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_DATA: CountryData[] = [
  { name: "Côte D’Ivoire", value: 50, color: "#344BFD" },
  { name: "France", value: 30, color: "#F68D2B" },
  { name: "Belgique", value: 20, color: "#FFFFFF" },
];

interface RadioCountriesAnalysisProps {
  data?: CountryData[];
}

export function RadioCountriesAnalysis({ data = DEFAULT_DATA }: RadioCountriesAnalysisProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[rgba(2,8,13,0.5)] border-[0.5px] border-[rgba(2,8,13,0.5)] rounded-[10px] w-full p-[16px] flex flex-col gap-[20px]"
    >
      <div className="flex items-center justify-center w-full">
         <h3 className="font-manrope font-bold text-[14px] text-foreground text-center leading-tight">Analyse par pays</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
        {/* Legend */}
        <div className="flex flex-col gap-[9px] min-w-[120px]">
          {data.map((item, index) => (
            <div key={item.name || index} className="flex items-center gap-[8px]">
              <div 
                className="w-[8px] h-[8px] rounded-full shrink-0" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="flex flex-col leading-tight">
                <span className="text-[12px] font-manrope font-medium text-foreground" translate="no">
                  {item.name}
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
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
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