'use client';

import Image from 'next/image';
import type { AlternativeSpot, TouristSpot } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlternativeSpotsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  originalSpot: TouristSpot | null;
  alternatives: AlternativeSpot[];
}

export function AlternativeSpotsModal({ isOpen, onOpenChange, originalSpot, alternatives }: AlternativeSpotsModalProps) {
  if (!originalSpot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-headline">
            Alternative Spots for {originalSpot.name}
          </DialogTitle>
          <DialogDescription>
            Here are some alternative spots you might enjoy based on your preferences and lower congestion.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-6 pt-0">
          {alternatives.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No alternative spots found at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternatives.map((altSpot, index) => (
                <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative w-full h-48">
                    <Image
                      src={altSpot.image || `https://placehold.co/400x300.png`}
                      alt={altSpot.name}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={altSpot.dataAiHint || 'travel scenery'}
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-headline">{altSpot.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <CardDescription className="text-sm mb-2">{altSpot.description}</CardDescription>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <MapPin size={14} /> {altSpot.distance}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Clock size={14} /> {altSpot.travelTime}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <Star size={14} className="fill-amber-500" /> {altSpot.reviewScore.toFixed(1)}
                    </div>
                  </CardContent>
                  <div className="p-4 border-t">
                     <Button variant="outline" className="w-full">View on Map (Simulated)</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-6 pt-2 flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
