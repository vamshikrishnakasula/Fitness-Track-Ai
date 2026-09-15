import {
  FoodItem,
  WorkoutActivity,
  UserProfile,
  DailyStats,
  FoodAnalysisResult,
  CoachMessage,
  WeeklyDataPoint,
} from '../types';

export const api = {
  // 1. Health check
  async getHealth(): Promise<{ status: string; appName: string; hasGeminiKey: boolean }> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  // 2. User Profile
  async getProfile(): Promise<UserProfile> {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // 3. Meals & Foods
  async getMeals(): Promise<FoodItem[]> {
    const res = await fetch('/api/meals');
    if (!res.ok) throw new Error('Failed to fetch meals');
    return res.json();
  },

  async addMeal(meal: Omit<FoodItem, 'id' | 'timestamp'>): Promise<FoodItem> {
    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meal),
    });
    if (!res.ok) throw new Error('Failed to log meal');
    return res.json();
  },

  async deleteMeal(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/meals/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete meal');
    return res.json();
  },

  // 4. Workouts
  async getWorkouts(): Promise<WorkoutActivity[]> {
    const res = await fetch('/api/workouts');
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return res.json();
  },

  async addWorkout(workout: Omit<WorkoutActivity, 'id' | 'timestamp'>): Promise<WorkoutActivity> {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    if (!res.ok) throw new Error('Failed to log workout');
    return res.json();
  },

  async deleteWorkout(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete workout');
    return res.json();
  },

  // 5. Daily Stats & Hydration
  async getDailyStats(): Promise<DailyStats> {
    const res = await fetch('/api/stats/daily');
    if (!res.ok) throw new Error('Failed to fetch daily stats');
    return res.json();
  },

  async updateWater(payload: { delta?: number; total?: number }): Promise<{ waterConsumedMl: number }> {
    const res = await fetch('/api/water', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update water');
    return res.json();
  },

  async updateSteps(steps: number): Promise<{ steps: number }> {
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps }),
    });
    if (!res.ok) throw new Error('Failed to update steps');
    return res.json();
  },

  async getWeeklyStats(): Promise<WeeklyDataPoint[]> {
    const res = await fetch('/api/stats/weekly');
    if (!res.ok) throw new Error('Failed to fetch weekly stats');
    return res.json();
  },

  // 6. Gemini Food Scanner
  async scanFood(payload: {
    imageBase64?: string;
    mimeType?: string;
    description?: string;
  }): Promise<FoodAnalysisResult> {
    const res = await fetch('/api/ai/scan-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI Food Analysis failed');
    return res.json();
  },

  // 7. Gemini AI Fitness Coach
  async coachChat(payload: {
    message: string;
    history: CoachMessage[];
    profile?: UserProfile;
  }): Promise<{ text: string; suggestions: string[] }> {
    const res = await fetch('/api/ai/coach-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('AI Coach chat failed');
    return res.json();
  },
};
