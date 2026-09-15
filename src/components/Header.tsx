import React from 'react';
import { Flame, Plus, Sparkles, Droplets, Dumbbell, Bell, Calendar } from 'lucide-react';
import { UserProfile, DailyStats } from '../types';

interface HeaderProps {
  profile: UserProfile;
  dailyStats: DailyStats;
  onOpenQuickLog: (tab?: 'meal' | 'workout' | 'water') => void;
  onOpenAiScan: () => void;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  dailyStats,
  onOpenQuickLog,
  onOpenAiScan,
  onSelectTab,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const remainingKcal = Math.max(0, dailyStats.calorieTarget - dailyStats.caloriesConsumed);

  return (
    <header className="sticky top-0 z-30 bg-[#0d1424]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Date and Motivational Greeting */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs font-medium text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentDate}</span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Welcome back, <span className="text-emerald-400">{profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {remainingKcal} kcal remaining to hit today's target
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Calorie Pill status */}
          <div
            onClick={() => onSelectTab('food_log')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition"
            title="Today's Calories Consumed"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              {dailyStats.caloriesConsumed} / {dailyStats.calorieTarget} <span className="text-slate-400 font-normal">kcal</span>
            </span>
          </div>

          {/* Streak Badge */}
          <div
            onClick={() => onSelectTab('analytics')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition"
            title="Current Workout & Nutrition Streak"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{profile.streakDays}d Streak</span>
          </div>

          {/* AI Scan Quick CTA */}
          <button
            id="header-ai-scan-btn"
            onClick={onOpenAiScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden xs:inline">Scan Food AI</span>
          </button>

          {/* Quick Log Dropdown/Modal Trigger */}
          <button
            id="header-quick-log-btn"
            onClick={() => onOpenQuickLog('meal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* User Profile Avatar */}
          <button
            id="header-profile-btn"
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-800/80 transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 text-xs shadow">
              {profile.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
