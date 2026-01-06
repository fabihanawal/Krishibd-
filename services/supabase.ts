
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bczbvjclaxkbwgrzugoh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjemJ2amNsYXhrYndncnp1Z29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjU0ODYsImV4cCI6MjA4MTc0MTQ4Nn0.7mhB7BmbUJ6gWuPzvLepgF9NquDyxDkxPnq5JQqQMeo';

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
