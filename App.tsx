
import React, { useState, useEffect } from 'react';
import { TripFormData, TripPlan, Activity } from './types';
import { generateTripPlan, findAlternativeActivity } from './services/geminiService';
import Header from './components/Header';
import TripPlannerForm from './components/TripPlannerForm';
import TripPlanDisplay from './components/TripPlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [findingAlternativeIndex, setFindingAlternativeIndex] = useState<number | null>(null);
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('customApiKey') || '');

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

  const handleFormSubmit = async (newFormData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setTripPlan(null);
    setFormData(newFormData);

    try {
      const plan = await generateTripPlan(newFormData, customApiKey);
      setTripPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Plan your perfect day in seconds</h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Describe your ideal day out, and our AI will craft a personalized, optimized itinerary just for you.
              </p>
            </div>
            <TripPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />

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

            {tripPlan && !isLoading && (
              <TripPlanDisplay 
                plan={tripPlan} 
                onFindAlternative={handleFindAlternative}
                findingAlternativeIndex={findingAlternativeIndex}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;