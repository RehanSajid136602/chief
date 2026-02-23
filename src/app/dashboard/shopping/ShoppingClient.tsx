"use client";

import { useState, useTransition } from "react";
import type { ShoppingListRecord } from "@/lib/types/shopping";
import { generateShoppingListFromMealPlan, mergeShoppingListRegeneration, toggleShoppingListItem } from "@/app/actions/shopping";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";

export function ShoppingClient({
  initialList,
  weekKey,
  dbConfigured,
}: {
  initialList: ShoppingListRecord | null;
  weekKey: string;
  dbConfigured: boolean;
}) {
  const [list, setList] = useState(initialList);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const generate = () => startTransition(async () => {
    try {
      const next = await generateShoppingListFromMealPlan(weekKey);
      setList(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate shopping list");
    }
  });

  const regenerate = () => startTransition(async () => {
    try {
      const next = await mergeShoppingListRegeneration(weekKey);
      setList(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to regenerate shopping list");
    }
  });

  const toggle = (id: string) => startTransition(async () => {
    try {
      await toggleShoppingListItem(id);
      setList((prev) => prev ? ({
        ...prev,
        items: prev.items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i),
      }) : prev);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update list item");
    }
  });

  return (
    <div className="space-y-6">
      {!dbConfigured && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100 reveal-on-mount">
          Shopping list generation requires the local database.
        </div>
      )}
      <Reveal y={12}>
        <div className="surface-panel rounded-2xl p-5 flex items-center gap-3">
        <Button onClick={generate} disabled={isPending || !dbConfigured}>Generate Grocery List</Button>
        <Button variant="outline" onClick={regenerate} disabled={isPending || !dbConfigured}>Regenerate (Preserve Manual)</Button>
        </div>
      </Reveal>
      {error && <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</div>}
      {!list || list.items.length === 0 ? (
        <EmptyState heading="No grocery items yet" message="Generate a list from your planner week once meals are scheduled." />
      ) : (
        <div className="space-y-3">
          {Object.entries(
            list.items.reduce<Record<string, typeof list.items>>((acc, item) => {
              const key = item.category || "other";
              acc[key] ??= [];
              acc[key].push(item);
              return acc;
            }, {})
          ).map(([category, items], categoryIndex) => (
            <section key={category} className="surface-panel rounded-2xl p-5 reveal-on-mount" style={{ ["--reveal-delay" as string]: `${Math.min(categoryIndex, 6) * 50}ms` }}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400">{category}</h2>
              <div className="space-y-2">
                {items.map((item, itemIndex) => (
                  <label key={item.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 reveal-on-mount" style={{ ["--reveal-delay" as string]: `${Math.min(itemIndex, 8) * 24 + Math.min(categoryIndex, 6) * 40}ms` }}>
                    <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} className="h-4 w-4 accent-emerald-400" />
                    <span className={item.checked ? "line-through text-zinc-500" : "text-zinc-100"}>{item.name}</span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
