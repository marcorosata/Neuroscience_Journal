import { useEffect, useRef } from 'react';

interface BrainRegion {
  id: string;
  name: string;
  color: string;
  path: string;
  activation: number;
  targetActivation: number;
  function: string;
}

interface FMRIBrainProps {
  className?: string;
}

export default function FMRIBrain({ className = '' }: FMRIBrainProps) {
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

    // Initialize brain regions with anatomically inspired positions
    const initializeRegions = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.4;

      regionsRef.current = [
        {
          id: 'frontal',
          name: 'Frontal Lobe',
          color: '#FF6B6B',
          path: 'frontal',
          activation: 0,
          targetActivation: 0,
          function: 'Executive Function & Planning'
        },
        {
          id: 'parietal',
          name: 'Parietal Lobe',
          color: '#4ECDC4',
          path: 'parietal',
          activation: 0,
          targetActivation: 0,
          function: 'Sensory Processing'
        },
        {
          id: 'temporal',
          name: 'Temporal Lobe',
          color: '#45B7D1',
          path: 'temporal',
          activation: 0,
          targetActivation: 0,
          function: 'Memory & Language'
        },
        {
          id: 'occipital',
          name: 'Occipital Lobe',
          color: '#F7DC6F',
          path: 'occipital',
          activation: 0,
          targetActivation: 0,
          function: 'Visual Processing'
        },
        {
          id: 'motor',
          name: 'Motor Cortex',
          color: '#BB8FCE',
          path: 'motor',
          activation: 0,
          targetActivation: 0,
          function: 'Motor Control'
        },
        {
          id: 'hippocampus',
          name: 'Hippocampus',
          color: '#52BE80',
          path: 'hippocampus',
          activation: 0,
          targetActivation: 0,
          function: 'Memory Formation'
        },
        {
          id: 'amygdala',
          name: 'Amygdala',
          color: '#EC7063',
          path: 'amygdala',
          activation: 0,
          targetActivation: 0,
          function: 'Emotion & Fear'
        },
        {
          id: 'cerebellum',
          name: 'Cerebellum',
          color: '#F8C471',
          path: 'cerebellum',
          activation: 0,
          targetActivation: 0,
          function: 'Balance & Coordination'
        }
      ];
    };

    initializeRegions();

    // Draw brain silhouette with anatomical accuracy
    const drawBrainSilhouette = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Main brain outline (lateral view)
      ctx.beginPath();
      
      // Frontal lobe curve
      ctx.moveTo(-scale * 0.85, -scale * 0.15);
      ctx.bezierCurveTo(-scale * 0.85, -scale * 0.75, -scale * 0.6, -scale * 0.95, -scale * 0.2, -scale * 0.95);
      
      // Top of brain (parietal region)
      ctx.bezierCurveTo(scale * 0.1, -scale * 0.95, scale * 0.4, -scale * 0.85, scale * 0.6, -scale * 0.65);
      
      // Occipital lobe
      ctx.bezierCurveTo(scale * 0.75, -scale * 0.45, scale * 0.85, -scale * 0.2, scale * 0.85, scale * 0.05);
      
      // Temporal lobe superior curve
      ctx.bezierCurveTo(scale * 0.8, scale * 0.25, scale * 0.7, scale * 0.4, scale * 0.5, scale * 0.45);
      
      // Cerebellum connection
      ctx.bezierCurveTo(scale * 0.4, scale * 0.5, scale * 0.3, scale * 0.6, scale * 0.2, scale * 0.65);
      
      // Brain stem area
      ctx.bezierCurveTo(scale * 0.1, scale * 0.7, -scale * 0.05, scale * 0.72, -scale * 0.1, scale * 0.7);
      
      // Temporal lobe inferior
      ctx.bezierCurveTo(-scale * 0.3, scale * 0.65, -scale * 0.5, scale * 0.55, -scale * 0.65, scale * 0.4);
      
      // Return to frontal
      ctx.bezierCurveTo(-scale * 0.75, scale * 0.2, -scale * 0.85, 0, -scale * 0.85, -scale * 0.15);
      
      ctx.closePath();
      
      // Fill with very dark gray
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      
      // Add subtle brain texture/folds
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw some major sulci (brain folds)
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 0.5;
      
      // Central sulcus
      ctx.beginPath();
      ctx.moveTo(-scale * 0.1, -scale * 0.8);
      ctx.bezierCurveTo(-scale * 0.05, -scale * 0.6, scale * 0.05, -scale * 0.4, scale * 0.1, -scale * 0.2);
      ctx.stroke();
      
      // Lateral sulcus (Sylvian fissure)
      ctx.beginPath();
      ctx.moveTo(-scale * 0.7, scale * 0.1);
      ctx.bezierCurveTo(-scale * 0.4, scale * 0.2, -scale * 0.1, scale * 0.25, scale * 0.3, scale * 0.3);
      ctx.stroke();
      
      // Superior temporal sulcus
      ctx.beginPath();
      ctx.moveTo(-scale * 0.6, scale * 0.35);
      ctx.bezierCurveTo(-scale * 0.3, scale * 0.4, 0, scale * 0.42, scale * 0.3, scale * 0.4);
      ctx.stroke();
      
      // Draw cerebellum separately
      ctx.beginPath();
      ctx.moveTo(scale * 0.2, scale * 0.65);
      ctx.bezierCurveTo(scale * 0.4, scale * 0.6, scale * 0.6, scale * 0.65, scale * 0.65, scale * 0.8);
      ctx.bezierCurveTo(scale * 0.6, scale * 0.9, scale * 0.4, scale * 0.92, scale * 0.2, scale * 0.88);
      ctx.bezierCurveTo(scale * 0.15, scale * 0.85, scale * 0.12, scale * 0.75, scale * 0.2, scale * 0.65);
      ctx.closePath();
      
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Cerebellum folds
      ctx.strokeStyle = '#151515';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(scale * (0.25 + i * 0.08), scale * 0.7);
        ctx.bezierCurveTo(scale * (0.27 + i * 0.08), scale * 0.85, scale * (0.29 + i * 0.08), scale * 0.85, scale * (0.31 + i * 0.08), scale * 0.7);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    // Draw activated regions
    const drawActivatedRegion = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      scale: number,
      region: BrainRegion
    ) => {
      if (region.activation <= 0.01) return;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Anatomically accurate region positions and shapes
      let x = 0, y = 0, radius = scale * 0.15;
      
      switch (region.id) {
        case 'frontal':
          x = -scale * 0.45;
          y = -scale * 0.35;
          radius = scale * 0.3;
          break;
        case 'parietal':
          x = scale * 0.15;
          y = -scale * 0.55;
          radius = scale * 0.25;
          break;
        case 'temporal':
          x = -scale * 0.35;
          y = scale * 0.25;
          radius = scale * 0.22;
          break;
        case 'occipital':
          x = scale * 0.6;
          y = -scale * 0.25;
          radius = scale * 0.18;
          break;
        case 'motor':
          x = -scale * 0.05;
          y = -scale * 0.7;
          radius = scale * 0.12;
          break;
        case 'hippocampus':
          x = -scale * 0.1;
          y = scale * 0.1;
          radius = scale * 0.08;
          break;
        case 'amygdala':
          x = -scale * 0.25;
          y = scale * 0.35;
          radius = scale * 0.06;
          break;
        case 'cerebellum':
          x = scale * 0.42;
          y = scale * 0.78;
          radius = scale * 0.15;
          break;
      }

      // Create gradient for glowing effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, region.color + Math.floor(region.activation * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, region.color + Math.floor(region.activation * 150).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, region.color + '00');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add pulsing outer glow
      const pulseScale = 1 + Math.sin(Date.now() * 0.003 + region.id.charCodeAt(0)) * 0.1;
      const outerGradient = ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius * pulseScale * 1.5);
      outerGradient.addColorStop(0, region.color + '00');
      outerGradient.addColorStop(0.7, region.color + Math.floor(region.activation * 40).toString(16).padStart(2, '0'));
      outerGradient.addColorStop(1, region.color + '00');

      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius * pulseScale * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Draw label if highly activated
      if (region.activation > 0.7) {
        ctx.fillStyle = 'rgba(255, 255, 255, ' + region.activation + ')';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, x, y - radius - 10);
        ctx.font = '10px Arial';
        ctx.fillText(region.function, x, y - radius + 5);
      }

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      // Clear with pure black
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.4;

      // Draw brain silhouette
      drawBrainSilhouette(ctx, centerX, centerY, scale);

      // Update and draw regions
      regionsRef.current.forEach((region, index) => {
        // Random activation - more frequent for better visibility
        if (Math.random() < 0.008) {
          region.targetActivation = 0.6 + Math.random() * 0.4;
        }

        // Gradual deactivation - slower for longer visibility
        if (Math.random() < 0.002) {
          region.targetActivation = 0;
        }

        // Smooth activation transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.02;

        // Draw activated region
        drawActivatedRegion(ctx, centerX, centerY, scale, region);
      });

      // Neural connections effect
      regionsRef.current.forEach((region1, i) => {
        regionsRef.current.forEach((region2, j) => {
          if (i < j && region1.activation > 0.3 && region2.activation > 0.3) {
            ctx.save();
            ctx.translate(centerX, centerY);
            
            const opacity = Math.min(region1.activation, region2.activation) * 0.3;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            
            ctx.beginPath();
            
            // Calculate positions based on region IDs
            let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
            
            // Set positions for region1
            switch (region1.id) {
              case 'frontal': x1 = -scale * 0.45; y1 = -scale * 0.35; break;
              case 'parietal': x1 = scale * 0.15; y1 = -scale * 0.55; break;
              case 'temporal': x1 = -scale * 0.35; y1 = scale * 0.25; break;
              case 'occipital': x1 = scale * 0.6; y1 = -scale * 0.25; break;
              case 'motor': x1 = -scale * 0.05; y1 = -scale * 0.7; break;
              case 'hippocampus': x1 = -scale * 0.1; y1 = scale * 0.1; break;
              case 'amygdala': x1 = -scale * 0.25; y1 = scale * 0.35; break;
              case 'cerebellum': x1 = scale * 0.42; y1 = scale * 0.78; break;
            }
            
            // Set positions for region2
            switch (region2.id) {
              case 'frontal': x2 = -scale * 0.45; y2 = -scale * 0.35; break;
              case 'parietal': x2 = scale * 0.15; y2 = -scale * 0.55; break;
              case 'temporal': x2 = -scale * 0.35; y2 = scale * 0.25; break;
              case 'occipital': x2 = scale * 0.6; y2 = -scale * 0.25; break;
              case 'motor': x2 = -scale * 0.05; y2 = -scale * 0.7; break;
              case 'hippocampus': x2 = -scale * 0.1; y2 = scale * 0.1; break;
              case 'amygdala': x2 = -scale * 0.25; y2 = scale * 0.35; break;
              case 'cerebellum': x2 = scale * 0.42; y2 = scale * 0.78; break;
            }
            
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            ctx.restore();
          }
        });
      });

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
      style={{ backgroundColor: '#000000', zIndex: 1 }}
    />
  );
}