import { useEffect, useRef } from 'react';

interface LightningBolt {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  width: number;
  nodes: { x: number; y: number }[];
  angle: number;
  flickerIntensity: number;
  branchChance: number;
}

interface LightningBackgroundProps {
  className?: string;
}

export default function LightningBackground({ className = '' }: LightningBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<LightningBolt[]>([]);
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

    // Lightning colors
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

    const createLightningBolt = (): LightningBolt => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      
      const speed = 0.5 + Math.random() * 1.5;
      
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
        nodes: [],
        angle: Math.atan2(vy, vx),
        flickerIntensity: 0.8 + Math.random() * 0.2,
        branchChance: 0.02 + Math.random() * 0.03
      };
    };

    // Generate lightning nodes with jagged path
    const generateLightningNodes = (bolt: LightningBolt) => {
      bolt.nodes = [];
      const segments = 8 + Math.floor(Math.random() * 12);
      
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const baseX = bolt.x + bolt.vx * progress * 150;
        const baseY = bolt.y + bolt.vy * progress * 150;
        
        // Add jagged offset for lightning zigzag
        const zigzagOffset = (Math.random() - 0.5) * 80;
        const perpX = -Math.sin(bolt.angle);
        const perpY = Math.cos(bolt.angle);
        
        bolt.nodes.push({
          x: baseX + perpX * zigzagOffset,
          y: baseY + perpY * zigzagOffset
        });
      }
    };

    // Initialize lightning bolts
    for (let i = 0; i < 12; i++) {
      const bolt = createLightningBolt();
      generateLightningNodes(bolt);
      boltsRef.current.push(bolt);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Dark fade effect for lightning trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      boltsRef.current.forEach((bolt, index) => {
        // Update position
        bolt.x += bolt.vx;
        bolt.y += bolt.vy;

        // Regenerate lightning path occasionally
        if (Math.random() < 0.05) {
          generateLightningNodes(bolt);
        }

        // Draw lightning bolt
        if (bolt.nodes.length > 1) {
          const flicker = Math.random() < 0.4 ? 0.3 : 1; // Random flicker
          const flickerIntensity = bolt.flickerIntensity * flicker;
          
          ctx.shadowBlur = 20 * flickerIntensity;
          ctx.shadowColor = bolt.color;
          
          // Draw main lightning bolt
          ctx.beginPath();
          ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
          
          for (let i = 1; i < bolt.nodes.length; i++) {
            ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
          }
          
          ctx.strokeStyle = bolt.color;
          ctx.lineWidth = bolt.width * flickerIntensity;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
          
          // Draw bright core
          ctx.beginPath();
          ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
          
          for (let i = 1; i < bolt.nodes.length; i++) {
            ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
          }
          
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(0.5, bolt.width * 0.4 * flickerIntensity);
          ctx.stroke();
          
          // Draw branches
          if (Math.random() < bolt.branchChance) {
            const branchStart = Math.floor(Math.random() * bolt.nodes.length);
            const branchNode = bolt.nodes[branchStart];
            
            if (branchNode) {
              const branchLength = 3 + Math.floor(Math.random() * 4);
              const branchAngle = bolt.angle + (Math.random() - 0.5) * Math.PI * 0.6;
              
              ctx.beginPath();
              ctx.moveTo(branchNode.x, branchNode.y);
              
              for (let i = 1; i < branchLength; i++) {
                const branchX = branchNode.x + Math.cos(branchAngle) * i * 25 + (Math.random() - 0.5) * 40;
                const branchY = branchNode.y + Math.sin(branchAngle) * i * 25 + (Math.random() - 0.5) * 40;
                ctx.lineTo(branchX, branchY);
              }
              
              ctx.strokeStyle = bolt.color;
              ctx.lineWidth = bolt.width * 0.7 * flickerIntensity;
              ctx.stroke();
            }
          }
          
          ctx.shadowBlur = 0;
        }

        // Mouse interaction - lightning avoids cursor
        const dx = bolt.x - mouseRef.current.x;
        const dy = bolt.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const force = (120 - distance) / 120;
          bolt.vx += (dx / distance) * force * 0.2;
          bolt.vy += (dy / distance) * force * 0.2;
          
          // Dampen velocity
          bolt.vx *= 0.98;
          bolt.vy *= 0.98;
          
          // Force regeneration of lightning path
          generateLightningNodes(bolt);
        }

        // Reset bolt if it goes off screen
        if (bolt.x < -150 || bolt.x > canvas.width + 150 || 
            bolt.y < -150 || bolt.y > canvas.height + 150) {
          boltsRef.current[index] = createLightningBolt();
          generateLightningNodes(boltsRef.current[index]);
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