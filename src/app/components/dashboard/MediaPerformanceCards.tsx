import React from 'react';
import { motion } from "motion/react";
import { Radio, Globe } from "lucide-react";

interface MediaPerformanceCardsProps {
  totalPlays?: number;
  countriesReached?: number;
}

export function MediaPerformanceCards({ 
  totalPlays = 47, 
  countriesReached = 5 
}: MediaPerformanceCardsProps) {
  
  return (
    <div 
      className="content-stretch flex flex-col gap-[12px] items-start justify-end overflow-clip px-[14px] py-[20px] relative rounded-[18px] shrink-0 w-full"
      style={{ backgroundImage: "linear-gradient(90.7675deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)" }}
    >
      {/* Border Overlay */}
      <div aria-hidden="true" className="absolute border border-[rgba(18,134,243,0.6)] border-solid inset-0 pointer-events-none rounded-[18px]" />

      {/* Title */}
      <div className="content-stretch flex flex-col items-center relative shrink-0 mb-4 w-full z-10">
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          <p className="font-manrope font-bold leading-[normal] relative shrink-0 text-[16px] text-foreground w-full whitespace-pre-wrap">
            Performances actuelles des médias
          </p>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col gap-3 w-full z-10">
        
        {/* Card 1: Radio Plays */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[rgba(18,134,243,0.1)] relative rounded-[12px] shrink-0 w-full hover:bg-[rgba(18,134,243,0.2)] transition-colors"
        >
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-center justify-between px-[14px] py-[20px] relative w-full">
              <div className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 text-foreground">
                <p className="font-manrope font-normal relative shrink-0 text-[14px] max-w-[200px] whitespace-pre-wrap text-foreground/90">
                  Nombre total de diffusions radio 30 jours
                </p>
                <p className="font-manrope font-bold relative shrink-0 text-[24px]">
                  {totalPlays}
                </p>
              </div>
              <div className="bg-[rgba(18,134,243,0.2)] content-stretch flex h-[43px] w-[43px] items-center justify-center overflow-clip relative rounded-[8px] shrink-0">
                <div className="relative shrink-0 size-[24px] flex items-center justify-center">
                  <Radio className="w-full h-full text-[#1286F3]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Countries Reached */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[rgba(18,134,243,0.1)] relative rounded-[12px] shrink-0 w-full hover:bg-[rgba(18,134,243,0.2)] transition-colors"
        >
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex items-center justify-between px-[14px] py-[20px] relative w-full">
              <div className="content-stretch flex flex-col gap-[6px] items-start leading-[normal] relative shrink-0 text-foreground">
                <p className="font-manrope font-normal relative shrink-0 text-[14px] text-foreground/90">
                  Pays atteints
                </p>
                <p className="font-manrope font-bold relative shrink-0 text-[24px]">
                  {countriesReached}
                </p>
              </div>
              <div className="bg-[rgba(18,134,243,0.2)] content-stretch flex h-[43px] w-[43px] items-center justify-center overflow-clip relative rounded-[8px] shrink-0">
                <div className="relative shrink-0 size-[24px] flex items-center justify-center">
                  <Globe className="w-full h-full text-[#1286F3]" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}