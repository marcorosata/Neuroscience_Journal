import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

interface SmokeBackgroundProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  intensity?: number;
}

export default function SmokeBackground({
  className = '',
  particleCount = 30,
  colors = ['rgba(59, 130, 246, 0.3)', 'rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.3)'],
  intensity = 1
}: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SmokeParticle implements Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
      maxLife: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x + (Math.random() - 0.5) * 40;
        this.y = y + (Math.random() - 0.5) * 40;
        this.size = Math.random() * 8 + 3;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 120 + 60;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.life++;
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Gradually slow down and fade
        this.speedX *= 0.995;
        this.speedY *= 0.995;
        this.opacity = Math.max(0, this.opacity - 0.008);
        
        // Subtle drift upward
        this.speedY -= 0.02;
        
        // Add some turbulence
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.speedY += (Math.random() - 0.5) * 0.1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        
        // Create a soft, blurred circle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        // Create gradient with proper color parsing
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace(/[\d.]+\)$/, '0.1)'));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife || this.opacity <= 0;
      }
    }

    const createParticles = (x: number, y: number, count: number = particleCount) => {
      for (let i = 0; i < count * intensity; i++) {
        particlesRef.current.push(new SmokeParticle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      // Occasionally create ambient particles
      if (Math.random() < 0.02) {
        createParticles(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          2
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Create particles on mouse movement with throttling
      if (Math.random() < 0.4) {
        createParticles(e.clientX, e.clientY, Math.ceil(particleCount * 0.4));
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      createParticles(e.clientX, e.clientY, particleCount);
    };

    const handleClick = (e: MouseEvent) => {
      // Create burst effect on click
      createParticles(e.clientX, e.clientY, particleCount * 2);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('click', handleClick);

    // Start animation
    animate();

    // Initial particle burst
    createParticles(canvas.width / 2, canvas.height / 2, particleCount * 2);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('click', handleClick);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, colors, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  );
}