import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";
import { Brain, FileText, CheckCircle, ArrowRight, Sparkles, Calendar, User, BookOpen } from "lucide-react";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import { PreviewCard, PreviewGrid } from "@/components/preview-card";
import { ScrollReveal, StaggeredReveal } from "@/components/scroll-reveal";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { formatDate, formatAuthors, getCategoryColor } from "@/lib/utils";
import neuralBgGif from "@assets/20250609_1453_Ethereal Neuronal Lightning_simple_compose_01jxac05xmenrts2jkcqhkrbzj_1749474641545.gif";
import type { Article, Issue, Editor } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const aboutRef = useRef<HTMLElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isEditorialVisible, setIsEditorialVisible] = useState(false);
  
  const { data: featuredArticles, isLoading: featuredLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?featured=true"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: currentIssue, isLoading: issueLoading } = useQuery<Issue>({
    queryKey: ["/api/issues/current"],
  });

  const { data: editors, isLoading: editorsLoading } = useQuery<Editor[]>({
    queryKey: ["/api/editors"],
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === aboutRef.current) {
          setIsAboutVisible(entry.isIntersecting);
        } else if (entry.target === editorialRef.current) {
          setIsEditorialVisible(entry.isIntersecting);
        }
      });
    }, observerOptions);

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (editorialRef.current) observer.observe(editorialRef.current);

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden scroll-smooth">
      {/* Enhanced Neural Lightning Background with parallax */}
      <div 
        className="fixed inset-0 opacity-30 dark:opacity-20 transition-all duration-700"
        style={{
          backgroundImage: `url(${neuralBgGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Dynamic Gradient Overlay */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-gray-50/95 via-white/90 to-gray-100/95 dark:from-gray-900/95 dark:via-black/90 dark:to-gray-800/95 transition-all duration-500"
        style={{
          opacity: Math.min(0.95, 0.8 + scrollY * 0.0003),
        }}
      />
      
      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `translateY(${-scrollY * (0.1 + i * 0.02)}px)`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />

        {/* Enhanced About Section with scroll animations */}
        <section 
          ref={aboutRef}
          className={`py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50/30 relative overflow-hidden transition-all duration-1000 ${
            isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-pink-100/20 to-yellow-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`transition-all duration-1000 delay-300 ${
                isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <div className="flex items-center mb-4">
                  <Sparkles className="text-blue-500 h-6 w-6 mr-3 animate-pulse" />
                  <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About The Journal</span>
                </div>
                <h2 className="text-4xl font-bold text-maroon mb-6 leading-tight">
                  Advancing Student 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Research</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  The Student Neuroscience Journal at Radboud University provides a platform for undergraduate 
                  and graduate students to publish their research findings, reviews, and innovative methodologies 
                  in the field of neuroscience.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Founded in 2022, our journal maintains rigorous peer-review standards while fostering 
                  the next generation of neuroscientists. We encourage interdisciplinary approaches and 
                  cutting-edge research across all areas of neuroscience.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Rigorous peer-review process", delay: "delay-500" },
                    { icon: CheckCircle, text: "Open access publication", delay: "delay-700" },
                    { icon: CheckCircle, text: "International readership", delay: "delay-900" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 transition-all duration-700 ${item.delay} ${
                        isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <item.icon className="text-white h-4 w-4" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-8 transition-all duration-1000 delay-1000 ${
                  isAboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Link href="/about" className="flex items-center">
                      Learn More About Us
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Interactive visualization panel */}
              <div className={`transition-all duration-1000 delay-500 ${
                isAboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div className="relative">
                  <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-2xl border border-blue-100/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <Brain className="text-blue-600 h-8 w-8" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-maroon">2024-25</div>
                        <div className="text-sm text-gray-500">Current Volume</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600">Impact Factor</span>
                        <span className="font-bold text-blue-600">Emerging</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600">Publication Frequency</span>
                        <span className="font-bold text-green-600">Bi-annual</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                        <span className="text-gray-600">Review Time</span>
                        <span className="font-bold text-purple-600">8-12 weeks</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-full blur-xl" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full blur-xl" />
                </div>
              </div>
            </div>

            {/* Enhanced Editorial Board Preview */}
            <div 
              ref={editorialRef}
              className={`mt-24 transition-all duration-1000 ${
                isEditorialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="text-purple-500 h-6 w-6 mr-3 animate-pulse" />
                  <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider">Our Team</span>
                </div>
                <h3 className="text-3xl font-bold text-maroon mb-4">Editorial Board</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Meet the distinguished researchers and academics who guide our publication standards
                </p>
              </div>
              
              {editorsLoading ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center space-y-4">
                      <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                      <Skeleton className="h-4 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : editors ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {editors.slice(0, 3).map((editor, index) => (
                    <div 
                      key={editor.id} 
                      className={`group text-center transition-all duration-700 delay-${(index + 1) * 200} ${
                        isEditorialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                    >
                      <div className="relative mb-6">
                        {editor.imageUrl && (
                          <img 
                            src={editor.imageUrl}
                            alt={editor.name}
                            className="w-32 h-32 rounded-full mx-auto object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300" />
                      </div>
                      <h4 className="font-bold text-maroon text-lg group-hover:text-blue-600 transition-colors">{editor.name}</h4>
                      <p className="text-gray-600 text-sm font-medium">{editor.title}</p>
                      <p className="text-gray-500 text-xs mt-1">{editor.specialization}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">Editorial board information unavailable.</p>
                </div>
              )}
              
              <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ${
                isEditorialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <Button variant="outline" className="border-2 border-maroon text-maroon hover:bg-maroon hover:text-white px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg group">
                  <Link href="/about" className="flex items-center">
                    View Full Editorial Board
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
