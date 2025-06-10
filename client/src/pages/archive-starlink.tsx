import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Calendar, BookOpen, Download, FileText } from "lucide-react";
import { ScrollReveal, StaggeredReveal } from "@/components/scroll-reveal";
import { motion } from "framer-motion";
import type { Issue } from "@shared/schema";

export default function Archive() {
  const { data: issues, isLoading: issuesLoading } = useQuery<Issue[]>({
    queryKey: ["/api/issues"],
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal direction="fade" className="pt-24 pb-16 text-center border-b border-white/10">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Publication Archive
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-6">
            Journal Issues
          </h1>
          <p className="text-xl font-light text-gray-400 max-w-2xl mx-auto">
            Access our complete collection of published journal issues
          </p>
        </ScrollReveal>

        {/* Issues Grid */}
        <ScrollReveal direction="up" delay={300} className="py-16">
          {issuesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-80 bg-white/5 rounded-xl border border-white/10"></div>
                </div>
              ))}
            </div>
          ) : issues && issues.length > 0 ? (
            <StaggeredReveal
              staggerDelay={150}
              direction="up"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              itemClassName="w-full"
            >
              {issues
                .sort((a, b) => {
                  if (a.publishedAt && b.publishedAt) {
                    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                  }
                  return parseInt(b.volume) - parseInt(a.volume) || parseInt(b.issue) - parseInt(a.issue);
                })
                .map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    whileHover={{ y: -4 }}
                    transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
                  >
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 h-full">
                      <CardContent className="p-0">
                        {/* Issue Header */}
                        <div className="p-6 border-b border-white/10">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="text-2xl font-light text-white mb-1">
                                Vol. {issue.volume}, Issue {issue.issue}
                              </div>
                              <div className="text-sm text-gray-500 font-light">
                                {issue.publishedAt ? formatDate(issue.publishedAt) : 'Draft'}
                              </div>
                            </div>
                            {issue.current && (
                              <Badge className="bg-white/10 text-white border-white/20 text-xs">
                                Latest
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-medium text-white mb-3 line-clamp-2">
                            {issue.title}
                          </h3>
                          
                          {issue.description && (
                            <p className="text-gray-400 text-sm font-light line-clamp-3">
                              {issue.description}
                            </p>
                          )}
                        </div>

                        {/* Download Section */}
                        <div className="p-6">
                          <Button 
                            className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3 rounded-xl transition-all duration-300"
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
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                          
                          <div className="flex justify-between text-xs text-gray-500 mt-3">
                            <span className="font-light">PDF Format</span>
                            <span className="font-light">{issue.pdfSize || '~2.5 MB'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </StaggeredReveal>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-white mb-3">No Issues Available</h3>
              <p className="text-gray-400 font-light">
                Journal issues will appear here as they are published.
              </p>
            </div>
          )}

          {/* Statistics */}
          {issues && issues.length > 0 && (
            <ScrollReveal direction="up" delay={600} className="mt-20 pt-16 border-t border-white/10">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-light text-white mb-2">{issues.length}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-light">Total Issues</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">Free</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-light">Access</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">PDF</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-light">Format</div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">∞</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-light">Downloads</div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
}