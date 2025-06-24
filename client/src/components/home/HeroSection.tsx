
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden min-h-[80vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Floating Images */}
        <div className="absolute top-8 left-8 lg:left-16 hidden lg:block">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="/lovable-uploads/18f6ae70-cfff-4d0c-8a00-4b0b09cc16ce.png" 
              alt="Professional woman working with headphones"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute top-8 right-8 lg:right-16 hidden lg:block">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="/lovable-uploads/ab1b618d-f283-41ad-84b8-ffbfae6be08f.png" 
              alt="Professional businessman portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 lg:left-16 hidden lg:block">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="/lovable-uploads/6378372e-b08d-41cb-ba5a-e19e6ac2835e.png" 
              alt="Woman celebrating with phone"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

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
  );
}
