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
      className={`fixed inset-0 pointer-events-none z-5 ${className}`}
    >
      {/* Main light beam */}
      <div
        className="light-beam absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '100px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.02) 80%, transparent 100%)',
          filter: 'blur(2px)',
          opacity: 0.8
        }}
      />
      
      {/* Brighter inner beam */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '40px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.03) 60%, transparent 100%)',
          filter: 'blur(1px)',
          opacity: 0.9
        }}
      />
      
      {/* Core beam */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '15px',
          height: '100%',
          background: 'linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 10%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.05) 40%, transparent 100%)',
          opacity: 1
        }}
      />
      
      {/* Light rays */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '200px',
          height: '60%',
          background: 'conic-gradient(from 0deg at 50% 100%, transparent 0deg, rgba(255,255,255,0.1) 85deg, rgba(255,255,255,0.2) 90deg, rgba(255,255,255,0.1) 95deg, transparent 180deg)',
          opacity: 0.6,
          filter: 'blur(3px)'
        }}
      />
      
      {/* Bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '300px',
          height: '100px',
          background: 'radial-gradient(ellipse at center bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          opacity: 0.7,
          filter: 'blur(5px)'
        }}
      />
    </div>
  );
}