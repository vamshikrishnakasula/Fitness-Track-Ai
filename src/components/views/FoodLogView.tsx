import React from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  Coffee,
  Sun,
  Moon,
  Apple,
} from 'lucide-react';
import { FoodItem, MealType, DailyStats } from '../../types';

interface FoodLogViewProps {
  meals: FoodItem[];
  dailyStats: DailyStats;
  onDeleteMeal: (id: string) => Promise<void>;
  onOpenQuickLog: (tab?: 'meal' | 'workout' | 'water') => void;
  onOpenAiScan: () => void;
}

export const FoodLogView: React.FC<FoodLogViewProps> = ({
  meals,
  dailyStats,
  onDeleteMeal,
  onOpenQuickLog,
  onOpenAiScan,
}) => {
  const mealSections: { type: MealType; title: string; icon: any; targetKcal: number }[] = [
    { type: 'breakfast', title: 'Breakfast', icon: Coffee, targetKcal: 550 },
    { type: 'lunch', title: 'Lunch', icon: Sun, targetKcal: 750 },
    { type: 'dinner', title: 'Dinner', icon: Moon, targetKcal: 700 },
    { type: 'snack', title: 'Snacks & Extras', icon: Apple, targetKcal: 350 },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Banner with Today's Total Macros */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Daily Food Log</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {meals.length} items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total consumed today: <b className="text-white">{dailyStats.caloriesConsumed}</b> of{' '}
            <b className="text-slate-300">{dailyStats.calorieTarget} kcal</b>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenAiScan}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>AI Food Scan</span>
          </button>
          <button
            onClick={() => onOpenQuickLog('meal')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Meal Sections */}
      <div className="space-y-5">
        {mealSections.map((section) => {
          const sectionMeals = meals.filter((m) => m.mealType === section.type);
          const totalSectionCalories = sectionMeals.reduce((acc, m) => acc + m.calories, 0);
          const totalSectionProtein = sectionMeals.reduce((acc, m) => acc + m.protein, 0);
          const totalSectionCarbs = sectionMeals.reduce((acc, m) => acc + m.carbs, 0);
          const totalSectionFat = sectionMeals.reduce((acc, m) => acc + m.fat, 0);
          const Icon = section.icon;

          return (
            <div
              key={section.type}
              className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4"
            >
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{section.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Target: ~{section.targetKcal} kcal</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{totalSectionProtein}g P</span>
                      <span>{totalSectionCarbs}g C</span>
                      <span>{totalSectionFat}g F</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-white">{totalSectionCalories}</span>
                    <span className="text-[10px] text-slate-400 block">kcal</span>
                  </div>
                  <button
                    onClick={() => onOpenQuickLog('meal')}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title={`Add food to ${section.title}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items List */}
              {sectionMeals.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col items-center justify-center gap-1.5">
                  <p>No items logged for {section.title.toLowerCase()} yet.</p>
                  <button
                    onClick={onOpenAiScan}
                    className="text-emerald-400 hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Scan or add food
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sectionMeals.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 flex-shrink-0">
                            🥗
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.portion}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span className="text-emerald-400 font-semibold">{item.protein}g Protein</span>
                            <span>•</span>
                            <span className="text-sky-400 font-semibold">{item.carbs}g Carbs</span>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">{item.fat}g Fat</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-white">{item.calories}</span>
                          <span className="text-[10px] text-slate-400 block">kcal</span>
                        </div>
                        <button
                          onClick={() => onDeleteMeal(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
