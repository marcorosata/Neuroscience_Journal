import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function StarlinkHero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Primary heading with Radboud colors and animations */}
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
            <motion.span 
              className="font-extralight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              CNS
            </motion.span>
            <br />
            <motion.span 
              className="font-normal bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, var(--red-impact), var(--poppy), var(--lady-bug))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Journal
            </motion.span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Student neuroscience research from Radboud University
          </p>

          {/* Search interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl backdrop-blur-sm focus:border-white/30 focus:ring-0"
              />
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                className="font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, var(--red-impact), var(--poppy))',
                  color: 'white'
                }}
              >
                Browse Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline"
                className="border-2 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
                style={{
                  borderColor: 'var(--red-impact)',
                  color: 'var(--red-impact)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--red-impact)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--red-impact)';
                }}
              >
                Submit Research
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-light text-white mb-1">120</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Articles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-white mb-1">300</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Contributors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-white mb-1">1K</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Readers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-light text-white mb-1">12</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Sponsors</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}