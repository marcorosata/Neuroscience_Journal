import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Floating particles with Radboud colors
export function RabouldParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    duration: number;
  }>>([]);

  const colors = [
    'var(--red-impact)',
    'var(--poppy)', 
    'var(--radboud-blue)',
    'var(--radboud-petrol)',
    'var(--radboud-orange)'
  ];

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-20"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated gradient border for cards
export function AnimatedBorder({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-xl opacity-50"
        style={{
          background: 'linear-gradient(45deg, var(--red-impact), var(--poppy), var(--radboud-blue), var(--red-impact))',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative bg-black rounded-xl p-[1px]">
        {children}
      </div>
    </div>
  );
}

// Pulse effect for important elements
export function PulseGlow({ 
  children, 
  color = 'var(--red-impact)',
  className = "" 
}: { 
  children: React.ReactNode; 
  color?: string;
  className?: string; 
}) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        boxShadow: [
          `0 0 20px ${color}20`,
          `0 0 30px ${color}40`,
          `0 0 20px ${color}20`,
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Typing effect for text
export function TypewriterText({ 
  text, 
  delay = 0,
  className = "",
  speed = 0.05 
}: { 
  text: string; 
  delay?: number;
  className?: string;
  speed?: number;
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, speed * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setCurrentIndex(0);
      setDisplayText('');
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [delay]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-red-500"
      >
        |
      </motion.span>
    </span>
  );
}

// Stagger animation container
export function StaggerContainer({ 
  children, 
  stagger = 0.1,
  className = "" 
}: { 
  children: React.ReactNode[]; 
  stagger?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * stagger,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}