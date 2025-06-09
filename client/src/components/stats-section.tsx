import { useQuery } from "@tanstack/react-query";
import { FileText, Users, Eye, Quote } from "lucide-react";

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-maroon mb-4">Journal Impact & Reach</h2>
            <p className="text-gray-600">Building tomorrow's neuroscience community through quality research</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-8 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Unable to load statistics at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-maroon mb-4">Journal Impact & Reach</h2>
          <p className="text-gray-600">Building tomorrow's neuroscience community through quality research</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-poppy rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white text-2xl" />
            </div>
            <div className="text-3xl font-bold text-maroon mb-2">{stats.publishedArticles}</div>
            <div className="text-gray-600">Published Articles</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-ladybug rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white text-2xl" />
            </div>
            <div className="text-3xl font-bold text-maroon mb-2">{stats.authors}</div>
            <div className="text-gray-600">Student Authors</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-berry rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="text-white text-2xl" />
            </div>
            <div className="text-3xl font-bold text-maroon mb-2">{stats.monthlyReaders.toLocaleString()}</div>
            <div className="text-gray-600">Monthly Readers</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="text-white text-2xl" />
            </div>
            <div className="text-3xl font-bold text-maroon mb-2">{stats.totalCitations}</div>
            <div className="text-gray-600">Total Citations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
