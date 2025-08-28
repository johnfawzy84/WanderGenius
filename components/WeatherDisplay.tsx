
import React from 'react';
import { WeatherInfo } from '../types';

interface WeatherDisplayProps {
  weather: WeatherInfo;
}

const getWeatherIcon = (condition: string): string => {
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) return '☀️';
  if (lowerCaseCondition.includes('cloud')) return '☁️';
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower')) return '🌧️';
  if (lowerCaseCondition.includes('snow')) return '❄️';
  if (lowerCaseCondition.includes('storm') || lowerCaseCondition.includes('thunder')) return '⛈️';
  if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog')) return '🌫️';
  return '🌍'; // Default icon
};

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  return (
    <div className="mb-8 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-200">Weather Forecast</h3>
        <p className="text-gray-400 text-sm">{weather.forecast}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center space-x-3">
            <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
            <div>
                <p className="text-2xl font-bold text-white">{weather.temperature}</p>
                <p className="text-sm text-gray-400">{weather.condition}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;