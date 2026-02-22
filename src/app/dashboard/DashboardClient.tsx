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
    <div className="space-y-12">
      <section className="premium-card rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-emerald-500" />
          Account Settings
        </h2>

        <form action={handleSubmit} className="space-y-8 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
              Display Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:border-emerald-500/50 transition-all"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
              Email Address
            </label>
            <div className="relative opacity-60">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                value={user.email}
                disabled
                className="pl-12 h-14 rounded-2xl bg-white/5 border-white/10 text-white cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-zinc-600 ml-1 italic font-medium">
              Email cannot be changed as it is linked to your login provider.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending || name === user.name}
            className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 disabled:opacity-50 disabled:grayscale"
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
