"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/Reveal";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Registration failed");
        }

        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error("Auto-signin failed after registration");
        }

        router.push("/");
        router.refresh();
      } else {
        const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/";
        
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Invalid email or password");
        }

        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl") || "/";
    signIn("google", { callbackUrl });
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      <Reveal y={10}>
        <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2 reveal-on-mount" style={{ ["--reveal-delay" as string]: "30ms" }}>
            <Label htmlFor="name" className="text-zinc-300 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ml-1">
              Full Name
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-200 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chef Gordon"
                required
                minLength={2}
                className="pl-11 h-11"
              />
            </div>
          </div>
        )}

        <div className="space-y-2 reveal-on-mount" style={{ ["--reveal-delay" as string]: mode === "signup" ? "60ms" : "30ms" }}>
          <Label htmlFor="email" className="text-zinc-300 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ml-1">
            Email Address
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-200 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chef@recipehub.com"
              required
              className="pl-11 h-11"
            />
          </div>
        </div>

        <div className="space-y-2 reveal-on-mount" style={{ ["--reveal-delay" as string]: mode === "signup" ? "90ms" : "60ms" }}>
          <Label htmlFor="password" className="text-zinc-300 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ml-1">
            Password
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-zinc-200 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="pl-11 h-11"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-rose-300 bg-rose-400/10 border border-rose-400/20 p-3 rounded-xl flex items-center gap-2.5 leading-5 reveal-on-mount">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 font-semibold reveal-on-mount"
          style={{ ["--reveal-delay" as string]: mode === "signup" ? "120ms" : "90ms" }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              {mode === "signup" ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        <div className="relative py-2 reveal-on-mount" style={{ ["--reveal-delay" as string]: mode === "signup" ? "140ms" : "110ms" }}>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[0.65rem] uppercase font-semibold tracking-[0.12em] text-zinc-500">
            <span className="bg-[#121821] px-3 rounded-full border border-white/[0.06]">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-11 bg-white text-black hover:bg-zinc-100 rounded-xl font-medium flex items-center justify-center gap-2.5 reveal-on-mount"
          style={{ ["--reveal-delay" as string]: mode === "signup" ? "160ms" : "130ms" }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-left text-sm leading-6 text-zinc-500 reveal-on-mount" style={{ ["--reveal-delay" as string]: mode === "signup" ? "180ms" : "150ms" }}>
          {mode === "login" ? (
            <>
              New to RecipeHub?{" "}
              <Link
                href="/auth/signup"
                className="text-zinc-200 font-medium hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-zinc-200 font-medium hover:text-white transition-colors underline underline-offset-4 decoration-white/20"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
        </form>
      </Reveal>
    </div>
  );
}
