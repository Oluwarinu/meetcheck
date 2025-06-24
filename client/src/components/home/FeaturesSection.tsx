import React from "react";
import { QrCode, BarChart3, Shield, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <QrCode className="h-8 w-8 text-blue-600" />,
      title: "QR Code Generation",
      description: "Generate unique QR codes for each event with custom branding options."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Get detailed insights with real-time attendance tracking and reporting."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee."
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Instant check-ins and real-time updates for seamless event management."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need for successful events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools to manage attendance, engage participants, and analyze event success.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}