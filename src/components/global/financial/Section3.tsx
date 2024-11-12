"use client"
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Truck, 
  CreditCard, 
  Clock, 
  Shield, 
  ChevronRight, 
  Calendar,
  Users,
  FileText
} from 'lucide-react';

export default function FinancingSection() {
  const [activeTab, setActiveTab] = useState('qualify');

  const features = [
    {
      icon: CreditCard,
      title: "7 Payment Options",
      description: "Flexible payment methods including ACH automatic payments"
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Access your account and support anytime, anywhere"
    },
    {
      icon: Shield,
      title: "Custom Packages",
      description: "Financing tailored to your specific business needs"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Onsite financial and insurance managers at every location"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              In-house Semi-Truck Financing
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Arrow Truck Sales provides in-house semi-truck financing with pre-qualification available now.
            </p>
            <div className="mt-10">
              <Button 
                className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full"
              >
                Pre-Qualify Now
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-white" style={{
          clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)'
        }}/>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <feature.icon className="h-12 w-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Your Path to Financing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Pre-Qualify</h3>
              <p className="text-gray-600">Quick pre-qualification process with flexible requirements</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Choose Payment Plan</h3>
              <p className="text-gray-600">Select from 7 different payment options that fit your needs</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Get Your Truck</h3>
              <p className="text-gray-600">Drive away with a customized financing package</p>
            </div>
          </div>
        </div>

        {/* Portal Features */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Customer Portal Access</h2>
              <p className="text-gray-300 mb-6">
                Track your financing and payment plan from anywhere. Access account information, 
                update details, and manage your payments through our easy-to-use online portal.
              </p>
              <ul className="space-y-4">
                {[
                  "View balance and payoff amount",
                  "Update address and insurance information",
                  "Access 24/7 customer service",
                  "Set up automatic payments",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-5 w-5 text-red-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="bg-gray-700 h-8 w-32 rounded mb-4" />
              <div className="space-y-3">
                <div className="bg-gray-700 h-4 w-full rounded" />
                <div className="bg-gray-700 h-4 w-3/4 rounded" />
                <div className="bg-gray-700 h-4 w-5/6 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards financing your next semi-truck. Fill out our quick form 
            to see what you can expect regarding your ability to finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-red-600 hover:bg-gray-100">
              Pre-Qualify Now
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-red-500">
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}