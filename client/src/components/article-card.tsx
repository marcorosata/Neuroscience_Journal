import { Link } from "wouter";
import { Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAuthors, getCategoryColor, getCategoryLabel } from "@/lib/utils";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  if (featured) {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-8">
          <div className="flex items-start space-x-6">
            {article.imageUrl && (
              <img 
                src={article.imageUrl}
                alt={article.title}
                className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Badge className="bg-poppy text-white">Featured</Badge>
                <Badge variant="outline" className={getCategoryColor(article.category)}>
                  {getCategoryLabel(article.category)}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-maroon mb-3">
                <Link href={`/article/${article.id}`} className="hover:text-ladybug transition-colors">
                  {article.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.abstract}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{formatAuthors(article.authors)}</span>
                  </div>
                  {article.publishedAt && (
                    <span>• {new Date(article.publishedAt).toLocaleDateString()}</span>
                  )}
                </div>
                <Link 
                  href={`/article/${article.id}`}
                  className="text-ladybug hover:text-berry font-medium flex items-center space-x-1"
                >
                  <span>Read Full Article</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {article.imageUrl && (
        <img 
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge variant="outline" className={getCategoryColor(article.category)}>
            {getCategoryLabel(article.category)}
          </Badge>
          <span className="text-gray-400 text-xs">•</span>
          <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <Clock className="h-3 w-3" />
            <span>{article.readTime} min read</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2 text-maroon line-clamp-2">
          <Link href={`/article/${article.id}`} className="hover:text-ladybug transition-colors">
            {article.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.abstract}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{formatAuthors(article.authors)}</span>
          <Link 
            href={`/article/${article.id}`}
            className="text-ladybug font-medium hover:text-berry transition-colors"
          >
            Read More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
