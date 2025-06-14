import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Calendar, TrendingUp, ArrowRight, QrCode, Clock, BarChart3 } from "lucide-react";
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

      {/* Main Banner */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Automate your attendance tracking
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                MeetCheck is the all-in-one solution for managing attendance at your events. Track attendance, gain insights, and streamline your event management process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Link to="/signup" className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="relative">
                <img 
                  src="/lovable-uploads/008e7ecd-5844-433d-ad2f-dd08a42b2672.png" 
                  alt="Modern workspace" 
                  className="w-full h-96 object-cover rounded-lg shadow-2xl"
                />
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

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your event management?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust MeetCheck to streamline their attendance tracking and gain valuable insights.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
            <Link to="/signup" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
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
