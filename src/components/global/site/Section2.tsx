import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image';

const FeaturedTrucks = () => {
  const trucks = [
    {
      id: "266181",
      image: "/features/1.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "83,999",
      miles: "379,260",
      location: "Kansas City, MO"
    },
    {
      id: "266180",
      image: "/features/2.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "74,999",
      miles: "362,967",
      location: "Cincinnati, OH"
    },
    {
      id: "266201",
      image: "/features/3.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "86,999",
      miles: "344,554",
      location: "French Camp, CA"
    },
    {
      id: "266182",
      image: "/features/4.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "82,999",
      miles: "385,260",
      location: "Denver, CO"
    },
    {
      id: "266183",
      image: "/features/5.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "79,999",
      miles: "372,967",
      location: "Phoenix, AZ"
    },
    {
      id: "266184",
      image: "/features/6.jpg",
      year: "2022",
      model: "Kenworth T680",
      price: "84,999",
      miles: "354,554",
      location: "Seattle, WA"
    },
  ];

  return (
    <section className="w-full py-12 px-4 bg-gray-50 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured Trucks
          </h2>
          <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => (
            <Card key={truck.id} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={truck.image}
                    alt={`${truck.year} ${truck.model}`}
                    width={500}
                    height={500}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-600"
                  >
                    PROMOTION
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {truck.year} {truck.model}
                  </h3>
                  <p className="text-xl font-bold text-red-600 mb-2">
                    ${truck.price}
                  </p>
                  <div className="text-gray-600">
                    <p className="mb-1">{truck.miles} Miles</p>
                    <div className="flex items-center gap-2">
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {truck.location}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Stock # {truck.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedTrucks