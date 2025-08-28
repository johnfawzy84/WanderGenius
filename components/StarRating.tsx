
import React from 'react';

interface StarRatingProps {
  rating: number;
}

const Star: React.FC<{ type: 'full' | 'half' | 'empty' }> = ({ type }) => {
  const fullStarPath = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

  if (type === 'half') {
      return (
          <div className="relative inline-block">
              {/* Background empty star */}
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath}></path></svg>
              {/* Foreground clipped full star */}
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d={fullStarPath}></path></svg>
              </div>
          </div>
      );
  }

  return (
    <svg className={`w-5 h-5 ${type === 'full' ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d={fullStarPath}></path>
    </svg>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} type="full" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<Star key={i} type="half" />);
    } else {
      stars.push(<Star key={i} type="empty" />);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;
