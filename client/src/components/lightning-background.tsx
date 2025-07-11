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
  visible: boolean;
  lifespan: number;
  age: number;
  dormantTime: number;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

interface LightningBackgroundProps {
  className?: string;
}

export default function LightningBackground({ className = '' }: LightningBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boltsRef = useRef<LightningBolt[]>([]);
  const smokeParticlesRef = useRef<SmokeParticle[]>([]);
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

    // Dramatic lightning colors for visual impact
    const lightningColors = [
      '#ff006e',  // Electric magenta
      '#8338ec',  // Electric purple
      '#3a86ff',  // Electric blue
      '#06ffa5',  // Electric cyan
      '#ff4365',  // Electric red
      '#ffbe0b',  // Electric yellow
      '#00f5ff',  // Bright cyan
      '#ff5722',  // Electric orange
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
        color: lightningColors[Math.floor(Math.random() * lightningColors.length)],
        width: 0.2 + Math.random() * 0.4,
        nodes: [],
        angle: Math.atan2(vy, vx),
        flickerIntensity: 0.9 + Math.random() * 0.1,
        branchChance: 0.01 + Math.random() * 0.02,
        visible: false,
        lifespan: 30 + Math.random() * 60, // 0.5-1.5 seconds at 60fps
        age: 0,
        dormantTime: 0
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

    // Create smoke particle function
    const createSmokeParticle = (): SmokeParticle => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.7,
        size: 20 + Math.random() * 40,
        opacity: 0.1 + Math.random() * 0.2,
        life: 0,
        maxLife: 300 + Math.random() * 400,
        color: `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${120 + Math.random() * 50}, 0.1)`
      };
    };

    // Initialize smoke particles
    for (let i = 0; i < 15; i++) {
      smokeParticlesRef.current.push(createSmokeParticle());
    }

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

      // Animate and render smoke particles
      smokeParticlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Expand and fade particle
        particle.size += 0.2;
        particle.opacity *= 0.998;

        // Draw smoke particle
        const particleOpacity = particle.opacity * (1 - particle.life / particle.maxLife);
        if (particleOpacity > 0.01) {
          ctx.globalAlpha = particleOpacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Reset particle if it's too old or off screen
        if (particle.life >= particle.maxLife || particle.y < -100) {
          smokeParticlesRef.current[index] = createSmokeParticle();
        }
      });

      ctx.globalAlpha = 1;

      boltsRef.current.forEach((bolt, index) => {
        // Update age
        bolt.age++;
        
        // Handle lightning state transitions
        if (bolt.visible) {
          // Lightning is currently visible - check if it should disappear
          if (bolt.age >= bolt.lifespan) {
            bolt.visible = false;
            bolt.age = 0;
            bolt.dormantTime = 180 + Math.random() * 600; // 3-13 seconds dormant
          }
        } else {
          // Lightning is dormant - check if it should appear
          if (bolt.age >= bolt.dormantTime) {
            bolt.visible = true;
            bolt.age = 0;
            bolt.lifespan = 30 + Math.random() * 60; // 0.5-1.5 seconds visible
            // Create new lightning position and pattern
            const newBolt = createLightningBolt();
            bolt.x = newBolt.x;
            bolt.y = newBolt.y;
            bolt.vx = newBolt.vx;
            bolt.vy = newBolt.vy;
            bolt.color = lightningColors[Math.floor(Math.random() * lightningColors.length)];
            bolt.angle = newBolt.angle;
            generateLightningNodes(bolt);
          }
        }

        // Only draw and update if lightning is visible
        if (bolt.visible) {
          // Update position slowly
          bolt.x += bolt.vx * 0.3;
          bolt.y += bolt.vy * 0.3;

          // Draw ultrarealistic lightning with multiple atmospheric layers
          if (bolt.nodes.length > 1) {
            const flicker = Math.random() < 0.2 ? 0.6 : 1; // Subtle realistic flicker
            const flickerIntensity = bolt.flickerIntensity * flicker;
            
            // Layer 1: Atmospheric glow (distant scattering)
            ctx.shadowBlur = 80 * flickerIntensity;
            ctx.shadowColor = bolt.color;
            ctx.globalAlpha = 0.3 * flickerIntensity;
            
            ctx.beginPath();
            ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
            for (let i = 1; i < bolt.nodes.length; i++) {
              ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
            }
            ctx.strokeStyle = bolt.color;
            ctx.lineWidth = bolt.width * 0.8 * flickerIntensity;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            
            // Layer 2: Medium atmospheric glow
            ctx.shadowBlur = 40 * flickerIntensity;
            ctx.globalAlpha = 0.6 * flickerIntensity;
            
            ctx.beginPath();
            ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
            for (let i = 1; i < bolt.nodes.length; i++) {
              ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
            }
            ctx.strokeStyle = bolt.color;
            ctx.lineWidth = bolt.width * 0.4 * flickerIntensity;
            ctx.stroke();
            
            // Layer 3: Close atmospheric glow
            ctx.shadowBlur = 20 * flickerIntensity;
            ctx.globalAlpha = 0.8 * flickerIntensity;
            
            ctx.beginPath();
            ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
            for (let i = 1; i < bolt.nodes.length; i++) {
              ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
            }
            ctx.strokeStyle = bolt.color;
            ctx.lineWidth = bolt.width * 0.2 * flickerIntensity;
            ctx.stroke();
            
            // Layer 4: Main discharge channel
            ctx.shadowBlur = 8 * flickerIntensity;
            ctx.globalAlpha = 1;
            
            ctx.beginPath();
            ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
            for (let i = 1; i < bolt.nodes.length; i++) {
              ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
            }
            ctx.strokeStyle = bolt.color;
            ctx.lineWidth = bolt.width * 0.1 * flickerIntensity;
            ctx.stroke();
            
            // Layer 5: Bright plasma core
            ctx.shadowBlur = 4 * flickerIntensity;
            ctx.shadowColor = '#ffffff';
            
            ctx.beginPath();
            ctx.moveTo(bolt.nodes[0].x, bolt.nodes[0].y);
            for (let i = 1; i < bolt.nodes.length; i++) {
              ctx.lineTo(bolt.nodes[i].x, bolt.nodes[i].y);
            }
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(0.05, bolt.width * 0.02 * flickerIntensity);
            ctx.stroke();
            
            // Realistic fractal branches
            if (Math.random() < bolt.branchChance * 0.8) {
              const branchStart = Math.floor(Math.random() * bolt.nodes.length);
              const branchNode = bolt.nodes[branchStart];
              
              if (branchNode) {
                const branchLength = 3 + Math.floor(Math.random() * 5);
                const branchAngle = bolt.angle + (Math.random() - 0.5) * Math.PI * 0.8;
                
                // Multiple branch layers for realism
                for (let layer = 0; layer < 3; layer++) {
                  ctx.shadowBlur = (25 - layer * 8) * flickerIntensity;
                  ctx.shadowColor = bolt.color;
                  ctx.globalAlpha = (0.4 + layer * 0.2) * flickerIntensity;
                  
                  ctx.beginPath();
                  ctx.moveTo(branchNode.x, branchNode.y);
                  
                  for (let i = 1; i < branchLength; i++) {
                    const progress = i / branchLength;
                    const branchX = branchNode.x + Math.cos(branchAngle) * i * 25 + (Math.random() - 0.5) * 15 * progress;
                    const branchY = branchNode.y + Math.sin(branchAngle) * i * 25 + (Math.random() - 0.5) * 15 * progress;
                    ctx.lineTo(branchX, branchY);
                  }
                  
                  ctx.strokeStyle = bolt.color;
                  ctx.lineWidth = bolt.width * (0.06 - layer * 0.015) * flickerIntensity;
                  ctx.stroke();
                }
              }
            }
            
            // Reset drawing state
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
          }
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