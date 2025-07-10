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

    // Create brain mesh vertices with more realistic anatomy
    const createBrainMesh = (scale: number) => {
      const vertices: BrainVertex[] = [];
      const resolution = 30;
      
      // Generate brain-shaped mesh using parametric equations
      for (let lat = 0; lat <= resolution; lat++) {
        const theta = (lat / resolution) * Math.PI;
        
        for (let lon = 0; lon <= resolution * 2; lon++) {
          const phi = (lon / (resolution * 2)) * 2 * Math.PI;
          
          // More realistic brain shape
          let r = scale;
          
          // Frontal lobe bulge (anterior)
          if (phi > Math.PI * 1.5 || phi < Math.PI * 0.5) {
            r *= 1 + 0.15 * Math.cos(phi) * (1 - Math.sin(theta));
          }
          
          // Temporal lobe protrusion (lateral)
          if (theta > Math.PI * 0.4 && theta < Math.PI * 0.8) {
            r *= 1 + 0.2 * Math.sin((theta - Math.PI * 0.4) * 3);
          }
          
          // Occipital lobe (posterior)
          if (phi > Math.PI * 0.7 && phi < Math.PI * 1.3) {
            r *= 1 + 0.1 * Math.sin((phi - Math.PI * 0.7) * 2);
          }
          
          // Flatten bottom (inferior)
          if (theta > Math.PI * 0.7) {
            r *= 0.7 + 0.3 * Math.cos((theta - Math.PI * 0.7) * 2);
          }
          
          // Add cortical folding detail
          r *= 1 + 0.05 * Math.sin(8 * theta) * Math.sin(6 * phi);
          
          const x = r * Math.sin(theta) * Math.cos(phi);
          const y = r * Math.sin(theta) * Math.sin(phi) * 0.9; // Slight lateral compression
          const z = r * Math.cos(theta) * 1.1; // Slight superior-inferior elongation
          
          vertices.push({
            x, y, z,
            ox: x, oy: y, oz: z
          });
        }
      }
      
      return vertices;
    };

    // Initialize brain regions with anatomically accurate 3D positions
    const initializeRegions = () => {
      const scale = Math.min(canvas.width, canvas.height) * 0.3;
      
      regionsRef.current = [
        {
          id: 'frontal',
          name: 'Frontal Lobe',
          vertices: [],
          center: { x: 0, y: scale * 0.35, z: -scale * 0.45 }, // Anterior and superior
          color: '#ff6b6b',
          activation: 0,
          targetActivation: 0,
          function: 'Executive Function'
        },
        {
          id: 'parietal',
          name: 'Parietal Lobe',
          vertices: [],
          center: { x: 0, y: scale * 0.4, z: scale * 0.2 }, // Superior and posterior
          color: '#4ecdc4',
          activation: 0,
          targetActivation: 0,
          function: 'Spatial Processing'
        },
        {
          id: 'temporal_left',
          name: 'Temporal Lobe (L)',
          vertices: [],
          center: { x: -scale * 0.55, y: -scale * 0.15, z: 0 }, // Lateral left
          color: '#45b7d1',
          activation: 0,
          targetActivation: 0,
          function: 'Language & Memory'
        },
        {
          id: 'temporal_right',
          name: 'Temporal Lobe (R)',
          vertices: [],
          center: { x: scale * 0.55, y: -scale * 0.15, z: 0 }, // Lateral right
          color: '#45b7d1',
          activation: 0,
          targetActivation: 0,
          function: 'Music & Spatial'
        },
        {
          id: 'occipital',
          name: 'Occipital Lobe',
          vertices: [],
          center: { x: 0, y: scale * 0.2, z: scale * 0.55 }, // Posterior
          color: '#f39c12',
          activation: 0,
          targetActivation: 0,
          function: 'Visual Processing'
        },
        {
          id: 'motor',
          name: 'Motor Cortex',
          vertices: [],
          center: { x: 0, y: scale * 0.45, z: -scale * 0.1 }, // Central sulcus area
          color: '#9b59b6',
          activation: 0,
          targetActivation: 0,
          function: 'Movement Control'
        },
        {
          id: 'hippocampus_left',
          name: 'Hippocampus (L)',
          vertices: [],
          center: { x: -scale * 0.25, y: -scale * 0.3, z: 0 }, // Deep temporal left
          color: '#1abc9c',
          activation: 0,
          targetActivation: 0,
          function: 'Memory Formation'
        },
        {
          id: 'hippocampus_right',
          name: 'Hippocampus (R)',
          vertices: [],
          center: { x: scale * 0.25, y: -scale * 0.3, z: 0 }, // Deep temporal right
          color: '#1abc9c',
          activation: 0,
          targetActivation: 0,
          function: 'Memory Formation'
        },
        {
          id: 'amygdala_left',
          name: 'Amygdala (L)',
          vertices: [],
          center: { x: -scale * 0.3, y: -scale * 0.25, z: -scale * 0.1 }, // Anterior to hippocampus
          color: '#e74c3c',
          activation: 0,
          targetActivation: 0,
          function: 'Emotion Processing'
        },
        {
          id: 'amygdala_right',
          name: 'Amygdala (R)',
          vertices: [],
          center: { x: scale * 0.3, y: -scale * 0.25, z: -scale * 0.1 }, // Anterior to hippocampus
          color: '#e74c3c',
          activation: 0,
          targetActivation: 0,
          function: 'Emotion Processing'
        },
        {
          id: 'broca',
          name: "Broca's Area",
          vertices: [],
          center: { x: -scale * 0.4, y: scale * 0.05, z: -scale * 0.25 }, // Left frontal
          color: '#3498db',
          activation: 0,
          targetActivation: 0,
          function: 'Speech Production'
        },
        {
          id: 'wernicke',
          name: "Wernicke's Area",
          vertices: [],
          center: { x: -scale * 0.45, y: scale * 0.1, z: scale * 0.1 }, // Left temporal-parietal
          color: '#2ecc71',
          activation: 0,
          targetActivation: 0,
          function: 'Language Comprehension'
        }
      ];
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
      
      // Create more realistic fMRI activation blob
      const baseRadius = 30 * projectedCenter.scale;
      const activationRadius = baseRadius * (1 + region.activation * 0.3);
      
      // Multi-layer activation rendering for depth
      for (let layer = 3; layer >= 0; layer--) {
        const layerScale = 1 + layer * 0.3;
        const layerAlpha = region.activation * (0.2 - layer * 0.05);
        
        const gradient = ctx.createRadialGradient(
          projectedCenter.x, projectedCenter.y, 0,
          projectedCenter.x, projectedCenter.y, activationRadius * layerScale
        );
        
        // Use standard fMRI color scale (blue to red)
        let baseColor = region.color;
        if (region.activation > 0.8) {
          baseColor = '#ffff00'; // Yellow for highest
        } else if (region.activation > 0.6) {
          baseColor = '#ff4400'; // Red-orange
        } else if (region.activation > 0.4) {
          baseColor = '#ff8800'; // Orange
        } else {
          baseColor = '#0088ff'; // Blue for lower activation
        }
        
        gradient.addColorStop(0, baseColor + Math.floor(layerAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.3, baseColor + Math.floor(layerAlpha * 200).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.6, baseColor + Math.floor(layerAlpha * 100).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, baseColor + '00');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(projectedCenter.x, projectedCenter.y, activationRadius * layerScale, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw label for highly activated regions
      if (region.activation > 0.7) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${region.activation})`;
        ctx.font = `${12 * projectedCenter.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(region.name, projectedCenter.x, projectedCenter.y - activationRadius - 10);
        ctx.restore();
      }
    };

    // Draw realistic 3D brain mesh with accurate anatomy
    const drawBrainMesh = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
      // Higher resolution for more detail
      const latResolution = 50;
      const lonResolution = 80;
      const vertices: { x: number; y: number; z: number; brightness: number }[] = [];
      
      // Generate anatomically accurate brain surface
      for (let lat = 0; lat <= latResolution; lat++) {
        const v = lat / latResolution;
        const theta = v * Math.PI;
        
        for (let lon = 0; lon <= lonResolution; lon++) {
          const u = lon / lonResolution;
          const phi = u * 2 * Math.PI - Math.PI;
          
          // Base ellipsoid shape (brain is not a perfect sphere)
          const baseX = 1.0;  // Width
          const baseY = 0.85; // Height (slightly compressed)
          const baseZ = 1.2;  // Length (anterior-posterior elongation)
          
          // Calculate base position
          let x = baseX * Math.sin(theta) * Math.cos(phi);
          let y = baseY * Math.sin(theta) * Math.sin(phi);
          let z = baseZ * Math.cos(theta);
          
          // Add anatomical features
          const frontAngle = Math.atan2(z, x);
          const sideAngle = Math.atan2(y, Math.sqrt(x * x + z * z));
          
          // Frontal lobe bulge (anterior)
          if (frontAngle > -Math.PI/3 && frontAngle < Math.PI/3 && theta < Math.PI * 0.6) {
            const bulgeAmount = 0.15 * Math.cos(frontAngle * 3) * (1 - theta / Math.PI);
            x *= 1 + bulgeAmount;
            z *= 1 + bulgeAmount * 0.5;
          }
          
          // Temporal lobe protrusion (lateral)
          if (Math.abs(sideAngle) > Math.PI/6 && theta > Math.PI * 0.3 && theta < Math.PI * 0.8) {
            const protrusion = 0.2 * Math.sin((theta - Math.PI * 0.3) * 2);
            y *= 1 + protrusion;
          }
          
          // Occipital lobe (posterior)
          if (frontAngle > Math.PI * 0.4 || frontAngle < -Math.PI * 0.4) {
            if (theta < Math.PI * 0.7) {
              x *= 0.95;
              z *= 1.1;
            }
          }
          
          // Cerebellum indentation
          if (theta > Math.PI * 0.65 && (frontAngle > Math.PI * 0.3 || frontAngle < -Math.PI * 0.3)) {
            const indent = 0.15 * Math.sin((theta - Math.PI * 0.65) * 4);
            x *= 1 - indent;
            z *= 1 - indent * 0.5;
          }
          
          // Flatten inferior surface (bottom of brain)
          if (theta > Math.PI * 0.75) {
            const flatness = (theta - Math.PI * 0.75) / (Math.PI * 0.25);
            y *= 0.6 + 0.4 * (1 - flatness);
          }
          
          // Add cortical folding (gyri and sulci)
          const fold1 = 0.02 * Math.sin(theta * 8) * Math.cos(phi * 6);
          const fold2 = 0.015 * Math.sin(theta * 12) * Math.sin(phi * 8);
          const fold3 = 0.01 * Math.cos(theta * 16) * Math.cos(phi * 10);
          const folding = fold1 + fold2 + fold3;
          
          // Scale and apply folding
          x *= scale * (1 + folding);
          y *= scale * (1 + folding);
          z *= scale * (1 + folding);
          
          // Rotate and project
          const rotated = rotateVertex({ x, y, z, ox: x, oy: y, oz: z }, rotationRef.current);
          const projected = project(rotated, centerX, centerY);
          
          // Calculate lighting
          const normal = {
            x: x / scale,
            y: y / scale,
            z: z / scale
          };
          const normalLength = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
          normal.x /= normalLength;
          normal.y /= normalLength;
          normal.z /= normalLength;
          
          // Multiple light sources for better shading
          const light1 = { x: 0.3, y: 0.3, z: 0.8 };
          const light2 = { x: -0.5, y: 0.2, z: 0.5 };
          
          const dot1 = Math.max(0, normal.x * light1.x + normal.y * light1.y + normal.z * light1.z);
          const dot2 = Math.max(0, normal.x * light2.x + normal.y * light2.y + normal.z * light2.z);
          
          const brightness = 0.3 + dot1 * 0.5 + dot2 * 0.2;
          
          vertices.push({
            x: projected.x,
            y: projected.y,
            z: rotated.z,
            brightness
          });
        }
      }
      
      // Draw as triangulated mesh
      for (let lat = 0; lat < latResolution; lat++) {
        for (let lon = 0; lon < lonResolution; lon++) {
          const idx = lat * (lonResolution + 1) + lon;
          const idx1 = idx;
          const idx2 = idx + 1;
          const idx3 = idx + lonResolution + 1;
          const idx4 = idx + lonResolution + 2;
          
          const v1 = vertices[idx1];
          const v2 = vertices[idx2];
          const v3 = vertices[idx3];
          const v4 = vertices[idx4];
          
          if (v1 && v2 && v3 && v4) {
            // Only draw if facing camera (simple backface culling)
            const avgZ = (v1.z + v2.z + v3.z + v4.z) / 4;
            if (avgZ > -600) {
              const avgBrightness = (v1.brightness + v2.brightness + v3.brightness + v4.brightness) / 4;
              const gray = Math.floor(30 + avgBrightness * 160);
              
              ctx.fillStyle = `rgb(${gray}, ${gray - 5}, ${gray - 10})`; // Slight pink tint
              ctx.strokeStyle = `rgb(${gray - 20}, ${gray - 25}, ${gray - 30})`;
              ctx.lineWidth = 0.5;
              
              // Draw quad
              ctx.beginPath();
              ctx.moveTo(v1.x, v1.y);
              ctx.lineTo(v2.x, v2.y);
              ctx.lineTo(v4.x, v4.y);
              ctx.lineTo(v3.x, v3.y);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            }
          }
        }
      }
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
      
      // Auto-rotate slowly
      if (!mouseRef.current.down) {
        rotationRef.current.y += 0.002;
      }
      
      // Draw 3D brain mesh
      drawBrainMesh(ctx, centerX, centerY, scale);
      
      // Sort regions by depth
      const sortedRegions = [...regionsRef.current].sort((a, b) => {
        const aRotated = rotateVertex(a.center as BrainVertex, rotationRef.current);
        const bRotated = rotateVertex(b.center as BrainVertex, rotationRef.current);
        return bRotated.z - aRotated.z;
      });
      
      // Update and draw regions
      sortedRegions.forEach(region => {
        // Random activation - less frequent for more realistic fMRI
        if (Math.random() < 0.005) {
          region.targetActivation = 0.4 + Math.random() * 0.6;
        }
        
        // Gradual deactivation
        if (Math.random() < 0.002) {
          region.targetActivation = 0;
        }
        
        // Smooth transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.02;
        
        // Only draw if activation is significant
        if (region.activation > 0.1) {
          drawRegion3D(ctx, region, centerX, centerY);
        }
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