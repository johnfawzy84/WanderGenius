
import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

interface HeaderProps {
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
}

import { verifyApiKey } from '../services/geminiService';

const Header: React.FC<HeaderProps> = ({ customApiKey, setCustomApiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAiStudio, setHasAiStudio] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setTempApiKey(customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
      setHasAiStudio(true);
    }
  }, []);

  const handleAiStudioKey = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md shadow-lg shadow-purple-900/10 py-4 sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
              <circle cx="12" cy="9" r="2.5"></circle>
              <path d="M12 22v-3"></path>
              <path d="M9 19h6"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                WanderGenius
              </span>
            </h1>
            <p className="text-xs text-gray-400 hidden sm:block">AI One-Day Trip Planner</p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs md:text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-md border border-gray-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-left">
              <h3 className="text-white font-semibold mb-3">API Configuration</h3>
              
              {hasAiStudio ? (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Use your Google AI Studio account key:</p>
                  <button
                    onClick={handleAiStudioKey}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 px-4 rounded transition-colors"
                  >
                    Select API Key
                  </button>
                </div>
              ) : null}

              <div>
                <label className="block text-xs text-gray-400 mb-1">Custom Gemini API Key</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="password"
                    value={tempApiKey}
                    onChange={(e) => {
                      setTempApiKey(e.target.value);
                      setVerificationStatus('idle');
                    }}
                    placeholder="AIzaSy..."
                    className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={async () => {
                      if (!tempApiKey) {
                        setCustomApiKey('');
                        setVerificationStatus('idle');
                        return;
                      }
                      setIsVerifying(true);
                      setVerificationStatus('idle');
                      const isValid = await verifyApiKey(tempApiKey);
                      if (isValid) {
                        setCustomApiKey(tempApiKey);
                        setVerificationStatus('success');
                      } else {
                        setVerificationStatus('error');
                      }
                      setIsVerifying(false);
                    }}
                    disabled={isVerifying}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm py-2 px-3 rounded transition-colors whitespace-nowrap"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify & Save'}
                  </button>
                </div>
                {verificationStatus === 'success' && (
                  <p className="text-xs text-green-400 mt-1">API Key is valid and saved!</p>
                )}
                {verificationStatus === 'error' && (
                  <p className="text-xs text-red-400 mt-1">Invalid API Key. Please check and try again.</p>
                )}
                <p className="text-[10px] text-gray-500 mt-1">
                  Stored locally in your browser. Leave empty to use the default key.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
