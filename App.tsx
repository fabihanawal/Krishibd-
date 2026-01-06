
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, CloudSun, Sprout, ShoppingCart, Newspaper, Stethoscope, Menu, X, Upload, Send, MapPin, User, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from './constants';
import { Language, ChatMessage } from './types';
import AdPlaceholder from './components/AdPlaceholder';
import { analyzePlantDisease, chatWithExpert } from './services/geminiService';
import { DataProvider, useData } from './contexts/DataContext';
import AdminPage from './pages/AdminPage';

// --- Components ---

const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = TRANSLATIONS[lang];
  const location = useLocation();

  const navLinks = [
    { name: t.home, path: '/', icon: <Home size={20} /> },
    { name: t.knowledge, path: '/knowledge', icon: <Sprout size={20} /> },
    { name: t.market, path: '/market', icon: <ShoppingCart size={20} /> },
    { name: t.news, path: '/news', icon: <Newspaper size={20} /> },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-agri-600 p-1.5 rounded-lg shadow-agri-200 shadow-lg">
                <Sprout className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-agri-800 tracking-tight">{t.appTitle}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex items-center gap-1.5 font-medium transition ${location.pathname === link.path ? 'text-agri-600' : 'text-gray-600 hover:text-agri-500'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <button 
                onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                className="bg-agri-50 text-agri-700 px-4 py-1.5 rounded-full text-sm font-bold border border-agri-100 hover:bg-agri-100 transition"
            >
              {t.toggleLang}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="text-xs font-bold text-agri-700 bg-agri-50 px-2 py-1 rounded">
                {t.toggleLang}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-agri-50 text-gray-700 font-medium"
            >
              <span className="text-agri-500">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const HomePage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { crops, news } = useData();
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-agri-600 to-agri-800 text-white px-4 py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="grid grid-cols-6 gap-4 transform -rotate-12 scale-150">
                {[...Array(24)].map((_, i) => <Sprout key={i} size={40} />)}
            </div>
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t.welcome}</h1>
          <p className="text-agri-100 mb-8 text-lg">{t.heroSubtitle}</p>
          
          <div className="relative max-w-lg mx-auto mb-4">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder} 
              className="w-full py-4 px-6 pr-12 rounded-2xl text-gray-800 shadow-xl focus:ring-4 focus:ring-agri-400 outline-none transition"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-agri-500">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Diagnosis Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-agri-100 flex flex-col md:flex-row items-center gap-6 group hover:border-agri-300 transition-all cursor-pointer" onClick={() => navigate('/diagnosis')}>
            <div className="bg-agri-50 p-6 rounded-2xl text-agri-600 group-hover:bg-agri-100 transition">
              <Stethoscope size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.diagnosisTitle}</h3>
              <p className="text-gray-500 text-sm mb-4">{t.diagnosisSubtitle}</p>
              <button className="bg-agri-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto md:mx-0 shadow-lg shadow-agri-100">
                <Upload size={18} /> {t.uploadImage}
              </button>
            </div>
          </div>

          {/* Expert Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-harvest-100 flex flex-col md:flex-row items-center gap-6 group hover:border-harvest-500 transition-all cursor-pointer" onClick={() => navigate('/support')}>
            <div className="bg-harvest-50 p-6 rounded-2xl text-harvest-600 group-hover:bg-harvest-100 transition">
              <User size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.expertTitle}</h3>
              <p className="text-gray-500 text-sm mb-4">{t.expertSubtitle}</p>
              <button className="bg-harvest-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto md:mx-0 shadow-lg shadow-harvest-100">
                <Send size={18} /> {t.askExpert}
              </button>
            </div>
          </div>
        </div>

        {/* Ad Space */}
        <AdPlaceholder id="ad-slot-1" type="banner" lang={lang} />

        {/* Seasonal Crops */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{t.seasonalCrops}</h2>
            <Link to="/knowledge" className="text-agri-600 font-bold flex items-center gap-1 text-sm hover:underline">
              {t.readMore} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {crops.slice(0, 4).map(crop => (
              <Link key={crop.id} to={`/crop/${crop.id}`} className="bg-white rounded-2xl shadow-sm border overflow-hidden group hover:shadow-md transition">
                <div className="h-32 md:h-40 relative">
                  <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">
                    {crop.season}
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <h4 className="font-bold text-gray-800 md:text-lg">{crop.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{crop.soil}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* News Feed */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.recentNews}</h2>
          <div className="space-y-4">
            {news.slice(0, 3).map(item => (
              <Link key={item.id} to="/news" className="bg-white p-4 rounded-2xl border flex gap-4 hover:border-agri-400 transition">
                <img src={item.image} className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-agri-600 bg-agri-50 px-2 py-0.5 rounded">{item.category}</span>
                    <h4 className="font-bold text-gray-800 md:text-xl mt-1 line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">{item.date}</span>
                    <span className="text-agri-600 text-xs font-bold flex items-center gap-1">{t.readMore} <ChevronRight size={14}/></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DiagnosisPage = ({ lang }: { lang: Language }) => {
    const t = TRANSLATIONS[lang];
    const [image, setImage] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        const base64Data = image.split(',')[1];
        const res = await analyzePlantDisease(base64Data, lang);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 pb-20">
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>
                <h2 className="text-2xl font-bold text-gray-800">{t.diagnosisTitle}</h2>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-agri-100 overflow-hidden">
                <div className="p-6 border-b border-dashed">
                    {!image ? (
                        <label className="border-4 border-dashed border-agri-50 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-agri-50 transition-all group">
                            <input type="file" hidden accept="image/*" onChange={handleUpload} />
                            <div className="bg-agri-600 text-white p-4 rounded-full shadow-lg group-hover:scale-110 transition mb-4">
                                <Upload size={32} />
                            </div>
                            <p className="font-bold text-gray-500">{t.uploadImage}</p>
                            <p className="text-xs text-gray-300 mt-2">JPG, PNG, WebP supported</p>
                        </label>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden h-64 border">
                                <img src={image} className="w-full h-full object-cover" />
                                <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"><X size={18}/></button>
                            </div>
                            {!result && (
                                <button 
                                    onClick={handleAnalyze} 
                                    disabled={loading}
                                    className="w-full bg-agri-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-agri-100 flex items-center justify-center gap-3 disabled:bg-gray-300 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            {t.analyzing}
                                        </>
                                    ) : (
                                        <>
                                            <Stethoscope size={24} />
                                            বিশ্লেষণ শুরু করুন
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="p-6 bg-agri-50/50 animate-in fade-in duration-500">
                        <div className="flex items-center gap-2 text-agri-700 font-bold mb-4">
                            {/* Added CheckCircle2 to imports at the top */}
                            <CheckCircle2 size={24} />
                            এআই বিশেষজ্ঞ রিপোর্ট
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap font-medium leading-relaxed">
                            {result}
                        </div>
                        <button onClick={() => setImage(null)} className="mt-6 w-full py-3 text-agri-600 font-bold border-2 border-agri-600 rounded-xl hover:bg-agri-50 transition">
                            নতুন ছবি আপলোড করুন
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... Placeholder components for other pages ...
const KnowledgePage = ({ lang }: { lang: Language }) => <div className="p-8 text-center text-gray-500">তথ্য ভান্ডার শীঘ্রই আসছে...</div>;
const MarketPage = ({ lang }: { lang: Language }) => <div className="p-8 text-center text-gray-500">বাজার তদারকি মডিউল লোড হচ্ছে...</div>;
const NewsPage = ({ lang }: { lang: Language }) => <div className="p-8 text-center text-gray-500">সাম্প্রতিক খবর লোড হচ্ছে...</div>;
const SupportPage = ({ lang }: { lang: Language }) => <div className="p-8 text-center text-gray-500">বিশেষজ্ঞ চ্যাট শীঘ্রই শুরু হচ্ছে...</div>;

const BottomNav = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const location = useLocation();
  const navItems = [
    { icon: <Home size={22} />, path: '/', label: t.home },
    { icon: <Sprout size={22} />, path: '/knowledge', label: t.knowledge },
    { icon: <Stethoscope size={22} />, path: '/diagnosis', label: 'নির্ণয়' },
    { icon: <ShoppingCart size={22} />, path: '/market', label: t.market },
    { icon: <User size={22} />, path: '/support', label: 'সাহায্য' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map(item => (
        <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${location.pathname === item.path ? 'text-agri-600 scale-110' : 'text-gray-400'}`}
        >
          {item.icon}
          <span className="text-[10px] mt-1 font-bold">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

function App() {
  const [lang, setLang] = useState<Language>('bn');

  useEffect(() => {
    // Initial animation or setup
  }, []);

  return (
    <DataProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Routes>
            {/* Admin layout doesn't need standard navbar */}
            <Route path="/admin/*" element={<AdminPage />} />
            
            {/* Main App Layout */}
            <Route path="*" element={
              <>
                <Navbar lang={lang} setLang={setLang} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage lang={lang} />} />
                    <Route path="/diagnosis" element={<DiagnosisPage lang={lang} />} />
                    <Route path="/knowledge" element={<KnowledgePage lang={lang} />} />
                    <Route path="/market" element={<MarketPage lang={lang} />} />
                    <Route path="/news" element={<NewsPage lang={lang} />} />
                    <Route path="/support" element={<SupportPage lang={lang} />} />
                  </Routes>
                </main>
                <BottomNav lang={lang} />
              </>
            } />
          </Routes>
        </div>
      </HashRouter>
    </DataProvider>
  );
}

export default App;
