'use server';

import { predictCongestion as predictCongestionFlow, type PredictCongestionInput, type PredictCongestionOutput } from '@/ai/flows/congestion-prediction';
import { alternativeSpotRecommendations as alternativeSpotRecommendationsFlow, type AlternativeSpotRecommendationsInput, type AlternativeSpotRecommendationsOutput } from '@/ai/flows/alternative-spot-recommendations';
import type { CongestionLevel } from '@/lib/types';

// Placeholder data URI for a 1x1 transparent PNG
const PLACEHOLDER_LOCATION_IMAGE_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export async function predictSpotCongestion(spotName: string): Promise<PredictCongestionOutput> {
  const input: PredictCongestionInput = {
    spotName,
    // Mocking other inputs as they are not readily available in this UI-focused example
    recentSocialMediaPosts: `Lots of people at ${spotName} today! #hakodate`,
    locationData: `High density of devices detected around ${spotName} coordinates.`,
    officialAnnouncements: `No special events announced for ${spotName} currently.`,
    historicalData: `${spotName} is usually busy on weekend afternoons.`,
  };
  try {
    return await predictCongestionFlow(input);
  } catch (error) {
    console.error("Error predicting congestion:", error);
    // Return a default error state or rethrow
    throw new Error("Failed to predict congestion. Please try again.");
  }
}

export async function recommendAlternativeSpots(
  desiredSpotName: string,
  desiredSpotDetails: string,
  currentCongestion: CongestionLevel
): Promise<AlternativeSpotRecommendationsOutput> {
  const input: AlternativeSpotRecommendationsInput = {
    userPreferences: 'Interested in scenic views, historical sites, and local food experiences.', // Mocked user preferences
    currentLocation: PLACEHOLDER_LOCATION_IMAGE_URI, 
    congestionLevel: currentCongestion,
    desiredSpotDetails: `${desiredSpotDetails} Current congestion: ${currentCongestion}.`,
  };
  try {
    return await alternativeSpotRecommendationsFlow(input);
  } catch (error) {
    console.error("Error recommending alternative spots:", error);
    // Return a default error state or rethrow
    throw new Error("Failed to recommend alternative spots. Please try again.");
  }
}
