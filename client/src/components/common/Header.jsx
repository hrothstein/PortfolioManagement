import React from 'react';

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-700">
              Portfolio Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Advisor Portal</span>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;




