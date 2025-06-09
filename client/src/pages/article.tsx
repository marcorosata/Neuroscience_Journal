import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ArticleCard from "@/components/article-card";
import { formatDate, formatAuthors, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  User, 
  Quote, 
  Download, 
  Share2, 
  BookOpen, 
  Mail,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";

export default function ArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id || "0");

  const { data: article, isLoading: articleLoading } = useQuery<Article>({
    queryKey: [`/api/articles/${articleId}`],
  });

  const { data: relatedArticles, isLoading: relatedLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: !!article,
  });

  // Filter related articles by same category, excluding current article
  const related = relatedArticles?.filter(
    a => a.id !== articleId && a.category === article?.category
  ).slice(0, 3);

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.abstract,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (articleLoading) {
    return (
      <div className="min-h-screen py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Article Not Found</h1>
          <p className="text-gray-500 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <Button variant="ghost" asChild className="text-gray-600 hover:text-maroon">
              <Link href="/current-issue">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Current Issue
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <Badge className={getCategoryColor(article.category)}>
              {getCategoryLabel(article.category)}
            </Badge>
            {article.featured && (
              <Badge className="bg-poppy text-white">Featured</Badge>
            )}
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-maroon mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{formatAuthors(article.authors)}</span>
            </div>
            {article.publishedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            )}
            {article.doi && (
              <div className="flex items-center space-x-1">
                <ExternalLink className="h-4 w-4" />
                <span>DOI: {article.doi}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Quote className="h-4 w-4 mr-2" />
              Cite Article
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img 
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Abstract */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-maroon mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed">{article.abstract}</p>
            
            {article.keywords && article.keywords.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-maroon mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>

        <Separator className="my-12" />

        {/* Article Metadata */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-maroon mb-4">Publication Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-medium">{article.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue</span>
                  <span className="font-medium">{article.issue}</span>
                </div>
                {article.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">{formatDate(article.publishedAt)}</span>
                  </div>
                )}
                {article.doi && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">DOI</span>
                    <span className="font-medium text-poppy">{article.doi}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Citations</span>
                  <span className="font-medium">{article.citations || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-maroon mb-4">Author Information</h3>
              <div className="space-y-4">
                {article.authors.map((author, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{author}</p>
                      <p className="text-sm text-gray-600">Radboud University</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Mail className="h-4 w-4 mr-2" />
                Contact Authors
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-8">Related Articles</h2>
            {relatedLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((relatedArticle) => (
                  <ArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
