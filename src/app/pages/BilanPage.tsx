import { SmartCard } from "../components/common/SmartCard";
import { Button } from "../components/ui/button";
import { 
  Download, 
  Share2, 
  Calendar, 
  TrendingUp, 
  Award, 
  Music, 
  Users,
  DollarSign 
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { useState, useEffect } from "react";
import { useTranslation } from "../components/language-provider";

export default function BilanPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  const data = [
    { subject: t('bilan.page.radarEngagement'), A: 120, fullMark: 150 },
    { subject: t('bilan.page.radarStreams'), A: 98, fullMark: 150 },
    { subject: t('bilan.page.radarRevenue'), A: 86, fullMark: 150 },
    { subject: t('bilan.page.radarReach'), A: 99, fullMark: 150 },
    { subject: t('bilan.page.radarVirality'), A: 85, fullMark: 150 },
    { subject: t('bilan.page.radarLoyalty'), A: 65, fullMark: 150 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-manrope">{t('bilan.page.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('bilan.page.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="size-4" /> {t('bilan.page.share')}
          </Button>
          <Button className="bg-datavibe-primary hover:bg-datavibe-primary/90 text-white gap-2">
            <Download className="size-4" /> {t('bilan.page.exportPdf')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmartCard title={t('bilan.page.overallScore')} icon={Award} className="border-datavibe-primary/20 bg-datavibe-primary/5">
            <div className="text-4xl font-bold text-datavibe-primary mt-2">A-</div>
            <p className="text-sm text-muted-foreground mt-1">{t('bilan.page.greatStart')}</p>
        </SmartCard>
        
        <SmartCard title={t('bilan.page.bestChannel')} icon={Music}>
            <div className="text-2xl font-bold mt-2" translate="no">Spotify</div>
            <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp className="size-3" /> {t('bilan.page.growthPercent')}
            </p>
        </SmartCard>

        <SmartCard title={t('bilan.page.topAudience')} icon={Users}>
            <div className="text-2xl font-bold mt-2">18-24 ans</div>
            <p className="text-sm text-muted-foreground mt-1">{t('bilan.page.mobileAudience')}</p>
        </SmartCard>

        <SmartCard title={t('bilan.page.avgRevenue')} icon={DollarSign}>
            <div className="text-2xl font-bold mt-2">&euro;0.004</div>
            <p className="text-sm text-muted-foreground mt-1">{t('bilan.page.perStreamStable')}</p>
        </SmartCard>
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <SmartCard title={t('bilan.page.performanceRadar')} className="col-span-full lg:col-span-3 min-h-[400px]">
            <div className="h-[300px] w-full mt-4 min-w-[100px]" style={{ height: 300, minWidth: 100 }}>
                {!mounted ? (
                  <div className="h-full w-full bg-muted/10 animate-pulse rounded-md" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                          <PolarGrid stroke="var(--border)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                          <Radar
                              name="Performance"
                              dataKey="A"
                              stroke="var(--datavibe-primary)"
                              fill="var(--datavibe-primary)"
                              fillOpacity={0.3}
                          />
                      </RadarChart>
                  </ResponsiveContainer>
                )}
            </div>
        </SmartCard>

        <SmartCard title={t('bilan.page.keyPoints')} className="col-span-full lg:col-span-4 min-h-[400px]">
            <div className="space-y-6 mt-4">
                <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-green-500/10 text-green-500 mt-1">
                        <TrendingUp className="size-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('bilan.page.organicGrowth')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('bilan.page.organicGrowthDesc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mt-1">
                        <Users className="size-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('bilan.page.loyaltyUp')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('bilan.page.loyaltyUpDesc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-full bg-orange-500/10 text-orange-500 mt-1">
                        <Award className="size-5" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">{t('bilan.page.opportunityDetected')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('bilan.page.opportunityDetectedDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </SmartCard>
      </div>
    </div>
  );
}
