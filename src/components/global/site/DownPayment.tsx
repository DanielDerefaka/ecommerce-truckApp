
"use client"
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Calculator, 
  Clock, 
  HeadphonesIcon, 
  CheckCircle2, 
  DollarSign,
  PhoneCall,
  BadgeCheck,
  Clock4
} from 'lucide-react';
import Image from 'next/image';

const DownPaymentEstimator = () => {
  const [truckPrice, setTruckPrice] = useState('75000');
  const [creditScore, setCreditScore] = useState('650');

  const calculateDownPayment = () => {
    const price = parseInt(truckPrice);
    const score = parseInt(creditScore);
    let percentage = 10; // Base percentage

    if (score >= 700) percentage = 10;
    else if (score >= 650) percentage = 15;
    else percentage = 20;

    return (price * (percentage / 100)).toFixed(2);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Truck Price ($)</label>
          <Input 
            type="number" 
            value={truckPrice} 
            onChange={(e) => setTruckPrice(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Credit Score</label>
          <Input 
            type="number" 
            value={creditScore} 
            onChange={(e) => setCreditScore(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">Estimated Down Payment</p>
          <p className="text-3xl font-bold text-red-600">
            ${calculateDownPayment()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default function TruckLoansSection() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-6">Semi-Truck Loans</h1>
              <p className="text-xl mb-8">
                Fast qualification, flexible financing, and exceptional support for your semi-truck purchase.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500" />
                  <span>Faster loan qualification process</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500" />
                  <span>On-site financing professionals</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-red-500" />
                  <span>7 flexible payment options</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 p-8 rounded-2xl">
              <h3 className="text-xl font-semibold mb-6">Down Payment Estimator</h3>
              <DownPaymentEstimator />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Clock4 className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Faster Qualification</h3>
            <p className="text-gray-600">
              Specialized in semi-truck financing with quick, streamlined qualification process designed for owner-operators.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BadgeCheck className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Flexible Financing</h3>
            <p className="text-gray-600">
              Choose from 7 different payment options including ACH automatic payments for your convenience.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <HeadphonesIcon className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
            <p className="text-gray-600">
              Access account information and support services any time, day or night.
            </p>
          </Card>
        </div>
      </div>

      {/* Online Portal Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Manage Your Loan Online
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">View Balance & Payments</h3>
                    <p className="text-gray-600">Check your current balance and payment history anytime</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Calculator className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Payment Calculator</h3>
                    <p className="text-gray-600">Calculate your payments and plan your budget</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">24/7 Access</h3>
                    <p className="text-gray-600">Update information and manage your account any time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
             
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-2xl text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Loan Application?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Speak with our financing professionals today and get the guidance you need 
            for your semi-truck purchase.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-red-600 hover:bg-gray-100">
              Get Pre-Qualified
            </Button>
            <Button className="bg-transparent border-2 border-white hover:bg-red-500">
              <PhoneCall className="h-5 w-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
