import { useState } from "react";
import { Search, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation, Link } from "wouter";
import NeuralBackground from "./neural-background";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-red-impact via-berry to-maroon text-white overflow-hidden">
      {/* Dynamic Neuronal Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 scale-110 animate-pulse">
          <img 
            src="/attached_assets/20250609_1643_Visual Storyteller_loop_01jxaja0egeshawwdvqkdw0hpq_1749484152491.gif"
            alt="Neuronal network animation"
            className="w-full h-full object-cover opacity-40 mix-blend-screen animate-fade-in-slow"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-impact/70 via-berry/60 to-maroon/70 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
        
        {/* Floating particles overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-80 animate-float-1"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full opacity-60 animate-float-2"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-70 animate-float-3"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-orange-300 rounded-full opacity-50 animate-float-4"></div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            
            {/* Welcome Content */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-slide-up">
                  Welcome to the Website of the{" "}
                  <span className="relative">
                    <span className="text-white animate-pulse">
                      Cognitive Neuroscience Journal!
                    </span>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-float-1 opacity-60"></div>
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
                  Since 2006, our student-led journal has been publishing peer-reviewed articles based on master 
                  theses from our programme. Since we now publish issues as{" "}
                  <span className="text-yellow font-semibold">free download</span>, we invite you to{" "}
                  <Button 
                    variant="link" 
                    className="text-yellow hover:text-orange p-0 h-auto font-semibold underline"
                    onClick={() => setLocation("/archive")}
                  >
                    download any of our current and previous issues of the journal
                  </Button>
                  . If you prefer reading print-out, you are invited to{" "}
                  <Button 
                    variant="link" 
                    className="text-poppy hover:text-orange-400 p-0 h-auto font-semibold underline"
                    onClick={() => setLocation("/contact")}
                  >
                    order printed issues using the request form
                  </Button>
                  .
                </p>

                <p className="text-lg text-white/70">
                  Every year, we work with a{" "}
                  <span 
                    className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors cursor-pointer"
                    onClick={() => setLocation("/about")}
                  >
                    new, motivated team
                  </span>, aiming to produce a consistently evolving and 
                  up-to-date journal, allowing all kinds of research within our programme.
                </p>

                <p className="text-white/60">
                  If you have any questions regarding our publishing process, contacting team members or 
                  authors, or any other requests, we are happy to answer if you just send us a mail!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="btn-neural px-8 py-4 text-lg font-semibold"
                  onClick={() => setLocation("/current-issue")}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  View Current Issue
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                  onClick={() => setLocation("/archive")}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Issues
                </Button>
              </div>
            </div>

            {/* Current Issue Sidebar */}
            <div className="space-y-6">
              <Card className="card-enhanced">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Badge className="bg-poppy text-white mb-3">Current Issue</Badge>
                    <div className="w-48 h-64 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-neural-lg flex items-center justify-center mb-4 border border-poppy/20">
                      <div className="text-center text-white">
                        <div className="w-12 h-12 bg-poppy rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">CNS Journal</h3>
                        <p className="text-sm text-white/70">Volume 3, Issue 2</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-poppy hover:bg-red-600"
                      onClick={() => setLocation("/current-issue")}
                    >
                      Read Online
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardContent className="p-6">
                  <h3 className="font-bold text-maroon mb-3">Print Edition</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Request a printed copy of our journal for offline reading.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setLocation("/contact")}
                  >
                    Request Print Copy
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardContent className="p-6">
                  <h3 className="font-bold text-maroon mb-3">News</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Check out the newest issue of the journal here!</p>
                      <p className="text-gray-600 text-xs mt-1">Published October 2024</p>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-poppy p-0 h-auto"
                      onClick={() => setLocation("/current-issue")}
                    >
                      Read more <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Content Section */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              THE CNS JOURNAL - Proceedings of the Master's Programme ...
            </h2>
            <div className="flex items-center justify-center space-x-4 text-white/60">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Copia link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
