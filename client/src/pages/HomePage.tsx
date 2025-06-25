
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import TrustedBrands from "@/components/home/TrustedBrands";
import AdBanner from "@/components/AdBanner";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <TrustedBrands />
      
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

      <div id="features">
        <FeaturesSection />
      </div>
      <CTASection />
      <Footer />
    </div>
  );
}
