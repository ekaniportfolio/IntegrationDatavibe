import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Activity, Terminal, Layout, Layers, Play, RefreshCw, ChevronRight } from "lucide-react";

import { ReflexOpportunity } from "@/app/reflex-matrix/ReflexOpportunity";

/**
 * REFLEX MATRIX LAB - v1.1.0 (FEAT: MIRROR PROTOCOL)
 * 
 * - FEAT: Added Mirror Protocol Inspector (Agnostic vs Implementation).
 * - FEAT: Updated environment to support fluid width specimen testing.
 * - FIX: Using @ alias for all imports.
 * - MAINTAIN: Organic membrane workspace.
 */

// --- RM PROTOCOL PHYSICS (SOUL_PHYSICS) ---
const SOUL_PHYSICS_RM = {
    type: "spring",
    stiffness: 150,
    damping: 18,
    mass: 1.2,
    restDelta: 0.001
};

const MIRROR_RULES = [
    {
        title: "Inverse Trapdoor",
        agnostic: "Add 100vh padding & scroll to target headroom (10rem).",
        datavibe: "isScrolling state + animate(window.scrollY, target)."
    },
    {
        title: "Lateral Transmigration",
        agnostic: "Elements enter from +/- 800px with 10px blur.",
        datavibe: "x: i % 2 === 0 ? -1000 : 1000, filter: 'blur(10px)'."
    },
    {
        title: "Organic Mitosis",
        agnostic: "Morph from Mother Opacity (10%) to Target Color (4s).",
        datavibe: "COLORS.MOTHER -> COLORS.EMERALD transition."
    }
];

export function RMLab() {
    const [isDivided, setIsDivided] = useState(false);
    const [logs, setLogs] = useState<string[]>(["[SYSTEM] Reflex Matrix Lab Initialized", "[STATUS] Soul Physics: ONLINE", "[MIRROR] Protocol Synced"]);
    const [showMirror, setShowMirror] = useState(false);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleTrigger = () => {
        setIsDivided(!isDivided);
        addLog(isDivided ? "REUNITING MEMBRANES..." : "INITIATING CELLULAR DIVISION...");
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-manrope selection:bg-violet-500/30 overflow-hidden relative flex flex-col">
            
            {/* --- SVG GOOEY FILTER --- */}
            <svg className="absolute w-0 h-0 opacity-0 pointer-events-none">
                <defs>
                    <filter id="rm-organic-goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            {/* --- HEADER --- */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl z-[100]">
                <div className="flex items-center gap-3">
                    <motion.div 
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 40px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.3)"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Activity size={18} className="text-white" />
                    </motion.div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">Reflex Matrix Workspace</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Isolated Lab Environment v1.1 // Spatial Flow Protocol</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/60">SIMULATION ACTIVE</span>
                    </div>
                    <a href="/" className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">Exit to Platform</a>
                </div>
            </header>

            {/* --- MAIN WORKSPACE --- */}
            <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
                
                {/* 🧪 LEFT PANEL: THE SPECIMEN (STAGING AREA) */}
                <div className="flex-[2] relative bg-white/[0.04] border border-white/10 rounded-3xl overflow-y-auto overflow-x-hidden flex flex-col scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 shadow-[inset_0_0_100px_rgba(255,255,255,0.02)]">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0f0f0f]/90 backdrop-blur-xl z-20">
                        <div className="flex items-center gap-2">
                            <Layers size={16} className="text-violet-500" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Visual Specimen: Membrane Trinity</h2>
                        </div>
                        <button 
                            onClick={() => setIsDivided(false)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-start relative p-12 pt-8 pb-32 gap-12">
                        {/* SPECIMEN A: REFLEX EVOLUTION */}
                        <div className="flex flex-col items-center gap-6 w-full">
                            <span className="text-[10px] font-black text-violet-500/60 uppercase tracking-[0.4em] animate-pulse">Live Evolution Specimen: Membrane Reflex</span>
                            <div className="w-full max-w-[585px]">
                                <ReflexOpportunity 
                                    isDivided={isDivided}
                                    setIsDivided={setIsDivided}
                                    onTrigger={() => addLog("EVOLUTION_CELL_DIVIDE")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* HUD OVERLAYS */}
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between pointer-events-none">
                        <div className="text-[10px] font-mono text-white/20">POLARITY: {isDivided ? 'ACTIVE' : 'NEUTRAL'}</div>
                        <div className="text-[10px] font-mono text-white/20">COORD: 34.092 // 118.328</div>
                    </div>
                </div>

                {/* 🖥️ RIGHT PANEL: INSPECTOR & CONSOLE */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    {/* MIRROR PROTOCOL INSPECTOR */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={16} className={`text-violet-400 ${showMirror ? 'animate-spin' : ''}`} />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Mirror Protocol</h2>
                            </div>
                            <button 
                                onClick={() => setShowMirror(!showMirror)}
                                className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-colors uppercase"
                            >
                                {showMirror ? 'Hide' : 'Inspect'}
                            </button>
                        </div>
                        
                        <AnimatePresence mode="wait">
                            {showMirror ? (
                                <motion.div 
                                    key="mirror-active"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4 relative z-10"
                                >
                                    {MIRROR_RULES.map((rule, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                            <div className="text-[11px] font-bold text-violet-400">{rule.title}</div>
                                            <div className="grid grid-cols-2 gap-3 text-[9px] font-mono leading-relaxed">
                                                <div className="space-y-1">
                                                    <div className="text-white/20 uppercase tracking-tighter">Agnostic Rule</div>
                                                    <div className="text-white/60">{rule.agnostic}</div>
                                                </div>
                                                <div className="space-y-1 border-l border-white/5 pl-3">
                                                    <div className="text-white/20 uppercase tracking-tighter">DataVibe Imp.</div>
                                                    <div className="text-white/80 italic">{rule.datavibe}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="mirror-idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-20 flex items-center justify-center border border-dashed border-white/5 rounded-xl"
                                >
                                    <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Protocol Mirroring Idle</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* PHYSICS INSPECTOR */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Layout size={16} className="text-indigo-400" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">Soul Physics Parameters</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Stiffness", val: SOUL_PHYSICS_RM.stiffness, color: "bg-violet-500" },
                                { label: "Damping", val: SOUL_PHYSICS_RM.damping, color: "bg-indigo-500" },
                                { label: "Mass", val: SOUL_PHYSICS_RM.mass, color: "bg-blue-500" }
                            ].map((p, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-white/40 uppercase">{p.label}</span>
                                        <span className="text-white">{p.val}</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${p.color}`} style={{ width: `${(p.val / 200) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONSOLE */}
                    <div className="flex-1 bg-black border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Matrix Telemetry</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-white/5" />
                                <div className="w-2 h-2 rounded-full bg-white/5" />
                            </div>
                        </div>
                        <div className="flex-1 p-4 font-mono text-[11px] space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none">
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-3">
                                    <span className="text-white/20 whitespace-nowrap">{i + 1}</span>
                                    <span className={`${log.includes('DIVISION') ? 'text-violet-400' : 'text-white/60'}`}>{log}</span>
                                </div>
                            ))}
                            <div className="flex gap-3 animate-pulse">
                                <span className="text-white/20">_</span>
                                <div className="w-2 h-4 bg-violet-500/50" />
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* --- FOOTER STATUS --- */}
            <footer className="h-10 border-t border-white/5 bg-black px-8 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-white/20">
                <div className="flex gap-6">
                    <span>Freq: 440Hz</span>
                    <span>State: {isDivided ? 'Dual' : 'Singular'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    <span>RM_NODE_01 // SECURE</span>
                </div>
            </footer>

            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
        </div>
    );
}
