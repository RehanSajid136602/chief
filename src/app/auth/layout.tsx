import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication – RecipeHub",
  description: "Sign in or create an account to access your personalized recipe dashboard.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700 p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl p-8 shadow-lg">
        {children}
      </div>
    </section>
  );
}
