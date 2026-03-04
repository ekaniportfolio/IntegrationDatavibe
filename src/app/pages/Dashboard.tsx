import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { SmartCard } from "../components/common/SmartCard";
import { Button } from "../components/ui/button";
import { RevenueChart } from "../components/charts/RevenueChart";
import { UserDistributionChart } from "../components/charts/UserDistributionChart";
import { PlatformUsageChart } from "../components/charts/PlatformUsageChart";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { Music, Share2, Radio, TrendingUp, DollarSign, Users, CreditCard, Activity, Zap, Play } from "lucide-react";
import { useTranslation } from "../components/language-provider";

// --- MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function Dashboard() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const stats = [
    { label: t("dashboard.totalListens"), value: "12.5M", trend: "+20.1%", trendUp: true, icon: Music, color: "text-datavibe-primary" },
    { label: t("dashboard.followersLabel"), value: "854k", trend: "+5.2%", trendUp: true, icon: Users, color: "text-datavibe-orange" },
    { label: t("dashboard.sales"), value: "\u20AC12,234", trend: "+19%", trendUp: true, icon: CreditCard, color: "text-datavibe-green" },
    { label: t("dashboard.radioPlays"), value: "1,240", trend: "-2.1%", trendUp: false, icon: Radio, color: "text-datavibe-blue" },
  ];

  const topSongs = [
    { 
      id: 1, 
      title: "Midnight City Dreams", 
      artist: "Neon Pulse", 
      image: "https://images.unsplash.com/photo-1648229168049-5525383e80dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWxidW0lMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "3:45"
    },
    { 
      id: 2, 
      title: "Abstract Thoughts", 
      artist: "The Thinkers", 
      image: "https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFsYnVtJTIwY292ZXIlMjBhcnR8ZW58MXx8fHwxNzY3MzE1Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "4:12"
    },
    { 
      id: 3, 
      title: "Silence & Noise", 
      artist: "Echo Valley", 
      image: "https://images.unsplash.com/photo-1703115015343-81b498a8c080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbXVzaWMlMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "2:58"
    },
    { 
      id: 4, 
      title: "Lost in Tokyo", 
      artist: "Neon Pulse", 
      image: "https://images.unsplash.com/photo-1648229168049-5525383e80dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWxidW0lMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "3:22"
    },
    { 
      id: 5, 
      title: "Night Drive", 
      artist: "Neon Pulse", 
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2R8ZW58MXx8fHwxNzY3MjgyNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      duration: "3:10"
    },
  ];

  // Simulate data fetching for organic reveal
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground font-manrope">{t('dashboard.tabDashboard')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('dashboard.overview')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-border text-foreground hover:bg-accent">
            {t('dashboard.downloadReport')}
          </Button>
          <Button className="bg-datavibe-primary hover:bg-datavibe-primary/90 text-white shadow-[0_0_20px_var(--effect-glow-primary)]">
            {t('dashboard.newCampaign')}
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards Row - Staggered Individual Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="h-full">
            <SmartCard 
                title={stat.label} 
                icon={stat.icon} 
                variant="default" 
                className="hover:border-datavibe-primary/50 transition-colors h-full"
                loading={isLoading}
            >
                <div className="mt-2 space-y-1">
                <div className={`text-3xl font-bold font-manrope ${stat.color}`}>{stat.value}</div>
                <p className={`text-xs ${stat.trendUp ? 'text-datavibe-green' : 'text-datavibe-red'} flex items-center`}>
                    <TrendingUp className={`size-3 mr-1 ${!stat.trendUp && "rotate-180"}`} />
                    {stat.trend} <span className="text-muted-foreground ml-1">{t('dashboard.sinceLastMonth')}</span>
                </p>
                </div>
            </SmartCard>
          </motion.div>
        ))}
      </div>

       {/* Charts Grid */}
       <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {/* Revenue Chart (8 cols) */}
          <div className="col-span-full lg:col-span-8">
            <RevenueChart />
          </div>
          
          {/* Side Charts (4 cols) - Stacked */}
          <div className="col-span-full lg:col-span-4 grid gap-6">
            <PlatformUsageChart />
            <UserDistributionChart />
          </div>
       </motion.div>

      {/* Bottom Section: Feed & Lists */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full lg:col-span-4">
            <SmartCard 
                title={t('dashboard.smartFeed')} 
                subtitle={t('dashboard.detectedActivities')} 
                icon={Zap} 
                className="min-h-[400px] h-full"
                loading={isLoading}
            >
                <div className="mt-4">
                    <ActivityFeed />
                </div>
            </SmartCard>
        </div>

        <div className="col-span-full lg:col-span-3">
            <SmartCard title={t('dashboard.topSongs')} icon={Music} className="min-h-[400px] h-full" loading={isLoading}>
            <div className="space-y-4 mt-2">
                {topSongs.map((song, i) => (
                <div key={song.id} className="flex items-center gap-3 group cursor-pointer hover:bg-accent p-2 rounded-lg transition-colors">
                    <div className="size-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-foreground group-hover:bg-datavibe-primary group-hover:text-white transition-colors">
                        <span className="group-hover:hidden">{i + 1}</span>
                        <Play size={12} className="hidden group-hover:block fill-current" />
                    </div>
                    <img src={song.image} alt={song.title} className="size-10 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate group-hover:text-datavibe-primary transition-colors">{song.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{song.artist}</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{song.duration}</div>
                </div>
                ))}
            </div>
            </SmartCard>
        </div>
      </motion.div>
    </motion.div>
  );
}