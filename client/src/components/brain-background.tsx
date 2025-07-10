import { useEffect, useRef } from 'react';

interface BrainBackgroundProps {
  className?: string;
}

export default function BrainBackground({ className = '' }: BrainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

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

    // Simple brain visualization
    const animate = () => {
      // Clear with dark background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw visible brain outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 250, 200, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Add brain details
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX - 100, centerY - 50);
      ctx.lineTo(centerX + 80, centerY + 100);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 150, centerY);
      ctx.lineTo(centerX + 120, centerY + 30);
      ctx.stroke();

      // Add bright activation areas
      for (let i = 0; i < 8; i++) {
        const x = centerX + (Math.random() - 0.5) * 400;
        const y = centerY + (Math.random() - 0.5) * 300;
        const size = Math.random() * 15 + 10;
        const opacity = Math.sin(Date.now() * 0.003 + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(255, 50, 50, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.fillStyle = `rgba(255, 100, 100, ${opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
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