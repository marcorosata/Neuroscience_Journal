import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Brain, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Branding */}
          <Link href="/" className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-maroon rounded-lg flex items-center justify-center">
                <Brain className="text-white text-xl" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-maroon">Student Neuroscience Journal</h1>
                <p className="text-sm text-gray-600">Radboud University</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={`font-medium transition-colors ${
              isActive("/") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
            }`}>
              Home
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${
                    isActive("/about") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
                  }`}>
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link href="/about" className="block px-3 py-2 text-sm text-gray-700 hover:text-ladybug hover:bg-gray-50 rounded">
                        About the Journal
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${
                    isActive("/current-issue") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
                  }`}>
                    Current Issue
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link href="/current-issue" className="block px-3 py-2 text-sm text-gray-700 hover:text-ladybug hover:bg-gray-50 rounded">
                        Latest Articles
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${
                    isActive("/archive") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
                  }`}>
                    Archive
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link href="/archive" className="block px-3 py-2 text-sm text-gray-700 hover:text-ladybug hover:bg-gray-50 rounded">
                        Past Issues
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${
                    isActive("/for-authors") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
                  }`}>
                    For Authors
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link href="/for-authors" className="block px-3 py-2 text-sm text-gray-700 hover:text-ladybug hover:bg-gray-50 rounded">
                        Submission Guidelines
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${
                    isActive("/for-reviewers") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
                  }`}>
                    For Reviewers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-48 p-2">
                      <Link href="/for-reviewers" className="block px-3 py-2 text-sm text-gray-700 hover:text-ladybug hover:bg-gray-50 rounded">
                        Review Process
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/contact" className={`font-medium transition-colors ${
              isActive("/contact") ? "text-ladybug" : "text-gray-700 hover:text-ladybug"
            }`}>
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  About
                </Link>
                <Link href="/current-issue" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  Current Issue
                </Link>
                <Link href="/archive" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  Archive
                </Link>
                <Link href="/for-authors" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  For Authors
                </Link>
                <Link href="/for-reviewers" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  For Reviewers
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-ladybug font-medium" onClick={() => setMobileOpen(false)}>
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
