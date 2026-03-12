import React, { useState } from 'react';
import { TripFormData } from '../types';

interface TripPlannerFormProps {
  onSubmit: (formData: TripFormData) => void;
  isLoading: boolean;
}

const TripPlannerForm: React.FC<TripPlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TripFormData>({
    location: '',
    startAddress: '',
    activityType: 'mix',
    interests: '',
    isKidFriendly: false,
    startTime: '09:00',
    endTime: '',
    tripDate: 'today',
    likedLocationExample: '',
  });

  const generateDateOptions = () => {
    const options: { value: string; label: string }[] = [];
    const today = new Date();
    
    // Today
    options.push({ value: 'today', label: 'Today' });
    
    // Tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    options.push({ value: tomorrow.toISOString().split('T')[0], label: 'Tomorrow' });
    
    // Next 9 days
    for (let i = 2; i <= 10; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dateValue = nextDay.toISOString().split('T')[0];
      const dateLabel = nextDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      options.push({ value: dateValue, label: dateLabel });
    }
    return options;
  };
  const dateOptions = generateDateOptions();

  // Fix: Use a type guard on `e.target` directly to allow TypeScript to correctly narrow the type.
  // The original code destructured `type`, which prevented TypeScript from correlating
  // the `type === 'checkbox'` check with the type of `e.target`, leading to a type error.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    
    if (target.type === 'checkbox' && target instanceof HTMLInputElement) {
        setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.location.trim() && formData.interests.trim()) {
      onSubmit(formData);
    } else {
      alert("Please fill in both location and interests.");
    }
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-700/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Destination
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Paris, or 'within 2 hours of London'"
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vibe & Interests
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g., history, modern art, street food, relaxing"
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="tripDate" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date
            </label>
            <select
              id="tripDate"
              name="tripDate"
              value={formData.tripDate}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="activityType" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Activity Type
            </label>
            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="mix">Mix of Indoor & Outdoor</option>
              <option value="indoor">Mainly Indoor</option>
              <option value="outdoor">Mainly Outdoor</option>
            </select>
          </div>
        </div>

        <details className="group border border-gray-700/50 rounded-xl bg-gray-900/30 overflow-hidden">
          <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Advanced Options
            </span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <div className="px-5 pb-5 pt-2 border-t border-gray-700/50 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startAddress" className="block text-xs font-medium text-gray-400 mb-1">Starting Address</label>
                <input
                  type="text"
                  id="startAddress"
                  name="startAddress"
                  value={formData.startAddress || ''}
                  onChange={handleChange}
                  placeholder="e.g., your hotel"
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="likedLocationExample" className="block text-xs font-medium text-gray-400 mb-1">Place you liked</label>
                <input
                  type="text"
                  id="likedLocationExample"
                  name="likedLocationExample"
                  value={formData.likedLocationExample || ''}
                  onChange={handleChange}
                  placeholder="e.g., Greenwich Village"
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="startTime" className="block text-xs font-medium text-gray-400 mb-1">Start Time</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg py-2 px-3 text-sm text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-xs font-medium text-gray-400 mb-1">End Time / Duration</label>
                <input
                  type="text"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime || ''}
                  onChange={handleChange}
                  placeholder="e.g., 5:00 PM or 8 hours"
                  className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg py-2 px-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="pt-2 flex items-center">
              <input
                id="isKidFriendly"
                name="isKidFriendly"
                type="checkbox"
                checked={formData.isKidFriendly}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="isKidFriendly" className="ml-2 text-sm font-medium text-gray-300">
                Kid-Friendly Itinerary
              </label>
            </div>
            
            <div className="pt-2 flex items-center">
              <input
                id="interactiveMode"
                name="interactiveMode"
                type="checkbox"
                checked={formData.interactiveMode || false}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label htmlFor="interactiveMode" className="ml-2 text-sm font-medium text-gray-300">
                Step-by-Step Interactive Mode (Choose activities one by one)
              </label>
            </div>
          </div>
        </details>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 rounded-xl py-4 px-6 shadow-lg shadow-purple-500/25 transition-all duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Crafting Your Adventure...
              </span>
            ) : 'Generate Trip Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripPlannerForm;