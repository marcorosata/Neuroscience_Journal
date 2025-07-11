import { useEffect, useRef } from 'react';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  temperature: number;
  density: number;
  turbulence: number;
  rotation: number;
  rotationSpeed: number;
}

interface UltrarealisticSmokeProps {
  className?: string;
}

export default function UltrarealisticSmoke({ className = '' }: UltrarealisticSmokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<SmokeParticle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 50, y: 50, active: false });
  const windRef = useRef({ x: 0, y: 0, strength: 0.5 });
  const timeRef = useRef(0);

  useEffect(() => {
    // Initialize smoke particles with physics properties
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 35 }, (_, i) => ({
        id: i,
        x: 45 + Math.random() * 10, // Start from bottom center
        y: 100 + Math.random() * 5,
        z: Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.4 - Math.random() * 0.3, // Upward motion
        vz: (Math.random() - 0.5) * 0.1,
        size: 8 + Math.random() * 12,
        opacity: 0.6 + Math.random() * 0.3,
        life: 0,
        maxLife: 400 + Math.random() * 300,
        temperature: 0.8 + Math.random() * 0.4, // Heat affects behavior
        density: 0.3 + Math.random() * 0.4,
        turbulence: Math.random() * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      }));
    };

    initParticles();

    // Enhanced mouse tracking with wind simulation
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Calculate wind based on mouse movement
      windRef.current.x = (newX - mouseRef.current.x) * 0.1;
      windRef.current.y = (newY - mouseRef.current.y) * 0.1;
      
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      mouseRef.current.active = true;
      
      setTimeout(() => {
        mouseRef.current.active = false;
        windRef.current.x *= 0.9; // Wind decay
        windRef.current.y *= 0.9;
      }, 150);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Physics-based animation with fluid dynamics simulation
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      particlesRef.current.forEach((particle, index) => {
        // Age particle
        particle.life++;
        const ageRatio = particle.life / particle.maxLife;
        
        // Curl noise for turbulence (simplified)
        const noiseTime = timeRef.current * 0.5 + index * 0.1;
        const curlX = Math.sin(noiseTime + particle.y * 0.02) * particle.turbulence;
        const curlY = Math.cos(noiseTime + particle.x * 0.02) * particle.turbulence;
        
        // Apply forces
        particle.vx += curlX * 0.01;
        particle.vy += curlY * 0.005;
        
        // Buoyancy (hot air rises faster)
        const buoyancy = particle.temperature * 0.1;
        particle.vy -= buoyancy * 0.01;
        
        // Wind influence
        particle.vx += windRef.current.x * 0.02;
        particle.vy += windRef.current.y * 0.02;
        
        // Mouse interaction with realistic physics
        if (mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 20) {
            const force = (20 - distance) / 20;
            const forceX = (dx / distance) * force * 0.5;
            const forceY = (dy / distance) * force * 0.5;
            
            particle.vx += forceX;
            particle.vy += forceY;
          }
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        
        // Atmospheric effects
        particle.rotation += particle.rotationSpeed;
        
        // Cooling and expansion
        particle.temperature *= 0.998;
        particle.size += 0.02; // Smoke expands as it cools
        
        // Density and opacity changes
        particle.density *= 0.995;
        particle.opacity = particle.density * (1 - ageRatio * 0.7);
        
        // Velocity damping (air resistance)
        particle.vx *= 0.99;
        particle.vy *= 0.995;
        particle.vz *= 0.99;
        
        // Boundary conditions
        if (particle.x < -10) particle.x = 110;
        if (particle.x > 110) particle.x = -10;
        
        // Reset particle when it dies
        if (particle.life >= particle.maxLife || particle.y < -15) {
          particle.x = 45 + Math.random() * 10;
          particle.y = 100 + Math.random() * 5;
          particle.z = Math.random() * 10;
          particle.vx = (Math.random() - 0.5) * 0.2;
          particle.vy = -0.4 - Math.random() * 0.3;
          particle.vz = (Math.random() - 0.5) * 0.1;
          particle.size = 8 + Math.random() * 12;
          particle.opacity = 0.6 + Math.random() * 0.3;
          particle.life = 0;
          particle.temperature = 0.8 + Math.random() * 0.4;
          particle.density = 0.3 + Math.random() * 0.4;
          particle.turbulence = Math.random() * 0.5;
          particle.rotation = Math.random() * 360;
        }
        
        // Update DOM element with enhanced visual effects
        const element = containerRef.current?.querySelector(`[data-smoke="${index}"]`) as HTMLElement;
        if (element) {
          const scale = 1 + ageRatio * 0.8;
          const blur = 1 + ageRatio * 3;
          
          element.style.left = `${particle.x}%`;
          element.style.top = `${particle.y}%`;
          element.style.opacity = Math.max(0, particle.opacity).toString();
          element.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${particle.rotation}deg)`;
          element.style.filter = `blur(${blur}px)`;
          
          // Temperature-based color (hot = more white, cool = more gray)
          const heat = particle.temperature;
          const r = Math.min(255, 200 + heat * 55);
          const g = Math.min(255, 200 + heat * 55);
          const b = Math.min(255, 200 + heat * 55);
          
          element.style.background = `radial-gradient(circle, rgba(${r},${g},${b},${particle.density}) 0%, rgba(${r-20},${g-20},${b-20},${particle.density * 0.7}) 40%, rgba(${r-40},${g-40},${b-40},${particle.density * 0.3}) 70%, transparent 100%)`;
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
      {Array.from({ length: 35 }, (_, i) => (
        <div
          key={i}
          data-smoke={i}
          className="absolute rounded-full transition-all duration-75"
          style={{
            width: `${particlesRef.current[i]?.size || 15}px`,
            height: `${particlesRef.current[i]?.size || 15}px`,
            left: `${particlesRef.current[i]?.x || 50}%`,
            top: `${particlesRef.current[i]?.y || 100}%`,
            opacity: particlesRef.current[i]?.opacity || 0.5,
            transform: `translate(-50%, -50%) rotate(${particlesRef.current[i]?.rotation || 0}deg)`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(240,240,240,0.5) 40%, rgba(200,200,200,0.3) 70%, transparent 100%)',
            filter: 'blur(2px)',
            mixBlendMode: 'screen'
          }}
        />
      ))}
    </div>
  );
}