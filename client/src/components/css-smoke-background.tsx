import { useEffect, useRef } from 'react';

interface CSSSmoke {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  drift: number;
  rise: number;
  rotation: number;
  rotationSpeed: number;
}

interface CSSSmokBackgroundProps {
  className?: string;
}

export default function CSSSmokBackground({ className = '' }: CSSSmokBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const smokeClouds = useRef<CSSSmoke[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationId = useRef<number>();

  useEffect(() => {
    // Initialize smoke clouds
    smokeClouds.current = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 40,
      opacity: 0.3 + Math.random() * 0.4,
      drift: (Math.random() - 0.5) * 0.5,
      rise: 0.2 + Math.random() * 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2
    }));

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
    };

    const animate = () => {
      if (!containerRef.current) return;

      smokeClouds.current.forEach((smoke, index) => {
        // Move smoke upward
        smoke.y -= smoke.rise;
        smoke.x += smoke.drift;
        smoke.rotation += smoke.rotationSpeed;

        // Mouse interaction - push smoke away
        const dx = smoke.x - mousePos.current.x;
        const dy = smoke.y - mousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
          const force = (15 - distance) / 15;
          smoke.x += (dx / distance) * force * 2;
          smoke.y += (dy / distance) * force * 2;
        }

        // Reset when smoke goes off screen
        if (smoke.y < -10) {
          smoke.y = 110;
          smoke.x = Math.random() * 100;
          smoke.opacity = 0.3 + Math.random() * 0.4;
        }

        // Keep smoke within bounds horizontally
        if (smoke.x < -10) smoke.x = 110;
        if (smoke.x > 110) smoke.x = -10;

        // Update DOM element
        const element = containerRef.current?.querySelector(`[data-smoke-id="${index}"]`) as HTMLElement;
        if (element) {
          element.style.transform = `translate(${smoke.x}vw, ${smoke.y}vh) rotate(${smoke.rotation}deg)`;
          element.style.opacity = smoke.opacity.toString();
        }
      });

      animationId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {smokeClouds.current.map((smoke, index) => (
        <div
          key={smoke.id}
          data-smoke-id={index}
          className="absolute w-16 h-16 bg-gradient-radial from-white/40 via-white/20 to-transparent rounded-full blur-sm"
          style={{
            transform: `translate(${smoke.x}vw, ${smoke.y}vh) rotate(${smoke.rotation}deg)`,
            opacity: smoke.opacity,
            width: `${smoke.size}px`,
            height: `${smoke.size}px`,
            background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)`,
            filter: 'blur(2px)',
            transition: 'opacity 0.3s ease-out'
          }}
        />
      ))}
    </div>
  );
}