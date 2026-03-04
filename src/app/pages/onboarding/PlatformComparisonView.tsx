import React from "react";
import { MobileDashboardPage } from "./MobileDashboardPage";
import Dashboard from "../Dashboard";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AppSidebar } from "../../components/layout/Sidebar";
import { ModeToggle } from "../../components/mode-toggle";
import { LanguageToggle } from "../../components/language-toggle";

export function PlatformComparisonView() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* 1. PLATEFORME ONBOARDING */}
      <div className="relative z-10 w-full bg-background border-b-4 border-zinc-900">
        <div className="w-full bg-purple-500/10 text-purple-400 text-center py-2 text-xs font-mono uppercase tracking-widest border-b border-purple-500/20">
          📍 Plateforme Onboarding (Cible)
        </div>
        <div className="w-full h-[800px] relative overflow-hidden">
             <MobileDashboardPage />
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="py-4 bg-zinc-950 flex flex-col items-center justify-center gap-2 border-y border-zinc-800 text-center sticky top-0 z-50 shadow-2xl">
        <div className="text-zinc-400 font-mono text-sm font-bold uppercase tracking-widest">⬇️ Plateforme Principale (Source - Desktop) ⬇️</div>
      </div>

      {/* 2. PLATEFORME PRINCIPALE (MOCK LAYOUT) */}
      <div className="relative z-0 w-full h-[800px] border-t border-zinc-800 overflow-hidden isolate transform-gpu">
        <SidebarProvider defaultOpen={true} className="h-full w-full">
            <div className="flex h-full w-full bg-background dark:bg-[linear-gradient(155.015deg,var(--app-bg-gradient-start)_3.5121%,var(--app-bg-gradient-mid)_51.814%,var(--app-bg-gradient-end)_94.962%)] text-foreground font-manrope transition-colors duration-300">
                <AppSidebar className="border-r border-border" />
                <main className="flex-1 flex flex-col min-w-0 overflow-auto relative h-full">
                  <header className="flex h-16 shrink-0 items-center gap-2 border-b border-header-border px-4 bg-header-background backdrop-blur-md sticky top-0 z-50 transition-colors">
                    <SidebarTrigger className="text-foreground hover:bg-accent" />
                    <div className="flex-1" />
                    <LanguageToggle />
                    <ModeToggle />
                    <div className="size-8 rounded-full bg-gradient-to-tr from-datavibe-orange to-datavibe-pink ml-4" />
                  </header>
                  <div className="flex-1 p-4 md:p-6">
                    <Dashboard />
                  </div>
                </main>
            </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
