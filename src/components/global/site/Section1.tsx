import Image from 'next/image'
import React from 'react'

const Section1 = () => {
  return (
    <div>
         <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide selection of commercial vehicles to find the perfect match for your business needs
    
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* First Column */}
          <div className="group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/trcuksec1.webp"
                alt="Service 1"
                width={500}
                height={500}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">Class 8 Trucks</h3>
                  <p className="text-white/90 mb-4">
                  Browse our selection of Class 8 trucks from top manufacturers like 
                    Peterbilt, Kenworth, and Freightliner. Available in various configurations 
                    including sleeper cabs, day cabs, and specialized hauling units.
                  </p>
                  <button className="px-6 py-2 bg-white text-black rounded-lg 
                                   hover:bg-white/90 transition duration-300 font-medium">
                   Explore
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Second Column */}
          <div className="group">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/trucksec2.jpg"
                alt="Service 2"
                width={500}
                height={500}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-3">Features </h3>
                  <p className="text-white/90 mb-4">
                  Discover our range of Class 4-7 trucks perfect for local delivery, 
                    construction, and specialized applications. Features box trucks, 
                    flatbeds, and utility vehicles from leading brands.
                  </p>
                  <button className="px-6 py-2 bg-white text-black rounded-lg 
                                   hover:bg-white/90 transition duration-300 font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}

export default Section1