import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#c72027] hidden md:block">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center text-white">
          <div>
            {/* Left side */}
          </div>
          <div className="flex items-center space-x-6">
            <p 
               
               className="text-white hover:text-white/90"
           
         >
              Promotions
            </p>
            <p 
          
              className="text-white "
            >
              Get a Quote
            </p>
            <div className="flex items-center space-x-2">
              <PhoneCall size={18} className="text-white" />
              <a 
                href="tel:800.311.7144" 
                className="text-white hover:text-white/90"
              >
                Call Us: 800.311.7144
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;