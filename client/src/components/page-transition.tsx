import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -12,
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1],
  duration: 0.4,
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
      {/* Minimal page transition overlay */}
      <motion.div
        className="fixed inset-0 bg-white z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: transitionStage === "out" ? 0.3 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
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
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Stagger animation for page sections
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Enhanced route transition hook
export function useRouteTransition() {
  const [location] = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return { isTransitioning };
}