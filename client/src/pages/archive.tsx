import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ArticleCard from "@/components/article-card";
import { formatDate, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { Search, Calendar, BookOpen, Filter } from "lucide-react";
import type { Article, Issue } from "@shared/schema";

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIssue, setSelectedIssue] = useState("all");

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/issues"],
  });

  // Filter articles based on search and filters
  const filteredArticles = articles?.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    
    const matchesIssue = selectedIssue === "all" || 
      (selectedIssue && `${article.volume}-${article.issue}` === selectedIssue);

    return matchesSearch && matchesCategory && matchesIssue;
  });

  const categories = ["research", "review", "methods", "case-study"];
  const uniqueIssues = issues?.map(issue => ({ 
    value: `${issue.volume}-${issue.issue}`, 
    label: `Vol. ${issue.volume}, Issue ${issue.issue}` 
  })) || [];

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-maroon mb-4">Archive</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our complete collection of published articles and past issues
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles, authors, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedIssue} onValueChange={setSelectedIssue}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Issue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issues</SelectItem>
                    {uniqueIssues.map(issue => (
                      <SelectItem key={issue.value} value={issue.value}>
                        {issue.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || selectedCategory !== "all" || selectedIssue !== "all") && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Search: {searchQuery}</span>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Category: {getCategoryLabel(selectedCategory)}</span>
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {selectedIssue !== "all" && (
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <span>Issue: {uniqueIssues.find(i => i.value === selectedIssue)?.label}</span>
                    <button 
                      onClick={() => setSelectedIssue("all")}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedIssue("all");
                  }}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!articlesLoading && filteredArticles && (
          <div className="mb-6 text-gray-600">
            <span className="font-medium">{filteredArticles.length}</span> articles found
          </div>
        )}

        {/* Articles Grid */}
        {articlesLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Found</h3>
            <p className="text-gray-500 mb-4">
              No articles match your current search criteria.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedIssue("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Issues List */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-maroon mb-8">Past Issues</h2>
          {issuesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : issues && issues.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <Card key={issue.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-maroon">
                        Volume {issue.volume}, Issue {issue.issue}
                      </h3>
                      {issue.current && (
                        <Badge className="bg-poppy text-white">Current</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {issue.title}
                    </p>
                    {issue.publishedAt && (
                      <div className="flex items-center space-x-1 text-gray-500 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(issue.publishedAt)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No past issues available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
