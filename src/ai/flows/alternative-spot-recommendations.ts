// This is a server-side file.
'use server';

/**
 * @fileOverview Recommends alternative spots based on user preferences and congestion levels.
 *
 * - alternativeSpotRecommendations - A function that recommends alternative spots.
 * - AlternativeSpotRecommendationsInput - The input type for the alternativeSpotRecommendations function.
 * - AlternativeSpotRecommendationsOutput - The return type for the alternativeSpotRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlternativeSpotRecommendationsInputSchema = z.object({
  userPreferences: z
    .string()
    .describe('The user preferences, such as interest in history, nature, or food.'),
  currentLocation: z
    .string()
    .describe('The current location of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  congestionLevel: z
    .string()
    .describe('The current congestion level of the user\u2019s desired spot (e.g., low, medium, high).'),
  desiredSpotDetails: z
    .string()
    .describe('Details about the desired spot, including its category, features and average visit duration.'),
});
export type AlternativeSpotRecommendationsInput = z.infer<typeof AlternativeSpotRecommendationsInputSchema>;

const AlternativeSpotRecommendationsOutputSchema = z.object({
  alternativeSpots: z.array(
    z.object({
      name: z.string().describe('The name of the alternative spot.'),
      description: z.string().describe('A brief description of the alternative spot.'),
      distance: z.string().describe('The distance from the user\u2019s current location.'),
      travelTime: z.string().describe('The estimated travel time to the alternative spot.'),
      reviewScore: z.number().describe('The review score of the alternative spot.'),
    })
  ).describe('A list of alternative spots based on user preferences and congestion levels.'),
});
export type AlternativeSpotRecommendationsOutput = z.infer<typeof AlternativeSpotRecommendationsOutputSchema>;

export async function alternativeSpotRecommendations(
  input: AlternativeSpotRecommendationsInput
): Promise<AlternativeSpotRecommendationsOutput> {
  return alternativeSpotRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'alternativeSpotRecommendationsPrompt',
  input: {
    schema: AlternativeSpotRecommendationsInputSchema,
  },
  output: {
    schema: AlternativeSpotRecommendationsOutputSchema,
  },
  prompt: `You are an AI travel assistant for Hakodate, Japan. A user wants to visit a specific spot, but it is too crowded. Based on their preferences, location and the spot they want to visit, you will suggest alternative spots for them to visit. 

User Preferences: {{{userPreferences}}}
Current Location: {{media url=currentLocation}}
Congestion Level of Desired Spot: {{{congestionLevel}}}
Desired Spot Details: {{{desiredSpotDetails}}}

Suggest alternative spots that are similar to the desired spot but less crowded. Consider the user's preferences and current location when making your suggestions.

Output the alternative spots in JSON format. Each spot should include its name, a brief description, the distance from the user's current location, the estimated travel time, and a review score.
`,
});

const alternativeSpotRecommendationsFlow = ai.defineFlow(
  {
    name: 'alternativeSpotRecommendationsFlow',
    inputSchema: AlternativeSpotRecommendationsInputSchema,
    outputSchema: AlternativeSpotRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
