"use client";

import type { CSSProperties } from "react";
import { useState, useTransition } from "react";
import { updateUserSettings } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/Reveal";
import { REGION_OPTIONS } from "@/lib/constants/regions";
import { User, Mail, UserCircle, Save, CheckCircle2, Globe2 } from "lucide-react";


interface DashboardClientProps {
  user: {
    email: string;
    name: string;
    region?: string | null;
  };
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [name, setName] = useState(user.name);
  const [region, setRegion] = useState(user.region || "Global");
  const [isPending, startTransition] = useTransition();
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        setSaveError(null);
        await updateUserSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Failed to save settings");
      }
    });
  };

  return (
    <div className="space-y-8">
      <Reveal y={12}>
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

          <div className="space-y-2">
            <label className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-zinc-500 ml-1">
              Region
            </label>
            <div className="relative group">
              <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-200 transition-colors pointer-events-none" />
              <select
                name="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-10 py-2.5 text-sm text-zinc-100 h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/30"
                aria-label="Select region"
              >
                {REGION_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-[#0f1319] text-zinc-100">
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] leading-5 text-zinc-500 ml-1">
              Select your region. Pakistan is available for localized preferences and future regional content.
            </p>
          </div>

          {saveError ? (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {saveError}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isPending || (name === user.name && region === (user.region || "Global"))}
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
          <div
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-zinc-400 reveal-on-mount"
            style={{ ["--reveal-delay" as string]: "60ms" } as CSSProperties}
          >
            Current region: <span className="font-semibold text-zinc-200">{region}</span>
          </div>
        </form>
        </section>
      </Reveal>
    </div>
  );
}
