"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/db/supabase-browser";
import { useRouter } from "next/navigation";

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
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/callback`
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/callback` }
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950">
      <div className="container-page flex min-h-screen flex-col items-center justify-center gap-6 py-12 text-center">
        <div className="section-card w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              AFKB
            </p>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">
              Tailor Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Simple, fast, and accurate billing for daily garment work.
            </p>
          </div>

          {/* Google Login */}
          <Button
            className="btn-lg w-full flex items-center justify-center gap-3"
            variant="outline"
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
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
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-lg w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-lg w-full"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {error}
              </p>
            )}
            {successMsg && (
              <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
                {successMsg}
              </p>
            )}

            <Button
              type="submit"
              className="btn-lg w-full"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          {/* Toggle login / signup */}
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
