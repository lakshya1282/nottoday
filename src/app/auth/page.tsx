"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setMessage(error.message);
        } else {
          if (data.session) {
            setMessage("Account created and signed in! Redirecting...");
            setTimeout(() => router.push("/setup"), 1000);
          } else {
            setMessage("Signup successful! Please check your email to confirm your account (if email confirmation is enabled in your Supabase dashboard).");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
        } else {
          setMessage("Logged in successfully! Redirecting...");
          setTimeout(() => router.push("/setup"), 1000);
        }
      }
    } catch (err: any) {
      setMessage("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-md mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-8"
      >
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-4" style={{ textShadow: "3px 3px 0px var(--border)" }}>
          NOT TODAY.
        </h1>
        <p className="font-bold uppercase tracking-wider">Every urge resisted is a win.</p>
      </motion.div>

      {/* Tabs */}
      <div className="w-full flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setIsSignUp(false); setMessage(""); }}
          className={`flex-1 py-2 font-bold uppercase neo-border transition-all ${
            !isSignUp 
              ? "bg-[var(--primary)] translate-y-[-2px]" 
              : "bg-white opacity-70 hover:opacity-100"
          }`}
          style={{ 
            boxShadow: !isSignUp ? "4px 4px 0 #000" : "2px 2px 0 #000"
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setIsSignUp(true); setMessage(""); }}
          className={`flex-1 py-2 font-bold uppercase neo-border transition-all ${
            isSignUp 
              ? "bg-[var(--primary)] translate-y-[-2px]" 
              : "bg-white opacity-70 hover:opacity-100"
          }`}
          style={{ 
            boxShadow: isSignUp ? "4px 4px 0 #000" : "2px 2px 0 #000"
          }}
        >
          Sign Up
        </button>
      </div>

      <Card className="w-full bg-white mb-6">
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label className="block font-bold uppercase text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 neo-border bg-gray-50 focus:outline-none focus:ring-0 placeholder:opacity-40 font-bold"
              required
            />
          </div>
          <div>
            <label className="block font-bold uppercase text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 neo-border bg-gray-50 focus:outline-none focus:ring-0 placeholder:opacity-40 font-bold"
              required
              minLength={6}
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
          </Button>
          {message && (
            <p className="text-sm font-bold text-center mt-2 leading-snug">{message}</p>
          )}
        </form>
      </Card>

      <div className="w-full flex items-center justify-center gap-4 mb-6 opacity-50 font-bold uppercase text-sm">
        <div className="h-1 flex-1 bg-black rounded-full" />
        OR
        <div className="h-1 flex-1 bg-black rounded-full" />
      </div>

      <Button 
        variant="secondary" 
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2"
      >
        CONTINUE WITH GOOGLE
      </Button>
    </main>
  );
}
