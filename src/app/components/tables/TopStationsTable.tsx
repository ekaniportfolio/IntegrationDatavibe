import { Radio, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useTranslation } from "../language-provider";

export interface StationItem {
  id: number | string;
  name: string;
  country: string;
  spins: number;
  trend: "up" | "down" | "stable";
  percentage: number;
}

const DEFAULT_STATIONS: StationItem[] = [
  { id: 1, name: "NRJ", country: "France", spins: 1450, trend: "up", percentage: 12 },
  { id: 2, name: "BBC Radio 1", country: "UK", spins: 1200, trend: "up", percentage: 8 },
  { id: 3, name: "Virgin Radio", country: "France", spins: 980, trend: "down", percentage: 5 },
  { id: 4, name: "1LIVE", country: "Germany", spins: 850, trend: "stable", percentage: 0 },
  { id: 5, name: "KISS FM", country: "UK", spins: 720, trend: "up", percentage: 15 },
];

interface TopStationsTableProps {
  data?: StationItem[];
}

export function TopStationsTable({ data = DEFAULT_STATIONS }: TopStationsTableProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-dashboard-card-bg border border-border rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-foreground font-manrope">{t('table.topMedia')}</h3>
        <p className="text-sm text-muted-foreground">{t('table.topMediaSubtitle')}</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-foreground/[0.03]">
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.media')}</th>
              <th className="text-left py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('dashboard.country')}</th>
              <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.spins')}</th>
              <th className="text-right py-3 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('table.trend')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data.map((station) => (
              <tr key={station.id} className="group hover:bg-foreground/[0.03] transition-colors">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-muted to-background border border-border flex items-center justify-center mr-3 text-datavibe-secondary">
                      <Radio size={18} />
                    </div>
                    <span className="font-medium text-foreground" translate="no">{station.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-foreground/80">
                  {station.country}
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-foreground font-mono text-right">
                  {station.spins.toLocaleString()}
                </td>
                <td className="py-4 px-6 whitespace-nowrap text-sm text-right">
                  <div className="flex items-center justify-end gap-1">
                    {station.trend === 'up' && <TrendingUp size={14} className="text-datavibe-green" />}
                    {station.trend === 'down' && <TrendingDown size={14} className="text-datavibe-red" />}
                    {station.trend === 'stable' && <Minus size={14} className="text-muted-foreground" />}
                    
                    <span className={`
                      ${station.trend === 'up' ? 'text-datavibe-green' : ''}
                      ${station.trend === 'down' ? 'text-datavibe-red' : ''}
                      ${station.trend === 'stable' ? 'text-muted-foreground' : ''}
                    `}>
                      {station.percentage > 0 ? `+${station.percentage}%` : station.percentage === 0 ? '-' : `-${station.percentage}%`}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}