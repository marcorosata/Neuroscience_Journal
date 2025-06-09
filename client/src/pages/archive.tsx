import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, BookOpen } from "lucide-react";
import type { Issue } from "@shared/schema";

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



        {/* Journal Issues Download Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,66,75,0.3),transparent_40%)] animate-pulse"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(190,49,30,0.2),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="w-20 h-20 bg-poppy rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Download Journal <span className="text-poppy">Issues</span>
                </h2>
                <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Access our complete collection of published journal issues. All publications are available 
                  as free downloads in PDF format, organized chronologically from newest to oldest.
                </p>
              </div>

              {issuesLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                      <div className="space-y-4">
                        <div className="h-6 bg-white/20 rounded w-3/4"></div>
                        <div className="h-4 bg-white/20 rounded w-full"></div>
                        <div className="h-4 bg-white/20 rounded w-2/3"></div>
                        <div className="h-10 bg-white/20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : issues && issues.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {issues
                    .sort((a, b) => {
                      // Sort by publication date (newest first), then by volume/issue
                      if (a.publishedAt && b.publishedAt) {
                        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                      }
                      return parseInt(b.volume) - parseInt(a.volume) || parseInt(b.issue) - parseInt(a.issue);
                    })
                    .map((issue, index) => (
                    <Card key={issue.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group overflow-hidden">
                      <CardContent className="p-0">
                        {/* Issue Cover/Preview */}
                        <div className="h-48 bg-gradient-to-br from-poppy/20 to-ladybug/20 flex items-center justify-center relative">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <BookOpen className="h-8 w-8 text-poppy" />
                            </div>
                            <div className="text-white font-bold text-lg">
                              Vol. {issue.volume}, Issue {issue.issue}
                            </div>
                          </div>
                          {issue.current && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-yellow-500 text-black font-bold">Latest</Badge>
                            </div>
                          )}
                          {index === 0 && (
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-green-500 text-white">New</Badge>
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-poppy transition-colors">
                              {issue.title}
                            </h3>
                            {issue.description && (
                              <p className="text-white/70 text-sm line-clamp-2 mb-3">
                                {issue.description}
                              </p>
                            )}
                            {issue.publishedAt && (
                              <div className="flex items-center space-x-2 text-white/60 text-sm">
                                <Calendar className="h-4 w-4 text-poppy" />
                                <span>Published {formatDate(issue.publishedAt)}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Button 
                              className="w-full bg-poppy hover:bg-ladybug text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105"
                              onClick={() => {
                                if (issue.pdfUrl) {
                                  const link = document.createElement('a');
                                  link.href = issue.pdfUrl;
                                  link.download = `CNS_Journal_Vol${issue.volume}_Issue${issue.issue}.pdf`;
                                  link.target = '_blank';
                                  link.click();
                                }
                              }}
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download PDF
                            </Button>
                            
                            <div className="flex justify-between text-xs text-white/60">
                              <span>PDF Format</span>
                              <span>{issue.pdfSize || '~2.5 MB'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Issues Available</h3>
                  <p className="text-white/70">
                    Journal issues will appear here as they are published.
                  </p>
                </div>
              )}

              {/* Download Statistics */}
              {issues && issues.length > 0 && (
                <div className="mt-12 pt-8 border-t border-white/20">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-white mb-2">{issues.length}</div>
                      <div className="text-white/70">Total Issues</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white mb-2">
                        {Math.max(...issues.map(i => parseInt(i.volume)))}
                      </div>
                      <div className="text-white/70">Volumes Published</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-white mb-2">100%</div>
                      <div className="text-white/70">Open Access</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-12 bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-3">Download Information</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• All journal issues are available in high-quality PDF format</li>
                  <li>• Downloads are completely free and require no registration</li>
                  <li>• Issues are organized chronologically from newest to oldest</li>
                  <li>• Each issue contains peer-reviewed research articles from our master's program</li>
                  <li>• For printed copies, please use our contact form</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
