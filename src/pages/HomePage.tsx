
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Calendar, TrendingUp, ArrowRight, Star, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const featuredAds = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description: "Join the biggest tech event of the year",
    image: "/placeholder.svg",
    website: "https://techconf2024.com",
    brand: "TechCorp",
    category: "Event"
  },
  {
    id: 2,
    title: "Business Summit",
    description: "Network with industry leaders",
    image: "/placeholder.svg",
    website: "https://businesssummit.com",
    brand: "BusinessHub",
    category: "Event"
  },
  {
    id: 3,
    title: "Innovation Awards",
    description: "Celebrating breakthrough innovations",
    image: "/placeholder.svg",
    website: "https://innovationawards.com",
    brand: "InnovateCorp",
    category: "Event"
  },
  {
    id: 4,
    title: "Digital Marketing Expo",
    description: "Discover the latest marketing trends",
    image: "/placeholder.svg",
    website: "https://digitalmarketingexpo.com",
    brand: "MarketPro",
    category: "Event"
  }
];

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Check-ins",
    description: "Location-verified attendance with IP tracking"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Real-time Tracking",
    description: "Automatic timestamping and live attendance updates"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Custom Registration",
    description: "Collect any participant information you need"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Analytics Dashboard",
    description: "Comprehensive insights and reporting tools"
  }
];

const stats = [
  { value: "10K+", label: "Events Managed" },
  { value: "100K+", label: "Attendees Verified" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-meetcheck-blue rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MeetCheck</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-meetcheck-blue text-meetcheck-blue hover:bg-meetcheck-blue hover:text-white">
                Login
              </Button>
              <Button className="bg-meetcheck-blue hover:bg-blue-600">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-meetcheck-light-blue text-meetcheck-blue">
              Trusted by 10,000+ Event Organizers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Verified Event
              <span className="text-meetcheck-blue"> Check-ins</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Secure, location-verified attendance tracking with real-time analytics. 
              Make every event count with MeetCheck's comprehensive verification system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-meetcheck-blue hover:bg-blue-600 text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-meetcheck-blue text-meetcheck-blue hover:bg-meetcheck-blue hover:text-white text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-meetcheck-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events/Brands Carousel */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Events & Partners
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing events and connect with leading brands
            </p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-4">
              {featuredAds.map((ad) => (
                <CarouselItem key={ad.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img 
                          src={ad.image} 
                          alt={ad.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4 bg-meetcheck-blue">
                          {ad.category}
                        </Badge>
                      </div>
                      <div className="p-6">
                        <div className="text-sm text-gray-500 mb-1">{ad.brand}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {ad.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{ad.description}</p>
                        <Button 
                          className="w-full bg-meetcheck-blue hover:bg-blue-600"
                          onClick={() => window.open(ad.website, '_blank')}
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MeetCheck?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive verification system ensures accurate attendance tracking 
              and provides valuable insights for your events.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-meetcheck-light-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-meetcheck-blue">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-meetcheck-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Events?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of event organizers who trust MeetCheck for secure, 
            verified attendance tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-meetcheck-blue hover:bg-blue-50 text-lg px-8">
              <Link to="/dashboard" className="flex items-center">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-meetcheck-blue text-lg px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-meetcheck-blue rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">MeetCheck</span>
              </div>
              <p className="text-gray-400">
                Secure, verified event check-ins with comprehensive analytics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MeetCheck. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
