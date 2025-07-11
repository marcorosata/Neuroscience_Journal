import { useEffect, useRef, useState } from 'react';

interface DustParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ax: number;
  ay: number;
  az: number;
  mass: number;
  size: number;
  density: number;
  opacity: number;
  temperature: number;
  charge: number;
  magneticField: number;
  life: number;
  maxLife: number;
  color: { r: number; g: number; b: number };
  material: 'dust' | 'sand' | 'pollen' | 'ash' | 'debris';
  rotation: number;
  angularVelocity: number;
  drag: number;
  elasticity: number;
  friction: number;
}

interface PhysicsForces {
  gravity: number;
  airResistance: number;
  magneticField: number;
  electricField: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
  humidity: number;
  pressure: number;
  turbulence: number;
}

interface DustPhysicsSimulatorProps {
  className?: string;
  particleCount?: number;
  enableGravity?: boolean;
  enableMagnetism?: boolean;
  enableElectrostatics?: boolean;
  enableFluidDynamics?: boolean;
  enableCollisions?: boolean;
  enableThermodynamics?: boolean;
}

export default function DustPhysicsSimulator({
  className = '',
  particleCount = 100,
  enableGravity = true,
  enableMagnetism = false,
  enableElectrostatics = false,
  enableFluidDynamics = true,
  enableCollisions = false,
  enableThermodynamics = true
}: DustPhysicsSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<DustParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const [isRunning, setIsRunning] = useState(true);
  const [physics, setPhysics] = useState<PhysicsForces>({
    gravity: 0.1,
    airResistance: 0.02,
    magneticField: 0.05,
    electricField: 0.03,
    windSpeed: 0.5,
    windDirection: 0,
    temperature: 20,
    humidity: 50,
    pressure: 1013,
    turbulence: 0.3
  });

  // Material properties for different dust types
  const materialProperties = {
    dust: { density: 0.8, drag: 0.6, elasticity: 0.3, color: { r: 139, g: 119, b: 101 } },
    sand: { density: 1.5, drag: 0.4, elasticity: 0.2, color: { r: 194, g: 178, b: 128 } },
    pollen: { density: 0.3, drag: 0.8, elasticity: 0.7, color: { r: 255, g: 255, b: 102 } },
    ash: { density: 0.5, drag: 0.9, elasticity: 0.1, color: { r: 105, g: 105, b: 105 } },
    debris: { density: 1.2, drag: 0.5, elasticity: 0.4, color: { r: 101, g: 67, b: 33 } }
  };

  const createParticle = (index: number): DustParticle => {
    const materials: (keyof typeof materialProperties)[] = ['dust', 'sand', 'pollen', 'ash', 'debris'];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const props = materialProperties[material];
    
    return {
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 50,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      vz: (Math.random() - 0.5) * 1,
      ax: 0,
      ay: 0,
      az: 0,
      mass: 0.1 + Math.random() * 0.9,
      size: 1 + Math.random() * 4,
      density: props.density,
      opacity: 0.3 + Math.random() * 0.7,
      temperature: 15 + Math.random() * 20,
      charge: (Math.random() - 0.5) * 0.1,
      magneticField: Math.random() * 0.05,
      life: 0,
      maxLife: 1000 + Math.random() * 2000,
      color: { ...props.color },
      material,
      rotation: Math.random() * 360,
      angularVelocity: (Math.random() - 0.5) * 5,
      drag: props.drag,
      elasticity: props.elasticity,
      friction: 0.1 + Math.random() * 0.3
    };
  };

  const applyPhysicsForces = (particle: DustParticle, deltaTime: number) => {
    // Reset accelerations
    particle.ax = 0;
    particle.ay = 0;
    particle.az = 0;

    // Gravity
    if (enableGravity) {
      particle.ay += physics.gravity * (particle.mass / particle.density);
    }

    // Air resistance (drag)
    const velocity = Math.sqrt(particle.vx ** 2 + particle.vy ** 2 + particle.vz ** 2);
    if (velocity > 0) {
      const dragForce = 0.5 * physics.airResistance * particle.drag * velocity ** 2;
      particle.ax -= (particle.vx / velocity) * dragForce / particle.mass;
      particle.ay -= (particle.vy / velocity) * dragForce / particle.mass;
      particle.az -= (particle.vz / velocity) * dragForce / particle.mass;
    }

    // Wind forces
    if (enableFluidDynamics) {
      const windX = Math.cos(physics.windDirection) * physics.windSpeed;
      const windY = Math.sin(physics.windDirection) * physics.windSpeed;
      particle.ax += windX * (1 - particle.density) * 0.1;
      particle.ay += windY * (1 - particle.density) * 0.1;
      
      // Turbulence
      const turbulenceX = Math.sin(timeRef.current * 0.01 + particle.id * 0.1) * physics.turbulence;
      const turbulenceY = Math.cos(timeRef.current * 0.01 + particle.id * 0.1) * physics.turbulence;
      particle.ax += turbulenceX * 0.05;
      particle.ay += turbulenceY * 0.05;
    }

    // Magnetic forces
    if (enableMagnetism && particle.magneticField > 0) {
      const magneticForceX = particle.magneticField * physics.magneticField * Math.sin(timeRef.current * 0.02);
      const magneticForceY = particle.magneticField * physics.magneticField * Math.cos(timeRef.current * 0.02);
      particle.ax += magneticForceX;
      particle.ay += magneticForceY;
    }

    // Electrostatic forces
    if (enableElectrostatics && particle.charge !== 0) {
      const electrostaticForceX = particle.charge * physics.electricField * Math.sin(particle.x * 0.1);
      const electrostaticForceY = particle.charge * physics.electricField * Math.cos(particle.y * 0.1);
      particle.ax += electrostaticForceX;
      particle.ay += electrostaticForceY;
    }

    // Thermodynamic effects
    if (enableThermodynamics) {
      const temperatureDiff = particle.temperature - physics.temperature;
      const thermalForce = temperatureDiff * 0.001;
      particle.ay -= thermalForce; // Hot particles rise
      
      // Temperature equilibration
      particle.temperature += (physics.temperature - particle.temperature) * 0.001;
    }

    // Mouse interaction
    const mouseDistance = Math.sqrt(
      (particle.x - mouseRef.current.x) ** 2 + 
      (particle.y - mouseRef.current.y) ** 2
    );
    if (mouseDistance < 20) {
      const forceStrength = (20 - mouseDistance) / 20;
      const forceX = (particle.x - mouseRef.current.x) / mouseDistance * forceStrength * 0.5;
      const forceY = (particle.y - mouseRef.current.y) / mouseDistance * forceStrength * 0.5;
      particle.ax += forceX;
      particle.ay += forceY;
    }
  };

  const updateParticle = (particle: DustParticle, deltaTime: number) => {
    // Apply physics forces
    applyPhysicsForces(particle, deltaTime);

    // Update velocity (Verlet integration)
    particle.vx += particle.ax * deltaTime;
    particle.vy += particle.ay * deltaTime;
    particle.vz += particle.az * deltaTime;

    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.z += particle.vz * deltaTime;

    // Update rotation
    particle.rotation += particle.angularVelocity * deltaTime;

    // Boundary conditions with energy loss
    if (particle.x < 0) {
      particle.x = 0;
      particle.vx *= -particle.elasticity;
    } else if (particle.x > 100) {
      particle.x = 100;
      particle.vx *= -particle.elasticity;
    }

    if (particle.y < 0) {
      particle.y = 0;
      particle.vy *= -particle.elasticity;
    } else if (particle.y > 100) {
      particle.y = 100;
      particle.vy *= -particle.elasticity;
    }

    if (particle.z < 0) {
      particle.z = 0;
      particle.vz *= -particle.elasticity;
    } else if (particle.z > 50) {
      particle.z = 50;
      particle.vz *= -particle.elasticity;
    }

    // Age particle
    particle.life += deltaTime;
    const ageRatio = particle.life / particle.maxLife;
    particle.opacity = (1 - ageRatio) * (0.3 + Math.random() * 0.7);

    // Reset particle if it dies
    if (particle.life >= particle.maxLife) {
      const newParticle = createParticle(particle.id);
      Object.assign(particle, newParticle);
    }
  };

  const renderParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach(particle => {
      const x = (particle.x / 100) * canvas.width;
      const y = (particle.y / 100) * canvas.height;
      const size = particle.size * (1 + particle.z / 50);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(particle.rotation * Math.PI / 180);
      
      // Apply depth-based alpha
      const alpha = particle.opacity * (0.5 + particle.z / 100);
      ctx.globalAlpha = alpha;
      
      // Color based on material and temperature
      const tempEffect = (particle.temperature - 15) / 20;
      const r = Math.max(0, Math.min(255, particle.color.r + tempEffect * 50));
      const g = Math.max(0, Math.min(255, particle.color.g + tempEffect * 30));
      const b = Math.max(0, Math.min(255, particle.color.b + tempEffect * 10));
      
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add glow effect for charged particles
      if (enableElectrostatics && Math.abs(particle.charge) > 0.05) {
        ctx.shadowColor = particle.charge > 0 ? '#ff6b6b' : '#4ecdc4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      ctx.restore();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => createParticle(i));

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 100;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!isRunning) return;

      const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2); // Cap at 2x normal speed
      lastTime = currentTime;
      timeRef.current = currentTime;

      // Update all particles
      particlesRef.current.forEach(particle => {
        updateParticle(particle, deltaTime);
      });

      // Render particles
      renderParticles(ctx, canvas);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, particleCount, enableGravity, enableMagnetism, enableElectrostatics, enableFluidDynamics, enableCollisions, enableThermodynamics]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Physics Controls */}
      <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <h3 className="font-semibold mb-2">Physics Controls</h3>
        <div className="space-y-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-3 py-1 bg-white/20 rounded hover:bg-white/30"
          >
            {isRunning ? 'Pause' : 'Play'}
          </button>
          <div>
            <label className="block">Gravity: {physics.gravity.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={physics.gravity}
              onChange={(e) => setPhysics(prev => ({ ...prev, gravity: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Wind: {physics.windSpeed.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={physics.windSpeed}
              onChange={(e) => setPhysics(prev => ({ ...prev, windSpeed: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block">Temperature: {physics.temperature.toFixed(0)}°C</label>
            <input
              type="range"
              min="-20"
              max="50"
              step="1"
              value={physics.temperature}
              onChange={(e) => setPhysics(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Particle Info */}
      <div className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <div>Particles: {particleCount}</div>
        <div>Physics: {[
          enableGravity && 'Gravity',
          enableFluidDynamics && 'Fluid',
          enableMagnetism && 'Magnetic',
          enableElectrostatics && 'Electric',
          enableThermodynamics && 'Thermal'
        ].filter(Boolean).join(', ')}</div>
      </div>
    </div>
  );
}