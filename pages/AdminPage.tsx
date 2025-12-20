import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, Newspaper, ShoppingCart, LogOut, Plus, Edit, Trash2, Save, X, RotateCcw, Video } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Crop, NewsItem, MarketItem } from '../types';

// --- Authentication ---
const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') { // Simple hardcoded password for demo
      onLogin();
    } else {
      setError('Invalid Password (Try: admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-agri-800 mb-6 text-center">Admin Panel Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-agri-500"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-agri-600 text-white py-2 rounded hover:bg-agri-700">Login</button>
        </form>
        <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-agri-600">Back to App</Link>
      </div>
    </div>
  );
};

// --- Dashboard Layout ---
const DashboardLayout = ({ children, onLogout }: { children?: React.ReactNode, onLogout: () => void }) => {
  const location = useLocation();
  const { resetData } = useData();
  
  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/admin/crops', icon: Sprout, label: 'Crops' },
    { path: '/admin/news', icon: Newspaper, label: 'News & Training' },
    { path: '/admin/market', icon: ShoppingCart, label: 'Marketplace' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="bg-agri-800 text-white w-full md:w-64 flex-shrink-0">
        <div className="p-4 border-b border-agri-700">
          <h1 className="text-xl font-bold">KB Admin</h1>
          <p className="text-xs text-agri-300">Content Management</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded transition ${location.pathname.startsWith(item.path) ? 'bg-agri-700' : 'hover:bg-agri-700/50'}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
          <button onClick={resetData} className="w-full flex items-center gap-3 p-3 rounded hover:bg-red-900/50 text-red-200 mt-8">
            <RotateCcw size={20} /> Reset Data
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 rounded hover:bg-agri-700/50 text-agri-200">
            <LogOut size={20} /> Logout
          </button>
          <Link to="/" className="w-full flex items-center gap-3 p-3 rounded hover:bg-agri-700/50 text-agri-200 mt-2 border-t border-agri-700">
             Back to Site
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
};

// --- Overview Component ---
const Overview = () => {
  const { crops, news, market } = useData();
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Total Crops</p>
              <h3 className="text-3xl font-bold">{crops.length}</h3>
            </div>
            <Sprout size={32} className="text-green-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">News Articles</p>
              <h3 className="text-3xl font-bold">{news.length}</h3>
            </div>
            <Newspaper size={32} className="text-blue-500 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">Market Listings</p>
              <h3 className="text-3xl font-bold">{market.length}</h3>
            </div>
            <ShoppingCart size={32} className="text-orange-500 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Crops Manager ---
const CropsManager = () => {
  const { crops, deleteCrop, addCrop, updateCrop } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCrop, setCurrentCrop] = useState<Partial<Crop>>({});

  const handleEdit = (crop: Crop) => {
    setCurrentCrop(crop);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentCrop({ 
      id: Date.now().toString(), 
      name: '', 
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600',
      description: '', 
      season: '',
      soil: '',
      fertilizers: [],
      pests: [],
      diseases: [],
      harvesting: ''
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if(crops.find(c => c.id === currentCrop.id)) {
        updateCrop(currentCrop as Crop);
    } else {
        addCrop(currentCrop as Crop);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{crops.find(c => c.id === currentCrop.id) ? 'Edit Crop' : 'New Crop'}</h2>
          <button onClick={() => setIsEditing(false)}><X className="text-gray-500"/></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <input type="text" placeholder="Crop Name" required className="w-full border p-2 rounded" value={currentCrop.name} onChange={e => setCurrentCrop({...currentCrop, name: e.target.value})} />
          <input type="text" placeholder="Image URL" required className="w-full border p-2 rounded" value={currentCrop.image} onChange={e => setCurrentCrop({...currentCrop, image: e.target.value})} />
          <input type="text" placeholder="Season" required className="w-full border p-2 rounded" value={currentCrop.season} onChange={e => setCurrentCrop({...currentCrop, season: e.target.value})} />
          <input type="text" placeholder="Soil Type" required className="w-full border p-2 rounded" value={currentCrop.soil} onChange={e => setCurrentCrop({...currentCrop, soil: e.target.value})} />
          <textarea placeholder="Description" required className="w-full border p-2 rounded h-24" value={currentCrop.description} onChange={e => setCurrentCrop({...currentCrop, description: e.target.value})} />
          
          <div>
            <label className="block text-sm font-medium mb-1">Fertilizers (comma separated)</label>
            <input type="text" className="w-full border p-2 rounded" value={currentCrop.fertilizers?.join(', ')} onChange={e => setCurrentCrop({...currentCrop, fertilizers: e.target.value.split(',').map(s => s.trim())})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pests (comma separated)</label>
            <input type="text" className="w-full border p-2 rounded" value={currentCrop.pests?.join(', ')} onChange={e => setCurrentCrop({...currentCrop, pests: e.target.value.split(',').map(s => s.trim())})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Diseases (comma separated)</label>
            <input type="text" className="w-full border p-2 rounded" value={currentCrop.diseases?.join(', ')} onChange={e => setCurrentCrop({...currentCrop, diseases: e.target.value.split(',').map(s => s.trim())})} />
          </div>
          
          <textarea placeholder="Harvesting Guide" required className="w-full border p-2 rounded h-24" value={currentCrop.harvesting} onChange={e => setCurrentCrop({...currentCrop, harvesting: e.target.value})} />

          <button type="submit" className="bg-agri-600 text-white px-6 py-2 rounded hover:bg-agri-700 flex items-center gap-2"><Save size={18}/> Save Crop</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Crops</h2>
        <button onClick={handleCreate} className="bg-agri-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-agri-700">
          <Plus size={20} /> Add Crop
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Season</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {crops.map(crop => (
              <tr key={crop.id} className="hover:bg-gray-50">
                <td className="p-4"><img src={crop.image} alt={crop.name} className="w-12 h-12 rounded object-cover" /></td>
                <td className="p-4 font-medium">{crop.name}</td>
                <td className="p-4 text-gray-600">{crop.season}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(crop)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                    <button onClick={() => deleteCrop(crop.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- News Manager ---
const NewsManager = () => {
    const { news, deleteNews, addNews, updateNews } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentNews, setCurrentNews] = useState<Partial<NewsItem>>({});
  
    const handleEdit = (item: NewsItem) => {
      setCurrentNews(item);
      setIsEditing(true);
    };
  
    const handleCreate = () => {
      setCurrentNews({ 
        id: Date.now().toString(), 
        title: '', 
        summary: '',
        date: new Date().toLocaleDateString('bn-BD'),
        category: 'News',
        image: 'https://images.unsplash.com/photo-1595838788863-29a3e373b436?auto=format&fit=crop&w=600',
        videoUrl: ''
      });
      setIsEditing(true);
    };
  
    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if(news.find(n => n.id === currentNews.id)) {
          updateNews(currentNews as NewsItem);
      } else {
          addNews(currentNews as NewsItem);
      }
      setIsEditing(false);
    };
  
    if (isEditing) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{news.find(n => n.id === currentNews.id) ? 'Edit News' : 'New News'}</h2>
            <button onClick={() => setIsEditing(false)}><X className="text-gray-500"/></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <input type="text" placeholder="Title" required className="w-full border p-2 rounded" value={currentNews.title} onChange={e => setCurrentNews({...currentNews, title: e.target.value})} />
            <select className="w-full border p-2 rounded" value={currentNews.category} onChange={e => setCurrentNews({...currentNews, category: e.target.value as any})}>
                <option value="News">General News</option>
                <option value="Loan">Loan & Subsidy</option>
                <option value="Training">Training Video</option>
            </select>
            <input type="text" placeholder="Image URL" required className="w-full border p-2 rounded" value={currentNews.image} onChange={e => setCurrentNews({...currentNews, image: e.target.value})} />
            {currentNews.category === 'Training' && (
                <input type="text" placeholder="Video Embed URL" className="w-full border p-2 rounded" value={currentNews.videoUrl} onChange={e => setCurrentNews({...currentNews, videoUrl: e.target.value})} />
            )}
            <input type="text" placeholder="Date" required className="w-full border p-2 rounded" value={currentNews.date} onChange={e => setCurrentNews({...currentNews, date: e.target.value})} />
            <textarea placeholder="Summary" required className="w-full border p-2 rounded h-32" value={currentNews.summary} onChange={e => setCurrentNews({...currentNews, summary: e.target.value})} />
  
            <button type="submit" className="bg-agri-600 text-white px-6 py-2 rounded hover:bg-agri-700 flex items-center gap-2"><Save size={18}/> Save Article</button>
          </form>
        </div>
      );
    }
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage News & Training</h2>
          <button onClick={handleCreate} className="bg-agri-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-agri-700">
            <Plus size={20} /> Add News
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {news.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                      <div className="relative w-12 h-12">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
                        {item.category === 'Training' && <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded"><Video size={16} className="text-white"/></div>}
                      </div>
                  </td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded ${item.category === 'Training' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.category}
                      </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.date}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit size={18} /></button>
                      <button onClick={() => deleteNews(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// --- Market Manager ---
const MarketManager = () => {
    const { market, deleteMarketItem, addMarketItem, deleteMarketItem: deleteItem } = useData();
    // Re-using same pattern... simplified for brevity
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<MarketItem>>({});

    // ... (Handlers similar to Crops/News would go here, simplified for demo)
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Marketplace Listings</h2>
                {/* Simplified: No Create for Market in this demo View */}
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Seller</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {market.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={item.image} className="w-10 h-10 rounded object-cover"/>
                                    {item.name}
                                </td>
                                <td className="p-4 text-green-600 font-bold">{item.price}</td>
                                <td className="p-4">{item.seller} <div className="text-xs text-gray-500">{item.location}</div></td>
                                <td className="p-4">
                                    <button onClick={() => deleteItem(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// --- Main Admin Router ---
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check simple session storage for persistence on refresh (optional enhancement)
  // For this demo, just state.

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <Routes>
        <Route path="dashboard" element={<Overview />} />
        <Route path="crops" element={<CropsManager />} />
        <Route path="news" element={<NewsManager />} />
        <Route path="market" element={<MarketManager />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminPage;