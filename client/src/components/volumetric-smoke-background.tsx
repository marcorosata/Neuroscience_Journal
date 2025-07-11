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

    // Create volumetric smoke using multiple layered planes
    const smokeGeometry = new THREE.PlaneGeometry(12, 16);
    const smokeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.08 },
        scale: { value: 1.0 },
        color: { value: new THREE.Color(0x666666) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float scale;
        
        // Noise function for realistic turbulence
        float noise(vec3 p) {
          return sin(p.x * 2.0 + time * 0.5) * 
                 sin(p.y * 1.8 + time * 0.3) * 
                 sin(p.z * 2.2 + time * 0.4) * 0.5 + 0.5;
        }
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Add realistic turbulent displacement
          vec3 pos = position;
          float n = noise(pos * 0.8 + time * 0.2);
          pos.x += sin(time * 0.3 + pos.y * 0.1) * n * 0.3;
          pos.z += cos(time * 0.4 + pos.y * 0.1) * n * 0.2;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float opacity;
        uniform vec3 color;
        
        // Multi-octave noise for realistic smoke patterns
        float noise(vec2 p) {
          return sin(p.x * 3.0 + time * 0.2) * sin(p.y * 2.5 + time * 0.15) * 0.5 + 0.5;
        }
        
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for(int i = 0; i < 4; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }
        
        void main() {
          vec2 uv = vUv;
          
          // Create realistic smoke density patterns
          vec2 smokeUV = uv + vec2(
            sin(time * 0.1 + vPosition.y * 0.02) * 0.1,
            time * 0.03
          );
          
          float smokeDensity = fbm(smokeUV * 2.0);
          
          // Add wispy tendrils
          float tendrils = fbm(uv * 6.0 + time * 0.1) * 0.3;
          smokeDensity += tendrils;
          
          // Create realistic falloff from center
          float distanceFromCenter = distance(uv, vec2(0.5));
          float falloff = smoothstep(0.7, 0.2, distanceFromCenter);
          
          // Vertical gradient for realistic smoke dissipation
          float verticalGradient = smoothstep(0.0, 0.8, 1.0 - uv.y);
          
          float alpha = smokeDensity * falloff * verticalGradient * opacity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `
    });

    // Create multiple smoke layers for depth
    const smokeLayers = [];
    for (let i = 0; i < 8; i++) {
      const smokePlane = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
      smokePlane.position.set(
        (Math.random() - 0.5) * 4,
        -6 + i * 1.5,
        (Math.random() - 0.5) * 2
      );
      smokePlane.rotation.z = Math.random() * Math.PI;
      smokePlane.scale.set(
        0.8 + Math.random() * 0.4,
        0.8 + Math.random() * 0.4,
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
        const material = layer.material as THREE.ShaderMaterial;
        material.uniforms.time.value = time + index * 0.5;
        
        // Slow upward movement
        layer.position.y += 0.005;
        
        // Realistic expansion as smoke rises
        layer.scale.x += 0.001;
        layer.scale.y += 0.001;
        
        // Slow rotation
        layer.rotation.z += 0.0005;
        
        // Fade out as it gets higher
        const opacity = Math.max(0, 0.08 - (layer.position.y + 6) * 0.01);
        material.uniforms.opacity.value = opacity;
        
        // Reset when too high
        if (layer.position.y > 8) {
          layer.position.y = -6;
          layer.position.x = (Math.random() - 0.5) * 4;
          layer.position.z = (Math.random() - 0.5) * 2;
          layer.scale.set(
            0.8 + Math.random() * 0.4,
            0.8 + Math.random() * 0.4,
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