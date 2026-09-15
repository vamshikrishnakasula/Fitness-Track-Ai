import React, { useState } from 'react';
import {
  User,
  Target,
  Calculator,
  Save,
  Check,
  Flame,
  Droplets,
  Footprints,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileGoalsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

export const ProfileGoalsView: React.FC<ProfileGoalsViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-calculate optimal macros using Mifflin-St Jeor equation
  const handleAutoCalculate = () => {
    // BMR formula
    let bmr = 10 * formData.weightKg + 6.25 * formData.heightCm - 5 * formData.age;
    bmr += formData.gender === 'female' ? -161 : 5;

    // Activity multiplier
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
    };
    const tdee = Math.round(bmr * (multipliers[formData.activityLevel] || 1.55));

    // Goal adjustment
    let targetCalories = tdee;
    if (formData.goal === 'fat_loss') targetCalories = Math.round(tdee - 450);
    else if (formData.goal === 'muscle_gain') targetCalories = Math.round(tdee + 300);

    // Macros: Protein = 2.2g per kg bodyweight
    const proteinTarget = Math.round(formData.weightKg * 2.2);
    // Fats: 25% of total calories (9 kcal/g)
    const fatTarget = Math.round((targetCalories * 0.25) / 9);
    // Carbs: Remaining calories (4 kcal/g)
    const remainingKcal = targetCalories - (proteinTarget * 4 + fatTarget * 9);
    const carbsTarget = Math.max(100, Math.round(remainingKcal / 4));

    setFormData((prev) => ({
      ...prev,
      dailyCalorieTarget: targetCalories,
      proteinTarget,
      carbsTarget,
      fatTarget,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Profile & Fitness Targets
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize your biometrics, fitness goals, and daily macronutrient allocations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoCalculate}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-1.5"
          title="Recalculate calories using scientific formula"
        >
          <Calculator className="w-4 h-4" />
          <span>Auto-Calculate Targets</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Biometrics */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Personal Biometrics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Goals & Activity Level */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Primary Focus & Lifestyle</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Primary Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="fat_loss">Fat Loss & Calorie Deficit</option>
                <option value="muscle_gain">Hypertrophy & Lean Muscle Gain</option>
                <option value="maintenance">Maintenance & Longevity</option>
                <option value="endurance">Cardiovascular Endurance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Weekly Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="light">Lightly Active (1-3 days/week)</option>
                <option value="moderate">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week hard training)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Targets */}
        <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Daily Intake & Macro Targets</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={formData.dailyCalorieTarget}
                onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-400 mb-1">Protein Goal (g)</label>
              <input
                type="number"
                value={formData.proteinTarget}
                onChange={(e) => setFormData({ ...formData, proteinTarget: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-sky-400 mb-1">Carbs Goal (g)</label>
              <input
                type="number"
                value={formData.carbsTarget}
                onChange={(e) => setFormData({ ...formData, carbsTarget: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sky-400 font-bold text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-400 mb-1">Fat Goal (g)</label>
              <input
                type="number"
                value={formData.fatTarget}
                onChange={(e) => setFormData({ ...formData, fatTarget: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-bold text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-cyan-400 mb-1">Water Target (ml)</label>
              <input
                type="number"
                value={formData.waterTargetMl}
                onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-bold text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Daily Step Goal</label>
              <input
                type="number"
                value={formData.stepGoal}
                onChange={(e) => setFormData({ ...formData, stepGoal: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Profile saved successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
