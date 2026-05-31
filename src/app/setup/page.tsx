"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";

export default function SetupPage() {
  const router = useRouter();
  const [habitName, setHabitName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        const { data } = await supabase
          .from("habits")
          .select("id, habit_name")
          .eq("user_id", session.user.id)
          .single();

        if (data) {
          localStorage.setItem("nt_habit_name", data.habit_name);
          localStorage.setItem("nt_habit_id", data.id);

          // Handle offline merge for returning user
          const localResists = parseInt(localStorage.getItem("nt_resists") || "0", 10);
          const localBest = parseInt(localStorage.getItem("nt_best") || "0", 10);
          if (localResists > 0) {
            const { data: streakData } = await supabase
              .from("streaks")
              .select("current_streak, best_streak, total_resists")
              .eq("habit_id", data.id)
              .single();
              
            if (streakData) {
              const newCurrent = streakData.current_streak + localResists;
              const newBest = Math.max(streakData.best_streak, localBest, newCurrent);
              const newTotal = streakData.total_resists + localResists;
              
              await supabase.from("streaks").update({
                current_streak: newCurrent,
                best_streak: newBest,
                total_resists: newTotal
              }).eq("habit_id", data.id);
              
              // Sync local state
              localStorage.setItem("nt_resists", newCurrent.toString());
              localStorage.setItem("nt_best", newBest.toString());
            }
          }
          router.push("/");
        }
      }
      setCheckingAuth(false);
    };
    checkUser();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("habits")
      .insert({ user_id: session.user.id, habit_name: habitName.trim() })
      .select("id, habit_name")
      .single();

    if (!error && data) {
      localStorage.setItem("nt_habit_name", data.habit_name);
      localStorage.setItem("nt_habit_id", data.id);
      
      const localResists = parseInt(localStorage.getItem("nt_resists") || "0", 10);
      const localBest = parseInt(localStorage.getItem("nt_best") || "0", 10);

      await supabase.from("streaks").insert({
        habit_id: data.id,
        current_streak: localResists,
        best_streak: localBest,
        total_resists: localResists
      });

      router.push("/");
    } else {
      console.error("Error creating habit", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const SUGGESTIONS = [
    "No Masturbation",
    "No Smoking",
    "No Gambling",
    "No Doomscrolling",
    "No Vaping",
  ];

  if (checkingAuth) return null; // or a neat loader

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-md mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full mb-8"
      >
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2" style={{ textShadow: "2px 2px 0px var(--border)" }}>
          WHAT ARE YOU TRYING TO QUIT?
        </h1>
      </motion.div>

      <Card className="w-full bg-white mb-6">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g. Nail biting"
            className="w-full p-4 neo-border text-lg font-bold bg-gray-50 focus:outline-none focus:ring-0"
            required
            autoFocus
          />
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !habitName.trim()}
            className="w-full mt-2"
          >
            {loading ? "SAVING..." : "START STREAK"}
          </Button>
        </form>
      </Card>

      <div className="w-full flex flex-wrap gap-2 justify-center">
        {SUGGESTIONS.map(suggestion => (
          <button
            key={suggestion}
            onClick={() => setHabitName(suggestion)}
            className="px-3 py-1 bg-white border-2 border-black rounded-full text-xs font-bold uppercase hover:bg-[var(--accent)] transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </main>
  );
}
