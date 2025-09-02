
import React, { useState } from 'react';
import { TripPlan, Activity } from '../types';
import MapDisplay from './MapDisplay';
import WeatherDisplay from './WeatherDisplay';
import StarRating from './StarRating';

interface TripPlanDisplayProps {
  plan: TripPlan;
  onFindAlternative: (index: number) => void;
  findingAlternativeIndex: number | null;
}

const getWeatherIcon = (condition?: string): string => {
  if (!condition) {
    return '🌍'; // Default icon
  }
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) return '☀️';
  if (lowerCaseCondition.includes('cloud')) return '☁️';
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower')) return '🌧️';
  if (lowerCaseCondition.includes('snow')) return '❄️';
  if (lowerCaseCondition.includes('storm') || lowerCaseCondition.includes('thunder')) return '⛈️';
  if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog')) return '🌫️';
  return '🌍'; // Default icon
};

const ActivityCard: React.FC<{ 
  activity: Activity, 
  index: number,
  onFindAlternative: (index: number) => void;
  isFindingAlternative: boolean;
}> = ({ activity, index, onFindAlternative, isFindingAlternative }) => {
    return (
        <div className="bg-gray-800/60 rounded-lg shadow-lg transition-transform duration-300 hover:scale-102 hover:shadow-xl border border-gray-700/50">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white pr-4">{activity.title}</h3>
                    <div className="text-right flex-shrink-0">
                        <span className="text-sm font-semibold bg-gray-700 text-purple-300 py-1 px-3 rounded-full whitespace-nowrap">{activity.timeOfDay}</span>
                        {activity.weatherOnSite && (
                            <div className="mt-2 flex items-center justify-end space-x-2 text-gray-300">
                                <span className="text-lg" title={activity.weatherOnSite.condition}>{getWeatherIcon(activity.weatherOnSite.condition)}</span>
                                <span className="font-semibold">{activity.weatherOnSite.temperature}</span>
                            </div>
                        )}
                    </div>
                </div>
                {activity.location && (
                    <p className="text-sm text-gray-400 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {activity.location}
                    </p>
                )}
                <p className="text-gray-300 leading-relaxed mb-4">{activity.description}</p>
                
                {activity.cost && (
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-300">
                            <span className="text-purple-400">Est. Cost: </span>
                            {activity.cost.amount > 0 ? 
                                `${new Intl.NumberFormat('en-US', { style: 'currency', currency: activity.cost.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(activity.cost.amount)}` 
                                : 'Free'}
                            {activity.cost.details && <span className="text-gray-400 font-normal ml-2">({activity.cost.details})</span>}
                        </p>
                    </div>
                )}

                {activity.reviews && (
                    <div className="mb-4">
                        {typeof activity.reviews.rating === 'number' && (
                            <div className="flex items-center space-x-2">
                                <StarRating rating={activity.reviews.rating} />
                                <span className="text-sm font-bold text-white">{activity.reviews.rating.toFixed(1)} / 5</span>
                            </div>
                        )}
                        {activity.reviews.summary && (
                            <p className="text-sm text-gray-400 mt-1 italic">"{activity.reviews.summary}"</p>
                        )}
                    </div>
                )}


                <div className="pt-4 border-t border-gray-700 flex justify-end">
                    <button 
                      onClick={() => onFindAlternative(index)}
                      disabled={isFindingAlternative}
                      className="inline-flex items-center justify-center text-sm font-medium text-purple-300 hover:text-white bg-purple-900/30 hover:bg-purple-800/50 rounded-md px-3 py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait"
                    >
                      {isFindingAlternative ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Searching...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l5 5M20 20l-5-5" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10V4h6M20 14v6h-6" />
                          </svg>
                          Find Alternative
                        </>
                      )}
                    </button>
                </div>
            </div>
        </div>
    );
};


const TripPlanDisplay: React.FC<TripPlanDisplayProps> = ({ plan, onFindAlternative, findingAlternativeIndex }) => {
  const [copyStatus, setCopyStatus] = useState('');

  const locationsWithCoords = plan.itinerary.filter(
    (activity): activity is Activity & { latitude: number; longitude: number; } =>
      typeof activity.latitude === 'number' && typeof activity.longitude === 'number'
  );

  const handleShare = async () => {
    setCopyStatus('');
    const planJson = JSON.stringify(plan);
    const encodedPlan = btoa(planJson);
    const shareUrl = `${window.location.origin}${window.location.pathname}#plan=${encodedPlan}`;

    const shareData = {
      title: `My Trip: ${plan.tripTitle}`,
      text: `Check out this 1-day trip plan for ${plan.tripTitle}!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopyStatus('Link copied to clipboard!');
        setTimeout(() => setCopyStatus(''), 3000);
      } catch (err) {
        console.error("Failed to copy link:", err);
        setCopyStatus('Failed to copy link.');
        setTimeout(() => setCopyStatus(''), 3000);
      }
    }
  };

  return (
    <div id="trip-plan-display" className="mt-10 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
          {plan.tripTitle}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">{plan.summary}</p>
        <div className="mt-4">
            <button
                onClick={handleShare}
                className="inline-flex items-center justify-center text-sm font-medium text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 rounded-md px-4 py-2 transition-all duration-200"
                aria-label="Share this trip plan"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share Trip
            </button>
            {copyStatus && (
                <p className="text-sm text-green-400 mt-2 transition-opacity duration-300" role="status">
                {copyStatus}
                </p>
            )}
        </div>
      </div>

      {plan.totalEstimatedCost && (
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 text-center">
          <h3 className="font-bold text-lg text-purple-300 uppercase tracking-wider">Total Estimated Cost</h3>
          <p className="text-3xl font-bold text-white mt-1">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.totalEstimatedCost.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(plan.totalEstimatedCost.amount)}
          </p>
          {plan.totalEstimatedCost.details && (
            <p className="text-gray-400 text-sm mt-1">{plan.totalEstimatedCost.details}</p>
          )}
        </div>
      )}

      {plan.weather && <WeatherDisplay weather={plan.weather} />}

      {locationsWithCoords.length > 0 && (
        <div className="my-8 rounded-lg overflow-hidden shadow-xl border border-gray-700">
          <MapDisplay locations={locationsWithCoords} />
        </div>
      )}

      <div>
        {plan.itinerary.map((activity, index) => (
            <React.Fragment key={index}>
              {/* Travel Connector */}
              {activity.travelFromPrevious && (
                <div className="relative h-24">
                  <div className="absolute left-4 top-0 w-0.5 h-full bg-gray-700"></div>
                  <div className="relative top-1/2 -translate-y-1/2 pl-12 flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="bg-gray-800 px-3 py-1 rounded-md">
                        <p className="font-semibold text-gray-300">{activity.travelFromPrevious.duration}</p>
                        <p className="text-xs text-gray-400">{activity.travelFromPrevious.mode}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Node */}
              <div className="relative">
                <div className="absolute left-0 top-5 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center ring-4 ring-gray-900">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                </div>
                <div className="ml-12">
                    <ActivityCard 
                        activity={activity} 
                        index={index}
                        onFindAlternative={onFindAlternative}
                        isFindingAlternative={findingAlternativeIndex === index}
                    />
                </div>
              </div>
            </React.Fragment>
        ))}
      </div>
      
      {plan.sources && plan.sources.length > 0 && (
        <div className="mt-12 pt-6 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-gray-300 mb-3 text-center">Sources</h4>
          <ul className="text-center space-y-2">
            {plan.sources.map((source, index) => (
              // Fix: Added a check for `source.web.uri` to prevent runtime errors.
              // Since `source.web` is now optional in the `GroundingChunk` type, this ensures
              // we only render sources that have a valid web link.
              source.web?.uri && (
              <li key={index}>
                <a 
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate"
                  title={source.web.title || source.web.uri}
                >
                  {source.web.title || source.web.uri}
                </a>
              </li>
              )
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
        }
        .hover\\:scale-102:hover {
            transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default TripPlanDisplay;