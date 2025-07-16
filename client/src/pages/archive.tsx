import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, BookOpen, Download, FileText } from "lucide-react";
import { ScrollReveal, StaggeredReveal } from "@/components/scroll-reveal";
import { PreviewCard, PreviewGrid } from "@/components/preview-card";
import type { Issue } from "@shared/schema";

export default function Archive() {
  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/issues"],
  });

  return (
    <div className="min-h-screen py-16 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with scroll reveal */}
        <ScrollReveal direction="fade" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="text-red-impact h-8 w-8 mr-3" />
            <span className="text-red-impact font-semibold text-sm uppercase tracking-wider">Journal Archive</span>
          </div>
          <h1 className="text-5xl font-bold text-red-impact mb-6">
            Publication <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-impact to-berry">Archive</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive collection of published journal issues, featuring cutting-edge research 
            from Radboud University's neuroscience community
          </p>
        </ScrollReveal>

        {/* Journal Issues Download Section with enhanced animations */}
        <ScrollReveal direction="up" delay={300}>
          <div className="bg-gradient-to-br from-red-impact via-berry to-maroon text-white rounded-3xl p-12 relative overflow-hidden shadow-2xl">
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,66,75,0.4),transparent_50%)] animate-pulse"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(190,49,30,0.3),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,204,0,0.2),transparent_40%)] animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            <div className="relative z-10">
              <ScrollReveal direction="scale" delay={500} className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow to-orange rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4">
                  Download Journal <span className="text-yellow">Issues</span>
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Access our complete collection of published journal issues. All publications are available 
                  as free downloads in PDF format, organized chronologically from newest to oldest.
                </p>
              </ScrollReveal>

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
                <StaggeredReveal
                  staggerDelay={200}
                  direction="up"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  itemClassName="w-full"
                >
                  {issues
                    .sort((a, b) => {
                      // Sort by publication date (newest first), then by volume/issue
                      if (a.publishedAt && b.publishedAt) {
                        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                      }
                      return parseInt(b.volume) - parseInt(a.volume) || parseInt(b.issue) - parseInt(a.issue);
                    })
                    .map((issue, index) => (
                      <Card key={issue.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group overflow-hidden shadow-lg hover:shadow-xl">
                        <CardContent className="p-0">
                          {/* Issue Cover/Preview */}
                          <div className="h-48 bg-gradient-to-br from-red-impact/20 to-berry/20 flex items-center justify-center relative">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <BookOpen className="h-8 w-8 text-red-impact" />
                              </div>
                              <div className="text-white font-bold text-lg">
                                Vol. {issue.volume}, Issue {issue.issue}
                              </div>
                            </div>
                            {issue.current && (
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-yellow text-black font-bold">Latest</Badge>
                              </div>
                            )}
                            {index === 0 && (
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-green text-white">New</Badge>
                              </div>
                            )}
                          </div>

                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-yellow transition-colors">
                                {issue.title}
                              </h3>
                              {/* {issue.description && (
                                <p className="text-white/70 text-sm line-clamp-2 mb-3">
                                  {issue.description}
                                </p>
                              )} */}
                              {issue.publishedAt && (
                                <div className="flex items-center space-x-2 text-white/60 text-sm">
                                  <Calendar className="h-4 w-4 text-yellow" />
                                  <span>Published {formatDate(issue.publishedAt)}</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-3">
                              <Button 
                                className="w-full bg-red-impact hover:bg-berry text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-105"
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
                                <Download className="w-5 h-5 mr-2" />
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
                </StaggeredReveal>
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
                <ScrollReveal direction="up" delay={800} className="mt-12 pt-8 border-t border-white/20">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow mb-2">{issues.length}</div>
                      <div className="text-white/80">Total Issues</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow mb-2">Free</div>
                      <div className="text-white/80">Download Cost</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow mb-2">PDF</div>
                      <div className="text-white/80">High Quality</div>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              <ScrollReveal direction="up" delay={1000} className="mt-12 bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-3">Download Information</h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>• All journal issues are available in high-quality PDF format</li>
                  <li>• Downloads are completely free and require no registration</li>
                  <li>• Issues are organized chronologically from newest to oldest</li>
                  <li>• Each issue contains peer-reviewed research articles from our master's program</li>
                  <li>• For printed copies, please use our contact form</li>
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}