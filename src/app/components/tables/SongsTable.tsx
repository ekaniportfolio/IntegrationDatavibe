import { Play, MoreHorizontal, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";

export interface SongItem {
  id: number | string;
  title: string;
  artist: string;
  album: string;
  image: string;
  releaseDate: string;
  streams: number;
  daily: number;
  trend: "up" | "down" | "stable";
  revenue: number;
}

const DEFAULT_SONGS: SongItem[] = [
  { 
    id: 1, 
    title: "Midnight City Dreams", 
    artist: "Neon Pulse", 
    album: "City Lights",
    image: "https://images.unsplash.com/photo-1648229168049-5525383e80dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWxidW0lMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    releaseDate: "2023-11-12",
    streams: 1250000,
    daily: 4500,
    trend: "up",
    revenue: 4200
  },
  { 
    id: 2, 
    title: "Abstract Thoughts", 
    artist: "The Thinkers", 
    album: "Mind Games",
    image: "https://images.unsplash.com/photo-1645919268997-e8f6d5ee81e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFsYnVtJTIwY292ZXIlMjBhcnR8ZW58MXx8fHwxNzY3MzE1Mjg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    releaseDate: "2023-10-05",
    streams: 890000,
    daily: 1200,
    trend: "down",
    revenue: 3100
  },
  { 
    id: 3, 
    title: "Silence & Noise", 
    artist: "Echo Valley", 
    album: "Raw",
    image: "https://images.unsplash.com/photo-1703115015343-81b498a8c080?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbXVzaWMlMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    releaseDate: "2024-01-15",
    streams: 450000,
    daily: 8500,
    trend: "up",
    revenue: 1500
  },
   { 
    id: 4, 
    title: "Lost in Tokyo", 
    artist: "Neon Pulse", 
    album: "City Lights",
    image: "https://images.unsplash.com/photo-1648229168049-5525383e80dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwYWxidW0lMjBjb3ZlcnxlbnwxfHx8fDE3NjczMTUyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    releaseDate: "2023-11-12",
    streams: 320000,
    daily: 200,
    trend: "stable",
    revenue: 950
  },
];

interface SongsTableProps {
  data?: SongItem[];
}

export function SongsTable({ data = DEFAULT_SONGS }: SongsTableProps) {
  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="w-12 text-center py-4 px-4">#</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Titre</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Album</th>
              <th className="text-left py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Streams</th>
              <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">24h</th>
              <th className="text-right py-4 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Revenu</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <motion.tbody 
            className="divide-y divide-white/5"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            <AnimatePresence mode="popLayout">
              {data.map((song, index) => (
                <motion.tr 
                  key={song.id} 
                  className="group hover:bg-white/5 transition-colors"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <td className="py-4 px-4 text-center text-sm text-muted-foreground group-hover:text-foreground">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hidden group-hover:flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 hover:text-black mx-auto">
                          <Play size={14} className="ml-0.5" fill="currentColor" />
                      </Button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img 
                          src={song.image} 
                          alt={song.title} 
                          className="h-10 w-10 rounded object-cover mr-3 border border-white/10"
                      />
                      <div>
                          <div className="font-medium text-white">{song.title}</div>
                          <div className="text-xs text-muted-foreground">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-foreground/80 hidden md:table-cell">
                    {song.album}
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground hidden sm:table-cell">
                    {new Date(song.releaseDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-white font-mono text-right font-medium">
                    {song.streams.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      {song.trend === 'up' && <TrendingUp size={14} className="text-datavibe-green" />}
                      {song.trend === 'down' && <TrendingDown size={14} className="text-datavibe-red" />}
                      {song.trend === 'stable' && <Minus size={14} className="text-muted-foreground" />}
                      
                      <span className={`
                        ${song.trend === 'up' ? 'text-datavibe-green' : ''}
                        ${song.trend === 'down' ? 'text-datavibe-red' : ''}
                        ${song.trend === 'stable' ? 'text-muted-foreground' : ''}
                      `}>
                        {song.daily.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-white font-mono text-right hidden lg:table-cell">
                    €{song.revenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal size={16} />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-[#141414] border-white/10 text-white">
                              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                  Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">
                                  Partager
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer text-red-500 focus:text-red-500">
                                  Supprimer
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}