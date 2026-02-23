import { AuthForm } from "@/components/auth/AuthForm";
import { Reveal } from "@/components/ui/Reveal";

export default function SignupPage() {
  return (
    <div className="w-full">
      <Reveal y={12}>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Create Account
          </p>
          <h1 className="text-3xl md:text-[2rem] font-semibold tracking-tight leading-tight text-zinc-100">
            Start building your cookbook
          </h1>
          <p className="text-sm leading-6 text-zinc-400">
            Create an account to save favorites and return to the recipes you actually want to cook.
          </p>
        </div>
      </Reveal>

      <AuthForm mode="signup" />
    </div>
  );
}
