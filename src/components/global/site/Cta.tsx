import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'

const Cta = () => {
  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sell Your Truck CTA */}
          <Card className="relative overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative h-[400px]">
                <Image
                  src="/truckgarage.jpg"
                  alt="Sell your truck"
                  width={500}
                  height={500}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40">
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Sell Trucks
                      </h3>
                      <ul className="space-y-3 text-white/90">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Reach thousands of verified buyers
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Free truck value assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Quick and hassle-free process
                        </li>
                      </ul>
                    </div>
                    <button className="mt-6 w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-lg 
                                     hover:bg-red-700 transition duration-300 font-semibold text-lg">
                      List Your Truck
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finance Your Truck CTA */}
          <Card className="relative overflow-hidden group">
            <CardContent className="p-0">
              <div className="relative h-[400px]">
                <Image
                  src="/trccksec3.jpg"
                  alt="Finance your truck"
                  width={500}
                  height={500}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40">
                  <div className="p-8 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Finance Your Truck
                      </h3>
                      <ul className="space-y-3 text-white/90">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Competitive interest rates
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Flexible payment terms
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Quick approval process
                        </li>
                      </ul>
                      <div className="mt-4">
                        <p className="text-white/80 text-sm">
                          Rates as low as
                        </p>
                        <p className="text-3xl font-bold text-white">
                          4.99% APR
                        </p>
                      </div>
                    </div>
                    <button className="mt-6 w-full sm:w-auto px-8 py-3 bg-white text-gray-900 rounded-lg 
                                     hover:bg-white/90 transition duration-300 font-semibold text-lg">
                      Get Pre-Approved
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Cta