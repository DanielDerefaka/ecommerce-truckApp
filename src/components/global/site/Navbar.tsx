"use client";

import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, MapPin, ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import CartButton from "./Cart";

const MobileMenuItem = ({ href, children }) => (
  <Link href={href}>
    <div className="py-3 px-2 hover:bg-gray-50 rounded-md transition-colors">
      {children}
    </div>
  </Link>
);

const NavLink = ({ href, children, className = "" }) => (
  <Link 
    href={href} 
    className={`text-sm text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50 ${className}`}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { user, isLoaded } = useUser();

  const financingLinks = [
    { href: "/financing/financial-services", label: "Financial Services" },
    { href: "/financing/pre-qualify", label: "Pre-Qualify for Credit" },
    { href: "/financing/estimator", label: "Payment Estimator" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="relative w-28 lg:w-36 h-9 lg:h-10 flex-shrink-0">
            <Image
              src="/truckLogo.jpg"
              alt="Arrow Truck Sales"
              fill
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/">Home</NavLink>
            
            {/* Financing Dropdown */}
            <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="text-sm px-3 py-1.5 border-none text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer flex items-center">
                <span>Financing</span>
                <ChevronDown size={14} className="ml-1" />
              </MenubarTrigger>

              <MenubarContent className="bg-white rounded-lg shadow-lg p-1 mt-1">
                {financingLinks.map((link) => (
                  <MenubarItem key={link.href} className="text-sm px-3 py-1.5 hover:bg-gray-50 rounded-md cursor-pointer">
                    <Link href={link.href} className="w-full block">
                      {link.label}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
            </Menubar>

            <NavLink href="/services">Services</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/tracking">Tracking Product</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/user/account" 
              className="hidden sm:flex items-center text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors"
            >
              <User size={16} className="mr-2" />
              <span>Account</span>
            </Link>

            <CartButton />

            {/* User Authentication */}
            <div className="hidden sm:block">
              {isLoaded && (
                <>
                  {user ? (
                    <UserButton afterSignOutUrl="/" />
                  ) : (
                    <Link href="/sign-in">
                      <Button
                        variant="default"
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-full"
                      >
                        Login
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 h-8 w-8">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col space-y-1">
                    <MobileMenuItem href="/">Home</MobileMenuItem>
                    <div className="py-2 px-2">
                      <div className="text-sm font-medium mb-1">Financing</div>
                      <div className="ml-3 flex flex-col space-y-1">
                        {financingLinks.map((link) => (
                          <MobileMenuItem key={link.href} href={link.href}>
                            {link.label}
                          </MobileMenuItem>
                        ))}
                      </div>
                    </div>
                    <MobileMenuItem href="/services">Services</MobileMenuItem>
                    <MobileMenuItem href="/products">Products</MobileMenuItem>
                    <MobileMenuItem href="/tracking">Tracking Product</MobileMenuItem>
                    <MobileMenuItem href="/contact">Contact</MobileMenuItem>
                    
                    {/* Mobile Authentication */}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      {isLoaded && (
                        <>
                          {user ? (
                            <div className="px-2">
                              <UserButton afterSignOutUrl="/" />
                            </div>
                          ) : (
                            <Link href="/sign-in">
                              <Button
                                variant="default"
                                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm rounded-full"
                              >
                                Login
                              </Button>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;