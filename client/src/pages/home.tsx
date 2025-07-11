import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CheckCircle, ArrowRight, Calendar, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { formatDate, formatAuthors, getCategoryColor } from "@/lib/utils";
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
    <div className="min-h-screen bg-white">
      <div>
        {/* Simple Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CNS Student Journal
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Academic publishing platform for Cognitive Neuroscience students at Radboud University
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/current-issue">
                <Button>Current Issue</Button>
              </Link>
              <Link href="/for-authors">
                <Button variant="outline">Submit Article</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-6">
                  We're a group of passionate students at Radboud University who believe amazing 
                  research shouldn't stay hidden in thesis folders. Our journal gives you a real chance to 
                  share your discoveries, reviews, and cool new methods with the world!
                </p>
                <p className="text-gray-600 mb-8">
                  Since 2006, we've been helping students take their first steps into the publishing world. 
                  Don't worry - we'll guide you through the process while making sure your work meets 
                  professional standards.
                </p>
                
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Supportive peer-review with helpful feedback" },
                    { icon: CheckCircle, text: "Free for everyone to read online" },
                    { icon: CheckCircle, text: "Readers from around the globe" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <item.icon className="text-white h-4 w-4" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link href="/about">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More About Us
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Articles Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Articles</h2>
            
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : articles ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.slice(0, 4).map((article) => (
                  <div key={article.id} className="border rounded-lg p-6 hover:shadow-lg">
                    <div className="mb-3">
                      <Badge className="mb-2">{article.category}</Badge>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {article.abstract?.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatAuthors(article.authors)}</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                    <Link href={`/article/${article.id}`}>
                      <Button variant="outline" size="sm">
                        Read Article
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600">No articles available.</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <Link href="/archive">
                <Button variant="outline">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
