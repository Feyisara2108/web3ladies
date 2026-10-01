"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/components/admin/use-admin-auth";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [resetSent, setResetSent] = useState(false);
  const { signIn } = useAdminAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err.message);
    else router.push("/w3l-admin");
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/w3l-admin/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setResetSent(true);
  };

  const header = (title: string, subtitle: string) => (
    <div className="text-center space-y-2">
      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <h1 className="text-2xl font-display font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );

  const errorBox = error && (
    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>
  );

  if (mode === "forgot") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-8">
          {header("Reset Password", "Enter your email to receive a reset link")}
          {resetSent ? (
            <div className="space-y-4">
              <div className="text-sm text-primary bg-primary/10 p-4 rounded-lg text-center">
                Password reset link sent! Check your email inbox.
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setMode("login");
                  setResetSent(false);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              {errorBox}
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                Send Reset Link
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setMode("login")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {header("Admin Portal", "Sign in to manage Web3Ladies content")}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorBox}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
