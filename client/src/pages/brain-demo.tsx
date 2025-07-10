import FMRIBrain from '../components/fmri-brain';
import { PageTransition } from '../components/page-transition';

export default function BrainDemo() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Only the fMRI Brain Visualization */}
        <FMRIBrain />
        
        {/* Optional minimal overlay for testing */}
        <div className="absolute top-4 left-4 z-10 text-white/50 text-sm">
          fMRI Brain Visualization Demo
        </div>
      </div>
    </PageTransition>
  );
}