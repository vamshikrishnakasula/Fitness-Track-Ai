import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickLogModal } from './components/QuickLogModal';
import { DashboardView } from './components/views/DashboardView';
import { AiScannerView } from './components/views/AiScannerView';
import { FoodLogView } from './components/views/FoodLogView';
import { WorkoutsView } from './components/views/WorkoutsView';
import { AiCoachView } from './components/views/AiCoachView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ProfileGoalsView } from './components/views/ProfileGoalsView';
import {
  UserProfile,
  DailyStats,
  FoodItem,
  WorkoutActivity,
  WeeklyDataPoint,
  MealType,
  WorkoutCategory,
  WorkoutIntensity,
} from './types';
import {
  initialProfile,
  sampleFoodItems,
  sampleWorkouts,
  weeklyHistory,
} from './data/mockData';
import { api } from './services/api';
import { Menu } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [quickLogInitialTab, setQuickLogInitialTab] = useState<'meal' | 'workout' | 'water'>('meal');

  // App data state
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [meals, setMeals] = useState<FoodItem[]>(sampleFoodItems);
  const [workouts, setWorkouts] = useState<WorkoutActivity[]>(sampleWorkouts);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>(weeklyHistory);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    caloriesConsumed: 1310,
    caloriesBurned: 600,
    calorieTarget: 2300,
    netCalories: 710,
    proteinConsumed: 102,
    proteinTarget: 175,
    carbsConsumed: 138,
    carbsTarget: 240,
    fatConsumed: 33,
    fatTarget: 60,
    waterConsumedMl: 2250,
    waterTargetMl: 3000,
    steps: 8420,
    stepGoal: 10000,
    activeMinutes: 73,
  });

  // Fetch initial data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, mealsData, workoutsData, statsData, weeklyStats] = await Promise.all([
          api.getProfile().catch(() => initialProfile),
          api.getMeals().catch(() => sampleFoodItems),
          api.getWorkouts().catch(() => sampleWorkouts),
          api.getDailyStats().catch(() => null),
          api.getWeeklyStats().catch(() => weeklyHistory),
        ]);

        if (profData) setProfile(profData);
        if (mealsData) setMeals(mealsData);
        if (workoutsData) setWorkouts(workoutsData);
        if (statsData) setDailyStats(statsData);
        if (weeklyStats) setWeeklyData(weeklyStats);
      } catch (err) {
        console.error('Failed to fetch data from server:', err);
      }
    };

    fetchData();
  }, []);

  // Handlers for data updates
  const handleAddMeal = async (newMealData: {
    name: string;
    mealType: MealType;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    portion: string;
    imageUrl?: string;
    healthScore?: number;
    aiTips?: string;
  }) => {
    try {
      const added = await api.addMeal(newMealData);
      setMeals((prev) => [added, ...prev]);
      // refresh stats
      const stats = await api.getDailyStats();
      setDailyStats(stats);
    } catch (err) {
      // Local fallback
      const localItem: FoodItem = {
        id: 'f-' + Date.now(),
        ...newMealData,
        timestamp: new Date().toISOString(),
      };
      setMeals((prev) => [localItem, ...prev]);
      setDailyStats((prev) => ({
        ...prev,
        caloriesConsumed: prev.caloriesConsumed + newMealData.calories,
        proteinConsumed: prev.proteinConsumed + newMealData.protein,
        carbsConsumed: prev.carbsConsumed + newMealData.carbs,
        fatConsumed: prev.fatConsumed + newMealData.fat,
      }));
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await api.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
      const stats = await api.getDailyStats();
      setDailyStats(stats);
    } catch (err) {
      setMeals((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleAddWorkout = async (newWorkoutData: {
    title: string;
    category: WorkoutCategory;
    duration: number;
    intensity: WorkoutIntensity;
    caloriesBurned: number;
    notes?: string;
  }) => {
    try {
      const added = await api.addWorkout(newWorkoutData);
      setWorkouts((prev) => [added, ...prev]);
      const stats = await api.getDailyStats();
      setDailyStats(stats);
    } catch (err) {
      const localWorkout: WorkoutActivity = {
        id: 'w-' + Date.now(),
        ...newWorkoutData,
        timestamp: new Date().toISOString(),
      };
      setWorkouts((prev) => [localWorkout, ...prev]);
      setDailyStats((prev) => ({
        ...prev,
        caloriesBurned: prev.caloriesBurned + newWorkoutData.caloriesBurned,
        activeMinutes: prev.activeMinutes + newWorkoutData.duration,
      }));
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await api.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      const stats = await api.getDailyStats();
      setDailyStats(stats);
    } catch (err) {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleAddWater = async (delta: number) => {
    try {
      const res = await api.updateWater({ delta });
      setDailyStats((prev) => ({ ...prev, waterConsumedMl: res.waterConsumedMl }));
    } catch (err) {
      setDailyStats((prev) => ({
        ...prev,
        waterConsumedMl: Math.max(0, prev.waterConsumedMl + delta),
      }));
    }
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const res = await api.updateProfile(updated);
      setProfile(res.profile);
      const stats = await api.getDailyStats();
      setDailyStats(stats);
    } catch (err) {
      setProfile((prev) => ({ ...prev, ...updated }));
    }
  };

  const openQuickLog = (tab: 'meal' | 'workout' | 'water' = 'meal') => {
    setQuickLogInitialTab(tab);
    setIsQuickLogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#090D16] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-black text-base text-white tracking-tight">FitTrack</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
            AI
          </span>
        </div>
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30"
        >
          {profile.name.charAt(0)}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        dailyStats={dailyStats}
        profile={profile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Desktop Header */}
        <Header
          profile={profile}
          dailyStats={dailyStats}
          onOpenQuickLog={openQuickLog}
          onOpenAiScan={() => setActiveTab('ai_scan')}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              dailyStats={dailyStats}
              profile={profile}
              meals={meals}
              workouts={workouts}
              onOpenAiScan={() => setActiveTab('ai_scan')}
              onOpenQuickLog={openQuickLog}
              onSelectTab={(tab) => setActiveTab(tab)}
              onAddWater={handleAddWater}
            />
          )}

          {activeTab === 'ai_scan' && (
            <AiScannerView
              onAddMeal={handleAddMeal}
              onNavigateToFoodLog={() => setActiveTab('food_log')}
            />
          )}

          {activeTab === 'food_log' && (
            <FoodLogView
              meals={meals}
              dailyStats={dailyStats}
              onDeleteMeal={handleDeleteMeal}
              onOpenQuickLog={openQuickLog}
              onOpenAiScan={() => setActiveTab('ai_scan')}
            />
          )}

          {activeTab === 'workouts' && (
            <WorkoutsView
              workouts={workouts}
              onAddWorkout={handleAddWorkout}
              onDeleteWorkout={handleDeleteWorkout}
            />
          )}

          {activeTab === 'ai_coach' && (
            <AiCoachView
              profile={profile}
              dailyStats={dailyStats}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              weeklyData={weeklyData}
              profile={profile}
              dailyStats={dailyStats}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileGoalsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}
        </main>
      </div>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        initialTab={quickLogInitialTab}
        onAddMeal={handleAddMeal}
        onAddWorkout={handleAddWorkout}
        onAddWater={handleAddWater}
        onLaunchAiScan={() => {
          setIsQuickLogOpen(false);
          setActiveTab('ai_scan');
        }}
      />
    </div>
  );
}

export default App;
