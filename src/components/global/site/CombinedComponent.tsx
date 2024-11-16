import Image from "next/image";

// types.ts
type ResourceLink = {
    title: string;
    href: string;
    icon: string;
  };
  
  type PartnerLogo = {
    name: string;
    imageUrl: string;
    alt: string;
  };
  
  // components/Hero.tsx
  const Hero = () => {
    return (
      <header className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Arrow is all about clear and simple used truck buying.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            You can't be in the industry as long as we have if you aren't shooting your customers straight. 
            We want to be the semi-truck dealer that gives you the best, most relevant information so you 
            can invest in your business with confidence.
          </p>
        </div>
      </header>
    );
  };
  
  // components/TradeInSection.tsx
  const TradeInSection = () => {
    return (
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Sell or Trade In Your Used Semi-Truck
          </h2>
          <div className="space-y-6">
            <p className="text-gray-600">
              Whether you're getting out of the trucking business or you're ready to upgrade to a newer model, 
              we know that selling your old semi-truck isn't always an easy task. The market for these vehicles 
              is a small one, and it's important to find the right buyer if you want to get the amount your 
              truck is truly worth.
            </p>
            <p className="text-gray-600">
              At Arrow Truck Sales, we deal in nothing but semi-trucks. We know what your truck is worth and 
              will give you a fair offer on it if you're looking to sell.
            </p>
          </div>
        </div>
      </section>
    );
  };
  
  // components/LocationsSection.tsx
  const LocationsSection = () => {
    return (
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Convenient Locations Across the Country
          </h2>
          <p className="text-gray-600 mb-4">
            Arrow Truck Sales is a nationally recognized name in the trucking industry, and we have 
            convenient locations all across the country.
          </p>
          <p className="text-gray-600">
            From the East Coast to the West Coast and many places between, there's sure to be an 
            Arrow Truck Sales lot in your area.
          </p>
        </div>
      </section>
    );
  };
  
  // components/ResourcesSection.tsx
  const ResourcesSection = () => {
    const resources: ResourceLink[] = [
      { title: "Search Our Inventory", href: "/inventory", icon: "search" },
      { title: "Check out our Promotions", href: "/promotions", icon: "tag" },
      { title: "Apply for Credit", href: "/credit", icon: "file" },
      { title: "Learn about our Warranty & Protection Plans", href: "/warranty", icon: "shield" }
    ];
  
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Jumpstart Your Semi-Truck Search
          </h2>
          <div className="grid gap-4">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-lg text-gray-700">{resource.title}</span>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  // components/PartnersSection.tsx

  // pages/index.tsx
  export default function ServiceCombined() {
    return (
      <main className="min-h-screen">
        <Hero />
        <TradeInSection />
        <LocationsSection />
        <ResourcesSection />
      
      </main>
    );
  }