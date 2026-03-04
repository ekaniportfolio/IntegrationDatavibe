import React from 'react';
import { BarChartCard } from "../charts/BarChartCard";
import { useTranslation } from "../language-provider";

export interface AgeData {
  name: string;
  value: number;
}

const DEFAULT_DATA: AgeData[] = [
  { name: "13-17", value: 4 },
  { name: "18-24", value: 54 },
  { name: "25-34", value: 35 },
  { name: "35-44", value: 2 },
  { name: "45-64", value: 1 },
  { name: "65+", value: 0 }
];

interface SubscribersByAgeProps {
  data?: AgeData[];
}

export default function SubscribersByAge({ data = DEFAULT_DATA }: SubscribersByAgeProps) {
  const { t } = useTranslation();
  return (
    <BarChartCard 
      title={t('dashboard.social.subscribersByAge')} 
      data={data}
      className="bg-[rgba(2,13,6,0.5)] border-[rgba(2,13,6,0.5)]"
    />
  );
}