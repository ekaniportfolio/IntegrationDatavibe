import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../../components/ui/utils";
import { Skeleton } from "../ui/skeleton";
import type { LucideIcon } from "lucide-react";

interface SmartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  variant?: "default" | "highlight" | "glass" | "outline";
  noPadding?: boolean;
  loading?: boolean;
  animate?: boolean;
  delay?: number;
}

const MotionCard = motion(Card);

export function SmartCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  action, 
  children, 
  className, 
  variant = "default",
  noPadding = false,
  loading = false,
  animate = true,
  delay = 0,
  ...props 
}: SmartCardProps) {
  
  // Base classes based on variant
  const variantClasses = {
    default: "bg-card border-border",
    highlight: "bg-datavibe-primary/10 border-datavibe-primary/20",
    glass: "bg-background/50 backdrop-blur-md border-border",
    outline: "bg-transparent border-dashed border-border"
  };

  return (
    <MotionCard 
      layout={animate}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ 
        duration: 0.4, 
        delay: delay,
        layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 } 
      }}
      className={cn(
        "text-card-foreground shadow-none transition-colors duration-200 overflow-hidden",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {(title || subtitle || Icon || action) && (
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex flex-col gap-1 w-full">
            {loading ? (
              <div className="space-y-2">
                 <Skeleton className="h-4 w-1/3" />
                 {subtitle && <Skeleton className="h-3 w-1/2" />}
              </div>
            ) : (
              <>
                {title && (
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/80">
                    {Icon && <Icon className="size-4 opacity-70" />}
                    {title}
                  </CardTitle>
                )}
                {subtitle && (
                  <CardDescription className="text-xs text-muted-foreground">
                    {subtitle}
                  </CardDescription>
                )}
              </>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={cn("pt-0", noPadding ? "p-0" : "")}>
        <AnimatePresence mode="wait">
           {loading ? (
             <motion.div
               key="skeleton"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-2"
             >
                <Skeleton className="h-20 w-full rounded-md" />
             </motion.div>
           ) : (
             <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
             >
                {children}
             </motion.div>
           )}
        </AnimatePresence>
      </CardContent>
    </MotionCard>
  );
}