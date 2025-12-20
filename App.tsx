import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Home, CloudSun, Sprout, ShoppingCart, Newspaper, Stethoscope, Menu, X, Upload, Send, MapPin, User, ChevronRight, Droplets, Bug, Shovel, PlayCircle, ArrowLeft, Thermometer, Wind, Download } from 'lucide-react';
import { TRANSLATIONS } from './constants';
import { Language, ChatMessage } from './types';
import AdPlaceholder from './components/AdPlaceholder';
import { analyzePlantDisease, chatWithExpert } from './services/geminiService';
import { DataProvider, useData } from './contexts/DataContext';
import AdminPage from './pages/AdminPage';

// --- Components defined locally for file limit compliance ---

const Header = ({ lang, setLang, toggleMenu }: { lang: Language, setLang: (l: Language) => void, toggleMenu: () => void }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <header className="bg-agri-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Sprout className="h-8 w-8 text-harvest-500 fill-current" />
          <h1 className="text-2xl font-bold tracking-tight">{TRANSLATIONS[lang].appTitle}</h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-harvest-100 transition">{TRANSLATIONS[lang].home}</Link>
          <Link to="/knowledge" className="hover:text-harvest-100 transition">{TRANSLATIONS[lang].knowledge}</Link>
          <Link to="/weather" className="hover:text-harvest-100 transition">{TRANSLATIONS[lang].weather}</Link>
          <Link to="/marketplace" className="hover:text-harvest-100 transition">{TRANSLATIONS[lang].market}</Link>
          <Link to="/news" className="hover:text-harvest-100 transition">{TRANSLATIONS[lang].news}</Link>
          <Link to="/support" className="px-4 py-2 bg-harvest-500 rounded-full hover:bg-harvest-600 transition font-medium flex items-center gap-2">
              <Stethoscope size={18} />
              {TRANSLATIONS[lang].support}
          </Link>
          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-white text-agri-600 px-3 py-1 rounded font-bold hover:bg-gray-100 transition animate-pulse"
            >
              <Download size={16} /> {lang === 'bn' ? 'অ্যাপ' : 'App'}
            </button>
          )}
          <button 
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 text-sm font-medium"
          >
            {TRANSLATIONS[lang].toggleLang}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {deferredPrompt && (
            <button onClick={handleInstallClick} className="text-white">
              <Download size={24} />
            </button>
          )}
          <button 
            onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
            className="bg-white/20 px-2 py-1 rounded text-xs"
          >
            {lang === 'bn' ? 'EN' : 'বাংলা'}
          </button>
          <button onClick={toggleMenu} className="p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ lang }: { lang: Language }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-agri-600" : "text-gray-500";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/')}`}>
          <Home size={24} />
          <span className="text-[10px] mt-1">{TRANSLATIONS[lang].home}</span>
        </Link>
        <Link to="/knowledge" className={`flex flex-col items-center p-2 ${isActive('/knowledge')}`}>
          <Sprout size={24} />
          <span className="text-[10px] mt-1">{TRANSLATIONS[lang].knowledge}</span>
        </Link>
        <Link to="/support" className="flex flex-col items-center p-2 -mt-8">
          <div className="bg-harvest-500 text-white p-4 rounded-full shadow-lg border-4 border-gray-50">
            <Stethoscope size={28} />
          </div>
          <span className={`text-[10px] mt-1 font-medium ${isActive('/support')}`}>{TRANSLATIONS[lang].support}</span>
        </Link>
        <Link to="/weather" className={`flex flex-col items-center p-2 ${isActive('/weather')}`}>
          <CloudSun size={24} />
          <span className="text-[10px] mt-1">{TRANSLATIONS[lang].weather}</span>
        </Link>
        <Link to="/marketplace" className={`flex flex-col items-center p-2 ${isActive('/marketplace')}`}>
          <ShoppingCart size={24} />
          <span className="text-[10px] mt-1">{TRANSLATIONS[lang].market}</span>
        </Link>
      </div>
    </nav>
  );
};

const MobileMenu = ({ isOpen, close, lang }: { isOpen: boolean, close: () => void, lang: Language }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={close}>
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-white p-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <span className="font-bold text-lg text-agri-700">{t.appTitle}</span>
          <button onClick={close}><X className="text-gray-500" /></button>
        </div>
        <div className="flex flex-col space-y-4">
          <Link to="/" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><Home size={20}/> {t.home}</Link>
          <Link to="/knowledge" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><Sprout size={20}/> {t.knowledge}</Link>
          <Link to="/weather" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><CloudSun size={20}/> {t.weather}</Link>
          <Link to="/support" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><Stethoscope size={20}/> {t.support}</Link>
          <Link to="/marketplace" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><ShoppingCart size={20}/> {t.market}</Link>
          <Link to="/news" onClick={close} className="flex items-center gap-3 text-gray-700 p-2 rounded hover:bg-agri-50"><Newspaper size={20}/> {t.news}</Link>
          <Link to="/admin/dashboard" onClick={close} className="flex items-center gap-3 text-agri-700 p-2 rounded hover:bg-agri-50 border-t mt-4"><User size={20}/> Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { news } = useData();

  return (
    <div className="pb-20 md:pb-8">
      {/* Hero */}
      <section className="bg-agri-600 text-white py-12 px-4 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="container mx-auto relative z-10 text-center md:text-left md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3">{t.welcome}</h2>
            <p className="text-agri-100 text-lg md:text-xl max-w-lg">{t.heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/support" className="bg-harvest-500 hover:bg-harvest-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg transition transform hover:scale-105">
                {t.diagnosisTitle}
              </Link>
              <Link to="/weather" className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-6 py-2 rounded-full font-semibold transition">
                {t.weather}
              </Link>
            </div>
          </div>
          {/* Quick Weather Widget */}
          <div className="hidden md:block bg-white/10 backdrop-blur p-4 rounded-xl border border-white/20 w-64">
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">32°C</p>
                  <p className="text-sm opacity-90">Dhaka, BD</p>
                </div>
                <CloudSun size={48} className="text-harvest-300" />
             </div>
             <div className="mt-2 text-xs opacity-75">Updated: Just now</div>
          </div>
        </div>
      </section>

      {/* Ad Slot 1 */}
      <div className="container mx-auto px-4">
        <AdPlaceholder id="ad-slot-1" type="banner" lang={lang}>Google AdSense Banner</AdPlaceholder>
      </div>

      {/* Quick Services Grid */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/knowledge" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 text-green-700 transition">
              <Sprout />
            </div>
            <h3 className="font-semibold text-gray-800">{t.knowledge}</h3>
          </Link>
          <Link to="/weather" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
             <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 text-blue-700 transition">
              <CloudSun />
            </div>
            <h3 className="font-semibold text-gray-800">{t.weather}</h3>
          </Link>
          <Link to="/marketplace" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
             <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 text-orange-700 transition">
              <ShoppingCart />
            </div>
            <h3 className="font-semibold text-gray-800">{t.market}</h3>
          </Link>
          <Link to="/support" className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition text-center group">
             <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 text-purple-700 transition">
              <User />
            </div>
            <h3 className="font-semibold text-gray-800">{t.expertTitle}</h3>
          </Link>
        </div>
      </section>

      {/* Featured News / Ad In-Feed */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{t.recentNews}</h3>
          <Link to="/news" className="text-agri-600 text-sm font-medium flex items-center">See All <ChevronRight size={16}/></Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
           {news.slice(0, 2).map(n => (
             <div key={n.id} className="bg-white rounded-lg shadow-sm flex overflow-hidden">
                <img src={n.image} alt={n.title} className="w-1/3 object-cover" />
                <div className="p-3 flex flex-col justify-between">
                   <div>
                     <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{n.category}</span>
                     <h4 className="font-semibold text-gray-800 mt-1 line-clamp-2">{n.title}</h4>
                   </div>
                   <span className="text-xs text-gray-500">{n.date}</span>
                </div>
             </div>
           ))}
        </div>
        <AdPlaceholder id="ad-slot-4" type="in-feed" lang={lang}>In-Feed Ad</AdPlaceholder>
      </section>
    </div>
  );
};

const SupportPage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'expert'>('diagnosis');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{
    id: 'init', role: 'model', text: lang === 'bn' ? 'নমস্কার! আমি আপনার কৃষি সহকারী। কিভাবে সাহায্য করতে পারি?' : 'Hello! I am your agriculture assistant. How can I help?'
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setAnalysisResult('');
        
        // Auto start analysis
        setIsAnalyzing(true);
        const base64Data = base64.split(',')[1];
        const result = await analyzePlantDisease(base64Data, lang);
        setAnalysisResult(result);
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsChatLoading(true);

    const reply = await chatWithExpert(newUserMsg.text, chatHistory, lang);
    
    setChatHistory(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: reply }]);
    setIsChatLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-6 text-agri-800">{t.support}</h2>
      
      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-full p-1 mb-6 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('diagnosis')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === 'diagnosis' ? 'bg-white shadow text-agri-700' : 'text-gray-500'}`}
        >
          {t.diagnosisTitle}
        </button>
        <button 
          onClick={() => setActiveTab('expert')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === 'expert' ? 'bg-white shadow text-agri-700' : 'text-gray-500'}`}
        >
          {t.expertTitle}
        </button>
      </div>

      {activeTab === 'diagnosis' ? (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div 
             className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition"
             onClick={() => fileInputRef.current?.click()}
           >
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
             {selectedImage ? (
                <img src={selectedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" />
             ) : (
                <div className="flex flex-col items-center">
                  <Upload className="text-agri-500 mb-2" size={48} />
                  <p className="text-gray-600 font-medium">{t.uploadImage}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.diagnosisSubtitle}</p>
                </div>
             )}
           </div>

           {isAnalyzing && (
             <div className="mt-6 text-center text-agri-600 flex items-center justify-center gap-2">
               <div className="animate-spin h-5 w-5 border-2 border-agri-600 border-t-transparent rounded-full"></div>
               {t.analyzing}
             </div>
           )}

           {analysisResult && (
             <div className="mt-6 bg-agri-50 p-4 rounded-lg border border-agri-100">
               <h4 className="font-bold text-agri-800 mb-2">AI Analysis Result:</h4>
               <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{analysisResult}</p>
             </div>
           )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
             {chatHistory.map(msg => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-agri-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                   {msg.text}
                 </div>
               </div>
             ))}
             {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 rounded-bl-none flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
             )}
           </div>
           <div className="p-3 border-t flex gap-2">
             <input 
               type="text" 
               className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-agri-500" 
               placeholder={t.askExpert}
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
             />
             <button 
               onClick={handleSendMessage}
               disabled={isChatLoading || !chatInput.trim()}
               className="bg-agri-600 text-white p-2 rounded-full hover:bg-agri-700 disabled:opacity-50"
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

const WeatherPage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { weather } = useData(); // Use data from context
  const [locationName, setLocationName] = useState('Dhaka, Bangladesh');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleLocateMe = () => {
    setLoadingLocation(true);
    // Simulation of geolocation API
    setTimeout(() => {
        setLocationName('Comilla, Bangladesh (GPS)');
        setLoadingLocation(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.weather}</h2>
        <button 
            onClick={handleLocateMe}
            className="flex items-center gap-1 text-sm bg-agri-100 text-agri-700 px-3 py-1 rounded-full hover:bg-agri-200"
        >
            <MapPin size={16} /> {loadingLocation ? '...' : t.locateMe}
        </button>
      </div>
      
      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white p-6 shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-xl font-medium">{locationName}</h3>
            <div className="text-6xl font-bold mt-2">32°</div>
            <p className="text-blue-100 mt-1">Sunny • Feels like 38°</p>
          </div>
          <div className="text-center">
            <CloudSun size={64} className="mx-auto mb-2 text-yellow-300" />
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">{t.humidity}: 65%</div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-4 text-center">
          <div>
            <div className="flex justify-center items-center gap-1 text-xs opacity-75"><Wind size={12}/> {t.wind}</div>
            <p className="font-semibold">12 km/h</p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-1 text-xs opacity-75"><Thermometer size={12}/> Pressure</div>
            <p className="font-semibold">1012 hPa</p>
          </div>
          <div>
            <div className="flex justify-center items-center gap-1 text-xs opacity-75"><CloudSun size={12}/> UV</div>
            <p className="font-semibold">High</p>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg mb-4 text-gray-700">{t.days7}</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
        {weather.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
             <span className="w-20 font-medium text-gray-600">{w.day}</span>
             <span className="text-2xl">{w.icon}</span>
             <span className="w-24 text-right">
               <span className="font-bold">{w.temp}°</span> <span className="text-gray-400 text-sm">/ {w.temp - 8}°</span>
             </span>
             <span className="text-sm text-gray-500 w-24 text-right hidden md:block">{w.condition}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <AdPlaceholder id="ad-slot-3" type="banner" lang={lang}>Weather Page Footer Ad</AdPlaceholder>
      </div>
    </div>
  );
};

const MarketplacePage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { market } = useData();

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.market}</h2>
        <button className="bg-agri-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-agri-700">
          + Sell Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {market.map((item, index) => (
          <React.Fragment key={item.id}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-agri-600 font-bold">{item.price}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{item.type}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500 flex flex-col gap-1">
                  <div className="flex items-center gap-1"><User size={14}/> {item.seller}</div>
                  <div className="flex items-center gap-1"><MapPin size={14}/> {item.location}</div>
                </div>
                <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 text-sm">Contact Seller</button>
              </div>
            </div>
            {/* Insert Ad after every 2 items */}
            {(index + 1) % 2 === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
                 <AdPlaceholder id={`market-ad-${index}`} type="in-feed" lang={lang}>Marketplace Sponsored Ad</AdPlaceholder>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const KnowledgePage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { crops } = useData();

  return (
    <div className="container mx-auto px-4 py-6 pb-20 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.knowledge}</h2>
        
        <div className="mb-6">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        <h3 className="text-lg font-bold mb-3 text-agri-700">{t.seasonalCrops}</h3>
        <div className="space-y-4">
          {crops.map(crop => (
            <div key={crop.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 transition hover:shadow-md">
              <img src={crop.image} alt={crop.name} className="w-24 h-24 rounded-lg object-cover bg-gray-100" />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{crop.name}</h4>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1"><span className="font-semibold">{t.soilSeason}:</span> {crop.season}</p>
                <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Guide available</span>
                    <Link to={`/crop/${crop.id}`} className="text-agri-600 text-sm font-medium hover:underline flex items-center">
                        {t.readMore} <ChevronRight size={16}/>
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar with Ads */}
      <div className="w-full md:w-80 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <h3 className="font-bold border-b pb-2 mb-2">Categories</h3>
           <ul className="space-y-2 text-gray-600">
             <li className="hover:text-agri-600 cursor-pointer">Soil Health</li>
             <li className="hover:text-agri-600 cursor-pointer">Fertilizers</li>
             <li className="hover:text-agri-600 cursor-pointer">Pest Control</li>
             <li className="hover:text-agri-600 cursor-pointer">Irrigation</li>
           </ul>
        </div>
        <AdPlaceholder id="ad-slot-2" type="sidebar" lang={lang}>Sidebar Ad</AdPlaceholder>
      </div>
    </div>
  );
};

const CropDetailsPage = ({ lang }: { lang: Language }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const t = TRANSLATIONS[lang];
    const { crops } = useData();
    const crop = crops.find(c => c.id === id);

    if (!crop) return <div className="p-8 text-center">Crop not found</div>;

    return (
        <div className="container mx-auto px-4 py-6 pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-4 hover:text-agri-600">
                <ArrowLeft size={20} className="mr-1"/> Back
            </button>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-64 overflow-hidden relative">
                    <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <h1 className="text-3xl font-bold text-white">{crop.name}</h1>
                        <p className="text-white/90">{crop.season}</p>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed text-lg">{crop.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                            <h3 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                                <Droplets size={20}/> {t.fertilizerUsage}
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {crop.fertilizers.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                        </div>

                        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                            <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-3">
                                <Bug size={20}/> {t.pestDisease}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold text-sm text-orange-700 uppercase">Pests</span>
                                    <ul className="list-disc list-inside text-gray-700 text-sm">
                                        {crop.pests.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-semibold text-sm text-orange-700 uppercase">Diseases</span>
                                    <ul className="list-disc list-inside text-gray-700 text-sm">
                                        {crop.diseases.map((d, i) => <li key={i}>{d}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 md:col-span-2">
                             <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-3">
                                <Shovel size={20}/> {t.harvesting}
                            </h3>
                            <p className="text-gray-700">{crop.harvesting}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <AdPlaceholder id="article-ad-1" type="article-ad" lang={lang}>Sponsored Agricultural Product</AdPlaceholder>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsPage = ({ lang }: { lang: Language }) => {
    const t = TRANSLATIONS[lang];
    const { news } = useData();
    const [activeTab, setActiveTab] = useState<'all' | 'loan' | 'training'>('all');

    const filteredNews = activeTab === 'all' 
        ? news 
        : news.filter(n => activeTab === 'loan' ? n.category === 'Loan' : n.category === 'Training');

    return (
        <div className="container mx-auto px-4 py-6 pb-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.news}</h2>

            <div className="flex space-x-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${activeTab === 'all' ? 'bg-agri-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    {t.newsTabs.all}
                </button>
                <button 
                    onClick={() => setActiveTab('loan')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${activeTab === 'loan' ? 'bg-agri-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    {t.newsTabs.loans}
                </button>
                <button 
                    onClick={() => setActiveTab('training')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition ${activeTab === 'training' ? 'bg-agri-600 text-white' : 'bg-white border border-gray-300 text-gray-700'}`}
                >
                    {t.newsTabs.training}
                </button>
            </div>

            <div className="space-y-6">
                {filteredNews.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="md:w-1/3 relative">
                            <img src={item.image} alt={item.title} className="w-full h-48 md:h-full object-cover" />
                            {item.category === 'Training' && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white opacity-80" />
                                </div>
                            )}
                        </div>
                        <div className="p-5 md:w-2/3 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                                        item.category === 'Loan' ? 'bg-blue-100 text-blue-700' : 
                                        item.category === 'Training' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mt-2 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
                            </div>
                            
                            {item.category === 'Training' ? (
                                <button className="mt-4 flex items-center gap-2 text-red-600 font-medium hover:text-red-700">
                                    <PlayCircle size={18}/> {t.watchVideo}
                                </button>
                            ) : (
                                <button className="mt-4 text-agri-600 font-medium hover:text-agri-700 flex items-center gap-1">
                                    {t.readMore} <ChevronRight size={16}/>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                 <AdPlaceholder id="ad-slot-news-feed" type="in-feed" lang={lang}>Sponsored Content</AdPlaceholder>
            </div>
        </div>
    );
};

// --- Layout Wrapper for Standard App Pages ---
const MainLayout = ({ lang, setLang, children }: { lang: Language, setLang: (l: Language) => void, children?: React.ReactNode }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header lang={lang} setLang={setLang} toggleMenu={() => setMenuOpen(true)} />
            <MobileMenu isOpen={menuOpen} close={() => setMenuOpen(false)} lang={lang} />
            <main className="flex-grow">
                {children}
            </main>
            <BottomNav lang={lang} />
            <footer className="bg-gray-800 text-gray-300 py-8 hidden md:block">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 KrishiBondhu. All rights reserved.</p>
                    <div className="flex justify-center gap-4 mt-2 text-sm">
                        <Link to="/admin/dashboard" className="hover:text-white">Admin Login</Link>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- Main App Root ---

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('bn');

  return (
    <HashRouter>
        <DataProvider>
            <Routes>
                {/* Admin Routes (No Header/Footer from Main App) */}
                <Route path="/admin/*" element={<AdminPage />} />

                {/* Main App Routes (Wrapped in Layout) */}
                <Route path="*" element={
                    <MainLayout lang={lang} setLang={setLang}>
                        <Routes>
                            <Route path="/" element={<HomePage lang={lang} />} />
                            <Route path="/knowledge" element={<KnowledgePage lang={lang} />} />
                            <Route path="/crop/:id" element={<CropDetailsPage lang={lang} />} />
                            <Route path="/weather" element={<WeatherPage lang={lang} />} />
                            <Route path="/support" element={<SupportPage lang={lang} />} />
                            <Route path="/marketplace" element={<MarketplacePage lang={lang} />} />
                            <Route path="/news" element={<NewsPage lang={lang} />} />
                        </Routes>
                    </MainLayout>
                } />
            </Routes>
        </DataProvider>
    </HashRouter>
  );
};

export default App;