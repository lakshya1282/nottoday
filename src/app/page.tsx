"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, RefreshCcw, WifiOff, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const QUOTES = [
  "Bro just farmed self-control XP.",
  "Future you is silently thanking you.",
  "You beat the urge.",
  "One urge lost. One legend created.",
  "Main character energy.",
  "Discipline is looking attractive today.",
  "Small win. Massive impact.",
  "Locked in.",
];

export default function Dashboard() {
  const router = useRouter();
  const [resists, setResists] = useState<number>(0);
  const [bestResists, setBestResists] = useState<number>(0);
  const [quote, setQuote] = useState<string>("Every urge resisted is a win.");
  const [isOffline, setIsOffline] = useState(false);
  const [plusOneVisible, setPlusOneVisible] = useState(false);
  const [habitName, setHabitName] = useState("My Habit");
  const [habitId, setHabitId] = useState<string | null>(null);

  // Reflection and AI states
  const [reflectionOpen, setReflectionOpen] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState("");

  // Helper to sync local and cloud state
  const triggerSync = async (targetHabitId: string | null) => {
    if (!targetHabitId || !navigator.onLine) return;

    try {
      const { data: streakData, error } = await supabase
        .from("streaks")
        .select("current_streak, best_streak, total_resists")
        .eq("habit_id", targetHabitId)
        .single();

      if (error) {
        console.error("Error fetching streak for sync:", error);
        return;
      }

      if (streakData) {
        const localResists = parseInt(localStorage.getItem("nt_resists") || "0", 10);
        const localBest = parseInt(localStorage.getItem("nt_best") || "0", 10);

        // If local resists is larger, sync local up to cloud
        if (localResists > streakData.total_resists) {
          await supabase
            .from("streaks")
            .update({
              current_streak: localResists,
              best_streak: localBest,
              total_resists: localResists
            })
            .eq("habit_id", targetHabitId);
        } 
        // If cloud resists is larger or equal, sync cloud down to local
        else if (streakData.total_resists > localResists) {
          setResists(streakData.current_streak);
          setBestResists(streakData.best_streak);
          localStorage.setItem("nt_resists", streakData.current_streak.toString());
          localStorage.setItem("nt_best", streakData.best_streak.toString());
        }
      }
    } catch (e) {
      console.error("Sync failed:", e);
    }
  };

  // Load from local storage and sync with Supabase on mount
  useEffect(() => {
    // 1. Initial local load
    const savedResists = parseInt(localStorage.getItem("nt_resists") || "0", 10);
    const savedBest = parseInt(localStorage.getItem("nt_best") || "0", 10);
    const savedName = localStorage.getItem("nt_habit_name");
    const savedId = localStorage.getItem("nt_habit_id");
    
    setResists(savedResists);
    setBestResists(savedBest);
    if (savedName) setHabitName(savedName);
    if (savedId) setHabitId(savedId);

    // 2. Offline/Online listeners
    const handleOnline = () => {
      setIsOffline(false);
      triggerSync(savedId);
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const onlineStatus = navigator.onLine;
    setIsOffline(!onlineStatus);

    // 3. Auth and Cloud Sync logic
    const syncWithCloud = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        let currentHabitId = savedId || "";
        let currentHabitName = savedName || "My Habit";

        // If habitId is missing but they are logged in, fetch it from Supabase
        if (!currentHabitId) {
          const { data: habitData } = await supabase
            .from("habits")
            .select("id, habit_name")
            .eq("user_id", session.user.id)
            .single();

          if (habitData) {
            currentHabitId = habitData.id;
            currentHabitName = habitData.habit_name;
            setHabitId(currentHabitId);
            setHabitName(currentHabitName);
            localStorage.setItem("nt_habit_id", currentHabitId);
            localStorage.setItem("nt_habit_name", currentHabitName);
          } else {
            // No habit found for this logged in user, send them to setup!
            router.push("/setup");
            return;
          }
        }

        // Now trigger the sync
        if (onlineStatus && currentHabitId) {
          await triggerSync(currentHabitId);
        }
      }
    };

    syncWithCloud();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [router]);

  const saveToStorage = (newResists: number, newBest: number) => {
    localStorage.setItem("nt_resists", newResists.toString());
    localStorage.setItem("nt_best", newBest.toString());
  };


  const handleResist = async () => {
    const newResists = resists + 1;
    const newBest = Math.max(newResists, bestResists);
    
    setResists(newResists);
    setBestResists(newBest);
    saveToStorage(newResists, newBest);

    if (habitId && !isOffline) {
      supabase.from("streaks").update({
        current_streak: newResists,
        best_streak: newBest,
        total_resists: newResists
      }).eq("habit_id", habitId).then();
      
      // We do NOT insert the empty checkin immediately; it's delayed to reflection/skip
    }

    // Random quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    // Confetti and animations
    if (newResists % 7 === 0 || newResists % 10 === 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FADF0C", "#C7A4FF", "#7CFF7C", "#000000"]
      });
    } else {
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#C7A4FF"]
      });
    }

    setPlusOneVisible(true);
    setTimeout(() => setPlusOneVisible(false), 800);
    
    // Open the reflection overlay after a very slight delay so the +1 animation can start
    setTimeout(() => {
      setReflectionOpen(true);
    }, 400);
  };

  const submitReflection = async () => {
    if (!reflectionText.trim()) return;

    setAiLoading(true);
    setAiReply("");

    // 1. Insert the checkin note into Supabase if online
    if (habitId && !isOffline) {
      supabase
        .from("checkins")
        .insert({ habit_id: habitId, note: reflectionText.trim() })
        .then();
    }

    try {
      // 2. Fetch from Groq AI API endpoint
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitName,
          streak: resists,
          userReflection: reflectionText.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiReply(data.response);
      } else {
        setAiReply("Bro, something went wrong calling your AI Coach. But you're still an absolute legend for resisting! Lock in!");
      }
    } catch (err) {
      console.error(err);
      setAiReply("Internet glitched, but your self-control didn't. Keep moving forward, king!");
    } finally {
      setAiLoading(false);
    }
  };

  const skipReflection = () => {
    // Insert empty checkin note if online
    if (habitId && !isOffline) {
      supabase.from("checkins").insert({ habit_id: habitId }).then();
    }
    
    // Close modal cleanly
    setReflectionOpen(false);
    setReflectionText("");
    setAiReply("");
  };

  const handleRelapse = () => {
    if (window.confirm("Are you sure? This will reset your current resist count to 0.")) {
      setResists(0);
      saveToStorage(0, bestResists);
      setQuote("A setback is a setup for a comeback. Start again.");
      
      if (habitId && !isOffline) {
        supabase.from("streaks").update({ current_streak: 0 }).eq("habit_id", habitId).then();
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("nt_habit_name");
    localStorage.removeItem("nt_habit_id");
    router.push("/auth");
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-md mx-auto w-full">
      {isOffline && (
        <div className="absolute top-4 bg-black text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2">
          <WifiOff size={12} /> OFFLINE MODE
        </div>
      )}

      <div className="w-full flex justify-between items-center mb-8 gap-4">
        <div className="flex-1 min-w-0">
          <h1 
            onClick={() => router.push(habitId ? "/habits" : "/auth")}
            className="text-xl font-black tracking-tight uppercase truncate flex items-center gap-1.5 cursor-pointer hover:underline"
            title={habitId ? "Manage Habits" : "Login to manage habits"}
          >
            📁 {habitName}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={handleRelapse}
            className="text-xs font-bold flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity bg-white px-2 py-1 neo-border"
            style={{ boxShadow: "2px 2px 0 #000" }}
          >
            <RefreshCcw size={12} />
            RELAPSED
          </button>
          {habitId ? (
            <button 
              onClick={handleLogout}
              className="text-xs font-bold flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <LogOut size={12} />
              LOGOUT
            </button>
          ) : (
            <button 
              onClick={() => router.push("/auth")}
              className="text-xs font-bold flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity bg-[var(--accent)] px-2 py-1 neo-border"
              style={{ boxShadow: "2px 2px 0 #000" }}
            >
              LOGIN
            </button>
          )}
        </div>
      </div>

      <div className="relative flex flex-col items-center mb-12">
        <div className="text-sm font-bold opacity-60 mb-2 uppercase tracking-widest flex items-center gap-1">
          <Flame size={16} className="text-orange-500" /> Best: {bestResists}
        </div>
        
        <AnimatePresence>
          {plusOneVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1.2 }}
              exit={{ opacity: 0, y: -60 }}
              className="absolute top-0 text-[var(--success)] font-black text-4xl pointer-events-none drop-shadow-md"
              style={{ textShadow: "2px 2px 0 #000" }}
            >
              +1
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.h2 
          key={resists}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl sm:text-9xl font-black tabular-nums tracking-tighter"
          style={{ textShadow: "4px 4px 0px var(--border)" }}
        >
          {resists}
        </motion.h2>
        <p className="font-bold uppercase tracking-widest mt-2">Resisted Urges</p>
      </div>

      <div className="w-full space-y-6">
        <Button 
          variant="primary" 
          size="xl" 
          onClick={handleResist}
          className="w-full flex items-center justify-center gap-2"
        >
          I DID NOT DO IT <span className="text-2xl">💪</span>
        </Button>

        <motion.div
          key={quote}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center bg-white">
            <p className="font-bold text-lg sm:text-xl uppercase leading-tight">
              {quote}
            </p>
          </Card>
        </motion.div>

        {!habitId && (
          <Card 
            className="bg-[var(--accent)] text-center cursor-pointer hover:translate-y-[-2px] transition-transform neo-border"
            style={{ boxShadow: "4px 4px 0 #000" }}
            onClick={() => router.push("/auth")}
          >
            <p className="font-black text-sm uppercase">
              ☁️ Sync progress to the cloud!
            </p>
            <p className="text-xs font-bold uppercase mt-1 opacity-80">
              Create an account to backup your {resists} {resists === 1 ? "resist" : "resists"}
            </p>
          </Card>
        )}
      </div>

      {/* AI Reflection & Motivation Modal */}
      <AnimatePresence>
        {reflectionOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="bg-white max-h-[90vh] overflow-y-auto" style={{ boxShadow: "8px 8px 0 #000" }}>
                {!aiReply && !aiLoading ? (
                  // Step 1: Input Reflection
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black uppercase tracking-tight">🔥 URGED BEATEN!</h3>
                      <button 
                        onClick={skipReflection} 
                        className="text-xs font-bold uppercase opacity-55 hover:opacity-100"
                      >
                        SKIP REFLECTION
                      </button>
                    </div>
                    
                    <p className="font-bold text-sm uppercase opacity-75 leading-tight">
                      What made you keep your streak just now? Share a quick reflection to help you lock it in next time.
                    </p>

                    <textarea
                      value={reflectionText}
                      onChange={e => setReflectionText(e.target.value)}
                      placeholder="e.g. Went for a quick walk, focused on my future self, drank cold water..."
                      className="w-full h-24 p-3 border-2 border-black font-bold uppercase text-sm focus:outline-none bg-gray-50 placeholder:opacity-40"
                      required
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        onClick={submitReflection}
                        disabled={!reflectionText.trim()}
                        className="flex-1 text-sm py-3"
                      >
                        GET AI COACH MOTIVATION
                      </Button>
                    </div>
                  </div>
                ) : aiLoading ? (
                  // Step 2: Loading State
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="w-12 h-12 border-4 border-black border-t-[var(--primary)] rounded-full animate-spin" />
                    <p className="font-black uppercase tracking-widest text-sm animate-pulse text-center">
                      AI Coach is writing a customized reply...
                    </p>
                  </div>
                ) : (
                  // Step 3: AI Reply State
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-1.5">
                      🤖 COACH REPLY
                    </h3>
                    
                    <Card className="bg-[var(--accent)] border-2" style={{ boxShadow: "4px 4px 0 #000" }}>
                      <p className="font-bold text-base sm:text-lg uppercase leading-snug">
                        {aiReply}
                      </p>
                    </Card>

                    <Button
                      variant="primary"
                      onClick={() => {
                        setReflectionOpen(false);
                        setReflectionText("");
                        setAiReply("");
                      }}
                      className="w-full text-sm py-3"
                    >
                      LOCK IT IN 💪
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
