
import React, { useState } from 'react';
import { Clock, ShieldAlert, User, ExternalLink, Filter } from 'lucide-react';
import { ModerationLog } from '../types';

const MOCK_LOGS: ModerationLog[] = [
  { id: '1', userId: 123456, username: '@crypto_bot', action: 'DELETED', reason: 'Invalid link type (User link)', timestamp: '2 mins ago', chatId: -10012345678 },
  { id: '2', userId: 987654, username: '@user_99', action: 'WARNING', reason: 'Multiple links detected', timestamp: '5 mins ago', chatId: -10012345678 },
  { id: '3', userId: 112233, username: '@john_doe', action: 'DELETED', reason: 'Contains extra text', timestamp: '12 mins ago', chatId: -10098765432 },
  { id: '4', userId: 445566, username: '@bot_helper', action: 'DELETED', reason: 'Non-telegram link', timestamp: '24 mins ago', chatId: -10012345678 },
  { id: '5', userId: 778899, username: '@anonymous', action: 'DELETED', reason: 'Media content (Photo)', timestamp: '1 hour ago', chatId: -10012345678 },
];

const LogViewer: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

  return (
    <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/30">
        <h3 className="font-bold flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          System Audit Events
        </h3>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-500" />
          <select 
            className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Events</option>
            <option value="DELETED">Deletions</option>
            <option value="WARNING">Warnings</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold">Chat ID</th>
              <th className="px-6 py-4 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className={`
                    inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase
                    ${log.action === 'DELETED' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}
                  `}>
                    <ShieldAlert size={10} />
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      <User size={14} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{log.username || 'Anonymous'}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {log.userId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-300">{log.reason}</p>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">
                  {log.chatId}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400">{log.timestamp}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900/30 text-center">
        <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">Load More Records</button>
      </div>
    </div>
  );
};

export default LogViewer;
