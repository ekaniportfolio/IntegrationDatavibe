import { SmartCard } from "../../components/common/SmartCard";
import { Button } from "../../components/ui/button";
import { StreamGrowthChart } from "../../components/charts/StreamGrowthChart";
import { PlatformUsageChart } from "../../components/charts/PlatformUsageChart";
import { Play, Clock, Heart, Users, TrendingUp, Globe } from "lucide-react";
import { useTranslation } from "../../components/language-provider";

// Mock Data for Top Tracks — song titles are NEVER translated (REGLE ABSOLUE N.2)
const topTracks = [
  { rank: 1, title: "Midnight City", artist: "M83", streams: "12,450,200", change: "+12%" },
  { rank: 2, title: "Wait", artist: "M83", streams: "8,200,100", change: "+5%" },
  { rank: 3, title: "Reunion", artist: "M83", streams: "5,100,050", change: "-2%" },
  { rank: 4, title: "Outro", artist: "M83", streams: "3,400,000", change: "+8%" },
  { rank: 5, title: "Steve McQueen", artist: "M83", streams: "1,200,000", change: "+15%" },
];

export default function StreamingDashboard() {
  const { t } = useTranslation();

  // Mock Data for Territories — country names are translated
  const territories = [
    { country: t('country.france'), percentage: 45, flag: "\uD83C\uDDEB\uD83C\uDDF7" },
    { country: t('country.usa'), percentage: 22, flag: "\uD83C\uDDFA\uD83C\uDDF8" },
    { country: t('country.germany'), percentage: 12, flag: "\uD83C\uDDE9\uD83C\uDDEA" },
    { country: t('country.uk'), percentage: 8, flag: "\uD83C\uDDEC\uD83C\uDDE7" },
    { country: t('country.japan'), percentage: 5, flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-manrope">{t('streaming.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('streaming.subtitle')}
          </p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
          {t('streaming.exportCsv')}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmartCard title={t('streaming.totalListens')} icon={Play} className="border-datavibe-primary/20 bg-datavibe-primary/5">
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">45.2M</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +12.5% <span className="text-muted-foreground ml-1">{t('streaming.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>
        
        <SmartCard title={t('streaming.listeningHours')} icon={Clock}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">1.8M</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +8.2% <span className="text-muted-foreground ml-1">{t('streaming.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>

        <SmartCard title={t('streaming.saveRate')} icon={Heart}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">34.2%</div>
            <p className="text-xs text-datavibe-red flex items-center mt-1">
              <TrendingUp className="size-3 mr-1 rotate-180" /> -1.2% <span className="text-muted-foreground ml-1">{t('streaming.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>

        <SmartCard title={t('streaming.activeAudience')} icon={Users}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">850k</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +24% <span className="text-muted-foreground ml-1">{t('streaming.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>
      </div>

      {/* Main Chart Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StreamGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <PlatformUsageChart />
        </div>
      </div>

      {/* Bottom Section: Top Tracks & Territories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Top Tracks Table */}
        <SmartCard title={t('streaming.topTracks')} icon={Play} className="lg:col-span-2 min-h-[350px]">
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-4 pb-2 border-b border-white/5">
              <div className="col-span-1">#</div>
              <div className="col-span-6">TITRE</div>
              <div className="col-span-3 text-right">STREAMS</div>
              <div className="col-span-2 text-right">TREND</div>
            </div>
            {topTracks.map((track) => (
              <div key={track.rank} className="grid grid-cols-12 items-center py-3 px-4 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                <div className="col-span-1 text-sm font-bold text-white/50 group-hover:text-datavibe-primary">{track.rank}</div>
                <div className="col-span-6">
                  <div className="text-sm font-medium text-white" translate="no">{track.title}</div>
                  <div className="text-xs text-muted-foreground" translate="no">{track.artist}</div>
                </div>
                <div className="col-span-3 text-right text-sm font-mono text-white/80">{track.streams}</div>
                <div className={`col-span-2 text-right text-xs font-medium ${track.change.startsWith('+') ? 'text-datavibe-green' : 'text-datavibe-red'}`}>
                  {track.change}
                </div>
              </div>
            ))}
          </div>
        </SmartCard>

        {/* Territories */}
        <SmartCard title={t('streaming.topTerritories')} icon={Globe} className="min-h-[350px]">
          <div className="mt-6 space-y-6">
             {territories.map((ter, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-white flex items-center gap-2">
                     <span className="text-base">{ter.flag}</span> {ter.country}
                   </span>
                   <span className="font-mono text-white/70">{ter.percentage}%</span>
                 </div>
                 <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-datavibe-primary rounded-full" 
                    style={{ width: `${ter.percentage}%`, opacity: 1 - (i * 0.15) }} 
                   />
                 </div>
               </div>
             ))}
          </div>
        </SmartCard>

      </div>
    </div>
  );
}
