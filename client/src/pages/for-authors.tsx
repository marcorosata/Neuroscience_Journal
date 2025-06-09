import { CheckCircle, FileText, Upload, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ForAuthors() {
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-maroon mb-4">For Authors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to share your research? Follow our submission guidelines for a smooth publication process.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Submission Process */}
          <div>
            <h2 className="text-2xl font-bold text-maroon mb-8">Submission Process</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-poppy rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prepare Your Manuscript</h3>
                  <p className="text-gray-600 text-sm">
                    Format according to our guidelines and ensure all ethical approvals are in place.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-ladybug rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submit Online</h3>
                  <p className="text-gray-600 text-sm">
                    Use our online portal to upload your manuscript and supplementary materials.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-berry rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Peer Review</h3>
                  <p className="text-gray-600 text-sm">
                    Expert reviewers evaluate your work for scientific rigor and significance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-maroon rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Publication</h3>
                  <p className="text-gray-600 text-sm">
                    Upon acceptance, your article is published and made freely accessible.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-maroon mb-6">Typical Timeline</h3>
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Initial Review</span>
                    <span className="text-poppy font-medium">1-2 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Peer Review</span>
                    <span className="text-poppy font-medium">4-6 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Revision Period</span>
                    <span className="text-poppy font-medium">2-4 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Final Decision</span>
                    <span className="text-poppy font-medium">1 week</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center font-semibold">
                    <span className="text-maroon">Total Time</span>
                    <span className="text-poppy">8-13 weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-maroon mb-6">Submission Guidelines</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Word count: 3,000-8,000 words for research articles</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">APA 7th edition citation style required</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Include structured abstract (max 250 words)</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Provide 3-5 keywords for indexing</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Ethics statement required for human/animal studies</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Figures and tables in high resolution (min 300 DPI)</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">Manuscript must be original and not under review elsewhere</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="text-poppy mt-1 flex-shrink-0 h-4 w-4" />
                <span className="text-sm text-gray-700">All authors must be current students at Radboud University</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <h3 className="font-semibold text-maroon mb-4">Article Types We Accept</h3>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-poppy/10 text-poppy border-poppy/20">Original Research</Badge>
                <Badge className="bg-ladybug/10 text-ladybug border-ladybug/20">Review Articles</Badge>
                <Badge className="bg-berry/10 text-berry border-berry/20">Case Studies</Badge>
                <Badge className="bg-maroon/10 text-maroon border-maroon/20">Methods</Badge>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200">Short Communications</Badge>
              </div>
            </div>

            <Button className="w-full bg-poppy hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Submit Your Article
            </Button>
          </div>
        </div>

        {/* Writing Guidelines */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-maroon mb-8 text-center">Writing Guidelines</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-poppy rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Structure</h3>
                <p className="text-gray-600 text-sm">
                  Follow standard scientific format: Abstract, Introduction, Methods, Results, Discussion, References.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-ladybug rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Clarity</h3>
                <p className="text-gray-600 text-sm">
                  Write clearly and concisely. Avoid jargon and explain technical terms for a broad scientific audience.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-berry rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-white h-6 w-6" />
                </div>
                <h3 className="font-bold text-maroon mb-3">Impact</h3>
                <p className="text-gray-600 text-sm">
                  Highlight the significance and novelty of your research. Discuss implications and future directions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ethics and Policies */}
        <div className="mt-16 bg-white p-8 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-maroon mb-6 text-center">Ethics and Policies</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-maroon mb-4">Research Ethics</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• IRB approval required for human subjects research</li>
                <li>• Animal research must follow institutional guidelines</li>
                <li>• Informed consent documentation required</li>
                <li>• Data privacy and confidentiality protection</li>
                <li>• Declaration of conflicts of interest</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-maroon mb-4">Publication Ethics</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Zero tolerance for plagiarism</li>
                <li>• Proper attribution of all sources</li>
                <li>• No duplicate or redundant publication</li>
                <li>• Authorship must reflect actual contributions</li>
                <li>• Open access publication model</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-maroon mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our editorial team is here to support you through the submission process.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-white">
              Contact Editorial Office
            </Button>
            <Button variant="outline" className="border-poppy text-poppy hover:bg-poppy hover:text-white">
              Download Guidelines PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
