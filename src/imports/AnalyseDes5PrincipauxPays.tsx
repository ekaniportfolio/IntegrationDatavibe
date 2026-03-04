import React from 'react';
import { motion } from "motion/react";
import { useTranslation } from "../app/components/language-provider";

export interface CountryPlayData {
  name: string;
  plays: number;
}

const DEFAULT_COUNTRY_DATA: CountryPlayData[] = [
  { name: "Côte D’Ivoire", plays: 40 },
  { name: "France", plays: 4 },
  { name: "Belgique", plays: 1 },
  { name: "Cameroun", plays: 23 },
  { name: "Sénégal", plays: 16 },
];

interface AnalyseDes5PrincipauxPaysProps {
  data?: CountryPlayData[];
}

export default function AnalyseDes5PrincipauxPays({ data = DEFAULT_COUNTRY_DATA }: AnalyseDes5PrincipauxPaysProps) {
  const { t } = useTranslation();
  return (
    <div 
      className="content-stretch flex flex-col gap-[18px] items-start justify-end overflow-clip px-[14px] py-[20px] relative rounded-[18px] size-full border border-[rgba(18,134,243,0.6)]" 
      data-name="Analyse des 5 principaux pays" 
      style={{ backgroundImage: "linear-gradient(90.7675deg, rgba(18, 134, 243, 0.1) 0.92512%, rgba(74, 143, 255, 0.2) 99.075%)" }}
    >
      {/* Header Section */}
      <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full">
        <div className="content-stretch flex items-center relative shrink-0 w-full">
          <p className="font-manrope font-bold leading-[normal] relative shrink-0 text-[16px] text-white w-full whitespace-pre-wrap">
            {t('dashboard.top5Countries')}
          </p>
        </div>
        <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[14px] text-white/90 w-full whitespace-pre-wrap">
          {t('dashboard.top5CountriesDesc')}
        </p>
      </div>

      {/* Table Headers */}
      <div className="h-[19px] relative shrink-0 w-full mt-2">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col items-center justify-between px-[14px] relative size-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-manrope font-normal items-center justify-between leading-[normal] relative shrink-0 text-[14px] text-white/80 w-full">
                <p className="relative shrink-0">{t('dashboard.country')}</p>
                <p className="relative shrink-0">{t('dashboard.plays')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rows */}
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        {data.map((country, index) => (
          <motion.div 
            key={country.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[rgba(18,134,243,0.1)] relative rounded-[12px] shrink-0 w-full hover:bg-[rgba(18,134,243,0.2)] transition-colors"
          >
            <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex items-center justify-between px-[14px] py-[12px] relative w-full">
                
                {/* Country Name */}
                <div className="content-stretch flex items-center relative shrink-0">
                  <div className="content-stretch flex flex-col items-start relative shrink-0">
                    <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[14px] text-white">
                      {country.name}
                    </p>
                  </div>
                </div>

                {/* Plays Count */}
                <div className="content-stretch flex flex-col items-start relative shrink-0">
                  <p className="font-manrope font-normal leading-[normal] relative shrink-0 text-[14px] text-white font-mono">
                    {country.plays}
                  </p>
                </div>

              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}