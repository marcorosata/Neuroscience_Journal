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
      {/* Planet surface glow - covers entire bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '60px',
          background: 'radial-gradient(ellipse 120% 100% at 50% 100%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.1) 60%, transparent 100%)',
          opacity: 1,
          filter: 'blur(10px)'
        }}
      />
      
      {/* Main atmospheric beam - wide circular base */}
      <div
        className="light-beam absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '800px',
          height: '100%',
          background: 'radial-gradient(ellipse 100% 200% at 50% 100%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.25) 5%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 70%, transparent 100%)',
          filter: 'blur(8px)',
          opacity: 1,
          clipPath: 'polygon(45% 100%, 55% 100%, 52% 0%, 48% 0%)'
        }}
      />
      
      {/* Secondary beam - medium width */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '400px',
          height: '100%',
          background: 'radial-gradient(ellipse 100% 150% at 50% 100%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 3%, rgba(255,255,255,0.25) 10%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.02) 70%, transparent 100%)',
          filter: 'blur(4px)',
          opacity: 1,
          clipPath: 'polygon(47% 100%, 53% 100%, 51% 0%, 49% 0%)'
        }}
      />
      
      {/* Core beam - narrow concentrated */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '150px',
          height: '100%',
          background: 'radial-gradient(ellipse 100% 120% at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 2%, rgba(255,255,255,0.5) 8%, rgba(255,255,255,0.3) 15%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 60%, transparent 100%)',
          filter: 'blur(1px)',
          opacity: 1,
          clipPath: 'polygon(48% 100%, 52% 100%, 50.5% 0%, 49.5% 0%)'
        }}
      />
      
      {/* Ultra-bright core */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '60px',
          height: '100%',
          background: 'radial-gradient(ellipse 100% 100% at 50% 100%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 1%, rgba(255,255,255,0.7) 5%, rgba(255,255,255,0.4) 12%, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.05) 45%, transparent 100%)',
          opacity: 1,
          clipPath: 'polygon(49% 100%, 51% 100%, 50.2% 0%, 49.8% 0%)'
        }}
      />
      
      {/* Planet horizon glow */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '20px',
          background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          opacity: 1
        }}
      />
      
      {/* Atmospheric scattering effect */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: '1200px',
          height: '80%',
          background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.01) 30%, transparent 50%)',
          filter: 'blur(15px)',
          opacity: 0.8
        }}
      />
    </div>
  );
}