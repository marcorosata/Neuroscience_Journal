import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <section className="bg-gradient-to-br from-maroon to-mahogany text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Advancing Student Research in Neuroscience
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            A peer-reviewed journal showcasing cutting-edge research from the next generation of neuroscientists at Radboud University
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex">
              <Input 
                type="text" 
                placeholder="Search articles, authors, or topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-gray-900 rounded-l-lg rounded-r-none focus:ring-2 focus:ring-poppy border-r-0"
              />
              <Button type="submit" className="bg-poppy hover:bg-red-600 px-6 py-3 rounded-l-none rounded-r-lg transition-colors">
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-poppy hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              onClick={() => setLocation("/for-authors")}
            >
              Submit Article
            </Button>
            <Button 
              variant="outline" 
              className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors bg-transparent"
              onClick={() => setLocation("/current-issue")}
            >
              Latest Issue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
