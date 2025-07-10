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
import SmokeBackground from "@/components/smoke-background";
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
      {/* Interactive Neural Smoke Background */}
      <SmokeBackground 
        particleCount={20}
        colors={[
          'rgba(59, 130, 246, 0.4)',   // Blue - neural activity
          'rgba(147, 51, 234, 0.3)',   // Purple - synaptic connections  
          'rgba(236, 72, 153, 0.3)',   // Pink - electrical impulses
          'rgba(34, 197, 94, 0.2)',    // Green - neural pathways
          'rgba(249, 115, 22, 0.2)',   // Orange - neurotransmitters
          'rgba(139, 69, 19, 0.3)'     // Maroon - Radboud theme
        ]}
        intensity={0.6}
      />
      
      {/* Enhanced Neural Lightning Background with parallax */}
      <div 
        className="fixed inset-0 opacity-20 dark:opacity-15 transition-all duration-700"
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
                  Our 
                  <span className="text-black"> Mission</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Hey there! We're a group of passionate students at Radboud University who believe amazing 
                  research shouldn't stay hidden in thesis folders. Our journal gives you a real chance to 
                  share your discoveries, reviews, and cool new methods with the world!
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Since 2006, we've been helping students take their first steps into the publishing world. 
                  Don't worry - we'll guide you through the process while making sure your work meets 
                  professional standards. Whether you're into brain imaging, behavioral studies, or anything 
                  neuroscience-related, we'd love to hear from you!
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Supportive peer-review with helpful feedback", delay: "delay-500" },
                    { icon: CheckCircle, text: "Free for everyone to read online", delay: "delay-700" },
                    { icon: CheckCircle, text: "Readers from around the globe", delay: "delay-900" }
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center space-y-4">
                      <Skeleton className="w-28 h-28 rounded-full mx-auto" />
                      <Skeleton className="h-4 w-3/4 mx-auto" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : editors ? (
                <>
                  {/* Managing Editors Section */}
                  <div className="mb-16">
                    <div className="text-center mb-8">
                      <h4 className="text-xl font-bold text-maroon mb-2">Managing Editors</h4>
                      <p className="text-gray-600 text-sm">Leading our editorial operations and publication standards</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      {editors
                        .filter(editor => editor.title.includes('Managing Editor'))
                        .map((editor, index) => (
                        <div 
                          key={editor.id} 
                          className={`group text-center transition-all duration-700 delay-${(index + 1) * 150} ${
                            isEditorialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                        >
                          <div className="relative mb-4">
                            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-maroon/10 to-blue-600/10 border-2 border-maroon/20 group-hover:border-maroon/40 transition-all duration-300 flex items-center justify-center">
                              {editor.imageUrl ? (
                                <img 
                                  src={editor.imageUrl}
                                  alt={editor.name}
                                  className="w-24 h-24 rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-maroon to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                  <span className="text-white font-bold text-lg">
                                    {editor.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-maroon/10 to-blue-600/10 group-hover:from-maroon/20 group-hover:to-blue-600/20 transition-all duration-300" />
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-bold text-maroon text-sm group-hover:text-blue-600 transition-colors leading-tight">
                              {editor.name}
                            </h5>
                            <p className="text-gray-600 text-xs font-medium">{editor.title}</p>
                            <p className="text-gray-500 text-xs">{editor.specialization}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Editorial Team Preview */}
                  <div>
                    <div className="text-center mb-8">
                      <h4 className="text-xl font-bold text-maroon mb-2">Review Editors</h4>
                      <p className="text-gray-600 text-sm">Our specialized review team across different research tracks</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {editors
                        .filter(editor => editor.title.includes('Review Editor'))
                        .slice(0, 6)
                        .map((editor, index) => (
                        <div 
                          key={editor.id} 
                          className={`group text-center transition-all duration-700 delay-${(index + 1) * 100} ${
                            isEditorialVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                          }`}
                        >
                          <div className="relative mb-4">
                            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200 group-hover:border-purple-300 transition-all duration-300 flex items-center justify-center">
                              {editor.imageUrl ? (
                                <img 
                                  src={editor.imageUrl}
                                  alt={editor.name}
                                  className="w-20 h-20 rounded-full object-cover shadow-sm group-hover:shadow-md transition-all duration-300"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                                  <span className="text-white font-semibold text-sm">
                                    {editor.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-semibold text-gray-800 text-xs group-hover:text-purple-600 transition-colors leading-tight">
                              {editor.name}
                            </h5>
                            <p className="text-gray-500 text-xs">{editor.specialization}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
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
