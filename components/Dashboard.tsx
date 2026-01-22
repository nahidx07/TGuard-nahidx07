
import React from 'react';
import { 
  Users, 
  Trash2, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { name: 'Mon', deleted: 400, allowed: 240 },
  { name: 'Tue', deleted: 300, allowed: 139 },
  { name: 'Wed', deleted: 200, allowed: 980 },
  { name: 'Thu', deleted: 278, allowed: 390 },
  { name: 'Fri', deleted: 189, allowed: 480 },
  { name: 'Sat', deleted: 239, allowed: 380 },
  { name: 'Sun', deleted: 349, allowed: 430 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Subscribers" 
          value="12,482" 
          trend="+12%" 
          icon={<Users className="text-blue-500" />} 
        />
        <StatCard 
          label="Messages Moderated" 
          value="452,019" 
          trend="+5.4%" 
          icon={<CheckCircle className="text-emerald-500" />} 
        />
        <StatCard 
          label="Links Deleted" 
          value="8,291" 
          trend="+18%" 
          icon={<Trash2 className="text-red-500" />} 
        />
        <StatCard 
          label="Real-time Health" 
          value="99.9%" 
          trend="Stable" 
          icon={<TrendingUp className="text-amber-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-slate-800 h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="text-blue-500" />
              Moderation Activity
            </h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Allowed</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Deleted</div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDeleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="allowed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAllowed)" />
                <Area type="monotone" dataKey="deleted" stroke="#ef4444" fillOpacity={1} fill="url(#colorDeleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Active Groups */}
        <div className="glass rounded-2xl p-6 border border-slate-800">
          <h3 className="text-lg font-bold mb-6">Top Moderated Groups</h3>
          <div className="space-y-4">
            {[
              { name: '@CryptoNewsChannel', count: 1240, color: 'bg-blue-500' },
              { name: '@GlobalChat_EN', count: 982, color: 'bg-emerald-500' },
              { name: '@TelegramPromotion', count: 745, color: 'bg-amber-500' },
              { name: '@GroupLinkShare', count: 621, color: 'bg-purple-500' },
              { name: '@DevsCommunity', count: 432, color: 'bg-rose-500' },
            ].map((group, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${group.color} flex items-center justify-center font-bold text-white text-xs`}>
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">{group.name}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{group.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode }> = ({ label, value, trend, icon }) => (
  <div className="glass rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-slate-900 rounded-xl">{icon}</div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
        {trend}
      </span>
    </div>
    <div className="space-y-1">
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default Dashboard;
