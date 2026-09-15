export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;   // in grams
  portion: string; // e.g. "1 plate (350g)"
  imageUrl?: string;
  healthScore?: number; // 1 - 10
  aiTips?: string;
  timestamp: string; // ISO date string
}

export interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  estimatedPortion: string;
  healthScore: number;
  confidence: string;
  insights: string[];
  recommendations: string;
}

export type WorkoutCategory = 
  | 'weight_training'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'hiit'
  | 'walking'
  | 'yoga'
  | 'boxing';

export type WorkoutIntensity = 'low' | 'moderate' | 'high' | 'extreme';

export interface WorkoutActivity {
  id: string;
  title: string;
  category: WorkoutCategory;
  duration: number; // in minutes
  intensity: WorkoutIntensity;
  caloriesBurned: number;
  notes?: string;
  timestamp: string; // ISO date string
}

export interface WorkoutPreset {
  id: string;
  title: string;
  category: WorkoutCategory;
  defaultDuration: number;
  intensity: WorkoutIntensity;
  estimatedCalories: number;
  description: string;
  exercises: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  waterTargetMl: number;
  stepGoal: number;
  streakDays: number;
}

export interface DailyStats {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  calorieTarget: number;
  netCalories: number;
  proteinConsumed: number;
  proteinTarget: number;
  carbsConsumed: number;
  carbsTarget: number;
  fatConsumed: number;
  fatTarget: number;
  waterConsumedMl: number;
  waterTargetMl: number;
  steps: number;
  stepGoal: number;
  activeMinutes: number;
}

export interface CoachMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface WeeklyDataPoint {
  day: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterMl: number;
  workoutsCompleted: number;
}
