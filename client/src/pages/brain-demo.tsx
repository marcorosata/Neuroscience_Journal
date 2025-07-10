import { useState } from 'react';
import FMRIBrain from '../components/fmri-brain';
import FMRI3DBrain from '../components/fmri-3d-brain';
import FMRI3DModel from '../components/fmri-3d-model';
import { PageTransition } from '../components/page-transition';

export default function BrainDemo() {
  const [viewMode, setViewMode] = useState<'3d-model' | '3d-generated' | '2d'>('3d-model');
  
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Brain visualization */}
        {viewMode === '3d-model' && <FMRI3DModel />}
        {viewMode === '3d-generated' && <FMRI3DBrain />}
        {viewMode === '2d' && <FMRIBrain />}
        
        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 space-y-2">
          <div className="text-white/50 text-sm">
            {viewMode === '3d-model' ? '3D Model' : viewMode === '3d-generated' ? '3D Generated' : '2D'} fMRI Brain Visualization
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('3d-model')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                viewMode === '3d-model' 
                  ? 'bg-white/30 text-white' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              3D Model
            </button>
            <button
              onClick={() => setViewMode('3d-generated')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                viewMode === '3d-generated'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              3D Generated
            </button>
            <button
              onClick={() => setViewMode('2d')}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                viewMode === '2d'
                  ? 'bg-white/30 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              2D View
            </button>
          </div>
          {viewMode !== '2d' && (
            <div className="text-white/30 text-xs">
              Click and drag to rotate the brain
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}