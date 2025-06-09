import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Mail } from "lucide-react";
import type { Editor } from "@shared/schema";

export default function About() {
  const { data: editors, isLoading: editorsLoading } = useQuery<Editor[]>({
    queryKey: ["/api/editors"],
  });

  return (
    <div className="min-h-screen py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-maroon mb-6">About the Journal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fostering the next generation of neuroscientists through rigorous peer-reviewed publication
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-maroon mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The Student Neuroscience Journal at Radboud University provides a platform for undergraduate 
              and graduate students to publish their research findings, reviews, and innovative methodologies 
              in the field of neuroscience.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Founded in 2022, our journal maintains rigorous peer-review standards while fostering 
              the next generation of neuroscientists. We encourage interdisciplinary approaches and 
              cutting-edge research across all areas of neuroscience.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">Rigorous peer-review process</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">Open access publication</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">Student-led editorial board</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">International readership</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">Interdisciplinary collaboration</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-poppy h-5 w-5 flex-shrink-0" />
                <span className="text-gray-700">Professional development support</span>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Students collaborating in university lab" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-maroon mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-poppy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="font-bold text-maroon mb-3">Excellence</h3>
              <p className="text-gray-600 text-sm">
                Maintaining the highest standards in research methodology, data analysis, and scientific writing.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-ladybug rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h3 className="font-bold text-maroon mb-3">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Encouraging novel approaches and groundbreaking research that advances neuroscience knowledge.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-berry rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="font-bold text-maroon mb-3">Collaboration</h3>
              <p className="text-gray-600 text-sm">
                Fostering interdisciplinary partnerships and international research collaborations.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Board */}
        <div>
          <h2 className="text-3xl font-bold text-maroon mb-8 text-center">Editorial Board</h2>
          {editorsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-3 w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : editors ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {editors.map((editor) => (
                <div key={editor.id} className="text-center bg-gray-50 p-6 rounded-xl">
                  {editor.imageUrl && (
                    <img 
                      src={editor.imageUrl}
                      alt={editor.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                  )}
                  <h4 className="font-bold text-maroon text-lg">{editor.name}</h4>
                  <p className="text-ladybug text-sm font-medium mb-1">{editor.title}</p>
                  <p className="text-gray-500 text-sm mb-3">{editor.specialization}</p>
                  {editor.bio && (
                    <p className="text-gray-600 text-xs mb-3 leading-relaxed">{editor.bio}</p>
                  )}
                  <a 
                    href={`mailto:${editor.email}`}
                    className="inline-flex items-center space-x-1 text-poppy hover:text-red-600 text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Editorial board information is currently unavailable.</p>
            </div>
          )}
        </div>

        {/* Journal History */}
        <div className="mt-16 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-maroon mb-6 text-center">Journal History</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-poppy rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2022</span>
                </div>
                <div>
                  <h4 className="font-semibold text-maroon">Journal Founded</h4>
                  <p className="text-gray-600 text-sm">
                    The Student Neuroscience Journal was established at Radboud University to provide 
                    a dedicated platform for student research in neuroscience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-ladybug rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2023</span>
                </div>
                <div>
                  <h4 className="font-semibold text-maroon">First Issues Published</h4>
                  <p className="text-gray-600 text-sm">
                    The journal published its first volume with groundbreaking student research 
                    in cognitive and computational neuroscience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-berry rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2024</span>
                </div>
                <div>
                  <h4 className="font-semibold text-maroon">International Recognition</h4>
                  <p className="text-gray-600 text-sm">
                    The journal gained international recognition and established partnerships 
                    with leading neuroscience institutions worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
