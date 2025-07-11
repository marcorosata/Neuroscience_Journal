import { useState } from 'react';
import DustPhysicsSimulator from '../components/dust-physics-simulator';

export default function DustPhysicsDemo() {
  const [config, setConfig] = useState({
    particleCount: 100,
    enableGravity: true,
    enableMagnetism: false,
    enableElectrostatics: false,
    enableFluidDynamics: true,
    enableCollisions: false,
    enableThermodynamics: true
  });

  const presets = {
    basic: {
      particleCount: 50,
      enableGravity: true,
      enableMagnetism: false,
      enableElectrostatics: false,
      enableFluidDynamics: true,
      enableCollisions: false,
      enableThermodynamics: false
    },
    advanced: {
      particleCount: 100,
      enableGravity: true,
      enableMagnetism: true,
      enableElectrostatics: true,
      enableFluidDynamics: true,
      enableCollisions: true,
      enableThermodynamics: true
    },
    magneticField: {
      particleCount: 75,
      enableGravity: false,
      enableMagnetism: true,
      enableElectrostatics: true,
      enableFluidDynamics: false,
      enableCollisions: false,
      enableThermodynamics: false
    },
    windStorm: {
      particleCount: 150,
      enableGravity: true,
      enableMagnetism: false,
      enableElectrostatics: false,
      enableFluidDynamics: true,
      enableCollisions: false,
      enableThermodynamics: true
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <h1 className="text-3xl font-bold mb-2">Dust Particle Physics Simulator</h1>
        <p className="text-gray-300">
          Interactive physics simulation featuring realistic dust particle behaviors including gravity, 
          fluid dynamics, electrostatics, magnetism, and thermodynamics.
        </p>
      </div>

      {/* Controls Panel */}
      <div className="p-6 bg-gray-800 border-b border-gray-700">
        <div className="flex flex-wrap gap-4 mb-4">
          <h2 className="text-xl font-semibold w-full mb-2">Simulation Presets</h2>
          {Object.entries(presets).map(([name, preset]) => (
            <button
              key={name}
              onClick={() => setConfig(preset)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg capitalize transition-colors"
            >
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Particle Count */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Particle Count: {config.particleCount}
            </label>
            <input
              type="range"
              min="10"
              max="300"
              step="10"
              value={config.particleCount}
              onChange={(e) => setConfig(prev => ({ ...prev, particleCount: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Physics Options */}
          <div className="space-y-2">
            <h3 className="font-medium">Physics Forces</h3>
            {Object.entries(config).map(([key, value]) => {
              if (key === 'particleCount') return null;
              return (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) => setConfig(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm capitalize">
                    {key.replace(/enable([A-Z])/g, '$1').replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Physics Info</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Gravity:</strong> Downward force on particles</p>
              <p><strong>Fluid Dynamics:</strong> Wind and turbulence effects</p>
              <p><strong>Electrostatics:</strong> Charged particle interactions</p>
              <p><strong>Magnetism:</strong> Magnetic field effects</p>
              <p><strong>Thermodynamics:</strong> Temperature-based motion</p>
              <p><strong>Collisions:</strong> Particle-to-particle physics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="relative h-screen">
        <DustPhysicsSimulator
          className="w-full h-full"
          particleCount={config.particleCount}
          enableGravity={config.enableGravity}
          enableMagnetism={config.enableMagnetism}
          enableElectrostatics={config.enableElectrostatics}
          enableFluidDynamics={config.enableFluidDynamics}
          enableCollisions={config.enableCollisions}
          enableThermodynamics={config.enableThermodynamics}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-md">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ul className="space-y-1 text-xs">
          <li>• Move your mouse to interact with particles</li>
          <li>• Use the physics controls panel to adjust simulation</li>
          <li>• Try different presets to see various effects</li>
          <li>• Particles have different materials: dust, sand, pollen, ash, debris</li>
          <li>• Each material has unique physical properties</li>
          <li>• Temperature affects particle behavior when thermodynamics is enabled</li>
        </ul>
      </div>
    </div>
  );
}