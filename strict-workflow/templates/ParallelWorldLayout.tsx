import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TEMPLATE: ParallelWorldLayout
 * 
 * Cette architecture permet de maintenir un état unifié entre deux layouts 
 * radicalement différents (Desktop vs Mobile) tout en gérant les transitions 
 * visiomorphiques.
 * 
 * RÈGLE D'OR (STRICT WORKFLOW): 
 * Les deux mondes sont COMPORTEMENTALEMENT INDÉPENDANTS. 
 * Ne jamais unifier les UI, animations ou positions entre les deux.
 */

interface ParallelWorldProps {
  MobileComponent: React.FC<any>;
  DesktopComponent: React.FC<any>;
}

export const ParallelWorldLayout: React.FC<ParallelWorldProps> = ({ 
  MobileComponent, 
  DesktopComponent 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sharedState, setSharedState] = useState({
    step: 'welcome',
    data: null,
  });

  useEffect(() => {
    const checkMatch = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMatch();
    window.addEventListener("resize", checkMatch);
    return () => window.removeEventListener("resize", checkMatch);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {isMobile ? (
          <motion.div
            key="mobile-world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MobileComponent state={sharedState} setState={setSharedState} />
          </motion.div>
        ) : (
          <motion.div
            key="desktop-world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <DesktopComponent state={sharedState} setState={setSharedState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
