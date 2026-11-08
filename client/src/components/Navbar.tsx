import React, { useState, useEffect } from 'react';
import { Search, Flame, Clock, Sparkles, Bell, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenQuickAsk?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenQuickAsk, onLogout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);

  useEffect(() => {
    // Quick health probe
    fetch('/api/system/health')
      .then(res => res.ok ? setIsBackendHealthy(true) : setIsBackendHealthy(false))
      .catch(() => setIsBackendHealthy(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Route to appropriate view based on query
    const q = searchQuery.toLowerCase();
    if (q.includes('code') || q.includes('python') || q.includes('c') || q.includes('sum')) {
      navigate('/coding');
    } else if (q.includes('exam') || q.includes('quiz') || q.includes('pyq')) {
      navigate('/exams');
    } else if (q.includes('note') || q.includes('summary')) {
      navigate('/notes');
    } else if (q.includes('plan') || q.includes('schedule') || q.includes('pomodoro')) {
      navigate('/planner');
    } else {
      navigate('/tutor');
    }
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-[#0B0D12]/90 backdrop-blur-md border-b border-[#232936] px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search subjects, topics, PYQs, coding problems... (Enter)"
          className="w-full bg-[#151923] border border-[#232936] rounded-lg pl-10 pr-12 py-1.5 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#94A3B8] bg-[#232936] px-1.5 py-0.5 rounded border border-slate-700">
          /
        </kbd>
      </form>

      {/* Stats & Quick Actions */}
      <div className="flex items-center gap-4">
        {/* System Health Status */}
        <div 
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#151923] border border-[#232936] text-[11px]"
          title={isBackendHealthy ? 'Backend Node.js & DB Connected' : 'Offline Mode (Local Engine Active)'}
        >
          {isBackendHealthy ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono">Backend Live</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-amber-400 font-mono">Local Store</span>
            </>
          )}
        </div>

        {/* Streak Counter */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-semibold">
            <Flame size={15} className="fill-amber-400 text-amber-400" />
            <span>{user.streakDays} Day Streak</span>
          </div>
        )}

        {/* Total Study Hours */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-xs font-semibold">
            <Clock size={15} />
            <span>{user.totalStudyHours} hrs</span>
          </div>
        )}

        {/* AI Quick Tutor Action Button */}
        <button
          onClick={() => {
            if (onOpenQuickAsk) onOpenQuickAsk();
            else navigate('/assistant');
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          <Sparkles size={14} />
          <span>Ask AI Tutor</span>
        </button>
        {onLogout && <button onClick={onLogout} className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">Log out</button>}
      </div>
    </header>
  );
};
