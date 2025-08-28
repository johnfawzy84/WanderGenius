
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-purple-900/10 py-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            WanderGenius
          </span>
        </h1>
        <p className="text-gray-400 mt-2 text-md md:text-lg">Your AI-Powered One-Day Trip Planner</p>
      </div>
    </header>
  );
};

export default Header;
