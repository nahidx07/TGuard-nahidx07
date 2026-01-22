
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ShieldCheck, 
  Users, 
  Activity, 
  Settings as SettingsIcon,
  Bell,
  Search,
  Menu,
  X,
  ExternalLink,
  Database,
  Globe,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import LogViewer from './components/LogViewer';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'broadcast' | 'settings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSetWebhook = async () => {
    if (!webhookUrl) return;
    setIsSettingWebhook(true);
    setWebhookStatus(null);
    
    try {
      // এই কলটি সরাসরি ক্লায়েন্ট থেকে করলে CORS ইস্যু হতে পারে, 
      // তবে এটি ডেমো হিসেবে দেখানো হয়েছে। প্রোডাকশনে এটি আপনার নিজস্ব API এর মাধ্যমে করা উচিত।
      const token = "YOUR_BOT_TOKEN_HERE"; // ইউজারকে ম্যানুয়ালি ইনপুট দিতে বলতে পারেন
      const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`);
      const data = await response.json();
      
      if (data.ok) {
        setWebhookStatus({ success: true, message: "Webhook set successfully!" });
      } else {
        setWebhookStatus({ success: false, message: data.description || "Failed to set webhook." });
      }
    } catch (error) {
      setWebhookStatus({ success: false, message: "Network error. Make sure to use your Bot Token." });
    } finally {
      setIsSettingWebhook(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Mobile Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 rounded-full shadow-lg text-white"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:static z-40 w-64 h-full glass border-r border-slate-800 flex flex-col
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              TeleGuard
            </h1>
          </div>

          <nav className="space-y-2">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
            />
            <NavItem 
              icon={<Activity size={20} />} 
              label="Audit Logs" 
              active={activeTab === 'logs'} 
              onClick={() => setActiveTab('logs')}
            />
            <NavItem 
              icon={<MessageSquare size={20} />} 
              label="Broadcast" 
              active={activeTab === 'broadcast'} 
              onClick={() => setActiveTab('broadcast')}
            />
            <NavItem 
              icon={<SettingsIcon size={20} />} 
              label="Settings" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Bot Engine v2.4 Active</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-slate-400 text-sm">Managing telegram link-only moderation bot.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            <button className="p-2 glass rounded-lg text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && <Dashboard />}
        {activeTab === 'logs' && <LogViewer />}
        {activeTab === 'broadcast' && <AdminPanel />}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Webhook Quick Setup */}
            <div className="glass rounded-2xl p-8 border border-slate-800 bg-gradient-to-r from-blue-600/5 to-transparent">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Globe className="text-blue-500" />
                Webhook Registration
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-slate-400">আপনার বটের কাজ শুরু করতে Vercel বা অন্য কোনো সার্ভারের API URL এখানে সেট করুন।</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="https://your-app.vercel.app/api/telegram" 
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <button 
                    onClick={handleSetWebhook}
                    disabled={isSettingWebhook}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSettingWebhook ? <Loader2 className="animate-spin" size={20} /> : 'Register Webhook'}
                  </button>
                </div>
                {webhookStatus && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${webhookStatus.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {webhookStatus.success ? <CheckCircle2 size={16} /> : <X size={16} />}
                    {webhookStatus.message}
                  </div>
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-8 border border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <SettingsIcon className="text-blue-500" />
                Bot Configuration
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-200 text-sm">
                  Configuration is managed via environment variables on Vercel for security.
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Admin IDs (CSV)</label>
                  <input 
                    type="text" 
                    disabled 
                    value="12345678, 87654321" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Bot API Token</label>
                  <input 
                    type="password" 
                    disabled 
                    value="********************************" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg p-3 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Firebase Connection Guide */}
            <div className="glass rounded-2xl p-8 border border-slate-800">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Database className="text-amber-500" />
                Firebase Setup Guide
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 font-bold">1</div>
                  <div>
                    <p className="font-medium">Download Service Account JSON</p>
                    <p className="text-sm text-slate-400">Firebase Console > Project Settings > Service Accounts > Generate new private key.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 font-bold">2</div>
                  <div>
                    <p className="font-medium">Encode to Base64</p>
                    <p className="text-sm text-slate-400">JSON ফাইলের ভেতরের সব কন্টেন্ট কপি করে Base64 স্ট্রিং এ কনভার্ট করুন।</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 font-bold">3</div>
                  <div>
                    <p className="font-medium">Vercel Environment Variable</p>
                    <p className="text-sm text-slate-400">নাম দিন: <code>FIREBASE_SERVICE_ACCOUNT_B64</code> এবং ভ্যালু হিসেবে এনকোড করা স্ট্রিংটি দিন।</p>
                  </div>
                </div>
                <a 
                  href="https://console.firebase.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-medium mt-2"
                >
                  Firebase Console <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${active 
        ? 'bg-blue-600/10 text-blue-400 shadow-sm border border-blue-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default App;
