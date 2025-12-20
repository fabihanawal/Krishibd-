import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Crop, NewsItem, MarketItem, WeatherForecast } from '../types';
import { MOCK_CROPS, MOCK_NEWS, MOCK_MARKET, MOCK_WEATHER } from '../constants';

interface DataContextType {
  crops: Crop[];
  news: NewsItem[];
  market: MarketItem[];
  weather: WeatherForecast[];
  addCrop: (crop: Crop) => void;
  updateCrop: (crop: Crop) => void;
  deleteCrop: (id: string) => void;
  addNews: (news: NewsItem) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;
  addMarketItem: (item: MarketItem) => void;
  deleteMarketItem: (id: string) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  // Initialize state from LocalStorage or fall back to MOCK constants
  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem('kb_crops');
    return saved ? JSON.parse(saved) : MOCK_CROPS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('kb_news');
    return saved ? JSON.parse(saved) : MOCK_NEWS;
  });

  const [market, setMarket] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem('kb_market');
    return saved ? JSON.parse(saved) : MOCK_MARKET;
  });

  // Weather is static for this demo, but could be stateful too
  const [weather] = useState<WeatherForecast[]>(MOCK_WEATHER);

  // Persist to LocalStorage whenever state changes
  useEffect(() => localStorage.setItem('kb_crops', JSON.stringify(crops)), [crops]);
  useEffect(() => localStorage.setItem('kb_news', JSON.stringify(news)), [news]);
  useEffect(() => localStorage.setItem('kb_market', JSON.stringify(market)), [market]);

  // --- Actions ---

  const addCrop = (crop: Crop) => setCrops([...crops, crop]);
  
  const updateCrop = (updatedCrop: Crop) => {
    setCrops(crops.map(c => c.id === updatedCrop.id ? updatedCrop : c));
  };

  const deleteCrop = (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
  };

  const addNews = (item: NewsItem) => setNews([...news, item]);

  const updateNews = (updatedItem: NewsItem) => {
    setNews(news.map(n => n.id === updatedItem.id ? updatedItem : n));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
  };

  const addMarketItem = (item: MarketItem) => setMarket([...market, item]);

  const deleteMarketItem = (id: string) => {
    setMarket(market.filter(m => m.id !== id));
  };

  const resetData = () => {
    if(window.confirm("Are you sure? This will reset all data to default.")) {
        setCrops(MOCK_CROPS);
        setNews(MOCK_NEWS);
        setMarket(MOCK_MARKET);
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      crops, news, market, weather,
      addCrop, updateCrop, deleteCrop,
      addNews, updateNews, deleteNews,
      addMarketItem, deleteMarketItem,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};