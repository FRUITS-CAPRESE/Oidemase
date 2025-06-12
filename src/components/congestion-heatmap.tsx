
'use client';

import type { TouristSpot, CongestionInfo, CongestionLevel } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface CongestionHeatmapProps {
  spots: TouristSpot[];
  congestionData: Record<string, CongestionInfo | null>;
  isLoading: boolean;
}

const getCongestionColorClass = (level: CongestionLevel | undefined): string => {
  if (!level) return 'bg-gray-300 text-gray-700';
  switch (level) {
    case 'low':
      return 'bg-green-500 text-white';
    case 'moderate':
      return 'bg-yellow-500 text-black';
    case 'high':
      return 'bg-red-600 text-white';
    default: // unknown
      return 'bg-gray-300 text-gray-700';
  }
};

export function CongestionHeatmap({ spots, congestionData, isLoading }: CongestionHeatmapProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Hakodate Area Congestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full rounded-md" />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[...Array(spots.length > 0 ? spots.length : 4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton key={i} className="h-6 w-6 rounded-full mb-1" />
                <Skeleton key={`text-${i}`} className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Hakodate Area Congestion</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No spots available to display on the map.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Hakodate Area Congestion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted/20 rounded-lg min-h-[200px] flex flex-wrap gap-x-4 gap-y-6 items-start justify-center relative border border-dashed">
          <p className="absolute top-2 left-2 text-xs text-muted-foreground bg-background px-1 rounded">Map Area (Placeholder)</p>
          {spots.map((spot) => {
            const spotCongestion = congestionData[spot.id];
            const colorClass = getCongestionColorClass(spotCongestion?.level);
            const SpotIconComponent = spot.icon;

            return (
              <div
                key={spot.id}
                title={`${spot.name}: ${spotCongestion?.level ? spotCongestion.level.charAt(0).toUpperCase() + spotCongestion.level.slice(1) : 'Loading...'}${spotCongestion?.explanation ? ` - ${spotCongestion.explanation}` : ''}`}
                className="flex flex-col items-center text-center p-1 rounded-md w-28"
              >
                <div className={`w-8 h-8 rounded-full ${colorClass} mb-1 shadow-md border-2 border-background flex items-center justify-center`}>
                  <SpotIconComponent size={16} className={spotCongestion?.level === 'moderate' ? 'text-black' : 'text-white'} />
                </div>
                <span className="text-xs font-medium leading-tight">{spot.name}</span>
                {spotCongestion && spotCongestion.level !== 'unknown' && (
                  <span className="text-xs capitalize text-muted-foreground">({spotCongestion.level})</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This is a simplified representation. A full map integration with geographical accuracy is planned.
        </p>
      </CardContent>
    </Card>
  );
}
