import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface VolumetricSmokeBackgroundProps {
  className?: string;
}

export default function VolumetricSmokeBackground({ className = '' }: VolumetricSmokeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Position camera
    camera.position.set(0, 0, 8);

    // Create simple but highly visible smoke texture
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Create radial gradient for smoke texture
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create simple smoke geometry and material
    const smokeGeometry = new THREE.PlaneGeometry(8, 10);
    const smokeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.2,
      color: 0xcccccc,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create multiple smoke layers for depth
    const smokeLayers = [];
    for (let i = 0; i < 12; i++) {
      const smokePlane = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
      smokePlane.position.set(
        (Math.random() - 0.5) * 6,
        -8 + i * 1.2,
        (Math.random() - 0.5) * 3
      );
      smokePlane.rotation.z = Math.random() * Math.PI;
      smokePlane.scale.set(
        0.6 + Math.random() * 0.8,
        0.6 + Math.random() * 0.8,
        1
      );
      scene.add(smokePlane);
      smokeLayers.push(smokePlane);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Update each smoke layer
      smokeLayers.forEach((layer, index) => {
        const material = layer.material as THREE.MeshBasicMaterial;
        
        // Add subtle turbulence
        layer.position.x += Math.sin(time * 0.2 + index) * 0.001;
        layer.position.z += Math.cos(time * 0.15 + index) * 0.001;
        
        // Slow upward movement
        layer.position.y += 0.008;
        
        // Realistic expansion as smoke rises
        layer.scale.x += 0.002;
        layer.scale.y += 0.002;
        
        // Slow rotation
        layer.rotation.z += 0.001;
        
        // Fade out as it gets higher
        const opacity = Math.max(0, 0.2 - (layer.position.y + 8) * 0.015);
        material.opacity = opacity;
        
        // Reset when too high
        if (layer.position.y > 10) {
          layer.position.y = -8;
          layer.position.x = (Math.random() - 0.5) * 6;
          layer.position.z = (Math.random() - 0.5) * 3;
          layer.scale.set(
            0.6 + Math.random() * 0.8,
            0.6 + Math.random() * 0.8,
            1
          );
          layer.rotation.z = Math.random() * Math.PI;
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
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
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
    />
  );
}