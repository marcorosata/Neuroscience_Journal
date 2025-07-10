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
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    rimLight.position.set(-1, 0, -1);
    scene.add(rimLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 3;
    controls.maxDistance = 10;
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
      '/attached_assets/human-brain_1752181594149.glb',
      (gltf) => {
        const brain = gltf.scene;
        brain.scale.set(2, 2, 2);
        brain.position.set(0, 0, 0);
        
        // Find the main brain mesh
        let mainBrainMesh: THREE.Mesh | null = null;
        brain.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (!mainBrainMesh || child.geometry.attributes.position.count > mainBrainMesh.geometry.attributes.position.count) {
              mainBrainMesh = child;
            }
            
            // Set brain material to darker gray for better contrast
            child.material = new THREE.MeshPhongMaterial({
              color: 0x444444,
              specular: 0x111111,
              shininess: 30,
              transparent: false
            });
          }
        });
        
        if (mainBrainMesh) {
          brainMeshRef.current = mainBrainMesh;
          
          // Create activation regions as separate meshes on brain surface
          regionsRef.current.forEach(region => {
            // Create a flattened sphere for surface activation
            const geometry = new THREE.SphereGeometry(region.radius, 16, 16);
            geometry.scale(1, 0.3, 1); // Flatten to create surface effect
            
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
            activationMesh.position.copy(region.position);
            activationMesh.userData = { regionId: region.id };
            
            // Orient the activation patch to follow brain surface
            activationMesh.lookAt(new THREE.Vector3(0, 0, 0));
            
            activationGroup.add(activationMesh);
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

      // Update brain regions - only activate 1-3 regions at a time
      const activeRegions = regionsRef.current.filter(r => r.activation > 0.1).length;
      
      regionsRef.current.forEach(region => {
        // More controlled activation - only if few regions are active
        if (Math.random() < 0.003 && activeRegions < 3) {
          region.targetActivation = 0.5 + Math.random() * 0.5;
        }
        
        // Gradual deactivation
        if (Math.random() < 0.005) {
          region.targetActivation = Math.max(0, region.targetActivation - 0.1);
        }
        
        // Smooth transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.03;
        
        // Clamp to zero if very low
        if (region.activation < 0.02) {
          region.activation = 0;
          region.targetActivation = 0;
        }
      });

      // Update activation visualizations
      activationGroup.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.regionId) {
          const region = regionsRef.current.find(r => r.id === child.userData.regionId);
          if (region && child.material instanceof THREE.MeshPhongMaterial) {
            // Update material based on activation
            const material = child.material;
            material.opacity = region.activation * 0.6;
            material.emissiveIntensity = region.activation * 1.5;
            
            // Pulsing effect
            const scale = 1 + Math.sin(Date.now() * 0.003) * 0.05 * region.activation;
            child.scale.set(scale, scale, scale);
            
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