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
        <div className="mb-16">
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

        {/* CNS Journal Team 2024-25 */}
        <div>
          <h2 className="text-3xl font-bold text-maroon mb-8 text-center">CNS Journal Team 2024-25</h2>
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Contact: <a href="mailto:nijmegencns@gmail.com" className="text-poppy hover:text-red-600">nijmegencns@gmail.com</a></p>
          </div>

          <div className="space-y-12">
            {/* Managing Editors */}
            <div>
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Managing Editors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Emanuela Pirani</h4>
                  <p className="text-sm text-poppy font-medium">Senior</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Marco Rosata</h4>
                  <p className="text-sm text-poppy font-medium">Senior</p>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Julia van den Anker</h4>
                </div>
                <div className="text-center bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Monika Kazlauskaite</h4>
                </div>
              </div>
            </div>

            {/* Review Editors */}
            <div>
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Review Editors</h3>
              
              {/* Track 1: LC */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-berry mb-4">Track 1: Language & Communication (LC)</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Beatrice Caddeo', 'Anna Mao', 'Siena Verger', 'Tamara Gunters', 'Nele Haferkorn', 'Caitlin Schirbach'].map((name) => (
                    <div key={name} className="text-center bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-maroon text-sm">{name}</h5>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 2: PAC */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-berry mb-4">Track 2: Perception, Action & Control (PAC)</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Caroline Wunn</h5>
                  </div>
                  <div className="text-center bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Pia Kath</h5>
                  </div>
                  <div className="text-center bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Lena Holzner</h5>
                    <p className="text-xs text-poppy font-medium">Senior</p>
                  </div>
                  <div className="text-center bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Kevin Reniers</h5>
                    <p className="text-xs text-poppy font-medium">Senior</p>
                  </div>
                </div>
              </div>

              {/* Track 3: DLP */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-berry mb-4">Track 3: Development, Learning & Plasticity (DLP)</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Juulke Castelijn', senior: false },
                    { name: 'Maja Anuszewska', senior: false },
                    { name: 'Nina Koepke', senior: false },
                    { name: 'Gabriele Lucchesi', senior: false },
                    { name: 'Maria Aydin', senior: false },
                    { name: 'Lena Kohler', senior: false },
                    { name: 'Judith Bläsing', senior: false },
                    { name: 'Sebastian Reichstein', senior: true },
                    { name: 'Emile Zweistra', senior: true }
                  ].map((member) => (
                    <div key={member.name} className="text-center bg-purple-50 p-3 rounded-lg">
                      <h5 className="font-semibold text-maroon text-sm">{member.name}</h5>
                      {member.senior && <p className="text-xs text-poppy font-medium">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 4: NCN */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-berry mb-4">Track 4: Neural Computation & Neurotechnology (NCN)</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Timon Crouzen</h5>
                    <p className="text-xs text-poppy font-medium">Senior</p>
                  </div>
                  <div className="text-center bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Inga Schöyen</h5>
                  </div>
                  <div className="text-center bg-orange-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-maroon text-sm">Eefke van Straaten</h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Editors */}
            <div>
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Layout Editors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Anushree Ganesh</h4>
                  <p className="text-sm text-poppy font-medium">Senior</p>
                </div>
                <div className="text-center bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Siena Vergeer</h4>
                </div>
                <div className="text-center bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Lila Gianni</h4>
                </div>
                <div className="text-center bg-yellow-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Kathleen Thornsberry</h4>
                </div>
              </div>
            </div>

            {/* Web Management */}
            <div>
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Web Management</h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center bg-teal-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Inga Schöyen</h4>
                  <p className="text-sm text-poppy font-medium">Senior</p>
                </div>
                <div className="text-center bg-teal-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Eefke van Straaten</h4>
                </div>
              </div>
            </div>

            {/* PR Team */}
            <div>
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Public Relations</h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="text-center bg-pink-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Maye Cano</h4>
                  <p className="text-sm text-poppy font-medium">Senior</p>
                </div>
                <div className="text-center bg-pink-50 p-4 rounded-xl">
                  <h4 className="font-bold text-maroon">Ann Katigbak</h4>
                </div>
              </div>
            </div>
          </div>
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
