import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSmokeBackgroundProps {
  className?: string;
}

export default function ThreeSmokeBackground({ className = '' }: ThreeSmokeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const smokeParticlesRef = useRef<THREE.Points[]>([]);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    containerRef.current.appendChild(renderer.domElement);

    // Create smoke texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    // Create radial gradient for smoke texture
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Create smoke particles
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    const maxLifetimes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random starting positions
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = -10 + Math.random() * 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Upward velocity with some randomness
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = 0.01 + Math.random() * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      
      opacities[i] = 0.1 + Math.random() * 0.3;
      sizes[i] = 0.5 + Math.random() * 1.5;
      lifetimes[i] = 0;
      maxLifetimes[i] = 200 + Math.random() * 300;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      map: texture,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      color: 0x888888,
      size: 3,
      sizeAttenuation: true,
      opacity: 0.2
    });

    const smokeSystem = new THREE.Points(geometry, material);
    scene.add(smokeSystem);
    smokeParticlesRef.current = [smokeSystem];

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      const positions = geometry.attributes.position.array as Float32Array;
      const opacities = geometry.attributes.opacity.array as Float32Array;
      const sizes = geometry.attributes.size.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update positions with realistic physics and turbulence
        positions[i3] += velocities[i3] + Math.sin(time + positions[i3 + 1] * 0.01) * 0.002;
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2] + Math.cos(time + positions[i3 + 1] * 0.01) * 0.002;
        
        // Update lifetime
        lifetimes[i]++;
        
        // Expand and fade
        sizes[i] += 0.005;
        opacities[i] *= 0.995;
        
        // Reset particle if it's too old or too high
        if (lifetimes[i] >= maxLifetimes[i] || positions[i3 + 1] > 10) {
          positions[i3] = (Math.random() - 0.5) * 20;
          positions[i3 + 1] = -10 + Math.random() * 5;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
          
          velocities[i3] = (Math.random() - 0.5) * 0.02;
          velocities[i3 + 1] = 0.01 + Math.random() * 0.02;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
          
          opacities[i] = 0.1 + Math.random() * 0.3;
          sizes[i] = 0.5 + Math.random() * 1.5;
          lifetimes[i] = 0;
          maxLifetimes[i] = 200 + Math.random() * 300;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.opacity.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}