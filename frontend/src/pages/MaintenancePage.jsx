import React from 'react';
import { Settings2, Clock } from 'lucide-react';

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold">
              <span className="text-gray-900 uppercase">We{"'"}re under </span><br />
              <span className="text-blue-500 uppercase">maintenance</span>
            </h1>
            <p className="text-gray-600 text-lg">
            Our website is down for maintenance. We will be back shortly.
            </p>
          </div>
          
          {/* <div className="flex items-center space-x-3">
            <button className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Read More
            </button>
          </div> */}
        </div>

        {/* Right Illustration */}
        <div className="relative">
          <div className="bg-blue-50 rounded-3xl p-8 relative">
            <div className="absolute top-4 right-4">
              <Settings2 className="w-6 h-6 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-4 w-60 bg-gray-100 rounded mb-4"></div>
              <div className="h-4 w-38 bg-gray-100 rounded mb-4"></div>
              <div className="h-4 w-40 bg-gray-100 rounded"></div>
              <div className="mt-6">
                <div className="h-2 bg-blue-500 rounded-full w-3/4 relative">
                  <div className="absolute -right-2 -top-1">
                    <div className="animate-ping absolute h-4 w-4 rounded-full bg-blue-400 opacity-75"></div>
                    <div className="relative h-3 w-3 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-4 left-8">
            <div className="w-8 h-8 bg-blue-200 rounded-lg transform rotate-45"></div>
          </div>
          <div className="absolute top-8 right-12">
            <div className="w-6 h-6 bg-blue-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaintenancePage;