import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Brain, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NeuralBackground from "./neural-background";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="relative bg-gradient-to-r from-red-impact via-ladybug to-berry text-white shadow-lg sticky top-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* University Branding Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-white/80">Radboud University</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80">Master's Programme in Cognitive Neuroscience</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-white/60" />
                <Input 
                  placeholder="Search..." 
                  className="h-6 w-32 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="relative bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Branding */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <img 
                  src="/attached_assets/channels4_profile_1749476651261.jpg" 
                  alt="Radboud University Logo"
                  className="w-16 h-16 rounded-xl shadow-lg group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h1 className="font-bold text-xl text-white text-glow">CNS Journal</h1>
                <p className="text-sm text-white/80">Radboud University • Cognitive Neuroscience</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                HOME
              </Link>
              
              <Link href="/about" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/about") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                ABOUT
              </Link>

              <Link href="/current-issue" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/current-issue") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                CURRENT ISSUE
              </Link>

              <Link href="/archive" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/archive") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                ARCHIVE
              </Link>

              <Link href="/for-authors" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/for-authors") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                FOR AUTHORS
              </Link>

              <Link href="/for-reviewers" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/for-reviewers") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                FOR REVIEWERS
              </Link>

              <Link href="/contact" className={`font-medium transition-colors border-b-2 pb-1 ${
                isActive("/contact") ? "text-white border-poppy" : "text-white/80 hover:text-white border-transparent hover:border-white/30"
              }`}>
                CONTACT
              </Link>
            </nav>

            {/* Mobile menu button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-slate-900 text-white border-white/10">
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    HOME
                  </Link>
                  <Link href="/about" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    ABOUT
                  </Link>
                  <Link href="/current-issue" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    CURRENT ISSUE
                  </Link>
                  <Link href="/archive" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    ARCHIVE
                  </Link>
                  <Link href="/for-authors" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    FOR AUTHORS
                  </Link>
                  <Link href="/for-reviewers" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    FOR REVIEWERS
                  </Link>
                  <Link href="/contact" className="text-white/80 hover:text-white font-medium" onClick={() => setMobileOpen(false)}>
                    CONTACT
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}