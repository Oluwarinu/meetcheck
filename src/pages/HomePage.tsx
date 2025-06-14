import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Calendar, TrendingUp, ArrowRight, QrCode, Clock, BarChart3, Scan, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import AdBanner from "@/components/AdBanner";

const trustedBrands = [
  { name: "TechCorp", logo: "/lovable-uploads/3171eb93-8b20-4589-92cd-ca3ab45e3ae6.png" },
  { name: "Innovate Solutions", logo: "/lovable-uploads/2e68b3b7-905c-4054-82aa-ee94905682ec.png" },
  { name: "Global Events", logo: "/lovable-uploads/578e1e01-c82d-48b5-a62e-009114beed5d.png" },
  { name: "EduConnect", logo: "/lovable-uploads/4096b316-b016-4e9b-ad53-2c3fdf5df7e1.png" },
  { name: "HealthFirst", logo: "/lovable-uploads/4d505fb4-3d9e-4113-846f-e9aa21b2502b.png" }
];

const features = [
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "Automated Attendance Tracking",
    description: "Automatically track attendance using QR codes, NFC tags, or facial recognition. Say goodbye to manual check-ins and hello to efficiency."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Attendance Data",
    description: "Monitor attendance in real-time during your events. See who's attending, track peak attendance times, and manage capacity effectively."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Detailed Attendance Reports",
    description: "Generate detailed reports on attendance trends, demographics, and engagement. Gain valuable insights to optimize future events."
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MeetCheck</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900 font-medium">Resources</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Centered Layout with Floating Images */}
      <section className="relative py-20 lg:py-32 overflow-hidden min-h-[80vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Floating Images */}
          {/* Top Left - Woman with headphones */}
          <div className="absolute top-8 left-8 lg:left-16 hidden lg:block">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="/lovable-uploads/18f6ae70-cfff-4d0c-8a00-4b0b09cc16ce.png" 
                alt="Professional woman working with headphones"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Top Right - Professional businessman */}
          <div className="absolute top-8 right-8 lg:right-16 hidden lg:block">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="/lovable-uploads/ab1b618d-f283-41ad-84b8-ffbfae6be08f.png" 
                alt="Professional businessman portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Left - Woman celebrating */}
          <div className="absolute bottom-8 left-8 lg:left-16 hidden lg:block">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="/lovable-uploads/6378372e-b08d-41cb-ba5a-e19e6ac2835e.png" 
                alt="Woman celebrating with phone"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Right - Man with laptop outdoors */}
          <div className="absolute bottom-8 right-8 lg:right-16 hidden lg:block">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
              <img 
                src="/lovable-uploads/1a0d85ca-5f1c-4c9f-aac2-05064b115483.png" 
                alt="Man working with laptop outdoors"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Centered Main Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Automate Your
              <span className="block text-blue-600">Attendance Tracking</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium leading-relaxed">
              MeetCheck is the all-in-one solution for managing attendance at your events. Track attendance, gain insights, and streamline your event management process.
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Link to="/signup" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-6 text-xl font-semibold border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Leading Brands */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trusted by leading brands</h2>
            <div className="grid grid-cols-5 gap-8">
              {trustedBrands.map((brand, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-2 p-2">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
          </div>
          <AdBanner 
            adSlot="1234567890" 
            className="max-w-4xl mx-auto"
          />
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MeetCheck offers a comprehensive suite of tools to simplify attendance management and provide valuable insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your event management?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust MeetCheck to streamline their attendance tracking and gain valuable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Link to="/signup" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-all duration-200">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MeetCheck</span>
            </div>
            <div className="flex space-x-8 text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact Us</a>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2023 MeetCheck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
