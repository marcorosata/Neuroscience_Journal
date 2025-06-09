import { useQuery } from "@tanstack/react-query";
import { FileText, Users, Eye, Heart } from "lucide-react";

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
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Neural Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,66,75,0.3),transparent_40%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(190,49,30,0.2),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-poppy">Numbers</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Creating an inclusive space where passionate students share groundbreaking neuroscience discoveries with the world
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card-enhanced bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="w-20 h-20 bg-poppy rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-neural">
              <FileText className="text-white text-2xl" />
            </div>
            <div className="text-4xl font-bold text-white mb-2 tabular-nums">120</div>
            <div className="text-white font-semibold mb-2">Published Articles</div>
            <div className="text-white/60 text-sm">Peer-reviewed research</div>
          </div>
          
          <div className="card-enhanced bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="w-20 h-20 bg-ladybug rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-neural">
              <Users className="text-white text-2xl" />
            </div>
            <div className="text-4xl font-bold text-white mb-2 tabular-nums">300</div>
            <div className="text-white font-semibold mb-2">Contributors</div>
            <div className="text-white/60 text-sm">Graduate researchers</div>
          </div>
          
          <div className="card-enhanced bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="w-20 h-20 bg-berry rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-neural">
              <Eye className="text-white text-2xl" />
            </div>
            <div className="text-4xl font-bold text-white mb-2 tabular-nums">1</div>
            <div className="text-white font-semibold mb-2">Monthly Readers</div>
            <div className="text-white/60 text-sm">Global community</div>
          </div>
          
          <div className="card-enhanced bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 group">
            <div className="w-20 h-20 bg-maroon rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-neural">
              <Heart className="text-white text-2xl" />
            </div>
            <div className="text-4xl font-bold text-white mb-2 tabular-nums">{stats.totalSponsors}</div>
            <div className="text-white font-semibold mb-2">Sponsors</div>
            <div className="text-white/60 text-sm">Supporting partners</div>
          </div>
        </div>
      </div>
    </section>
  );
}
