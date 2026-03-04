import React from 'react';
import { motion } from "motion/react";
import { PlayCircle, Globe, Radio } from "lucide-react";

export interface AirplayMetric {
  label: string;
  value: string;
  id: string;
}

const DEFAULT_METRICS: AirplayMetric[] = [
  { 
    label: "Nombre total de jeux", 
    value: "47", 
    id: "total_plays" 
  },
  { 
    label: "Pays", 
    value: "5", 
    id: "countries" 
  }
];

interface RadioPerformanceOverviewProps {
  data?: AirplayMetric[];
}

export default function RadioPerformanceOverview({ data = DEFAULT_METRICS }: RadioPerformanceOverviewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-[24px] w-full overflow-hidden"
      style={{ 
        backgroundImage: "linear-gradient(90.7675deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)",
        border: "1px solid rgba(18,134,243,0.6)"
      }}
    >
      <div className="flex flex-col gap-[16px] p-[14px] w-full h-full relative z-10">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start relative shrink-0">
            <p className="font-manrope font-normal text-[14px] text-white">Analyse globale de l'airplay</p>
          </div>
          <div className="bg-[rgba(18,134,243,0.2)] flex h-[43px] w-[43px] items-center justify-center rounded-[8px] shrink-0">
             <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
               className="w-[24px] h-[24px]"
             >
                <svg className="block w-full h-full" fill="none" viewBox="0 0 24 24">
                   <path clipRule="evenodd" d="M23.5918 10.0554C23.7369 9.96605 23.8521 9.83548 23.9226 9.68037C23.9931 9.52525 24.0159 9.35263 23.9878 9.18455L22.8564 2.43026C22.8376 2.31807 22.7966 2.21073 22.7359 2.11453C22.6752 2.01832 22.5959 1.93516 22.5027 1.8699C22.4096 1.80464 22.3043 1.75858 22.1931 1.73441C22.082 1.71024 21.9671 1.70844 21.8552 1.72912L15.4438 2.92055C15.2796 2.95117 15.1279 3.02911 15.0074 3.14477C14.8869 3.26043 14.8028 3.40878 14.7655 3.57159C14.7282 3.73439 14.7392 3.90456 14.7973 4.06117C14.8554 4.21778 14.9579 4.35401 15.0924 4.45312L17.9244 6.54112L13.0455 13.5097L8.59182 10.3863C8.35921 10.2234 8.07147 10.1596 7.79183 10.2088C7.51218 10.258 7.26349 10.4161 7.10039 10.6486L0.191818 20.5091C0.111111 20.6244 0.0538974 20.7544 0.0234435 20.8918C-0.00701051 21.0292 -0.0101084 21.1712 0.0143267 21.3098C0.0387617 21.4483 0.0902512 21.5807 0.165855 21.6994C0.241459 21.8181 0.339698 21.9207 0.454961 22.0014C0.687745 22.1644 0.975744 22.2282 1.2556 22.1789C1.39417 22.1545 1.52658 22.103 1.64525 22.0274C1.76392 21.9518 1.86654 21.8535 1.94725 21.7383L8.23868 12.7554L12.6924 15.8788C12.9252 16.0415 13.2131 16.105 13.4927 16.0555C13.7724 16.006 14.021 15.8475 14.1838 15.6148L19.6472 7.81484L22.6318 10.016C22.7694 10.1173 22.9342 10.1752 23.1049 10.1823C23.2757 10.1893 23.4446 10.1451 23.5901 10.0554" fill="#1286F3" fillRule="evenodd" />
                </svg>
             </motion.div>
          </div>
        </div>

        <div className="flex gap-[24px] items-center w-full">
          {data.map((metric, index) => (
            <motion.div 
               key={metric.id}
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
               whileHover={{ scale: 1.02, backgroundColor: "rgba(18,134,243,0.2)" }}
               className="bg-[rgba(18,134,243,0.1)] flex-[1_0_0] relative rounded-[12px] p-[20px] px-[14px] flex flex-col items-center justify-center gap-[6px] cursor-default"
            >
               <p className="font-manrope font-normal text-[14px] text-white">{metric.label}</p>
               <p className="font-[Poppins] font-extrabold text-[#1286f3] text-[24px]">{metric.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
