import type { TouristSpot } from '@/lib/types';
import { Landmark, Trees, FerrisWheel, ShoppingCart, Utensils, Eye, Castle, Tent } from 'lucide-react';

// Using Tent as a placeholder for Onsen as there's no direct Onsen icon in Lucide
// Using Castle for Trappistine as it's a significant historical landmark

export const hakodateSpots: TouristSpot[] = [
  {
    id: 'goryokaku',
    name: 'Goryokaku Park & Tower',
    category: 'Park & Viewpoint',
    description: 'Star-shaped fort with an observation tower offering panoramic views, especially beautiful during cherry blossom season.',
    image: 'https://placehold.co/600x400.png',
    icon: Trees,
    dataAiHint: 'park tower',
    detailsForAI: 'Category: Park, Viewpoint. Features: Historical star-shaped fort, observation tower, cherry blossoms, walking paths. Average visit: 2-3 hours.'
  },
  {
    id: 'mount_hakodate',
    name: 'Mount Hakodate Observatory',
    category: 'Viewpoint',
    description: 'Famous for its stunning night view, considered one of the best in Japan, accessible by ropeway.',
    image: 'https://placehold.co/600x400.png',
    icon: Eye,
    dataAiHint: 'mountain observatory',
    detailsForAI: 'Category: Viewpoint. Features: Night view, ropeway, observation deck. Average visit: 1-2 hours.'
  },
  {
    id: 'kanemori_warehouse',
    name: 'Kanemori Red Brick Warehouse',
    category: 'Shopping & Historical',
    description: 'Charming red brick warehouses along the waterfront, now housing shops, restaurants, and a beer hall.',
    image: 'https://placehold.co/600x400.png',
    icon: ShoppingCart,
    dataAiHint: 'warehouse shopping',
    detailsForAI: 'Category: Shopping, Historical. Features: Waterfront, red brick buildings, boutiques, restaurants, souvenirs. Average visit: 2-3 hours.'
  },
  {
    id: 'hakodate_market',
    name: 'Hakodate Morning Market',
    category: 'Market & Food',
    description: 'Bustling morning market with fresh seafood, local produce, and various eateries. Famous for squid fishing.',
    image: 'https://placehold.co/600x400.png',
    icon: Utensils,
    dataAiHint: 'market seafood',
    detailsForAI: 'Category: Market, Food. Features: Fresh seafood, local produce, restaurants, squid fishing. Average visit: 1-2 hours.'
  },
  {
    id: 'motomachi_church',
    name: 'Motomachi Roman Catholic Church',
    category: 'Historical & Landmark',
    description: 'A beautiful Gothic-style church with a distinctive red roof, part of the historic Motomachi area.',
    image: 'https://placehold.co/600x400.png',
    icon: Landmark,
    dataAiHint: 'church historic',
    detailsForAI: 'Category: Historical, Landmark. Features: Gothic architecture, religious site, Motomachi area. Average visit: 30-60 minutes.'
  },
  {
    id: 'old_public_hall',
    name: 'Old Public Hall of Hakodate Ward',
    category: 'Historical & Landmark',
    description: 'An elegant colonial-style building with stunning architecture and views, offering costume rentals.',
    image: 'https://placehold.co/600x400.png',
    icon: Landmark, // Could use Castle if more appropriate for grandeur
    dataAiHint: 'historic building',
    detailsForAI: 'Category: Historical, Landmark. Features: Colonial architecture, concert hall, costume rental, views. Average visit: 1-1.5 hours.'
  },
  {
    id: 'trappistine_convent',
    name: 'Trappistine Convent',
    category: 'Historical & Landmark',
    description: 'A peaceful and beautiful convent known for its European-style architecture and gardens. Famous for its butter cookies.',
    image: 'https://placehold.co/600x400.png',
    icon: Castle, // Representing a significant, slightly imposing historical structure
    dataAiHint: 'convent garden',
    detailsForAI: 'Category: Historical, Landmark. Features: European architecture, gardens, religious site, gift shop with cookies. Average visit: 1 hour.'
  },
  {
    id: 'yunokawa_onsen',
    name: 'Yunokawa Onsen',
    category: 'Onsen Area',
    description: 'A well-known hot spring resort area in Hakodate, offering various ryokans and public baths.',
    image: 'https://placehold.co/600x400.png',
    icon: Tent, // Placeholder for Onsen
    dataAiHint: 'hot spring',
    detailsForAI: 'Category: Onsen Area. Features: Hot springs, ryokans, public baths, seaside location. Average visit: Varies (day trip or overnight).'
  },
];
