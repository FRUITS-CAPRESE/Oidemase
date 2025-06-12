
'use client';

import Image from 'next/image';
import type { TouristSpot, CongestionInfo, CongestionLevel } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface SpotCardProps {
  spot: TouristSpot;
  congestionInfo: CongestionInfo | null;
  isLoadingCongestion: boolean;
  onSelectSpot: (spot: TouristSpot) => void;
  onFindAlternatives: (spot: TouristSpot) => void;
  isSelected: boolean;
  isProcessingAlternatives: boolean;
}

const getCongestionBadgeVariant = (level: CongestionLevel): 'default' | 'secondary' | 'destructive' => {
  switch (level) {
    case 'low':
      return 'default'; // Greenish in default theme, or map to a specific color
    case 'moderate':
      return 'secondary'; // Yellowish/Orangeish
    case 'high':
      return 'destructive'; // Reddish
    default:
      return 'outline';
  }
};

const getCongestionColorClass = (level: CongestionLevel): string => {
  switch (level) {
    case 'low':
      return 'bg-green-500 text-white';
    case 'moderate':
      return 'bg-yellow-500 text-black';
    case 'high':
      return 'bg-red-600 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
}

export function SpotCard({
  spot,
  congestionInfo,
  isLoadingCongestion,
  onSelectSpot,
  onFindAlternatives,
  isSelected,
  isProcessingAlternatives,
}: SpotCardProps) {
  const SpotIcon = spot.icon;

  return (
    <Card className={`w-full shadow-lg transition-all duration-300 ease-in-out ${isSelected ? 'ring-2 ring-primary shadow-xl' : 'hover:shadow-md'}`}>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <div className="flex-shrink-0">
          <Image
            src={spot.image}
            alt={spot.name}
            width={120}
            height={120}
            className="rounded-lg object-cover aspect-square"
            data-ai-hint={spot.dataAiHint}
          />
        </div>
        <div className="flex-grow">
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <SpotIcon className="h-6 w-6 text-primary" />
            {spot.name}
          </CardTitle>
          <CardDescription className="text-sm mt-1">{spot.category}</CardDescription>
          {isSelected && congestionInfo && (
            <div className="mt-2">
              <Badge className={`${getCongestionColorClass(congestionInfo.level)} font-semibold`}>
                Congestion: {congestionInfo.level.charAt(0).toUpperCase() + congestionInfo.level.slice(1)}
              </Badge>
              {congestionInfo.explanation && (
                <p className="text-xs text-muted-foreground mt-1">{congestionInfo.explanation}</p>
              )}
            </div>
          )}
          {isSelected && isLoadingCongestion && (
             <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking congestion...
            </div>
          )}
        </div>
      </CardHeader>
      {isSelected && (
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-foreground/80">{spot.description}</p>
        </CardContent>
      )}
      <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <Button 
          onClick={() => onSelectSpot(spot)} 
          variant={isSelected ? "secondary" : "default"}
          className="w-full sm:w-auto flex-grow"
          disabled={isLoadingCongestion}
        >
          {isSelected ? 'Hide Details' : 'View Details & Congestion'}
        </Button>
        {isSelected && (congestionInfo?.level === 'moderate' || congestionInfo?.level === 'high') && (
          <Button 
            onClick={() => onFindAlternatives(spot)} 
            variant="outline"
            className="w-full sm:w-auto flex-grow"
            disabled={isProcessingAlternatives}
          >
            {isProcessingAlternatives && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Find Alternatives
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
