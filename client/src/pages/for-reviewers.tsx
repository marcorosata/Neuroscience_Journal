import { Users, Clock, Award, FileCheck, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForReviewers() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-maroon mb-4">For Reviewers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our community of expert reviewers and help maintain the highest standards of student neuroscience research.
          </p>
        </div>

        {/* Benefits of Reviewing */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Why Review for Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-poppy rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Mentorship</h3>
                <p className="text-gray-600 text-sm">
                  Guide the next generation of neuroscientists and help shape their research careers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-ladybug rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Recognition</h3>
                <p className="text-gray-600 text-sm">
                  Receive formal recognition for your contributions to academic publishing.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-berry rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Contribute to maintaining the highest standards in neuroscience research.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Review Process */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-8">Review Process</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-poppy rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Invitation Received</h3>
                  <p className="text-gray-600 text-sm">
                    You'll receive an email invitation to review a manuscript in your area of expertise.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-ladybug rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Accept or Decline</h3>
                  <p className="text-gray-600 text-sm">
                    Respond within 48 hours to confirm your availability and avoid conflicts of interest.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-berry rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Conduct Review</h3>
                  <p className="text-gray-600 text-sm">
                    Complete a thorough, constructive review within 3 weeks using our structured format.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-maroon rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submit Report</h3>
                  <p className="text-gray-600 text-sm">
                    Submit your detailed review report with clear recommendations for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-maroon mb-6">Review Criteria</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-maroon mb-2">Scientific Quality</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Methodological rigor and appropriateness</li>
                  <li>• Statistical analysis and interpretation</li>
                  <li>• Data quality and reproducibility</li>
                  <li>• Ethical considerations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-maroon mb-2">Novelty & Significance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Originality of research question</li>
                  <li>• Contribution to the field</li>
                  <li>• Implications for future research</li>
                  <li>• Relevance to neuroscience community</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-maroon mb-2">Presentation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Clarity of writing and structure</li>
                  <li>• Quality of figures and tables</li>
                  <li>• Completeness of references</li>
                  <li>• Adherence to journal guidelines</li>
                </ul>
              </div>
            </div>

            <Button className="w-full mt-6 bg-poppy hover:bg-red-600 text-white">
              <FileCheck className="h-4 w-4 mr-2" />
              Become a Reviewer
            </Button>
          </div>
        </div>

        {/* Review Guidelines */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Review Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-maroon mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Confidentiality
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Treat all manuscripts as confidential</li>
                  <li>• Do not share content with unauthorized persons</li>
                  <li>• Maintain anonymity throughout the process</li>
                  <li>• Delete files after review completion</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-maroon mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Timeliness
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Respond to invitations within 48 hours</li>
                  <li>• Complete reviews within 3 weeks</li>
                  <li>• Notify editors of delays immediately</li>
                  <li>• Decline if unable to meet deadlines</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Expert Areas */}
        <div className="mb-16 bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-maroon mb-6 text-center">Areas of Expertise</h2>
          <p className="text-center text-gray-600 mb-8">
            We're seeking reviewers with expertise in the following areas:
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Cellular & Molecular</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Synaptic Plasticity</Badge>
                <Badge variant="outline">Neurotransmitters</Badge>
                <Badge variant="outline">Ion Channels</Badge>
                <Badge variant="outline">Gene Expression</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Systems & Circuits</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Neural Networks</Badge>
                <Badge variant="outline">Brain Imaging</Badge>
                <Badge variant="outline">Electrophysiology</Badge>
                <Badge variant="outline">Optogenetics</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Cognitive & Behavioral</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Memory & Learning</Badge>
                <Badge variant="outline">Decision Making</Badge>
                <Badge variant="outline">Social Cognition</Badge>
                <Badge variant="outline">Motor Control</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Computational</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Neural Modeling</Badge>
                <Badge variant="outline">Machine Learning</Badge>
                <Badge variant="outline">Data Analysis</Badge>
                <Badge variant="outline">Simulation</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Clinical</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Neurological Disorders</Badge>
                <Badge variant="outline">Psychiatric Conditions</Badge>
                <Badge variant="outline">Rehabilitation</Badge>
                <Badge variant="outline">Therapeutics</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-maroon">Developmental</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">Brain Development</Badge>
                <Badge variant="outline">Aging</Badge>
                <Badge variant="outline">Neurogenesis</Badge>
                <Badge variant="outline">Critical Periods</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Recognition Program */}
        <div className="text-center bg-gradient-to-r from-maroon to-mahogany text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Reviewer Recognition Program</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Outstanding reviewers receive annual recognition certificates, priority consideration for editorial board positions, 
            and invitations to exclusive academic events.
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-poppy hover:bg-red-600 text-white">
              Join Our Review Panel
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-maroon">
              Download Review Template
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
