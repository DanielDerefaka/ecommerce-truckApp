import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <div className="w-full">
      <div className="bg-red-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Section */}
            <div className="flex justify-center md:justify-start">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">A</span>
              </div>
            </div>

            {/* Explore Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Explore</h2>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us & Partners</a></li>
                <li><a href="#" className="hover:underline">Membership Program</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Resources</h2>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Promotions</a></li>
                <li><a href="#" className="hover:underline">Get a Quote</a></li>
              </ul>
            </div>
          </div>

          {/* Contact and Social Section */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="hover:opacity-80">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="hover:opacity-80">
                <ExternalLink className="w-6 h-6" />
              </a>
            </div>

            <div className="text-center md:text-right">
              <div className="font-bold">+800-311-7144</div>
              <div className="flex flex-col md:flex-row gap-2 mt-2">
                <span className="flex items-center gap-1">
                  <span className="w-5 h-5 inline-block rounded-full bg-white/20"></span>
                  United States
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-5 h-5 inline-block rounded-full bg-white/20"></span>
                  Canada
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup Bar */}
      <div className="bg-white py-4 text-center">
        <p className="text-gray-800">
          If you want to be the first to hear about special offers or news and events, be sure to{' '}
          <a href="#" className="text-red-600 hover:underline">sign up for our emails</a>.
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="bg-red-600 text-white py-4 px-4 text-sm">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-center items-center gap-4 text-center md:text-left">
          <span>© 2024 All Rights Reserved</span>
          <a href="#" className="hover:underline">Privacy Policy and Legal Notice</a>
          <a href="#" className="hover:underline">Disclaimer</a>
          <a href="#" className="hover:underline">Act Against Forced Labor Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;