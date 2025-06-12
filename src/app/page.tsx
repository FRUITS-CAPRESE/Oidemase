'use client';

import { useState, useTransition, useEffect } from 'react';
import { hakodateSpots } from '@/data/spots';
import type { TouristSpot, CongestionInfo, AlternativeSpot, CongestionLevel } from '@/lib/types';
import { SpotCard } from '@/components/spot-card';
import { AlternativeSpotsModal } from '@/components/alternative-spots-modal';
import { predictSpotCongestion, recommendAlternativeSpots } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardFooter } from "@/components/ui/card";

export default function HomePage() {
  const [selectedSpot, setSelectedSpot] = useState<TouristSpot | null>(null);
  const [congestionInfo, setCongestionInfo] = useState<CongestionInfo | null>(null);
  const [alternativeSpots, setAlternativeSpots] = useState<AlternativeSpot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingInitialSpots, setIsLoadingInitialSpots] = useState(true);

  const [isPredictingCongestion, startCongestionPrediction] = useTransition();
  const [isRecommendingAlternatives, startAlternativeRecommendation] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading initial spots data
    const timer = setTimeout(() => {
      setIsLoadingInitialSpots(false);
    }, 1000); // Adjust delay as needed
    return () => clearTimeout(timer);
  }, []);

  const handleSelectSpot = (spot: TouristSpot) => {
    if (selectedSpot?.id === spot.id) {
      // Deselect if clicking the same spot again
      setSelectedSpot(null);
      setCongestionInfo(null);
    } else {
      setSelectedSpot(spot);
      setCongestionInfo(null); // Clear previous congestion info
      startCongestionPrediction(async () => {
        try {
          const result = await predictSpotCongestion(spot.name);
          setCongestionInfo({
            level: result.congestionLevel.toLowerCase() as CongestionLevel,
            explanation: result.explanation,
          });
        } catch (error) {
          console.error('Error predicting congestion:', error);
          setCongestionInfo({ level: 'unknown', explanation: 'Could not fetch congestion data.' });
          toast({
            variant: "destructive",
            title: "Error",
            description: (error as Error).message || "Failed to predict congestion.",
          });
        }
      });
    }
  };

  const handleFindAlternatives = (spot: TouristSpot) => {
    if (!congestionInfo || !selectedSpot) return;

    startAlternativeRecommendation(async () => {
      try {
        const result = await recommendAlternativeSpots(
          selectedSpot.name,
          selectedSpot.detailsForAI, // Pass detailed info for AI
          congestionInfo.level
        );
        // Add placeholder images to alternatives if not present
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
            description: (error as Error).message || "Failed to find alternative spots.",
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
          Explore popular tourist spots. Click on a spot to view its details and current congestion level.
          If a spot is busy, we can suggest some great alternatives for you!
        </AlertDescription>
      </Alert>

      {isLoadingInitialSpots ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="w-full shadow-lg">
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-[120px] w-[120px] rounded-lg" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hakodateSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              congestionInfo={selectedSpot?.id === spot.id ? congestionInfo : null}
              isLoadingCongestion={selectedSpot?.id === spot.id && isPredictingCongestion}
              onSelectSpot={handleSelectSpot}
              onFindAlternatives={handleFindAlternatives}
              isSelected={selectedSpot?.id === spot.id}
              isProcessingAlternatives={selectedSpot?.id === spot.id && isRecommendingAlternatives}
            />
          ))}
        </div>
      )}

      <AlternativeSpotsModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        originalSpot={selectedSpot}
        alternatives={alternativeSpots}
      />
    </div>
  );
}
