import type { Icon } from 'lucide-react';

export type CongestionLevel = 'low' | 'moderate' | 'high' | 'unknown';

export interface TouristSpot {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  icon: React.ElementType; // For Lucide icons or custom SVGs
  dataAiHint?: string; // For placeholder image keyword hint
  detailsForAI: string; // For desiredSpotDetails in alternativeSpotRecommendations
}

export interface CongestionInfo {
  level: CongestionLevel;
  explanation?: string;
}

export interface AlternativeSpot {
  name: string;
  description: string;
  distance: string;
  travelTime: string;
  reviewScore: number;
  image?: string; // Add optional image for alternative spots
  dataAiHint?: string; // For placeholder image keyword hint
}
