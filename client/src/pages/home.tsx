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

      {/* Featured Research Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            {issueLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-96 mx-auto" />
                <Skeleton className="h-6 w-2xl mx-auto" />
              </div>
            ) : currentIssue ? (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-maroon">
                  Featured Research
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {currentIssue.title}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <span className="px-4 py-2 bg-poppy/10 text-poppy rounded-full font-medium">
                    Volume {currentIssue.volume}, Issue {currentIssue.issue}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {currentIssue.publishedAt && new Date(currentIssue.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-maroon">
                  Latest Research
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover cutting-edge neuroscience research from the next generation of scientists
                </p>
              </div>
            )}
          </div>

          

          {/* Research Highlights Grid */}
          {articlesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-enhanced rounded-2xl p-6 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-32 bg-gray-200 rounded-xl"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articles ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {articles.slice(0, 6).map((article, index) => (
                <div key={article.id} className={`stagger-${(index % 4) + 1}`}>
                  <div className="card-enhanced rounded-2xl overflow-hidden hover:shadow-neural-lg transition-all duration-300 p-6">
                    <h3 className="font-bold text-lg mb-2 text-red-impact">
                      <Link href={`/article/${article.id}`} className="hover:text-berry transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.abstract}
                    </p>
                    <div className="text-sm text-gray-500">
                      {article.authors.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No articles available at this time.</p>
            </div>
          )}

          <div className="text-center">
            <Button className="btn-neural px-12 py-4 text-lg font-semibold" onClick={() => setLocation("/current-issue")}>
              <FileText className="h-5 w-5 mr-2" />
              Explore All Research
            </Button>
          </div>
        </div>
      </section>

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
