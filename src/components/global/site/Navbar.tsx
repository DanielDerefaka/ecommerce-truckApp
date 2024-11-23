import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import CartButton from "./Cart";

const Navbar: React.FC = async () => {
  const user = await currentUser();
 
  if(!user) (
    console.log('no user')
  )
  return (
    <Menubar className="rounded-none bg-white border-b border-gray-100 py-8 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="relative w-40 h-12">
          <Image
            src="/truckLogo.jpg"
            alt="Arrow Truck Sales"
            fill
            className="object-contain"
          />
        </Link>

        <div className="hidden lg:flex items-center space-x-8">
          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
              <Link href="/">Home</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
              <span>Financing</span>
              <ChevronDown size={16} />
            </MenubarTrigger>
            <MenubarContent className="bg-white rounded-lg shadow-lg p-2">
              <MenubarItem className="px-4 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <Link href="/financing/financial-services">
                  Financial Services
                </Link>
              </MenubarItem>
              <MenubarItem className="px-4 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <Link href="/financing/pre-qualify">
                  Pre-Qualify for Credit
                </Link>
              </MenubarItem>
              <MenubarItem className="px-4 py-2 hover:bg-gray-50 rounded-md cursor-pointer">
                <Link href="/financing/estimator">Payment Estimator</Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
              <Link href="/services">Services</Link>
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
              <Link href="/products">Products</Link>
            </MenubarTrigger>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
              <Link href="/contact">Contact</Link>
            </MenubarTrigger>
          </MenubarMenu>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Search Button */}
          {/* <Button
            variant="ghost"
            className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <Search size={18} />
          </Button> */}

          {/* Account Menu */}
          <MenubarMenu>
            <MenubarTrigger className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <Link href="/user/account" className="flex space-x-1" >
              <User size={18} />
              <span className="hidden md:inline">Account</span>
              </Link>
           
            </MenubarTrigger>
           
          </MenubarMenu>

          {/* Cart */}
          <CartButton />
        

          {user ? (
            <>
              <UserButton 
              />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </Menubar>
  );
};

export default Navbar;
