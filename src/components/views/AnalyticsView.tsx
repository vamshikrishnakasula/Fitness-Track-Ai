import React from 'react';
import {
  TrendingUp,
  Flame,
  Utensils,
  Droplets,
  Award,
  Calendar,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { WeeklyDataPoint, UserProfile, DailyStats } from '../../types';

interface AnalyticsViewProps {
  weeklyData: WeeklyDataPoint[];
  profile: UserProfile;
  dailyStats: DailyStats;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  weeklyData,
  profile,
  dailyStats,
}) => {
  // Max calorie for scaling bars
  const maxCalorieVal = Math.max(...weeklyData.map((d) => Math.max(d.caloriesConsumed, d.caloriesBurned)), 2600);

  // Weight progress calculations
  const weightToLose = Math.max(0, profile.weightKg - profile.targetWeightKg);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Performance & Nutrition Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Weekly trends, calorie deficit tracking, and milestone progress.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          <div>
            <span className="text-sm font-bold text-white">{profile.streakDays} Days Consistent</span>
            <span className="text-[10px] text-slate-400 block">Weekly Streak</span>
          </div>
        </div>
      </div>

      {/* 7-Day Calorie Comparison Chart (Consumed vs Burned) */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>7-Day Calorie Balance (Intake vs Burned)</span>
            </h3>
            <p className="text-xs text-slate-400">Comparing calories consumed against workout energy expenditure</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-emerald-500" />
              <span className="text-slate-300">Intake (kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-md bg-orange-500" />
              <span className="text-slate-300">Burned (kcal)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-56 pt-8 items-end">
          {weeklyData.map((d, index) => {
            const consumedHeight = Math.round((d.caloriesConsumed / maxCalorieVal) * 100);
            const burnedHeight = Math.round((d.caloriesBurned / maxCalorieVal) * 100);

            return (
              <div key={index} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full pb-2">
                  {/* Consumed Bar */}
                  <div
                    style={{ height: `${consumedHeight}%` }}
                    className="w-3 sm:w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all group-hover:brightness-125 relative"
                    title={`Consumed: ${d.caloriesConsumed} kcal`}
                  />
                  {/* Burned Bar */}
                  <div
                    style={{ height: `${burnedHeight}%` }}
                    className="w-3 sm:w-5 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all group-hover:brightness-125 relative"
                    title={`Burned: ${d.caloriesBurned} kcal`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Macronutrient Ratios & Weight Goal Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Macronutrient Distribution */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Target Macro Ratios</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-emerald-400">Protein (35%)</span>
                <span className="text-slate-300 font-bold">{profile.proteinTarget}g / day</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[35%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-sky-400">Carbohydrates (45%)</span>
                <span className="text-slate-300 font-bold">{profile.carbsTarget}g / day</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 w-[45%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-amber-400">Fats (20%)</span>
                <span className="text-slate-300 font-bold">{profile.fatTarget}g / day</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Weight & Body Composition */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Weight & Body Goal</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-medium block">Current Weight</span>
                <span className="text-2xl font-black text-white">{profile.weightKg} <span className="text-xs font-normal">kg</span></span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-xs text-slate-400 font-medium block">Target Goal</span>
                <span className="text-2xl font-black text-emerald-400">{profile.targetWeightKg} <span className="text-xs font-normal">kg</span></span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>Progress to Target:</span>
                <span className="text-emerald-400">{weightToLose > 0 ? `${weightToLose.toFixed(1)} kg to go` : 'Goal Reached!'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                At your current daily caloric target of {profile.dailyCalorieTarget} kcal, your estimated rate of change is ~0.45 kg per week.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Primary Focus: <b className="text-white capitalize">{profile.goal.replace('_', ' ')}</b></span>
            <span className="text-emerald-400 font-bold">On Track</span>
          </div>
        </div>
      </div>
    </div>
  );
};
