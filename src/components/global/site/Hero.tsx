import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/truckpic.jpg"
          alt="Hero background"
          className="h-[500px] w-full object-cover"
          width={800}
          height={500}
        />
        {/* Dark overlay */}
        <div className="absolute  h-[500px] inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Largest Selection of Trucks for Sale!
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
          Discover amazing experiences and unforgettable moments. Join us on a journey 
          of innovation and excellence.
        </p>
        <Link href="/explore">
        <button className="px-8 py-3 bg-red-700 text-white font-semibold
                  hover:bg-transparent hover:border-white hover:border      ">
          Shop All Trucks
        </button>
        </Link>
       
      </div>
    </div>
  )
}

export default Hero