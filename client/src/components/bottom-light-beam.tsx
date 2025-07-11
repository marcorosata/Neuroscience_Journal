import { useEffect, useRef } from 'react';

interface BottomLightBeamProps {
  className?: string;
}

export default function BottomLightBeam({ className = '' }: BottomLightBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      
      if (containerRef.current) {
        const beamElement = containerRef.current.querySelector('.light-beam') as HTMLElement;
        if (beamElement) {
          // Subtle pulsing effect for all light layers
          const pulse = 0.85 + Math.sin(timeRef.current * 1.2) * 0.15;
          const layers = containerRef.current.querySelectorAll('.light-layer');
          layers.forEach((layer: Element) => {
            (layer as HTMLElement).style.opacity = pulse.toString();
          });
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-30 ${className}`}
    >
      {/* Ultra-soft planetary glow - main layer */}
      <div
        className="absolute bottom-0 left-0 right-0 light-layer"
        style={{
          height: '100%',
          background: 'radial-gradient(circle at 50% 150%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 70%, transparent 90%)',
          opacity: 1
        }}
      />
      
      {/* Gentle atmospheric glow */}
      <div
        className="absolute bottom-0 left-0 right-0 light-layer"
        style={{
          height: '80%',
          background: 'radial-gradient(ellipse 120% 90% at 50% 100%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.03) 60%, transparent 75%)',
          filter: 'blur(25px)',
          opacity: 0.9
        }}
      />
      
      {/* Subtle inner glow */}
      <div
        className="absolute bottom-0 left-0 right-0 light-layer"
        style={{
          height: '60%',
          background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.01) 60%, transparent 80%)',
          filter: 'blur(30px)',
          opacity: 1
        }}
      />
      
      {/* Very soft horizon light */}
      <div
        className="absolute bottom-0 left-0 right-0 light-layer"
        style={{
          height: '300px',
          background: 'radial-gradient(ellipse 200% 100% at 50% 100%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 5%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: 0.9
        }}
      />
      
      {/* Planet surface subtle glow */}
      <div
        className="absolute bottom-0 left-0 right-0 light-layer"
        style={{
          height: '60px',
          background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          opacity: 0.8,
          filter: 'blur(8px)'
        }}
      />
      
      {/* Ultra-wide atmospheric scatter */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '100%',
          background: 'radial-gradient(circle at 50% 150%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.01) 40%, transparent 60%)',
          filter: 'blur(40px)',
          opacity: 0.7
        }}
      />
    </div>
  );
}