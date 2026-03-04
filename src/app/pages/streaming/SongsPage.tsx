import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SongsTable } from "../../components/tables/SongsTable";
import { Search, Filter, Download } from "lucide-react";
import { useTranslation } from "../../components/language-provider";

export default function SongsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white font-manrope">{t('songs.mySongs')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('songs.catalogDesc')}
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Download size={16} className="mr-2" />
                {t('songs.exportCsv')}
            </Button>
            <Button className="bg-datavibe-primary hover:bg-datavibe-primary/90 text-white">
                {t('songs.addTitle')}
            </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
                placeholder={t('songs.searchPlaceholder')} 
                className="pl-10 bg-white/5 border-white/10 text-white focus:border-datavibe-primary"
            />
        </div>
        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
            <Filter size={16} className="mr-2" />
            {t('songs.filters')}
        </Button>
      </div>

      {/* Main Content */}
      <SongsTable />

    </div>
  );
}