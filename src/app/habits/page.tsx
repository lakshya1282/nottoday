"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Edit2, Check, Plus, Save, X } from "lucide-react";

interface HabitWithStreak {
  id: string;
  habit_name: string;
  created_at: string;
  streaks: {
    current_streak: number;
    best_streak: number;
    total_resists: number;
  } | null;
}

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitWithStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHabitId, setActiveHabitId] = useState<string | null>(null);
  
  // Creation state
  const [newHabitName, setNewHabitName] = useState("");
  const [creating, setCreating] = useState(false);
  
  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchHabits = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // If not logged in, take them to auth
        router.push("/auth");
        return;
      }

      const activeId = localStorage.getItem("nt_habit_id");
      setActiveHabitId(activeId);

      // Fetch habits with their nested streaks
      const { data, error } = await supabase
        .from("habits")
        .select(`
          id,
          habit_name,
          created_at,
          streaks (
            current_streak,
            best_streak,
            total_resists
          )
        `)
        .eq("user_id", session.user.id);

      if (!error && data) {
        // Map raw Supabase data to our interface
        const formattedHabits = data.map((item: any) => ({
          id: item.id,
          habit_name: item.habit_name,
          created_at: item.created_at,
          streaks: Array.isArray(item.streaks) ? item.streaks[0] : item.streaks
        }));
        setHabits(formattedHabits);
      }
      setLoading(false);
    };

    fetchHabits();
  }, [router]);

  const handleSelectHabit = (habit: HabitWithStreak) => {
    localStorage.setItem("nt_habit_id", habit.id);
    localStorage.setItem("nt_habit_name", habit.habit_name);
    
    // Also update local resists scores to match this habit's streak
    if (habit.streaks) {
      localStorage.setItem("nt_resists", habit.streaks.current_streak.toString());
      localStorage.setItem("nt_best", habit.streaks.best_streak.toString());
    } else {
      localStorage.setItem("nt_resists", "0");
      localStorage.setItem("nt_best", "0");
    }

    router.push("/");
  };

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    setCreating(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;

    // 1. Insert habit
    const { data: habitData, error: habitError } = await supabase
      .from("habits")
      .insert({ user_id: session.user.id, habit_name: newHabitName.trim() })
      .select("id, habit_name, created_at")
      .single();

    if (!habitError && habitData) {
      // 2. Insert empty streak for this habit
      const { data: streakData } = await supabase
        .from("streaks")
        .insert({
          habit_id: habitData.id,
          current_streak: 0,
          best_streak: 0,
          total_resists: 0
        })
        .select("current_streak, best_streak, total_resists")
        .single();

      const newHabit: HabitWithStreak = {
        id: habitData.id,
        habit_name: habitData.habit_name,
        created_at: habitData.created_at,
        streaks: streakData || { current_streak: 0, best_streak: 0, total_resists: 0 }
      };

      setHabits(prev => [...prev, newHabit]);
      setNewHabitName("");
      
      // Auto-select if it's the only one
      if (habits.length === 0) {
        handleSelectHabit(newHabit);
      }
    }
    setCreating(false);
  };

  const handleDeleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click selection
    
    if (!window.confirm("Are you sure? This will delete all your streaks and checkin data for this habit permanently!")) {
      return;
    }

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (!error) {
      setHabits(prev => prev.filter(h => h.id !== id));
      
      // If deleted active habit, clean local storage
      if (activeHabitId === id) {
        localStorage.removeItem("nt_habit_id");
        localStorage.removeItem("nt_habit_name");
        localStorage.removeItem("nt_resists");
        localStorage.removeItem("nt_best");
        setActiveHabitId(null);
        
        // Auto-select another remaining habit if possible
        const remaining = habits.filter(h => h.id !== id);
        if (remaining.length > 0) {
          handleSelectHabit(remaining[0]);
        } else {
          router.push("/setup");
        }
      }
    }
  };

  const startEditing = (habit: HabitWithStreak, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(habit.id);
    setEditingName(habit.habit_name);
  };

  const handleRenameHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editingName.trim()) return;

    const { error } = await supabase
      .from("habits")
      .update({ habit_name: editingName.trim() })
      .eq("id", id);

    if (!error) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, habit_name: editingName.trim() } : h));
      
      // Update local storage if active
      if (activeHabitId === id) {
        localStorage.setItem("nt_habit_name", editingName.trim());
      }
      
      setEditingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center p-4">
        <p className="font-bold uppercase tracking-widest text-lg animate-pulse">Loading Habits...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col p-4 sm:p-8 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push("/")}
          className="p-2 bg-white border-2 border-black rounded-full hover:bg-[var(--accent)] transition-colors"
          style={{ boxShadow: "2px 2px 0 #000" }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ textShadow: "2px 2px 0px var(--border)" }}>
          MY HABITS
        </h1>
        <div className="w-9 h-9" /> {/* Spacer to center title */}
      </div>

      {/* Habit List */}
      <div className="space-y-4 mb-8">
        <AnimatePresence mode="popLayout">
          {habits.map(habit => {
            const isActive = activeHabitId === habit.id;
            const isEditing = editingId === habit.id;

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card 
                  onClick={() => !isEditing && handleSelectHabit(habit)}
                  className={`relative cursor-pointer transition-all hover:translate-y-[-2px] ${
                    isActive 
                      ? "bg-[var(--primary)] border-4" 
                      : "bg-white"
                  }`}
                  style={{ 
                    boxShadow: isActive ? "6px 6px 0 #000" : "4px 4px 0 #000"
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-1" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            className="flex-1 px-2 py-1 border-2 border-black font-bold uppercase text-sm focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={e => handleRenameHabit(habit.id, e)}
                            className="p-1 bg-green-400 border border-black rounded hover:bg-green-500"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); setEditingId(null); }}
                            className="p-1 bg-gray-200 border border-black rounded hover:bg-gray-300"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-black uppercase tracking-tight truncate flex items-center gap-2">
                            {habit.habit_name}
                            {isActive && <Check size={18} className="text-green-800 stroke-[3px]" />}
                          </h2>
                          <div className="flex gap-4 mt-2 font-bold text-xs uppercase opacity-75">
                            <span>Streak: {habit.streaks?.current_streak || 0}</span>
                            <span>Best: {habit.streaks?.best_streak || 0}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => startEditing(habit, e)}
                          className="p-1.5 bg-white border-2 border-black rounded hover:bg-yellow-200 transition-colors"
                          title="Rename Habit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={e => handleDeleteHabit(habit.id, e)}
                          className="p-1.5 bg-red-400 border-2 border-black rounded hover:bg-red-500 transition-colors text-white"
                          title="Delete Habit"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {habits.length === 0 && (
          <p className="text-center font-bold opacity-60 uppercase text-sm py-4">No habits created yet. Create one below!</p>
        )}
      </div>

      {/* Create New Habit Card */}
      <Card className="bg-white">
        <h3 className="font-black uppercase text-sm mb-3">Add New Habit</h3>
        <form onSubmit={handleCreateHabit} className="flex gap-2">
          <input
            type="text"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            placeholder="e.g. No Masturbation"
            className="flex-1 p-2 border-2 border-black font-bold uppercase text-sm focus:outline-none placeholder:opacity-40"
            required
          />
          <button
            type="submit"
            disabled={creating || !newHabitName.trim()}
            className="px-4 bg-[var(--accent)] border-2 border-black font-bold uppercase text-xs hover:bg-[var(--primary)] transition-colors flex items-center justify-center gap-1"
            style={{ boxShadow: "2px 2px 0 #000" }}
          >
            <Plus size={16} /> ADD
          </button>
        </form>
      </Card>
    </main>
  );
}
