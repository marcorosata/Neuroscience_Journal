import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface BrainRegion {
  id: string;
  name: string;
  position: THREE.Vector3;
  color: number;
  activation: number;
  targetActivation: number;
  function: string;
  radius: number;
}

interface FMRI3DModelProps {
  className?: string;
}

export default function FMRI3DModelSurface({ className = '' }: FMRI3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const brainModelRef = useRef<THREE.Object3D | null>(null);
  const brainMeshRef = useRef<THREE.Mesh | null>(null);
  const regionsRef = useRef<BrainRegion[]>([]);
  const animationIdRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 200);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Enhanced lighting for better brain visibility
    const ambientLight = new THREE.AmbientLight(0x606060, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x6699ff, 0.4);
    rimLight.position.set(-1, 0, -1);
    scene.add(rimLight);

    // Additional fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(0, -1, 1);
    scene.add(fillLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 200;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Initialize brain regions with positions on brain surface
    regionsRef.current = [
      {
        id: 'frontal',
        name: 'Frontal Lobe',
        position: new THREE.Vector3(0, 0.7, -1.2),
        color: 0xff6b6b,
        activation: 0,
        targetActivation: 0,
        function: 'Executive Function',
        radius: 0.5
      },
      {
        id: 'parietal',
        name: 'Parietal Lobe',
        position: new THREE.Vector3(0, 0.8, 0.5),
        color: 0x4ecdc4,
        activation: 0,
        targetActivation: 0,
        function: 'Spatial Processing',
        radius: 0.4
      },
      {
        id: 'temporal_left',
        name: 'Temporal Lobe (L)',
        position: new THREE.Vector3(-1.4, -0.3, 0),
        color: 0x45b7d1,
        activation: 0,
        targetActivation: 0,
        function: 'Language & Memory',
        radius: 0.45
      },
      {
        id: 'temporal_right',
        name: 'Temporal Lobe (R)',
        position: new THREE.Vector3(1.4, -0.3, 0),
        color: 0x45b7d1,
        activation: 0,
        targetActivation: 0,
        function: 'Music & Spatial',
        radius: 0.45
      },
      {
        id: 'occipital',
        name: 'Occipital Lobe',
        position: new THREE.Vector3(0, 0.4, 1.4),
        color: 0xf39c12,
        activation: 0,
        targetActivation: 0,
        function: 'Visual Processing',
        radius: 0.35
      },
      {
        id: 'motor',
        name: 'Motor Cortex',
        position: new THREE.Vector3(0, 1.0, -0.2),
        color: 0x9b59b6,
        activation: 0,
        targetActivation: 0,
        function: 'Movement Control',
        radius: 0.3
      },
      {
        id: 'broca',
        name: "Broca's Area",
        position: new THREE.Vector3(-0.8, 0.2, -0.8),
        color: 0x3498db,
        activation: 0,
        targetActivation: 0,
        function: 'Speech Production',
        radius: 0.25
      },
      {
        id: 'wernicke',
        name: "Wernicke's Area",
        position: new THREE.Vector3(-1.1, 0.3, 0.3),
        color: 0x2ecc71,
        activation: 0,
        targetActivation: 0,
        function: 'Language Comprehension',
        radius: 0.25
      }
    ];

    // Create activation decals group
    const activationGroup = new THREE.Group();
    scene.add(activationGroup);

    // Load brain model
    const loader = new GLTFLoader();
    loader.load(
      '/attached_assets/brain_1752183297653.glb',
      (gltf) => {
        const brain = gltf.scene;
        brain.scale.set(1, 1, 1);
        brain.position.set(0, 0, 0);
        
        // Find the main brain mesh
        let mainBrainMesh: THREE.Mesh | null = null;
        brain.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (!mainBrainMesh || child.geometry.attributes.position.count > mainBrainMesh.geometry.attributes.position.count) {
              mainBrainMesh = child;
            }
            
            // Set brain material to lighter gray for better visibility
            child.material = new THREE.MeshPhongMaterial({
              color: 0x888888,
              specular: 0x333333,
              shininess: 40,
              transparent: false
            });
          }
        });
        
        if (mainBrainMesh) {
          brainMeshRef.current = mainBrainMesh;
          
          // Create surface-based activation patterns that follow brain geometry
          regionsRef.current.forEach(region => {
            // Create activation patches that conform to brain surface
            const patchSize = region.radius * 15; // Large but reasonable size
            const patchResolution = 32; // Number of vertices in patch
            
            // Create a grid of points around the region center
            const activationPoints: THREE.Vector3[] = [];
            const raycaster = new THREE.Raycaster();
            
            // Generate points in a circular pattern around the region center
            for (let angle = 0; angle < Math.PI * 2; angle += (Math.PI * 2) / patchResolution) {
              for (let radius = 0; radius < patchSize; radius += patchSize / 8) {
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                // Create a point in local space around the region
                const localPoint = new THREE.Vector3(x, 0, z);
                
                // Transform to world space relative to region position
                const worldPoint = region.position.clone().add(localPoint);
                
                // Cast ray from far outside toward brain center to find surface intersection
                const rayOrigin = worldPoint.clone().normalize().multiplyScalar(10);
                const rayDirection = worldPoint.clone().sub(rayOrigin).normalize();
                
                raycaster.set(rayOrigin, rayDirection);
                const intersects = raycaster.intersectObject(mainBrainMesh, true);
                
                if (intersects.length > 0) {
                  // Add the intersection point (actual brain surface)
                  const surfacePoint = intersects[0].point.clone();
                  activationPoints.push(surfacePoint);
                }
              }
            }
            
            // Create multiple layers for heat wave effect
            const glowLayers = 3;
            
            for (let layerIndex = 0; layerIndex < glowLayers; layerIndex++) {
              const layerScale = 1 + layerIndex * 0.3;
              const layerOpacity = Math.exp(-layerIndex * 0.4);
              
              // Create geometry from surface points
              const geometry = new THREE.BufferGeometry();
              const positions: number[] = [];
              const indices: number[] = [];
              
              // Add all surface points
              activationPoints.forEach(point => {
                const scaledPoint = point.clone().sub(region.position).multiplyScalar(layerScale).add(region.position);
                positions.push(scaledPoint.x, scaledPoint.y, scaledPoint.z);
              });
              
              // Create triangular faces (simple fan triangulation from center)
              const centerIndex = positions.length / 3;
              positions.push(region.position.x, region.position.y, region.position.z);
              
              for (let i = 0; i < activationPoints.length; i++) {
                const next = (i + 1) % activationPoints.length;
                indices.push(centerIndex, i, next);
              }
              
              geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
              geometry.setIndex(indices);
              geometry.computeVertexNormals();
              
              const material = new THREE.MeshPhongMaterial({
                color: region.color,
                emissive: region.color,
                emissiveIntensity: 0,
                transparent: true,
                opacity: 0,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
              });
              
              const activationMesh = new THREE.Mesh(geometry, material);
              activationMesh.userData = { 
                regionId: region.id, 
                layerIndex: layerIndex,
                baseOpacity: layerOpacity,
                wavePhase: Math.random() * Math.PI * 2
              };
              
              activationGroup.add(activationMesh);
            }
          });
        }
        
        scene.add(brain);
        brainModelRef.current = brain;
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading brain model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Update brain regions - more frequent activations
      const activeRegions = regionsRef.current.filter(r => r.activation > 0.1).length;
      
      regionsRef.current.forEach(region => {
        // More frequent activation - allow up to 3 regions active (localized pattern)
        if (Math.random() < 0.025 && activeRegions < 3) {
          region.targetActivation = 0.9 + Math.random() * 0.1;
        }
        
        // Faster deactivation
        if (Math.random() < 0.02) {
          region.targetActivation = Math.max(0, region.targetActivation - 0.2);
        }
        
        // Faster transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.08;
        
        // Clamp to zero if very low
        if (region.activation < 0.05) {
          region.activation = 0;
          region.targetActivation = 0;
        }
      });

      // Update activation visualizations with gradient glow
      activationGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.regionId) {
          const region = regionsRef.current.find(r => r.id === child.userData.regionId);
          if (region && child.material instanceof THREE.MeshPhongMaterial) {
            const material = child.material;
            const layerIndex = child.userData.layerIndex || 0;
            const baseOpacity = child.userData.baseOpacity || 1;
            
            // Heat wave intensity with exponential falloff
            const wavePhase = child.userData.wavePhase || 0;
            const time = Date.now() * 0.003;
            const waveIntensity = Math.sin(time + wavePhase + layerIndex * 0.3) * 0.5 + 0.5;
            
            const layerIntensity = Math.exp(-layerIndex * 0.15) * waveIntensity;
            const finalOpacity = region.activation * baseOpacity * layerIntensity * 2.5;
            const finalEmissive = region.activation * layerIntensity * 6.0;
            
            material.opacity = finalOpacity;
            material.emissiveIntensity = finalEmissive;
            
            // Heat wave ripple effect
            const rippleScale = 1 + Math.sin(time * 2 + layerIndex * 0.8) * 0.1 * region.activation;
            child.scale.set(rippleScale, rippleScale, rippleScale);
            
            // Change color based on activation level
            if (region.activation > 0.8) {
              material.color.setHex(0xffff00); // Yellow
              material.emissive.setHex(0xffff00);
            } else if (region.activation > 0.6) {
              material.color.setHex(0xff4400); // Red-orange
              material.emissive.setHex(0xff4400);
            } else if (region.activation > 0.4) {
              material.color.setHex(0xff8800); // Orange
              material.emissive.setHex(0xff8800);
            } else {
              material.color.setHex(region.color);
              material.emissive.setHex(region.color);
            }
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
      
      // Dispose of Three.js resources
      activationGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
      
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 z-0 ${className}`}
      style={{ cursor: 'grab' }}
    />
  );
}