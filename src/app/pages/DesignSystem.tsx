import { Button } from "../components/ui/button";
import { SmartCard } from "../components/common/SmartCard";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Music, Share2, Radio, Activity, ArrowRight } from "lucide-react";
import { useTranslation } from "../components/language-provider";

export default function DesignSystem() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold font-manrope text-white" translate="no">DataVibe Design System</h1>
        <p className="text-muted-foreground max-w-2xl">
          {t("ds.subtitle")}
        </p>
      </div>

      <div className="h-px w-full bg-white/10" />

      {/* 1. Colors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="flex items-center justify-center size-8 rounded bg-white/10 text-sm">1</span>
          {t("ds.colorPalette")}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">{t("ds.visualIdentity")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorCard name="Primary (Streaming)" token="bg-datavibe-primary" hex="#344BFD" />
              <ColorCard name="Secondary (Radio)" token="bg-datavibe-blue" hex="#1286f3" />
              <ColorCard name="Orange (Data)" token="bg-datavibe-orange" hex="#F68D2B" />
              <ColorCard name="Green (Success)" token="bg-datavibe-green" hex="#30B77C" />
              <ColorCard name="Pink (Accent)" token="bg-datavibe-pink" hex="#F4A79D" />
              <ColorCard name="Red (Danger)" token="bg-datavibe-red" hex="#FF2222" />
            </div>
          </div>

          {/* Backgrounds */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground/80">{t("ds.surfaces")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/10">
                <div className="text-white font-medium" translate="no">Background</div>
                <div className="text-xs text-muted-foreground">#0a0a0a</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-white/10">
                <div className="text-white font-medium" translate="no">Card Surface</div>
                <div className="text-xs text-muted-foreground">#141414</div>
              </div>
              <div className="p-4 rounded-xl bg-[linear-gradient(147deg,#161313_3%,#2B1A4B_51%,#140432_95%)] border border-white/10 col-span-2">
                <div className="text-white font-medium" translate="no">App Gradient</div>
                <div className="text-xs text-white/60" translate="no">Linear Gradient (Deep Purple)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-white/10" />

      {/* 2. Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="flex items-center justify-center size-8 rounded bg-white/10 text-sm">2</span>
          {t("ds.typography")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Manrope - Headings */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold text-datavibe-orange" translate="no">Manrope</h3>
              <span className="text-xs text-muted-foreground">{t("ds.usedForHeadings")}</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-bold font-manrope text-white" translate="no">Heading XL</p>
                <p className="text-xs text-muted-foreground mt-1" translate="no">Bold / 36px</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-manrope text-white" translate="no">Heading L</p>
                <p className="text-xs text-muted-foreground mt-1" translate="no">Bold / 24px</p>
              </div>
              <div>
                <p className="text-xl font-bold font-manrope text-white" translate="no">Heading M</p>
                <p className="text-xs text-muted-foreground mt-1" translate="no">Bold / 20px</p>
              </div>
            </div>
          </div>

          {/* Inter - Body */}
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
              <h3 className="text-lg font-semibold text-blue-400" translate="no">Inter</h3>
              <span className="text-xs text-muted-foreground">{t("ds.usedForBody")}</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-base text-foreground/80">
                  {t("ds.pangram")}
                </p>
                <p className="text-xs text-muted-foreground mt-1" translate="no">Body Regular / 16px</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("ds.captionText")}
                </p>
                <p className="text-xs text-muted-foreground mt-1" translate="no">Caption / 14px</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-white/10" />

      {/* 3. Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="flex items-center justify-center size-8 rounded bg-white/10 text-sm">3</span>
          {t("ds.components")}
        </h2>

        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/80 mb-4">{t("ds.buttons")}</h3>
          <div className="flex flex-wrap gap-4">
            <Button translate="no">Default Button</Button>
            <Button variant="secondary" translate="no">Secondary</Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" translate="no">Outline</Button>
            <Button variant="ghost" className="text-white hover:bg-white/10" translate="no">Ghost</Button>
            <Button className="bg-datavibe-orange hover:bg-datavibe-orange/90 text-white">
              <Activity className="mr-2 size-4" /> {t("ds.withIcon")}
            </Button>
            <Button size="icon" variant="outline" className="rounded-full border-white/20">
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 max-w-md">
          <h3 className="text-lg font-semibold text-foreground/80 mb-4">{t("ds.forms")}</h3>
          <div className="space-y-3">
            <Input placeholder="Placeholder text..." className="bg-foreground/[0.04] border-border text-foreground placeholder:text-muted-foreground" />
            <div className="flex gap-2">
              <Input placeholder={t("ds.searchPlaceholder")} className="bg-foreground/[0.04] border-border text-foreground" />
              <Button translate="no">Go</Button>
            </div>
          </div>
        </div>

        {/* Smart Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/80 mb-4">{t("ds.smartCards")}</h3>
          
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="default" translate="no">Default</TabsTrigger>
              <TabsTrigger value="highlight" translate="no">Highlight</TabsTrigger>
              <TabsTrigger value="glass" translate="no">Glassmorphism</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <TabsContent value="default" className="col-span-full grid md:grid-cols-3 gap-6 mt-0">
                <SmartCard title={t("ds.standardCard")} subtitle={t("ds.genericUsage")} icon={Music}>
                  <div className="h-20 flex items-center justify-center bg-foreground/[0.04] rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                    {t("ds.freeContent")}
                  </div>
                </SmartCard>
                <SmartCard title={t("ds.noHeader")} className="flex items-center justify-center">
                  <span className="text-muted-foreground" translate="no">Card Body Only</span>
                </SmartCard>
                <SmartCard>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground" translate="no">Status</span>
                      <Badge className="bg-datavibe-green text-white">{t("ds.active")}</Badge>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-datavibe-green w-3/4" />
                    </div>
                  </div>
                </SmartCard>
              </TabsContent>

              <TabsContent value="highlight" className="col-span-full grid md:grid-cols-3 gap-6 mt-0">
                <SmartCard title="Streaming Highlight" icon={Music} variant="highlight">
                  <p className="text-3xl font-bold text-datavibe-primary mt-2" translate="no">12.5M</p>
                  <p className="text-xs text-datavibe-primary/60">{t("ds.totalListens")}</p>
                </SmartCard>
                <SmartCard title="Radio Focus" icon={Radio} variant="highlight" className="bg-datavibe-blue/10 border-datavibe-blue/20">
                  <p className="text-3xl font-bold text-datavibe-blue mt-2" translate="no">Top 10</p>
                  <p className="text-xs text-datavibe-blue/60">{t("ds.ranking")}</p>
                </SmartCard>
              </TabsContent>

              <TabsContent value="glass" className="col-span-full grid md:grid-cols-3 gap-6 mt-0">
                <SmartCard title={t("ds.glassEffect")} icon={Share2} variant="glass">
                  <div className="text-sm text-foreground/80 mt-2">
                    {t("ds.glassDesc")}
                  </div>
                </SmartCard>
              </TabsContent>
            </div>
          </Tabs>
        </div>

      </section>
      <div className="h-px w-full bg-white/10" />
      
      {/* 4. Layout & Breakpoints */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="flex items-center justify-center size-8 rounded bg-white/10 text-sm">4</span>
          {t("ds.layout")}
        </h2>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white">{t("ds.responsiveGrid")}</h3>
                    <p className="text-xs text-muted-foreground">{t("ds.breakpointViz")}</p>
                </div>
                <div className="flex gap-2 font-mono text-xs">
                    <span className="px-2 py-1 rounded bg-foreground/[0.06] text-muted-foreground sm:bg-datavibe-green/20 sm:text-datavibe-green border border-transparent sm:border-datavibe-green/30" translate="no">SM</span>
                    <span className="px-2 py-1 rounded bg-foreground/[0.06] text-muted-foreground md:bg-datavibe-green/20 md:text-datavibe-green border border-transparent md:border-datavibe-green/30" translate="no">MD</span>
                    <span className="px-2 py-1 rounded bg-foreground/[0.06] text-muted-foreground lg:bg-datavibe-green/20 lg:text-datavibe-green border border-transparent lg:border-datavibe-green/30" translate="no">LG</span>
                    <span className="px-2 py-1 rounded bg-foreground/[0.06] text-muted-foreground xl:bg-datavibe-green/20 xl:text-datavibe-green border border-transparent xl:border-datavibe-green/30" translate="no">XL</span>
                    <span className="px-2 py-1 rounded bg-foreground/[0.06] text-muted-foreground 2xl:bg-datavibe-green/20 2xl:text-datavibe-green border border-transparent 2xl:border-datavibe-green/30" translate="no">2XL</span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Mobile (sm)', size: '640px' },
                    { label: 'Tablet (md)', size: '768px' },
                    { label: 'Desktop (lg)', size: '1024px' },
                    { label: 'Wide (xl)', size: '1280px' },
                    { label: 'Ultra (2xl)', size: '1536px' },
                ].map((bp) => (
                    <div key={bp.label} className="p-3 bg-black/40 rounded border border-white/5 text-center">
                        <div className="text-datavibe-primary font-bold font-mono text-sm" translate="no">{bp.label.split(' ')[1]}</div>
                        <div className="text-xs text-muted-foreground">{bp.size}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

    </div>
  );
}

function ColorCard({ name, token, hex }: { name: string; token: string; hex: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
      <div className={`size-12 rounded-full shadow-lg shrink-0 ${token}`} />
      <div>
        <div className="text-white font-medium" translate="no">{name}</div>
        <div className="text-xs font-mono text-muted-foreground uppercase">{hex}</div>
      </div>
    </div>
  );
}