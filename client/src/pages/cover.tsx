import { Link } from "wouter";
import { ArrowRight, Book, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmokeBackground from "@/components/smoke-background";

export default function Cover() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* xAI-style Interactive Smoke Background */}
      <SmokeBackground 
        particleCount={80}
        colors={[
          'rgba(0, 150, 255, 0.8)',    // Neon blue (primary xAI color)
          'rgba(100, 200, 255, 0.6)',  // Light blue glow
          'rgba(150, 100, 255, 0.7)',  // Purple accent
          'rgba(0, 255, 150, 0.5)',    // Green highlight
          'rgba(255, 255, 255, 0.4)',  // Pure white for contrast
          'rgba(200, 220, 255, 0.6)'   // Blue-silver tint
        ]}
        intensity={2.0}
      />
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />
      
      {/* Journal Cover */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* University Logo Area */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-maroon to-red-800 rounded-full flex items-center justify-center mb-4 shadow-2xl">
            <span className="text-white font-bold text-2xl">RU</span>
          </div>
          <p className="text-gray-600 text-sm uppercase tracking-wider">Radboud University</p>
        </div>

        {/* Journal Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="text-maroon block">Student</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
              Neuroscience
            </span>
            <span className="text-gray-800 block">Journal</span>
          </h1>
          
          <div className="space-y-2 mb-8">
            <p className="text-xl text-gray-600">Volume 18, Issue 1 • 2024-25</p>
            <p className="text-lg text-gray-500">Processing & Plasticity</p>
          </div>
          
          <div className="w-32 h-1 bg-gradient-to-r from-maroon to-blue-600 mx-auto mb-8"></div>
          
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            A student-run publication dedicated to advancing neuroscience research 
            and fostering the next generation of researchers since 2006.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            className="bg-gradient-to-r from-maroon to-red-700 hover:from-red-800 hover:to-maroon text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group min-w-[200px]"
            asChild
          >
            <Link href="/home" className="flex items-center">
              <Book className="mr-3 h-5 w-5" />
              Enter Journal
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-full transition-all duration-300 min-w-[200px]"
            asChild
          >
            <Link href="/current-issue" className="flex items-center">
              <FileText className="mr-3 h-5 w-5" />
              Current Issue
            </Link>
          </Button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Student-Run Publication</span>
            </div>
            <div>•</div>
            <div>
              <span>Established 2006</span>
            </div>
            <div>•</div>
            <div>
              <span>Peer-Reviewed Articles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}