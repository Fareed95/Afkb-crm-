"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/db/supabase-browser";
import { useRouter } from "next/navigation";
import { Shirt, Scissors } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseBrowserClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/callback`
      }
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const supabase = getSupabaseBrowserClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${baseUrl}/callback` }
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Check your email for a confirmation link before logging in.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side: Login Card Form */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 relative z-10 bg-background">
        {/* Top Branding (only visible on mobile/tablet since it's on the right on desktop) */}
        <div className="flex items-center gap-3 lg:hidden mb-12">
          <div className="relative h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Shirt className="h-5 w-5 relative z-10" />
            <Scissors className="h-3 w-3 absolute bottom-1.5 right-1.5 opacity-80 z-10" />
          </div>
          <div>
            <h2 className="font-display font-black tracking-tight text-lg text-foreground">AFKB</h2>
            <p className="text-[9px] uppercase tracking-widest text-primary font-bold">Tailor System</p>
          </div>
        </div>

        {/* Center: Auth Form Container */}
        <div className="my-auto max-w-md w-full mx-auto space-y-8 animate-in-fade">
          <div className="space-y-2.5">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your credentials to manage your tailor billing dashboard."
                : "Register a new owner account for your tailor shop database."}
            </p>
          </div>

          {/* Google Login Button */}
          <Button
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold shadow-sm transition-all duration-200"
            variant="outline"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">or email</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleEmailAuth} className="space-y-5 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-lg w-full rounded-xl border-border bg-card focus:bg-background focus:ring-primary/20 text-sm font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-lg w-full rounded-xl border-border bg-card focus:bg-background focus:ring-primary/20 text-sm font-semibold"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200/50 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-600 dark:border-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="rounded-xl border border-emerald-200/50 bg-emerald-500/5 px-4 py-3 text-sm font-semibold text-emerald-600 dark:border-emerald-500/10 dark:text-emerald-400">
                {successMsg}
              </div>
            )}

            <Button
              type="submit"
              className="btn-lg w-full h-12 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm font-medium text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="font-bold text-primary hover:underline underline-offset-4"
                  onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="font-bold text-primary hover:underline underline-offset-4"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center lg:text-left mt-12">
          © {new Date().getFullYear()} AFKB CRM. All rights reserved.
        </p>
      </div>

      {/* Right side: Tailoring cover image panel */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-zinc-950">
        {/* Cover image background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
          style={{ backgroundImage: "url('/tailor_login_cover.png')" }}
        />
        {/* High contrast glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/95 via-zinc-950/70 to-zinc-900/40" />

        {/* Brand layout contents */}
        <div className="relative z-10 flex flex-col justify-between h-full w-full p-20 text-white">
          {/* Logo container */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Shirt className="h-6 w-6 relative z-10" />
              <Scissors className="h-4 w-4 absolute bottom-2 right-2 opacity-80 z-10" />
            </div>
            <div>
              <h2 className="font-display font-black tracking-tight text-xl text-white">AFKB</h2>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Tailor System</p>
            </div>
          </div>

          {/* Inspirational block quote */}
          <div className="max-w-xl space-y-6">
            <blockquote className="space-y-4">
              <p className="font-display text-4xl font-extrabold leading-tight text-slate-100">
                “Stitching precision into every single transaction.”
              </p>
              <footer className="text-primary-foreground/75 font-semibold text-lg">
                — Simple, fast, and accurate billing for your daily garment work.
              </footer>
            </blockquote>
          </div>

          {/* Small metrics */}
          <div className="flex items-center gap-8 text-xs font-semibold text-slate-400">
            <div>
              <p className="text-white font-extrabold text-lg">100%</p>
              <p className="uppercase tracking-wider text-[10px]">Secure Auth</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-white font-extrabold text-lg">Instant</p>
              <p className="uppercase tracking-wider text-[10px]">Ledger Sync</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
