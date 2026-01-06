
import React, { useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, Newspaper, ShoppingCart, LogOut, Plus, Edit, Trash2, Save, X, Settings, Image as ImageIcon, Upload, Globe, Zap, Code, FileImage, Check, Copy } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Crop, NewsItem, MarketItem, AdItem } from '../types';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') onLogin();
    else setError('ভুল পাসওয়ার্ড! (Try: admin123)');
  };
  return (
    <div className="min-h-screen bg-agri-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-agri-100">
        <div className="flex justify-center mb-4 text-agri-600">
          <Settings size={48} className="animate-spin-slow" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">অ্যাডমিন প্যানেল লগইন</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড দিন</label>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-agri-500 outline-none transition" 
              placeholder="••••••••" 
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button type="submit" className="w-full bg-agri-600 text-white py-3 rounded-xl font-bold hover:bg-agri-700 shadow-lg shadow-agri-200 transition-all">প্রবেশ করুন</button>
        </form>
      </div>
    </div>
  );
};

const Sidebar = ({ onLogout }: { onLogout: () => void }) => (
  <aside className="bg-white border-r w-full md:w-64 flex flex-col h-full shadow-sm">
    <div className="p-6 border-b flex items-center gap-2 text-agri-700">
      <Sprout className="fill-current" />
      <span className="font-bold text-xl">কৃষিবন্ধু কন্ট্রোল</span>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><LayoutDashboard size={20}/> ড্যাশবোর্ড</Link>
      <Link to="/admin/crops" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><Sprout size={20}/> ফসল ম্যানেজমেন্ট</Link>
      <Link to="/admin/news" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><Newspaper size={20}/> খবর ও শিক্ষা</Link>
      <Link to="/admin/market" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><ShoppingCart size={20}/> বাজার কন্ট্রোল</Link>
      <Link to="/admin/ads" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><ImageIcon size={20}/> অ্যাড ম্যানেজমেন্ট</Link>
      <Link to="/admin/system" className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium transition"><Globe size={20}/> ডেপ্লয় ও সিস্টেম</Link>
    </nav>
    <div className="p-4 border-t space-y-2">
      <Link to="/" className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 text-gray-700 font-medium transition">অ্যাপে ফিরে যান</Link>
      <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition"><LogOut size={20}/> লগআউট</button>
    </div>
  </aside>
);

const AdsManager = () => {
    const { ads, saveAd, deleteAd } = useData();
    const [editing, setEditing] = useState<Partial<AdItem> | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const positions = [
        { id: 'ad-slot-1', name: 'Home Banner (Top)' },
        { id: 'ad-slot-2', name: 'Knowledge Sidebar' },
        { id: 'ad-slot-3', name: 'Crop Details Bottom' },
        { id: 'ad-slot-4', name: 'News In-Feed' }
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditing(prev => ({ ...prev, content: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing?.positionId && editing?.content) {
            saveAd({
                id: editing.id || Date.now().toString(),
                positionId: editing.positionId,
                type: editing.type || 'image',
                content: editing.content,
                link: editing.link || '',
                active: true
            });
            setEditing(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">অ্যাড ম্যানেজমেন্ট (বিজ্ঞাপন)</h2>
                <button 
                    onClick={() => setEditing({ type: 'image', active: true, link: '' })}
                    className="bg-agri-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold"
                >
                    <Plus size={18}/> নতুন অ্যাড যোগ করুন
                </button>
            </div>

            {editing && (
                <div className="bg-white p-6 rounded-2xl border-2 border-agri-200 shadow-xl space-y-6">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h3 className="font-bold text-lg">অ্যাড এডিট / সেটআপ</h3>
                        <button onClick={() => setEditing(null)}><X/></button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">অ্যাড স্লট / অবস্থান</label>
                                <select 
                                    className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-agri-500 outline-none"
                                    value={editing.positionId}
                                    onChange={e => setEditing({...editing, positionId: e.target.value})}
                                    required
                                >
                                    <option value="">সিলেক্ট করুন...</option>
                                    {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">বিজ্ঞাপনের ধরণ</label>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => setEditing({...editing, type: 'image', content: ''})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition ${editing.type === 'image' ? 'border-agri-600 bg-agri-50 text-agri-700' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        <FileImage size={20}/> ইমেজ ফাইল
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setEditing({...editing, type: 'adsense', content: ''})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition ${editing.type === 'adsense' ? 'border-agri-600 bg-agri-50 text-agri-700' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        <Code size={20}/> AdSense কোড
                                    </button>
                                </div>
                            </div>
                        </div>

                        {editing.type === 'image' ? (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 transition" onClick={() => fileRef.current?.click()}>
                                    <input type="file" hidden ref={fileRef} accept="image/*" onChange={handleFileUpload} />
                                    {editing.content ? (
                                        <div className="relative group">
                                            <img src={editing.content} className="max-h-40 mx-auto rounded-lg shadow-sm" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold rounded-lg transition">পরিবর্তন করুন</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Upload size={40} className="mb-2" />
                                            <p className="font-medium">ইমেজ আপলোড করুন (JPG, PNG, GIF)</p>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">ডেস্টিনেশন লিংক (লিঙ্ক না থাকলে খালি রাখুন)</label>
                                    <input 
                                        type="url" 
                                        placeholder="https://example.com"
                                        className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-agri-500"
                                        value={editing.link}
                                        onChange={e => setEditing({...editing, link: e.target.value})}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Google AdSense / Script কোড দিন</label>
                                <textarea 
                                    placeholder="<script async src='...' ...></script>"
                                    className="w-full border p-3 rounded-xl font-mono text-xs h-40 outline-none focus:ring-2 focus:ring-agri-500"
                                    value={editing.content}
                                    onChange={e => setEditing({...editing, content: e.target.value})}
                                    required
                                />
                                <p className="text-[10px] text-gray-400">* শুধুমাত্র নির্ভরযোগ্য স্ক্রিপ্ট বা অ্যাডসেন্স কোড ব্যবহার করুন।</p>
                            </div>
                        )}

                        <div className="pt-4 flex gap-3">
                            <button type="submit" className="flex-1 bg-agri-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-agri-100 hover:bg-agri-700">
                                <Save size={20}/> অ্যাড আপডেট করুন
                            </button>
                            <button type="button" onClick={() => setEditing(null)} className="px-8 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition">বাতিল</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positions.map(pos => {
                    const activeAd = ads.find(a => a.positionId === pos.id);
                    return (
                        <div key={pos.id} className="bg-white p-5 rounded-2xl border shadow-sm hover:border-agri-200 transition group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-800">{pos.name}</h4>
                                    <p className="text-xs text-gray-400">Slot ID: {pos.id}</p>
                                </div>
                                {activeAd ? (
                                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                        <Check size={10}/> Active
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">Empty</span>
                                )}
                            </div>
                            
                            {activeAd ? (
                                <div className="space-y-3">
                                    <div className="h-24 bg-gray-50 rounded-lg overflow-hidden border flex items-center justify-center text-xs text-gray-400 italic">
                                        {activeAd.type === 'image' ? (
                                            <img src={activeAd.content} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Code size={16} className="mb-1" />
                                                AdSense Script
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEditing(activeAd)}
                                            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition"
                                        >
                                            <Edit size={14}/> পরিবর্তন
                                        </button>
                                        <button 
                                            onClick={() => deleteAd(activeAd.id)}
                                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                        >
                                            <Trash2 size={14}/>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setEditing({ positionId: pos.id, type: 'image', active: true, link: '' })}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-xl text-xs font-bold text-gray-300 hover:border-agri-200 hover:text-agri-400 transition"
                                >
                                    + অ্যাড সেট করুন
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Overview = () => {
  const { crops, news, market, ads } = useData();
  const stats = [
    { label: 'মোট ফসল', count: crops.length, icon: <Sprout/>, color: 'bg-green-100 text-green-700' },
    { label: 'খবর ও ভিডিও', count: news.length, icon: <Newspaper/>, color: 'bg-blue-100 text-blue-700' },
    { label: 'বিজ্ঞাপন সচল', count: ads.length, icon: <ImageIcon/>, color: 'bg-purple-100 text-purple-700' },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">একনজরে বর্তমান অবস্থা</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{s.label}</p>
              <p className="text-3xl font-bold text-gray-800">{s.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemInfo = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isProcessDefined = typeof process !== 'undefined' && process.env;

  const envVars = [
    { name: 'API_KEY (Gemini)', status: (isProcessDefined && process.env.API_KEY) ? 'Active' : 'Missing', val: 'your_gemini_key' },
    { name: 'SUPABASE_URL', status: 'Active', val: 'https://bczbvjclaxkbwgrzugoh.supabase.co' },
    { name: 'SUPABASE_ANON_KEY', status: 'Active', val: 'sb_publishable_lb9PQ-x6mZ8TZBP6VvBe7w_xHvgHzy5' },
  ];

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-bold text-gray-800">সিস্টেম কনফিগারেশন ও ডেপ্লয়মেন্ট</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Settings size={18}/> Environment Variables</h3>
            <div className="space-y-4">
              {envVars.map((env, i) => (
                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">{env.name}</span>
                    <span className={`text-[10px] font-bold ${env.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>{env.status}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border text-xs font-mono text-gray-500 overflow-hidden">
                    <span className="truncate max-w-[150px] md:max-w-[300px]">{env.val}</span>
                    <button onClick={() => copyToClipboard(env.val, env.name)} className="text-agri-600 hover:text-agri-700">
                      {copied === env.name ? <Check size={14}/> : <Copy size={14}/>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Zap size={18}/> Vercel ডেপ্লয়মেন্ট গাইড</h3>
            <p className="text-xs text-orange-700 mb-4 bg-orange-50 p-3 rounded-lg border border-orange-100">সাদা পেজ আসলে অবশ্যই **API_KEY** যোগ করে Redeploy করুন।</p>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="p-4 border rounded-xl">
                 <h5 className="font-bold text-xs uppercase text-gray-400 mb-2">ধাপ ১</h5>
                 <p className="text-sm text-gray-700">Vercel Dashboard এ গিয়ে আপনার প্রজেক্টটি ওপেন করুন।</p>
               </div>
               <div className="p-4 border rounded-xl">
                 <h5 className="font-bold text-xs uppercase text-gray-400 mb-2">ধাপ ২</h5>
                 <p className="text-sm text-gray-700">Settings > Environment Variables এ যান।</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CropsManager = () => {
  const { crops, addCrop, updateCrop, deleteCrop } = useData();
  const [editing, setEditing] = useState<Partial<Crop> | null>(null);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cropData = editing as Crop;
    if (crops.find(c => c.id === cropData.id)) updateCrop(cropData);
    else addCrop(cropData);
    setEditing(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">ফসল তালিকা</h2>
        <button onClick={() => setEditing({ id: Date.now().toString(), name: '', fertilizers: [], pests: [], diseases: [], season: '', soil: '', harvesting: '', description: '', image: '' })} className="bg-agri-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold"><Plus size={18}/> নতুন ফসল</button>
      </div>
      {editing && (
        <div className="bg-white p-6 rounded-2xl border-2 border-agri-200 shadow-xl space-y-4">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="ফসলের নাম" className="border p-3 rounded-xl" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
            <input required placeholder="ঋতু ও মাটি" className="border p-3 rounded-xl" value={editing.season} onChange={e => setEditing({...editing, season: e.target.value})} />
            <input required placeholder="ছবির URL" className="border p-3 rounded-xl" value={editing.image} onChange={e => setEditing({...editing, image: e.target.value})} />
            <textarea required placeholder="বর্ণনা" className="border p-3 rounded-xl md:col-span-2 h-24" value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} />
            <button type="submit" className="md:col-span-2 bg-agri-600 text-white py-3 rounded-xl font-bold">সেভ করুন</button>
          </form>
        </div>
      )}
      <div className="grid gap-4">
        {crops.map(c => (
          <div key={c.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={c.image} className="w-12 h-12 rounded-lg object-cover" />
              <p className="font-bold text-gray-800">{c.name}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18}/></button>
              <button onClick={() => deleteCrop(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsManager = () => {
  const { news, addNews, updateNews, deleteNews } = useData();
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const item = editing as NewsItem;
    if (news.find(n => n.id === item.id)) updateNews(item);
    else addNews(item);
    setEditing(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">খবর ও ভিডিও</h2>
        <button onClick={() => setEditing({ id: Date.now().toString(), title: '', summary: '', date: new Date().toLocaleDateString(), image: '', category: 'News' })} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold"><Plus size={18}/> নতুন খবর</button>
      </div>
      {editing && (
        <div className="bg-white p-6 rounded-2xl border-2 border-blue-200 shadow-xl space-y-4">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="শিরোনাম" className="border p-3 rounded-xl md:col-span-2" value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} />
            <textarea required placeholder="সারমর্ম" className="border p-3 rounded-xl md:col-span-2 h-24" value={editing.summary} onChange={e => setEditing({...editing, summary: e.target.value})} />
            <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold">সেভ করুন</button>
          </form>
        </div>
      )}
      <div className="space-y-3">
        {news.map(n => (
          <div key={n.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
            <p className="font-bold text-gray-800 truncate max-w-xs">{n.title}</p>
            <div className="flex gap-2">
              <button onClick={() => setEditing(n)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
              <button onClick={() => deleteNews(n.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MarketManager = () => {
  const { market, addMarketItem, deleteMarketItem } = useData();
  const [editing, setEditing] = useState<Partial<MarketItem> | null>(null);
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketItem(editing as MarketItem);
    setEditing(null);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">বাজার তদারকি</h2>
        <button onClick={() => setEditing({ id: Date.now().toString(), name: '', price: '', seller: '', location: '', image: '', type: 'crop' })} className="bg-orange-600 text-white px-4 py-2 rounded-xl font-bold">+ পণ্য যোগ করুন</button>
      </div>
      {editing && (
        <div className="bg-white p-6 rounded-2xl border-2 border-orange-200 shadow-xl space-y-4">
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="পণ্যের নাম" className="border p-3 rounded-xl" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} />
            <input required placeholder="মূল্য" className="border p-3 rounded-xl" value={editing.price} onChange={e => setEditing({...editing, price: e.target.value})} />
            <button type="submit" className="md:col-span-2 bg-orange-600 text-white py-3 rounded-xl font-bold">পাবলিশ করুন</button>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {market.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-xl border flex items-center gap-4">
            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-bold text-gray-800">{item.name}</p>
              <p className="text-agri-600 text-sm font-bold">{item.price}</p>
            </div>
            <button onClick={() => deleteMarketItem(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) return <AdminLogin onLogin={() => { setIsAuthenticated(true); navigate('/admin/dashboard'); }} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <Sidebar onLogout={() => setIsAuthenticated(false)} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <Routes>
          <Route path="dashboard" element={<Overview />} />
          <Route path="crops" element={<CropsManager />} />
          <Route path="news" element={<NewsManager />} />
          <Route path="market" element={<MarketManager />} />
          <Route path="ads" element={<AdsManager />} />
          <Route path="system" element={<SystemInfo />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;
