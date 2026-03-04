import React from "react";
import { Target } from "lucide-react";

export const PlanHeader = () => {
    return (
        <div className="flex items-center justify-center gap-2 w-full h-[48px] pointer-events-auto">
             <Target size={18} className="text-foreground" />
             <h3 className="text-[16px] font-manrope font-bold text-foreground leading-tight text-center">
                Plan personnalisé
             </h3>
        </div>
    );
};
