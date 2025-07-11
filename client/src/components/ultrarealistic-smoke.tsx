import { useEffect, useRef } from 'react';

interface LunarDustParticle {
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
  charge: number; // Electrostatic charge
  mass: number; // Particle mass for gravity
  reflectivity: number; // Metallic sheen
  angularShape: number; // Sharp edges factor
  clumpFactor: number; // Tendency to clump
  rotation: number;
  rotationSpeed: number;
}

interface UltrarealisticSmokeProps {
  className?: string;
}

export default function UltrarealisticSmoke({ className = '' }: UltrarealisticSmokeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<LunarDustParticle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 50, y: 50, active: false });
  const gravityRef = useRef({ x: 0, y: 0.16, strength: 1 }); // Lunar gravity ~1/6 Earth
  const timeRef = useRef(0);

  useEffect(() => {
    // Initialize lunar dust particles
    const initParticles = () => {
      const count = 150; // Many fine particles
      particlesRef.current = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Scattered across screen
        y: 90 + Math.random() * 20, // Start near bottom
        z: Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.02, // Very slow horizontal drift
        vy: -0.05 - Math.random() * 0.1, // Slow upward motion (low gravity)
        vz: (Math.random() - 0.5) * 0.01,
        size: 0.1 + Math.random() * 0.3, // Extremely fine particles
        opacity: 0.7 + Math.random() * 0.3, // Visible but dusty
        life: 0,
        maxLife: 1200 + Math.random() * 800, // Longer lifetime
        charge: (Math.random() - 0.5) * 0.8, // Electrostatic charge
        mass: 0.5 + Math.random() * 0.5, // Variable mass
        reflectivity: 0.3 + Math.random() * 0.4, // Metallic sheen
        angularShape: Math.random() * Math.PI * 2, // Sharp edge angle
        clumpFactor: 0.2 + Math.random() * 0.3, // Clumping tendency
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8 // Slower rotation
      }));
    };

    initParticles();

    // Mouse tracking for disturbance (no air, so direct impact only)
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;

      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
      mouseRef.current.active = true;

      setTimeout(() => {
        mouseRef.current.active = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Lunar physics simulation
    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      particlesRef.current.forEach((particle, index) => {
        // Age particle
        particle.life++;
        const ageRatio = particle.life / particle.maxLife;

        // Lunar gravity (1/6 Earth gravity)
        particle.vy += gravityRef.current.y * particle.mass * 0.001;

        // Electrostatic forces between particles
        particlesRef.current.forEach((other, otherIndex) => {
          if (index === otherIndex) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 5 && distance > 0.1) {
            // Electrostatic attraction/repulsion
            const chargeForce = (particle.charge * other.charge) / (distance * distance) * 0.01;
            particle.vx -= (dx / distance) * chargeForce;
            particle.vy -= (dy / distance) * chargeForce;
            
            // Clumping effect for opposite charges
            if (particle.charge * other.charge < 0 && distance < 2) {
              particle.vx += (dx / distance) * particle.clumpFactor * 0.001;
              particle.vy += (dy / distance) * particle.clumpFactor * 0.001;
            }
          }
        });

        // Mouse interaction - direct impact (no air)
        if (mouseRef.current.active) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 15) {
            const force = (15 - distance) / 15;
            const forceX = (dx / distance) * force * 0.8;
            const forceY = (dy / distance) * force * 0.8;

            particle.vx += forceX;
            particle.vy += forceY;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Rotation (angular momentum preserved in vacuum)
        particle.rotation += particle.rotationSpeed;

        // No air resistance in vacuum - particles maintain velocity
        // Only slight damping from particle collisions
        particle.vx *= 0.999;
        particle.vy *= 0.998; // Slightly more damping vertically due to settling
        particle.vz *= 0.999;
        
        // Opacity based on reflectivity and age
        const reflectionAngle = Math.abs(Math.cos(particle.angularShape + timeRef.current * 0.01));
        particle.opacity = (0.5 + particle.reflectivity * reflectionAngle * 0.5) * (1 - ageRatio * 0.3);

        // Boundary conditions
        if (particle.x < -10) particle.x = 110;
        if (particle.x > 110) particle.x = -10;

        // Reset particle when it dies - lunar dust properties
        if (particle.life >= particle.maxLife || particle.y < -20 || particle.y > 120) {
          particle.x = Math.random() * 100;
          particle.y = 90 + Math.random() * 20;
          particle.z = Math.random() * 20;
          particle.vx = (Math.random() - 0.5) * 0.02;
          particle.vy = -0.05 - Math.random() * 0.1;
          particle.vz = (Math.random() - 0.5) * 0.01;
          particle.size = 0.1 + Math.random() * 0.3;
          particle.opacity = 0.7 + Math.random() * 0.3;
          particle.life = 0;
          particle.charge = (Math.random() - 0.5) * 0.8;
          particle.mass = 0.5 + Math.random() * 0.5;
          particle.reflectivity = 0.3 + Math.random() * 0.4;
          particle.angularShape = Math.random() * Math.PI * 2;
          particle.rotation = Math.random() * 360;
        }

        // Update DOM element with lunar dust visual effects
        const element = containerRef.current?.querySelector(`[data-smoke="${index}"]`) as HTMLElement;
        if (element) {
          const scale = 1; // No expansion in vacuum
          const blur = 0; // Sharp particles

          element.style.left = `${particle.x}%`;
          element.style.top = `${particle.y}%`;
          element.style.opacity = Math.max(0, particle.opacity).toString();
          element.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${particle.rotation}deg)`;
          element.style.filter = `blur(${blur}px) brightness(${0.8 + particle.reflectivity * 0.4})`;

          // Lunar dust appearance - gray/silver with metallic sheen
          const shimmer = Math.sin(timeRef.current * 0.02 + particle.angularShape) * particle.reflectivity * 30;
          
          // Lunar regolith colors: gray to silver
          const baseGray = 140 + shimmer;
          const finalColor = Math.max(100, Math.min(200, baseGray));

          // Create angular shape with metallic appearance
          const gradient = particle.charge > 0 
            ? `conic-gradient(from ${particle.angularShape}rad, rgba(${finalColor},${finalColor},${finalColor + 10},${particle.opacity}) 0%, rgba(${finalColor - 20},${finalColor - 20},${finalColor - 10},${particle.opacity * 0.8}) 25%, rgba(${finalColor + 20},${finalColor + 20},${finalColor + 30},${particle.opacity}) 50%, rgba(${finalColor - 10},${finalColor - 10},${finalColor},${particle.opacity * 0.9}) 75%, rgba(${finalColor},${finalColor},${finalColor + 10},${particle.opacity}) 100%)`
            : `radial-gradient(circle at 30% 30%, rgba(${finalColor + 20},${finalColor + 20},${finalColor + 30},${particle.opacity}) 0%, rgba(${finalColor},${finalColor},${finalColor + 10},${particle.opacity * 0.9}) 40%, rgba(${finalColor - 20},${finalColor - 20},${finalColor - 10},${particle.opacity * 0.7}) 100%)`;
          
          element.style.background = gradient;
          element.style.boxShadow = particle.reflectivity > 0.5 
            ? `0 0 ${particle.size * 2}px rgba(${finalColor},${finalColor},${finalColor + 20},0.3)` 
            : 'none';
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
      {Array.from({ length: 150 }, (_, i) => ( // Many fine lunar dust particles
        <div
          key={i}
          data-smoke={i}
          className="absolute transition-none" // Remove rounded-full for angular shapes
          style={{
            width: `${particlesRef.current[i]?.size || 2}px`,
            height: `${particlesRef.current[i]?.size || 2}px`,
            left: `${particlesRef.current[i]?.x || 50}%`,
            top: `${particlesRef.current[i]?.y || 100}%`,
            opacity: particlesRef.current[i]?.opacity || 0.8,
            transform: `translate(-50%, -50%) rotate(${particlesRef.current[i]?.rotation || 0}deg)`,
            background: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #909090 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', // Octagonal shape
            mixBlendMode: 'normal',
            filter: 'none'
          }}
        />
      ))}
    </div>
  );
}