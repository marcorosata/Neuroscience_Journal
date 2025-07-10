import { useEffect, useRef } from 'react';

interface BrainVertex {
  x: number;
  y: number;
  z: number;
  ox: number; // original positions
  oy: number;
  oz: number;
}

interface BrainRegion3D {
  id: string;
  name: string;
  vertices: BrainVertex[];
  center: { x: number; y: number; z: number };
  color: string;
  activation: number;
  targetActivation: number;
  function: string;
}

interface FMRI3DBrainProps {
  className?: string;
}

export default function FMRI3DBrain({ className = '' }: FMRI3DBrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const regionsRef = useRef<BrainRegion3D[]>([]);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create brain mesh vertices
    const createBrainMesh = (scale: number) => {
      const vertices: BrainVertex[] = [];
      const resolution = 20;
      
      // Generate brain-shaped mesh using parametric equations
      for (let lat = 0; lat <= resolution; lat++) {
        const theta = (lat / resolution) * Math.PI;
        
        for (let lon = 0; lon <= resolution * 2; lon++) {
          const phi = (lon / (resolution * 2)) * 2 * Math.PI;
          
          // Brain-like shape using modified sphere equations
          const r = scale * (1 + 
            0.3 * Math.sin(4 * theta) * Math.cos(2 * phi) +
            0.2 * Math.sin(2 * theta) * Math.sin(phi) +
            0.1 * Math.cos(6 * phi)
          );
          
          // Add frontal lobe bulge
          const frontalBulge = theta < Math.PI / 3 ? 0.2 * Math.sin(theta * 3) : 0;
          
          // Add temporal lobe indentation
          const temporalIndent = Math.abs(phi - Math.PI) < Math.PI / 4 && theta > Math.PI / 3 && theta < 2 * Math.PI / 3 ? -0.15 : 0;
          
          const adjustedR = r * (1 + frontalBulge + temporalIndent);
          
          const x = adjustedR * Math.sin(theta) * Math.cos(phi);
          const y = adjustedR * Math.sin(theta) * Math.sin(phi) * 0.8; // Flatten slightly
          const z = adjustedR * Math.cos(theta) * 1.2; // Elongate vertically
          
          vertices.push({
            x, y, z,
            ox: x, oy: y, oz: z
          });
        }
      }
      
      return vertices;
    };

    // Initialize brain regions with 3D positions
    const initializeRegions = () => {
      const scale = Math.min(canvas.width, canvas.height) * 0.3;
      
      regionsRef.current = [
        {
          id: 'frontal',
          name: 'Frontal Lobe',
          vertices: createBrainMesh(scale * 0.3),
          center: { x: 0, y: -scale * 0.6, z: scale * 0.4 },
          color: '#ff6b6b',
          activation: 0,
          targetActivation: 0,
          function: 'Executive Function'
        },
        {
          id: 'parietal',
          name: 'Parietal Lobe',
          vertices: createBrainMesh(scale * 0.25),
          center: { x: 0, y: scale * 0.5, z: scale * 0.3 },
          color: '#4ecdc4',
          activation: 0,
          targetActivation: 0,
          function: 'Spatial Processing'
        },
        {
          id: 'temporal',
          name: 'Temporal Lobe',
          vertices: createBrainMesh(scale * 0.22),
          center: { x: -scale * 0.7, y: 0, z: -scale * 0.2 },
          color: '#45b7d1',
          activation: 0,
          targetActivation: 0,
          function: 'Auditory & Memory'
        },
        {
          id: 'temporal_right',
          name: 'Temporal Lobe (R)',
          vertices: createBrainMesh(scale * 0.22),
          center: { x: scale * 0.7, y: 0, z: -scale * 0.2 },
          color: '#45b7d1',
          activation: 0,
          targetActivation: 0,
          function: 'Auditory & Memory'
        },
        {
          id: 'occipital',
          name: 'Occipital Lobe',
          vertices: createBrainMesh(scale * 0.2),
          center: { x: 0, y: scale * 0.8, z: -scale * 0.3 },
          color: '#f39c12',
          activation: 0,
          targetActivation: 0,
          function: 'Visual Processing'
        },
        {
          id: 'motor',
          name: 'Motor Cortex',
          vertices: createBrainMesh(scale * 0.15),
          center: { x: 0, y: 0, z: scale * 0.6 },
          color: '#9b59b6',
          activation: 0,
          targetActivation: 0,
          function: 'Movement Control'
        },
        {
          id: 'hippocampus',
          name: 'Hippocampus',
          vertices: createBrainMesh(scale * 0.08),
          center: { x: -scale * 0.3, y: 0, z: -scale * 0.1 },
          color: '#1abc9c',
          activation: 0,
          targetActivation: 0,
          function: 'Memory Formation'
        },
        {
          id: 'amygdala',
          name: 'Amygdala',
          vertices: createBrainMesh(scale * 0.06),
          center: { x: scale * 0.3, y: 0, z: -scale * 0.15 },
          color: '#e74c3c',
          activation: 0,
          targetActivation: 0,
          function: 'Emotion Processing'
        }
      ];
      
      // Position regions vertices according to their centers
      regionsRef.current.forEach(region => {
        region.vertices.forEach(vertex => {
          vertex.x += region.center.x;
          vertex.y += region.center.y;
          vertex.z += region.center.z;
          vertex.ox = vertex.x;
          vertex.oy = vertex.y;
          vertex.oz = vertex.z;
        });
      });
    };

    initializeRegions();

    // 3D rotation matrix
    const rotateVertex = (vertex: BrainVertex, rotation: { x: number; y: number; z: number }) => {
      const { x, y, z } = vertex;
      const { x: rx, y: ry, z: rz } = rotation;
      
      // Rotate around X axis
      let tempY = y * Math.cos(rx) - z * Math.sin(rx);
      let tempZ = y * Math.sin(rx) + z * Math.cos(rx);
      
      // Rotate around Y axis
      let tempX = x * Math.cos(ry) + tempZ * Math.sin(ry);
      tempZ = -x * Math.sin(ry) + tempZ * Math.cos(ry);
      
      // Rotate around Z axis
      const finalX = tempX * Math.cos(rz) - tempY * Math.sin(rz);
      const finalY = tempX * Math.sin(rz) + tempY * Math.cos(rz);
      
      return { x: finalX, y: finalY, z: tempZ };
    };

    // Project 3D to 2D with perspective
    const project = (vertex: { x: number; y: number; z: number }, centerX: number, centerY: number) => {
      const perspective = 800;
      const scale = perspective / (perspective + vertex.z);
      
      return {
        x: centerX + vertex.x * scale,
        y: centerY + vertex.y * scale,
        scale
      };
    };

    // Draw brain region with 3D effect
    const drawRegion3D = (ctx: CanvasRenderingContext2D, region: BrainRegion3D, centerX: number, centerY: number) => {
      if (region.activation <= 0.01) return;
      
      // Calculate region center in 3D
      const rotatedCenter = rotateVertex(region.center as BrainVertex, rotationRef.current);
      const projectedCenter = project(rotatedCenter, centerX, centerY);
      
      // Skip if region is behind viewer
      if (rotatedCenter.z < -700) return;
      
      // Create gradient for activation
      const radius = 50 * projectedCenter.scale * (1 + region.activation * 0.5);
      const gradient = ctx.createRadialGradient(
        projectedCenter.x, projectedCenter.y, 0,
        projectedCenter.x, projectedCenter.y, radius
      );
      
      const alpha = Math.floor(region.activation * 255);
      gradient.addColorStop(0, region.color + alpha.toString(16).padStart(2, '0'));
      gradient.addColorStop(0.5, region.color + Math.floor(alpha * 0.5).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, region.color + '00');
      
      // Draw activation sphere
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projectedCenter.x, projectedCenter.y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      const glowGradient = ctx.createRadialGradient(
        projectedCenter.x, projectedCenter.y, radius * 0.8,
        projectedCenter.x, projectedCenter.y, radius * 1.5
      );
      glowGradient.addColorStop(0, region.color + '00');
      glowGradient.addColorStop(0.7, region.color + Math.floor(alpha * 0.3).toString(16).padStart(2, '0'));
      glowGradient.addColorStop(1, region.color + '00');
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(projectedCenter.x, projectedCenter.y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw label for highly activated regions
      if (region.activation > 0.7) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${region.activation})`;
        ctx.font = `${12 * projectedCenter.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(region.name, projectedCenter.x, projectedCenter.y - radius - 10);
        ctx.restore();
      }
    };

    // Draw brain outline
    const drawBrainOutline = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
      const segments = 60;
      const points: { x: number; y: number }[] = [];
      
      // Generate brain outline points
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const r = scale * (1 + 
          0.3 * Math.sin(4 * angle) +
          0.15 * Math.cos(6 * angle) +
          0.1 * Math.sin(8 * angle)
        );
        
        const vertex = {
          x: r * Math.cos(angle),
          y: r * Math.sin(angle) * 0.8,
          z: 0
        };
        
        const rotated = rotateVertex(vertex as BrainVertex, rotationRef.current);
        const projected = project(rotated, centerX, centerY);
        points.push({ x: projected.x, y: projected.y });
      }
      
      // Draw outline
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.closePath();
      ctx.stroke();
      
      // Fill with dark color
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
    };

    // Mouse interaction
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.down = true;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRef.current.down) {
        const deltaX = e.clientX - mouseRef.current.x;
        const deltaY = e.clientY - mouseRef.current.y;
        
        rotationRef.current.y += deltaX * 0.01;
        rotationRef.current.x += deltaY * 0.01;
        
        mouseRef.current.x = e.clientX;
        mouseRef.current.y = e.clientY;
      }
    };

    const handleMouseUp = () => {
      mouseRef.current.down = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.3;
      
      // Auto-rotate
      if (!mouseRef.current.down) {
        rotationRef.current.y += 0.005;
      }
      
      // Draw brain outline
      drawBrainOutline(ctx, centerX, centerY, scale);
      
      // Sort regions by depth
      const sortedRegions = [...regionsRef.current].sort((a, b) => {
        const aRotated = rotateVertex(a.center as BrainVertex, rotationRef.current);
        const bRotated = rotateVertex(b.center as BrainVertex, rotationRef.current);
        return bRotated.z - aRotated.z;
      });
      
      // Update and draw regions
      sortedRegions.forEach(region => {
        // Random activation
        if (Math.random() < 0.01) {
          region.targetActivation = 0.5 + Math.random() * 0.5;
        }
        
        // Gradual deactivation
        if (Math.random() < 0.003) {
          region.targetActivation = 0;
        }
        
        // Smooth transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.03;
        
        // Draw region
        drawRegion3D(ctx, region, centerX, centerY);
      });
      
      // Neural connections
      regionsRef.current.forEach((region1, i) => {
        regionsRef.current.forEach((region2, j) => {
          if (i < j && region1.activation > 0.3 && region2.activation > 0.3) {
            const r1 = rotateVertex(region1.center as BrainVertex, rotationRef.current);
            const r2 = rotateVertex(region2.center as BrainVertex, rotationRef.current);
            
            const p1 = project(r1, centerX, centerY);
            const p2 = project(r2, centerX, centerY);
            
            if (r1.z > -700 && r2.z > -700) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(region1.activation, region2.activation) * 0.2})`;
              ctx.lineWidth = 1;
              ctx.setLineDash([5, 5]);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 ${className}`}
      style={{ backgroundColor: '#000000', zIndex: 1, cursor: 'grab' }}
    />
  );
}