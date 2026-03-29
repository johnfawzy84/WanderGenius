import { GoogleGenAI, Type } from "@google/genai";
import { TripFormData, TripPlan, Activity, NextActivityResponse } from '../types';

const getAI = (customApiKey?: string) => {
  const key = customApiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY environment variable not set and no custom key provided");
  }
  return new GoogleGenAI({ apiKey: key });
};

export const generateNextActivityOptions = async (
  formData: TripFormData,
  currentItinerary: Activity[],
  customApiKey?: string
): Promise<NextActivityResponse> => {
  const ai = getAI(customApiKey);
  const { location, activityType, interests, isKidFriendly, startAddress, startTime, endTime, tripDate, likedLocationExample } = formData;
  const friendlyTripDate = tripDate === 'today' ? 'today' : new Date(tripDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `
    You are an expert travel planner. The user is planning a day trip to ${location}.
    ${startAddress ? `Starting address: ${startAddress}` : ''}
    Interests: ${interests}
    Date: ${friendlyTripDate}
    ${startTime ? `Start time: ${startTime}` : ''}
    ${endTime ? `End time/duration: ${endTime}` : ''}
    Activity Type: ${activityType}
    Kid Friendly: ${isKidFriendly ? 'Yes' : 'No'}
    ${likedLocationExample ? `Inspiration: The user likes places similar to "${likedLocationExample}".` : ''}

    Here is the itinerary so far:
    ${currentItinerary.length === 0 ? 'No activities planned yet. Suggest the FIRST activity of the day.' : JSON.stringify(currentItinerary, null, 2)}

    Based on the time of the last activity, the user's interests, and the location, suggest 3 distinct options for the NEXT activity.
    If the day is already full (e.g., it's late evening, or the requested duration is met), set 'isEndOfDay' to true and provide an 'endOfDayMessage'.

    Return the response in JSON format matching this schema:
    {
      "isEndOfDay": boolean,
      "endOfDayMessage": "string (optional)",
      "options": [
        {
          "title": "string",
          "location": "string",
          "description": "string",
          "timeOfDay": "string (e.g., 10:00 AM - 11:30 AM)",
          "cost": { "amount": number, "currency": "string", "details": "string" },
          "reviews": { "rating": number, "summary": "string" },
          "travelFromPrevious": { "mode": "string", "duration": "string" } // Omit for the first activity
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isEndOfDay: { type: Type.BOOLEAN },
            endOfDayMessage: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING },
                  timeOfDay: { type: Type.STRING },
                  cost: {
                    type: Type.OBJECT,
                    properties: {
                      amount: { type: Type.NUMBER },
                      currency: { type: Type.STRING },
                      details: { type: Type.STRING }
                    }
                  },
                  reviews: {
                    type: Type.OBJECT,
                    properties: {
                      rating: { type: Type.NUMBER },
                      summary: { type: Type.STRING }
                    }
                  },
                  travelFromPrevious: {
                    type: Type.OBJECT,
                    properties: {
                      mode: { type: Type.STRING },
                      duration: { type: Type.STRING }
                    }
                  }
                },
                required: ["title", "location", "description", "timeOfDay"]
              }
            }
          },
          required: ["isEndOfDay", "options"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating next activity options:", error);
    throw new Error("Failed to generate options. Please try again.");
  }
};

export const generateTripPlan = async (formData: TripFormData, customApiKey?: string): Promise<TripPlan> => {
  const ai = getAI(customApiKey);
  const { location, activityType, interests, isKidFriendly, startAddress, startTime, endTime, tripDate, likedLocationExample } = formData;

  const friendlyTripDate = tripDate === 'today' ? 'today' : new Date(tripDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `
    You are an expert travel planner. Create a detailed, enjoyable, and feasible 1-day itinerary based on the user's preferences.
    Your entire response MUST be a single JSON code block.

    **JSON Structure:**
    The root object should have "tripTitle", "summary", "totalEstimatedCost" (with "amount", "currency", "details"), "weather" (with "temperature", "condition", "forecast"), and an "itinerary" array.
    Each object in the "itinerary" array must have: "timeOfDay", "title", "description", "location", "latitude", "longitude", "reviews" (with "rating", "summary"), "weatherOnSite" (with "temperature", "condition"), "travelFromPrevious" (with "duration", "mode", or null), and "cost" (with "amount", "currency", "details").

    **Instructions:**
    1.  **Use Google Search for the weather forecast** for ${friendlyTripDate} in "${location}" to populate the main "weather" object.
    2.  **Generate an itinerary** based on the weather and user preferences. Adjust for rain if "mix" is chosen.
    3.  **Respect timing preferences** (startTime, endTime).
    4.  **For each activity, estimate travel time** in "travelFromPrevious".
    5.  **For each activity, use Google Search to find details**: a review summary/rating and latitude/longitude.
    6.  **For each activity, provide a specific weather forecast** in "weatherOnSite".
    7.  **For each activity, provide an estimated cost**. Provide a "cost" object with "amount", "currency" (e.g., "USD"), and "details" (e.g., "per person" or "for entry"). If an activity is free, the amount should be 0.
    8.  **Calculate and provide a "totalEstimatedCost"** object for the entire day's plan, summing up the costs of all activities.

    **User Preferences:**
    - **Location:** ${location}
    - **Date:** ${friendlyTripDate}
    ${startAddress ? `- **Start Address:** ${startAddress}` : ''}
    ${startTime ? `- **Start Time:** ${startTime}`: ''}
    ${endTime ? `- **End Time/Duration:** ${endTime}`: ''}
    - **Type:** ${activityType}
    - **Interests:** ${interests}
    - **Kid-Friendly:** ${isKidFriendly ? 'Yes' : 'No'}
    ${likedLocationExample ? `- **Inspiration:** The user likes places similar to "${likedLocationExample}". Try to capture a similar vibe or type of experience.` : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text.trim();
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    let parsedPlan: Omit<TripPlan, 'sources'>;

    if (!jsonMatch || !jsonMatch[1]) {
       try {
         parsedPlan = JSON.parse(text);
       } catch(e) {
         throw new Error("The AI returned a response in an unexpected format. Could not find or parse JSON.");
       }
    } else {
        parsedPlan = JSON.parse(jsonMatch[1]);
    }
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...parsedPlan, sources };

  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw new Error("Failed to generate trip plan. The model might be unable to fulfill the request. Please try refining your inputs.");
  }
};

export const findAlternativeActivity = async (
  formData: TripFormData,
  currentPlan: TripPlan,
  activityToReplace: Activity,
  activityIndex: number,
  customApiKey?: string
): Promise<Activity> => {
  const ai = getAI(customApiKey);
  const { location, activityType, interests, isKidFriendly, startAddress, startTime, endTime, tripDate, likedLocationExample } = formData;
  const previousActivity = activityIndex > 0 ? currentPlan.itinerary[activityIndex - 1] : null;
  const friendlyTripDate = tripDate === 'today' ? 'today' : new Date(tripDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const prompt = `
    You are an expert travel planner. A user wants an alternative for one activity.
    Your response must be a single JSON object for the new activity. The object should contain: "timeOfDay", "title", "description", "location", "latitude", "longitude", "reviews", "weatherOnSite", "travelFromPrevious", and "cost".

    **Original User Preferences:**
    - Location: ${location}, Date: ${friendlyTripDate}, Type: ${activityType}, Interests: ${interests}, Kid-Friendly: ${isKidFriendly ? 'Yes' : 'No'}
    ${startAddress ? `- Start Address: ${startAddress}` : ''} ${startTime ? `- Start Time: ${startTime}`: ''} ${endTime ? `- End Time: ${endTime}`: ''}
    ${likedLocationExample ? `- Inspiration: The user likes places similar to "${likedLocationExample}". Keep this in mind for the alternative.` : ''}
    
    ${currentPlan.weather ? `**Weather Forecast:** ${currentPlan.weather.forecast}. The new activity must be appropriate.` : ''}

    **Current Itinerary:** ${currentPlan.itinerary.map(a => a.title).join(', ')}
    **Activity to Replace:** "${activityToReplace.title}" at ${activityToReplace.timeOfDay}

    **Travel Context:**
    ${activityIndex === 0 && startAddress ? `Starts from "${startAddress}".` : previousActivity ? `Previous activity is "${previousActivity.title}".` : 'This is the first activity.'}

    **Task:** Suggest a different activity to replace "${activityToReplace.title}". It must fit the schedule, interests, and weather. Use Google Search to find its details (reviews, lat/long). Estimate travel time in "travelFromPrevious". Provide an estimated cost for this new activity in a "cost" object with "amount", "currency", and "details".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text.trim();
    let jsonText = text.startsWith('```json') ? text.match(/```json\n([\s\S]*?)\n```/)?.[1] || text : text;
    if (!jsonText) throw new Error("The AI returned an empty response.");
    
    const newActivity: Activity = JSON.parse(jsonText);
    
    return newActivity;

  } catch (error) {
    console.error("Error finding alternative activity:", error);
    throw new Error("Failed to find an alternative. The model might be unable to find a suitable replacement.");
  }
};