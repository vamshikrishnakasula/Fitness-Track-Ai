import React from 'react';
import {
  Flame,
  Utensils,
  Dumbbell,
  Droplets,
  Sparkles,
  Footprints,
  Clock,
  ArrowRight,
  Plus,
  TrendingUp,
  Award,
  ChevronRight,
} from 'lucide-react';
import { DailyStats, UserProfile, FoodItem, WorkoutActivity } from '../../types';

interface DashboardViewProps {
  dailyStats: DailyStats;
  profile: UserProfile;
  meals: FoodItem[];
  workouts: WorkoutActivity[];
  onOpenAiScan: () => void;
  onOpenQuickLog: (tab?: 'meal' | 'workout' | 'water') => void;
  onSelectTab: (tab: string) => void;
  onAddWater: (delta: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dailyStats,
  profile,
  meals,
  workouts,
  onOpenAiScan,
  onOpenQuickLog,
  onSelectTab,
  onAddWater,
}) => {
  // Calorie calculations
  const targetKcal = dailyStats.calorieTarget;
  const consumedKcal = dailyStats.caloriesConsumed;
  const burnedKcal = dailyStats.caloriesBurned;
  const remainingKcal = Math.max(0, targetKcal - consumedKcal);
  const caloriePercent = Math.min(100, Math.round((consumedKcal / targetKcal) * 100));

  // Macros calculations
  const proteinPercent = Math.min(100, Math.round((dailyStats.proteinConsumed / dailyStats.proteinTarget) * 100));
  const carbsPercent = Math.min(100, Math.round((dailyStats.carbsConsumed / dailyStats.carbsTarget) * 100));
  const fatPercent = Math.min(100, Math.round((dailyStats.fatConsumed / dailyStats.fatTarget) * 100));

  // Water calculations
  const waterPercent = Math.min(100, Math.round((dailyStats.waterConsumedMl / dailyStats.waterTargetMl) * 100));

  // Circular progress SVG math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Hero Calorie & Activity Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Big Calorie Target Circular Card */}
        <div className="lg:col-span-7 bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Daily Calorie Target</span>
              <h2 className="text-xl font-extrabold text-white mt-0.5">Energy & Nutrition Balance</h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              Goal: {targetKcal} kcal
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Radial Calorie Meter */}
            <div className="relative flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="url(#calorieGradient)"
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered Stat */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">{remainingKcal}</span>
                <span className="text-[11px] font-bold uppercase text-slate-400">kcal remaining</span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">{caloriePercent}% filled</span>
              </div>
            </div>

            {/* Breakdown Mini Cards */}
            <div className="w-full sm:w-auto flex flex-row sm:flex-col gap-3 justify-center">
              <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 min-w-[130px]">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consumed</span>
                </div>
                <div className="text-lg font-bold text-white">{consumedKcal} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              </div>

              <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 min-w-[130px]">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Burned</span>
                </div>
                <div className="text-lg font-bold text-white">{burnedKcal} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              </div>

              <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 min-w-[130px]">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Net Calories</span>
                </div>
                <div className="text-lg font-bold text-white">{dailyStats.netCalories} <span className="text-xs font-normal text-slate-400">kcal</span></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Focus: <b className="text-slate-200 capitalize">{profile.goal.replace('_', ' ')}</b></span>
            <button
              onClick={() => onSelectTab('food_log')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
            >
              View Full Food Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Macro Nutrients & Hydration Stack */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Macronutrients Card */}
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Daily Macronutrients</span>
              </h3>
              <span className="text-[11px] text-slate-400">Target Goals</span>
            </div>

            <div className="space-y-3.5">
              {/* Protein */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-400">Protein</span>
                  <span className="text-slate-300 font-medium">
                    {dailyStats.proteinConsumed} / <span className="text-slate-400">{dailyStats.proteinTarget}g</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${proteinPercent}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-sky-400">Carbohydrates</span>
                  <span className="text-slate-300 font-medium">
                    {dailyStats.carbsConsumed} / <span className="text-slate-400">{dailyStats.carbsTarget}g</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${carbsPercent}%` }}
                  />
                </div>
              </div>

              {/* Fats */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-400">Dietary Fats</span>
                  <span className="text-slate-300 font-medium">
                    {dailyStats.fatConsumed} / <span className="text-slate-400">{dailyStats.fatTarget}g</span>
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${fatPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hydration Card */}
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Hydration Tracker</h4>
                  <p className="text-[11px] text-slate-400">{dailyStats.waterConsumedMl} of {dailyStats.waterTargetMl} ml</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onAddWater(250)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold text-xs border border-cyan-500/30 transition active:scale-95"
                >
                  +250 ml
                </button>
                <button
                  onClick={() => onAddWater(-250)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium text-xs transition"
                  title="Remove 250ml"
                >
                  -
                </button>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. AI Food Scanner Banner (Hero Callout from GreatStack tutorial) */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini AI Vision</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Scan Your Meal for Instant Calorie & Macro AI Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Upload or snap any food photo. Our AI automatically calculates calories, grams of protein, carbs, fats, portion size, and health density score.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto z-10">
          <button
            id="dash-scan-food-btn"
            onClick={onOpenAiScan}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>Launch AI Scanner</span>
          </button>
          <button
            onClick={() => onSelectTab('ai_coach')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <span>Ask AI Coach</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Grid: Today's Logged Meals & Today's Logged Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Meals */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Today's Meals</h3>
                <p className="text-xs text-slate-400">{meals.length} items logged today</p>
              </div>
            </div>
            <button
              onClick={() => onOpenQuickLog('meal')}
              className="flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Meal</span>
            </button>
          </div>

          <div className="space-y-3">
            {meals.slice(0, 3).map((meal) => (
              <div
                key={meal.id}
                className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 flex-shrink-0">
                      🥗
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{meal.name}</p>
                    <p className="text-[11px] text-slate-400 capitalize">
                      {meal.mealType} • {meal.portion}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{meal.protein}g P</span>
                      <span>{meal.carbs}g C</span>
                      <span>{meal.fat}g F</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-black text-white">{meal.calories}</span>
                  <span className="text-[10px] text-slate-400 block font-medium">kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Workouts */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Today's Workouts</h3>
                <p className="text-xs text-slate-400">{dailyStats.activeMinutes} mins active</p>
              </div>
            </div>
            <button
              onClick={() => onOpenQuickLog('workout')}
              className="flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Activity</span>
            </button>
          </div>

          <div className="space-y-3">
            {workouts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <Dumbbell className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No workouts logged yet today.</p>
                <button
                  onClick={() => onOpenQuickLog('workout')}
                  className="mt-3 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs transition"
                >
                  Log Your First Workout
                </button>
              </div>
            ) : (
              workouts.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs border border-orange-500/20">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{w.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {w.duration} mins
                        </span>
                        <span>•</span>
                        <span className="capitalize px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
                          {w.intensity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-orange-400">+{w.caloriesBurned}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">kcal burned</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
