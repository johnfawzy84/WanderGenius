import React from 'react';
import { Activity } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface Props {
  currentItinerary: Activity[];
  options: Activity[];
  isLoading: boolean;
  onSelectOption: (option: Activity) => void;
  onFinishEarly: () => void;
}

const InteractivePlanner: React.FC<Props> = ({ currentItinerary, options, isLoading, onSelectOption, onFinishEarly }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Show current itinerary summary */}
      {currentItinerary.length > 0 && (
        <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Your Day So Far</h3>
          <div className="space-y-4">
            {currentItinerary.map((act, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                <div>
                  <p className="font-semibold text-white">{act.title}</p>
                  <p className="text-sm text-gray-400">{act.timeOfDay} • {act.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show options or loading */}
      <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-white text-center">
          {currentItinerary.length === 0 ? "Choose your first activity" : "What's next?"}
        </h3>

        {isLoading ? (
          <div className="py-8">
            <LoadingSpinner />
            <p className="text-center text-purple-300 mt-4 animate-pulse">Finding the best options for you...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((opt, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-700 hover:border-purple-500/50 rounded-xl p-5 flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
                <h4 className="font-bold text-lg text-white mb-2 group-hover:text-purple-300 transition-colors">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opt.title + (opt.location ? ' ' + opt.location : ''))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    title="View on Google Maps"
                  >
                    {opt.title}
                  </a>
                </h4>
                <p className="text-sm font-medium text-purple-400 mb-3 bg-purple-900/30 inline-block px-2 py-1 rounded-md self-start">{opt.timeOfDay}</p>
                
                {opt.reviews && typeof opt.reviews.rating === 'number' && (
                  <div className="flex items-center mb-3 bg-gray-800/50 rounded-lg p-1.5 border border-gray-700/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-white">{opt.reviews.rating.toFixed(1)}</span>
                    {opt.reviews.summary && <span className="text-xs text-gray-400 ml-2 italic truncate" title={opt.reviews.summary}>"{opt.reviews.summary}"</span>}
                  </div>
                )}

                <p className="text-sm text-gray-300 mb-4 flex-grow leading-relaxed">{opt.description}</p>
                
                <div className="space-y-2 mb-5">
                  {opt.location && (
                    <p className="text-xs text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opt.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 hover:underline truncate"
                        title="View on Google Maps"
                      >
                        {opt.location}
                      </a>
                    </p>
                  )}
                  {opt.travelFromPrevious && (
                    <p className="text-xs text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {opt.travelFromPrevious.duration} via {opt.travelFromPrevious.mode}
                    </p>
                  )}
                  {opt.cost && (
                    <p className="text-xs text-green-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {opt.cost.amount > 0 ? `${opt.cost.currency} ${opt.cost.amount}` : 'Free'}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onSelectOption(opt)}
                  className="w-full py-2.5 bg-gray-800 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors border border-gray-700 hover:border-purple-500"
                >
                  Select this
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentItinerary.length > 0 && !isLoading && (
        <div className="text-center pt-4">
          <button
            onClick={onFinishEarly}
            className="text-gray-400 hover:text-white underline text-sm transition-colors"
          >
            End the day here and finalize plan
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractivePlanner;
