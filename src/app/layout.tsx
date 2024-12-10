import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from '@vercel/analytics/next';

import {
  ClerkProvider,
  
} from '@clerk/nextjs'



export const metadata: Metadata = {
  title: "Cage Truckings",
  description: " Welcome to Cage Truckings, your premier online platform for buying and selling trucks. Our application is designed to connect truck enthusiasts, dealers, and buyers in a seamless and user-friendly environment. Whether you are looking to purchase a new vehicle or sell your existing truck, we provide the tools and resources you need to make informed decisions",
  icons: {
    icon: "/truckLogo.ico",
  },
  keywords: " cagetruckings, cage, truck sales, selling trucks, truck, sales, vehicles, ecommerce",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

  
    <html lang="en">
      <body
     
      >
      
        {children}
        <Analytics/>
        <Toaster/>
      
      
      </body>
    </html>
    </ClerkProvider>
  );
}
