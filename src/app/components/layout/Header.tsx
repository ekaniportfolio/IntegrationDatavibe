import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../mode-toggle";
import { LanguageToggle } from "../language-toggle";
import { Search } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-header-border px-4 bg-header-background backdrop-blur-md sticky top-0 z-50 transition-colors">
      <SidebarTrigger className="text-foreground hover:bg-accent" />
      
      {/* Search Bar Landing Zone */}
      <motion.div 
        layoutId="hero-k"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-border"
      >
         <Search className="w-4 h-4 text-muted-foreground" />
      </motion.div>

      <div className="flex-1" />
      <LanguageToggle />
      <ModeToggle />
      <div className="size-8 rounded-full bg-gradient-to-tr from-datavibe-orange to-datavibe-pink ml-4" />
    </header>
  );
}
