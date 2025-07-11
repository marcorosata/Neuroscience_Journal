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
          
          // Create a duplicate brain mesh for glowing effects
          const glowBrainGeometry = mainBrainMesh.geometry.clone();
          const glowBrainMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });
          
          const glowBrain = new THREE.Mesh(glowBrainGeometry, glowBrainMaterial);
          glowBrain.position.copy(mainBrainMesh.position);
          glowBrain.rotation.copy(mainBrainMesh.rotation);
          glowBrain.scale.copy(mainBrainMesh.scale);
          glowBrain.scale.multiplyScalar(1.01); // Slightly larger to avoid z-fighting
          
          activationGroup.add(glowBrain);
          
          // Store reference for animation
          activationGroup.userData.glowBrain = glowBrain;
          activationGroup.userData.glowMaterial = glowBrainMaterial;
          
          // Create vertex-based activation regions
          const geometry = glowBrainGeometry;
          const positionAttribute = geometry.attributes.position;
          const vertexCount = positionAttribute.count;
          
          // Create color attribute for vertex colors
          const colors = new Float32Array(vertexCount * 3);
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Update material to use vertex colors
          glowBrainMaterial.vertexColors = true;
          
          // Map vertices to brain regions based on position
          const vertexRegions = new Array(vertexCount);
          
          for (let i = 0; i < vertexCount; i++) {
            const vertex = new THREE.Vector3(
              positionAttribute.getX(i),
              positionAttribute.getY(i),
              positionAttribute.getZ(i)
            );
            
            // Find closest region for each vertex
            let closestRegion = null;
            let closestDistance = Infinity;
            
            regionsRef.current.forEach(region => {
              // Scale region positions to match brain scale
              const scaledPosition = region.position.clone().normalize().multiplyScalar(50);
              const distance = vertex.distanceTo(scaledPosition);
              
              if (distance < closestDistance && distance < 30) { // Within 30 units
                closestDistance = distance;
                closestRegion = region.id;
              }
            });
            
            vertexRegions[i] = closestRegion;
          }
          
          // Store vertex mapping
          activationGroup.userData.vertexRegions = vertexRegions;
          activationGroup.userData.colorAttribute = geometry.attributes.color;
          
          console.log('Created surface-based activation system');
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
        // Much more frequent activation - allow up to 3 regions active
        if (Math.random() < 0.08 && activeRegions < 3) {
          region.targetActivation = 0.9 + Math.random() * 0.1;
        }
        
        // Slower deactivation for longer visibility
        if (Math.random() < 0.01) {
          region.targetActivation = Math.max(0, region.targetActivation - 0.1);
        }
        
        // Smooth transitions
        const diff = region.targetActivation - region.activation;
        region.activation += diff * 0.05;
        
        // Clamp to zero if very low
        if (region.activation < 0.01) {
          region.activation = 0;
          region.targetActivation = 0;
        }
      });

      // Update brain surface glow based on region activations
      const glowBrain = activationGroup.userData.glowBrain;
      const glowMaterial = activationGroup.userData.glowMaterial;
      const vertexRegions = activationGroup.userData.vertexRegions;
      const colorAttribute = activationGroup.userData.colorAttribute;
      
      if (glowBrain && vertexRegions && colorAttribute) {
        const time = Date.now() * 0.003;
        const colors = colorAttribute.array;
        
        // Update vertex colors based on region activations
        for (let i = 0; i < vertexRegions.length; i++) {
          const regionId = vertexRegions[i];
          let r = 0, g = 0, b = 0;
          
          if (regionId) {
            const region = regionsRef.current.find(reg => reg.id === regionId);
            if (region && region.activation > 0) {
              // Apply pulsing effect
              const pulse = Math.sin(time * 2) * 0.2 + 0.8;
              const intensity = region.activation * pulse;
              
              // Convert color based on activation level (fMRI style)
              if (region.activation > 0.8) {
                // Yellow
                r = intensity;
                g = intensity;
                b = 0;
              } else if (region.activation > 0.6) {
                // Red-orange
                r = intensity;
                g = intensity * 0.4;
                b = 0;
              } else if (region.activation > 0.4) {
                // Orange
                r = intensity;
                g = intensity * 0.6;
                b = 0;
              } else if (region.activation > 0.2) {
                // Red
                r = intensity;
                g = 0;
                b = 0;
              } else {
                // Blue
                r = 0;
                g = intensity * 0.5;
                b = intensity;
              }
            }
          }
          
          colors[i * 3] = r;
          colors[i * 3 + 1] = g;
          colors[i * 3 + 2] = b;
        }
        
        colorAttribute.needsUpdate = true;
        
        // Update overall glow opacity based on max activation
        const maxActivation = Math.max(...regionsRef.current.map(r => r.activation));
        glowMaterial.opacity = maxActivation * 0.8;
      }

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