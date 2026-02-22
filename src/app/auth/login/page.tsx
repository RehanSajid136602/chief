import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Welcome Back
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Sign in to your RecipeHub account to continue
        </p>
      </div>

      <AuthForm mode="login" />
    </div>
  );
}
