'use server';

/**
 * @fileOverview Predicts congestion levels at different tourist spots.
 *
 * - predictCongestion - A function that predicts congestion levels for a given tourist spot.
 * - PredictCongestionInput - The input type for the predictCongestion function.
 * - PredictCongestionOutput - The return type for the predictCongestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCongestionInputSchema = z.object({
  spotName: z.string().describe('The name of the tourist spot.'),
  recentSocialMediaPosts: z
    .string()
    .describe(
      'Recent social media posts (text) about the spot.  Maximum 300 words.'
    ),
  locationData: z
    .string()
    .describe(
      'Aggregated, anonymized location data for the spot. Maximum 300 words.'
    ),
  officialAnnouncements: z
    .string()
    .describe(
      'Official announcements from the spot or related entities.  Maximum 300 words.'
    ),
  historicalData: z
    .string()
    .describe('Historical congestion data for the spot. Maximum 300 words.'),
});
export type PredictCongestionInput = z.infer<typeof PredictCongestionInputSchema>;

const PredictCongestionOutputSchema = z.object({
  congestionLevel: z
    .string()
    .describe(
      'The predicted congestion level for the spot.  Must be one of: low, moderate, high.'
    ),
  explanation: z
    .string()
    .describe('An explanation of why the congestion level is predicted.'),
});
export type PredictCongestionOutput = z.infer<typeof PredictCongestionOutputSchema>;

export async function predictCongestion(input: PredictCongestionInput): Promise<PredictCongestionOutput> {
  return predictCongestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCongestionPrompt',
  input: {schema: PredictCongestionInputSchema},
  output: {schema: PredictCongestionOutputSchema},
  prompt: `You are an AI assistant that predicts the congestion level of a tourist spot.

  Based on the following information, predict the congestion level (low, moderate, or high) and explain your reasoning.

  Spot Name: {{{spotName}}}
  Recent Social Media Posts: {{{recentSocialMediaPosts}}}
  Location Data: {{{locationData}}}
  Official Announcements: {{{officialAnnouncements}}}
  Historical Data: {{{historicalData}}}

  Respond with the congestion level and explanation.
  `,
});

const predictCongestionFlow = ai.defineFlow(
  {
    name: 'predictCongestionFlow',
    inputSchema: PredictCongestionInputSchema,
    outputSchema: PredictCongestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
