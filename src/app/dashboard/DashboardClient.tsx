"use client";

import { useState, useTransition } from "react";
import { updateName } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, UserCircle, Save, CheckCircle2 } from "lucide-react";


interface DashboardClientProps {
  user: {
    email: string;
    name: string;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [name, setName] = useState(user.name);
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateName(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="space-y-8">
      <section className="surface-panel rounded-2xl p-6 md:p-7 overflow-hidden relative">
        
        <h2 className="text-lg font-semibold text-zinc-100 mb-6 flex items-center gap-2.5">
          <UserCircle className="w-5 h-5 text-emerald-300" />
          Account Settings
        </h2>

        <form action={handleSubmit} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-500 ml-1">
              Display Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-200 transition-colors" />
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-11"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-500 ml-1">
              Email Address
            </label>
            <div className="relative opacity-60">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                value={user.email}
                disabled
                className="pl-11 h-11 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] leading-5 text-zinc-500 ml-1">
              Email cannot be changed as it is linked to your login provider.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending || name === user.name}
            className="h-11 px-5 rounded-xl font-medium"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : isSaved ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Saved
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" /> Save Changes
              </span>
            )}
          </Button>
        </form>
      </section>
    </div>
  );
}
