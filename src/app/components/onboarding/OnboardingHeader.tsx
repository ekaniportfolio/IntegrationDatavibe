import React from "react";
import { ChevronLeft, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Logo } from "../branding/Logo";
import { cn } from "../ui/utils";
import { motion } from "motion/react";

// Visiomorphic Component: Help Icon that morphs into Avatar
export const VisiomorphicHelpAvatar = ({ mode = 'help', duration = 0.6 }: { mode?: 'help' | 'avatar', duration?: number }) => {
    const isHelp = mode === 'help';
    return (
        <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 md:w-6 md:h-6 overflow-visible"
        >
             {/* Circle: Head. 
                 Moves up to cy=6 (Bottom at 6+9=15).
             */}
             <motion.circle 
                cx="12"
                layoutId="visio-avatar-head"
                initial={{ 
                    cy: isHelp ? 10 : 6,
                    r: isHelp ? 9 : 6 
                }}
                animate={{ 
                    cy: isHelp ? 10 : 6,
                    r: isHelp ? 9 : 6
                }}
                transition={{ duration: duration, type: "spring", bounce: 0.15 }}
             />
             
             {/* Question Mark parts: 
                 Moves up with the head (y: 0 -> -6).
             */}
             <motion.g
                initial={isHelp ? "help" : "avatar"}
                animate={isHelp ? "help" : "avatar"}
                variants={{
                    help: { y: -2, scale: 1, opacity: 1 },
                    avatar: { y: -6, scale: 0, opacity: 0 }
                }}
                transition={{ duration: duration, type: "spring", bounce: 0.15 }}
                style={{ originX: "12px", originY: "12px" }}
             >
                 <motion.path 
                    d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" 
                    initial={{ strokeWidth: 2 }}
                    animate={{ strokeWidth: 2 }}
                    transition={{ duration: 0.3 }}
                 />
                 <motion.path 
                    d="M12 17h.01" 
                    initial={{ strokeWidth: 2 }}
                    animate={{ strokeWidth: 2 }}
                    transition={{ duration: 0.3 }}
                 />
             </motion.g>

             {/* Bust: 
                 Top edge at y=19 (Gap of 4px from head bottom at 15).
                 Maximum width (x=1 to x=23) for even broader shoulders.
             */}
             <motion.path 
                d="M23 23Q23 19 18 19H6Q1 19 1 23"
                variants={{
                    help: { opacity: 1, y: 0 },
                    avatar: { opacity: 1, y: 0 }
                }}
                initial={isHelp ? "help" : "avatar"}
                animate={isHelp ? "help" : "avatar"}
                transition={{ duration: duration, delay: 0 }}
             />
        </motion.svg>
    );
}

interface OnboardingHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export function OnboardingHeader({
  onBack,
  showBack = true,
  showLogo = true,
  title,
  rightAction,
  className,
  transparent = true,
  avatarRef
}: OnboardingHeaderProps & { avatarRef?: React.Ref<HTMLButtonElement> }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header 
      className={cn(
        "relative z-50 flex items-center justify-between w-full h-16 px-4 transition-all duration-300",
        transparent 
          ? "bg-transparent" 
          : "bg-header-background border-b border-header-border backdrop-blur-md sticky top-0",
        className
      )}
    >
      {/* Left: Back Button or Empty Spacer */}
      <div className="flex items-center w-20">
        <div className="w-10" />
      </div>

      {/* Center: Logo or Title */}
      <div className="flex-1 flex justify-center items-center">
        {showLogo && !title && (
          <div className="scale-90 md:scale-100 transition-transform">
            <Logo variant="default" />
          </div>
        )}
        {title && (
          <h1 className="text-lg md:text-xl font-bold text-foreground text-center truncate px-2">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Action or Help */}
      <div className="flex items-center justify-end w-20">
        {rightAction ? (
          rightAction
        ) : (
          <motion.div 
            layoutId="header-avatar-container"
            initial={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
            animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
          >
            <Button 
                ref={avatarRef}
                variant="secondary" 
                size="icon" 
                className="rounded-full shadow-sm text-foreground hover:bg-secondary/80 transition-all duration-300 hover:shadow-[0_0_20px_var(--effect-glow-primary)]"
            >
                <VisiomorphicHelpAvatar mode="help" />
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
