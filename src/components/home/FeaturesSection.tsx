
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Clock, BarChart3 } from "lucide-react";

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

export default function FeaturesSection() {
  return (
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
  );
}
