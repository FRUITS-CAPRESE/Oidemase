import { config } from 'dotenv';
config();

import '@/ai/flows/congestion-prediction.ts';
import '@/ai/flows/similarity-judgment.ts';
import '@/ai/flows/alternative-spot-recommendations.ts';