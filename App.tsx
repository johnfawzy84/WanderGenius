
import React, { useState } from 'react';
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

  const handleFormSubmit = async (newFormData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    setTripPlan(null);
    setFormData(newFormData);

    try {
      const plan = await generateTripPlan(newFormData);
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
      const newActivity = await findAlternativeActivity(formData, tripPlan, activityToReplace, activityIndex);

      const newItinerary = [...tripPlan.itinerary];
      newItinerary[activityIndex] = newActivity;

      setTripPlan({ ...tripPlan, itinerary: newItinerary });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Could not find an alternative.';
      setError(`Failed to find an alternative: ${errorMessage}`);
      console.error(err);
    } finally {
      setFindingAlternativeIndex(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-lg text-gray-400 mb-8">
            Describe your ideal day out, and our AI will craft a personalized itinerary just for you.
          </p>
          <TripPlannerForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <h3 className="font-bold">Operation Failed</h3>
              <p>{error}</p>
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
  );
};

export default App;