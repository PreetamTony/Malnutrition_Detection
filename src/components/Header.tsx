import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-blue-700 text-white">
      {/* Background image with overlay */}
     
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24 md:h-32">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <img 
                  src="https://i.postimg.cc/50F6wvdG/32e3c223-bb41-4098-907f-99ed21e2437a.png" 
                  alt="NutriSight Logo" 
                  className="h-12 w-12 object-cover rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  NutriSight
                </h1>
                <p className="text-blue-100 text-sm md:text-base">AI-Powered Malnutrition Detection</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Activity className="h-4 w-4 text-blue-200" />
              <span className="text-blue-100">Powered by AI✨</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;