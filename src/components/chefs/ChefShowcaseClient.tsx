"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type { ChefProfile, ChefRegion } from "@/lib/types/chef";
import { ChefCard } from "@/components/chefs/ChefCard";
import { cn } from "@/lib/utils";

type ChefFilter = "All" | ChefRegion;

export function ChefShowcaseClient({ chefs }: { chefs: ChefProfile[] }) {
  const [filter, setFilter] = useState<ChefFilter>("All");

  const filteredChefs = useMemo(() => {
    if (filter === "All") return chefs;
    return chefs.filter((chef) => chef.region === filter);
  }, [chefs, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {(["All", "Pakistan", "Worldwide"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors",
              filter === option
                ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.05]"
            )}
            aria-pressed={filter === option}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChefs.map((chef, index) => (
          <div
            key={chef.id}
            className="reveal-on-mount"
            style={
              { ["--reveal-delay" as string]: `${Math.min(index, 8) * 45}ms` } as CSSProperties
            }
          >
            <ChefCard chef={chef} />
          </div>
        ))}
      </div>
    </div>
  );
}
