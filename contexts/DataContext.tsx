
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Crop, NewsItem, MarketItem, WeatherForecast, AdItem } from '../types';
import { MOCK_CROPS, MOCK_NEWS, MOCK_MARKET, MOCK_WEATHER } from '../constants';
import { supabase } from '../services/supabase';

interface DataContextType {
  crops: Crop[];
  news: NewsItem[];
  market: MarketItem[];
  weather: WeatherForecast[];
  ads: AdItem[];
  loading: boolean;
  addCrop: (crop: Crop) => void;
  updateCrop: (crop: Crop) => void;
  deleteCrop: (id: string) => void;
  addNews: (news: NewsItem) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (id: string) => void;
  addMarketItem: (item: MarketItem) => void;
  deleteMarketItem: (id: string) => void;
  saveAd: (ad: AdItem) => void;
  deleteAd: (id: string) => void;
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
  const [loading, setLoading] = useState(true);
  
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

  const [ads, setAds] = useState<AdItem[]>(() => {
    const saved = localStorage.getItem('kb_ads');
    return saved ? JSON.parse(saved) : [];
  });

  const [weather] = useState<WeatherForecast[]>(MOCK_WEATHER);

  useEffect(() => localStorage.setItem('kb_crops', JSON.stringify(crops)), [crops]);
  useEffect(() => localStorage.setItem('kb_news', JSON.stringify(news)), [news]);
  useEffect(() => localStorage.setItem('kb_market', JSON.stringify(market)), [market]);
  useEffect(() => localStorage.setItem('kb_ads', JSON.stringify(ads)), [ads]);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        const [cropsRes, newsRes, marketRes, adsRes] = await Promise.all([
          supabase.from('crops').select('*'),
          supabase.from('news_items').select('*'),
          supabase.from('market_items').select('*'),
          supabase.from('ads').select('*')
        ]);
        
        if (cropsRes.data && cropsRes.data.length > 0) setCrops(cropsRes.data);
        if (newsRes.data && newsRes.data.length > 0) setNews(newsRes.data);
        if (marketRes.data && marketRes.data.length > 0) setMarket(marketRes.data);
        if (adsRes.data && adsRes.data.length > 0) setAds(adsRes.data);
        
      } catch (e) {
        console.warn("Supabase connectivity check: Falling back to local/cached data.", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseData();
  }, []);

  const addCrop = async (crop: Crop) => {
    setCrops([...crops, crop]);
    await supabase.from('crops').insert([crop]);
  };
  
  const updateCrop = async (updatedCrop: Crop) => {
    setCrops(crops.map(c => c.id === updatedCrop.id ? updatedCrop : c));
    await supabase.from('crops').update(updatedCrop).eq('id', updatedCrop.id);
  };

  const deleteCrop = async (id: string) => {
    setCrops(crops.filter(c => c.id !== id));
    await supabase.from('crops').delete().eq('id', id);
  };

  const addNews = async (item: NewsItem) => {
    setNews([...news, item]);
    await supabase.from('news_items').insert([item]);
  };

  const updateNews = async (updatedItem: NewsItem) => {
    setNews(news.map(n => n.id === updatedItem.id ? updatedItem : n));
    await supabase.from('news_items').update(updatedItem).eq('id', updatedItem.id);
  };

  const deleteNews = async (id: string) => {
    setNews(news.filter(n => n.id !== id));
    await supabase.from('news_items').delete().eq('id', id);
  };

  const addMarketItem = async (item: MarketItem) => {
    setMarket([...market, item]);
    await supabase.from('market_items').insert([item]);
  };

  const deleteMarketItem = async (id: string) => {
    setMarket(market.filter(m => m.id !== id));
    await supabase.from('market_items').delete().eq('id', id);
  };

  const saveAd = async (ad: AdItem) => {
    const existing = ads.find(a => a.positionId === ad.positionId);
    let newAds;
    if (existing) {
        newAds = ads.map(a => a.positionId === ad.positionId ? ad : a);
        await supabase.from('ads').update(ad).eq('positionId', ad.positionId);
    } else {
        newAds = [...ads, ad];
        await supabase.from('ads').insert([ad]);
    }
    setAds(newAds);
  };

  const deleteAd = async (id: string) => {
    setAds(ads.filter(a => a.id !== id));
    await supabase.from('ads').delete().eq('id', id);
  };

  const resetData = () => {
    if(window.confirm("আপনি কি নিশ্চিত? সব ডাটা মুছে যাবে।")) {
        setCrops(MOCK_CROPS);
        setNews(MOCK_NEWS);
        setMarket(MOCK_MARKET);
        setAds([]);
        localStorage.clear();
        window.location.reload();
    }
  };

  return (
    <DataContext.Provider value={{
      crops, news, market, weather, ads, loading,
      addCrop, updateCrop, deleteCrop,
      addNews, updateNews, deleteNews,
      addMarketItem, deleteMarketItem,
      saveAd, deleteAd,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};
