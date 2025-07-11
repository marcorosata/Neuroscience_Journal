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
    // Initialize debris/dust particles
    const initParticles = () => {
      const count = 24; // Doubled particle count for more density, was 12
      particlesRef.current = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60, // Wider spawn area
        y: 100 + Math.random() * 15,
        z: Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.1 - Math.random() * 0.2, // Slower upward motion
        vz: (Math.random() - 0.5) * 0.05,
        size: 1 + Math.random() * 2, // Much smaller particles, was 2-4
        opacity: 0.4 + Math.random() * 0.5, // Slightly brighter, was 0.3-0.4
        life: 0,
        maxLife: 800 + Math.random() * 600,
        temperature: 0.2 + Math.random() * 0.3, // Low temperature for debris
        density: 0.6 + Math.random() * 0.4,
        turbulence: 0.1 + Math.random() * 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5
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

        // Advanced curl noise for realistic turbulence
        const noiseTime = timeRef.current * 0.3 + index * 0.15;
        const curlX = Math.sin(noiseTime + particle.y * 0.015) * particle.turbulence * 
                      Math.cos(noiseTime * 0.7 + particle.z * 0.01);
        const curlY = Math.cos(noiseTime + particle.x * 0.015) * particle.turbulence *
                      Math.sin(noiseTime * 0.5 + particle.z * 0.01);
        const curlZ = Math.sin(noiseTime * 0.8 + particle.x * 0.01 + particle.y * 0.01) * 
                      particle.turbulence * 0.5;

        // Apply turbulence forces
        particle.vx += curlX * 0.015;
        particle.vy += curlY * 0.008;
        particle.vz += curlZ * 0.005;

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

        // Realistic cooling and expansion
        particle.temperature *= 0.9985; // Slower cooling
        particle.size += 0.03 * particle.temperature; // Expansion rate depends on temperature

        // Advanced density and opacity changes
        particle.density *= 0.9975; // Slower density decay
        const temperatureEffect = particle.temperature * 0.4;
        const ageEffect = 1 - Math.pow(ageRatio, 0.8); // Non-linear age effect
        particle.opacity = particle.density * ageEffect * (0.6 + temperatureEffect);

        // Velocity damping (air resistance)
        particle.vx *= 0.99;
        particle.vy *= 0.995;
        particle.vz *= 0.99;

        // Boundary conditions
        if (particle.x < -10) particle.x = 110;
        if (particle.x > 110) particle.x = -10;

        // Reset particle when it dies - debris/dust properties
        if (particle.life >= particle.maxLife || particle.y < -20) {
          particle.x = 20 + Math.random() * 60;
          particle.y = 100 + Math.random() * 15;
          particle.z = Math.random() * 10;
          particle.vx = (Math.random() - 0.5) * 0.1;
          particle.vy = -0.1 - Math.random() * 0.2;
          particle.vz = (Math.random() - 0.5) * 0.05;
          particle.size = 1 + Math.random() * 2; //Halved size
          particle.opacity = 0.4 + Math.random() * 0.5; //Slightly brighter
          particle.life = 0;
          particle.temperature = 0.2 + Math.random() * 0.3;
          particle.density = 0.6 + Math.random() * 0.4;
          particle.turbulence = 0.1 + Math.random() * 0.3;
          particle.rotation = Math.random() * 360;
        }

        // Update DOM element with enhanced visual effects
        const element = containerRef.current?.querySelector(`[data-smoke="${index}"]`) as HTMLElement;
        if (element) {
          const scale = 1 + ageRatio * 0.5;
          const blur = 0.2 + ageRatio * 0.8; // Sharper debris appearance

          element.style.left = `${particle.x}%`;
          element.style.top = `${particle.y}%`;
          element.style.opacity = Math.max(0, particle.opacity).toString();
          element.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${particle.rotation}deg)`;
          element.style.filter = `blur(${blur}px)`;

          // Debris/dust appearance - earthy, grainy colors
          const variation = Math.sin(timeRef.current * 0.05 + index * 0.5) * 20;

          // Earth tones: browns, grays, muted colors for debris
          const baseR = 120 + variation;
          const baseG = 100 + variation * 0.8;
          const baseB = 80 + variation * 0.6;

          const finalR = Math.max(60, Math.min(180, baseR));
          const finalG = Math.max(50, Math.min(150, baseG));
          const finalB = Math.max(40, Math.min(120, baseB));

          // Sharp edges for debris particles, not soft smoke
          element.style.background = `radial-gradient(circle, rgba(${finalR},${finalG},${finalB},${particle.opacity}) 0%, rgba(${finalR-20},${finalG-20},${finalB-20},${particle.opacity * 0.7}) 60%, transparent 100%)`;
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
      {Array.from({ length: 24 }, (_, i) => ( //Updated length to the count
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