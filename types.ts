export interface TripFormData {
  location: string;
  startAddress?: string;
  activityType: 'indoor' | 'outdoor' | 'mix';
  interests: string;
  isKidFriendly: boolean;
  startTime?: string;
  endTime?: string;
  tripDate: string;
}

export interface Activity {
  timeOfDay: string;
  title: string;
  description: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  travelFromPrevious?: {
    duration: string;
    mode: string;
  };
  generatedImageUrl?: string;
  reviews?: {
    rating: number | null;
    summary: string;
  };
  weatherOnSite?: {
    temperature: string;
    condition: string;
  };
}

export interface WeatherInfo {
  temperature: string;
  condition: string;
  forecast: string;
}

// Fix: Made `uri` and `title` optional to align with the Gemini API's `GroundingChunkWeb` type.
// The error indicates that the `uri` from the API response is optional, so this change makes the local type compatible.
export interface WebSource {
  uri?: string;
  title?: string;
}

// Fix: Made `web` optional to align with the Gemini API's `GroundingChunk` type.
// The error indicates that the `web` property from the API response is optional, which caused a type mismatch.
export interface GroundingChunk {
  web?: WebSource;
}

export interface TripPlan {
  tripTitle: string;
  summary: string;
  itinerary: Activity[];
  weather?: WeatherInfo;
  sources?: GroundingChunk[];
}