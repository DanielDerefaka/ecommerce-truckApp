import Image from 'next/image'
import React from 'react'

const ServiceTop = () => {
  return (
    <div>
          <div className="relative h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/trc.jpg"
          alt="Hero background"
          className="h-[400px] w-full object-cover"
          width={800}
          height={500}
        />
        {/* Dark overlay */}
        <div className="absolute  h-[400px] inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
       Services 
        </h1>
      
      </div>
    </div>
    </div>
  )
}

export default ServiceTop