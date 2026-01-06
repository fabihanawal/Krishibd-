
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Home, CloudSun, Sprout, ShoppingCart, Newspaper, Stethoscope, Menu, X, Upload, Send, MapPin, User, ChevronRight, ArrowLeft, Download, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from './constants';
import { Language, ChatMessage, MarketItem } from './types';
import AdPlaceholder from './components/AdPlaceholder';
import { analyzePlantDisease, chatWithExpert } from './services/geminiService';
import { DataProvider, useData } from './contexts/DataContext';
import AdminPage from './pages/AdminPage';

// --- Formspree Integration Helper ---
const FORMSPREE_URL = "https://formspree.io/f/xaqnjjyr";

const submitToFormspree = async (data: any) => {
  try {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error("Formspree error:", error);
    return false;
  }
};

// --- Components ---

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
        if (choiceResult.outcome === 'accepted') console.log('User accepted install');
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
          <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="bg-white/20 px-2 py-1 rounded text-xs">
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
          <Link to="/admin" onClick={close} className="flex items-center gap-3 text-agri-700 p-2 rounded hover:bg-agri-50 border-t mt-4"><User size={20}/> Admin Login</Link>
        </div>
      </div>
    </div>
  );
};

// --- Form Components ---

const ContactModal = ({ item, isOpen, onClose, lang }: { item: MarketItem | null, isOpen: boolean, onClose: () => void, lang: Language }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const ok = await submitToFormspree({
      subject: `Marketplace Inquiry: ${item.name}`,
      itemName: item.name,
      itemPrice: item.price,
      seller: item.seller,
      ...data
    });

    if (ok) setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X /></button>
        
        {success ? (
          <div className="text-center py-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">{lang === 'bn' ? 'আবেদন সফল!' : 'Request Sent!'}</h3>
            <p className="text-gray-600 mb-6">{lang === 'bn' ? 'বিক্রেতা আপনার সাথে যোগাযোগ করবেন।' : 'The seller will contact you soon.'}</p>
            <button onClick={onClose} className="w-full bg-agri-600 text-white py-3 rounded-xl font-bold">বন্ধ করুন</button>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold mb-4">{lang === 'bn' ? 'বিক্রেতার সাথে যোগাযোগ' : 'Contact Seller'}</h3>
            <div className="bg-gray-50 p-3 rounded-lg mb-4 flex gap-3 items-center">
              <img src={item.image} className="w-12 h-12 rounded object-cover" />
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-agri-600 text-xs font-bold">{item.price}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{lang === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
                <input required name="name" type="text" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-agri-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                <input required name="phone" type="tel" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-agri-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{lang === 'bn' ? 'বার্তা (ঐচ্ছিক)' : 'Message (Optional)'}</label>
                <textarea name="message" className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-agri-500 h-24" />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-agri-600 text-white py-3 rounded-xl font-bold hover:bg-agri-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={20} />}
                {lang === 'bn' ? 'তথ্য পাঠান' : 'Submit Inquiry'}
              </button>
            </form>
          </>
        )}
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

      <div className="container mx-auto px-4">
        <AdPlaceholder id="ad-slot-1" type="banner" lang={lang}>Google AdSense Banner</AdPlaceholder>
      </div>

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

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{
    id: 'init', role: 'model', text: lang === 'bn' ? 'নমস্কার! আমি আপনার কৃষি সহকারী। কিভাবে সাহায্য করতে পারি?' : 'Hello! I am your agriculture assistant. How can I help?'
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setAnalysisResult('');
        setIsAnalyzing(true);
        const result = await analyzePlantDisease(base64.split(',')[1], lang);
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

  const handleExpertRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const ok = await submitToFormspree({ subject: "Offline Expert Call Request", ...data });
    if (ok) setRequestSuccess(true);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <h2 className="text-2xl font-bold text-center mb-6 text-agri-800">{t.support}</h2>
      
      <div className="flex bg-gray-200 rounded-full p-1 mb-6 max-w-md mx-auto">
        <button onClick={() => setActiveTab('diagnosis')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === 'diagnosis' ? 'bg-white shadow text-agri-700' : 'text-gray-500'}`}>{t.diagnosisTitle}</button>
        <button onClick={() => setActiveTab('expert')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeTab === 'expert' ? 'bg-white shadow text-agri-700' : 'text-gray-500'}`}>{t.expertTitle}</button>
      </div>

      {activeTab === 'diagnosis' ? (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition" onClick={() => fileInputRef.current?.click()}>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
             {selectedImage ? <img src={selectedImage} alt="Uploaded" className="max-h-64 mx-auto rounded-lg" /> : (
                <div className="flex flex-col items-center">
                  <Upload className="text-agri-500 mb-2" size={48} />
                  <p className="text-gray-600 font-medium">{t.uploadImage}</p>
                </div>
             )}
           </div>
           {isAnalyzing && <div className="mt-6 text-center text-agri-600 flex items-center justify-center gap-2"><div className="animate-spin h-5 w-5 border-2 border-agri-600 border-t-transparent rounded-full" /> {t.analyzing}</div>}
           {analysisResult && <div className="mt-6 bg-agri-50 p-4 rounded-lg border border-agri-100"><h4 className="font-bold text-agri-800 mb-2">AI Analysis:</h4><p className="text-gray-700 whitespace-pre-wrap">{analysisResult}</p></div>}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {chatHistory.map(msg => (
                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user' ? 'bg-agri-600 text-white' : 'bg-gray-100 text-gray-800'}`}>{msg.text}</div>
                 </div>
               ))}
             </div>
             <div className="p-3 border-t flex gap-2">
               <input type="text" className="flex-1 border rounded-full px-4 py-2" placeholder={t.askExpert} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
               <button onClick={handleSendMessage} className="bg-agri-600 text-white p-2 rounded-full"><Send size={20} /></button>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4">{lang === 'bn' ? 'সরাসরি বিশেষজ্ঞের কল পান' : 'Request Expert Call'}</h3>
            {requestSuccess ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                <CheckCircle2 className="mx-auto mb-2" /> {lang === 'bn' ? 'অনুরোধ গৃহীত হয়েছে!' : 'Request received!'}
              </div>
            ) : (
              <form onSubmit={handleExpertRequest} className="space-y-4">
                <input required name="name" placeholder={lang === 'bn' ? 'নাম' : 'Name'} className="w-full border p-2 rounded-lg" />
                <input required name="phone" placeholder={lang === 'bn' ? 'ফোন' : 'Phone'} className="w-full border p-2 rounded-lg" />
                <textarea required name="issue" placeholder={lang === 'bn' ? 'সমস্যার বিবরণ' : 'Description of issue'} className="w-full border p-2 rounded-lg h-24" />
                <button type="submit" className="w-full bg-harvest-500 text-white py-3 rounded-lg font-bold">{lang === 'bn' ? 'কল রিকোয়েস্ট পাঠান' : 'Request Call'}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MarketplacePage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { market } = useData();
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.market}</h2>
        <button className="bg-agri-600 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Sell Item</button>
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
                <button 
                  onClick={() => setSelectedItem(item)}
                  className="w-full mt-4 bg-gray-900 text-white py-2 rounded hover:bg-gray-800 text-sm"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <ContactModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} lang={lang} />
    </div>
  );
};

const WeatherPage = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  const { weather } = useData();
  const [locationName, setLocationName] = useState('Dhaka, Bangladesh');
  const handleLocateMe = () => {
    setLocationName('Comilla, Bangladesh (GPS)');
  };
  return (
    <div className="container mx-auto px-4 py-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.weather}</h2>
        <button onClick={handleLocateMe} className="flex items-center gap-1 text-sm bg-agri-100 text-agri-700 px-3 py-1 rounded-full"><MapPin size={16} /> {t.locateMe}</button>
      </div>
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div><h3 className="text-xl font-medium">{locationName}</h3><div className="text-6xl font-bold mt-2">32°</div><p className="text-blue-100 mt-1">Sunny • Feels like 38°</p></div>
          <div className="text-center"><CloudSun size={64} className="mx-auto mb-2 text-yellow-300" /><div className="text-sm bg-white/20 px-3 py-1 rounded-full">{t.humidity}: 65%</div></div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {weather.map((w, i) => (
          <div key={i} className="flex items-center justify-between p-4">
             <span className="w-20 font-medium text-gray-600">{w.day}</span>
             <span className="text-2xl">{w.icon}</span>
             <span className="w-24 text-right font-bold">{w.temp}° <span className="text-gray-400 text-sm">/ {w.temp - 8}°</span></span>
          </div>
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
        <div className="mb-6"><input type="text" placeholder={t.searchPlaceholder} className="w-full border rounded-lg px-4 py-3" /></div>
        <div className="space-y-4">
          {crops.map(crop => (
            <div key={crop.id} className="bg-white p-4 rounded-xl shadow-sm border flex gap-4 transition hover:shadow-md">
              <img src={crop.image} alt={crop.name} className="w-24 h-24 rounded-lg object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-lg">{crop.name}</h4>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">{t.soilSeason}:</span> {crop.season}</p>
                <div className="mt-2 text-right"><Link to={`/crop/${crop.id}`} className="text-agri-600 text-sm font-medium">{t.readMore} <ChevronRight size={16}/></Link></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsPage = ({ lang }: { lang: Language }) => {
    const t = TRANSLATIONS[lang];
    const { news } = useData();
    return (
        <div className="container mx-auto px-4 py-6 pb-20">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">{t.news}</h2>
            <div className="space-y-6">
                {news.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col md:flex-row">
                        <img src={item.image} className="md:w-1/3 h-48 md:h-auto object-cover" />
                        <div className="p-5 md:w-2/3">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.category}</span>
                            <h3 className="text-xl font-bold text-gray-800 mt-2 mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{item.summary}</p>
                            <button className="mt-4 text-agri-600 font-medium flex items-center gap-1">{t.readMore} <ChevronRight size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CropDetailsPage = ({ lang }: { lang: Language }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { crops } = useData();
    const crop = crops.find(c => c.id === id);
    if (!crop) return <div>Crop not found</div>;
    return (
        <div className="container mx-auto px-4 py-6 pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 mb-4"><ArrowLeft size={20} /> Back</button>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <img src={crop.image} className="w-full h-64 object-cover" />
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{crop.name}</h1>
                    <p className="text-gray-700 mb-6">{crop.description}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl"><strong>Fertilizers:</strong> <ul className="list-disc ml-5">{crop.fertilizers.map(f => <li key={f}>{f}</li>)}</ul></div>
                        <div className="bg-orange-50 p-4 rounded-xl"><strong>Pests:</strong> <ul className="list-disc ml-5">{crop.pests.map(p => <li key={p}>{p}</li>)}</ul></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MainLayout = ({ lang, setLang, children }: { lang: Language, setLang: (l: Language) => void, children?: React.ReactNode }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header lang={lang} setLang={setLang} toggleMenu={() => setMenuOpen(true)} />
            <MobileMenu isOpen={menuOpen} close={() => setMenuOpen(false)} lang={lang} />
            <main className="flex-grow">{children}</main>
            <BottomNav lang={lang} />
        </div>
    );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('bn');
  return (
    <HashRouter>
        <DataProvider>
            <Routes>
                <Route path="/admin/*" element={<AdminPage />} />
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
