import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Categories = () => {
  const items = [
    {
      icon: "🛠️",
      title: "After-Sale Support",
      description:
        "A centralized warranty department for any after-sales related situations.",
    },
    {
      icon: "📦",
      title: "Product Quality",
      description: "Rigorous quality control standards for all our products.",
    },
    {
      icon: "🤝",
      title: "Customer Service",
      description: "24/7 dedicated support team for all your needs.",
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep.",
    },
    {
      icon: "💯",
      title: "Satisfaction Guarantee",
      description: "100% satisfaction guarantee on all purchases.",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row p-8">
   <div className="w-full p-5">
   <div className="space-y-6">
   
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-600">
            Trusted Commercial Vehicle Solutions
          </h3>
          <p className="text-gray-600 leading-relaxed">
            With over 25 years of experience in commercial vehicle sales, we've built 
            our reputation on delivering quality trucks and exceptional service to businesses 
            across the nation. Our commitment to excellence drives everything we do.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-red-600">✓</span>
              Industry-leading warranty coverage
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✓</span>
              Nationwide service network
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✓</span>
              24/7 roadside assistance
            </li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-600">
            Customer Success Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">15k+</div>
              <div className="text-sm text-gray-600">Vehicles Delivered</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">500+</div>
              <div className="text-sm text-gray-600">Service Centers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">25yrs</div>
              <div className="text-sm text-gray-600">Industry Experience</div>
            </div>
          </div>
          <p className="text-sm text-gray-500 italic">
            *Based on customer feedback and service records from 2023
          </p>
        </div>
      </div>
    </div>
   </div>

      <div className="p-8">
        <Carousel className="w-full md:w-[500px] ">
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index}>
                <Card className="border border-red-100">
                  <CardContent className="flex flex-col items-center justify-center p-6 min-h-[200px] h-[300px] text-center">
                    <div className="bg-red-600 rounded-full p-4 mb-4 text-white text-2xl">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-red-600 text-white hover:bg-red-700" />
          <CarouselNext className="bg-red-600 text-white hover:bg-red-700" />
        </Carousel>

        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === 0 ? "bg-red-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
