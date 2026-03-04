import { SmartCard } from "../../components/common/SmartCard";
import { Button } from "../../components/ui/button";
import { FollowerGrowthChart } from "../../components/charts/FollowerGrowthChart";
import { DemographicsChart } from "../../components/charts/DemographicsChart";
import { Users, MessageCircle, Share2, Heart, TrendingUp, Instagram, Youtube, Twitter } from "lucide-react";
import { useTranslation } from "../../components/language-provider";

export default function SocialDashboard() {
  const { t } = useTranslation();

  // Mock Data for Posts
  const recentPosts = [
    { 
      id: 1, 
      platform: "instagram", 
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2R8ZW58MXx8fHwxNzY3MjgyNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", 
      likes: "12.5k", 
      comments: "342", 
      date: t('social.timeAgo2h')
    },
    { 
      id: 2, 
      platform: "instagram", 
      image: "https://images.unsplash.com/photo-1639408431842-a635d57b4dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGJhY2tzdGFnZXxlbnwxfHx8fDE3NjcyOTU3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", 
      likes: "8.2k", 
      comments: "156", 
      date: t('social.yesterday')
    },
    { 
      id: 3, 
      platform: "youtube", 
      image: "https://images.unsplash.com/photo-1658010544238-a6f7f621bcc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZ3xlbnwxfHx8fDE3NjcyNzUzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", 
      likes: "45k", 
      comments: "1.2k", 
      date: t('social.timeAgo3d')
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-manrope">{t('social.title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('social.subtitle')}
          </p>
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
          {t('social.connectAccount')}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SmartCard title={t('social.totalFollowers')} icon={Users} className="border-datavibe-primary/20 bg-datavibe-primary/5">
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">2.4M</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +5.4% <span className="text-muted-foreground ml-1">{t('social.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>
        
        <SmartCard title={t('dashboard.social.engagementRate')} icon={Heart}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">4.8%</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +0.2% <span className="text-muted-foreground ml-1">{t('social.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>

        <SmartCard title={t('social.mentions')} icon={MessageCircle}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">12.5k</div>
            <p className="text-xs text-datavibe-red flex items-center mt-1">
              <TrendingUp className="size-3 mr-1 rotate-180" /> -2.1% <span className="text-muted-foreground ml-1">{t('social.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>

        <SmartCard title={t('social.shares')} icon={Share2}>
          <div className="mt-2">
            <div className="text-3xl font-bold font-manrope text-white">45.2k</div>
            <p className="text-xs text-datavibe-green flex items-center mt-1">
              <TrendingUp className="size-3 mr-1" /> +12% <span className="text-muted-foreground ml-1">{t('social.vsLastMonth')}</span>
            </p>
          </div>
        </SmartCard>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FollowerGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <DemographicsChart />
        </div>
      </div>

      {/* Latest Posts */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 font-manrope">{t('social.latestPosts')}</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {recentPosts.map((post) => (
            <div key={post.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer">
              <img 
                src={post.image} 
                alt="Post" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10">
                {post.platform === 'instagram' && <Instagram size={16} />}
                {post.platform === 'youtube' && <Youtube size={16} />}
                {post.platform === 'twitter' && <Twitter size={16} />}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex justify-between items-end">
                    <div className="flex gap-4 text-white">
                        <div className="flex items-center gap-1.5">
                            <Heart size={16} className="text-datavibe-primary fill-datavibe-primary" />
                            <span className="text-sm font-bold">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageCircle size={16} className="text-white/80" />
                            <span className="text-sm font-medium">{post.comments}</span>
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}