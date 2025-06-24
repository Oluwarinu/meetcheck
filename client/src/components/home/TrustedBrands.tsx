
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const trustedBrands = [
  { name: "TechCorp", logo: "/lovable-uploads/3171eb93-8b20-4589-92cd-ca3ab45e3ae6.png" },
  { name: "Innovate Solutions", logo: "/lovable-uploads/2e68b3b7-905c-4054-82aa-ee94905682ec.png" },
  { name: "Global Events", logo: "/lovable-uploads/578e1e01-c82d-48b5-a62e-009114beed5d.png" },
  { name: "EduConnect", logo: "/lovable-uploads/4096b316-b016-4e9b-ad53-2c3fdf5df7e1.png" },
  { name: "HealthFirst", logo: "/lovable-uploads/4d505fb4-3d9e-4113-846f-e9aa21b2502b.png" }
];

export default function TrustedBrands() {
  const [api, setApi] = useState<any>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Trusted by leading brands</h2>
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {trustedBrands.map((brand, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center p-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
              {/* Duplicate items for seamless loop */}
              {trustedBrands.map((brand, index) => (
                <CarouselItem key={`duplicate-${index}`} className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="flex items-center justify-center">
                    <div className="w-64 h-64 bg-white rounded-lg flex items-center justify-center p-4 shadow-sm hover:shadow-md transition-shadow">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
