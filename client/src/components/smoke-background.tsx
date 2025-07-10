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
  angle: number;
  angleSpeed: number;
  scale: number;
  turbulence: number;
}

interface LightningBolt {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  segments: { x: number; y: number }[];
  life: number;
  maxLife: number;
  opacity: number;
  thickness: number;
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
  particleCount = 60,
  colors = ['rgba(180, 30, 30, 0.4)', 'rgba(160, 40, 40, 0.3)', 'rgba(120, 35, 35, 0.25)', 'rgba(100, 25, 25, 0.2)'],
  intensity = 1
}: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const lightningRef = useRef<LightningBolt[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      
      // Enable anti-aliasing and smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
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
      angle: number;
      angleSpeed: number;
      scale: number;
      turbulence: number;

      constructor(x: number, y: number) {
        // Start particles from left side for left-to-right flow
        this.x = x - 100 + Math.random() * 50;
        this.y = y + (Math.random() - 0.5) * 80;
        this.size = Math.random() * 120 + 80; // Larger, softer smoke
        // Very slow, natural smoke flow
        this.speedX = Math.random() * 0.8 + 0.4;
        this.speedY = (Math.random() - 0.5) * 0.15 - 0.1; // Subtle upward drift
        this.opacity = Math.random() * 0.15 + 0.05; // Much more subtle
        this.life = 0;
        this.maxLife = Math.random() * 400 + 300; // Longer-lived smoke
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.01; // Slower rotation
        this.scale = Math.random() * 0.5 + 0.5;
        this.turbulence = Math.random() * 0.02;
      }

      update() {
        this.life++;
        
        // Apply realistic smoke physics
        const time = this.life * 0.01;
        
        // Turbulent motion with natural smoke behavior
        const noiseX = Math.sin(time * 1.5 + this.x * 0.003) * this.turbulence;
        const noiseY = Math.cos(time * 2.2 + this.y * 0.003) * this.turbulence;
        
        this.speedX += noiseX;
        this.speedY += noiseY;
        
        // Gentle mouse interaction like air currents
        const mouseInfluence = 100;
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence && distance > 0) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const forceX = (dx / distance) * force * 0.2;
          const forceY = (dy / distance) * force * 0.2;
          
          this.speedX += forceX;
          this.speedY += forceY;
        }
        
        // Apply movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Realistic air resistance
        this.speedX *= 0.985;
        this.speedY *= 0.985;
        
        // Maintain gentle rightward flow with slight upward drift
        this.speedX += 0.015;
        this.speedY -= 0.005; // Slight upward drift like real smoke
        
        // Add wind-like horizontal variation
        this.speedX += Math.sin(time * 0.5 + this.y * 0.002) * 0.008;
        
        // Slow rotation
        this.angle += this.angleSpeed;
        
        // Gradual size increase as smoke disperses
        this.scale += 0.003;
        
        // Natural fade with smoke dispersal
        const lifeFactor = this.life / this.maxLife;
        this.opacity = Math.max(0, (1 - lifeFactor) * 0.2);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        
        // Apply transformation matrix for rotation and scale
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);
        
        // Create multiple layered gradients for ultra-smooth smoke
        const gradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.3);
        const gradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.6);
        const gradient3 = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        
        // Parse color for red smoke
        const colorMatch = this.color.match(/rgba?\(([^)]+)\)/);
        if (colorMatch) {
          const values = colorMatch[1].split(',').map(v => v.trim());
          const r = values[0];
          const g = values[1];
          const b = values[2];
          const baseAlpha = parseFloat(values[3] || '1') * this.opacity;
          
          // Core gradient (densest)
          gradient1.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.8})`);
          gradient1.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.4})`);
          
          // Middle gradient
          gradient2.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.4})`);
          gradient2.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.1})`);
          
          // Outer gradient (softest edges)
          gradient3.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.2})`);
          gradient3.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.05})`);
          gradient3.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        // Use normal blending for red smoke on black background
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw layered smoke for ultra-smooth appearance
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.fillStyle = gradient3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.opacity * 0.7;
        ctx.fillStyle = gradient1;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      isDead() {
        return this.life >= this.maxLife || this.opacity <= 0;
      }
    }

    class Lightning implements LightningBolt {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      segments: { x: number; y: number }[];
      life: number;
      maxLife: number;
      opacity: number;
      thickness: number;
      color: string;

      constructor() {
        // Lightning bolts travel from left to right across screen
        this.startX = Math.random() * canvas.width * 0.2;
        this.startY = Math.random() * canvas.height;
        this.endX = this.startX + Math.random() * canvas.width * 0.6 + 300;
        this.endY = this.startY + (Math.random() - 0.5) * 200;
        
        this.segments = this.generateLightningPath();
        this.life = 0;
        this.maxLife = Math.random() * 15 + 10; // Very short-lived
        this.opacity = Math.random() * 0.8 + 0.5;
        this.thickness = Math.random() * 3 + 2;
        this.color = 'rgba(255, 255, 255, 1)'; // Bright white lightning
      }

      generateLightningPath(): { x: number; y: number }[] {
        const segments = [];
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
          const progress = i / steps;
          const baseX = this.startX + (this.endX - this.startX) * progress;
          const baseY = this.startY + (this.endY - this.startY) * progress;
          
          // Add jagged variations
          const jitterX = (Math.random() - 0.5) * 30 * (1 - Math.abs(progress - 0.5) * 2);
          const jitterY = (Math.random() - 0.5) * 40 * (1 - Math.abs(progress - 0.5) * 2);
          
          segments.push({
            x: baseX + jitterX,
            y: baseY + jitterY
          });
        }
        
        return segments;
      }

      update() {
        this.life++;
        
        // Fast fade out
        const lifeFactor = this.life / this.maxLife;
        this.opacity = Math.max(0, (1 - lifeFactor) * 0.9);
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.segments.length < 2) return;
        
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = this.opacity;
        
        // Draw main lightning bolt
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        
        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        ctx.stroke();
        
        // Draw glow effect
        ctx.globalAlpha = this.opacity * 0.3;
        ctx.lineWidth = this.thickness * 3;
        ctx.strokeStyle = 'rgba(150, 200, 255, 0.8)';
        ctx.stroke();
        
        // Draw outer glow
        ctx.globalAlpha = this.opacity * 0.1;
        ctx.lineWidth = this.thickness * 6;
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.5)';
        ctx.stroke();
        
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

    const createLightning = () => {
      lightningRef.current.push(new Lightning());
    };

    const animate = () => {
      // Clear canvas with pure black background and subtle trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Better fade for spacing
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply heavy blur for ultra-smooth smoke
      ctx.filter = 'blur(8px)';
      
      // Use normal blending for realistic smoke
      ctx.globalCompositeOperation = 'source-over';
      
      // Update and draw smoke particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      // Switch to lighter mode for lightning effects only
      ctx.globalCompositeOperation = 'lighter';
      
      // Update and draw lightning bolts
      lightningRef.current = lightningRef.current.filter(lightning => {
        lightning.update();
        lightning.draw(ctx);
        return !lightning.isDead();
      });

      // Reset composition mode and filter
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';

      // Create ambient particles from left side for continuous flow
      if (Math.random() < 0.15) {
        createParticles(
          -50, // Start from left edge
          Math.random() * canvas.height,
          1
        );
      }

      // Create lightning bolts occasionally
      if (Math.random() < 0.003) { // Very rare lightning
        createLightning();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Create subtle trail particles on mouse movement
      if (Math.random() < 0.2) {
        createParticles(e.clientX, e.clientY, 1);
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      createParticles(e.clientX, e.clientY, 2);
    };

    const handleClick = (e: MouseEvent) => {
      // Create moderate burst effect on click
      createParticles(e.clientX, e.clientY, 5);
      
      // Create lightning bolt on click
      createLightning();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('click', handleClick);

    // Start animation
    animate();

    // Initial subtle particle spread
    createParticles(canvas.width / 4, canvas.height / 2, 3);

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
      style={{ mixBlendMode: 'normal', backgroundColor: 'black' }}
    />
  );
}