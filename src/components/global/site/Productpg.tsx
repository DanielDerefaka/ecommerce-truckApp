import React from 'react';
import { 
  Truck, 
  Battery, 
  Fuel, 
  Shield, 
  Gauge, 
  Package, 
  Star 
} from 'lucide-react';

const TruckProductPage = () => {
  const specs = [
    { icon: <Gauge size={24} />, label: "Horsepower", value: "500 HP" },
    { icon: <Package size={24} />, label: "Payload", value: "15,000 lbs" },
    { icon: <Fuel size={24} />, label: "Fuel Economy", value: "7.5 MPG" },
    { icon: <Battery size={24} />, label: "Range", value: "800 miles" }
  ];

  const reviews = [
    { rating: 5, text: "Best in class performance", author: "John D." },
    { rating: 4, text: "Great value for money", author: "Sarah M." }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-red-600 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">2024 PowerHaul Pro</h1>
          <p className="text-xl">Dominate the road with unmatched power and reliability</p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Image */}
          <div className="lg:col-span-2 rounded-xl bg-gray-100 p-6 h-96">
            <div className="h-full flex items-center justify-center">
              <Truck size={200} className="text-red-600" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-red-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Quick Stats</h2>
            <div className="space-y-4">
              {specs.map((spec, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-red-600">{spec.icon}</span>
                  <div>
                    <p className="font-medium">{spec.label}</p>
                    <p className="text-gray-600">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Shield className="text-red-600" size={20} />
                <span>Advanced Safety Systems</span>
              </li>
              <li className="flex items-center gap-2">
                <Battery className="text-red-600" size={20} />
                <span>Eco-Friendly Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Truck className="text-red-600" size={20} />
                <span>Spacious Cargo Space</span>
              </li>
            </ul>
          </div>

          {/* Customer Reviews */}  
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-red-600 text-red-600" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-1">{review.text}</p>
                  <p className="text-sm text-gray-500">- {review.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-red-600 text-white rounded-xl p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">Ready to Roll?</h2>
            <p className="mb-4">Starting at $85,000</p> 
            <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">
              Configure Your Truck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckProductPage;