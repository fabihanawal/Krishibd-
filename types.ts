
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
  videoUrl?: string;
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

export interface AdItem {
  id: string;
  positionId: string; // matches AdPlaceholder id
  type: 'adsense' | 'image';
  content: string; // AdSense script or Image Base64
  link?: string; // Redirect URL for image ads
  active: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isLoading?: boolean;
}
