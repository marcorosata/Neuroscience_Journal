import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    scale: 1.02,
    y: -4,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94], // Gentle ease curve
  duration: 0.7,
};

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("in");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("out");
    }
  }, [location, displayLocation]);

  return (
    <div className="relative overflow-hidden">
      {/* Gentle morphing overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-white/5 to-transparent z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: transitionStage === "out" ? 0.1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onAnimationComplete={() => {
          if (transitionStage === "out") {
            setDisplayLocation(location);
            setTransitionStage("in");
          }
        }}
      />
      
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={displayLocation}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{
            transformOrigin: "center center",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Gentle stagger animation for page sections
export function PageSection({ 
  children, 
  delay = 0,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: delay * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
}

// Enhanced route transition hook with gentle timing
export function useRouteTransition() {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  return { isTransitioning };
}