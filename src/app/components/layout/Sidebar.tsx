import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "../ui/sidebar"
import { 
  Home, 
  BarChart2, 
  Music, 
  Share2, 
  Radio, 
  Award, 
  Link, 
  Settings,
  Activity,
  Users,
  Globe,
  Lightbulb,
  PieChart
} from "lucide-react"
import { useLocation, Link as RouterLink } from "react-router"
import { useTranslation } from "../language-provider"
import { TranslationKey } from "../../utils/translations"

// Navigation Data with Translation Keys
const navMain = [
  {
    title: "nav.general" as TranslationKey,
    items: [
      { title: "nav.home" as TranslationKey, url: "/", icon: Home },
      { title: "nav.summary" as TranslationKey, url: "/bilan", icon: BarChart2 },
    ],
  },
  {
    title: "nav.verticals" as TranslationKey,
    items: [
      {
        title: "nav.streaming" as TranslationKey,
        url: "/streaming",
        icon: Music,
        items: [
          { title: "nav.dashboard" as TranslationKey, url: "/streaming/dashboard" },
          { title: "nav.activity" as TranslationKey, url: "/streaming/activity", icon: Activity },
          { title: "nav.songs" as TranslationKey, url: "/streaming/songs", icon: Music },
        ],
      },
      {
        title: "nav.social" as TranslationKey,
        url: "/social",
        icon: Share2,
        items: [
          { title: "nav.dashboard" as TranslationKey, url: "/social/dashboard" },
          { title: "nav.followers" as TranslationKey, url: "/social/followers", icon: Users },
          { title: "nav.demographics" as TranslationKey, url: "/social/demographics", icon: PieChart },
        ],
      },
      {
        title: "nav.radio" as TranslationKey,
        url: "/radio",
        icon: Radio,
        items: [
          { title: "nav.dashboard" as TranslationKey, url: "/radio/dashboard" },
          { title: "nav.country" as TranslationKey, url: "/radio/country", icon: Globe },
          { title: "nav.strategy" as TranslationKey, url: "/radio/strategy", icon: Lightbulb },
        ],
      },
    ],
  },
  {
    title: "nav.others" as TranslationKey,
    items: [
      { title: "nav.level" as TranslationKey, url: "/levels", icon: Award },
      { title: "nav.connections" as TranslationKey, url: "/connections", icon: Link },
      { title: "nav.settings" as TranslationKey, url: "/settings", icon: Settings },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <div className="absolute inset-0 z-0 hidden dark:block bg-[linear-gradient(147.229deg,rgb(22,19,19)_3.5121%,rgb(43,26,75)_51.814%,rgb(20,4,50)_94.962%)] opacity-95" />
      
      <SidebarHeader className="z-10 h-16 flex items-center justify-center px-4">
        <div className="flex items-center gap-2 w-full">
           {/* Placeholder for Logo */}
           <div className="size-8 rounded bg-datavibe-orange/20 border border-datavibe-orange flex items-center justify-center shrink-0">
             <span className="text-datavibe-orange font-bold">D</span>
           </div>
           <span className="text-sidebar-foreground font-manrope font-bold text-xl truncate group-data-[collapsible=icon]:hidden">
             DataVibe
           </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="z-10 px-2">
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-muted-foreground">{t(group.title)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.items ? (
                      <SidebarMenuSubItemWrapper item={item} currentPath={location.pathname} />
                    ) : (
                      <SidebarMenuButton 
                        asChild 
                        tooltip={t(item.title)}
                        isActive={location.pathname === item.url}
                        className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent data-[active=true]:text-sidebar-foreground data-[active=true]:bg-sidebar-accent"
                      >
                        <RouterLink to={item.url}>
                          {item.icon && <item.icon />}
                          <span>{t(item.title)}</span>
                        </RouterLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function SidebarMenuSubItemWrapper({ item, currentPath }: { item: any, currentPath: string }) {
  const { t } = useTranslation()
  // Simple logic to keep groups open if child is active
  const isActive = currentPath.startsWith(item.url)
  
  return (
    <div className="space-y-1">
      <SidebarMenuButton 
        className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent font-medium"
      >
        {item.icon && <item.icon />}
        <span>{t(item.title)}</span>
      </SidebarMenuButton>
      <SidebarMenuSub className="mr-0 border-l-border">
        {item.items.map((subItem: any) => (
          <SidebarMenuSubItem key={subItem.title}>
            <SidebarMenuSubButton 
              asChild 
              isActive={currentPath === subItem.url}
              className="text-muted-foreground hover:text-sidebar-foreground data-[active=true]:text-datavibe-orange"
            >
              <RouterLink to={subItem.url}>
                {subItem.icon && <subItem.icon className="size-4 opacity-70" />}
                <span>{t(subItem.title)}</span>
              </RouterLink>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </div>
  )
}