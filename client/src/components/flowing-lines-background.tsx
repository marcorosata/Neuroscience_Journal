import { useEffect, useRef } from 'react';

interface FlowingLine {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  trail: { x: number; y: number; opacity: number }[];
  angle: number;
  waveAmplitude: number;
  waveFrequency: number;
  wavePhase: number;
}

interface FlowingLinesBackgroundProps {
  className?: string;
}

export default function FlowingLinesBackground({ className = '' }: FlowingLinesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<FlowingLine[]>([]);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create flowing lines with different colors
    const colors = [
      '#ff006e',  // Pink
      '#fb5607',  // Orange
      '#ffbe0b',  // Yellow
      '#8338ec',  // Purple
      '#3a86ff',  // Blue
      '#06ffa5',  // Cyan
      '#ff4365',  // Red
      '#00f5ff',  // Light blue
    ];

    const createLine = (): FlowingLine => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      
      const speed = 1 + Math.random() * 2;
      
      switch(side) {
        case 0: // Top
          x = Math.random() * canvas.width;
          y = -50;
          vx = (Math.random() - 0.5) * speed;
          vy = speed;
          break;
        case 1: // Right
          x = canvas.width + 50;
          y = Math.random() * canvas.height;
          vx = -speed;
          vy = (Math.random() - 0.5) * speed;
          break;
        case 2: // Bottom
          x = Math.random() * canvas.width;
          y = canvas.height + 50;
          vx = (Math.random() - 0.5) * speed;
          vy = -speed;
          break;
        case 3: // Left
          x = -50;
          y = Math.random() * canvas.height;
          vx = speed;
          vy = (Math.random() - 0.5) * speed;
          break;
      }

      return {
        x,
        y,
        vx,
        vy,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 2 + Math.random() * 4,
        trail: [],
        angle: Math.atan2(vy, vx),
        waveAmplitude: 20 + Math.random() * 40,
        waveFrequency: 0.005 + Math.random() * 0.01,
        wavePhase: Math.random() * Math.PI * 2
      };
    };

    // Initialize lines
    for (let i = 0; i < 15; i++) {
      linesRef.current.push(createLine());
    }
    console.log('Initialized', linesRef.current.length, 'flowing lines');

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Fade effect instead of clear
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      linesRef.current.forEach((line, index) => {
        // Update position with wave motion
        const waveOffset = Math.sin(time * line.waveFrequency + line.wavePhase) * line.waveAmplitude;
        const perpX = -Math.sin(line.angle);
        const perpY = Math.cos(line.angle);
        
        line.x += line.vx;
        line.y += line.vy;
        const actualX = line.x + perpX * waveOffset;
        const actualY = line.y + perpY * waveOffset;

        // Add to trail
        line.trail.push({
          x: actualX,
          y: actualY,
          opacity: 1
        });

        // Limit trail length
        if (line.trail.length > 60) {
          line.trail.shift();
        }

        // Update trail opacity
        line.trail.forEach((point, i) => {
          point.opacity = (i / line.trail.length) * 0.8;
        });

        // Draw trail with gradient
        if (line.trail.length > 1) {
          for (let i = 1; i < line.trail.length; i++) {
            const prev = line.trail[i - 1];
            const curr = line.trail[i];
            
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            
            // Create gradient along the line
            const gradient = ctx.createLinearGradient(prev.x, prev.y, curr.x, curr.y);
            const prevAlpha = Math.floor(prev.opacity * 255).toString(16).padStart(2, '0');
            const currAlpha = Math.floor(curr.opacity * 255).toString(16).padStart(2, '0');
            gradient.addColorStop(0, line.color + prevAlpha);
            gradient.addColorStop(1, line.color + currAlpha);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = line.width * (i / line.trail.length);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // Draw glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = line.color;
        ctx.beginPath();
        ctx.arc(actualX, actualY, line.width * 2, 0, Math.PI * 2);
        ctx.fillStyle = line.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Mouse interaction - lines bend away from cursor
        const dx = actualX - mouseRef.current.x;
        const dy = actualY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          line.vx += (dx / distance) * force * 0.5;
          line.vy += (dy / distance) * force * 0.5;
          
          // Dampen velocity
          line.vx *= 0.98;
          line.vy *= 0.98;
        }

        // Reset line if it goes off screen
        if (line.x < -100 || line.x > canvas.width + 100 || 
            line.y < -100 || line.y > canvas.height + 100) {
          linesRef.current[index] = createLine();
        }
      });
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-10 ${className}`}
      style={{ 
        background: 'linear-gradient(to bottom, #000000, #0a0a0a)',
        pointerEvents: 'none'
      }}
    />
  );
}