import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    rotateX: 10,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
  },
  out: {
    opacity: 0,
    y: -30,
    scale: 1.05,
    rotateX: -5,
  },
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  duration: 0.6,
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
      {/* Page transition overlay */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-red-impact via-berry to-maroon z-50 pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: transitionStage === "out" ? 1 : 0,
          transformOrigin: transitionStage === "out" ? "left" : "right"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
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