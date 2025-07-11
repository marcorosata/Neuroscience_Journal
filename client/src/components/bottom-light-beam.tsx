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
          // Subtle pulsing effect
          const pulse = 0.7 + Math.sin(timeRef.current * 2) * 0.3;
          beamElement.style.opacity = pulse.toString();
          
          // Slight width variation
          const widthVariation = 100 + Math.sin(timeRef.current * 1.5) * 20;
          beamElement.style.width = `${widthVariation}px`;
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
      {/* Main light beam */}
      <div
        className="light-beam absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '120px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 10%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)',
          filter: 'blur(3px)',
          opacity: 1
        }}
      />
      
      {/* Brighter inner beam */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '60px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 5%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 60%, transparent 100%)',
          filter: 'blur(1px)',
          opacity: 1
        }}
      />
      
      {/* Core beam */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '25px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 3%, rgba(255,255,255,0.6) 15%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          opacity: 1
        }}
      />
      
      {/* Light rays */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '300px',
          height: '80%',
          background: 'conic-gradient(from 0deg at 50% 100%, transparent 0deg, rgba(255,255,255,0.3) 85deg, rgba(255,255,255,0.5) 90deg, rgba(255,255,255,0.3) 95deg, transparent 180deg)',
          opacity: 0.8,
          filter: 'blur(4px)'
        }}
      />
      
      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '400px',
          height: '150px',
          background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.1) 60%, transparent 100%)',
          opacity: 1,
          filter: 'blur(8px)'
        }}
      />
    </div>
  );
}