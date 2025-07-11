import { useEffect, useRef } from 'react';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  life: number;
  maxLife: number;
}

interface WorkingSmokeProps {
  className?: string;
}

export default function WorkingSmoke({ className = '' }: WorkingSmokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 50, y: 50, active: false });

  useEffect(() => {
    // Initialize smoke particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 100 + Math.random() * 10,
        size: 15 + Math.random() * 25,
        opacity: 0.4 + Math.random() * 0.4,
        speed: 0.3 + Math.random() * 0.5,
        drift: (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 300 + Math.random() * 200
      }));
    };

    initParticles();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseRef.current.active = true;
      
      setTimeout(() => {
        mouseRef.current.active = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      particlesRef.current.forEach((particle, index) => {
        // Age the particle
        particle.life++;
        
        // Move upward
        particle.y -= particle.speed;
        
        // Horizontal drift
        particle.x += particle.drift;
        
        // Mouse interaction - push particles away
        if (mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 15) {
            const force = (15 - distance) / 15;
            particle.x += (dx / distance) * force * 2;
            particle.y += (dy / distance) * force * 2;
          }
        }
        
        // Fade out as particle ages
        const ageRatio = particle.life / particle.maxLife;
        particle.opacity = Math.max(0, (0.8 - ageRatio) * (0.4 + Math.random() * 0.4));
        
        // Reset particle when it dies or goes off screen
        if (particle.life >= particle.maxLife || particle.y < -10) {
          particle.x = Math.random() * 100;
          particle.y = 100 + Math.random() * 10;
          particle.life = 0;
          particle.opacity = 0.4 + Math.random() * 0.4;
          particle.speed = 0.3 + Math.random() * 0.5;
          particle.drift = (Math.random() - 0.5) * 0.3;
        }
        
        // Keep within horizontal bounds
        if (particle.x < -5) particle.x = 105;
        if (particle.x > 105) particle.x = -5;
        
        // Update DOM element
        const element = containerRef.current?.querySelector(`[data-smoke="${index}"]`) as HTMLElement;
        if (element) {
          element.style.left = `${particle.x}%`;
          element.style.top = `${particle.y}%`;
          element.style.opacity = particle.opacity.toString();
          element.style.transform = `translate(-50%, -50%) scale(${1 + ageRatio * 0.5})`;
        }
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
    >
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          data-smoke={i}
          className="absolute rounded-full transition-all duration-100"
          style={{
            width: `${particlesRef.current[i]?.size || 20}px`,
            height: `${particlesRef.current[i]?.size || 20}px`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)',
            filter: 'blur(2px)',
            left: `${particlesRef.current[i]?.x || Math.random() * 100}%`,
            top: `${particlesRef.current[i]?.y || 100}%`,
            opacity: particlesRef.current[i]?.opacity || 0.5,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}