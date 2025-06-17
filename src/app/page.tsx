
'use client';

import { useState, useTransition, useEffect } from 'react';
import { hakodateSpots } from '@/data/spots';
import type { TouristSpot, CongestionInfo, AlternativeSpot, CongestionLevel } from '@/lib/types';
import { SpotCard } from '@/components/spot-card';
import { AlternativeSpotsModal } from '@/components/alternative-spots-modal';
import { predictSpotCongestion, recommendAlternativeSpots } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { CongestionHeatmap } from '@/components/congestion-heatmap';

// Helper function to generate a more user-friendly API error message
const getApiErrorMessage = (error: unknown): string => {
  const defaultUserMessage = "Failed to process your request. Please try again.";
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes("service unavailable") || message.includes("overloaded") || message.includes("503")) {
      return "The AI service is temporarily busy. Please try again in a few moments.";
    }
    // Return a generic message for other errors to avoid exposing too many technical details,
    // but keep the original error.message if it's short and potentially informative.
    return error.message.length > 100 ? defaultUserMessage : error.message;
  }
  return defaultUserMessage;
};


export default function HomePage() {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [congestionInfo, setCongestionInfo] = useState<CongestionInfo | null>(null);
  const [alternativeSpots, setAlternativeSpots] = useState<AlternativeSpot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [allSpotsCongestionData, setAllSpotsCongestionData] = useState<Record<string, CongestionInfo | null>>({});
  const [isLoadingMapData, setIsLoadingMapData] = useState(true);

  const [isPredictingCongestion, startCongestionPrediction] = useTransition();
  const [isRecommendingAlternatives, startAlternativeRecommendation] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    const fetchAllCongestion = async () => {
      setIsLoadingMapData(true);
      const promises = hakodateSpots.map(async (spot) => {
        try {
          const result = await predictSpotCongestion(spot.name);
          return {
            spotId: spot.id,
            congestion: {
              level: result.congestionLevel.toLowerCase() as CongestionLevel,
              explanation: result.explanation,
            },
          };
        } catch (error) {
          console.error(`Error fetching congestion for ${spot.name}:`, error);
          return {
            spotId: spot.id,
            congestion: { level: 'unknown', explanation: `Failed to load data for ${spot.name}.` } as CongestionInfo,
          };
        }
      });

      const results = await Promise.all(promises);
      const newCongestionData: Record<string, CongestionInfo | null> = {};
      results.forEach(item => {
        newCongestionData[item.spotId] = item.congestion;
      });
      setAllSpotsCongestionData(newCongestionData);
      setIsLoadingMapData(false);
    };

    if (hakodateSpots.length > 0) {
      fetchAllCongestion();
    } else {
      setIsLoadingMapData(false); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSelectSpot = (spot: TouristSpot) => {
    if (selectedSpot?.id === spot.id) {
      setSelectedSpot(null);
      setCongestionInfo(null);
    } else {
      setSelectedSpot(spot);
      // Use pre-fetched data if available, otherwise fetch
      const preFetchedCongestion = allSpotsCongestionData[spot.id];
      if (preFetchedCongestion && preFetchedCongestion.level !== 'unknown') {
        setCongestionInfo(preFetchedCongestion);
      } else {
        setCongestionInfo(null); 
        startCongestionPrediction(async () => {
          try {
            const result = await predictSpotCongestion(spot.name);
            const newInfo = {
              level: result.congestionLevel.toLowerCase() as CongestionLevel,
              explanation: result.explanation,
            };
            setCongestionInfo(newInfo);
            // Update the allSpotsCongestionData as well
            setAllSpotsCongestionData(prev => ({...prev, [spot.id]: newInfo}));
          } catch (error) {
            console.error('Error predicting congestion for selected spot:', error);
            const errorInfo = { level: 'unknown', explanation: 'Could not fetch congestion data.' } as CongestionInfo;
            setCongestionInfo(errorInfo);
            setAllSpotsCongestionData(prev => ({...prev, [spot.id]: errorInfo}));
            toast({
              variant: "destructive",
              title: "Error",
              description: getApiErrorMessage(error),
            });
          }
        });
      }
    }
  };

  const handleFindAlternatives = (spot: TouristSpot) => {
    if (!congestionInfo || !selectedSpot) return;

    startAlternativeRecommendation(async () => {
      try {
        const result = await recommendAlternativeSpots(
          selectedSpot.name,
          selectedSpot.detailsForAI, 
          congestionInfo.level
        );
        const alternativesWithImages = result.alternativeSpots.map(alt => ({
          ...alt,
          image: alt.image || `https://placehold.co/400x300.png`,
          dataAiHint: alt.dataAiHint || 'travel spot'
        }));
        setAlternativeSpots(alternativesWithImages);
        setIsModalOpen(true);
      } catch (error) {
        console.error('Error recommending alternatives:', error);
        setAlternativeSpots([]);
        toast({
            variant: "destructive",
            title: "Error",
            description: getApiErrorMessage(error),
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-headline">Welcome to Hakodate!</AlertTitle>
        <AlertDescription>
          Explore popular tourist spots. View the congestion map below or click on an individual spot to view its details and current congestion level.
          If a spot is busy, we can suggest some great alternatives for you!
        </AlertDescription>
      </Alert>

      <CongestionHeatmap
        spots={hakodateSpots}
        congestionData={allSpotsCongestionData}
        isLoading={isLoadingMapData}
      />
      
      <div>
        <h2 className="text-2xl font-headline font-semibold mt-10 mb-6 text-center md:text-left">Or Explore Individual Spots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hakodateSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              congestionInfo={selectedSpot?.id === spot.id ? congestionInfo : (allSpotsCongestionData[spot.id] || null)}
              isLoadingCongestion={selectedSpot?.id === spot.id && isPredictingCongestion}
              onSelectSpot={handleSelectSpot}
              onFindAlternatives={handleFindAlternatives}
              isSelected={selectedSpot?.id === spot.id}
              isProcessingAlternatives={selectedSpot?.id === spot.id && isRecommendingAlternatives}
            />
          ))}
        </div>
      </div>

      <AlternativeSpotsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        originalSpot={selectedSpot}
        alternatives={alternativeSpots}
      />
    </div>
  );
}
