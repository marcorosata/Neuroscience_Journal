import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface SimpleSmokeBackgroundProps {
  className?: string;
}

export default function SimpleSmokeBackground({ className = '' }: SimpleSmokeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();

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
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = -8 + Math.random() * 16;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
      scales[i] = 1 + Math.random() * 2;
    }
    
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

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Simple rotation for visibility
      smokeSystem.rotation.y = time * 0.1;
      
      // Move particles upward
      const positionArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positionArray[i3 + 1] += 0.01; // Move up
        
        // Reset when too high
        if (positionArray[i3 + 1] > 10) {
          positionArray[i3 + 1] = -8;
          positionArray[i3] = (Math.random() - 0.5) * 15;
          positionArray[i3 + 2] = (Math.random() - 0.5) * 8;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

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