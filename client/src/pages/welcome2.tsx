import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, Users, Calendar } from 'lucide-react';
import { PageTransition } from '../components/page-transition';
import LightningBackground from '../components/lightning-background';
import VolumetricSmokeBackground from '../components/volumetric-smoke-background';

export default function Welcome2() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Lightning Background */}
        <LightningBackground className="z-0" />
        
        {/* Volumetric Smoke Background */}
        <VolumetricSmokeBackground className="z-5" />
        
        {/* Welcome content */}
        <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* University branding */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
                <span className="text-white font-bold text-lg">RU</span>
              </div>
              <p className="text-gray-300 text-sm uppercase tracking-wide">
                Radboud University
              </p>
            </motion.div>

            {/* Main welcome message */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              Welcome
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-light text-gray-200 mb-4">
                CNS Student Journal
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Discover cutting-edge research in cognitive neuroscience from the next generation 
                of scientists. Student-driven, peer-reviewed, and published since 2006.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto"
            >
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <BookOpen className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Research Articles</h3>
                <p className="text-gray-300 text-sm">
                  Peer-reviewed publications from master's students
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <Users className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Student-Run</h3>
                <p className="text-gray-300 text-sm">
                  Editorial board of passionate neuroscience students
                </p>
              </div>
              
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <Calendar className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Regular Issues</h3>
                <p className="text-gray-300 text-sm">
                  New research published quarterly since 2006
                </p>
              </div>
            </motion.div>

            {/* Call to action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
            >
              <Link href="/articles">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Browse Articles
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              
              <Link href="/issues">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
                >
                  View Issues
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}