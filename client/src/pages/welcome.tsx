import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, BookOpen, Users, Calendar } from 'lucide-react';
import { PageTransition } from '../components/page-transition';
import FlowingLinesBackground from '../components/flowing-lines-background';

export default function Welcome() {
  return (
    <PageTransition>
      <div className="relative min-h-screen bg-black text-white overflow-hidden">
        {/* Flowing Lines Background */}
        <FlowingLinesBackground />
        
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
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <BookOpen className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Research Articles</h3>
                <p className="text-gray-400 text-sm">
                  Peer-reviewed publications from master's students
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <Users className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Student-Run</h3>
                <p className="text-gray-400 text-sm">
                  Entirely managed by cognitive neuroscience students
                </p>
              </div>
              
              <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <Calendar className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <h3 className="text-white font-semibold mb-2">Since 2006</h3>
                <p className="text-gray-400 text-sm">
                  Nearly two decades of neuroscience research
                </p>
              </div>
            </motion.div>

            {/* Enter button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Link 
                to="/home"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
              >
                Enter Journal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-xs text-gray-500 mt-12 max-w-2xl mx-auto"
            >
              This is a student-run academic journal. Articles are peer-reviewed but do not include 
              DOI registration. All content represents the academic work of master's students in 
              cognitive neuroscience at Radboud University.
            </motion.p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}