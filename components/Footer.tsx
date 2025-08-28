
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 mt-12 py-6 text-center text-gray-500">
      <p>Powered by Gemini AI</p>
      <p>WanderGenius &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;
