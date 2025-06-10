import { Brain } from "lucide-react";
import { FaTwitter, FaLinkedin, FaOrcid } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-mahogany text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/attached_assets/channels4_profile_1749476651261.jpg" 
                alt="Radboud University Logo"
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h3 className="font-bold text-lg">CNS Journal</h3>
                <p className="text-gray-300 text-sm">Radboud University</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Advancing neuroscience research through student scholarship and innovation. 
              Publishing quality research since 2022.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <FaOrcid className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/current-issue" className="hover:text-white transition-colors">Current Issue</a></li>
              <li><a href="/archive" className="hover:text-white transition-colors">Archive</a></li>
              <li><a href="/for-authors" className="hover:text-white transition-colors">Submit Article</a></li>
              <li><a href="/for-reviewers" className="hover:text-white transition-colors">Peer Review</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Editorial Board</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <div>
                  <p className="text-sm">Editorial Office</p>
                  <a href="mailto:editor@snj.ru.nl" className="hover:text-white transition-colors">
                    editor@snj.ru.nl
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="text-sm">
                  <p>Radboud University</p>
                  <p>Heyendaalseweg 135, 6525 AJ Nijmegen</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-white text-sm">
          <p>&copy; 2024 Student Neuroscience Journal, Radboud University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
