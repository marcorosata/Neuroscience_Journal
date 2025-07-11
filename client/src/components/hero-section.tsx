import { useState } from "react";
import { Search, Download, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

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
    <section className="relative bg-gradient-to-br from-red-impact via-berry to-maroon text-white">
      
      {/* Main Content Area */}
      <div className="relative z-10 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            
            {/* Welcome Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Welcome to the Website of the{" "}
                  <span className="text-white">
                    Cognitive Neuroscience Journal!
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
                    <Badge className="bg-poppy text-red-500 mb-3">Current Issue</Badge>
                    <div className="w-48 h-64 mx-auto rounded-lg shadow-neural-lg mb-4 border border-poppy/20 overflow-hidden">
                      <img 
                        src="/attached_assets/Cover-1_1749482985712.png"
                        alt="CNS Journal Volume 18, Issue 1 Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setLocation("/current-issue")}
                    >
                      Download it
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

              
            </div>
          </div>
        </div>
      </div>

      </section>
  );
}
