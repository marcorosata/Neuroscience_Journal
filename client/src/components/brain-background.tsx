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

      // Draw simple brain outline
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 200, 150, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Add some random activation dots
      for (let i = 0; i < 5; i++) {
        const x = centerX + (Math.random() - 0.5) * 300;
        const y = centerY + (Math.random() - 0.5) * 200;
        const size = Math.random() * 10 + 5;
        const opacity = Math.sin(Date.now() * 0.005 + i) * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(255, 100, 100, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
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