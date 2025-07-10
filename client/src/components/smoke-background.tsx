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
  density: number;
  temperature: number;
  viscosity: number;
  swirl: number;
  pressure: number;
  hoverInfluence: number;
  trail: { x: number; y: number; opacity: number }[];
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
  colors = [
    'rgba(180, 30, 30, 0.3)', 
    'rgba(200, 40, 40, 0.25)', 
    'rgba(160, 25, 25, 0.35)',
    'rgba(220, 50, 50, 0.2)',
    'rgba(140, 20, 20, 0.4)',
    'rgba(190, 35, 35, 0.3)',
    'rgba(170, 28, 28, 0.32)',
    'rgba(210, 45, 45, 0.22)'
  ],
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
      density: number;
      temperature: number;
      viscosity: number;
      swirl: number;
      pressure: number;
      hoverInfluence: number;
      trail: { x: number; y: number; opacity: number }[];

      constructor(x: number, y: number) {
        // Hyper-realistic smoke spawning with natural variations
        this.x = x - 200 + Math.random() * 160;
        this.y = y + (Math.random() - 0.5) * 120;
        this.size = Math.random() * 400 + 200; // Massive particles for ultra-realism
        
        // Advanced physics properties
        this.speedX = Math.random() * 0.3 + 0.1;
        this.speedY = (Math.random() - 0.5) * 0.05 - 0.02;
        this.opacity = Math.random() * 0.12 + 0.08; // 15% transparency range
        this.life = 0;
        this.maxLife = Math.random() * 2000 + 1500; // Very long-lived like real smoke
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.001;
        this.scale = Math.random() * 0.2 + 0.3;
        this.turbulence = Math.random() * 0.008;
        
        // Advanced smoke physics
        this.density = Math.random() * 0.8 + 0.2;
        this.temperature = Math.random() * 0.5 + 0.3;
        this.viscosity = Math.random() * 0.02 + 0.01;
        this.swirl = Math.random() * 0.003;
        this.pressure = Math.random() * 0.1 + 0.05;
        this.hoverInfluence = 0;
        this.trail = [];
      }

      update() {
        this.life++;
        const time = this.life * 0.005;
        
        // Store previous position for trail
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity * 0.3 });
        if (this.trail.length > 12) {
          this.trail.shift();
        }
        
        // Advanced turbulence with multiple noise layers
        const mainNoise = Math.sin(time * 0.8 + this.x * 0.001) * Math.cos(time * 1.2 + this.y * 0.0015);
        const detailNoise = Math.sin(time * 3 + this.x * 0.005) * Math.cos(time * 2.5 + this.y * 0.004);
        const microNoise = Math.sin(time * 8 + this.x * 0.01) * Math.cos(time * 6 + this.y * 0.008);
        
        const noiseX = (mainNoise * 0.02 + detailNoise * 0.008 + microNoise * 0.003) * this.turbulence;
        const noiseY = (Math.cos(time * 0.9 + this.x * 0.0012) * 0.015 + 
                       Math.sin(time * 2.8 + this.y * 0.003) * 0.006) * this.turbulence;
        
        // Sophisticated hover interaction with multiple zones
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Multi-zone hover effects
        if (distance < 250) {
          const nearForce = Math.max(0, (250 - distance) / 250);
          
          // Attraction zone (very close)
          if (distance < 80) {
            const attractForce = (80 - distance) / 80;
            this.speedX += (dx / distance) * attractForce * 0.08;
            this.speedY += (dy / distance) * attractForce * 0.08;
            this.hoverInfluence = Math.min(1, this.hoverInfluence + 0.05);
            this.temperature += attractForce * 0.02;
          }
          // Swirl zone (medium distance)
          else if (distance < 150) {
            const swirlForce = nearForce * 0.4;
            const perpX = -dy / distance;
            const perpY = dx / distance;
            this.speedX += perpX * swirlForce * this.swirl * 15;
            this.speedY += perpY * swirlForce * this.swirl * 15;
            this.angleSpeed += swirlForce * 0.002;
          }
          // Gentle push zone (far distance)
          else {
            const pushForce = nearForce * 0.2;
            this.speedX += (dx / distance) * pushForce * -0.03;
            this.speedY += (dy / distance) * pushForce * -0.03;
          }
          
          // Enhanced opacity on hover
          this.opacity *= (1 + nearForce * 0.8);
        } else {
          this.hoverInfluence *= 0.95;
        }
        
        // Apply forces
        this.speedX += noiseX;
        this.speedY += noiseY;
        
        // Density-based movement (heavier smoke moves slower)
        const densityFactor = 1 - this.density * 0.3;
        this.speedX *= densityFactor;
        this.speedY *= densityFactor;
        
        // Temperature effects (hot smoke rises faster)
        this.speedY -= this.temperature * 0.01;
        
        // Viscosity dampening
        this.speedX *= (1 - this.viscosity);
        this.speedY *= (1 - this.viscosity);
        
        // Apply movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Advanced air resistance based on particle size
        const resistance = 0.995 - (this.size / 1000) * 0.01;
        this.speedX *= resistance;
        this.speedY *= resistance;
        
        // Maintain natural rightward flow with atmospheric effects
        this.speedX += 0.008 + Math.sin(time * 0.3 + this.y * 0.001) * 0.004;
        this.speedY -= 0.002 + Math.sin(time * 0.4 + this.x * 0.0008) * 0.001;
        
        // Complex rotation with swirl effects
        this.angle += this.angleSpeed + this.swirl * Math.sin(time * 2);
        
        // Natural expansion as smoke cools and disperses
        this.scale += 0.0008 + (this.temperature * 0.001);
        this.temperature *= 0.998; // Cooling over time
        
        // Pressure-based density changes
        this.density *= 0.9995;
        this.pressure *= 0.997;
        
        // Ultra-realistic fade with multiple factors
        const lifeFactor = this.life / this.maxLife;
        const temperatureFade = Math.max(0.1, this.temperature);
        const densityFade = Math.max(0.05, this.density);
        const hoverBoost = 1 + this.hoverInfluence * 0.5;
        
        this.opacity = Math.max(0, (1 - lifeFactor) * 0.15 * temperatureFade * densityFade * hoverBoost);
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw particle trail for ultra-realistic smoke streams
        if (this.trail.length > 1) {
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          
          for (let i = 0; i < this.trail.length - 1; i++) {
            const current = this.trail[i];
            const next = this.trail[i + 1];
            const trailOpacity = current.opacity * (i / this.trail.length) * 0.3;
            
            if (trailOpacity > 0.001) {
              const gradient = ctx.createRadialGradient(
                current.x, current.y, 0,
                current.x, current.y, this.size * 0.8 * this.scale
              );
              
              const colorMatch = this.color.match(/rgba?\(([^)]+)\)/);
              if (colorMatch) {
                const values = colorMatch[1].split(',').map(v => v.trim());
                const r = values[0], g = values[1], b = values[2];
                
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${trailOpacity})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
              }
              
              ctx.globalAlpha = trailOpacity;
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(current.x, current.y, this.size * 0.8 * this.scale, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();
        }
        
        // Main particle rendering with enhanced realism
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);
        
        // Create ultra-sophisticated layered gradients
        const innerCore = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.15);
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.4);
        const midGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 0.7);
        const outerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        const hazeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.3);
        
        const colorMatch = this.color.match(/rgba?\(([^)]+)\)/);
        if (colorMatch) {
          const values = colorMatch[1].split(',').map(v => v.trim());
          const r = parseInt(values[0]);
          const g = parseInt(values[1]);
          const b = parseInt(values[2]);
          const baseAlpha = parseFloat(values[3] || '1') * this.opacity;
          
          // Temperature-based color variations
          const tempFactor = this.temperature;
          const hotR = Math.min(255, r + tempFactor * 30);
          const hotG = Math.max(0, g - tempFactor * 5);
          const hotB = Math.max(0, b - tempFactor * 10);
          
          // Density-based opacity variations
          const densityAlpha = baseAlpha * (this.density + 0.2);
          
          // Innermost core (hottest, densest)
          innerCore.addColorStop(0, `rgba(${hotR}, ${hotG}, ${hotB}, ${densityAlpha * 1.2})`);
          innerCore.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.9})`);
          
          // Inner gradient
          innerGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.8})`);
          innerGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.5})`);
          
          // Mid gradient
          midGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.4})`);
          midGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.2})`);
          
          // Outer gradient
          outerGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.15})`);
          outerGradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.05})`);
          outerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          // Atmospheric haze
          hazeGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.03})`);
          hazeGradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${densityAlpha * 0.01})`);
          hazeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }
        
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw atmospheric haze layer
        ctx.globalAlpha = this.opacity * 0.15;
        ctx.fillStyle = hazeGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw outer diffusion layer
        ctx.globalAlpha = this.opacity * 0.25;
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mid density layer
        ctx.globalAlpha = this.opacity * 0.4;
        ctx.fillStyle = midGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner concentration layer
        ctx.globalAlpha = this.opacity * 0.6;
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw dense core
        ctx.globalAlpha = this.opacity * 0.8;
        ctx.fillStyle = innerCore;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
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
      // Ultra-smooth background fade with atmospheric perspective
      ctx.fillStyle = 'rgba(0, 0, 0, 0.015)'; // Very subtle fade for persistence
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Apply sophisticated multi-stage blur for maximum realism
      ctx.filter = 'blur(12px) contrast(1.1) brightness(1.05)';
      ctx.globalCompositeOperation = 'source-over';
      
      // Update and draw smoke particles with enhanced rendering
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      // Reset effects for next frame
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';

      // Atmospheric smoke generation with natural variability
      const generationRate = 0.03 + Math.sin(Date.now() * 0.0001) * 0.01;
      if (Math.random() < generationRate) {
        // Multiple spawn points for natural smoke sources
        const spawnPoints = [
          { x: -150, weight: 0.4 },
          { x: -200, weight: 0.3 },
          { x: -100, weight: 0.2 },
          { x: -250, weight: 0.1 }
        ];
        
        const selectedSpawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        createParticles(
          selectedSpawn.x,
          Math.random() * canvas.height,
          Math.random() < selectedSpawn.weight ? 1 : 0
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Calculate mouse velocity for dynamic interaction
      const deltaX = e.clientX - prevX;
      const deltaY = e.clientY - prevY;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Create sophisticated interaction based on movement
      if (velocity > 2) {
        // Fast movement creates more turbulence
        const turbulenceIntensity = Math.min(velocity / 50, 1);
        if (Math.random() < 0.1 + turbulenceIntensity * 0.3) {
          createParticles(e.clientX, e.clientY, Math.floor(turbulenceIntensity * 2) + 1);
        }
      } else if (velocity > 0.5) {
        // Slow movement creates gentle wisps
        if (Math.random() < 0.05) {
          createParticles(e.clientX, e.clientY, 1);
        }
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      // Create atmospheric disturbance on entry
      createParticles(e.clientX, e.clientY, 3);
      
      // Add some random nearby particles for realism
      for (let i = 0; i < 2; i++) {
        createParticles(
          e.clientX + (Math.random() - 0.5) * 100,
          e.clientY + (Math.random() - 0.5) * 100,
          1
        );
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create realistic air burst effect
      const burstCount = 5;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2;
        const distance = Math.random() * 60 + 20;
        createParticles(
          e.clientX + Math.cos(angle) * distance,
          e.clientY + Math.sin(angle) * distance,
          1
        );
      }
      
      // Central burst
      createParticles(e.clientX, e.clientY, 3);
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