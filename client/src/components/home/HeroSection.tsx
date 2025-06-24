import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Simplify Event
            <span className="text-blue-600"> Attendance</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track attendance effortlessly with QR codes, real-time analytics, and seamless check-ins. 
            Perfect for events of any size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/signup">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Check-ins</h3>
              <p className="text-gray-600">QR code scanning for instant attendance tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Live attendance data and comprehensive reports</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Event Management</h3>
              <p className="text-gray-600">Organize multiple events with ease</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}