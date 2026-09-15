import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Plus,
  Clock,
  Trash2,
  Zap,
  CheckCircle2,
  Calendar,
  Activity,
  Layers,
} from 'lucide-react';
import { WorkoutActivity, WorkoutCategory, WorkoutIntensity, WorkoutPreset } from '../../types';
import { workoutPresets } from '../../data/mockData';

interface WorkoutsViewProps {
  workouts: WorkoutActivity[];
  onAddWorkout: (workout: {
    title: string;
    category: WorkoutCategory;
    duration: number;
    intensity: WorkoutIntensity;
    caloriesBurned: number;
    notes?: string;
  }) => Promise<void>;
  onDeleteWorkout: (id: string) => Promise<void>;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  workouts,
  onAddWorkout,
  onDeleteWorkout,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('weight_training');
  const [duration, setDuration] = useState<number | ''>(45);
  const [intensity, setIntensity] = useState<WorkoutIntensity>('high');
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>(320);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Preset Logger
  const handleLogPreset = async (preset: WorkoutPreset) => {
    setIsSubmitting(true);
    try {
      await onAddWorkout({
        title: preset.title,
        category: preset.category,
        duration: preset.defaultDuration,
        intensity: preset.intensity,
        caloriesBurned: preset.estimatedCalories,
        notes: `Preset: ${preset.exercises.slice(0, 2).join(', ')}...`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || duration === '') return;
    setIsSubmitting(true);
    try {
      await onAddWorkout({
        title,
        category,
        duration: Number(duration),
        intensity,
        caloriesBurned: Number(caloriesBurned || Number(duration) * 8),
        notes,
      });
      setTitle('');
      setNotes('');
      setShowLogModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalCaloriesBurned = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Workouts & Activity Tracker
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 font-bold border border-orange-500/20">
              {workouts.length} Sessions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total activity today: <b className="text-white">{totalMinutes} mins</b> •{' '}
            <b className="text-orange-400">+{totalCaloriesBurned} kcal</b> burned
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Custom Workout</span>
        </button>
      </div>

      {/* Recommended Workout Routines (GreatStack Presets) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Recommended Workout Splits & Routines</span>
          </h3>
          <span className="text-xs text-slate-400">GreatStack Training Library</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workoutPresets.map((preset) => (
            <div
              key={preset.id}
              className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {preset.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-orange-400">
                    ~{preset.estimatedCalories} kcal
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{preset.description}</p>

                {/* Key exercises bullet */}
                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  {preset.exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="flex items-center gap-1.5 truncate">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span className="truncate">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {preset.defaultDuration} mins
                </span>
                <button
                  onClick={() => handleLogPreset(preset)}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log This</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logged Workouts History */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-400" />
          <span>Logged Workout History</span>
        </h3>

        {workouts.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No workouts logged yet. Pick one of the routines above or tap "Log Custom Workout".
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/20 flex-shrink-0">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{w.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="capitalize">{w.category.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{w.duration} mins</span>
                      <span>•</span>
                      <span className="capitalize text-slate-300 font-medium">{w.intensity} intensity</span>
                    </div>
                    {w.notes && (
                      <p className="text-[11px] text-slate-400 mt-1 truncate max-w-md">"{w.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-base font-black text-orange-400">+{w.caloriesBurned}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">kcal burned</span>
                  </div>
                  <button
                    onClick={() => onDeleteWorkout(w.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                    title="Delete Workout"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Workout Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Log Custom Workout</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Workout Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest Hypertrophy, Outdoor Run, HIIT"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                    <option value="yoga">Yoga / Stretch</option>
                    <option value="boxing">Boxing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Duration (mins) *</label>
                  <input
                    type="number"
                    required
                    value={duration}
                    onChange={(e) => {
                      const d = e.target.value === '' ? '' : Number(e.target.value);
                      setDuration(d);
                      if (d) setCaloriesBurned(Math.round(Number(d) * 8.5));
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
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="extreme">Extreme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Calories Burned</label>
                  <input
                    type="number"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Notes / Sets (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 4 sets of deadlifts, felt energetic"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
