import Image from "next/image";
import React from "react";

const ServiceSec2 = () => {
  return (
    <div className="w-full py-12 px-4 bg-gray-50 md:px-8">
      <div className="mt-5 flex md:flex-row flex-col gap-5 ">
        <div className="w-full">
            <Image alt="image" className="w-full md:w-[700px]" src="/trk.jpg" width={500} height={500} />
          
        </div>
        <div className="w-full">
        <div>
                <h2 className="text-2xl font-bold text-gray-800">Our Services</h2>
                <p className="mt-3 mb-5">
                We carry all makes and models and supply expertly re-conditioned, road-ready semi-trucks you can count on from our nationwide locations near you. We pride ourselves on personalized customer service, but most importantly, we stand by our trucks.
                </p>
                <p>
                We also have solutions to protect your investment with extended warranties, as well as protection and insurance plans and in-house financing for maximum convenience.
                </p>
                <p className="mt-5">
                Truck Sales takes pride in our partnerships with leading industry businesses, associations and service providers. These valued relationships help us provide you with the best possible trucks and services available.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSec2;
