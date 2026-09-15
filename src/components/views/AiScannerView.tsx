import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Plus,
  Flame,
  Check,
  Zap,
} from 'lucide-react';
import { FoodAnalysisResult, MealType } from '../../types';
import { sampleFoodScanDemos } from '../../data/mockData';
import { api } from '../../services/api';

interface AiScannerViewProps {
  onAddMeal: (meal: {
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
  }) => Promise<void>;
  onNavigateToFoodLog: () => void;
}

export const AiScannerView: React.FC<AiScannerViewProps> = ({
  onAddMeal,
  onNavigateToFoodLog,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(sampleFoodScanDemos[0].image);
  const [foodDescription, setFoodDescription] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<FoodAnalysisResult | null>(sampleFoodScanDemos[0].analysis);
  const [targetMealType, setTargetMealType] = useState<MealType>('lunch');
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setScanResult(null);
      setIsAdded(false);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Quick Demo Selector
  const handleSelectDemo = (demo: typeof sampleFoodScanDemos[0]) => {
    setSelectedImage(demo.image);
    setScanResult(demo.analysis);
    setIsAdded(false);
    setFoodDescription(demo.name);
    setErrorMessage(null);
  };

  // Perform AI Scan
  const handleScanWithAi = async () => {
    if (!selectedImage && !foodDescription) {
      setErrorMessage('Please upload a meal photo or enter a meal description.');
      return;
    }

    setIsScanning(true);
    setErrorMessage(null);
    setIsAdded(false);

    try {
      const result = await api.scanFood({
        imageBase64: selectedImage || undefined,
        description: foodDescription || undefined,
      });
      setScanResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI Scan failed. Please check your network or try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Add to today's food log
  const handleSaveToLog = async () => {
    if (!scanResult) return;
    try {
      await onAddMeal({
        name: scanResult.foodName,
        mealType: targetMealType,
        calories: scanResult.calories,
        protein: scanResult.protein,
        carbs: scanResult.carbs,
        fat: scanResult.fat,
        fiber: scanResult.fiber,
        portion: scanResult.estimatedPortion,
        imageUrl: selectedImage || undefined,
        healthScore: scanResult.healthScore,
        aiTips: scanResult.recommendations,
      });
      setIsAdded(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add to food log.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Title & Introduction */}
      <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash Vision</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Food & Calorie Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Take or upload a picture of your dish. Our neural vision model estimates calories, macronutrient ratios (Protein, Carbs, Fats), portion weights, and nutritional health scores in seconds.
          </p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <span className="text-[11px] font-semibold text-slate-400 w-full text-center md:text-right">
            Try Demo Meals:
          </span>
          {sampleFoodScanDemos.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDemo(demo)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              {demo.name.split(' ')[0]} {demo.name.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Body: Split Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>1. Upload Food Photo</span>
              {selectedImage && (
                <span className="text-xs font-normal text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              )}
            </h3>

            {/* Drag and Drop Zone or Preview Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square sm:aspect-4/3 w-full rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/70 bg-slate-900/80 cursor-pointer overflow-hidden group flex flex-col items-center justify-center p-4 transition-all"
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Meal Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {/* Scanning Animation Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase animate-pulse">
                        Analyzing Macros & Calories...
                      </span>
                      {/* Laser scanning bar */}
                      <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-bounce shadow-lg shadow-emerald-400" />
                    </div>
                  )}
                  {/* Hover Re-upload Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <Camera className="w-8 h-8 text-emerald-400" />
                    <span className="text-xs font-bold">Click to change photo</span>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-3 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Drag & drop or tap to browse</p>
                    <p className="text-xs text-slate-400 mt-0.5">Supports JPG, PNG, WEBP</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Optional text context */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Additional Details (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. 2 eggs, 1 tbsp olive oil, no sauce"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Scan Trigger Button */}
            <button
              id="ai-scan-submit-btn"
              onClick={handleScanWithAi}
              disabled={isScanning || (!selectedImage && !foodDescription)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Scanning with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Analyze Calories & Macros</span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Result Panel */}
        <div className="lg:col-span-7">
          <div className="bg-[#101726] border border-slate-800 rounded-3xl p-6 shadow-xl h-full flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>2. Nutritional Breakdown</span>
                </h3>
                {scanResult && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                    Confidence: {scanResult.confidence}
                  </span>
                )}
              </div>

              {scanResult ? (
                <div className="space-y-5">
                  {/* Dish Title & Health Score */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {scanResult.foodName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Est. Portion: <span className="text-slate-200 font-semibold">{scanResult.estimatedPortion}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Health Density</span>
                      <span className="text-base font-black text-emerald-400">{scanResult.healthScore} / 10</span>
                    </div>
                  </div>

                  {/* Big Stats Bar: Calories + Macros */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
                      <span className="text-2xl font-black text-white">{scanResult.calories}</span>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mt-0.5">Calories (kcal)</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-2xl font-black text-emerald-400">{scanResult.protein}g</span>
                      <span className="text-[10px] font-bold uppercase text-emerald-300 block mt-0.5">Protein</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-center">
                      <span className="text-2xl font-black text-sky-400">{scanResult.carbs}g</span>
                      <span className="text-[10px] font-bold uppercase text-sky-300 block mt-0.5">Carbs</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <span className="text-2xl font-black text-amber-400">{scanResult.fat}g</span>
                      <span className="text-[10px] font-bold uppercase text-amber-300 block mt-0.5">Fats</span>
                    </div>
                  </div>

                  {/* Key Nutritional Insights */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Key Nutritional Findings:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-400 pl-2">
                      {scanResult.insights.map((insight, idx) => (
                        <li key={idx} className="list-disc list-inside">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
                    <span className="text-emerald-400 font-bold">Coach Advice: </span>
                    {scanResult.recommendations}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-slate-500 mx-auto flex items-center justify-center border border-slate-800">
                    <Utensils className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">No Food Analyzed Yet</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Upload a meal photo on the left or choose one of the demo meals to see the AI breakdown.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions: Log to Today's Meals */}
            {scanResult && (
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 font-medium">Log as:</span>
                  <select
                    value={targetMealType}
                    onChange={(e) => setTargetMealType(e.target.value as MealType)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">☀️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                    <option value="snack">🍎 Snack</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {isAdded ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                        <Check className="w-4 h-4" /> Added to {targetMealType}!
                      </span>
                      <button
                        onClick={onNavigateToFoodLog}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                      >
                        View Log
                      </button>
                    </div>
                  ) : (
                    <button
                      id="save-to-food-log-btn"
                      onClick={handleSaveToLog}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Log to Today's Meals</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
