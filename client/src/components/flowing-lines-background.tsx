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
  lightningNodes: { x: number; y: number }[];
  flickerIntensity: number;
  branchChance: number;
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
        width: 1 + Math.random() * 3,
        trail: [],
        angle: Math.atan2(vy, vx),
        waveAmplitude: 20 + Math.random() * 40,
        waveFrequency: 0.005 + Math.random() * 0.01,
        wavePhase: Math.random() * Math.PI * 2,
        lightningNodes: [],
        flickerIntensity: 0.8 + Math.random() * 0.2,
        branchChance: 0.02 + Math.random() * 0.03
      };
    };

    // Initialize lines - more lightning bolts
    for (let i = 0; i < 20; i++) {
      linesRef.current.push(createLine());
    }
    console.log('Initialized', linesRef.current.length, 'lightning bolts');

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
        // Update position
        line.x += line.vx;
        line.y += line.vy;

        // Ensure lightningNodes is initialized
        if (!line.lightningNodes) {
          line.lightningNodes = [];
        }

        // Generate lightning nodes - jagged path
        if (line.lightningNodes.length === 0 || Math.random() < 0.1) {
          line.lightningNodes = [];
          const segments = 8 + Math.floor(Math.random() * 12);
          
          for (let i = 0; i < segments; i++) {
            const progress = i / segments;
            const baseX = line.x + line.vx * progress * 100;
            const baseY = line.y + line.vy * progress * 100;
            
            // Add jagged offset - lightning-like sharp angles
            const zigzagOffset = (Math.random() - 0.5) * 60;
            const perpX = -Math.sin(line.angle);
            const perpY = Math.cos(line.angle);
            
            line.lightningNodes.push({
              x: baseX + perpX * zigzagOffset,
              y: baseY + perpY * zigzagOffset
            });
          }
        }

        // Draw lightning bolt with flicker effect
        if (line.lightningNodes.length > 1) {
          const flicker = Math.random() < 0.3 ? 0.3 : 1; // Random flicker
          const flickerIntensity = line.flickerIntensity * flicker;
          
          ctx.shadowBlur = 15 * flickerIntensity;
          ctx.shadowColor = line.color;
          
          // Draw main lightning bolt
          ctx.beginPath();
          ctx.moveTo(line.lightningNodes[0].x, line.lightningNodes[0].y);
          
          for (let i = 1; i < line.lightningNodes.length; i++) {
            ctx.lineTo(line.lightningNodes[i].x, line.lightningNodes[i].y);
          }
          
          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.width * flickerIntensity;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
          
          // Draw inner bright core
          ctx.beginPath();
          ctx.moveTo(line.lightningNodes[0].x, line.lightningNodes[0].y);
          
          for (let i = 1; i < line.lightningNodes.length; i++) {
            ctx.lineTo(line.lightningNodes[i].x, line.lightningNodes[i].y);
          }
          
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, line.width * 0.3 * flickerIntensity);
          ctx.stroke();
          
          // Draw branches occasionally
          if (Math.random() < line.branchChance) {
            const branchStart = Math.floor(Math.random() * line.lightningNodes.length);
            const branchNode = line.lightningNodes[branchStart];
            
            if (branchNode) {
              const branchLength = 3 + Math.floor(Math.random() * 5);
              const branchAngle = line.angle + (Math.random() - 0.5) * Math.PI * 0.5;
              
              ctx.beginPath();
              ctx.moveTo(branchNode.x, branchNode.y);
              
              for (let i = 1; i < branchLength; i++) {
                const branchX = branchNode.x + Math.cos(branchAngle) * i * 20 + (Math.random() - 0.5) * 30;
                const branchY = branchNode.y + Math.sin(branchAngle) * i * 20 + (Math.random() - 0.5) * 30;
                ctx.lineTo(branchX, branchY);
              }
              
              ctx.strokeStyle = line.color;
              ctx.lineWidth = line.width * 0.6 * flickerIntensity;
              ctx.stroke();
            }
          }
          
          ctx.shadowBlur = 0;
        }

        // Mouse interaction - lightning bends away from cursor
        const dx = line.x - mouseRef.current.x;
        const dy = line.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          line.vx += (dx / distance) * force * 0.3;
          line.vy += (dy / distance) * force * 0.3;
          
          // Dampen velocity
          line.vx *= 0.98;
          line.vy *= 0.98;
          
          // Force regeneration of lightning path when mouse affects it
          line.lightningNodes = [];
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