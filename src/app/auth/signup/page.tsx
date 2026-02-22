import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Join RecipeHub to save your favorite recipes
        </p>
      </div>

      <AuthForm mode="signup" />
    </div>
  );
}
