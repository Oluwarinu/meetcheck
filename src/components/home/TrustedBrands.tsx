
const trustedBrands = [
  { name: "TechCorp", logo: "/lovable-uploads/3171eb93-8b20-4589-92cd-ca3ab45e3ae6.png" },
  { name: "Innovate Solutions", logo: "/lovable-uploads/2e68b3b7-905c-4054-82aa-ee94905682ec.png" },
  { name: "Global Events", logo: "/lovable-uploads/578e1e01-c82d-48b5-a62e-009114beed5d.png" },
  { name: "EduConnect", logo: "/lovable-uploads/4096b316-b016-4e9b-ad53-2c3fdf5df7e1.png" },
  { name: "HealthFirst", logo: "/lovable-uploads/4d505fb4-3d9e-4113-846f-e9aa21b2502b.png" }
];

export default function TrustedBrands() {
  return (
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
  );
}
