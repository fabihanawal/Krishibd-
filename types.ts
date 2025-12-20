export type Language = 'bn' | 'en';

export interface Crop {
  id: string;
  name: string;
  image: string;
  season: string;
  soil: string;
  description: string;
  fertilizers: string[];
  pests: string[];
  diseases: string[];
  harvesting: string;
}

export interface WeatherForecast {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  image: string;
  category: 'News' | 'Loan' | 'Training';
  videoUrl?: string; // Optional for training videos
}

export interface MarketItem {
  id: string;
  name: string;
  price: string;
  seller: string;
  location: string;
  image: string;
  type: 'seed' | 'fertilizer' | 'crop' | 'equipment';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isLoading?: boolean;
}