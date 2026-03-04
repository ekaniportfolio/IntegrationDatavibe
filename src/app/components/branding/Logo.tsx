import React from "react";

interface LogoProps {
  variant?: "default" | "splash";
  className?: string;
}

export const Logo = ({ variant = "default", className = "" }: LogoProps) => {
  const sizeClass = variant === "splash" ? "text-logo-splash" : "text-logo-default";
  
  return (
    <div 
      className={`content-stretch flex items-center pr-[2px] relative select-none cursor-default notranslate font-logo ${sizeClass} ${className}`}
      translate="no"
      data-name="Logotype"
    >
      <div className="content-stretch flex items-center justify-center mr-[-2px] relative shrink-0" data-name="DATA">
        <span className="text-logo-primary">DATA</span>
      </div>
      <div className="content-stretch flex items-center justify-center mr-[-2px] relative shrink-0" data-name="VIBE">
        <span className="text-logo-accent">VIBE</span>
      </div>
    </div>
  );
};
