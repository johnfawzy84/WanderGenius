
import React, { useState, useEffect } from 'react';
import { TripFormData, TripPlan, Activity } from './types';
import { generateTripPlan, findAlternativeActivity, generateNextActivityOptions } from './services/geminiService';
import Header from './components/Header';
import TripPlannerForm from './components/TripPlannerForm';
import TripPlanDisplay from './components/TripPlanDisplay';
import InteractivePlanner from './components/InteractivePlanner';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [findingAlternativeIndex, setFindingAlternativeIndex] = useState<number | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('customApiKey') || '');

  // Interactive Mode State
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false);
  const [interactiveItinerary, setInteractiveItinerary] = useState<Activity[]>([]);
  const [interactiveOptions, setInteractiveOptions] = useState<Activity[]>([]);
  const [isInteractiveLoading, setIsInteractiveLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('customApiKey', customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    if (window.location.hash.startsWith('#plan=')) {
      try {
        const encodedData = window.location.hash.substring(6);
        const jsonData = atob(encodedData);
        const loadedPlan: TripPlan = JSON.parse(jsonData);
        setTripPlan(loadedPlan);
      } catch (error) {
        console.error('Failed to load shared plan from URL:', error);
        setError('Could not load the shared trip plan. The link may be invalid.');
      }
    }
  }, []);

  const fetchNextOptions = async (data: TripFormData, currentItin: Activity[]) => {
    setIsInteractiveLoading(true);
    setError(null);
    try {
      const result = await generateNextActivityOptions(data, currentItin, customApiKey);
      if (result.isEndOfDay) {
        finishInteractivePlan(data, currentItin, result.endOfDayMessage);
      } else {
        setInteractiveOptions(result.options);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch next options.');
      console.error(err);
    } finally {
      setIsInteractiveLoading(false);
    }
  };

  const handleFormSubmit = async (newFormData: TripFormData) => {
    setError(null);
    setTripPlan(null);
    setFormData(newFormData);

    if (newFormData.interactiveMode) {
      setIsInteractiveMode(true);
      setInteractiveItinerary([]);
      setInteractiveOptions([]);
      fetchNextOptions(newFormData, []);
    } else {
      setIsInteractiveMode(false);
      setIsLoading(true);
      try {
        const plan = await generateTripPlan(newFormData, customApiKey);
        setTripPlan(plan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectOption = (option: Activity) => {
    if (!formData) return;
    const newItin = [...interactiveItinerary, option];
    setInteractiveItinerary(newItin);
    fetchNextOptions(formData, newItin);
  };

  const finishInteractivePlan = (data: TripFormData, itin: Activity[], endMessage?: string) => {
    const totalCostAmount = itin.reduce((sum, act) => sum + (act.cost?.amount || 0), 0);
    const finalPlan: TripPlan = {
      tripTitle: `Your Custom Day in ${data.location}`,
      summary: endMessage || "Here is the custom itinerary you built step-by-step!",
      itinerary: itin,
      totalEstimatedCost: {
        amount: totalCostAmount,
        currency: itin[0]?.cost?.currency || 'USD',
        details: 'Estimated total for the day'
      }
    };
    setTripPlan(finalPlan);
    setIsInteractiveMode(false);
  };

  const handleFindAlternative = async (activityIndex: number) => {
    if (!tripPlan || !formData || findingAlternativeIndex !== null) return;

    setFindingAlternativeIndex(activityIndex);
    setError(null);

    try {
      const activityToReplace = tripPlan.itinerary[activityIndex];
      const newActivity = await findAlternativeActivity(formData, tripPlan, activityToReplace, activityIndex, customApiKey);

      const newItinerary = [...tripPlan.itinerary];
      newItinerary[activityIndex] = newActivity;

      // Recalculate total cost
      const newTotalCostAmount = newItinerary.reduce((sum, activity) => {
        return sum + (activity.cost?.amount || 0);
      }, 0);
      
      const updatedCost = tripPlan.totalEstimatedCost 
        ? { ...tripPlan.totalEstimatedCost, amount: newTotalCostAmount }
        : { amount: newTotalCostAmount, currency: 'USD', details: 'Estimated total for the day' };

      setTripPlan({ ...tripPlan, itinerary: newItinerary, totalEstimatedCost: updatedCost });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not find an alternative.';
      setError(`Failed to find an alternative: ${errorMessage}`);
      console.error(err);
    } finally {
      setFindingAlternativeIndex(null);
    }
  };

  const handleStartNewTrip = () => {
    setTripPlan(null);
    setFormData(null);
    setIsInteractiveMode(false);
    setInteractiveItinerary([]);
    setInteractiveOptions([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header customApiKey={customApiKey} setCustomApiKey={setCustomApiKey} />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            
            {!isInteractiveMode && !tripPlan && (
              <>
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan your perfect day in seconds</h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    Describe your ideal day out, and our AI will craft a personalized, optimized itinerary just for you.
                  </p>
                </div>
                <TripPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </>
            )}

            {isLoading && <LoadingSpinner />}
            
            {error && (
              <div className="mt-8 bg-red-900/30 border border-red-700/50 text-red-300 px-6 py-4 rounded-xl text-center backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-1 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Operation Failed
                </h3>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isInteractiveMode && (
              <InteractivePlanner 
                currentItinerary={interactiveItinerary}
                options={interactiveOptions}
                isLoading={isInteractiveLoading}
                onSelectOption={handleSelectOption}
                onFinishEarly={() => formData && finishInteractivePlan(formData, interactiveItinerary)}
              />
            )}

            {tripPlan && !isLoading && !isInteractiveMode && (
              <div className="space-y-8">
                <TripPlanDisplay 
                  plan={tripPlan} 
                  onFindAlternative={handleFindAlternative}
                  findingAlternativeIndex={findingAlternativeIndex}
                />
                
                <div className="flex justify-center pb-8">
                  <button
                    onClick={handleStartNewTrip}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:-translate-y-1 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Plan Another Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;