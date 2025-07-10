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
}

interface FMRI3DModelProps {
  className?: string;
}

export default function FMRI3DModel({ className = '' }: FMRI3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const brainModelRef = useRef<THREE.Object3D | null>(null);
  const brainMeshRef = useRef<THREE.Mesh | null>(null);
  const regionsRef = useRef<BrainRegion[]>([]);
  const activationMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const animationIdRef = useRef<number>(0);
  const raycaster = useRef(new THREE.Raycaster());
  const activationTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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

    // Load brain model
    const loader = new GLTFLoader();
    loader.load(
      '/attached_assets/human-brain_1752181594149.glb',
      (gltf) => {
        const brain = gltf.scene;
        brain.scale.set(2, 2, 2);
        brain.position.set(0, 0, 0);
        
        // Find the main brain mesh and apply materials
        let mainBrainMesh: THREE.Mesh | null = null;
        brain.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (!mainBrainMesh || child.geometry.attributes.position.count > mainBrainMesh.geometry.attributes.position.count) {
              mainBrainMesh = child;
            }
            child.material = new THREE.MeshPhongMaterial({
              color: 0x999999,
              specular: 0x222222,
              shininess: 20,
              transparent: false,
              opacity: 1
            });
          }
        });
        
        if (mainBrainMesh) {
          brainMeshRef.current = mainBrainMesh;
          
          // Clone the brain mesh for activation overlay
          const activationGeometry = mainBrainMesh.geometry.clone();
          const activationMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.FrontSide
          });
          
          const activationMesh = new THREE.Mesh(activationGeometry, activationMaterial);
          activationMesh.scale.set(1.001, 1.001, 1.001); // Slightly larger to avoid z-fighting
          mainBrainMesh.add(activationMesh);
          
          // Store activation mesh for each region
          regionsRef.current.forEach(region => {
            activationMeshesRef.current.set(region.id, activationMesh);
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

    // Initialize brain regions
    regionsRef.current = [
      {
        id: 'frontal',
        name: 'Frontal Lobe',
        position: new THREE.Vector3(0, 0.7, -1.2),
        color: 0xff6b6b,
        activation: 0,
        targetActivation: 0,
        function: 'Executive Function'
      },
      {
        id: 'parietal',
        name: 'Parietal Lobe',
        position: new THREE.Vector3(0, 0.8, 0.5),
        color: 0x4ecdc4,
        activation: 0,
        targetActivation: 0,
        function: 'Spatial Processing'
      },
      {
        id: 'temporal_left',
        name: 'Temporal Lobe (L)',
        position: new THREE.Vector3(-1.4, -0.3, 0),
        color: 0x45b7d1,
        activation: 0,
        targetActivation: 0,
        function: 'Language & Memory'
      },
      {
        id: 'temporal_right',
        name: 'Temporal Lobe (R)',
        position: new THREE.Vector3(1.4, -0.3, 0),
        color: 0x45b7d1,
        activation: 0,
        targetActivation: 0,
        function: 'Music & Spatial'
      },
      {
        id: 'occipital',
        name: 'Occipital Lobe',
        position: new THREE.Vector3(0, 0.4, 1.4),
        color: 0xf39c12,
        activation: 0,
        targetActivation: 0,
        function: 'Visual Processing'
      },
      {
        id: 'motor',
        name: 'Motor Cortex',
        position: new THREE.Vector3(0, 1.0, -0.2),
        color: 0x9b59b6,
        activation: 0,
        targetActivation: 0,
        function: 'Movement Control'
      },
      {
        id: 'hippocampus_left',
        name: 'Hippocampus (L)',
        position: new THREE.Vector3(-0.6, -0.7, 0),
        color: 0x1abc9c,
        activation: 0,
        targetActivation: 0,
        function: 'Memory Formation'
      },
      {
        id: 'hippocampus_right',
        name: 'Hippocampus (R)',
        position: new THREE.Vector3(0.6, -0.7, 0),
        color: 0x1abc9c,
        activation: 0,
        targetActivation: 0,
        function: 'Memory Formation'
      }
    ];

    // Create texture for surface activation
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 2048;
    textureCanvasRef.current = textureCanvas;
    
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.needsUpdate = true;
    activationTextureRef.current = texture;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Update brain regions
      let anyActive = false;
      regionsRef.current.forEach(region => {
        // Random activation
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
        
        if (region.activation > 0.01) {
          anyActive = true;
        }
      });

      // Update surface activation
      if (brainMeshRef.current && anyActive) {
        // Find the activation overlay mesh
        brainMeshRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
            const material = child.material;
            
            // Calculate overall activation color
            let maxActivation = 0;
            let activeColor = new THREE.Color(0);
            
            regionsRef.current.forEach(region => {
              if (region.activation > maxActivation) {
                maxActivation = region.activation;
                
                // Determine color based on activation level
                if (region.activation > 0.8) {
                  activeColor.setHex(0xffff00); // Yellow
                } else if (region.activation > 0.6) {
                  activeColor.setHex(0xff4400); // Red-orange
                } else if (region.activation > 0.4) {
                  activeColor.setHex(0xff8800); // Orange
                } else {
                  activeColor.setHex(region.color);
                }
              }
            });
            
            material.color = activeColor;
            material.emissive = activeColor;
            material.emissiveIntensity = maxActivation * 0.5;
            material.opacity = maxActivation * 0.4;
          }
        });
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
      activationMeshesRef.current.forEach(mesh => {
        mesh.geometry.dispose();
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
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