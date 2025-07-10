import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

interface SmokeBackgroundProps {
  className?: string;
}

export default function SmokeBackground({ className = '' }: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple canvas setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple particle creation
    const createParticle = (): Particle => {
      return {
        x: -50,
        y: Math.random() * canvas.height,
        vx: 1 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.5,
        size: 30 + Math.random() * 60,
        opacity: 0.3 + Math.random() * 0.4,
        life: 0
      };
    };

    // Simple animation loop
    const animate = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Simple movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life += 1;
        
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.1;
          particle.vy += (dy / distance) * force * 0.1;
        }
        
        // Fade over time
        particle.opacity *= 0.995;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, 'rgba(255, 50, 50, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 100, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 150, 150, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Remove if too far or too transparent
        return particle.x < canvas.width + 100 && particle.opacity > 0.01;
      });

      // Add new particles
      if (Math.random() < 0.1) {
        particlesRef.current.push(createParticle());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Start with some particles
    for (let i = 0; i < 5; i++) {
      particlesRef.current.push(createParticle());
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 ${className}`}
      style={{ backgroundColor: 'black' }}
    />
  );
}