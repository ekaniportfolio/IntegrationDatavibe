import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { motion } from "motion/react";
import { cn } from "../../components/ui/utils";

export interface BarChartDataPoint {
  name: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  data: BarChartDataPoint[];
  barColor?: string;
  className?: string;
  delay?: number;
}

export function BarChartCard({ title, data, barColor = "#344BFD", className, delay = 0 }: BarChartCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "bg-[rgba(6,2,13,0.5)] border border-[rgba(6,2,13,0.5)] rounded-[10px] w-full p-[16px] flex flex-col gap-[20px] min-h-[220px]",
        className
      )}
    >
      <div className="flex items-start w-full">
         <h3 className="font-manrope font-bold text-[14px] text-foreground leading-tight">{title}</h3>
      </div>

      <div className="w-full h-[160px] relative">
         <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#B1B1B1" opacity={0.1} />
            <XAxis 
              dataKey="name" 
              stroke="#767676" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
              fontFamily="Manrope"
              fontWeight="bold"
            />
            <YAxis 
              stroke="#767676" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              fontFamily="Manrope"
              fontWeight="bold"
              width={35}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: "rgba(10, 10, 20, 0.95)", 
                border: "1px solid rgba(255,255,255,0.1)", 
                borderRadius: "8px",
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
              }}
              itemStyle={{ color: "#fff", fontSize: "12px", fontFamily: "Manrope" }}
              formatter={(value: number) => [`${value}%`, '']}
              labelStyle={{ color: "rgba(255,255,255,0.7)", marginBottom: "4px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}
            />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={14}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}