import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import { AppSidebar } from "./Sidebar"
import { Outlet } from "react-router"
import { ModeToggle } from "../mode-toggle"
import { LanguageToggle } from "../language-toggle"

export function AppLayout() {
  return (
    <SidebarProvider>
      <div 
        className="flex h-dvh overflow-hidden w-full text-foreground font-manrope transition-colors duration-300"
        style={{
          backgroundImage: "linear-gradient(155.015deg, var(--app-background-gradient-start) 3.5121%, var(--app-background-gradient-middle) 51.814%, var(--app-background-gradient-end) 94.962%)"
        }}
      >
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-auto relative">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-header-border px-4 bg-header-background backdrop-blur-md sticky top-0 z-50 transition-colors">
            <SidebarTrigger className="text-foreground hover:bg-accent" />
            <div className="flex-1" />
            <LanguageToggle />
            <ModeToggle />
            <div className="size-8 rounded-full bg-gradient-to-tr from-datavibe-orange to-datavibe-pink ml-4" />
          </header>
          <div className="flex-1 p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
