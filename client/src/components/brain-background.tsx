import { useEffect, useRef } from 'react';

interface BrainRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  activation: number;
  targetActivation: number;
  color: string;
}

interface BrainBackgroundProps {
  className?: string;
}

export default function BrainBackground({ className = '' }: BrainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const regionsRef = useRef<BrainRegion[]>([]);

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

    // Initialize brain regions - properly centered and sized
    const initializeBrainRegions = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const brainWidth = Math.min(canvas.width * 0.8, 600);
      const brainHeight = Math.min(canvas.height * 0.8, 450);

      regionsRef.current = [
        // Frontal Cortex (front-top)
        {
          x: centerX - brainWidth/3,
          y: centerY - brainHeight/3,
          width: brainWidth/2.5,
          height: brainHeight/4,
          name: 'Frontal',
          activation: 0,
          targetActivation: 0,
          color: '#ff4444'
        },
        // Parietal Cortex (center-top)
        {
          x: centerX - brainWidth/6,
          y: centerY - brainHeight/2.5,
          width: brainWidth/3,
          height: brainHeight/3,
          name: 'Parietal',
          activation: 0,
          targetActivation: 0,
          color: '#44ff44'
        },
        // Temporal Cortex (side-middle)
        {
          x: centerX - brainWidth/2.5,
          y: centerY - brainHeight/10,
          width: brainWidth/3,
          height: brainHeight/4,
          name: 'Temporal',
          activation: 0,
          targetActivation: 0,
          color: '#4444ff'
        },
        // Occipital Cortex (back)
        {
          x: centerX + brainWidth/8,
          y: centerY - brainHeight/4,
          width: brainWidth/3,
          height: brainHeight/2.5,
          name: 'Occipital',
          activation: 0,
          targetActivation: 0,
          color: '#ffff44'
        },
        // Motor Cortex (center strip)
        {
          x: centerX - brainWidth/12,
          y: centerY - brainHeight/2.2,
          width: brainWidth/6,
          height: brainHeight/2,
          name: 'Motor',
          activation: 0,
          targetActivation: 0,
          color: '#ff44ff'
        },
        // Hippocampus (deep center)
        {
          x: centerX - brainWidth/10,
          y: centerY + brainHeight/10,
          width: brainWidth/5,
          height: brainHeight/8,
          name: 'Hippocampus',
          activation: 0,
          targetActivation: 0,
          color: '#44ffff'
        },
        // Amygdala (deep side)
        {
          x: centerX - brainWidth/5,
          y: centerY + brainHeight/8,
          width: brainWidth/8,
          height: brainHeight/10,
          name: 'Amygdala',
          activation: 0,
          targetActivation: 0,
          color: '#ff8844'
        },
        // Cerebellum (back-bottom)
        {
          x: centerX + brainWidth/10,
          y: centerY + brainHeight/6,
          width: brainWidth/4,
          height: brainWidth/6,
          name: 'Cerebellum',
          activation: 0,
          targetActivation: 0,
          color: '#8844ff'
        }
      ];
    };

    initializeBrainRegions();

    // Draw brain outline
    const drawBrainOutline = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const brainWidth = Math.min(canvas.width * 0.8, 600);
      const brainHeight = Math.min(canvas.height * 0.8, 450);

      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Simple brain shape - match the region sizing
      ctx.ellipse(centerX, centerY, brainWidth/2, brainHeight/2, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Central sulcus
      ctx.beginPath();
      ctx.moveTo(centerX - brainWidth/4, centerY - brainHeight/3);
      ctx.lineTo(centerX + brainWidth/6, centerY + brainHeight/4);
      ctx.stroke();

      // Lateral sulcus
      ctx.beginPath();
      ctx.moveTo(centerX - brainWidth/3, centerY);
      ctx.lineTo(centerX + brainWidth/4, centerY + brainHeight/8);
      ctx.stroke();
    };

    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw brain outline
      drawBrainOutline();

      // Randomly activate regions
      regionsRef.current.forEach(region => {
        // Random activation changes
        if (Math.random() < 0.005) {
          region.targetActivation = Math.random() * 0.8 + 0.2;
        }
        
        // Gradual deactivation
        if (Math.random() < 0.01) {
          region.targetActivation = Math.random() * 0.3;
        }

        // Smooth activation transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.02;

        // Draw activated regions
        if (region.activation > 0.1) {
          ctx.save();
          ctx.globalAlpha = region.activation;
          
          // Create activation gradient
          const gradient = ctx.createRadialGradient(
            region.x + region.width/2,
            region.y + region.height/2,
            0,
            region.x + region.width/2,
            region.y + region.height/2,
            Math.max(region.width, region.height)
          );
          
          gradient.addColorStop(0, region.color);
          gradient.addColorStop(0.7, region.color + '80');
          gradient.addColorStop(1, region.color + '00');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(region.x, region.y, region.width, region.height);
          
          // Add pulsing effect
          const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
          ctx.globalAlpha = region.activation * pulse;
          ctx.fillStyle = region.color + '40';
          ctx.fillRect(
            region.x - 10,
            region.y - 10,
            region.width + 20,
            region.height + 20
          );
          
          ctx.restore();

          // Draw region label
          if (region.activation > 0.5) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
              region.name,
              region.x + region.width/2,
              region.y + region.height/2
            );
          }
        }
      });

      // Add scanner lines effect
      const scannerY = (Date.now() * 0.1) % canvas.height;
      ctx.strokeStyle = '#00ff4440';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scannerY);
      ctx.lineTo(canvas.width, scannerY);
      ctx.stroke();

      // Add fMRI noise effect
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 3;
        ctx.fillStyle = `rgba(0, 255, 100, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, size, size);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 ${className}`}
      style={{ backgroundColor: '#0a0a0a' }}
    />
  );
}