import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Music, Trophy, AlertCircle, MessageCircle, TrendingUp, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "../language-provider";

export type ActivityType = "release" | "milestone" | "alert" | "social";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  meta?: string;
  image?: string;
}

const getIcon = (type: ActivityType) => {
  switch (type) {
    case "release": return <Music className="size-4 text-datavibe-primary" />;
    case "milestone": return <Trophy className="size-4 text-datavibe-orange" />;
    case "alert": return <TrendingUp className="size-4 text-datavibe-green" />;
    case "social": return <MessageCircle className="size-4 text-datavibe-blue" />;
    default: return <AlertCircle className="size-4" />;
  }
};

const getBgColor = (type: ActivityType) => {
  switch (type) {
    case "release": return "bg-datavibe-primary/10 border-datavibe-primary/20";
    case "milestone": return "bg-datavibe-orange/10 border-datavibe-orange/20";
    case "alert": return "bg-datavibe-green/10 border-datavibe-green/20";
    case "social": return "bg-datavibe-blue/10 border-datavibe-blue/20";
    default: return "bg-muted/40 border-border";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface ActivityFeedProps {
  items?: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  const { t } = useTranslation();

  const resolvedItems = items || [
    {
      id: "1",
      type: "milestone" as ActivityType,
      title: t("activity.newMonthlyRecord"),
      description: t("activity.newMonthlyRecordDesc"),
      timestamp: t("activity.timeAgo2h"),
      meta: "1.02M",
    },
    {
      id: "2",
      type: "release" as ActivityType,
      title: t("activity.midnightCityRelease"),
      description: t("activity.midnightCityReleaseDesc"),
      timestamp: t("activity.timeAgo5h"),
      image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop",
    },
    {
      id: "3",
      type: "alert" as ActivityType,
      title: t("activity.tiktokTrend"),
      description: t("activity.tiktokTrendDesc"),
      timestamp: t("activity.timeAgo1d"),
      meta: "+450%",
    },
    {
      id: "4",
      type: "social" as ActivityType,
      title: t("activity.spotifyMention"),
      description: t("activity.spotifyMentionDesc"),
      timestamp: t("activity.timeAgo2d"),
    },
    {
      id: "5",
      type: "milestone" as ActivityType,
      title: t("activity.10kFollowers"),
      description: t("activity.10kFollowersDesc"),
      timestamp: t("activity.timeAgo3d"),
      meta: "10k",
    },
  ];

  return (
    <ScrollArea className="h-[350px] pr-4">
      <motion.div 
        className="relative border-l border-border ml-3 space-y-8 py-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {resolvedItems.map((item) => (
            <motion.div 
              key={item.id} 
              className="relative pl-8 group"
              variants={itemVariants}
              layout
            >
              {/* Timeline Dot */}
              <div className={`absolute left-[-5px] top-1 size-2.5 rounded-full border border-background ${
                item.type === 'milestone' ? 'bg-datavibe-orange' : 
                item.type === 'release' ? 'bg-datavibe-primary' : 
                item.type === 'alert' ? 'bg-datavibe-green' : 'bg-muted-foreground'
              } ring-4 ring-background`} />

              {/* Card Content */}
              <div className={`p-4 rounded-xl border transition-all duration-300 hover:bg-accent ${getBgColor(item.type)}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-secondary border border-border">
                      {getIcon(item.type)}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.type}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>

                <div className="mt-2 flex gap-4">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt="Cover" 
                      className="size-12 rounded-md object-cover border border-border shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {item.title}
                      {item.meta && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                          {item.meta}
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Action Button (Visible on Hover) */}
                <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-accent hover:text-accent-foreground">
                    {t('dashboard.viewDetails')} <ChevronRight className="ml-1 size-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ScrollArea>
  );
}