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
      // Create long, diagonal lightning that crosses the screen
      const startSide = Math.floor(Math.random() * 4);
      let x = 0, y = 0, vx = 0, vy = 0;
      
      const speed = 0.8 + Math.random() * 1.2;
      
      switch(startSide) {
        case 0: // Top to bottom diagonal
          x = Math.random() * canvas.width * 0.3;
          y = -100;
          vx = speed * 0.5;
          vy = speed * 1.5;
          break;
        case 1: // Right to left diagonal
          x = canvas.width + 100;
          y = Math.random() * canvas.height * 0.3;
          vx = -speed * 1.5;
          vy = speed * 0.5;
          break;
        case 2: // Bottom to top diagonal
          x = canvas.width - Math.random() * canvas.width * 0.3;
          y = canvas.height + 100;
          vx = -speed * 0.5;
          vy = -speed * 1.5;
          break;
        case 3: // Left to right diagonal
          x = -100;
          y = canvas.height - Math.random() * canvas.height * 0.3;
          vx = speed * 1.5;
          vy = -speed * 0.5;
          break;
      }

      return {
        x,
        y,
        vx,
        vy,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: 2 + Math.random() * 4,
        nodes: [],
        angle: Math.atan2(vy, vx),
        flickerIntensity: 0.9 + Math.random() * 0.1,
        branchChance: 0.01 + Math.random() * 0.02
      };
    };

    // Generate lightning nodes with long, natural path like action potential
    const generateLightningNodes = (bolt: LightningBolt) => {
      bolt.nodes = [];
      const segments = 20 + Math.floor(Math.random() * 15); // Much longer paths
      
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const pathLength = Math.max(canvas.width, canvas.height) * 1.5; // Cross entire screen
        const baseX = bolt.x + bolt.vx * progress * pathLength;
        const baseY = bolt.y + bolt.vy * progress * pathLength;
        
        // More natural, organic zigzag pattern
        const zigzagIntensity = Math.sin(progress * Math.PI * 4) * 40; // Smooth wave
        const randomOffset = (Math.random() - 0.5) * 60; // Random variation
        const totalOffset = zigzagIntensity + randomOffset;
        
        const perpX = -Math.sin(bolt.angle);
        const perpY = Math.cos(bolt.angle);
        
        bolt.nodes.push({
          x: baseX + perpX * totalOffset,
          y: baseY + perpY * totalOffset
        });
      }
    };

    // Initialize just 1 lightning bolt for sparse, natural effect
    const bolt = createLightningBolt();
    generateLightningNodes(bolt);
    boltsRef.current.push(bolt);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Very slow fade effect for long-lasting trails from sparse lightning
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      boltsRef.current.forEach((bolt, index) => {
        // Update position
        bolt.x += bolt.vx;
        bolt.y += bolt.vy;

        // Regenerate lightning path extremely rarely for sparse action potential effect
        if (Math.random() < 0.001) {
          generateLightningNodes(bolt);
        }

        // Draw lightning bolt with much less frequent flicker
        if (bolt.nodes.length > 1) {
          const flicker = Math.random() < 0.05 ? 0.2 : 1; // Very rare flicker
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
          
          // Draw sparse branches for more natural action potential look
          if (Math.random() < bolt.branchChance * 0.3) {
            const branchStart = Math.floor(Math.random() * bolt.nodes.length);
            const branchNode = bolt.nodes[branchStart];
            
            if (branchNode) {
              const branchLength = 2 + Math.floor(Math.random() * 3);
              const branchAngle = bolt.angle + (Math.random() - 0.5) * Math.PI * 0.4;
              
              ctx.beginPath();
              ctx.moveTo(branchNode.x, branchNode.y);
              
              for (let i = 1; i < branchLength; i++) {
                const branchX = branchNode.x + Math.cos(branchAngle) * i * 40 + (Math.random() - 0.5) * 30;
                const branchY = branchNode.y + Math.sin(branchAngle) * i * 40 + (Math.random() - 0.5) * 30;
                ctx.lineTo(branchX, branchY);
              }
              
              ctx.strokeStyle = bolt.color;
              ctx.lineWidth = bolt.width * 0.5 * flickerIntensity;
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

        // Reset bolt only when it's completely off screen (more generous bounds)
        if (bolt.x < -400 || bolt.x > canvas.width + 400 || 
            bolt.y < -400 || bolt.y > canvas.height + 400) {
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