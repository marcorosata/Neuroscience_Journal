import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";
import StarlinkHero from "@/components/starlink-hero";
import { StarlinkCard, StarlinkGrid } from "@/components/starlink-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { RabouldParticles, AnimatedBorder, PulseGlow, StaggerContainer } from "@/components/radboud-animations";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

export default function Home() {
  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  return (
    <div className="bg-black relative">
      <RabouldParticles />
      <StarlinkHero />

      {/* Featured Articles Section */}
      <ScrollReveal direction="up" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Latest Research
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
              Featured Articles
            </h2>
            <p className="text-xl font-light text-gray-400 max-w-2xl mx-auto">
              Groundbreaking research from our student neuroscience community
            </p>
          </div>

          {articlesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-white/5 rounded-xl border border-white/10"></div>
                </div>
              ))}
            </div>
          ) : articles && articles.length > 0 ? (
            <StarlinkGrid className="max-w-none">
              {articles.slice(0, 6).map((article) => (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <StarlinkCard
                    title={article.title}
                    description={article.abstract}
                    category={article.category}
                    authors={article.authors}
                    publishedAt={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
                    readTime="8-12 min"
                    className="h-full cursor-pointer"
                  />
                </Link>
              ))}
            </StarlinkGrid>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Articles Available</h3>
              <p className="text-gray-400">Featured articles will appear here once published.</p>
            </div>
          )}

          <ScrollReveal direction="up" delay={600} className="text-center mt-16">
            <Link href="/archive">
              <PulseGlow color="var(--red-impact)">
                <Button 
                  className="font-medium px-8 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--red-impact), var(--poppy))',
                    color: 'white'
                  }}
                >
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </PulseGlow>
            </Link>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal direction="up" className="py-20 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            About the Journal
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-8">
            Advancing Student Research
          </h2>
          <p className="text-lg font-light text-gray-400 leading-relaxed mb-12">
            The CNS Journal provides a platform for undergraduate and graduate students at Radboud University 
            to publish their research findings, reviews, and innovative methodologies in neuroscience. 
            We maintain rigorous peer-review standards while fostering the next generation of researchers.
          </p>
          
          <StaggerContainer stagger={0.2} className="grid md:grid-cols-2 gap-8 text-left">
            <AnimatedBorder>
              <div className="bg-black rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Open Access</h3>
                <p className="text-gray-400 font-light">
                  All articles are freely available to researchers and students worldwide, 
                  supporting the open science movement.
                </p>
              </div>
            </AnimatedBorder>
            <AnimatedBorder>
              <div className="bg-black rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4">Peer Review</h3>
                <p className="text-gray-400 font-light">
                  Rigorous review process ensures high-quality publications while 
                  providing valuable feedback to student researchers.
                </p>
              </div>
            </AnimatedBorder>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
}