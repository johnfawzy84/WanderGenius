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
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Paris, or 'within 2 hours of London'"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="startAddress" className="block text-sm font-medium text-gray-300 mb-2">
            Starting Address (Optional)
          </label>
          <input
            type="text"
            id="startAddress"
            name="startAddress"
            value={formData.startAddress || ''}
            onChange={handleChange}
            placeholder="e.g., your hotel or home address"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-2">
            Interests & Vibe
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g., history, modern art, street food, relaxing"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="likedLocationExample" className="block text-sm font-medium text-gray-300 mb-2">
            Example of a place you liked (Optional)
          </label>
          <input
            type="text"
            id="likedLocationExample"
            name="likedLocationExample"
            value={formData.likedLocationExample || ''}
            onChange={handleChange}
            placeholder="e.g., 'The relaxed vibe of Greenwich Village'"
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
          />
        </div>

        <div>
          <label htmlFor="tripDate" className="block text-sm font-medium text-gray-300 mb-2">
            Date of Trip
          </label>
          <select
            id="tripDate"
            name="tripDate"
            value={formData.tripDate}
            onChange={handleChange}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-2">
              Start Time (Optional)
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime || ''}
              onChange={handleChange}
              className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-300 mb-2">
              End Time / Duration (Optional)
            </label>
            <input
              type="text"
              id="endTime"
              name="endTime"
              value={formData.endTime || ''}
              onChange={handleChange}
              placeholder="e.g., 5:00 PM or 8 hours"
              className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="activityType" className="block text-sm font-medium text-gray-300 mb-2">
              Activity Type
            </label>
            <select
              id="activityType"
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="w-full bg-gray-900/70 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            >
              <option value="mix">Mix of Indoor & Outdoor</option>
              <option value="indoor">Mainly Indoor</option>
              <option value="outdoor">Mainly Outdoor</option>
            </select>
          </div>
          <div className="flex items-center justify-center md:pt-6">
            <div className="flex items-center h-5">
              <input
                id="isKidFriendly"
                name="isKidFriendly"
                type="checkbox"
                checked={formData.isKidFriendly}
                onChange={handleChange}
                className="focus:ring-blue-500 h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isKidFriendly" className="font-medium text-gray-300">
                Kid-Friendly?
              </label>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 rounded-lg py-3 px-5 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Crafting Your Adventure...' : 'Generate Trip Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripPlannerForm;