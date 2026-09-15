import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  Flame,
  Dumbbell,
  Apple,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { CoachMessage, UserProfile, DailyStats } from '../../types';
import { api } from '../../services/api';

interface AiCoachViewProps {
  profile: UserProfile;
  dailyStats: DailyStats;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({ profile, dailyStats }) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Hello ${profile.name.split(' ')[0]}! I'm Coach Titan, your dedicated AI Fitness & Sports Nutrition Coach. 

I see you're focusing on **${profile.goal.replace('_', ' ')}**. Today, you've logged **${dailyStats.caloriesConsumed} / ${dailyStats.calorieTarget} kcal** and **${dailyStats.proteinConsumed} / ${dailyStats.proteinTarget}g** of protein.

Whether you need a custom workout routine, meal planning, form tips, or advice on breaking plateaus, ask me anything!`,
      timestamp: new Date().toISOString(),
      suggestions: [
        'Suggest 3 high-protein meals under 500 kcal',
        'Build me a 4-day Push-Pull-Legs split',
        'How much water should I drink on workout days?',
        'Best post-workout recovery tips',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage.trim();
    if (!message || isTyping) return;

    const userMsg: CoachMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await api.coachChat({
        message,
        history: [...messages, userMsg],
        profile,
      });

      const assistantMsg: CoachMessage = {
        id: 'bot-' + Date.now(),
        role: 'assistant',
        text: response.text,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          role: 'assistant',
          text: "I'm having a slight delay connecting to the training server. Keep pushing your daily macro targets and stay hydrated!",
          timestamp: new Date().toISOString(),
          suggestions: ['Suggest high-protein snacks', 'Give me a leg day workout'],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'reset-1',
        role: 'assistant',
        text: `Hey ${profile.name}! Chat reset. Ready for a new workout plan, nutrition calculation, or advice. What's on your mind?`,
        timestamp: new Date().toISOString(),
        suggestions: [
          'How to optimize my calorie deficit?',
          'What is progressive overload?',
          'Quick 20-min dumbbell home workout',
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-130px)] flex flex-col bg-[#101726] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Coach Titan AI</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Certified Personal Trainer & Sports Dietitian • Gemini 3.8 Flash
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1.5"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-xs shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
                }`}
              >
                {msg.text}
              </div>

              {/* Suggestions chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="text-[11px] px-3 py-1 rounded-full bg-slate-900 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Coach Titan about workouts, nutrition, macros, or recovery..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
