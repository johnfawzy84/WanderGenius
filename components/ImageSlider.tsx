import React, { useState, useEffect } from 'react';

interface ImageSliderProps {
  images: string[];
  alt: string;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  const currentImageUrl = images?.[currentIndex];
  const allImagesFailed = images && images.length > 0 && failedUrls.size === images.length;

  useEffect(() => {
    if (currentImageUrl) {
        // If we already know this URL has failed, don't try to load it again.
        if (failedUrls.has(currentImageUrl)) {
            setIsLoading(false);
            setHasError(true);
        } else {
            setIsLoading(true);
            setHasError(false);
        }
    }
  }, [currentImageUrl, failedUrls]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };
  
  const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      if (currentImageUrl) {
          setFailedUrls(prev => new Set(prev).add(currentImageUrl));
      }
  };


  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  // If all images have been tried and failed, show a single fallback.
  if (allImagesFailed) {
      return (
        <div className="w-full h-48 bg-gray-700 flex flex-col items-center justify-center text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-400 text-sm mt-2">Could not load images.</span>
        </div>
      );
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }

  return (
    <div className="w-full h-48 object-cover relative group bg-gray-700">
        {/* Loading Spinner */}
        {isLoading && (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/50 border-t-white border-solid rounded-full animate-spin"></div>
            </div>
        )}

        {/* Error Message for a single slide */}
        {hasError && !allImagesFailed && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-300 text-sm">Image failed to load.</span>
            </div>
        )}

        {/* Image Tag */}
        {currentImageUrl && (
            <img 
              key={currentImageUrl} // Use key to force re-render and re-trigger load/error events on URL change
              src={currentImageUrl} 
              alt={`${alt} - slide ${currentIndex + 1}`}
              referrerPolicy="no-referrer"
              onLoad={handleLoad}
              onError={handleError}
              className={`w-full h-full object-cover ${isLoading || hasError ? 'hidden' : 'block'}`}
            />
        )}
      

      {images.length > 1 && (
        <>
          {/* Left Arrow */}
          <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 text-white text-3xl cursor-pointer bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white">
            &#10094;
          </button>
          {/* Right Arrow */}
          <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 text-white text-3xl cursor-pointer bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white">
            &#10095;
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
            <button
                key={slideIndex}
                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-300 ${currentIndex === slideIndex ? 'bg-white' : 'bg-white/50'}`}
                onClick={() => goToSlide(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
            ></button>
            ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;