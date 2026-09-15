import React from 'react';
import {
  LayoutDashboard,
  ScanLine,
  Utensils,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Target,
  Droplets,
  Flame,
  X,
} from 'lucide-react';
import { DailyStats, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  dailyStats: DailyStats;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  dailyStats,
  profile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai_scan', label: 'AI Food Scanner', icon: ScanLine, badge: 'AI' },
    { id: 'food_log', label: 'Daily Food Log', icon: Utensils },
    { id: 'workouts', label: 'Workouts & Exercises', icon: Dumbbell },
    { id: 'ai_coach', label: 'AI Coach Titan', icon: Sparkles, badge: 'Chat' },
    { id: 'analytics', label: 'Analytics & Trends', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Goals', icon: Target },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onClose();
  };

  const waterPercent = Math.min(100, Math.round((dailyStats.waterConsumedMl / dailyStats.waterTargetMl) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#090D16] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">FitTrack</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
                GreatStack Edition
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Hydration & Quick Progress Card in Sidebar */}
        <div className="p-4 border-t border-slate-800/60 space-y-3">
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <Droplets className="w-3.5 h-3.5" />
                <span>Hydration</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                {dailyStats.waterConsumedMl} / {dailyStats.waterTargetMl} ml
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* User profile compact footer */}
          <div
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/60 cursor-pointer transition"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {profile.goal.replace('_', ' ')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{profile.streakDays}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
