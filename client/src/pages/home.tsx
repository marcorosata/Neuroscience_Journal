import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Brain, FileText, CheckCircle } from "lucide-react";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import neuralBgGif from "@assets/20250609_1453_Ethereal Neuronal Lightning_simple_compose_01jxac05xmenrts2jkcqhkrbzj_1749474641545.gif";
import type { Article, Issue, Editor } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Neural Lightning Background */}
      <div 
        className="fixed inset-0 opacity-20 dark:opacity-15"
        style={{
          backgroundImage: `url(${neuralBgGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-50/95 to-white/95 dark:from-gray-900/95 dark:to-black/95" />
      
      <div className="relative z-10">
        <HeroSection />

      

      <StatsSection />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-maroon mb-6">About the Journal</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
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
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-poppy h-5 w-5" />
                  <span className="text-gray-700">Rigorous peer-review process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-poppy h-5 w-5" />
                  <span className="text-gray-700">Open access publication</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-poppy h-5 w-5" />
                  <span className="text-gray-700">International readership</span>
                </div>
              </div>
            </div>
            

          </div>

          {/* Editorial Board Preview */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-maroon mb-8 text-center">Editorial Board</h3>
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
                {editors.slice(0, 3).map((editor) => (
                  <div key={editor.id} className="text-center">
                    {editor.imageUrl && (
                      <img 
                        src={editor.imageUrl}
                        alt={editor.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h4 className="font-bold text-maroon">{editor.name}</h4>
                    <p className="text-gray-600 text-sm">{editor.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{editor.specialization}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">Editorial board information unavailable.</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white">
                <Link href="/about">View Full Editorial Board</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
