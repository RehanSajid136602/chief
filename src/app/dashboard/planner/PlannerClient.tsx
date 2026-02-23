"use client";

import { useMemo, useState, useTransition } from "react";
import type { MealPlanWeekRecord, MealSlotType } from "@/lib/types/planner";
import type { Recipe } from "@/lib/types";
import { copyPreviousWeekPlan, deleteMealPlanEntry, upsertMealPlanEntry } from "@/app/actions/planner";
import { getCurrentWeekKey } from "@/lib/validation/planner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { generateMealPlanWithAI, regenerateMealSlotWithAI } from "@/app/actions/ai-planner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS: MealSlotType[] = ["BREAKFAST", "LUNCH", "DINNER"];

export function PlannerClient({
  initialWeek,
  recipes,
  dbConfigured,
}: {
  initialWeek: MealPlanWeekRecord;
  recipes: Recipe[];
  dbConfigured: boolean;
}) {
  const [weekKey, setWeekKey] = useState(initialWeek.weekKey || getCurrentWeekKey());
  const [state, setState] = useState(initialWeek);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const byCell = useMemo(() => {
    const map = new Map<string, MealPlanWeekRecord["entries"][number]>();
    for (const e of state.entries) map.set(`${e.dayOfWeek}-${e.slot}`, e);
    return map;
  }, [state.entries]);

  const saveCell = (dayOfWeek: number, slot: MealSlotType, repeat = false) => {
    const key = `${dayOfWeek}-${slot}`;
    const recipeSlug = selected[key];
    if (!recipeSlug) return;
    startTransition(async () => {
      try {
        const next = await upsertMealPlanEntry({
          weekKey,
          dayOfWeek,
          slot,
          recipeSlug,
          note: notes[key] ?? null,
          isLeftoversRepeat: repeat,
        });
        setState(next);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save planner entry");
      }
    });
  };

  const removeCell = (dayOfWeek: number, slot: MealSlotType) => {
    startTransition(async () => {
      try {
        const next = await deleteMealPlanEntry({ weekKey, dayOfWeek, slot });
        setState(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to remove planner entry");
      }
    });
  };

  const copyPrev = () => {
    startTransition(async () => {
      try {
        const next = await copyPreviousWeekPlan(weekKey);
        setState(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to copy previous week");
      }
    });
  };

  const aiGenerate = () => {
    startTransition(async () => {
      const result = await generateMealPlanWithAI({ weekKey });
      if (!result.success) {
        setError(result.error ?? "AI generation failed");
        return;
      }
      setState(result.week);
      setError(null);
    });
  };

  const aiRegenSlot = (dayOfWeek: number, slot: MealSlotType) => {
    startTransition(async () => {
      const result = await regenerateMealSlotWithAI({ weekKey, dayOfWeek, slot });
      if (!result.success) {
        setError(result.error ?? "Slot regeneration failed");
        return;
      }
      setState(result.week);
      setError(null);
    });
  };

  return (
    <div className="space-y-6">
      {!dbConfigured && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100 reveal-on-mount">
          Planner requires the configured local database to save week plans.
        </div>
      )}
      <Reveal y={12}>
        <div className="surface-panel rounded-2xl p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Input value={weekKey} onChange={(e) => setWeekKey(e.target.value)} className="w-36" />
          <Button variant="outline" onClick={copyPrev} disabled={isPending || !dbConfigured}>Copy Previous Week</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={aiGenerate} disabled={isPending || !dbConfigured}>Generate with AI</Button>
        </div>
        </div>
      </Reveal>

      {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div>}

      <div className="grid gap-4">
        {DAYS.map((day, dayIndex) => (
          <section key={day} className="surface-panel rounded-2xl p-5 reveal-on-mount" style={{ ["--reveal-delay" as string]: `${Math.min(dayIndex, 6) * 45}ms` }}>
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">{day}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {SLOTS.map((slot, slotIndex) => {
                const key = `${dayIndex}-${slot}`;
                const entry = byCell.get(key);
                return (
                  <div key={slot} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3 reveal-on-mount" style={{ ["--reveal-delay" as string]: `${Math.min(dayIndex * 3 + slotIndex, 12) * 22}ms` }}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">{slot}</p>
                      <Button variant="ghost" size="sm" onClick={() => aiRegenSlot(dayIndex, slot)} disabled={isPending || !dbConfigured}>
                        AI
                      </Button>
                    </div>
                    {entry ? (
                      <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/5 p-3">
                        <p className="font-medium text-zinc-100">{entry.recipeTitleSnapshot}</p>
                        <p className="text-xs text-zinc-400">{entry.recipeTotalTimeSnapshot ?? "?"} min · {entry.recipeCaloriesSnapshot ?? "?"} kcal</p>
                        {entry.note ? <p className="mt-2 text-xs text-zinc-400">{entry.note}</p> : null}
                        {entry.isLeftoversRepeat ? <p className="mt-1 text-[11px] text-amber-200">Leftovers / repeat meal</p> : null}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">No meal planned yet.</p>
                    )}
                    <select
                      aria-label={`${day} ${slot} recipe selector`}
                      className={cn("w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-100")}
                      value={selected[key] ?? ""}
                      onChange={(e) => setSelected((prev) => ({ ...prev, [key]: e.target.value }))}
                    >
                      <option value="">Select recipe</option>
                      {recipes.map((r) => (
                        <option key={r.slug} value={r.slug}>{r.title}</option>
                      ))}
                    </select>
                    <Input
                      aria-label={`${day} ${slot} note`}
                      placeholder="Note (optional)"
                      value={notes[key] ?? entry?.note ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button aria-label={`Save ${day} ${slot}`} size="sm" onClick={() => saveCell(dayIndex, slot)} disabled={isPending || !dbConfigured || !(selected[key] || entry)}>
                        Save
                      </Button>
                      <Button aria-label={`Save ${day} ${slot} as leftovers`} size="sm" variant="outline" onClick={() => saveCell(dayIndex, slot, true)} disabled={isPending || !dbConfigured || !selected[key]}>
                        Save as Leftovers
                      </Button>
                      <Button aria-label={`Remove ${day} ${slot}`} size="sm" variant="ghost" onClick={() => removeCell(dayIndex, slot)} disabled={isPending || !dbConfigured || !entry}>
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
