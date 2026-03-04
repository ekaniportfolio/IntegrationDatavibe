import { SmartCard } from "../../components/common/SmartCard";
import { Button } from "../../components/ui/button";
import { AirplayChart } from "../../components/charts/AirplayChart";
import { TopStationsTable } from "../../components/tables/TopStationsTable";
import { Radio, Signal, MapPin, TrendingUp } from "lucide-react";
import { useTranslation } from "../../components/language-provider";

export default function RadioDashboard() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-manrope">{t('radio.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('radio.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            {t('radio.exportReport')}
            </Button>
            <Button className="bg-datavibe-secondary hover:bg-datavibe-secondary/90 text-white border-0">
            {t('radio.addTracking')}
            </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SmartCard title={t('radio.totalSpins7d')} icon={Radio} className="border-datavibe-secondary/20 bg-datavibe-secondary/5">
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">4,892</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +12.4% <span className="text-muted-foreground ml-1">{t('radio.vsLastWeek')}</span>
            </p>
          </div>
        </SmartCard>
        
        <SmartCard title={t('radio.audienceReach')} icon={Signal}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">12.8M</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +5.2% <span className="text-muted-foreground ml-1">{t('radio.estimatedListeners')}</span>
            </p>
          </div>
        </SmartCard>

        <SmartCard title={t('radio.topTerritory')} icon={MapPin}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white" translate="no">France</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('radio.volumePercent').replace('{pct}', '32')}
            </p>
          </div>
        </SmartCard>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <AirplayChart />
        </div>
        
        {/* Highlight Widget */}
        <div className="lg:col-span-1">
           <div className="h-full bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 rounded-full bg-datavibe-secondary/20 flex items-center justify-center mb-4 border border-datavibe-secondary/30">
                    <Radio size={40} className="text-datavibe-secondary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2" translate="no">NRJ France</h3>
                <p className="text-muted-foreground mb-6">{t('radio.topStationThisWeek')} <span className="text-foreground font-bold">1,450 spins</span></p>
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                    {t('radio.viewStation')}
                </Button>
           </div>
        </div>
      </div>

      {/* Full Width Table */}
      <div className="w-full">
        <TopStationsTable />
      </div>
    </div>
  );
}