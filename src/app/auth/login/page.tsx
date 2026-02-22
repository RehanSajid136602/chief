import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Sign In
        </p>
        <h1 className="text-3xl md:text-[2rem] font-semibold tracking-tight leading-tight text-zinc-100">
          Welcome back
        </h1>
        <p className="text-sm leading-6 text-zinc-400">
          Sign in to continue browsing recipes, using the matcher, and managing your saved favorites.
        </p>
      </div>

      <AuthForm mode="login" />
    </div>
  );
}
