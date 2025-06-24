
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
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
  );
}
