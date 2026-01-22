
import React, { useState } from 'react';
import { Send, Users, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Simulate broadcasting process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSentCount(12482); // Example total subscribers
    setIsSending(false);
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="glass rounded-2xl p-8 border border-slate-800">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Send className="text-blue-500" />
          Global Broadcast
        </h3>
        
        <form onSubmit={handleBroadcast} className="space-y-6">
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-xs text-amber-200">
              Broadcasting sends a push notification to all <strong>12,482</strong> users who have started the bot. Please use responsibly.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Message Content</label>
            <textarea 
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to send to all bot subscribers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">{message.length} characters</span>
            <button 
              type="submit"
              disabled={isSending || !message.trim()}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                ${isSending || !message.trim() 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                }
              `}
            >
              {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {isSending ? 'Sending...' : 'Start Broadcast'}
            </button>
          </div>
        </form>

        {sentCount > 0 && (
          <div className="mt-8 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
            Successfully broadcasted to {sentCount.toLocaleString()} users!
          </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="glass rounded-2xl p-8 border border-slate-800">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="text-purple-500" />
            Subscriber Distribution
          </h3>
          <div className="space-y-6">
            <DistributionBar label="Active Today" percentage={45} color="bg-blue-500" count="5,617" />
            <DistributionBar label="New This Week" percentage={18} color="bg-emerald-500" count="2,246" />
            <DistributionBar label="Inactive (30d+)" percentage={37} color="bg-slate-700" count="4,619" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-800 bg-gradient-to-br from-blue-600/10 to-transparent">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>
            <div>
              <h4 className="font-bold">Automated Guard</h4>
              <p className="text-xs text-slate-400">Rules active and enforcing.</p>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Link validation is set to strict mode. All t.me links are verified against Telegram servers before being permitted in monitored groups.
          </p>
        </div>
      </div>
    </div>
  );
};

const DistributionBar: React.FC<{ label: string; percentage: number; color: string; count: string }> = ({ label, percentage, color, count }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-slate-400">{label}</span>
      <span className="text-white">{count} ({percentage}%)</span>
    </div>
    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  </div>
);

export default AdminPanel;
