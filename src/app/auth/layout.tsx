import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication – RecipeHub",
  description: "Sign in or create an account to access your personalized recipe dashboard.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-[#090b0f] p-4 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden lg:block">
          <div className="max-w-xl space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              RecipeHub Access
            </p>
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight text-zinc-100">
              Save recipes, track favorites, and keep your kitchen flow simple.
            </h1>
            <p className="text-base leading-7 text-zinc-400 max-w-lg">
              Sign in to keep your recipe picks in one place. Fast actions, clean UI, no clutter.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                ["Favorites", "Save recipes for later"],
                ["AI Matcher", "Use pantry ingredients"],
                ["Fast filters", "Time and calorie sorting"],
                ["Recipe pages", "Clear steps and details"],
              ].map(([title, desc]) => (
                <div key={title} className="surface-subtle rounded-xl p-4">
                  <p className="text-sm font-semibold text-zinc-100">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-md lg:justify-self-end">
          <div className="surface-elevated rounded-2xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
