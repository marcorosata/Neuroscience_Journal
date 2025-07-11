import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SimpleSmokeBackgroundProps {
  className?: string;
}

export default function SimpleSmokeBackground({ className = '' }: SimpleSmokeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
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

    camera.position.set(0, 0, 5);

    // Create very simple smoke texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Simple radial gradient
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);

    // Create smoke particles
    const particleCount = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = -8 + Math.random() * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
      scales[i] = 1 + Math.random() * 2;
      
      // Initialize velocities for realistic smoke movement
      velocities[i3] = (Math.random() - 0.5) * 0.01; // slight horizontal drift
      velocities[i3 + 1] = 0.008 + Math.random() * 0.004; // upward motion
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01; // slight depth drift
    }
    
    velocitiesRef.current = velocities;
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Simple material that should definitely be visible
    const material = new THREE.PointsMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      size: 8,
      sizeAttenuation: true,
      color: 0xcccccc,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const smokeSystem = new THREE.Points(geometry, material);
    scene.add(smokeSystem);

    // Mouse interaction handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Convert mouse coordinates to normalized device coordinates
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseRef.current.isMoving = true;
      
      // Clear the moving flag after a short delay
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Gentle rotation for natural movement
      smokeSystem.rotation.y = time * 0.05;
      
      // Update particle positions with mouse interaction
      const positionArray = geometry.attributes.position.array as Float32Array;
      const velocityArray = velocitiesRef.current!;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Calculate distance from mouse cursor in 3D space
        const mouseX = mouseRef.current.x * 7.5; // Scale to world coordinates
        const mouseY = mouseRef.current.y * 7.5;
        
        const dx = positionArray[i3] - mouseX;
        const dy = positionArray[i3 + 1] - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply mouse interaction forces
        if (mouseRef.current.isMoving && distance < 5) {
          const force = (5 - distance) / 5; // Stronger force when closer
          const angle = Math.atan2(dy, dx);
          
          // Push particles away from cursor with realistic turbulence
          velocityArray[i3] += Math.cos(angle) * force * 0.005;
          velocityArray[i3 + 1] += Math.sin(angle) * force * 0.005;
          velocityArray[i3 + 2] += (Math.random() - 0.5) * force * 0.003;
        }
        
        // Apply velocity damping for realistic smoke behavior
        velocityArray[i3] *= 0.99;
        velocityArray[i3 + 1] *= 0.995;
        velocityArray[i3 + 2] *= 0.99;
        
        // Ensure minimum upward velocity for natural smoke rise
        velocityArray[i3 + 1] = Math.max(velocityArray[i3 + 1], 0.004);
        
        // Update positions with velocities
        positionArray[i3] += velocityArray[i3];
        positionArray[i3 + 1] += velocityArray[i3 + 1];
        positionArray[i3 + 2] += velocityArray[i3 + 2];
        
        // Add subtle turbulence even without mouse interaction
        positionArray[i3] += Math.sin(time * 0.3 + i * 0.1) * 0.002;
        positionArray[i3 + 2] += Math.cos(time * 0.2 + i * 0.1) * 0.002;
        
        // Reset when too high
        if (positionArray[i3 + 1] > 10) {
          positionArray[i3 + 1] = -8;
          positionArray[i3] = (Math.random() - 0.5) * 15;
          positionArray[i3 + 2] = (Math.random() - 0.5) * 8;
          
          // Reset velocities
          velocityArray[i3] = (Math.random() - 0.5) * 0.01;
          velocityArray[i3 + 1] = 0.008 + Math.random() * 0.004;
          velocityArray[i3 + 2] = (Math.random() - 0.5) * 0.01;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Add mouse event listeners for interaction
    document.addEventListener('mousemove', handleMouseMove);

    // Resize handler
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
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}