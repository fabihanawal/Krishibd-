
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bczbvjclaxkbwgrzugoh.supabase.co';
const supabaseAnonKey = 'sb_publishable_lb9PQ-x6mZ8TZBP6VvBe7w_xHvgHzy5';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ডাটা নিয়ে আসার জন্য হেল্পার ফাংশন
export const getCrops = async () => {
  const { data, error } = await supabase.from('crops').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getNews = async () => {
  const { data, error } = await supabase.from('news_items').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getMarketItems = async () => {
  const { data, error } = await supabase.from('market_items').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
