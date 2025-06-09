
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Mail, Users, Globe, BookOpen, Award, Target, Heart } from "lucide-react";
import type { Editor } from "@shared/schema";

export default function About() {
  const { data: editors, isLoading: editorsLoading } = useQuery<Editor[]>({
    queryKey: ["/api/editors"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-maroon via-berry to-ladybug text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About the Journal</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Fostering the next generation of neuroscientists through rigorous peer-reviewed publication
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-poppy/10 text-poppy rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4 mr-2" />
                Our Mission
              </div>
              <h2 className="text-4xl font-bold text-maroon mb-6">Advancing Neuroscience Research</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                The Student Neuroscience Journal at Radboud University provides a platform for undergraduate 
                and graduate students to publish their research findings, reviews, and innovative methodologies 
                in the field of neuroscience.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Founded in 2022, our journal maintains rigorous peer-review standards while fostering 
                the next generation of neuroscientists. We encourage interdisciplinary approaches and 
                cutting-edge research across all areas of neuroscience.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: "Rigorous peer-review process", color: "text-poppy" },
                { icon: Globe, text: "Open access publication", color: "text-ladybug" },
                { icon: Users, text: "Student-led editorial board", color: "text-berry" },
                { icon: BookOpen, text: "International readership", color: "text-maroon" },
                { icon: Heart, text: "Interdisciplinary collaboration", color: "text-poppy" },
                { icon: Award, text: "Professional development support", color: "text-ladybug" }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <item.icon className={`${item.color} h-6 w-6 flex-shrink-0`} />
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-20 bg-gradient-to-r from-gray-50 to-white rounded-3xl mb-20">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-berry/10 text-berry rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Our Values
              </div>
              <h2 className="text-4xl font-bold text-maroon mb-6">What Drives Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our core values guide every aspect of our publication process and community building.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-poppy to-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">E</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-maroon mb-4">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Maintaining the highest standards in research methodology, data analysis, and scientific writing.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-ladybug to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">I</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-maroon mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Encouraging novel approaches and groundbreaking research that advances neuroscience knowledge.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-berry to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">C</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-maroon mb-4">Collaboration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Fostering interdisciplinary partnerships and international research collaborations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CNS Journal Team 2024-25 */}
        <div className="py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-maroon/10 text-maroon rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </div>
            <h2 className="text-4xl font-bold text-maroon mb-6">CNS Journal Team 2024-25</h2>
            <p className="text-gray-600 mb-4">Contact: <a href="mailto:nijmegencns@gmail.com" className="text-poppy hover:text-red-600 font-medium">nijmegencns@gmail.com</a></p>
          </div>

          <div className="space-y-16">
            {/* Managing Editors */}
            <div>
              <h3 className="text-3xl font-bold text-ladybug mb-8 text-center">Managing Editors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: "Emanuela Pirani", senior: true },
                  { name: "Marco Rosata", senior: true },
                  { name: "Julia van den Anker", senior: false },
                  { name: "Monika Kazlauskaite", senior: false }
                ].map((editor) => (
                  <div key={editor.name} className="text-center bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-br from-ladybug to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">{editor.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <h4 className="font-bold text-maroon text-lg mb-2">{editor.name}</h4>
                    {editor.senior && <p className="text-sm text-poppy font-medium bg-poppy/10 px-3 py-1 rounded-full inline-block">Senior</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Review Editors */}
            <div>
              <h3 className="text-3xl font-bold text-ladybug mb-8 text-center">Review Editors</h3>
              
              {/* Track 1: LC */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
                  <h4 className="text-2xl font-semibold text-berry mx-6 bg-blue-50 px-6 py-2 rounded-full">Track 1: Language & Communication (LC)</h4>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent flex-1"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Beatrice Caddeo', 'Anna Mao', 'Siena Verger', 'Tamara Gunters', 'Nele Haferkorn', 'Caitlin Schirbach'].map((name) => (
                    <div key={name} className="text-center bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                      <h5 className="font-semibold text-maroon">{name}</h5>
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 2: PAC */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1"></div>
                  <h4 className="text-2xl font-semibold text-berry mx-6 bg-green-50 px-6 py-2 rounded-full">Track 2: Perception, Action & Control (PAC)</h4>
                  <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent flex-1"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Caroline Wunn', senior: false },
                    { name: 'Pia Kath', senior: false },
                    { name: 'Lena Holzner', senior: true },
                    { name: 'Kevin Reniers', senior: true }
                  ].map((member) => (
                    <div key={member.name} className="text-center bg-green-50 p-4 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                      <h5 className="font-semibold text-maroon">{member.name}</h5>
                      {member.senior && <p className="text-xs text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 3: DLP */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
                  <h4 className="text-2xl font-semibold text-berry mx-6 bg-purple-50 px-6 py-2 rounded-full">Track 3: Development, Learning & Plasticity (DLP)</h4>
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-1"></div>
                </div>
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
                    <div key={member.name} className="text-center bg-purple-50 p-4 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                      <h5 className="font-semibold text-maroon">{member.name}</h5>
                      {member.senior && <p className="text-xs text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Track 4: NCN */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1"></div>
                  <h4 className="text-2xl font-semibold text-berry mx-6 bg-orange-50 px-6 py-2 rounded-full">Track 4: Neural Computation & Neurotechnology (NCN)</h4>
                  <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent flex-1"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: 'Timon Crouzen', senior: true },
                    { name: 'Inga Schöyen', senior: false },
                    { name: 'Eefke van Straaten', senior: false }
                  ].map((member) => (
                    <div key={member.name} className="text-center bg-orange-50 p-4 rounded-xl border border-orange-100 hover:bg-orange-100 transition-colors">
                      <h5 className="font-semibold text-maroon">{member.name}</h5>
                      {member.senior && <p className="text-xs text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Teams */}
            <div className="grid md:grid-cols-2 gap-12">
              {/* Layout Editors */}
              <div>
                <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Layout Editors</h3>
                <div className="grid gap-4">
                  {[
                    { name: "Anushree Ganesh", senior: true },
                    { name: "Siena Vergeer", senior: false },
                    { name: "Lila Gianni", senior: false },
                    { name: "Kathleen Thornsberry", senior: false }
                  ].map((editor) => (
                    <div key={editor.name} className="text-center bg-yellow-50 p-4 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
                      <h4 className="font-bold text-maroon">{editor.name}</h4>
                      {editor.senior && <p className="text-sm text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Web Management */}
              <div>
                <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Web Management</h3>
                <div className="grid gap-4">
                  {[
                    { name: "Inga Schöyen", senior: true },
                    { name: "Eefke van Straaten", senior: false }
                  ].map((member) => (
                    <div key={member.name} className="text-center bg-teal-50 p-4 rounded-xl border border-teal-100 hover:bg-teal-100 transition-colors">
                      <h4 className="font-bold text-maroon">{member.name}</h4>
                      {member.senior && <p className="text-sm text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PR Team */}
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-ladybug mb-6 text-center">Public Relations</h3>
              <div className="grid gap-4">
                {[
                  { name: "Maye Cano", senior: true },
                  { name: "Ann Katigbak", senior: false }
                ].map((member) => (
                  <div key={member.name} className="text-center bg-pink-50 p-4 rounded-xl border border-pink-100 hover:bg-pink-100 transition-colors">
                    <h4 className="font-bold text-maroon">{member.name}</h4>
                    {member.senior && <p className="text-sm text-poppy font-medium mt-1 bg-poppy/10 px-2 py-1 rounded-full inline-block">Senior</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
