import React, { useState } from 'react';
import { X, Utensils, Dumbbell, Droplets, Sparkles, Check } from 'lucide-react';
import { MealType, WorkoutCategory, WorkoutIntensity } from '../types';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'meal' | 'workout' | 'water';
  onAddMeal: (meal: {
    name: string;
    mealType: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    portion: string;
  }) => Promise<void>;
  onAddWorkout: (workout: {
    title: string;
    category: WorkoutCategory;
    duration: number;
    intensity: WorkoutIntensity;
    caloriesBurned: number;
    notes?: string;
  }) => Promise<void>;
  onAddWater: (delta: number) => Promise<void>;
  onLaunchAiScan: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'meal',
  onAddMeal,
  onAddWorkout,
  onAddWater,
  onLaunchAiScan,
}) => {
  const [activeTab, setActiveTab] = useState<'meal' | 'workout' | 'water'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Meal form state
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState<number | ''>(450);
  const [protein, setProtein] = useState<number | ''>(30);
  const [carbs, setCarbs] = useState<number | ''>(40);
  const [fat, setFat] = useState<number | ''>(12);
  const [portion, setPortion] = useState('1 serving (300g)');

  // Workout form state
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('weight_training');
  const [duration, setDuration] = useState<number | ''>(35);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('high');
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>(280);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || calories === '') return;
    setIsSubmitting(true);
    try {
      await onAddMeal({
        name: mealName,
        mealType,
        calories: Number(calories),
        protein: Number(protein || 0),
        carbs: Number(carbs || 0),
        fat: Number(fat || 0),
        portion,
      });
      // reset
      setMealName('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle || duration === '') return;
    setIsSubmitting(true);
    try {
      await onAddWorkout({
        title: workoutTitle,
        category,
        duration: Number(duration),
        intensity,
        caloriesBurned: Number(caloriesBurned || Number(duration) * 8),
        notes,
      });
      setWorkoutTitle('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaterClick = async (amount: number) => {
    setIsSubmitting(true);
    try {
      await onAddWater(amount);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#101726] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">Quick Log Activity</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-2 bg-slate-900/80 border-b border-slate-800/80 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('meal')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'meal'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food / Meal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workout')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'workout'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Workout</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('water')}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'water'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Water</span>
          </button>
        </div>

        {/* Tab 1: Food Log */}
        {activeTab === 'meal' && (
          <form onSubmit={handleMealSubmit} className="p-5 space-y-4">
            {/* AI Scan banner shortcut */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Have a photo of your food?
                </p>
                <p className="text-[11px] text-slate-400">Let Gemini AI automatically detect calories & macros.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchAiScan();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow"
              >
                Scan Photo
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Food / Meal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Grilled Chicken Rice Bowl"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Meal Time</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Calories (kcal) *</label>
                <input
                  type="number"
                  required
                  placeholder="450"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-emerald-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  placeholder="30"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-sky-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  placeholder="40"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-amber-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={fat}
                  onChange={(e) => setFat(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Log Food'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Workout Log */}
        {activeTab === 'workout' && (
          <form onSubmit={handleWorkoutSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Workout / Exercise Name *</label>
              <input
                type="text"
                required
                placeholder="e.g., Chest & Triceps Blast or 5km Outdoor Run"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="weight_training">Weight Training</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="hiit">HIIT Circuit</option>
                  <option value="swimming">Swimming</option>
                  <option value="walking">Walking</option>
                  <option value="yoga">Yoga / Mobility</option>
                  <option value="boxing">Boxing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Duration (minutes) *</label>
                <input
                  type="number"
                  required
                  placeholder="35"
                  value={duration}
                  onChange={(e) => {
                    const dur = e.target.value === '' ? '' : Number(e.target.value);
                    setDuration(dur);
                    if (dur) setCaloriesBurned(Math.round(Number(dur) * 8.5));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Intensity</label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as WorkoutIntensity)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                >
                  <option value="low">Low Intensity</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High Intensity</option>
                  <option value="extreme">Extreme / Max Effort</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Calories Burned (kcal)</label>
                <input
                  type="number"
                  placeholder="280"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Felt strong, hit 80kg bench PR"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Log Workout'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Water Tracker */}
        {activeTab === 'water' && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-500/30">
              <Droplets className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Log Water Hydration</h4>
              <p className="text-xs text-slate-400 mt-1">Tap a quick amount to add to your daily water intake:</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleWaterClick(250)}
                className="p-4 rounded-xl bg-slate-900 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/40 text-cyan-400 font-bold transition group"
              >
                <div className="text-lg group-hover:scale-110 transition">+250</div>
                <div className="text-[11px] text-slate-400 font-normal">ml (1 Cup)</div>
              </button>
              <button
                type="button"
                onClick={() => handleWaterClick(500)}
                className="p-4 rounded-xl bg-slate-900 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/40 text-cyan-400 font-bold transition group"
              >
                <div className="text-lg group-hover:scale-110 transition">+500</div>
                <div className="text-[11px] text-slate-400 font-normal">ml (1 Bottle)</div>
              </button>
              <button
                type="button"
                onClick={() => handleWaterClick(750)}
                className="p-4 rounded-xl bg-slate-900 hover:bg-cyan-500/10 border border-slate-700 hover:border-cyan-500/40 text-cyan-400 font-bold transition group"
              >
                <div className="text-lg group-hover:scale-110 transition">+750</div>
                <div className="text-[11px] text-slate-400 font-normal">ml (Shaker)</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
