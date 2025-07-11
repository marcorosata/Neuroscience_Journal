import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VisibleSmokeBackgroundProps {
  className?: string;
}

export default function VisibleSmokeBackground({ className = '' }: VisibleSmokeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const particlesRef = useRef<THREE.Points>();
  const velocitiesRef = useRef<Float32Array>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.set(0, 0, 15);

    // Create smoke particles with much more visible setup
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = -15 + Math.random() * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;
      
      // Initialize velocities for realistic smoke movement
      velocities[i3] = (Math.random() - 0.5) * 0.02; // horizontal drift
      velocities[i3 + 1] = 0.01 + Math.random() * 0.01; // upward motion
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02; // depth drift
    }
    
    velocitiesRef.current = velocities;
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create highly visible material
    const material = new THREE.PointsMaterial({
      transparent: true,
      opacity: 0.8,
      size: 20,
      sizeAttenuation: true,
      color: 0xffffff,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const smokeSystem = new THREE.Points(geometry, material);
    scene.add(smokeSystem);
    particlesRef.current = smokeSystem;

    // Mouse interaction handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Convert mouse coordinates to world coordinates
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.isMoving = true;
      
      // Clear the moving flag after a short delay
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    // Add mouse event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      const positionArray = geometry.attributes.position.array as Float32Array;
      const velocityArray = velocitiesRef.current!;
      
      // Update each particle
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Apply velocities
        positionArray[i3] += velocityArray[i3];
        positionArray[i3 + 1] += velocityArray[i3 + 1];
        positionArray[i3 + 2] += velocityArray[i3 + 2];
        
        // Mouse interaction - push particles away from cursor
        if (mouseRef.current.isMoving) {
          const mouseWorldX = mouseRef.current.x * 15; // Scale to world coordinates
          const mouseWorldY = mouseRef.current.y * 15;
          
          const dx = positionArray[i3] - mouseWorldX;
          const dy = positionArray[i3 + 1] - mouseWorldY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 8) {
            const force = (8 - distance) / 8;
            const forceX = (dx / distance) * force * 0.1;
            const forceY = (dy / distance) * force * 0.1;
            
            velocityArray[i3] += forceX;
            velocityArray[i3 + 1] += forceY;
          }
        }
        
        // Add natural turbulence
        positionArray[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.01;
        positionArray[i3 + 2] += Math.cos(time * 0.3 + i * 0.1) * 0.01;
        
        // Apply drag
        velocityArray[i3] *= 0.98;
        velocityArray[i3 + 1] *= 0.99;
        velocityArray[i3 + 2] *= 0.98;
        
        // Reset when too high
        if (positionArray[i3 + 1] > 20) {
          positionArray[i3 + 1] = -15;
          positionArray[i3] = (Math.random() - 0.5) * 30;
          positionArray[i3 + 2] = (Math.random() - 0.5) * 15;
          
          // Reset velocities
          velocityArray[i3] = (Math.random() - 0.5) * 0.02;
          velocityArray[i3 + 1] = 0.01 + Math.random() * 0.01;
          velocityArray[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      
      // Gentle rotation for natural movement
      smokeSystem.rotation.y = time * 0.02;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-10 ${className}`}
    />
  );
}