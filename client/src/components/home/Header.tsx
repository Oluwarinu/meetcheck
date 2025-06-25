
import { Button } from "@/components/ui/button";
import { CheckCircle, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              MeetCheck
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
            <Link to="/resources" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Resources</Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
              <Link to="/login">Log In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#features" 
                className="block text-gray-600 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <Link 
                to="/pricing" 
                className="block text-gray-600 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/resources" 
                className="block text-gray-600 hover:text-blue-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
