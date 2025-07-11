import { PageTransition } from '../components/page-transition';
import LightningBackground from '../components/lightning-background';
import UltrarealisticSmoke from '../components/ultrarealistic-smoke';
import { Link } from 'wouter';

export default function Welcome2() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Lightning Background */}
        <LightningBackground className="z-0" />
        
        {/* Ultrarealistic Smoke */}
        <UltrarealisticSmoke />
        
        {/* Welcome content */}
        <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* University branding */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <span className="text-white font-bold text-lg">RU</span>
              </div>
              <p className="text-gray-300 text-sm uppercase tracking-wide">
                Radboud University
              </p>
            </div>

            {/* Main welcome message */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
              Welcome
            </h1>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-200 mb-4">
                CNS Student Journal
              </h2>
            </div>

            {/* Find Out More Button */}
            <div className="mt-8">
              <Link href="/home">
                <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300 text-lg">
                  Find Out More
                </button>
              </Link>
            </div>


          </div>
        </div>
      </div>
    </PageTransition>
  );
}