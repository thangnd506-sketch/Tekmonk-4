
export interface Province {
  id: string;
  name: string;
  region: 'North' | 'Central' | 'South';
  description: string;
  highlights: Destination[];
  specialties: string[];
  climate: string;
  bestTime: string;
}

export interface Destination {
  name: string;
  image: string;
  rating: number;
  description: string;
}

export interface FoodItem {
  name: string;
  region: string;
  image: string;
  priceRange: string;
  description: string;
  spots: string[];
  isMustTry: boolean;
  tags: string[];
}

export interface PlanRequest {
  startDate: string;
  endDate: string;
  budget: 'budget' | 'medium' | 'premium';
  interests: string[];
  transport: string;
  accommodation: string;
  groupSize: string;
}

export interface ItineraryDay {
  day: number;
  location: string;
  activities: {
    time: string;
    description: string;
    cost: number;
  }[];
}

export interface Phrase {
  vietnamese: string;
  english: string;
  pronunciation: string;
}
