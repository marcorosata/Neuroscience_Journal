import { useState } from 'react';
import FMRIBrain from '../components/fmri-brain';
import FMRI3DBrain from '../components/fmri-3d-brain';
import { PageTransition } from '../components/page-transition';

export default function BrainDemo() {
  const [is3D, setIs3D] = useState(true);
  
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Toggle between 2D and 3D */}
        {is3D ? <FMRI3DBrain /> : <FMRIBrain />}
        
        {/* Controls */}
        <div className="absolute top-4 left-4 z-10 space-y-2">
          <div className="text-white/50 text-sm">
            {is3D ? '3D fMRI Brain Visualization' : '2D fMRI Brain Visualization'}
          </div>
          <button
            onClick={() => setIs3D(!is3D)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm transition-colors"
          >
            Switch to {is3D ? '2D' : '3D'} View
          </button>
          {is3D && (
            <div className="text-white/30 text-xs">
              Click and drag to rotate the brain
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}