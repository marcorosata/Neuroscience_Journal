import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";
import { Calendar, BookOpen } from "lucide-react";
import type { Article, Issue } from "@shared/schema";

export default function CurrentIssue() {
  const { data: currentIssue, isLoading: issueLoading } = useQuery<Issue>({
    queryKey: ["/api/issues/current"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const currentIssueArticles = articles?.filter(
    article => article.volume === currentIssue?.volume && article.issue === currentIssue?.issue
  );

  const featuredArticle = currentIssueArticles?.find(article => article.featured);
  const regularArticles = currentIssueArticles?.filter(article => !article.featured);

  return (
    <div className="min-h-screen py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Issue Header */}
        <div className="text-center mb-12">
          {issueLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
              <Skeleton className="h-20 w-full max-w-2xl mx-auto" />
            </div>
          ) : currentIssue ? (
            <div>
              <h1 className="text-4xl font-bold text-maroon mb-4">
                Volume {currentIssue.volume}, Issue {currentIssue.issue}
              </h1>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Badge variant="outline" className="bg-poppy text-white border-poppy">
                  Current Issue
                </Badge>
                {currentIssue.publishedAt && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Published {formatDate(currentIssue.publishedAt)}</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {currentIssue.title}
              </h2>
              {currentIssue.description && (
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                  {currentIssue.description}
                </p>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-maroon mb-4">Latest Articles</h1>
              <p className="text-gray-600">Explore our most recent publications</p>
            </div>
          )}
        </div>

        {/* Issue Statistics */}
        {currentIssueArticles && currentIssueArticles.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-6 mb-12">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-maroon">{currentIssueArticles.length}</div>
                <div className="text-gray-600 text-sm">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-maroon">
                  {new Set(currentIssueArticles.flatMap(a => a.authors)).size}
                </div>
                <div className="text-gray-600 text-sm">Authors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-maroon">
                  {Math.round(currentIssueArticles.reduce((sum, a) => sum + a.readTime, 0) / currentIssueArticles.length)}
                </div>
                <div className="text-gray-600 text-sm">Avg. Read Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-maroon">
                  {currentIssueArticles.reduce((sum, a) => sum + (a.citations || 0), 0)}
                </div>
                <div className="text-gray-600 text-sm">Citations</div>
              </div>
            </div>
          </div>
        )}

        {articlesLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ) : currentIssueArticles && currentIssueArticles.length > 0 ? (
          <div>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-maroon mb-6 flex items-center space-x-2">
                  <BookOpen className="h-6 w-6" />
                  <span>Featured Article</span>
                </h2>
                <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="bg-poppy text-white px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                      </div>
                      <h3 className="text-2xl font-bold text-maroon mb-3">
                        <a href={`/article/${featuredArticle.id}`} className="hover:text-ladybug transition-colors">
                          {featuredArticle.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {featuredArticle.abstract}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {featuredArticle.authors.join(", ")}
                        </div>
                        <a 
                          href={`/article/${featuredArticle.id}`}
                          className="text-ladybug hover:text-berry font-medium flex items-center space-x-1"
                        >
                          <span>Read Full Article</span>
                          <span>→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles */}
            {regularArticles && regularArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-maroon mb-6">All Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow p-6">
                      <h3 className="font-bold text-lg mb-2 text-maroon">
                        <a href={`/article/${article.id}`} className="hover:text-ladybug transition-colors">
                          {article.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.abstract}
                      </p>
                      <div className="text-sm text-gray-500">
                        {article.authors.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Available</h3>
            <p className="text-gray-500">
              There are currently no articles available for this issue.
            </p>
          </div>
        )}

        {/* Navigation */}
        {currentIssueArticles && currentIssueArticles.length > 0 && (
          <div className="mt-16 flex justify-center space-x-4">
            <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white">
              Previous Issue
            </Button>
            <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white">
              View Archive
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
