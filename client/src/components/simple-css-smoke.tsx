import { useEffect, useRef } from 'react';

interface SimpleCSSSmoke {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface SimpleCSSSmokProps {
  className?: string;
}

export default function SimpleCSSSmoke({ className = '' }: SimpleCSSSmokProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const smokeParticles = useRef<SimpleCSSSmoke[]>([]);
  const animationId = useRef<number>();

  useEffect(() => {
    // Create smoke particles
    smokeParticles.current = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: 30 + Math.random() * 50,
      speed: 0.5 + Math.random() * 1,
      opacity: 0.6 + Math.random() * 0.4
    }));

    const animate = () => {
      smokeParticles.current.forEach((particle, index) => {
        // Move particle upward
        particle.y -= particle.speed;
        
        // Add some horizontal drift
        particle.x += Math.sin(Date.now() * 0.001 + index) * 0.2;
        
        // Reset when particle goes off screen
        if (particle.y < -20) {
          particle.y = 100 + Math.random() * 20;
          particle.x = Math.random() * 100;
          particle.opacity = 0.6 + Math.random() * 0.4;
        }
        
        // Keep within horizontal bounds
        if (particle.x < -10) particle.x = 110;
        if (particle.x > 110) particle.x = -10;
        
        // Update DOM element
        const element = containerRef.current?.querySelector(`[data-particle="${index}"]`) as HTMLElement;
        if (element) {
          element.style.left = `${particle.x}%`;
          element.style.top = `${particle.y}%`;
          element.style.opacity = particle.opacity.toString();
        }
      });
      
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 5 }}
    >
      {Array.from({ length: 20 }, (_, i) => {
        const particle = smokeParticles.current[i];
        return (
          <div
            key={i}
            data-particle={i}
            className="absolute rounded-full"
            style={{
              left: `${particle?.x || Math.random() * 100}%`,
              top: `${particle?.y || 100}%`,
              width: `${particle?.size || 40}px`,
              height: `${particle?.size || 40}px`,
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.1) 60%, transparent 100%)',
              filter: 'blur(3px)',
              opacity: particle?.opacity || 0.7,
              transform: 'translate(-50%, -50%)',
              animation: `float-${i} ${4 + Math.random() * 3}s ease-in-out infinite alternate`
            }}
          />
        );
      })}
      
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float-0 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(10deg); } }
        @keyframes float-1 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-8deg); } }
        @keyframes float-2 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(12deg); } }
        @keyframes float-3 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-6deg); } }
        @keyframes float-4 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(9deg); } }
        @keyframes float-5 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-11deg); } }
        @keyframes float-6 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(7deg); } }
        @keyframes float-7 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-9deg); } }
        @keyframes float-8 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(13deg); } }
        @keyframes float-9 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-5deg); } }
        @keyframes float-10 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(8deg); } }
        @keyframes float-11 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-10deg); } }
        @keyframes float-12 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(6deg); } }
        @keyframes float-13 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-12deg); } }
        @keyframes float-14 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(11deg); } }
        @keyframes float-15 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-7deg); } }
        @keyframes float-16 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(9deg); } }
        @keyframes float-17 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-8deg); } }
        @keyframes float-18 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(10deg); } }
        @keyframes float-19 { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(-6deg); } }
      `}</style>
    </div>
  );
}